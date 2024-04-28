from django.urls import path
from . import views

urlpatterns=[
    path('todos/', views.list_create_todo_view, name='list_create_todo_view'),
    path('todos/<str:uuid>/', views.retrieve_update_destroy_todo_view, name='retrieve_update_destroy_todo_view'),

]