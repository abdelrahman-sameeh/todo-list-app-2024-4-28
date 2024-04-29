from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
    path('register/', views.register_view, name='register_user'),
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("verification-account/", views.verification_account, name="verification_account"),
    path("change-password/", views.change_password, name="change_password"),
    path("forgot-password/", views.forgot_password, name="forgot_password"),
    path("reset-password/", views.reset_password_with_code, name="reset_password_with_code"),
    path("user/", views.retrieve_update_destroy_logged_user, name='retrieve_update_destroy_logged_user')
]
