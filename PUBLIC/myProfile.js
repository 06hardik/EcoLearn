document.addEventListener('auth-check-complete', () => {
    const API_BASE_URL = 'https://ecolearn-8436.onrender.com/api';
    const currentUser = window.currentUser;

    function renderProfile() {
        if (!currentUser) {
            window.location.href = './index.html';
            return;
        }
        document.getElementById('profile-picture').src = currentUser.avatarUrl || 'https://via.placeholder.com/150';
        document.getElementById('profile-name').textContent = currentUser.name || '';
        document.getElementById('profile-email').textContent = currentUser.email || '';
        document.getElementById('profile-member-since').textContent = `Member since ${currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''}`;
        document.getElementById('profile-green-points').textContent = currentUser.points ? currentUser.points.toLocaleString() : '0';
        document.getElementById('profile-campaigns-joined').textContent = currentUser.campaignsJoined ? currentUser.campaignsJoined.length : '0';
        document.getElementById('profile-trees-contributed').textContent = currentUser.treesContributed ? currentUser.treesContributed : '0';
    }

    function handleEditProfile(e) {
        e.preventDefault();
        const name = document.getElementById('edit-name').value;
        const email = document.getElementById('edit-email').value;
        fetch(`${API_BASE_URL}/users/me`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email }),
            credentials: 'include'
        })
        .then(res => res.json())
        .then(data => {
            alert('Profile updated!');
            window.location.reload();
        })
        .catch(() => alert('Failed to update profile.'));
    }

    function handleAvatarUpload(e) {
        e.preventDefault();
        const fileInput = document.getElementById('avatar-file');
        if (!fileInput.files.length) return alert('Please select a file.');
        const formData = new FormData();
        formData.append('avatar', fileInput.files[0]);
        fetch(`${API_BASE_URL}/users/me/avatar`, {
            method: 'POST',
            body: formData,
            credentials: 'include'
        })
        .then(res => res.json())
        .then(data => {
            alert('Avatar updated!');
            window.location.reload();
        })
        .catch(() => alert('Failed to upload avatar.'));
    }

    function handleChangePassword(e) {
        e.preventDefault();
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        fetch(`${API_BASE_URL}/users/me/password`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ currentPassword, newPassword }),
            credentials: 'include'
        })
        .then(res => res.json())
        .then(data => {
            alert('Password updated!');
        })
        .catch(() => alert('Failed to update password.'));
    }

    function loadRecentActivity() {
        const container = document.getElementById('recent-activity-container');
        fetch(`${API_BASE_URL}/users/me/activity`, { credentials: 'include' })
            .then(res => res.json())
            .then(activities => {
                if (!activities.length) {
                    container.innerHTML = '<p class="text-gray-500">No recent activity found.</p>';
                    return;
                }
                container.innerHTML = activities.map(act => `
                    <div class="rounded-md bg-green-50 p-4 shadow-sm animate-fadeInUp fade-scroll">
                        <p class="font-semibold text-green-700">${act.title}</p>
                        <p class="text-gray-600 text-sm">${act.description}</p>
                        <p class="text-xs text-gray-400 mt-2">${new Date(act.date).toLocaleString()}</p>
                    </div>
                `).join('');
            })
            .catch(() => {
                container.innerHTML = '<p class="text-red-600">Could not load activity.</p>';
            });
    }

    renderProfile();
    document.getElementById('edit-profile-form').addEventListener('submit', handleEditProfile);
    document.getElementById('avatar-upload-form').addEventListener('submit', handleAvatarUpload);
    document.getElementById('change-password-form').addEventListener('submit', handleChangePassword);
    loadRecentActivity();
});