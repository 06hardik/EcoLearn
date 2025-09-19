// This script runs AFTER auth.js
document.addEventListener('auth-check-complete', () => {
    const API_BASE_URL = 'https://ecolearn-8436.onrender.com/api';
    const currentUser = window.currentUser;
    let cart = [];
    let pointsToUse = 0;
    const productsContainer = document.querySelector('.grid');
    const cartCountSpan = document.getElementById('cart-count');
    const summarySubtotal = document.getElementById('summary-subtotal');
    const summaryTotal = document.getElementById('summary-total');
    const summaryDiscount = document.getElementById('summary-discount');
    const discountRow = document.getElementById('discount-row');
    const checkoutButton = document.getElementById('checkout-button');
    const cartItemsContainer = document.getElementById('cart-items-container');

    const pointsSection = document.getElementById('points-section');
    const userPointsSpan = document.getElementById('user-points');
    const applyPointsButton = document.getElementById('apply-points-button');
    const pointsInput = document.getElementById('points-input');

    const initializePage = () => {
        if (currentUser && pointsSection) {
            pointsSection.classList.remove('hidden');
            userPointsSpan.textContent = currentUser.points || 0;
        }
        fetchProducts();
        updateOrderSummary();
    };

    const fetchProducts = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/products`);
            if (!response.ok) throw new Error('Network response was not ok');
            const products = await response.json();
            productsContainer.innerHTML = '';
            
            products.forEach((product, idx) => {
                const productCard = document.createElement('div');
                productCard.className = 'bg-white rounded-xl shadow-lg p-6 border border-green-100 card-animated animate-scaleUp';
                productCard.style.animationDelay = `${idx * 100}ms`;
                
                productCard.innerHTML = `
                    <img src="${product.imageUrl || 'https://via.placeholder.com/400x200'}" alt="${product.name}" class="w-full h-40 object-cover rounded-lg mb-4">
                    <h2 class="text-xl font-bold text-green-800 mb-2">${product.name}</h2>
                    <p class="text-gray-600 mb-2 flex-grow">${product.description}</p>
                    <p class="text-green-700 font-bold text-lg mb-4">₹${product.price.toFixed(2)}</p>
                    <button class="add-to-cart-button w-full py-2 px-4 bg-gradient-to-r from-green-500 to-green-400 text-white font-bold rounded-md hover:from-green-600 hover:to-green-500 btn-ripple" data-product-id="${product._id}">Add to Cart</button>
                `;
                productsContainer.appendChild(productCard);
            });
        } catch (error) {
            console.error("Failed to fetch products:", error);
            productsContainer.innerHTML = '<p class="text-red-500">Could not load products.</p>';
        }
    };
    
    const updateOrderSummary = () => {
        if (!summarySubtotal) return;

        const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
        const discountAmount = pointsToUse; 
        const total = Math.max(0, subtotal - discountAmount); // Ensure total isn't negative

        summarySubtotal.textContent = `₹${subtotal.toFixed(2)}`;
        summaryTotal.textContent = `₹${total.toFixed(2)}`;

        if (discountAmount > 0) {
            summaryDiscount.textContent = `-₹${discountAmount.toFixed(2)}`;
            discountRow.classList.remove('hidden');
            discountRow.classList.add('flex');
        } else {
            discountRow.classList.add('hidden');
        }
        
        const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
        if (cartCountSpan) {
            cartCountSpan.textContent = totalItems;
            cartCountSpan.classList.toggle('hidden', totalItems === 0);
        }
        
        if (cartItemsContainer) {
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = '<p class="text-gray-500">Your cart is empty.</p>';
            } else {
                cartItemsContainer.innerHTML = cart.map(item => `
                    <div class="flex justify-between items-center text-sm">
                        <span class="text-gray-800">${item.product.name} (x${item.quantity})</span>
                        <span class="font-semibold">₹${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                `).join('');
            }
        }

        checkoutButton.disabled = cart.length === 0;
    };


    productsContainer.addEventListener('click', async (e) => {
        const button = e.target.closest('.add-to-cart-button');
        if (!button) return;

        const productId = button.dataset.productId;
        const existingItem = cart.find(item => item.product._id === productId);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            try {
                const response = await fetch(`${API_BASE_URL}/products/${productId}`);
                if (!response.ok) throw new Error('Product not found');
                const product = await response.json();
                cart.push({ product: product, quantity: 1 });
            } catch (error) {
                console.error("Error adding product to cart:", error);
                alert("Could not add product to cart. Please try again.");
                return;
            }
        }
        
        button.textContent = 'Added!';
        setTimeout(() => { button.textContent = 'Add to Cart'; }, 1000);

        updateOrderSummary();
    });

    if (applyPointsButton) {
        applyPointsButton.addEventListener('click', () => {
            const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
            const pointsValue = parseInt(pointsInput.value, 10);
            
            if (isNaN(pointsValue) || pointsValue < 0) {
                alert("Please enter a valid number of points.");
                pointsToUse = 0;
            } else if (pointsValue > currentUser.points) {
                alert('You cannot use more points than you have.');
                pointsToUse = 0;
            } else if (pointsValue > subtotal) {
                alert(`You can only apply points up to the subtotal amount of ₹${subtotal.toFixed(2)}.`);
                pointsToUse = 0;
            } else {
                pointsToUse = pointsValue;
                alert(`${pointsToUse} points applied successfully!`);
            }
            updateOrderSummary();
        });
    }

    checkoutButton.addEventListener('click', () => {
        if (!currentUser) {
            alert('Please log in to proceed to checkout.');
            return;
        }
        if (cart.length === 0) {
            alert('Your cart is empty.');
            return;
        }
        alert(`Proceeding to checkout. Points to use: ${pointsToUse}`);
    });

    initializePage();
});
