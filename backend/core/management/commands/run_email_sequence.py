from django.core.management.base import BaseCommand
from django.utils import timezone
from core.models import Prospect, EmailSequenceStep, EmailLog
from django.core.mail import get_connection, EmailMultiAlternatives
from django.conf import settings
import uuid

class Command(BaseCommand):
    help = "Run the automated email sequence for all prospects based on days since registration"

    def _render_template(self, text, prospect):
        if not text:
            return ""
        
        prenom = prospect.first_name or ""
        nom = prospect.last_name or ""
        email = prospect.email or ""
        telephone = prospect.phone or ""
        
        text = text.replace("{{prenom}}", prenom)
        text = text.replace("{{nom}}", nom)
        text = text.replace("{{email}}", email)
        text = text.replace("{{telephone}}", telephone)
        
        return text

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("Starting email sequence processor..."))
        
        today = timezone.now().date()
        steps = list(EmailSequenceStep.objects.all())
        
        if not steps:
            self.stdout.write(self.style.WARNING("No sequence steps defined. Exiting."))
            return

        prospects = Prospect.objects.exclude(email__isnull=True).exclude(email__exact='')
        messages = []
        logs_to_create = []
        
        backend_url = getattr(settings, 'BACKEND_URL', 'http://localhost:8000')

        for prospect in prospects:
            # Calculate days since creation
            days_since_creation = (today - prospect.created_at.date()).days
            
            # Find the step matching this day
            matching_step = next((step for step in steps if step.day == days_since_creation), None)
            
            if matching_step:
                # Check if we already sent this sequence email
                # We identify it by type='automated' and subject matching the step
                rendered_subject = self._render_template(matching_step.subject, prospect)
                already_sent = EmailLog.objects.filter(
                    prospect=prospect,
                    type='automated',
                    subject=rendered_subject
                ).exists()

                if not already_sent:
                    # Prepare email
                    rendered_body = self._render_template(matching_step.body, prospect)
                    tracking_id = uuid.uuid4()
                    pixel_url = f"{backend_url}/api/emails/track/{tracking_id}/"
                    html_content = f"{rendered_body}<br><img src='{pixel_url}' width='1' height='1' />"

                    email_msg = EmailMultiAlternatives(
                        subject=rendered_subject,
                        body=rendered_body,
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        to=[prospect.email]
                    )
                    email_msg.attach_alternative(html_content, "text/html")
                    messages.append(email_msg)
                    
                    logs_to_create.append(
                        EmailLog(
                            prospect=prospect,
                            subject=rendered_subject,
                            body=rendered_body,
                            type='automated',
                            tracking_id=tracking_id
                        )
                    )
                    
                    self.stdout.write(f"Prepared '{matching_step.title}' (Day {matching_step.day}) for {prospect.email}")

        if messages:
            try:
                connection = get_connection()
                connection.send_messages(messages)
                # Bulk create logs only if emails are successfully sent
                EmailLog.objects.bulk_create(logs_to_create)
                self.stdout.write(self.style.SUCCESS(f"Successfully sent {len(messages)} automated emails."))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Failed to send emails: {str(e)}"))
        else:
            self.stdout.write(self.style.SUCCESS("No automated emails to send today."))
