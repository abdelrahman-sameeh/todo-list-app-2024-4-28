from django.core.management.base import BaseCommand
from users.choices import Status_Choices
from faker import Faker
from random import choice
from todos.models import Todo, TodoChoices, PriorityChoices
from users.models import User

class Command(BaseCommand):
    help = "Generate fake Todo objects"

    def handle(self, *args, **options):
        faker = Faker()

        try:
            user = User.objects.get(email="test@gmail.com")
        except User.DoesNotExist:
            user = User.objects.create(
                email="test@gmail.com",
                name="test",
                status=Status_Choices.verified,
            )
            user.set_password("0000")
            user.save()

        for _ in range(50):
            title = faker.sentence()
            description = faker.paragraph()
            status = choice([choice[0] for choice in TodoChoices.CHOICES])
            priority = choice([choice[0] for choice in PriorityChoices.CHOICES])
            uuid = faker.uuid4().split("-")[0]

            Todo.objects.create(
                user=user,
                title=title,
                description=description,
                status=status,
                priority=priority,
                uuid=uuid,
            )

        self.stdout.write(self.style.SUCCESS("Fake Todo objects created successfully"))
