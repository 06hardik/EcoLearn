document.addEventListener('auth-check-complete', () => {
    const API_BASE_URL = 'https://ecolearn-8436.onrender.com/api';
    const currentUser = window.currentUser;

    const fetchFeaturedCampaigns = async () => {
        const campaignsContainer = document.getElementById("campaigns-container");
        if (!campaignsContainer) return;

        try {
            const response = await fetch(`${API_BASE_URL}/events`);
            if (!response.ok) throw new Error("Failed to fetch campaigns");
            
            const campaigns = await response.json();

            const featuredCampaigns = campaigns.sort(() => 0.5 - Math.random()).slice(0, 3);
            campaignsContainer.innerHTML = ""; 
            featuredCampaigns.forEach((campaign) => {
                const campaignCard = document.createElement("div");
                campaignCard.className = "bg-white rounded-lg shadow-sm overflow-hidden text-center";
                campaignCard.innerHTML = `
                    <img src="${campaign.imageUrl || 'https://i.imgur.com/T0a3aJh.png'}" alt="${campaign.title}" class="w-full h-60 object-cover">
                    <div class="p-6">
                        <h3 class="text-xl font-bold text-gray-800">${campaign.title}</h3>
                        <p class="text-gray-600 mt-2">${campaign.description}</p>
                    </div>
                `;
                campaignsContainer.appendChild(campaignCard);
            });

        } catch (error) {
            console.error("Failed to load campaigns:", error);
            campaignsContainer.innerHTML = "<p>Could not load featured campaigns.</p>";
        }
    };

    fetchFeaturedCampaigns();

    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("login-email").value;
            const password = document.getElementById("login-password").value;
            try {
                const response = await fetch(`${API_BASE_URL}/users/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                    credentials: "include",
                });
                if (response.ok) {
                } else {
                    const errorData = await response.json();
                    alert(`Login Failed: ${errorData.message}`);
                }
            } catch (error) {
                alert("An error occurred during login.");
            }
        });
    }

    const signupForm = document.getElementById("signup-form");
    if (signupForm) {
        signupForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const name = document.getElementById("signup-name").value;
            const email = document.getElementById("signup-email").value;
            const password = document.getElementById("signup-password").value;
            try {
                const response = await fetch(`${API_BASE_URL}/users/register`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, password }),
                });
                if (response.ok) {
                    document.querySelector("#signup-modal .close-modal-button").click();
                    setTimeout(() => document.getElementById("login-button").click(), 260);
                } else {
                    const errorData = await response.json();
                    alert(`Registration Failed: ${errorData.message}`);
                }
            } catch (error) {
                alert("An error occurred during registration.");
            }
        });
    }
});
