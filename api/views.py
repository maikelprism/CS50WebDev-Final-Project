from main.models import User, Entry, Habit
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.core import serializers
from django.utils.dateparse import parse_date
from datetime import datetime, timedelta, date
import json
from django.http import HttpResponseRedirect
from django.urls import reverse
from math import ceil

# Create your views here.
@csrf_exempt
def getWeek(request):

    if request.method != "GET":
        return HttpResponse("Only GET")
    
    habit = Habit.objects.get(pk=request.GET["habitId"])
    start_date = parse_date(request.GET["start"])

    end_date = start_date + timedelta(days=6)

    entries = Entry.objects.filter(user=request.user).filter(habit=habit).filter(date__range=[start_date, end_date ])

    data = serializers.serialize("json", entries)

    return HttpResponse(data)

@csrf_exempt
def setStatus(request):

    if request.method != "POST":
        return HttpResponse('Error: request method must be POST')
    
    data = json.loads(request.body)

    habit = Habit.objects.get(pk=data["habit_id"])
    target_date = parse_date(data["target_date"])
    new_status = data["new_status"]

    print(habit.id, habit.name, target_date, new_status)

    Entry.objects.update_or_create(user=request.user, date=target_date, habit=habit, defaults={"status": new_status})

    return HttpResponse("Successfully updated entry")

@csrf_exempt
def newHabit(request):

    if request.method != "POST":
        return HttpResponse('Error: request method must be POST')
    
    habit_name = request.POST["habit_name"]
    start_date = request.POST["start_date"]

    new_habit = Habit(user=request.user, name=habit_name, createdAt = start_date)
    new_habit.save()

    # Javascript handles this part currently
    # new_entry = Entry(user=request.user, date=date.today(), status="PENDING", habit=new_habit)
    # new_entry.save()

    date_obj = parse_date(start_date)

    
    while date_obj != date.today():

        entry = Entry(user=request.user, date=date_obj, status="PENDING", habit=new_habit)
        entry.save()
        
        date_obj += timedelta(days=1)

        
        

    return HttpResponseRedirect(reverse('habits'))

@csrf_exempt
def deleteHabit(request):

    if request.method != "POST":
        return HttpResponse('Error: request method must be POST')
    
    data = json.loads(request.body)

    habit = Habit.objects.get(pk = data['habit_id'])
    habit.delete()

    print(habit)

    return HttpResponse('success')

@csrf_exempt
def updateHabitName(request):

    if request.method != "POST":
        return HttpResponse('Error: request method must be POST')
    
    data = json.loads(request.body)
    updated_name = data['updated_name']

    habit = Habit.objects.get(pk = data['habit_id'])

    if updated_name == "":
        return HttpResponse('name empty')

    habit.name = updated_name
    habit.save()

    return HttpResponse('success')

def getHabitCreatedAt(request):

    if request.method != "GET":
        return HttpResponse('Error: request method must be GET')
    
    habit = Habit.objects.get(pk = request.GET['habitId'])
    createdAt = habit.createdAt

    return HttpResponse(createdAt)

def getAnalytics(request):

    if request.method != "GET":
        return HttpResponse('Error: request method must be GET')
    
    response_data = {}

    # Get habit name
    habit = Habit.objects.get(pk= request.GET['habitId'])
    habit_name = habit.name
    started = habit.createdAt

    # Save name, and start_date
    response_data['habit_name'] = habit_name
    response_data['started'] = started

    days_passed = (date.today() - started).days + 1

    # Save amount of passed days
    response_data['days_passed'] = days_passed
    
    # Get entries for calculations
    all_entries = Entry.objects.filter(habit=habit).filter(date__lt=(date.today() + timedelta(days=1))).order_by('date')

    times_completed = all_entries.filter(status="COMPLETED").count()
    times_failed = all_entries.filter(status="FAILED").count()
    times_pending = all_entries.filter(status="PENDING").count()
    
    # Save times failed, completed
    response_data['times_completed'] = times_completed
    response_data['times_failed'] = times_failed
    response_data['times_pending'] = times_pending

    # Calc and save completion rate
    completion_rate = int(times_completed) / int(days_passed)
    response_data['completion_rate'] = ceil((completion_rate * 100))

    # Calc longest streak

    counter = 0
    longest = 0

    for entry in all_entries:
        if entry.status == "COMPLETED":
            counter += 1
        else: 
            if counter > longest:
                longest = counter
            counter = 0
        print(entry, counter)
    if counter > longest:
        longest = counter

    
    # Save longest streak
    response_data['longest_streak'] = longest
 

    # Calc current streak

    counter = 0

    for entry in reversed(all_entries):
        if entry.status == "COMPLETED":
            counter += 1
        else:
            break
    
    response_data['current_streak'] = counter

    return JsonResponse(response_data)







    

