document.addEventListener('auth-check-complete', () => {
    const API_BASE_URL = 'https://ecolearn-8436.onrender.com/api';
    const currentUser = window.currentUser;
    const shopContainer = document.querySelector('.grid');

    async function fetchProducts() {
        try {
            const response = await fetch(`${API_BASE_URL}/products`);
            if (!response.ok) throw new Error('Failed to fetch products');
            const products = await response.json();
            renderProducts(products);
        } catch (error) {
            if (shopContainer) shopContainer.innerHTML = `<p class="text-red-600">Could not load products.</p>`;
        }
    }

    function renderProducts(products) {
        if (!shopContainer) return;
        shopContainer.innerHTML = '';
        products.forEach((product, idx) => {
            const card = document.createElement('div');
            card.className = `bg-white rounded-xl shadow-lg p-6 border border-green-100 card-animated animate-scaleUp delay-${idx + 2}`;
            card.innerHTML = `
                <img src="${product.imageUrl || 'https://via.placeholder.com/400x200'}" alt="${product.name}" class="w-full h-40 object-cover rounded-lg mb-4 animate-bounceIn delay-${idx + 3}">
                <h2 class="text-xl font-bold text-green-800 mb-2">${product.name}</h2>
                <p class="text-gray-600 mb-2">${product.description}</p>
                <p class="text-green-700 font-bold mb-4">₹${product.price}</p>
                <button class="w-full py-2 px-4 bg-gradient-to-r from-green-500 to-green-400 text-white font-bold rounded-md hover:from-green-600 hover:to-green-500 btn-ripple animate-bounceIn delay-${idx + 4}" data-id="${product._id}">Add to Cart</button>
            `;
            shopContainer.appendChild(card);
        });

        // Add to cart event listeners
        shopContainer.querySelectorAll('button[data-id]').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const productId = btn.getAttribute('data-id');
                try {
                    const res = await fetch(`${API_BASE_URL}/cart`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ productId }),
                        credentials: 'include'
                    });
                    if (res.ok) {
                        alert('Added to cart!');
                    } else {
                        alert('Could not add to cart.');
                    }
                } catch {
                    alert('Error adding to cart.');
                }
            });
        });
    }

    fetchProducts();
});