"""
Management command: send_email_sequences

Exécute les séquences d'emails automatisés pour tous les prospects éligibles.
Usage:
  python manage.py send_email_sequences

À appeler :
  - Sur VPS/hébergeur : via un cron système (ex: chaque heure)
      0 * * * * /path/to/venv/bin/python /path/to/manage.py send_email_sequences
  - Sur Vercel : via un Vercel Cron Job qui appelle l'endpoint /api/cron/sequences/
"""

from django.core.management.base import BaseCommand
from django.core.mail import EmailMultiAlternatives, get_connection
from django.conf import settings
from django.utils import timezone
from datetime import timedelta

from core.models import Prospect, EmailLog, EmailSequenceStep


class Command(BaseCommand):
    help = "Envoie les emails de séquence automatique aux prospects éligibles."

    def _render(self, text: str, prospect) -> str:
        """Remplace les variables dans le template."""
        replacements = {
            "{{prenom}}": prospect.first_name or "",
            "{{nom}}": prospect.last_name or "",
            "{{email}}": prospect.email or "",
            "{{telephone}}": prospect.phone or "",
        }
        for key, val in replacements.items():
            text = text.replace(key, val)
        return text

    def handle(self, *args, **options):
        steps = EmailSequenceStep.objects.all().order_by("day")
        if not steps.exists():
            self.stdout.write("Aucune étape de séquence configurée.")
            return

        now = timezone.now()
        sent_total = 0
        skipped_total = 0

        for step in steps:
            # Les prospects inscrits depuis exactement `step.day` jours (±1h de tolérance)
            target_date_start = now - timedelta(days=step.day, hours=1)
            target_date_end = now - timedelta(days=step.day - 1)

            eligible_prospects = Prospect.objects.filter(
                created_at__gte=target_date_start,
                created_at__lt=target_date_end,
            ).exclude(email__isnull=True).exclude(email__exact="")

            if not eligible_prospects.exists():
                continue

            connection = get_connection()
            messages = []

            for prospect in eligible_prospects:
                # Éviter le double envoi : vérifier si cet email a déjà été envoyé
                already_sent = EmailLog.objects.filter(
                    prospect=prospect,
                    subject=self._render(step.subject, prospect),
                    type="automated",
                ).exists()

                if already_sent:
                    skipped_total += 1
                    continue

                subject = self._render(step.subject, prospect)
                body = self._render(step.body, prospect)

                log = EmailLog.objects.create(
                    prospect=prospect,
                    subject=subject,
                    body=body,
                    type="automated",
                )

                # Pixel de tracking
                backend_url = getattr(settings, "BACKEND_URL", "http://localhost:8000")
                pixel_url = f"{backend_url}/api/emails/track/{log.tracking_id}.png"
                tracking_img = f'<img src="{pixel_url}" width="1" height="1" alt="" style="display:none;"/>'

                html_body = body
                if "</body>" in html_body.lower():
                    html_body = html_body.replace("</body>", f"{tracking_img}</body>", 1)
                else:
                    html_body += tracking_img

                msg = EmailMultiAlternatives(
                    subject=subject,
                    body=body,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    to=[prospect.email],
                )
                msg.attach_alternative(html_body, "text/html")
                messages.append(msg)

            if messages:
                try:
                    connection.send_messages(messages)
                    sent_total += len(messages)
                    self.stdout.write(
                        self.style.SUCCESS(
                            f"  Étape Jour {step.day} : {len(messages)} email(s) envoyé(s)."
                        )
                    )
                except Exception as e:
                    self.stdout.write(
                        self.style.ERROR(f"  Erreur Jour {step.day} : {e}")
                    )

        self.stdout.write(
            self.style.SUCCESS(
                f"\nTerminé : {sent_total} email(s) envoyé(s), {skipped_total} ignoré(s) (déjà envoyés)."
            )
        )
