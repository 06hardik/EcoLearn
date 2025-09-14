// This runs after auth.js because it's included second
document.addEventListener('DOMContentLoaded', () => {
    
    const fetchFeaturedCampaigns = async () => {
        const campaignsContainer = document.getElementById('campaigns-container');
        if (!campaignsContainer) return;

        try {
            // We don't have a specific "featured" route, so we'll fetch all events and take the first 3
            const response = await fetch(`${API_BASE_URL}/events`); // Using the API_BASE_URL from auth.js
            const campaigns = await response.json();
            
            campaignsContainer.innerHTML = ''; // Clear the "Loading..." text

            // Display only the first 3 campaigns as "featured"
            campaigns.slice(0, 3).forEach(campaign => {
                const campaignCard = document.createElement('div');
                campaignCard.className = 'flex flex-col gap-4';
                campaignCard.innerHTML = `
                    <div class="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl" style='background-image: url("${campaign.imageUrl}");'></div>
                    <div>
                        <p class="text-gray-800 text-lg font-semibold leading-normal">${campaign.title}</p>
                        <p class="text-gray-500 text-sm font-normal leading-normal">${campaign.description}</p>
                    </div>
                `;
                campaignsContainer.appendChild(campaignCard);
            });

        } catch (error) {
            console.error('Failed to load campaigns:', error);
            campaignsContainer.innerHTML = '<p>Could not load campaigns at this time.</p>';
        }
    };

    fetchFeaturedCampaigns();
});