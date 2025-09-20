document.addEventListener('auth-check-complete', () => {
    const eventsContainer = document.getElementById('events-container');
    const impactEventSelect = document.getElementById('impact-event');
    const impactForm = document.getElementById('impact-form');
    const API_BASE_URL = 'https://ecolearn-8436.onrender.com/api';
    const currentUser = window.currentUser;

    const fetchEvents = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/events`);
            if (!response.ok) throw new Error('Failed to fetch events');
            const events = await response.json();
            renderEvents(events);
            renderEventOptions(events);
        } catch (error) {
            if (eventsContainer) eventsContainer.innerHTML = `<p class="text-red-600">Could not load events.</p>`;
        }
    };

    const renderEvents = (events) => {
        if (!eventsContainer) return;
        eventsContainer.innerHTML = '';
        events.forEach((event, idx) => {
            const card = document.createElement('div');
            card.className = `bg-white rounded-xl shadow-lg p-6 border border-green-100 card-animated animate-scaleUp delay-${idx + 2} fade-scroll`;
            card.innerHTML = `
                <h2 class="text-xl font-bold text-green-800 mb-2">${event.title}</h2>
                <p class="text-gray-600 mb-4">${event.description}</p>
                <p class="text-sm text-gray-500 mb-2">
                    <span class="material-symbols-outlined text-base text-green-600 align-middle">calendar_month</span> 
                    ${new Date(event.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <button class="join-event-button w-full py-2 px-4 bg-gradient-to-r from-green-500 to-green-400 text-white font-bold rounded-md hover:from-green-600 hover:to-green-500 btn-ripple" data-event-id="${event._id}">Join Event</button>
            `;
            eventsContainer.appendChild(card);
        });
    };

    const renderEventOptions = (events) => {
        if (!impactEventSelect) return;
        impactEventSelect.innerHTML = `<option value="">-- Choose an event --</option>`;
        events.forEach(event => {
            const opt = document.createElement('option');
            opt.value = event._id;
            opt.textContent = event.title;
            impactEventSelect.appendChild(opt);
        });
    };

    if (eventsContainer) {
        eventsContainer.addEventListener('click', async (e) => {
            const joinButton = e.target.closest('.join-event-button');
            if (!joinButton) return;

            if (!currentUser) {
                alert('Please log in to join an event.');
                return;
            }

            const eventId = joinButton.dataset.eventId;
            joinButton.disabled = true;
            joinButton.textContent = 'Registering...';

            try {
                const response = await fetch(`${API_BASE_URL}/events/${eventId}/register`, {
                    method: 'POST',
                    credentials: 'include' 
                });

                if (response.ok) {
                    alert('Successfully registered for the event!');
                    joinButton.textContent = 'Registered';
                    joinButton.classList.replace('from-green-500', 'from-gray-500');
                    joinButton.classList.replace('to-green-400', 'to-gray-400');
                } else {
                    const error = await response.json();
                    alert(`Registration failed: ${error.message}`);
                    joinButton.disabled = false;
                    joinButton.textContent = 'Join Event';
                }
            } catch (error) {
                console.error('Registration error:', error);
                alert('An error occurred. Please try again.');
                joinButton.disabled = false;
                joinButton.textContent = 'Join Event';
            }
        });
    }
    if (impactForm) {
        impactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 
            if (!currentUser) {
                alert('Please log in to share your impact.');
                return;
            }

            const submitButton = impactForm.querySelector('button[type="submit"]');
            const photoInput = document.getElementById('impact-photo'); 
            const captionInput = document.getElementById('impact-caption'); 

            const formData = new FormData();
            formData.append('photo', photoInput.files[0]);
            formData.append('event', impactEventSelect.value);
            formData.append('caption', captionInput.value);

            submitButton.disabled = true;
            submitButton.textContent = 'Submitting...';

            try {
                const response = await fetch(`${API_BASE_URL}/impact`, {
                    method: 'POST',
                    body: formData,
                    credentials: 'include'
                });

                if (response.ok) {
                    alert('Thank you for sharing your impact!');
                    impactForm.reset();
                } else {
                    const error = await response.json();
                    alert(`Submission failed: ${error.message}`);
                }
            } catch (error) {
                console.error('Impact submission error:', error);
                alert('An error occurred during submission. Please try again.');
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = 'Submit Photo';
            }
        });
    }

    fetchEvents();
});
