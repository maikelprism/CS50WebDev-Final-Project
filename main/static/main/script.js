document.addEventListener('DOMContentLoaded', function() {

    var weekdays = []
    document.documentElement.style.setProperty("--vh", window.innerHeight * 0.01 + 'px');

    const dialog_new_habit = document.querySelector('#dialog-new-habit')

    // DOMContentLoaded
    console.log("DOMContentLoaded")

    var selected_week = new Date()
    console.log(selected_week)
    generateWeek(selected_week)

    // Next week button
    document.querySelector('#btn-next-week').addEventListener('click', () => {
        console.log('Clicked next week button')

        selected_week.setDate(selected_week.getDate() + 7)
        generateWeek(selected_week)
    })

    // Previous week button
    document.querySelector('#btn-prev-week').addEventListener('click', () => {
        console.log('Clicked prev week button')

        selected_week.setDate(selected_week.getDate() - 7)
        generateWeek(selected_week)
    })

    document.querySelector('#btn-new-habit').addEventListener('click', () => {
        console.log('Pressed new habit button')
        dialog_new_habit.showModal()
    })

    document.querySelector('#btn-new-habit-confirm').addEventListener('click', () => {
        user_input = document.querySelector('#habit_name_input').value
        if (user_input !== null) {
            if (user_input.trim() !== "")
            dialog_new_habit.close()
        }
        
    })

    document.querySelector('#btn-new-habit-cancel').addEventListener('click', () => {
        dialog_new_habit.close()
    })

    document.querySelectorAll('.habit-title').forEach((habit_title) => {
        habit_title.addEventListener('click', () => {
            
            // Stupid way to remove old event listeners
            new_dialog_edit_habit = document.querySelector('#dialog-edit-habit').cloneNode(true)
            document.querySelector('#dialog-edit-habit').replaceWith(new_dialog_edit_habit)
            dialog_edit_habit = new_dialog_edit_habit
            

            // Populate input field
            dialog_edit_habit.querySelector('#edit-habit-name').value = habit_title.innerHTML

            // Delete Habit
            dialog_edit_habit.querySelector('#delete-habit-btn').addEventListener('click', () => {
                // API request delete
                fetch('http://localhost:8000/api/deleteHabit', {
                    method: 'POST',
                    body: JSON.stringify({
                        habit_id: habit_title.dataset.habitId
                    })
                })
                .then((response) => {
                    dialog_edit_habit.close()
                    location.reload()
                })
            })

            // Cancel Dialoge
            dialog_edit_habit.querySelector('#cancel-edit-btn').addEventListener('click', () => {
                dialog_edit_habit.close()
            })

            // Save changes
            dialog_edit_habit.querySelector('#save-edit-btn').addEventListener('click', () => {

                updated_name = dialog_edit_habit.querySelector('#edit-habit-name').value.trim()

                if (updated_name.trim() === "") {
                    dialog_edit_habit.close()
                }

                if ( updated_name === habit_title.innerHTML.trim()) {
                    dialog_edit_habit.close()
                }
                else {
                    console.log('Updating name')
                    fetch('http://localhost:8000/api/updateHabitName', {
                        method: 'POST',
                        body: JSON.stringify({
                            habit_id: habit_title.dataset.habitId,
                            updated_name: updated_name
                        })
                    })
                    .then((response) => {
                        dialog_edit_habit.close()
                        location.reload()
                    })
                    
                }
            })

            dialog_edit_habit.showModal()
            
        })
    });

    // Analytics
    document.querySelectorAll('.analytics-btn').forEach((btn) => {
       btn.addEventListener('click', () => {

            habit_id = btn.dataset.habitId

            // Get data
            fetch(`http://localhost:8000/api/getAnalytics?habitId=${habit_id}`)
            .then(response => response.json())
            .then(analytics => {
                console.log(analytics)

                // Clone template
                analytics_content = document.querySelector('#analytics-template').content.cloneNode(true)

                // Set name
                analytics_content.querySelector('#analytics-habit-name').innerHTML = analytics.habit_name

                // Edge case: 0%
                if (analytics.completion_rate === 0) {
                    null_bar = document.createElement('div')
                    null_bar.classList.add('text-center')
                    null_bar.classList.add('text-white')
                    null_bar.classList.add('text-xs')
                    null_bar.classList.add('font-semibold')
                    null_bar.classList.add('p-1')

                    
                    null_bar.innerHTML = '0%'

                    analytics_content.querySelector('#habit-progress-bar').replaceWith(null_bar)

                }

                // Edge case: >100%
                else if (parseFloat(analytics.completion_rate) > 100) {
                    analytics_content.querySelector('#habit-progress-bar').innerHTML = "100%"
                    analytics_content.querySelector('#habit-progress-bar').style.width = "100%"
                }

                // Default case
                else {
                    analytics_content.querySelector('#habit-progress-bar').innerHTML = `${analytics.completion_rate}%`
                    analytics_content.querySelector('#habit-progress-bar').style.width = `${analytics.completion_rate}%`
                }

                // Set completed, failed, pending values
                analytics_content.querySelector('#times_completed').innerHTML = analytics.times_completed
                analytics_content.querySelector('#times_failed').innerHTML = analytics.times_failed
                analytics_content.querySelector('#times_pending').innerHTML = analytics.times_pending

                // Set current, longest streak
                analytics_content.querySelector('#current_streak').innerHTML = analytics.current_streak
                analytics_content.querySelector('#longest_streak').innerHTML = analytics.longest_streak

                // Set days elapsed
                analytics_content.querySelector('#date_started').innerHTML = analytics.started


                // Add to DOM
                document.querySelector('#analytics-content').replaceWith(analytics_content)

            })
       })
    });

    // Hamburger Menu
    menu = document.querySelector('#menu')
    menu.addEventListener('click', () => {
        
        expanded = menu.dataset.expanded
        
        if (expanded === "false") {
            menu.setAttribute('data-expanded', 'true')
        } else {
            menu.setAttribute('data-expanded', 'false')
        }

        expanded = menu.dataset.expanded
        expanded_menu = document.querySelector('#expanded-menu')

        if (expanded === "true") {
            expanded_menu.classList.remove('hidden')
        }

        if (expanded === "false") {
            expanded_menu.classList.add('hidden')
        }
 
        




        
    })


    function generateWeek(date) {

        // Replicate date object
        var date_cursor = new Date(date)

        // Calcualte offset to start of week (Monday)
        // -1 Because sunday is considered start of week
        if (date_cursor.getDay() == 0) {
            offset = 6
        }

        else {
            offset = date_cursor.getDay() - 1
        }

        

        // Set date to start of week
        date_cursor.setDate(date_cursor.getDate() - offset)

        weekdays = []

        // Go trough each day of the week and add it to the array
        for (i = 0; i < 7; i++) {
            weekdays.push(new Date(date_cursor))
            date_cursor.setDate(date_cursor.getDate() + 1)
        }

        // Highlight current date
        document.querySelectorAll('.habit-th-date').forEach((th) => {
            th.innerHTML = weekdays[th.dataset.weekday].getDate()

            if (weekdays[th.dataset.weekday].toDateString() === new Date().toDateString()) {
                th.classList.add('text-blue-400')
            }
            else {
                th.classList.remove('text-blue-400')
            }
        })

        // Set month of calendar
        document.querySelector('#selected-month').innerHTML = weekdays[0].toLocaleString('default', {year: 'numeric', month: 'long'})
        document.querySelector('#selected-week').innerHTML = `${weekdays[0].getDate()}. - ${weekdays[6].getDate()}.`


        // Determine first day of week
        starting_date = `${weekdays[0].getFullYear()}-${weekdays[0].getMonth() + 1}-${weekdays[0].getDate()}`

        // Iterate the habit rows
        document.querySelectorAll('.habit-row').forEach((row) => {

            // Get start date of this habit
            let habit_created_at;
            fetch(`http://localhost:8000/api/getHabitCreatedAt?habitId=${row.dataset.habitId}`)
            .then(response => response.text())
            .then(data => {
                
                habit_created_at = new Date(data)

                // Call API for all entries of current week
                fetch(`http://localhost:8000/api/getWeek?start=${starting_date}&habitId=${row.dataset.habitId}`)

                .then(response => response.json())
                .then(entries => {
                    console.log(`Row ${row.dataset.habitId}, createdAt: ${habit_created_at}`)
                    console.log(entries)

                    // Iterate over every date in week
                    row.querySelectorAll('.habit-checkbox').forEach((box) => {
                        
                        var boxClickEvent = function() {
                
                            console.log(`Habit: ${box.dataset.habitId}, Date: ${weekdays[box.dataset.weekday].toDateString()}, Status: ${box.dataset.status}`)
                            
                            // Changing the status
                            if (box.dataset.status === "PENDING") {
                                box.dataset.status = "COMPLETED"
                            }

                            else if (box.dataset.status === "COMPLETED") {
                                box.dataset.status = "FAILED"
                            }
                    
                            else if (box.dataset.status === "FAILED") {
                                box.dataset.status = "PENDING"
                            }

                            target_date = `${weekdays[box.dataset.weekday].getFullYear()}-${weekdays[box.dataset.weekday].getMonth() + 1}-${weekdays[box.dataset.weekday].getDate()}`
                            
                            // Sending new status to the API
                            fetch('http://localhost:8000/api/setStatus', {
                                method: "POST",
                                body: JSON.stringify({
                                    habit_id: box.dataset.habitId,
                                    target_date: target_date,
                                    new_status: box.dataset.status,
                                })
                            })
                        }

                        // This is dumb, but removeEventListener just won't work
                        // Replacing an element with a clone of itself removes all active listeners
                        // Could cause some issues with refrence since the cloned object is stored under a new adress
                        new_box = box.cloneNode(true)
                        box.replaceWith(new_box)
                        box = new_box

                        if (new Date(weekdays[box.dataset.weekday]).setHours(0, 0, 0 ,0) <= new Date().setHours(0, 0, 0, 0) && new Date(weekdays[box.dataset.weekday]).setHours(0, 0, 0, 0) >= habit_created_at.setHours(0, 0, 0, 0)) { 

                                box.addEventListener('click', boxClickEvent)
                                console.log("Added Click Listener")
                            } 

                        // Look for entries with date
                        target_date = weekdays[box.dataset.weekday].toDateString()

                        has_entry = false
                        for (const entry of entries) {

                            if (new Date(entry.fields.date).toDateString() === target_date) {

                                has_entry = true
                                entry_status = entry.fields.status

                                if (entry_status === "COMPLETED") {
                                    box.setAttribute('data-status', entry_status)
                                
                                }
                                if (entry_status === "FAILED") {
                                    box.setAttribute('data-status', entry_status)
                                
                                }
                                if (entry_status === "PENDING") {
                                    box.setAttribute('data-status', entry_status)
                                
                                }
                                if (entry_status === "CHEATED") {
                                    box.setAttribute('data-status', entry_status)
                                }
                            } 
                        }

                        if (!has_entry) {

                            if (weekdays[box.dataset.weekday].toDateString() === new Date().toDateString() ) {

                                box.setAttribute('data-status', "PENDING")

                                console.log(`Set ${weekdays[box.dataset.weekday]} to "PENDING"`)

                                today_formatted = `${weekdays[box.dataset.weekday].getFullYear()}-${weekdays[box.dataset.weekday].getMonth() + 1}-${weekdays[box.dataset.weekday].getDate()}`

                                fetch('http://localhost:8000/api/setStatus', {
                                    method: "POST",
                                    body: JSON.stringify({
                                        habit_id: box.dataset.habitId,
                                        target_date: today_formatted,
                                        new_status: "PENDING",
                                    })
                                })
                            }

                            else {
                                box.setAttribute('data-status', "OUT-OF-RANGE")
                            }
                        }
                    })
                })
            })
        })
    }

})
