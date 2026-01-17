from django.urls import path
from . import views

urlpatterns = [
  path('getWeek', views.getWeek, name="getWeek"),
  path('setStatus', views.setStatus, name="setStatus"),
  path('newHabit', views.newHabit, name="newHabit"),
  path('deleteHabit', views.deleteHabit, name="deleteHabit"),
  path('updateHabitName', views.updateHabitName, name="updateHabitName"),
  path('getHabitCreatedAt', views.getHabitCreatedAt, name="getHabitCreatedAt"),
  path('getAnalytics', views.getAnalytics, name="getAnalytics")
]
