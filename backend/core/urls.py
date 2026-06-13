from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LoginView, RegisterView, PasswordResetRequestView, PasswordResetConfirmView, ProspectViewSet, PaymentViewSet, DashboardStatsView, CheckoutInitiateView, GeniusPayWebhookView, LeadMagnetView, ClearProspectsView, ClearPaymentsView, SendEmailView, EmailLogViewSet, EmailStatsView, EmailTrackView, ContentViewSet, ContentDownloadView, ProfileUpdateView, TeamListView, TeamInviteView, TeamMemberDetailView, SecuritySettingsView, SequenceStepViewSet, CronSequenceView, Verify2FAView

router = DefaultRouter()
router.register(r'prospects', ProspectViewSet)
router.register(r'payments', PaymentViewSet)
router.register(r'emails/history', EmailLogViewSet, basename='email-history')
router.register(r'emails/sequence', SequenceStepViewSet, basename='email-sequence')
router.register(r'content', ContentViewSet, basename='content')

urlpatterns = [
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/verify-2fa/', Verify2FAView.as_view(), name='verify_2fa'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/password-reset/', PasswordResetRequestView.as_view(), name='password_reset'),
    path('auth/password-reset-confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('auth/profile/', ProfileUpdateView.as_view(), name='profile_update'),
    path('auth/team/', TeamListView.as_view(), name='team_list'),
    path('auth/team/invite/', TeamInviteView.as_view(), name='team_invite'),
    path('auth/team/<int:pk>/', TeamMemberDetailView.as_view(), name='team_member_detail'),
    path('auth/security/', SecuritySettingsView.as_view(), name='security_settings'),
    path('dashboard/stats/', DashboardStatsView.as_view(), name='dashboard_stats'),
    path('emails/stats/', EmailStatsView.as_view(), name='email_stats'),
    path('emails/track/<uuid:tracking_id>.png', EmailTrackView.as_view(), name='email_track'),
    path('payments/initiate/', CheckoutInitiateView.as_view(), name='checkout_initiate'),
    path('payments/clear/', ClearPaymentsView.as_view(), name='clear_payments'),
    path('prospects/lead-magnet/', LeadMagnetView.as_view(), name='lead_magnet'),
    path('prospects/send-email/', SendEmailView.as_view(), name='send_email'),
    path('prospects/clear/', ClearProspectsView.as_view(), name='clear_prospects'),
    path('webhooks/geniuspay/', GeniusPayWebhookView.as_view(), name='geniuspay_webhook'),
    path('content/<int:pk>/download/', ContentDownloadView.as_view(), name='content_download'),
    # Cron endpoint — appelé par Vercel Cron Jobs ou via curl sur VPS
    path('cron/sequences/', CronSequenceView.as_view(), name='cron_sequences'),
    path('', include(router.urls)),
]
