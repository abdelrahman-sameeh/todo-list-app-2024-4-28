from rest_framework import generics, permissions
from todos.permissions import IsOwnTodo
from users.utils import generate_random_string
from todos.models import Todo
from todos import serializers
from rest_framework.pagination import PageNumberPagination

class CustomPagination(PageNumberPagination):
    page_size=10
    page_query_param='page'


class ListCreateTodo(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = serializers.ListCreateTodoSerializer
    pagination_class= CustomPagination
    filterset_fields = ['status']
    search_fields=['title', 'description']

    def get_queryset(self):
        return Todo.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        uuid = generate_random_string(10)
        serializer.save(user=self.request.user, uuid=uuid)


list_create_todo_view = ListCreateTodo.as_view()


class RetrieveUpdateDestroyTodo(generics.RetrieveUpdateDestroyAPIView):
    queryset = Todo.objects.all()
    serializer_class = serializers.RetrieveUpdateDestroyTodoSerializer
    permission_classes = [IsOwnTodo]
    lookup_field = 'uuid'


retrieve_update_destroy_todo_view = RetrieveUpdateDestroyTodo.as_view()