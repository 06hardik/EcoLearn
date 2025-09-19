document.addEventListener('auth-check-complete', () => {
    const eventsContainer = document.getElementById('events-container');
    const impactEventSelect = document.getElementById('impact-event');
    const API_BASE_URL = 'https://ecolearn-8436.onrender.com/api';

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
                <p class="text-sm text-gray-500 mb-2"><span class="material-symbols-outlined text-base text-green-600 align-middle">calendar_month</span> ${event.date}</p>
                <button class="w-full py-2 px-4 bg-gradient-to-r from-green-500 to-green-400 text-white font-bold rounded-md hover:from-green-600 hover:to-green-500 btn-ripple delay-${idx + 3}">Join Event</button>
            `;
            eventsContainer.appendChild(card);
        });
    };

    const renderEventOptions = (events) => {
        if (!impactEventSelect) return;
        impactEventSelect.innerHTML = `<option value="">-- Choose an event --</option>`;
        events.forEach(event => {
            const opt = document.createElement('option');
            opt.value = event.id;
            opt.textContent = event.title;
            impactEventSelect.appendChild(opt);
        });
    };

    fetchEvents();
});
