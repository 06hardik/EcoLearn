// This script runs AFTER auth.js
document.addEventListener('auth-check-complete', () => {
    const API_BASE_URL = 'https://ecolearn-8436.onrender.com/api';
    const currentUser = window.currentUser;
    let cart = [];
    let pointsToUse = 0;
    const SHIPPING_COST = 5.00;

    const productsContainer = document.getElementById('products-container');
    const cartCountSpan = document.getElementById('cart-count');
    const summarySubtotal = document.getElementById('summary-subtotal');
    const summaryShipping = document.getElementById('summary-shipping');
    const summaryTotal = document.getElementById('summary-total');
    const summaryDiscount = document.getElementById('summary-discount');
    const summaryGrandTotal = document.getElementById('summary-grand-total');
    const discountRow = document.getElementById('discount-row');
    const pointsSection = document.getElementById('points-section');
    const userPointsSpan = document.getElementById('user-points');
    const applyPointsButton = document.getElementById('apply-points-button');
    const pointsInput = document.getElementById('points-input');
    const checkoutButton = document.getElementById('checkout-button');
    
    const initializePage = () => {
        if(currentUser) {
            pointsSection.classList.remove('hidden');
            userPointsSpan.textContent = currentUser.points;
        }
        fetchProducts();
        updateOrderSummary(); 
    };

    const fetchProducts = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/products`);
            const products = await response.json();
            productsContainer.innerHTML = '';
            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'group flex flex-col overflow-hidden rounded-lg shadow-sm hover:shadow-lg bg-white';
                productCard.innerHTML = `
                    <div class="relative">
                        <div class="w-full bg-center bg-no-repeat aspect-square bg-cover" style="background-image: url('${product.imageUrl}');"></div>
                        <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button data-product-id="${product._id}" class="add-to-cart-button bg-green-600 text-white rounded-full px-4 py-2 text-sm font-semibold">Add to Cart</button>
                        </div>
                    </div>
                    <div class="p-4 flex-1 flex flex-col">
                        <h3 class="text-base font-semibold text-gray-800">${product.name}</h3>
                        <p class="text-sm text-gray-500 mt-1">${product.description}</p>
                        <p class="text-lg font-bold text-green-700 mt-auto pt-2">$${product.price.toFixed(2)}</p>
                    </div>`;
                productsContainer.appendChild(productCard);
            });
        } catch (error) {
            productsContainer.innerHTML = '<p>Could not load products.</p>';
        }
    };

    const updateOrderSummary = () => {
        const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const shipping = subtotal > 0 ? SHIPPING_COST : 0;
        const total = subtotal + shipping;
        const discountAmount = pointsToUse * 0.10;
        const grandTotal = total - discountAmount;

        summarySubtotal.textContent = `$${subtotal.toFixed(2)}`;
        summaryShipping.textContent = `$${shipping.toFixed(2)}`;
        summaryTotal.textContent = `$${total.toFixed(2)}`;
        summaryGrandTotal.textContent = `$${grandTotal.toFixed(2)}`;
        cartCountSpan.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);

        if (discountAmount > 0) {
            summaryDiscount.textContent = `-$${discountAmount.toFixed(2)}`;
            discountRow.classList.remove('hidden');
            discountRow.classList.add('flex');
        } else {
            discountRow.classList.add('hidden');
        }
    };

    productsContainer.addEventListener('click', async (e) => {
        const button = e.target.closest('.add-to-cart-button');
        if (!button) return;

        const productId = button.dataset.productId;
        const existingItem = cart.find(item => item.product === productId);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            const response = await fetch(`${API_BASE_URL}/products/${productId}`);
            const product = await response.json();
            cart.push({ product: product._id, name: product.name, quantity: 1, price: product.price });
        }
        updateOrderSummary();
    });

    applyPointsButton.addEventListener('click', () => {
        const points = parseInt(pointsInput.value, 10);
        if (isNaN(points) || points < 0) {
            pointsToUse = 0;
        } else if (points > currentUser.points) {
            alert('You cannot use more points than you have.');
            pointsToUse = 0;
            pointsInput.value = 0;
        } else {
            pointsToUse = points;
        }
        updateOrderSummary();
    });

    checkoutButton.addEventListener('click', async () => {
        if (!currentUser) {
            alert('Please log in to proceed to payment.');
            return;
        }
        if (cart.length === 0) {
            alert('Your cart is empty.');
            return;
        }

        checkoutButton.disabled = true;
        checkoutButton.textContent = 'Processing...';

        try {
            const orderData = {
                items: cart.map(item => ({ product: item.product, quantity: item.quantity })),
                pointsUsed: pointsToUse
            };
            const response = await fetch(`${API_BASE_URL}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData),
                credentials: 'include'
            });
            if (response.ok) {
                alert('Order placed successfully!');
                cart = [];
                pointsToUse = 0;
                window.location.reload();
            } else {
                const error = await response.json();
                alert(`Order failed: ${error.message}`);
            }
        } catch (error) {
            alert('An error occurred during checkout.');
        } finally {
            checkoutButton.disabled = false;
            checkoutButton.innerHTML = `<span class="material-symbols-outlined">lock</span> Proceed to Payment`;
        }
    });

    setTimeout(initializePage, 100); 
});