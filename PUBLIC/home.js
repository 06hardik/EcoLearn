// This script runs AFTER auth.js
document.addEventListener("DOMContentLoaded", () => {
  const fetchFeaturedCampaigns = async () => {
    const campaignsContainer = document.getElementById("campaigns-container");
    if (!campaignsContainer) return;

    try {
      const response = await fetch(`${API_BASE_URL}/events`);
      if (!response.ok) throw new Error("Failed to fetch");
      const campaigns = await response.json();

      campaignsContainer.innerHTML = "";
      campaigns.slice(0, 3).forEach((campaign) => {
        const campaignCard = document.createElement("div");
        campaignCard.className = "flex flex-col gap-4";
        campaignCard.innerHTML = `
                    <div class="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl" style="background-image: url('${campaign.imageUrl}');"></div>
                    <div>
                        <p class="text-gray-800 text-lg font-semibold">${campaign.title}</p>
                        <p class="text-gray-500 text-sm">${campaign.description}</p>
                    </div>
                `;
        campaignsContainer.appendChild(campaignCard);
      });
    } catch (error) {
      console.error("Failed to load campaigns:", error);
      campaignsContainer.innerHTML = "<p>Could not load campaigns.</p>";
    }
  };

  // --- Form Submission Logic ---
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
            alert('hi')
        const data = await response.json();
          // Log the full object to the browser's console
        console.log("Login successful, response data:", data);
          window.location.reload();
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
          alert("Registration successful! Please log in.");
          // The modal switching is handled in auth.js, so we can just trigger it
          document.querySelector(".close-modal-button").click();
          setTimeout(() => document.getElementById("loginButton").click(), 260);
        } else {
          const errorData = await response.json();
          alert(`Registration Failed: ${errorData.message}`);
        }
      } catch (error) {
        alert("An error occurred during registration.");
      }
    });
  }

  fetchFeaturedCampaigns();
});
