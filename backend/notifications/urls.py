from django.urls import path

from .views import (
    MarkAllNotificationsReadView,
    MarkNotificationReadView,
    NewsletterSubscribeView,
    NotificationListView,
    UnreadCountView,
    NewsletterSubscriberListView
)

app_name = "notifications"

urlpatterns = [
   path("unread-count/", UnreadCountView.as_view()),
    path("mark-all-read/", MarkAllNotificationsReadView.as_view()),
    path("newsletter/subscribe/", NewsletterSubscribeView.as_view()),

    # ADD THIS
    path(
        "newsletter/subscribers/",
        NewsletterSubscriberListView.as_view(),
        name="newsletter_subscribers",
    ),

    path("", NotificationListView.as_view()),
    path("<uuid:pk>/read/", MarkNotificationReadView.as_view()),
]
    

