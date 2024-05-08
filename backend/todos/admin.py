from django.contrib import admin
from todos.models import Todo


class TodoAdmin(admin.ModelAdmin):
    list_display = ('title', 'status', 'priority', 'user')
    list_filter = ('status', 'priority')
    search_fields = ('title', 'description')
    ordering = ('-id',)

admin.site.register(Todo, TodoAdmin)
