document.addEventListener('auth-check-complete', () => {
    const API_BASE_URL = 'http://localhost:8000/api';
    const currentUser = window.currentUser;
    if (!currentUser) {
        window.location.href = '/index.html';
        return;
    }

    const populateProfileData = (user) => {
        document.getElementById('profile-picture').src = user.imageUrl || 'https://i.imgur.com/AV25K0m.png'; // Default image if none
        document.getElementById('profile-name').textContent = user.name;
        document.getElementById('profile-email').textContent = user.email;
        const joinDate = new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        document.getElementById('profile-member-since').textContent = `Member since ${joinDate}`;

        document.getElementById('profile-green-points').textContent = user.stats?.greenPoints || 0;
        document.getElementById('profile-campaigns-joined').textContent = user.stats?.campaignsJoined || 0;
        document.getElementById('profile-trees-contributed').textContent = user.stats?.treesContributed || 0;

        document.getElementById('edit-name').value = user.name;
        document.getElementById('edit-email').value = user.email;
    };

    const fetchUserProfile = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/users/me`, { credentials: 'include' });
            if (!response.ok) throw new Error('Could not fetch user profile.');
            
            const userProfileData = await response.json();
            populateProfileData(userProfileData);

        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const fetchRecentActivity = async () => {
        const activityContainer = document.getElementById('recent-activity-container');
        try {
            const response = await fetch(`${API_BASE_URL}/users/me/activity`, { credentials: 'include' });
            if (!response.ok) throw new Error('Could not fetch activity.');
            
            const activities = await response.json();
            activityContainer.innerHTML = ''; // Clear "Loading..." message

            if (activities.length === 0) {
                activityContainer.innerHTML = '<p class="text-gray-500">No recent activity.</p>';
                return;
            }

            activities.slice(0, 5).forEach(activity => { // Show latest 5 activities
                const activityEl = document.createElement('div');
                activityEl.className = 'flex items-center justify-between p-3 bg-slate-50 rounded-md';
                const activityDate = new Date(activity.date).toLocaleDateString();
                
                activityEl.innerHTML = `
                    <div>
                        <p class="font-semibold text-gray-800">${activity.title}</p>
                        <p class="text-sm text-gray-500">${activity.type}</p>
                    </div>
                    <p class="text-sm text-gray-500">${activityDate}</p>
                `;
                activityContainer.appendChild(activityEl);
            });

        } catch (error) {
            console.error('Error fetching activity:', error);
            activityContainer.innerHTML = '<p class="text-red-500">Could not load recent activity.</p>';
        }
    };

    document.getElementById('edit-profile-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('edit-name').value;
        const email = document.getElementById('edit-email').value;

        try {
            const response = await fetch(`${API_BASE_URL}/users/me`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email }),
                credentials: 'include'
            });
            if (response.ok) {
                alert('Profile updated successfully!');
                fetchUserProfile(); // Refresh data on page
            } else {
                const errorData = await response.json();
                alert(`Update failed: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('An error occurred. Please try again.');
        }
    });

    document.getElementById('change-password-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;

        try {
            const response = await fetch(`${API_BASE_URL}/users/change-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword, newPassword }),
                credentials: 'include'
            });
            if (response.ok) {
                alert('Password updated successfully!');
                e.target.reset(); // Clear the form fields
            } else {
                const errorData = await response.json();
                alert(`Update failed: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error changing password:', error);
            alert('An error occurred. Please try again.');
        }
    });
    fetchUserProfile();
    fetchRecentActivity();
});