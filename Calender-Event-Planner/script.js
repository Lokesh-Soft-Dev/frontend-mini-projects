document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const dayViewBtn = document.getElementById('day-view');
    const weekViewBtn = document.getElementById('week-view');
    const monthViewBtn = document.getElementById('month-view');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const todayBtn = document.getElementById('today-btn');
    const monthYearDisplay = document.getElementById('month-year-display');
    const dayViewContainer = document.getElementById('day-view-container');
    const weekViewContainer = document.getElementById('week-view-container');
    const monthViewContainer = document.getElementById('month-view-container');
    const eventForm = document.getElementById('event-form');
    const eventTitleInput = document.getElementById('event-title');
    const eventDateInput = document.getElementById('event-date');
    const eventTimeInput = document.getElementById('event-time');
    const eventDescriptionInput = document.getElementById('event-description');
    const eventColorInput = document.getElementById('event-color');
    const eventIdInput = document.getElementById('event-id');
    const saveBtn = document.getElementById('save-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const deleteBtn = document.getElementById('delete-btn');
    const eventModal = document.getElementById('event-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const modalEventTitle = document.getElementById('modal-event-title');
    const modalEventDate = document.getElementById('modal-event-date');
    const modalEventTime = document.getElementById('modal-event-time');
    const modalEventDescription = document.getElementById('modal-event-description');
    const editBtn = document.getElementById('edit-btn');
    const modalDeleteBtn = document.getElementById('modal-delete-btn');

    // State variables
    let currentDate = new Date();
    let currentView = 'day';
    let events = JSON.parse(localStorage.getItem('calendarEvents')) || [];
    let currentEventId = null;

    // Initialize the calendar
    function initCalendar() {
        renderCalendar();
        setupEventListeners();
    }

    // Render the calendar based on current view and date
    function renderCalendar() {
        updateMonthYearDisplay();
        
        switch(currentView) {
            case 'day':
                renderDayView();
                break;
            case 'week':
                renderWeekView();
                break;
            case 'month':
                renderMonthView();
                break;
        }
    }

    // Update the month/year display
    function updateMonthYearDisplay() {
        const options = { year: 'numeric', month: 'long' };
        monthYearDisplay.textContent = currentDate.toLocaleDateString('en-US', options);
    }

    // Render day view
    function renderDayView() {
        const day = currentDate.getDate();
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
        
        dayViewContainer.innerHTML = `
            <div class="day-view">
                <div class="day-header">
                    ${dayName}, ${month + 1}/${day}/${year}
                </div>
                <div class="time-slots">
                    ${Array.from({ length: 24 }, (_, i) => {
                        const hour = i % 12 || 12;
                        const ampm = i < 12 ? 'AM' : 'PM';
                        const date = new Date(year, month, day, i);
                        const eventsForHour = getEventsForDate(date);
                        
                        return `
                            <div class="time-slot">
                                <div class="time-label">${hour}:00 ${ampm}</div>
                                <div class="time-content">
                                    ${eventsForHour.map(event => createEventBlock(event)).join('')}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    // Render week view
    function renderWeekView() {
        const weekStart = getWeekStart(currentDate);
        
        weekViewContainer.innerHTML = `
            <div class="week-view">
                <div class="week-header">
                    ${Array.from({ length: 7 }, (_, i) => {
                        const date = new Date(weekStart);
                        date.setDate(weekStart.getDate() + i);
                        const isToday = isSameDay(date, new Date());
                        
                        return `
                            <div class="week-day ${isToday ? 'today' : ''}">
                                ${date.toLocaleDateString('en-US', { weekday: 'short' })}<br>
                                ${date.getDate()}
                            </div>
                        `;
                    }).join('')}
                </div>
                <div class="week-grid">
                    ${Array.from({ length: 24 }, (_, hour) => {
                        return Array.from({ length: 7 }, (_, day) => {
                            const date = new Date(weekStart);
                            date.setDate(weekStart.getDate() + day);
                            date.setHours(hour);
                            const eventsForHour = getEventsForDate(date);
                            const isToday = isSameDay(date, new Date());
                            
                            return `
                                <div class="week-cell ${isToday ? 'today' : ''}">
                                    <div class="week-cell-header">${hour}:00</div>
                                    ${eventsForHour.map(event => createEventBlock(event)).join('')}
                                </div>
                            `;
                        }).join('');
                    }).join('')}
                </div>
            </div>
        `;
    }

    // Render month view
    function renderMonthView() {
        const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const startDay = monthStart.getDay();
        const daysInMonth = monthEnd.getDate();
        const today = new Date();
        
        monthViewContainer.innerHTML = `
            <div class="month-view">
                <div class="month-header">
                    ${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => `
                        <div class="month-day-name">${day}</div>
                    `).join('')}
                </div>
                <div class="month-grid">
                    ${Array.from({ length: 42 }, (_, i) => {
                        const date = new Date(monthStart);
                        date.setDate(i - startDay + 1);
                        const isCurrentMonth = date.getMonth() === monthStart.getMonth();
                        const isToday = isSameDay(date, today);
                        const dayEvents = isCurrentMonth ? getEventsForDay(date) : [];
                        
                        return `
                            <div class="month-cell ${isToday ? 'today' : ''} ${!isCurrentMonth ? 'not-current' : ''}">
                                <div class="month-cell-header">${date.getDate()}</div>
                                <div class="month-events">
                                    ${dayEvents.map(event => createEventBlock(event)).join('')}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    // Get the start of the week for a given date
    function getWeekStart(date) {
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(date.setDate(diff));
    }

    // Check if two dates are the same day
    function isSameDay(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    }

    // Get events for a specific date
    function getEventsForDate(date) {
        return events.filter(event => {
            const eventDate = new Date(event.date);
            return isSameDay(eventDate, date);
        });
    }

    // Get events for a specific day (for month view)
    function getEventsForDay(date) {
        return events.filter(event => {
            const eventDate = new Date(event.date);
            return isSameDay(eventDate, date);
        });
    }

    // Create an event block element
    function createEventBlock(event) {
        return `
            <div class="event-block" 
                 style="background-color: ${event.color || '#4a6fa5'}" 
                 data-event-id="${event.id}">
                ${event.time ? `${event.time} - ` : ''}${event.title}
            </div>
        `;
    }

    // Handle view change
    function changeView(view) {
        currentView = view;
        
        // Update active button
        dayViewBtn.classList.remove('active');
        weekViewBtn.classList.remove('active');
        monthViewBtn.classList.remove('active');
        
        document.getElementById(`${view}-view`).classList.add('active');
        
        // Hide all views
        dayViewContainer.classList.remove('active');
        weekViewContainer.classList.remove('active');
        monthViewContainer.classList.remove('active');
        
        // Show current view
        document.getElementById(`${view}-view-container`).classList.add('active');
        
        renderCalendar();
    }

    // Navigate to previous period
    function navigatePrevious() {
        switch(currentView) {
            case 'day':
                currentDate.setDate(currentDate.getDate() - 1);
                break;
            case 'week':
                currentDate.setDate(currentDate.getDate() - 7);
                break;
            case 'month':
                currentDate.setMonth(currentDate.getMonth() - 1);
                break;
        }
        renderCalendar();
    }

    // Navigate to next period
    function navigateNext() {
        switch(currentView) {
            case 'day':
                currentDate.setDate(currentDate.getDate() + 1);
                break;
            case 'week':
                currentDate.setDate(currentDate.getDate() + 7);
                break;
            case 'month':
                currentDate.setMonth(currentDate.getMonth() + 1);
                break;
        }
        renderCalendar();
    }

    // Navigate to today
    function navigateToToday() {
        currentDate = new Date();
        renderCalendar();
    }

    // Save event to localStorage
    function saveEvent(event) {
        if (event.id) {
            // Update existing event
            const index = events.findIndex(e => e.id === event.id);
            if (index !== -1) {
                events[index] = event;
            }
        } else {
            // Add new event
            event.id = Date.now().toString();
            events.push(event);
        }
        
        localStorage.setItem('calendarEvents', JSON.stringify(events));
        renderCalendar();
    }

    // Delete event from localStorage
    function deleteEvent(eventId) {
        events = events.filter(event => event.id !== eventId);
        localStorage.setItem('calendarEvents', JSON.stringify(events));
        renderCalendar();
    }

    // Open event form for editing
    function openEventForm(event = null) {
        if (event) {
            // Edit mode
            eventTitleInput.value = event.title;
            eventDateInput.value = event.date.split('T')[0];
            eventTimeInput.value = event.time || '';
            eventDescriptionInput.value = event.description || '';
            eventColorInput.value = event.color || '#4a6fa5';
            eventIdInput.value = event.id;
            deleteBtn.classList.remove('hidden');
            currentEventId = event.id;
        } else {
            // Add mode
            eventForm.reset();
            eventDateInput.value = currentDate.toISOString().split('T')[0];
            eventIdInput.value = '';
            deleteBtn.classList.add('hidden');
            currentEventId = null;
        }
    }

    // Open event modal
    function openEventModal(event) {
        modalEventTitle.textContent = event.title;
        modalEventDate.textContent = `Date: ${new Date(event.date).toLocaleDateString()}`;
        modalEventTime.textContent = event.time ? `Time: ${event.time}` : '';
        modalEventDescription.textContent = event.description ? `Description: ${event.description}` : '';
        currentEventId = event.id;
        eventModal.classList.remove('hidden');
    }

    // Close event modal
    function closeEventModal() {
        eventModal.classList.add('hidden');
        currentEventId = null;
    }

    // Setup event listeners
    function setupEventListeners() {
        // View buttons
        dayViewBtn.addEventListener('click', () => changeView('day'));
        weekViewBtn.addEventListener('click', () => changeView('week'));
        monthViewBtn.addEventListener('click', () => changeView('month'));
        
        // Navigation buttons
        prevBtn.addEventListener('click', navigatePrevious);
        nextBtn.addEventListener('click', navigateNext);
        todayBtn.addEventListener('click', navigateToToday);
        
        // Event form
        eventForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const event = {
                id: eventIdInput.value || null,
                title: eventTitleInput.value,
                date: eventDateInput.value,
                time: eventTimeInput.value,
                description: eventDescriptionInput.value,
                color: eventColorInput.value
            };
            
            saveEvent(event);
            eventForm.reset();
        });
        
        cancelBtn.addEventListener('click', function() {
            eventForm.reset();
        });
        
        deleteBtn.addEventListener('click', function() {
            if (currentEventId) {
                deleteEvent(currentEventId);
                eventForm.reset();
            }
        });
        
        // Event modal
        closeModalBtn.addEventListener('click', closeEventModal);
        
        editBtn.addEventListener('click', function() {
            const event = events.find(e => e.id === currentEventId);
            if (event) {
                openEventForm(event);
                closeEventModal();
            }
        });
        
        modalDeleteBtn.addEventListener('click', function() {
            if (currentEventId) {
                deleteEvent(currentEventId);
                closeEventModal();
            }
        });
        
        // Click event on calendar
        document.addEventListener('click', function(e) {
            // Event block click
            if (e.target.classList.contains('event-block')) {
                const eventId = e.target.getAttribute('data-event-id');
                const event = events.find(e => e.id === eventId);
                if (event) {
                    openEventModal(event);
                }
            }
            
            // Empty cell click (for adding new events)
            if (e.target.classList.contains('time-content') || 
                e.target.classList.contains('week-cell') || 
                e.target.classList.contains('month-cell')) {
                openEventForm();
                
                // For day view time slots
                if (e.target.classList.contains('time-content')) {
                    const timeLabel = e.target.previousElementSibling?.textContent.trim();
                    if (timeLabel) {
                        const [hour, ampm] = timeLabel.split(' ');
                        let hourNum = parseInt(hour);
                        if (ampm === 'PM' && hourNum < 12) hourNum += 12;
                        if (ampm === 'AM' && hourNum === 12) hourNum = 0;
                        
                        eventTimeInput.value = `${hourNum.toString().padStart(2, '0')}:00`;
                    }
                }
                
                // For month view cells
                if (e.target.classList.contains('month-cell') && !e.target.classList.contains('not-current')) {
                    const day = parseInt(e.target.querySelector('.month-cell-header')?.textContent);
                    if (day) {
                        const newDate = new Date(currentDate);
                        newDate.setDate(day);
                        eventDateInput.value = newDate.toISOString().split('T')[0];
                    }
                }
            }
        });
    }

    // Initialize the calendar
    initCalendar();
});