# My Project: HabitTracker

For the Final Project in CS50's Web Programming with Python and JavaScript I've decided to create an application that helps users with improving and keeping track of their habits. Basically it allows users to log their progress in a calendar and have an overviews of their habits, aswell as view statistics about them.

# Descripton

The main page of the application has a calendar that displays dates on a weekly layout. To start of, click "New Habit" to create a new habit. You'll have to provide a name and starting date for your habit. By default the starting date is the current date.

After creating a new habit you will see it appear in your calendar. For every day of the week the habit will have a box that can contain an entry. Clicking on this box will change the status of the entry. On your first click the status will switch to "complete", clicking again will change it to "failed" and clicking once more will bring it back to the empty state, also called "pending". Boxes with the status of pending are yet to be filled out by the user. If a box is completley grayed out, it means that that day is not currently accessible, for exmaple because it is in the future or before the date on which the habit started. Entries can be edited at any time by just clicking on them to cycle trough their status.

To edit the name of a habit, click on it's title to open up a dialog. There you can make changes to the habit and save them.

On the far right of every habit you'll find a statistics icon. Clicking on it will make the app calculate various statistics about your progress for that habit and display them in the analytics container.

The statistics include:
	A percantage that shows how consistent you've been in performing that habit.
	How many times you completed or failed the habit.
	Your longest streak of completed days and your current streak.
	
# Distinctiveness and Complexity

The Calendar that is used by the application has been completley designed and build by myself from scratch using plain javascript. This allows the calendar to be responsive so that the user can cycle through weeks and swiftly add/edit entries without needing to relaod the entire page. Exchanging date objects between the front and backend aswell as performing operations on date objects has proven to be particularly intricate.

Further, the user interface was a big focus. I wanted to make an UI that is intuitive, responsive and displays the data in a structured way that is easy to grasp. To achive that I included elements like dialog windwos, progress bars and lots of icons in my project. Additionally I used tailwind css to give my project a nice asthetic.

Another distinctive feature of the app is it's ability to perform calculations on user data to provide them with statistics about their progress. For this feature I had to come up with algorithms for the backend that can filter through user data to find statistics like the longest consecutive completed days or the users consistency of completing a habit.

# Files

- DjangoProject (root)
	- api (Django api app)
		- urls.py (Url map for the api)
		- views.py (Contains all the api functions that are used by the javascript frontend)
		- Other django files
	- dist
		- tailwind.css (Tailwind generated stylesheet)
	- djangoproject (djangoproject app)
		- urls.py (Master url map)
		- Other django files
	- main (Django main app)
		- static/main
			- script.js (Contains all of the javascript)
		- templates (html files used by django)
			- habits.html (Page that lets you manage and log your habits)
			- home.html ()
			- index_layout.html (layout for the front page and login/signup)
			- index.html (front page)
			- layout.hmtl (layout for other parts of the app)
			- login.html (login page)
			- signup.html (signup page)
		- admin.py (Registration of models for the admin interface)
		- models.py (Contains the "Habit" and "Entry" model)
		- urls.py (Url map for the main app)
	    - views.py (Contains the functions for the app views)
	    - Other Django files and directories
    - tailwind
	    - global.css (Stylesheet)
	
# How to run
1. Download the source code
2. Cd into the root directory
3. If necessary run **python manage.py makemigrations** and **python manage.py migrate**
4. Run python manage.py runserver
5. Open http://localhost:8000 in your browser


















