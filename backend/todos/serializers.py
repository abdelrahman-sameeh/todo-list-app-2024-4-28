from rest_framework import serializers
from todos.models import Todo


class ListCreateTodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        exclude = ["id"]
        read_only_fields = ["user", "status", 'uuid']


    def validate(self, data):
        title = data.get("title", None)
        description = data.get("description", None)

        if not title or title.strip() == "":
            raise serializers.ValidationError("Title is required")
        if title and len(title) <= 1:
            raise serializers.ValidationError("Too short title")
        if not description or len(description) <= 3:
            raise serializers.ValidationError("Too short description")

        return data



class RetrieveUpdateDestroyTodoSerializer(serializers.ModelSerializer):
    class Meta:
        model=Todo
        exclude = ["id"]
        read_only_fields = ["user", 'uuid']








