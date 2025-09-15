document.addEventListener('auth-check-complete', () => {

    const topVolunteersContainer = document.getElementById('top-volunteers-container');
    const rankingsTbody = document.getElementById('rankings-tbody');
    const API_BASE_URL = 'http://localhost:8000/api';
    const currentUser = window.currentUser;

    const fetchLeaderboard = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/users/leaderboard`);
            if (!response.ok) throw new Error('Failed to fetch leaderboard');
            const users = await response.json();

            renderTopVolunteers(users.slice(0, 3));
            renderRankingsTable(users);

        } catch (error) {
            console.error(error);
            if(topVolunteersContainer) topVolunteersContainer.innerHTML = `<p>Could not load top volunteers.</p>`;
            if(rankingsTbody) rankingsTbody.innerHTML = `<tr><td colspan="4" class="text-center p-4">Could not load rankings.</td></tr>`;
        }
    };

    const renderTopVolunteers = (topUsers) => {
        if (!topVolunteersContainer) return;
        topVolunteersContainer.innerHTML = '';
        const rankClasses = {
            1: { border: 'border-[#17cf17]', bg: 'bg-[#17cf17]' },
            2: { border: 'border-gray-300', bg: 'bg-gray-400' },
            3: { border: 'border-gray-300', bg: 'bg-gray-400' },
        };
        
        topUsers.forEach((user, index) => {
            const rank = index + 1;
            const classes = rankClasses[rank];
            const card = document.createElement('div');
            card.className = 'flex flex-col items-center gap-4 rounded-lg p-4 bg-white border border-gray-200 shadow-sm text-center';
            card.innerHTML = `
                <div class="relative">
                    <div class="w-32 h-32 bg-center bg-no-repeat aspect-square bg-cover rounded-full border-4 ${classes.border}" style="background-image: url('${user.avatarUrl || 'https://via.placeholder.com/150'}');"></div>
                    <div class="absolute bottom-0 right-0 ${classes.bg} text-white rounded-full size-8 flex items-center justify-center font-bold text-sm">${rank}</div>
                </div>
                <div>
                    <p class="text-[#0e1b0e] text-lg font-semibold">${user.name}</p>
                    <p class="text-gray-500 text-sm">${user.points.toLocaleString()} Points</p>
                </div>
            `;
            topVolunteersContainer.appendChild(card);
        });
    };

    const renderRankingsTable = (users) => {
        if (!rankingsTbody) return;
        rankingsTbody.innerHTML = '';
        const categoryClasses = {
            'Low Waste': 'bg-green-100 text-green-800',
            'Medium Waste': 'bg-yellow-100 text-yellow-800',
            'High Waste': 'bg-red-100 text-red-800',
            'Unknown': 'bg-gray-100 text-gray-800'
        };

        users.forEach((user, index) => {
            const rank = index + 1;
            const categoryClass = categoryClasses[user.category] || categoryClasses['Unknown'];
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50 transition-colors';
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#0e1b0e]">${rank}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">${user.name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${user.points.toLocaleString()}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${categoryClass}">${user.category}</span>
                </td>
            `;
            rankingsTbody.appendChild(row);
        });
    };

    fetchLeaderboard();
});