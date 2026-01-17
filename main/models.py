from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.

class User(AbstractUser):
    pass

class Habit(models.Model):

    name = models.CharField(max_length=64)
    user = models.ForeignKey('User', on_delete=models.CASCADE, related_name="habits", null=True)
    createdAt = models.DateField()

    def __str__(self):
        return f"{self.user}:  {self.name} ({self.id})"
    

class Entry(models.Model):

    FAILED = "FAILED"
    COMPLETED = "COMPLETED"
    PENDING = "PENDING"

    STATUS_CHOICES = [
        (FAILED, "failed"),
        (COMPLETED, "completed"),
        (PENDING, "pending"),
    ]

    user = models.ForeignKey('User', on_delete=models.CASCADE, related_name="entries")
    date = models.DateField()
    status = models.CharField(max_length=9 ,choices=STATUS_CHOICES, default=PENDING)
    habit = models.ForeignKey('Habit', on_delete=models.CASCADE, related_name="habit_entries")

    def __str__(self):
        return f"{self.habit}:  {self.date} ({self.status})"

class ToDoItem(models.Model):
    
    user = models.ForeignKey('User', on_delete=models.CASCADE, related_name="todo")
    name = models.CharField(max_length=64)
    timestamp = models.DateTimeField(auto_now_add=True)