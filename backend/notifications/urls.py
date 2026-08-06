from django.urls import path

from .views import (
    MarkAllNotificationsReadView,
    MarkNotificationReadView,
    NewsletterSubscribeView,
    NotificationListView,
    UnreadCountView,
)

app_name = "notifications"

urlpatterns = [
    path("unread-count/", UnreadCountView.as_view(), name="notification_unread_count"),
    path("mark-all-read/", MarkAllNotificationsReadView.as_view(), name="notification_mark_all_read"),
    path("newsletter/subscribe/", NewsletterSubscribeView.as_view(), name="newsletter_subscribe"),
    path("", NotificationListView.as_view(), name="notification_list"),
    path("<uuid:pk>/read/", MarkNotificationReadView.as_view(), name="notification_mark_read"),
]
