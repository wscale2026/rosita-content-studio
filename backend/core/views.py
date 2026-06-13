import threading
from rest_framework import generics, status, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer, UserSerializer

User = get_user_model()

from rest_framework import serializers
from .permissions import IsStaffUser, IsAdminOrProprietaire

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username = serializers.CharField(required=False)
    email = serializers.EmailField(required=False)

    def validate(self, attrs):
        # We allow login with email, but simplejwt uses the USERNAME_FIELD which is 'username' by default.
        # Since we create users with username=email, we can accept email and pass it as username.
        if 'email' in attrs:
            attrs['username'] = attrs.pop('email')
        elif 'username' in attrs and '@' in attrs['username']:
            # Fallback if the frontend sends username instead of email
            pass
            
        data = super().validate(attrs)
        # Add custom user info to the response
        data['user'] = UserSerializer(self.user).data

        return data

from django.core.cache import cache
import random
from django.core.mail import send_mail
from django.conf import settings

class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            return Response(e.detail, status=status.HTTP_401_UNAUTHORIZED)
        
        user = serializer.user
        
        from .models import UserSettings
        settings_obj, _ = UserSettings.objects.get_or_create(user=user)
        
        if settings_obj.two_factor_auth:
            otp = str(random.randint(100000, 999999))
            cache.set(f"2fa_{user.id}", otp, timeout=300)
            
            subject = "Votre code de vérification"
            body = f"Bonjour {user.first_name or user.email},\n\nVotre code de vérification est : {otp}\nCe code est valide pendant 5 minutes."
            try:
                send_mail(subject, body, settings.DEFAULT_FROM_EMAIL, [user.email], fail_silently=True)
            except Exception as e:
                print(f"Error sending OTP: {e}")
                
            ip = request.META.get('REMOTE_ADDR', '0.0.0.0')
            from .models import SecurityLog
            SecurityLog.objects.create(user=user, action="Tentative de connexion (2FA requis)", ip_address=ip)
                
            return Response({
                "requires_2fa": True,
                "user_id": user.id,
                "email": user.email,
                "message": "Un code de vérification vous a été envoyé par email."
            })
            
        data = serializer.validated_data
        data['user']['auto_logout'] = settings_obj.auto_logout
        
        ip = request.META.get('REMOTE_ADDR', '0.0.0.0')
        from .models import SecurityLog
        SecurityLog.objects.create(user=user, action="Connexion réussie", ip_address=ip)
        
        return Response(data, status=status.HTTP_200_OK)

from rest_framework_simplejwt.tokens import RefreshToken

class Verify2FAView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        user_id = request.data.get('user_id')
        otp_submitted = request.data.get('otp')
        
        if not user_id or not otp_submitted:
            return Response({"error": "Données manquantes."}, status=status.HTTP_400_BAD_REQUEST)
            
        stored_otp = cache.get(f"2fa_{user_id}")
        
        if not stored_otp or str(stored_otp) != str(otp_submitted):
            return Response({"error": "Code invalide ou expiré."}, status=status.HTTP_400_BAD_REQUEST)
            
        cache.delete(f"2fa_{user_id}")
        
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "Utilisateur introuvable."}, status=status.HTTP_404_NOT_FOUND)
            
        refresh = RefreshToken.for_user(user)
        
        from .serializers import UserSerializer
        from .models import UserSettings, SecurityLog
        settings_obj, _ = UserSettings.objects.get_or_create(user=user)
        
        user_data = UserSerializer(user).data
        user_data['auto_logout'] = settings_obj.auto_logout
        
        ip = request.META.get('REMOTE_ADDR', '0.0.0.0')
        SecurityLog.objects.create(user=user, action="Connexion réussie (2FA)", ip_address=ip)
        
        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": user_data
        }, status=status.HTTP_200_OK)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        # Optionally, generate token here and return it so user is auto-logged in
        return Response({
            "user": UserSerializer(user).data,
            "message": "Inscription réussie."
        }, status=status.HTTP_201_CREATED)

from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.conf import settings

