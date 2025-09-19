const API_BASE_URL = 'https://ecolearn-8436.onrender.com/api';
window.currentUser=null;

document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('login-button');
    const userAvatarContainer = document.getElementById('user-avatar-container');
    const userAvatarImg = document.getElementById('user-avatar-img');
    const logoutButton = document.getElementById('logout-button');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const loginModal = document.getElementById('login-modal');
    const signupModal = document.getElementById('signup-modal');
    const closeModalButtons = document.querySelectorAll('.close-modal-button');
    const showSignupLinks = document.querySelectorAll('.show-signup-modal');
    const showLoginLinks = document.querySelectorAll('.show-login-modal');

    const checkAuthStatus = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/users/current-user`, { credentials: 'include' });
            console.log(response);
           if (response.ok) {
                window.currentUser = await response.json();
                if (loginButton) loginButton.classList.add('hidden');
                if (userAvatarContainer) userAvatarContainer.classList.remove('hidden');
                if (userAvatarImg) userAvatarImg.src = window.currentUser.avatarUrl || 'https://via.placeholder.com/150';
            } else {
                window.currentUser = null;
                if (loginButton) loginButton.classList.remove('hidden');
                if (userAvatarContainer) userAvatarContainer.classList.add('hidden');
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            window.currentUser = null;
            if (loginButton) loginButton.classList.remove('hidden');
            if (userAvatarContainer) userAvatarContainer.classList.add('hidden');
        } finally {
            document.dispatchEvent(new Event('auth-check-complete'));
        }
    };

    const handleLogout = async () => {
        const resp = await fetch(`${API_BASE_URL}/users/logout`, { method: 'POST', credentials: 'include' });
        window.location.href = './index.html';
    };

    const openModal = (modal) => {
        if (!modal) return;
        modalBackdrop.classList.remove('hidden');
        modal.classList.remove('hidden');
        setTimeout(() => {
            modalBackdrop.classList.remove('opacity-0');
            modal.classList.remove('opacity-0');
        }, 10);
    };

    const closeModal = () => {
        modalBackdrop.classList.add('opacity-0');
        if (loginModal) loginModal.classList.add('opacity-0');
        if (signupModal) signupModal.classList.add('opacity-0');
        setTimeout(() => {
            modalBackdrop.classList.add('hidden');
            if (loginModal) loginModal.classList.add('hidden');
            if (signupModal) signupModal.classList.add('hidden');
        }, 250);
    };

    if (loginButton) loginButton.addEventListener('click', () => openModal(loginModal));
    if (logoutButton) logoutButton.addEventListener('click', handleLogout);
    
    if (userAvatarImg) {
        userAvatarImg.addEventListener('click', (event) => {
            event.stopPropagation();
            if (dropdownMenu) dropdownMenu.classList.toggle('hidden');
        });
    }

    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
    closeModalButtons.forEach(btn => btn.addEventListener('click', closeModal));
    showSignupLinks.forEach(link => link.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal();
        setTimeout(() => openModal(signupModal), 260);
    }));
    showLoginLinks.forEach(link => link.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal();
        setTimeout(() => openModal(loginModal), 260);
    }));
    
    window.addEventListener('click', () => {
        if (dropdownMenu && !dropdownMenu.classList.contains('hidden')) {
            dropdownMenu.classList.add('hidden');
        }
    });

    checkAuthStatus();
});
