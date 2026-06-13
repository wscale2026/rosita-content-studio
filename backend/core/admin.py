from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Prospect, Payment, EmailLog, ContentResource

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('Informations Supplémentaires', {'fields': ('phone', 'role')}),
    )
    list_display = ('username', 'email', 'first_name', 'last_name', 'role', 'is_staff')
    list_filter = ('role', 'is_staff', 'is_superuser', 'is_active')

@admin.register(Prospect)
class ProspectAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'email', 'phone', 'status', 'created_at')
    list_filter = ('status', 'source', 'created_at')
    search_fields = ('first_name', 'last_name', 'email', 'phone')

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('reference', 'prospect', 'amount', 'currency', 'offer_type', 'status', 'created_at')
    list_filter = ('status', 'offer_type', 'created_at')
    search_fields = ('reference', 'geniuspay_id', 'prospect__email', 'prospect__last_name')

@admin.register(EmailLog)
class EmailLogAdmin(admin.ModelAdmin):
    list_display = ('subject', 'prospect', 'type', 'opened', 'sent_at')
    list_filter = ('type', 'opened', 'sent_at')
    search_fields = ('subject', 'body', 'prospect__email')

@admin.register(ContentResource)
class ContentResourceAdmin(admin.ModelAdmin):
    list_display = ('title', 'size', 'downloads', 'uploaded_at')
    search_fields = ('title',)
