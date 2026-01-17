from django.urls import path
from . import views

urlpatterns = [
  path('habits', views.habits, name="habits"),
]
