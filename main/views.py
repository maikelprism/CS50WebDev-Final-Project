from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib import messages
from .models import User, Habit, ToDoItem
from django.db import IntegrityError
from django.contrib.auth.decorators import login_required

# Create your views here.

def index(request):
    return render(request, "main/index.html")

def home_view(request):
    return render(request, "main/home.html")

@login_required
def habits(request):

    habits = Habit.objects.filter(user=request.user)
    return render(request, "main/habits.html", {
        "habits":habits,
    })

@login_required
def todo(request):

    todos = ToDoItem.objects.filter(user=request.user)

    return render(request, "main/todo.html", {
        "todos": todos,
    })

def login(request):
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]

        user = authenticate(request, username=username, password=password)

        if user is not None:
            auth_login(request, user)
            return redirect('habits')
        else:
            messages.success(request, ("Invalid Credentials"))
    
    return render(request, "main/login.html", {})

def signup(request):
    if request.method == "POST":
        username = request.POST["username"].strip()
        email = request.POST["email"].strip()
        password = request.POST["password"].strip()
        repeat_password = request.POST["repeat_password"].strip()

        valid = True
        if username == "" or None:
            messages.success(request, ("Username is empty"))
            valid = False
        if email == "" or None:
            messages.success(request, ("Email is empty"))
            valid = False
        if password == "" or None:
            messages.success(request, ("Password is empty"))
            valid = False
        if repeat_password == "" or None:
            messages.success(request, ("Repeat password is empty"))
            valid = False
        if password != repeat_password:
            messages.success(request, ("Password don't match"))
            valid = False
        
        if valid == True:
             try: 
                user = User.objects.create_user(username, email, password)
                user.save()
             except IntegrityError as e:
                print(e)
                messages.success(request, ("Username already taken"))
                valid = False

        if valid == True:
            auth_login(request, user)
            return redirect("habits")
    
    return render(request, "main/signup.html", {})

def logout(request):
    auth_logout(request)
    return redirect("index")