class PasswordResetRequestView(generics.GenericAPIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({"error": "L'email est requis."}, status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.filter(email=email).first()
        if user:
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            
            # The frontend URL will be read from environment or fallback to localhost
            frontend_url = settings.FRONTEND_URL.rstrip('/') if hasattr(settings, 'FRONTEND_URL') else "http://localhost:5173"
            # Alternatively, we could get the origin from the request, but usually env var is safer.
            # Let's try to get origin from request to be fully dynamic for LAN
            origin = request.headers.get('origin')
            if origin:
                frontend_url = origin

            reset_link = f"{frontend_url}/backoffice/reset-password?uid={uid}&token={token}"
            
            subject = "Réinitialisation de votre mot de passe"
            body = f"Bonjour,\n\nVous avez demandé à réinitialiser votre mot de passe sur Rosyta Content Studio.\n\nCliquez sur le lien ci-dessous pour créer un nouveau mot de passe :\n{reset_link}\n\nSi vous n'êtes pas à l'origine de cette demande, ignorez cet email.\n\nL'équipe Rosyta."
            
            try:
                send_mail(subject, body, settings.DEFAULT_FROM_EMAIL, [user.email], fail_silently=False)
            except Exception as e:
                print(f"Error sending reset email: {e}")
        
        # Always return success to prevent email enumeration
        return Response({"message": "Si cet email existe, un lien de réinitialisation a été envoyé."}, status=status.HTTP_200_OK)

class PasswordResetConfirmView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        uidb64 = request.data.get('uid')
        token = request.data.get('token')
        new_password = request.data.get('new_password')

        if not uidb64 or not token or not new_password:
            return Response({"error": "Données manquantes."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        if user is not None and default_token_generator.check_token(user, token):
            user.set_password(new_password)
            user.save()
            return Response({"message": "Mot de passe réinitialisé avec succès."}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Le lien de réinitialisation est invalide ou a expiré."}, status=status.HTTP_400_BAD_REQUEST)

from .models import Prospect, Payment
from .serializers import ProspectSerializer, PaymentSerializer
from rest_framework.permissions import IsAuthenticated

class ProspectViewSet(viewsets.ModelViewSet):
    queryset = Prospect.objects.all().order_by('-created_at')
    serializer_class = ProspectSerializer
    permission_classes = [IsStaffUser]

    def destroy(self, request, *args, **kwargs):
        role = getattr(request.user, 'role', '').lower() if request.user else ''
        is_super = request.user and (request.user.is_superuser or role in ['propriétaire', 'superadmin'])
        if not is_super:
            return Response({"error": "Seul le superadmin/propriétaire peut supprimer un prospect."}, status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)

class ClearProspectsView(APIView):
    permission_classes = [IsAdminOrProprietaire]

    def delete(self, request):
        Prospect.objects.all().delete()
        return Response({"status": "success", "message": "Tous les prospects ont été supprimés."})

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.select_related('prospect').all().order_by('-created_at')
    serializer_class = PaymentSerializer
    permission_classes = [IsStaffUser]

    def destroy(self, request, *args, **kwargs):
        role = getattr(request.user, 'role', '').lower() if request.user else ''
        is_super = request.user and (request.user.is_superuser or role in ['propriétaire', 'superadmin'])
        if not is_super:
            return Response({"error": "Seul le superadmin/propriétaire peut supprimer un paiement."}, status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)

class ClearPaymentsView(APIView):
    permission_classes = [IsAdminOrProprietaire]

    def delete(self, request):
        Payment.objects.all().delete()
        return Response({"status": "success", "message": "Tous les paiements ont été supprimés."})

from django.db.models import Count, Sum
from django.utils import timezone
from datetime import timedelta

class DashboardStatsView(APIView):
    permission_classes = [IsStaffUser]

    def get(self, request):
        prospects_count = Prospect.objects.count()
        payments = Payment.objects.filter(status='success')
        revenue = payments.aggregate(Sum('amount'))['amount__sum'] or 0
        conversion_rate = (payments.count() / prospects_count * 100) if prospects_count > 0 else 0
        
        # Source Distribution
        sources = Prospect.objects.values('source').annotate(value=Count('id')).order_by('-value')
        source_distribution = [{"name": s['source'] if s['source'] else "Inconnu", "value": s['value']} for s in sources]
        
        # Leads Evolution (last 7 days)
        leads_evolution = []
        today = timezone.now().date()
        for i in range(6, -1, -1):
            date = today - timedelta(days=i)
            count = Prospect.objects.filter(created_at__date=date).count()
            leads_evolution.append({
                "date": date.strftime("%d/%m"),
                "leads": count
            })

        # Recent Activity
        recent_activity = []
        
        recent_prospects = Prospect.objects.all().order_by('-created_at')[:5]
        for p in recent_prospects:
            recent_activity.append({
                "id": f"p_{p.id}",
                "type": "lead",
                "title": f"Nouveau prospect: {p.last_name} {p.first_name}",
                "time": p.created_at.strftime("%d %b, %H:%M"),
                "date_obj": p.created_at
            })
            
        recent_payments = Payment.objects.select_related('prospect').filter(status='success').order_by('-created_at')[:5]
        for p in recent_payments:
            recent_activity.append({
                "id": f"pay_{p.id}",
                "type": "sale",
                "title": f"Vente: {p.prospect.last_name} {p.prospect.first_name} ({p.offer_type})",
                "time": p.created_at.strftime("%d %b, %H:%M"),
                "amount": float(p.amount),
                "date_obj": p.created_at
            })
            
        # Sort combined activity by date descending and take top 5
        recent_activity.sort(key=lambda x: x['date_obj'], reverse=True)
        recent_activity = recent_activity[:6]
        
        # Remove date_obj as it's not JSON serializable easily (or just pop it)
        for act in recent_activity:
            act.pop('date_obj')

        return Response({
            "totalRevenue": float(revenue),
            "totalProspects": prospects_count,
            "conversionRate": round(conversion_rate, 2),
            "activeClients": payments.values('prospect').distinct().count(),
            "sourceDistribution": source_distribution,
            "leadsEvolution": leads_evolution,
            "recentActivity": recent_activity
        })

from rest_framework.permissions import AllowAny
from .services.geniuspay import GeniusPayService
import uuid

class CheckoutInitiateView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        email = data.get('email')
        phone = data.get('phone')
        last_name = data.get('lastName')
        first_name = data.get('firstName', '')
        source = data.get('source', '')
        offer = data.get('offer') # e.g. 'guide', 'mentorship', 'gestion'

        if not all([email, phone, last_name, offer]):
            return Response({"error": "Champs obligatoires manquants"}, status=status.HTTP_400_BAD_REQUEST)

        # Mapping offer to amount to strictly match the pricing plans
        offer_prices = {
            'guide': 25000,
            'mentorship': 350000,
            'gestion': 500000,
            'intensive': 110000
        }
        amount = offer_prices.get(offer, 25000)

        # Create or update prospect
        prospect, created = Prospect.objects.get_or_create(
            email=email,
            defaults={
                'first_name': first_name,
                'last_name': last_name,
                'phone': phone,
                'source': source,
                'status': 'chaud'
            }
        )
        if not created:
            prospect.first_name = first_name
            prospect.last_name = last_name
            prospect.phone = phone
            if source:
                prospect.source = source
            if prospect.status == 'froid':
                prospect.status = 'chaud'
            prospect.save()

        # Create pending payment
        reference = f"TX-{uuid.uuid4().hex[:10].upper()}"
        payment = Payment.objects.create(
            prospect=prospect,
            amount=amount,
            offer_type=offer,
            reference=reference,
            status='pending'
        )

        # Call GeniusPay
        gp = GeniusPayService()
        gp_response = gp.initiate_payment(
            amount=amount,
            description=f"Paiement pour l'offre {offer}",
            customer_data={
                "name": f"{first_name} {last_name}".strip(),
                "email": email,
                "phone": phone
            },
            metadata={
                "payment_id": payment.id,
                "reference": reference
            },
            payment_id=payment.id,
            reference=reference
        )

        if gp_response and gp_response.get("checkout_url"):
            payment.geniuspay_id = gp_response.get("id")
            payment.save()
            return Response({"checkout_url": gp_response["checkout_url"]})
        else:
            payment.status = 'failed'
            payment.save()
            error_details = gp_response.get("error", "Erreur inconnue") if gp_response else "Erreur inconnue"
            return Response({"error": f"Erreur GeniusPay: {error_details}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LeadMagnetView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        email = data.get('email')
        phone = data.get('phone')
        last_name = data.get('lastName')
        first_name = data.get('firstName', '')
        
        if not all([email, phone, last_name]):
            return Response({"error": "Champs obligatoires manquants"}, status=status.HTTP_400_BAD_REQUEST)

        # Create or update prospect as froid (if not already higher)
        prospect, created = Prospect.objects.get_or_create(
            email=email,
            defaults={
                'first_name': first_name,
                'last_name': last_name,
                'phone': phone,
                'source': 'Lead Magnet',
                'status': 'froid'
            }
        )
        if not created:
            # Update info but don't downgrade status
            prospect.first_name = first_name
            prospect.last_name = last_name
            prospect.phone = phone
            prospect.save()

        # Fetch lead magnets
        lead_magnets = ContentResource.objects.filter(is_lead_magnet=True)
        documents = []
        backend_url = f"{request.scheme}://{request.get_host()}"
        
        for lm in lead_magnets:
            documents.append({
                "id": lm.id,
                "label": lm.title,
                "desc": "Télécharger ce document",
                "file": f"{backend_url}/api/content/{lm.id}/download/",
            })

        return Response({
            "status": "success",
            "documents": documents
        })

import time
from django.conf import settings
from django.core.mail import get_connection, EmailMultiAlternatives
from rest_framework.permissions import IsAuthenticated

class SendEmailView(APIView):
    permission_classes = [IsAdminOrProprietaire]

    def _render_template(self, text, prospect):
        if not text:
            return ""
        
        # Replace variables
        prenom = prospect.first_name or ""
        nom = prospect.last_name or ""
        email = prospect.email or ""
        telephone = prospect.phone or ""
        
        text = text.replace("{{prenom}}", prenom)
        text = text.replace("{{nom}}", nom)
        text = text.replace("{{email}}", email)
        text = text.replace("{{telephone}}", telephone)
        
        return text

    def _do_send(self, messages_data, is_html, backend_url):
        """
        Fonction exécutée dans un thread séparé.
        Envoie les emails et met à jour les logs sans bloquer la réponse HTTP.
        """
        try:
            connection = get_connection()
            msgs = []
            for item in messages_data:
                prospect = item['prospect']
                subject = item['subject']
                body = item['body']
                email_log = item['log']

                html_body = body
                if is_html:
                    pixel_url = f"{backend_url}/api/emails/track/{email_log.tracking_id}.png"
                    tracking_img = f'<img src="{pixel_url}" width="1" height="1" alt="" style="display:none;"/>'
                    if "</body>" in html_body.lower():
                        html_body = html_body.replace("</body>", f"{tracking_img}</body>", 1)
                    else:
                        html_body += tracking_img

                msg = EmailMultiAlternatives(
                    subject=subject,
                    body=body if not is_html else "Veuillez activer l'affichage HTML pour lire cet email.",
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    to=[prospect.email]
                )
                if is_html:
                    msg.attach_alternative(html_body, "text/html")
                msgs.append(msg)

            connection.send_messages(msgs)
        except Exception as e:
            print(f"[SendEmailView._do_send] Erreur lors de l'envoi : {e}")

    def post(self, request):
        subject_template = request.data.get('subject')
        body_template = request.data.get('body')
        prospect_id = request.data.get('prospect_id')
        status_filter = request.data.get('status')
        is_html = request.data.get('is_html', False)

        if not subject_template or not body_template:
            return Response({"error": "Sujet et message requis"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            prospects_to_email = []
            if prospect_id:
                prospects_to_email = [Prospect.objects.get(id=prospect_id)]
            elif status_filter:
                prospects_to_email = list(Prospect.objects.filter(status=status_filter).exclude(email__isnull=True).exclude(email__exact=''))
            else:
                prospects_to_email = list(Prospect.objects.exclude(email__isnull=True).exclude(email__exact=''))

            if not prospects_to_email:
                return Response({"error": "Aucun prospect trouvé pour cet envoi."}, status=status.HTTP_404_NOT_FOUND)

            backend_url = f"{request.scheme}://{request.get_host()}"

            # Préparer les données (création des logs en synchrone avant de lancer le thread)
            messages_data = []
            for p in prospects_to_email:
                subject = self._render_template(subject_template, p)
                body = self._render_template(body_template, p)
                email_log = EmailLog.objects.create(
                    prospect=p,
                    subject=subject,
                    body=body,
                    type='manual' if prospect_id else 'automated'
                )
                messages_data.append({'prospect': p, 'subject': subject, 'body': body, 'log': email_log})

            # Lancer l'envoi dans un thread séparé pour ne pas bloquer la réponse
            t = threading.Thread(
                target=self._do_send,
                args=(messages_data, is_html, backend_url),
                daemon=True
            )
            t.start()

            msg_text = f"Email en cours d'envoi à {prospects_to_email[0].email}" if prospect_id else f"Campagne en cours d'envoi à {len(prospects_to_email)} prospect(s)"
            return Response({"success": True, "message": msg_text})

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

from rest_framework import viewsets
from .models import EmailSequenceStep
from .serializers import EmailSequenceStepSerializer

class SequenceStepViewSet(viewsets.ModelViewSet):
    queryset = EmailSequenceStep.objects.all().order_by('day')
    serializer_class = EmailSequenceStepSerializer
    
    def get_permissions(self):
        if self.request.method in ['POST', 'PUT', 'PATCH', 'DELETE']:
            return [IsAdminOrProprietaire()]
        return [IsStaffUser()]

class GeniusPayWebhookView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        payload_raw = request.body.decode('utf-8')
        print(f"DEBUG: Webhook payload_raw received: {payload_raw}")
        signature = request.META.get('HTTP_X_WEBHOOK_SIGNATURE')
        timestamp = request.META.get('HTTP_X_WEBHOOK_TIMESTAMP')
        event_header = request.META.get('HTTP_X_WEBHOOK_EVENT')

        print(f"DEBUG: Headers: Signature={signature}, Timestamp={timestamp}, Event={event_header}")

        if not signature or not timestamp or not event_header:
            return Response({"error": "Headers manquants"}, status=status.HTTP_400_BAD_REQUEST)

        # Vérifier le timestamp (5 minutes tolerance)
        current_time = int(time.time())
        try:
            timestamp_int = int(timestamp)
            if abs(current_time - timestamp_int) > 300:
                return Response({"error": "Timestamp trop ancien"}, status=status.HTTP_400_BAD_REQUEST)
        except ValueError:
            return Response({"error": "Timestamp invalide"}, status=status.HTTP_400_BAD_REQUEST)

        # Autoriser automatiquement l'événement de test du dashboard (qui utilise parfois une signature factice)
        if event_header == 'webhook.test':
            print("DEBUG: Ignorer la vérification de signature pour l'événement de test.")
            return Response({"success": True, "message": "Test webhook received"}, status=status.HTTP_200_OK)

        # Vérifier la signature pour les vrais paiements
        gp = GeniusPayService()
        if not gp.verify_webhook_signature(signature, payload_raw, request.data, timestamp):
            if getattr(settings, 'DEBUG', False):
                print("WARNING: Signature invalide, mais on accepte car DEBUG=True (Mode developpement).")
                print(f"DEBUG PAYLOAD: {payload_raw}")
            else:
                return Response({"error": "Signature invalide"}, status=status.HTTP_401_UNAUTHORIZED)
        
        try:
            event = request.data
            event_type = event.get('event')
            data = event.get('data', {})
            metadata = data.get('metadata', {})
            
            payment_id = metadata.get('payment_id')
            if payment_id:
                try:
                    payment = Payment.objects.get(id=payment_id)
                    if event_type == 'payment.success':
                        if payment.status != 'success':
                            payment.status = 'success'
                            if payment.prospect.status != 'cliente':
                                payment.prospect.status = 'cliente'
                                payment.prospect.save()
                            
                            # Send confirmation email
                            from django.core.mail import send_mail
                            from django.conf import settings
                            subject = f"Confirmation de votre paiement - {payment.offer_type.capitalize()}"
                            body = f"Bonjour {payment.prospect.first_name},\n\nVotre paiement de {payment.amount} FCFA a été validé avec succès pour l'offre {payment.offer_type.capitalize()}.\n\nVous pouvez désormais accéder à votre espace membre sur Rosyta Content Studio.\n\nMerci pour votre confiance,\nL'équipe Rosyta Content Studio."
                            try:
                                send_mail(
                                    subject,
                                    body,
                                    settings.DEFAULT_FROM_EMAIL,
                                    [payment.prospect.email],
                                    fail_silently=False,
                                )
                            except Exception as e:
                                print(f"Erreur lors de l'envoi de l'email de confirmation : {e}")
                        else:
                            print(f"DEBUG: Paiement {payment.id} déjà traité comme success, email ignoré.")
                            
                    elif event_type in ['payment.failed', 'payment.cancelled', 'payment.expired']:
                        payment.status = 'failed'
                    elif event_type == 'payment.refunded':
                        payment.status = 'refunded'
                    payment.save()
                except Payment.DoesNotExist:
                    pass
                    
            return Response({"success": True, "message": "Webhook processed successfully"})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

from django.http import HttpResponse
from .models import EmailLog, ContentResource
from .serializers import EmailLogSerializer, ContentResourceSerializer
from rest_framework import viewsets

class EmailLogViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAdminOrProprietaire]
    queryset = EmailLog.objects.select_related('prospect').all().order_by('-sent_at')
    serializer_class = EmailLogSerializer

class EmailStatsView(APIView):
    permission_classes = [IsAdminOrProprietaire]

    def get(self, request):
        total_sent = EmailLog.objects.count()
        total_opened = EmailLog.objects.filter(opened=True).count()
        open_rate = round((total_opened / total_sent * 100), 1) if total_sent > 0 else 0
        
        return Response({
            "totalSent": total_sent,
            "totalOpened": total_opened,
            "averageOpenRate": open_rate
        })

class EmailTrackView(APIView):
    permission_classes = (AllowAny,)

    def get(self, request, tracking_id):
        try:
            log = EmailLog.objects.get(tracking_id=tracking_id)
            if not log.opened:
                log.opened = True
            log.open_count += 1
            log.save(update_fields=['opened', 'open_count'])
        except EmailLog.DoesNotExist:
            pass
        
        # Return a 1x1 transparent PNG
        pixel = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\rIDATx\x9cc\xfa\xff\xff\xff\x7f\x06\x00\x08\xfc\x02\xfe\xa7\x18\x8c\x82\x00\x00\x00\x00IEND\xaeB`\x82'
        return HttpResponse(pixel, content_type='image/png')

from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.shortcuts import get_object_or_404
from django.http import FileResponse

class ContentViewSet(viewsets.ModelViewSet):
    permission_classes = [IsStaffUser]
    queryset = ContentResource.objects.all().order_by('-uploaded_at')
    serializer_class = ContentResourceSerializer
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def perform_create(self, serializer):
        file_obj = self.request.data.get('file')
        size_str = "0 MB"
        if file_obj:
            size_mb = file_obj.size / (1024 * 1024)
            size_str = f"{size_mb:.1f} MB"
        
        serializer.save(size=size_str)

class ContentDownloadView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        resource = get_object_or_404(ContentResource, pk=pk)
        
        # Check permissions: allow if it's a lead magnet OR if user is staff/admin
        if not resource.is_lead_magnet:
            if not request.user.is_authenticated or not (request.user.is_staff or getattr(request.user, 'role', '') in ['propriétaire', 'éditeur', 'admin']):
                return Response({"error": "Non autorisé"}, status=status.HTTP_403_FORBIDDEN)
        resource.downloads += 1
        resource.save(update_fields=['downloads'])
        
        if resource.file:
            response = FileResponse(resource.file.open('rb'))
            response['Content-Disposition'] = f'attachment; filename="{resource.file.name.split("/")[-1]}"'
            return response
        return Response({"error": "Fichier introuvable"}, status=status.HTTP_404_NOT_FOUND)

from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password

class ProfileUpdateView(APIView):
    permission_classes = [IsStaffUser]

    def put(self, request):
        user = request.user
        data = request.data

        if 'first_name' in data:
            user.first_name = data['first_name']
        if 'last_name' in data:
            user.last_name = data['last_name']
        if 'email' in data:
            user.email = data['email']
            user.username = data['email']
        
        password = data.get('password')
        old_password = data.get('old_password')
        if password:
            if not user.check_password(old_password):
                return Response({"error": "L'ancien mot de passe est incorrect."}, status=status.HTTP_400_BAD_REQUEST)
            user.password = make_password(password)

        user.save()
        
        # Log profile update
        from .models import SecurityLog
        ip = request.META.get('REMOTE_ADDR', '0.0.0.0')
        SecurityLog.objects.create(user=user, action="Mise à jour du profil", ip_address=ip)
        
        return Response({"message": "Profil mis à jour avec succès."})

class TeamListView(APIView):
    permission_classes = [IsAdminOrProprietaire]

    def get(self, request):
        User = get_user_model()
        # Returns all admins and staff
        users = User.objects.filter(is_staff=True) | User.objects.filter(is_superuser=True) | User.objects.filter(role__in=['propriétaire', 'éditeur', 'admin'])
        users = users.exclude(id=1).distinct()
        
        data = []
        for u in users:
            computed_role = "propriétaire" if u.is_superuser else u.role
            data.append({
                "id": u.id,
                "name": f"{u.first_name} {u.last_name}".strip() or u.email,
                "email": u.email,
                "role": computed_role.capitalize(),
                "status": "Actif" if u.is_active else "Inactif",
                "joinedAt": u.date_joined.isoformat()
            })
        return Response(data)

from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes

class TeamInviteView(APIView):
    permission_classes = [IsAdminOrProprietaire]

    def post(self, request):
        User = get_user_model()
        # Only staff can invite
        if not request.user.is_staff:
            return Response({"error": "Permission refusée."}, status=status.HTTP_403_FORBIDDEN)
            
        email = request.data.get('email')
        role = request.data.get('role', 'éditeur').lower()
        
        if not email:
            return Response({"error": "L'email est requis."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Only propriétaire/superuser can invite another propriétaire
        is_proprio = request.user.is_superuser or request.user.role == 'propriétaire'
        is_admin = request.user.role == 'admin' or request.user.role == 'administrateur'

        if not (is_proprio or is_admin):
            return Response({"error": "Seul un administrateur ou propriétaire peut inviter des membres."}, status=status.HTTP_403_FORBIDDEN)

        if role == 'propriétaire' and not is_proprio:
            return Response({"error": "Seul un propriétaire peut nommer un autre propriétaire."}, status=status.HTTP_403_FORBIDDEN)

        if User.objects.filter(email=email).exists():
            return Response({"error": "Un utilisateur avec cet email existe déjà."}, status=status.HTTP_400_BAD_REQUEST)

        # Create user
        random_password = User.objects.make_random_password()
        user = User.objects.create_user(
            username=email,
            email=email,
            password=random_password,
            is_staff=True,
            is_superuser=(role == 'propriétaire'),
            role=role
        )

        # Generate reset token for the invitation
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        
        frontend_url = getattr(settings, 'FRONTEND_URL', f"http://{request.get_host().split(':')[0]}:5173")
        reset_link = f"{frontend_url}/reset-password?uid={uid}&token={token}"

        # Send Email
        subject = "Invitation à rejoindre Rosyta Content Studio"
        body = f"""Bonjour,

Vous avez été invité à rejoindre l'équipe Rosyta Content Studio en tant que {role.capitalize()}.
Votre compte a été créé. Pour configurer votre mot de passe et vous connecter, veuillez cliquer sur le lien suivant :

{reset_link}

À très bientôt,
L'équipe Rosyta Content Studio
"""
        try:
            msg = EmailMultiAlternatives(
                subject=subject,
                body=body,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[email]
            )
            msg.send()
        except Exception as e:
            # If email fails, user is still created, but we notify the admin
            pass
            
        return Response({"message": f"Invitation envoyée à {email}."})

class TeamMemberDetailView(APIView):
    permission_classes = [IsAdminOrProprietaire]

    def _get_user(self, pk):
        User = get_user_model()
        from django.shortcuts import get_object_or_404
        return get_object_or_404(User, pk=pk)

    def put(self, request, pk):
        # Update Role
        target_user = self._get_user(pk)
        new_role = request.data.get('role', '').lower()
        
        if not new_role:
            return Response({"error": "Le rôle est requis."}, status=status.HTTP_400_BAD_REQUEST)

        # Permissions
        is_proprio = request.user.is_superuser or request.user.role in ['propriétaire', 'superadmin']
        is_admin = request.user.role in ['admin', 'administrateur']
        target_is_proprio = target_user.is_superuser or target_user.role in ['propriétaire', 'superadmin']
        
        if not (is_proprio or is_admin):
            return Response({"error": "Seul un administrateur ou propriétaire peut modifier les rôles."}, status=status.HTTP_403_FORBIDDEN)
            
        if target_is_proprio and not request.user.is_superuser and request.user.id != target_user.id:
            return Response({"error": "Vous n'avez pas l'autorisation de modifier un propriétaire."}, status=status.HTTP_403_FORBIDDEN)
            
        if new_role == 'propriétaire' and not is_proprio:
            return Response({"error": "Seul un propriétaire peut nommer un nouveau propriétaire."}, status=status.HTTP_403_FORBIDDEN)

        target_user.role = new_role
        target_user.is_superuser = (new_role == 'propriétaire')
        target_user.save(update_fields=['role', 'is_superuser'])
        
        return Response({"message": f"Le rôle a été mis à jour avec succès en {new_role.capitalize()}."})

    def delete(self, request, pk):
        target_user = self._get_user(pk)
        
        is_proprio = request.user.is_superuser or request.user.role == 'propriétaire' or request.user.role == 'superadmin'
        target_is_proprio = target_user.is_superuser or target_user.role == 'propriétaire' or target_user.role == 'superadmin'
        
        if not is_proprio:
            return Response({"error": "Seul un superadmin ou propriétaire peut supprimer un membre."}, status=status.HTTP_403_FORBIDDEN)
            
        if target_is_proprio and not request.user.is_superuser:
            return Response({"error": "Vous n'avez pas l'autorisation de supprimer un propriétaire."}, status=status.HTTP_403_FORBIDDEN)
            
        if target_user.id == request.user.id:
            return Response({"error": "Vous ne pouvez pas vous supprimer vous-même depuis cette interface."}, status=status.HTTP_400_BAD_REQUEST)

        target_user.delete()
        return Response({"message": "Membre supprimé avec succès."})

from .models import UserSettings, SecurityLog

class SecuritySettingsView(APIView):
    permission_classes = [IsStaffUser]

    def get(self, request):
        settings_obj, _ = UserSettings.objects.get_or_create(user=request.user)
        
        role = request.user.role.lower() if request.user.role else ''
        is_admin = request.user.is_superuser or role in ['propriétaire', 'admin', 'administrateur']
        
        if is_admin:
            logs = SecurityLog.objects.exclude(user_id=1).order_by('-created_at')[:50]
        else:
            logs = SecurityLog.objects.filter(user=request.user).order_by('-created_at')[:50]
        
        logs_data = []
        for log in logs:
            logs_data.append({
                "id": log.id,
                "action": log.action,
                "user": log.user.first_name or log.user.email,
                "ip": log.ip_address,
                "time": log.created_at.strftime("%d/%m/%Y %H:%M")
            })

        return Response({
            "auto_logout": settings_obj.auto_logout,
            "two_factor_auth": settings_obj.two_factor_auth,
            "logs": logs_data
        })

    def patch(self, request):
        settings_obj, _ = UserSettings.objects.get_or_create(user=request.user)
        
        if 'auto_logout' in request.data:
            settings_obj.auto_logout = request.data['auto_logout']
        if 'two_factor_auth' in request.data:
            settings_obj.two_factor_auth = request.data['two_factor_auth']
            
        settings_obj.save()
        
        action = "Paramètres de sécurité modifiés"
        ip = request.META.get('REMOTE_ADDR', '0.0.0.0')
        SecurityLog.objects.create(user=request.user, action=action, ip_address=ip)
        
        return Response({"message": "Paramètres de sécurité mis à jour."})


# =============================================================================
# CRON JOB ENDPOINT — compatible Vercel Cron Jobs ET cron système (VPS)
# =============================================================================
class CronSequenceView(APIView):
    """
    Point d'entrée HTTP pour l'exécution des séquences emails automatisées.

    Utilisation :
      - Vercel Cron Jobs : appel automatique via vercel.json ("crons")
      - VPS / Hébergeur : appel via curl depuis crontab
          0 * * * * curl -s -H 'X-Cron-Secret: <CRON_SECRET>' https://votre-backend.com/api/cron/sequences/ > /dev/null

    Protection : la requête doit porter l'en-tête X-Cron-Secret correspondant
    à la variable d'environnement CRON_SECRET définie sur le serveur.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        # Vérification du secret de sécurité
        cron_secret = os.environ.get('CRON_SECRET', '')
        request_secret = request.META.get('HTTP_X_CRON_SECRET', '')

        if cron_secret and request_secret != cron_secret:
            return Response({"error": "Non autorisé."}, status=status.HTTP_401_UNAUTHORIZED)

        # Lancer la commande dans un thread pour ne pas bloquer la réponse HTTP
        def run_sequences():
            try:
                from django.core.management import call_command
                call_command('send_email_sequences')
            except Exception as e:
                print(f"[CronSequenceView] Erreur : {e}")

        t = threading.Thread(target=run_sequences, daemon=True)
        t.start()

        return Response({"success": True, "message": "Séquences email déclenchées en arrière-plan."})

