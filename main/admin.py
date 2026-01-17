from django.contrib import admin
from .models import *

# Register your models here.

admin.site.register(Habit)
admin.site.register(User)
admin.site.register(Entry)
admin.site.register(ToDoItem)