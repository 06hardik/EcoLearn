// This script runs AFTER auth.js
document.addEventListener('auth-check-complete', () => {
    const API_BASE_URL = 'https://ecolearn-8436.onrender.com/api';
    const currentUser = window.currentUser;

    const initializePage = () => {
        if (!currentUser) {
            window.location.href = './index.html';
            return;
        }

        const surveyForm = document.querySelector('form');
        if (surveyForm) {
            surveyForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const surveyData = {
                    householdSize: document.getElementById('household-size').value,
                    wasteAmount: document.getElementById('waste-amount').value,
                    wasteType: document.getElementById('waste-type').value
                };

                try {
                    const response = await fetch(`${API_BASE_URL}/users/survey`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(surveyData),
                        credentials: 'include'
                    });

                    if (response.ok) {
                        alert('Thank you! Your survey has been submitted.');
                        window.location.href = './leaderboard.html';
                    } else {
                        const errorData = await response.json();
                        alert(`Submission Failed: ${errorData.message}`);
                    }
                } catch (error) {
                    console.error('Survey submission error:', error);
                    alert('An error occurred. Please try again.');
                }
            });
        }
    };
    
    setTimeout(initializePage, 100); 
});