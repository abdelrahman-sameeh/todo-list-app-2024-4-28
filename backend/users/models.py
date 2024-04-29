from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from users.choices import Gender_Choices, Status_Choices
from django.utils import timezone


class MyUserManager(BaseUserManager):
    def create_superuser(self, email, password, **extra_fields):
        user = self.model(email=email, is_staff=True, is_superuser=True, is_active=True)
        user.set_password(password)
        user.save()
        return user


class User(AbstractUser):
    name = models.CharField(max_length=255)
    email = models.CharField(max_length=255, unique=True)
    profile_picture = models.ImageField(upload_to="media/users/", blank=True, null=True)
    gender = models.CharField(
        max_length=20, default=Gender_Choices.male, choices=Gender_Choices.CHOICES
    )
    status = models.CharField(
        max_length=20, default=Status_Choices.new, choices=Status_Choices.CHOICES
    )
    code = models.CharField(max_length=255, blank=True, null=True)
    code_expires_at = models.DateTimeField(blank=True, null=True)

    username = None
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = MyUserManager()

    def is_code_expired(self):
        """
        Check if the reset code has expired.
        """
        if self.code_expires_at:
            return self.code_expires_at <= timezone.now()
        return False
