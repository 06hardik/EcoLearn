// This script runs AFTER auth.js
document.addEventListener('DOMContentLoaded', () => {
    // Note: API_BASE_URL and currentUser are available from auth.js

    const initializePage = () => {
        // --- Page Protection ---
        if (!currentUser) {
            window.location.href = '/home.html';
            return;
        }

        // --- Handle Form Submission ---
        const surveyForm = document.getElementById('waste-survey-form');
        if (surveyForm) {
            surveyForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const surveyData = {
                    householdSize: document.getElementById('household-size').value,
                    wasteCollectionFrequency: document.getElementById('collection-frequency').value,
                    recyclingPractices: document.getElementById('recycling-practices').value
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
                        window.location.href = '/leaderboard.html';
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
    
    // --- Initial Execution ---
    setTimeout(initializePage, 100); // Run this shortly after auth.js
});