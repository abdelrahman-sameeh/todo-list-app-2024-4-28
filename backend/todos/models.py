from django.db import models
from todos.utils import TodoChoices
from users.models import User


class Todo(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=False, blank=True)
    title = models.CharField(max_length=30, null=True, blank=True)
    description = models.TextField(max_length=500, null=True, blank=True)
    status = models.CharField(max_length=20, choices=TodoChoices.STATUS_CHOICES, default=TodoChoices.P)
    uuid = models.CharField(max_length=15, null=True, blank=True)

    def __str__(self):
            return self.title
