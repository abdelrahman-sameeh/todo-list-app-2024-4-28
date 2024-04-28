from datetime import timedelta, datetime
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.response import Response
from rest_framework import generics
from users.choices import Status_Choices
from users.models import User
from users.serializers import ChangePasswordSerializer, RegisterSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.contrib.auth.hashers import make_password, check_password
from users.utils import generate_random_string, send_html_email


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer


register_view = RegisterView.as_view()


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def verification_account(request):
    if not "verified_code" in request.data:
        return Response({"error": "verified_code is required"})

    code = str(request.data.get("verified_code"))
    user: User = request.user

    print(user.code)
    print(user.status)

    if user.status != Status_Choices.new or not user.code:
        return Response(
            {"error": "this is not new account"}, status=status.HTTP_400_BAD_REQUEST
        )
    if code != user.code:
        return Response({"error": "wrong code "}, status=status.HTTP_400_BAD_REQUEST)
    else:
        # change status and remove code
        user.status = Status_Choices.verified
        user.code = None
        user.save()
        return Response(
            {"message": "Your account is verified successfully"},
            status=status.HTTP_200_OK,
        )


class ChangePassword(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user
        old_password = serializer.data.get("old_password")
        new_password = serializer.data.get("new_password")

        if not check_password(old_password, user.password):
            return Response(
                {"error": "Old password is incorrect."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(new_password)

        user.save()
        return Response(
            {"message": "Password changed successfully."}, status=status.HTTP_200_OK
        )


change_password = ChangePassword.as_view()


@api_view(["POST"])
def forgot_password(request):

    if not "email" in request.data:
        return Response(
            {"error": "email is required"}, status=status.HTTP_400_BAD_REQUEST
        )

    user = get_object_or_404(User, email=request.data.get("email"))

    # check if account is a new account
    if user.status == Status_Choices.new:
        return Response(
            {"error": "You must verify your account before performing this action."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    reset_code = generate_random_string(6)
    hashed_reset_code = make_password(reset_code)
    expiration_time = datetime.now() + timedelta(minutes=10)

    user.code = hashed_reset_code
    user.code_expires_at = expiration_time
    user.save()

    send_html_email(
        user.email,
        "Password Reset Code",
        f"Your reset code is {reset_code}. Please note that this code will expire after 10 minutes.",
    )

    return Response(
        {"message": "Password reset code has been sent successfully."},
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
def reset_password_with_code(request):
    if (
        not "email" in request.data
        or not "reset_code" in request.data
        or not "new_password" in request.data
    ):
        return Response(
            {"error": "email, reset_code, and new_password are required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    email = request.data.get("email")
    reset_code = request.data.get("reset_code")
    new_password = request.data.get("new_password")

    user = get_object_or_404(User, email=email)

    if (
        not user.code
        or user.is_code_expired()
        or not check_password(reset_code, user.code)
    ):
        return Response({"error": "Invalid or expired reset code"}, status=400)

    user.set_password(new_password)
    user.code = None
    user.code_expires_at = None
    user.save()

    return Response({"message": "Password reset successful"}, status=status.HTTP_200_OK)
