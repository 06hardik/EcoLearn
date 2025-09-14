const API_BASE_URL = 'http://localhost:8000/api';

document.addEventListener('DOMContentLoaded', async () => {
    const loginButton = document.getElementById('login-button');
    const userAvatarContainer = document.getElementById('user-avatar-container');
    const userAvatarImg = document.getElementById('user-avatar-img');
    const logoutButton = document.getElementById('logout-button');
    
    // You no longer need to check localStorage for a token.
    // The browser handles sending the cookie automatically.

    try {
        // We just need to ask the backend for the current user.
        // If the cookie is valid, the backend will send back user data.
        const response = await fetch(`${API_BASE_URL}/users/current-user`, {
            credentials: 'include', // **IMPORTANT**: This tells fetch to send cookies
        });

        if (response.ok) {
            const user = await response.json();
            loginButton.classList.add('hidden');
            userAvatarContainer.classList.remove('hidden');
            userAvatarImg.src = user.avatarUrl || 'default-avatar.png';
        }
    } catch (error) {
        console.error('Authentication check failed:', error);
    }

    // Logout button now needs to call the backend logout endpoint
    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            await fetch(`${API_BASE_URL}/users/logout`, { 
                method: 'POST',
                credentials: 'include' 
            });
            window.location.href = '/home.html';
        });
    }
});