from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    phone = models.CharField(max_length=20, blank=True, null=True)
    role = models.CharField(max_length=50, default='client')
    
    def __str__(self):
        return self.email or self.username

class Prospect(models.Model):
    STATUS_CHOICES = (
        ('froid', 'Froid'),
        ('chaud', 'Chaud'),
        ('cliente', 'Cliente'),
    )
    first_name = models.CharField(max_length=150, blank=True, null=True)
    last_name = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    source = models.CharField(max_length=100, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='froid')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})"

class Payment(models.Model):
    STATUS_CHOICES = (
        ('pending', 'En attente'),
        ('success', 'Réussi'),
        ('failed', 'Échoué'),
    )
    OFFER_CHOICES = (
        ('guide', 'Guide Complet'),
        ('mentorship', 'VIP Mentorship'),
        ('gestion', 'Gestion 100%'),
    )
    prospect = models.ForeignKey(Prospect, on_delete=models.CASCADE, null=True, blank=True, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10, default='XAF')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    offer_type = models.CharField(max_length=50, choices=OFFER_CHOICES)
    reference = models.CharField(max_length=100, unique=True)
    geniuspay_id = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment {self.reference} - {self.amount} {self.currency}"

import uuid

class EmailLog(models.Model):
    TYPE_CHOICES = (
        ('automated', 'Automatisé'),
        ('manual', 'Manuel'),
    )
    prospect = models.ForeignKey(Prospect, on_delete=models.CASCADE, null=True, blank=True, related_name='email_logs')
    subject = models.CharField(max_length=255)
    body = models.TextField()
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='manual')
    tracking_id = models.UUIDField(default=uuid.uuid4, unique=True)
    opened = models.BooleanField(default=False)
    open_count = models.IntegerField(default=0)
    sent_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.subject} to {self.prospect}"

class EmailSequenceStep(models.Model):
    day = models.IntegerField(unique=True, help_text="Jour d'envoi après l'inscription (ex: 1, 3, 7)")
    title = models.CharField(max_length=255, help_text="Titre interne (ex: Bienvenue)")
    subject = models.CharField(max_length=255, help_text="Sujet de l'email envoyé au prospect")
    body = models.TextField(help_text="Contenu de l'email")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Jour {self.day} - {self.title}"

class ContentResource(models.Model):
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to='resources/')
    size = models.CharField(max_length=50, blank=True, null=True)
    downloads = models.IntegerField(default=0)
    is_lead_magnet = models.BooleanField(default=False)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class UserSettings(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='settings')
    auto_logout = models.BooleanField(default=True)
    two_factor_auth = models.BooleanField(default=False)

    def __str__(self):
        return f"Settings for {self.user.email}"

class SecurityLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='security_logs')
    action = models.CharField(max_length=255)
    ip_address = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.action} by {self.user.email}"
