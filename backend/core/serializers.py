from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'email', 'phone', 'role', 'is_superuser')

    def get_role(self, obj):
        if obj.role and obj.role != 'client':
            return obj.role
        if obj.is_superuser or obj.is_staff:
            return 'admin'
        return obj.role

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email', 'password', 'phone')

    def create(self, validated_data):
        # We use email as the username for authentication
        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            password=validated_data['password'],
            phone=validated_data.get('phone', ''),
            role='editeur',
            is_staff=True
        )
        return user

from .models import Prospect, Payment

class ProspectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prospect
        fields = '__all__'

class PaymentSerializer(serializers.ModelSerializer):
    prospect = ProspectSerializer(read_only=True)
    
    class Meta:
        model = Payment
        fields = '__all__'

from .models import EmailLog, ContentResource, EmailSequenceStep

class EmailSequenceStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailSequenceStep
        fields = '__all__'

class EmailLogSerializer(serializers.ModelSerializer):
    prospect_name = serializers.SerializerMethodField()

    class Meta:
        model = EmailLog
        fields = '__all__'

    def get_prospect_name(self, obj):
        if obj.prospect:
            return f"{obj.prospect.first_name or ''} {obj.prospect.last_name or ''}".strip() or obj.prospect.email
        return "Inconnu"

class ContentResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContentResource
        fields = '__all__'
