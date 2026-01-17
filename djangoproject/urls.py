from django.contrib import admin
from django.urls import path
from django.urls import include
from main import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('app/', include("main.urls")),
    path('', views.index, name="index"),
    path('login', views.login, name="login"),
    path('signup', views.signup, name="signup"),
    path('logout', views.logout, name="logout"),
    path('api/', include("api.urls")),
]
