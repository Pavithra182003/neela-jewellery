from rest_framework import serializers

from .models import Notification, NewsletterSubscriber


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ("id", "notification_type", "title", "message", "link", "is_read", "created_at")


class NewsletterSubscribeSerializer(serializers.Serializer):
    email = serializers.EmailField()
