import random
import string
from django.core.mail import send_mail
from django.template.loader import render_to_string


def send_html_email(email, title, message):
    from_email = "support@gmail.com"
    subject = title
    to_email = email

    context = {"message": message, "title": title}
    html_message = render_to_string("send_email.html", context)

    send_mail(subject, message, from_email, [to_email], html_message=html_message, fail_silently=False)


def generate_random_string(num):
    return "".join(
            random.choices(string.ascii_letters + string.digits, k=num)
        )
