from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Create a superuser"

    def handle(self, *args, **options):
        User = get_user_model()
        if not User.objects.filter(email="admin@gmail.com").exists():
            try:
                User.objects.create_superuser("admin@gmail.com", "0000")
                self.stdout.write(
                    self.style.SUCCESS("Superuser created successfully :)")
                )
            except Exception as e:
                self.stdout.write(self.style.ERROR("Something went wrong :|"))
        else:
            self.stdout.write(self.style.WARNING("Superuser already exists !"))
