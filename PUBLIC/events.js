document.addEventListener('auth-check-complete', () => {
    const API_BASE_URL = 'https://ecolearn-8436.onrender.com/api';
    const currentUser = window.currentUser;
    const eventsContainer = document.getElementById('events-container');
        if (!eventsContainer) {
        return; 
    }

    const fetchEvents = async () => {
        const eventsContainer = document.getElementById('events-container');
        const eventSelect = document.getElementById('impact-event'); 
        try {
            const response = await fetch(`${API_BASE_URL}/events`);
            if (!response.ok) throw new Error('Failed to fetch events');
            const events = await response.json();
        
            if (events.length === 0) {
                eventsContainer.innerHTML = '<p class="col-span-full text-center text-gray-500">There are no upcoming events at this time. Please check back later!</p>';
                return; 
            }
            eventsContainer.innerHTML = ''; 

            if (eventSelect) {
            eventSelect.innerHTML = '<option value="">-- Choose an event --</option>';
            events.forEach(event => {
                const option = document.createElement('option');
                option.value = event._id;
                option.textContent = event.title;
                eventSelect.appendChild(option);
            });
        }

            events.forEach(event => {
                const eventCard = document.createElement('div');
                eventCard.className = 'flex flex-col rounded-lg bg-white border border-[#E0E0E0] shadow-sm overflow-hidden transform hover:-translate-y-1 transition-transform duration-300';
                
                const eventDate = new Date(event.date);
                const formattedDate = eventDate.toLocaleDateString('en-US', {
                    month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit'
                });

                eventCard.innerHTML = `
                    <div class="w-full bg-center bg-no-repeat aspect-video bg-cover" style="background-image: url('${event.imageUrl}');"></div>
                    <div class="p-5 flex flex-col flex-1">
                        <p class="text-[#4A644A] text-sm font-medium">${formattedDate} | ${event.location}</p>
                        <h3 class="text-[#0B120B] text-lg font-bold mt-1">${event.title}</h3>
                        <p class="text-[#4A644A] text-base mt-2 flex-1">${event.description}</p>
                        <button data-event-id="${event._id}" class="register-button flex mt-4 min-w-[84px] items-center justify-center rounded-md h-10 px-4 bg-[#17CF17] text-[#0B120B] text-base font-bold hover:bg-opacity-90">
                            <span class="truncate">${event.eventType === 'Workshop' ? 'Register' : 'Volunteer'}</span>
                        </button>
                    </div>
                `;
                eventsContainer.appendChild(eventCard);
            });
        } catch (error) {
            console.error(error);
            eventsContainer.innerHTML = '<p class="col-span-full text-center text-gray-500">Could not load events at this time.</p>';
        }
    };

    eventsContainer.addEventListener('click', async (e) => {
        const button = e.target.closest('.register-button');
        if (!button) return;

        if (!currentUser) {
            alert('Please log in to register for an event.');
            return;
        }

        const eventId = button.dataset.eventId;
        button.textContent = 'Registering...';
        button.disabled = true;

        try {
            const response = await fetch(`${API_BASE_URL}/events/${eventId}/register`, {
                method: 'POST',
                credentials: 'include'
            });

            const result = await response.json();
            if (response.ok) {
                alert(result.message);
                button.textContent = 'Registered!';
                button.classList.replace('bg-[#17CF17]', 'bg-gray-400');
            } else {
                alert(`Error: ${result.message}`);
                button.textContent = 'Register';
                button.disabled = false;
            }
        } catch (error) {
            console.error('Registration failed:', error);
            alert('Registration failed. Please try again.');
            button.textContent = 'Register';
            button.disabled = false;
        }
    });

    if (impactForm) {
        impactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!currentUser) {
                alert('You must be logged in to submit a photo.');
                return;
            }

            const submitButton = impactForm.querySelector('button[type="submit"]');
            submitButton.textContent = 'Uploading...';
            submitButton.disabled = true;

            const formData = new FormData();
            formData.append('impactPhoto', document.getElementById('impact-photo').files[0]);
            formData.append('event', document.getElementById('impact-event').value);
            formData.append('caption', document.getElementById('impact-caption').value);

            try {
                const response = await fetch(`${API_BASE_URL}/submissions`, {
                    method: 'POST',
                    body: formData,
                    credentials: 'include'
                });

                if (response.ok) {
                    const result = await response.json();
                    alert(result.message);
                    impactForm.reset();
                } else {
                    const error = await response.json();
                    alert(`Error: ${error.message}`);
                }
            } catch (error) {
                alert('An error occurred during upload.');
            } finally {
                submitButton.textContent = 'Submit Photo';
                submitButton.disabled = false;
            }
        });
    }

    fetchEvents();
});
