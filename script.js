document.addEventListener('DOMContentLoaded', () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    document.getElementById('product-card')?.addEventListener('click', (event) => {
        if (event.target.closest('.add-to-cart')) {
            const button = event.target.closest('.add-to-cart');
            const product = {
                id: button.dataset.id,
                name: button.dataset.name,
                price: button.dataset.price,
                image: button.dataset.image
            };
            addToCart(product);
        }

        if (event.target.closest('.add-to-wishlist')) {
            const button = event.target.closest('.add-to-wishlist');
            const product = {
                id: button.dataset.id,
                name: button.dataset.name,
                price: button.dataset.price,
                image: button.dataset.image
            };
            addToWishlist(product);
        }
    });

    function addToCart(product) {
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function addToWishlist(product) {
        wishlist.push(product);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }

    if (window.location.pathname.includes('cart.html')) {
        loadCartItems();
        setupClearCartButton();
    }

    if (window.location.pathname.includes('wishlist.html')) {
        loadWishlistItems();

        // Add double-click functionality to remove specific items
        const wishlistItemsContainer = document.getElementById('wishlist-items-container');
        wishlistItemsContainer.addEventListener('dblclick', (event) => {
            const card = event.target.closest('.card');
            if (card) {
                const itemName = card.querySelector('h3').textContent;
                const updatedWishlist = wishlist.filter(item => item.name !== itemName);
                localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
                location.reload();
            }
        });
    }

    // Ensure heart icons in index.html only toggle on single click
    document.querySelectorAll('.add-to-wishlist').forEach(icon => {
        icon.addEventListener('dblclick', (event) => {
            event.stopPropagation(); // Prevent adding items on double-click
        });
    });

    function loadCartItems() {
        const cartItemsContainer = document.getElementById('cart-items-container');
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
            return;
        }
        cart.forEach((item, idx) => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('col-md-3', 'py-3', 'py-md-0');
            itemDiv.innerHTML = `
                <div class="card">
                    <img src="images/png/${item.image}" alt="${item.name}" style="width: 100%; height: auto;">
                    <div class="card-body">
                        <h3 class="text-center">${item.name}</h3>
                        <p class="text-center">Price: $${item.price}</p>
                        <label for="quantity-${idx}">Quantity:</label>
                        <input type="number" class="form-control cart-qty-input" id="quantity-${idx}" data-idx="${idx}" min="1" max="15" value="${item.quantity ? item.quantity : 1}" style="width:90px;display:inline-block;margin-left:8px;">
                        <button class="btn btn-danger btn-delete-cart" data-idx="${idx}">Delete</button>
                        <div class="star text-center">
                            <i class="fa-solid fa-star checked"></i>
                            <i class="fa-solid fa-star checked"></i>
                            <i class="fa-solid fa-star checked"></i>
                            <i class="fa-solid fa-star checked"></i>
                            <i class="fa-solid fa-star checked"></i>
                        </div>
                    </div>
                </div>
            `;
            cartItemsContainer.appendChild(itemDiv);
        });
        // Add delete event listeners
        document.querySelectorAll('.btn-delete-cart').forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = parseInt(btn.getAttribute('data-idx'));
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                cart.splice(idx, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                loadCartItems();
                document.querySelectorAll('.cart-count').forEach(span => {
                    span.textContent = cart.length;
                });
            });
        });
        // Add quantity change event listeners
        document.querySelectorAll('.cart-qty-input').forEach(input => {
            input.addEventListener('change', function() {
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                const idx = parseInt(this.getAttribute('data-idx'));
                let val = parseInt(this.value);
                if (isNaN(val) || val < 1) val = 1;
                if (val > 15) val = 15;
                this.value = val;
                cart[idx].quantity = val;
                localStorage.setItem('cart', JSON.stringify(cart));
            });
        });
    }

    function loadWishlistItems() {
        const wishlistItemsContainer = document.getElementById('wishlist-items-container');
        if (wishlist.length === 0) {
            wishlistItemsContainer.innerHTML = '<p>Your wishlist is empty.</p>';
            return;
        }

        wishlist.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('col-md-3', 'py-3', 'py-md-0');
            itemDiv.innerHTML = `
                <div class="card">
                    <img src="images/png/${item.image}" alt="${item.name}" style="width: 100%; height: auto;">
                    <div class="card-body">
                        <h3 class="text-center">${item.name}</h3>
                        <p class="text-center">Price: $${item.price}</p>
                        <div class="star text-center">
                            <i class="fa-solid fa-star checked"></i>
                            <i class="fa-solid fa-star checked"></i>
                            <i class="fa-solid fa-star checked"></i>
                            <i class="fa-solid fa-star checked"></i>
                            <i class="fa-solid fa-star checked"></i>
                        </div>
                    </div>
                </div>
            `;
            wishlistItemsContainer.appendChild(itemDiv);
        });
    }

    function setupClearCartButton() {
        const clearCartButton = document.getElementById('clear-cart');
        if (clearCartButton) {
            clearCartButton.addEventListener('click', () => {
                localStorage.removeItem('cart');
                location.reload();
            });
        }
    }
});



