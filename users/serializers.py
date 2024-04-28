import random
import string
from rest_framework import serializers
from users.models import User
from users.utils import generate_random_string, send_html_email


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    code = serializers.CharField(max_length=6, write_only=True, required=False)

    class Meta:
        model = User
        fields = [
            "name",
            "email",
            "profile_picture",
            "password",
            "code",
            "gender",
        ]

    def create(self, validated_data):
        password = validated_data.pop("password")
        code = generate_random_string(6)
        user = User.objects.create(**validated_data, code=code)
        user.set_password(password)
        user.save()
        # send verification email
        send_html_email(
            user.email,
            "Verification account",
            f"""
            <p> Salam {user.name} </p>
            <p>Your verification code is {code}</p>
            """,
        )
        return user


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
