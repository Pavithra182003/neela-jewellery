from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import Address

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Read/update serializer for the logged-in user's own profile."""

    full_name = serializers.ReadOnlyField()

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "full_name",
            "phone_number",
            "date_of_birth",
            "profile_image",
            "is_email_verified",
            "is_phone_verified",
            "is_staff",
            "created_at",
        )
        read_only_fields = ("id", "email", "is_email_verified", "is_phone_verified", "is_staff", "created_at")


class RegisterSerializer(serializers.ModelSerializer):
    """Creates a new account. Passwords are validated with Django's
    built-in password validators (min length, common password, etc.)
    configured in settings.AUTH_PASSWORD_VALIDATORS."""

    password = serializers.CharField(write_only=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, label="Confirm password")

    class Meta:
        model = User
        fields = (
            "username",
            "email",
            "first_name",
            "last_name",
            "phone_number",
            "password",
            "password2",
        )

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return value

    def validate_username(self, value):
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("This username is already taken.")
        return value

    def validate(self, attrs):
        if attrs["password"] != attrs.pop("password2"):
            raise serializers.ValidationError({"password2": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Logs a user in with EMAIL + password (instead of SimpleJWT's default
    username field) and embeds basic profile data in the token response
    so the frontend doesn't need a second request right after login.
    """

    username_field = User.USERNAME_FIELD  # still "username" on AbstractUser

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Replace the default "username" input field with "email".
        self.fields["email"] = serializers.EmailField()
        self.fields.pop(self.username_field, None)
        self.fields.pop("username", None)

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            raise serializers.ValidationError(
                {"detail": "No account found with this email address."}
            )

        if not user.check_password(password):
            raise serializers.ValidationError({"detail": "Incorrect password."})

        if not user.is_active:
            raise serializers.ValidationError({"detail": "This account has been deactivated."})

        # Reuse SimpleJWT's machinery to actually mint the tokens.
        data = {}
        refresh = self.get_token(user)
        data["refresh"] = str(refresh)
        data["access"] = str(refresh.access_token)
        data["user"] = UserSerializer(user).data
        return data


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()


class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not User.objects.filter(email__iexact=value).exists():
            # Don't reveal whether the email exists — respond the same
            # way either way at the view level. Validation just parses.
            return value
        return value


class ResetPasswordSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True, validators=[validate_password])
    new_password2 = serializers.CharField(write_only=True, label="Confirm new password")

    def validate(self, attrs):
        if attrs["new_password"] != attrs["new_password2"]:
            raise serializers.ValidationError({"new_password2": "Passwords do not match."})

        try:
            uid = force_str(urlsafe_base64_decode(attrs["uid"]))
            user = User.objects.get(pk=uid)
        except (User.DoesNotExist, ValueError, TypeError, OverflowError):
            raise serializers.ValidationError({"uid": "Invalid reset link."})

        if not default_token_generator.check_token(user, attrs["token"]):
            raise serializers.ValidationError({"token": "This reset link is invalid or has expired."})

        attrs["user"] = user
        return attrs


class AdminUserSerializer(serializers.ModelSerializer):
    """
    Staff-facing customer list/detail. Deliberately narrower than
    UserSerializer's own-profile use — no need to expose more than
    this for account management, and explicitly excludes password-
    related or token fields (which don't exist on this serializer at
    all, so there's nothing to accidentally leak).
    """

    full_name = serializers.ReadOnlyField()
    order_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "email",
            "full_name",
            "phone_number",
            "is_active",
            "is_email_verified",
            "order_count",
            "created_at",
        )
        read_only_fields = (
            "id", "username", "email", "full_name", "phone_number",
            "is_email_verified", "order_count", "created_at",
        )


class ChangePasswordSerializer(serializers.Serializer):
    """Used by an already-authenticated user to change their password
    from their profile/settings page."""

    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, validators=[validate_password])
    new_password2 = serializers.CharField(write_only=True, label="Confirm new password")

    def validate_old_password(self, value):
        user = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect.")
        return value

    def validate(self, attrs):
        if attrs["new_password"] != attrs["new_password2"]:
            raise serializers.ValidationError({"new_password2": "Passwords do not match."})
        return attrs


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = (
            "id",
            "full_name",
            "phone_number",
            "address_type",
            "address_line1",
            "address_line2",
            "landmark",
            "city",
            "state",
            "postal_code",
            "country",
            "is_default",
            "created_at",
        )
        read_only_fields = ("id", "created_at")
