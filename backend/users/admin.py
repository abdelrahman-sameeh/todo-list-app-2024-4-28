from django.contrib import admin
from users.models import User


class UserAdmin(admin.ModelAdmin):
    list_display = ("email", "name", "gender", "status", "code")
    search_fields = ("name", "email")
    list_filter = ("status", "gender", "groups")


admin.site.register(User, UserAdmin)
