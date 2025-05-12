/**
 * Klassik Asaeda - Main JavaScript
 * Handles cart functionality and UI interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart
    initCart();
    
    // Setup event listeners
    setupEventListeners();
    
    // Handle header scroll effects
    handleHeaderScroll();
    
    // Add SVG icons to replace emojis in features
    addFeatureIcons();
});

/**
 * Initialize shopping cart state
 */
function initCart() {
    // Get cart from localStorage or initialize empty cart
    window.cart = JSON.parse(localStorage.getItem('klassikAsaedaCart')) || {
        items: [],
        total: 0
    };
    
    // Update cart counter
    updateCartCount();
    
    // Render cart items if there are any
    renderCartItems();
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Cart toggle
    const cartToggle = document.getElementById('cart-toggle');
    const closeCart = document.getElementById('close-cart');
    const cartOverlay = document.getElementById('cart-overlay');
    
    if (cartToggle) {
        cartToggle.addEventListener('click', function(e) {
            e.preventDefault();
            cartOverlay.classList.add('active');
            // Prevent body scrolling when cart is open
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (closeCart) {
        closeCart.addEventListener('click', function() {
            cartOverlay.classList.remove('active');
            // Restore body scrolling
            document.body.style.overflow = '';
        });
    }
    
    // Add to cart buttons
    const addToCartButtons = document.querySelectorAll('.btn-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', handleAddToCart);
    });
    
    // Modal add to cart buttons
    const modalAddToCartBtns = document.querySelectorAll('.modal-add-to-cart');
    modalAddToCartBtns.forEach(btn => {
        btn.addEventListener('click', handleModalAddToCart);
    });
    
    // Setup quantity buttons in modals
    setupQuantityControls();
    
    // Checkout button
    const checkoutButton = document.getElementById('checkout-button');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', handleCheckout);
    }
}

/**
 * Handle fixed header appearance on scroll
 */
function handleHeaderScroll() {
    const header = document.querySelector('.site-header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/**
 * Add SVG icons to feature boxes
 */
function addFeatureIcons() {
    const featureBoxes = document.querySelectorAll('.feature-box');
    
    if (featureBoxes.length === 0) return;
    
    // Define SVG icons
    const icons = {
        artists: `<svg class="feature-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>`,
        
        dates: `<svg class="feature-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
        </svg>`,
        
        recordings: `<svg class="feature-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
        </svg>`
    };
    
    // Replace emoji with SVG icons
    featureBoxes.forEach((box, index) => {
        const featureIcon = box.querySelector('.feature-icon');
        if (featureIcon) {
            switch(index) {
                case 0:
                    featureIcon.outerHTML = icons.artists;
                    break;
                case 1:
                    featureIcon.outerHTML = icons.dates;
                    break;
                case 2:
                    featureIcon.outerHTML = icons.recordings;
                    break;
            }
        }
    });
}

/**
 * Setup quantity controls in concert modals
 */
function setupQuantityControls() {
    // For each concert modal
    const concertModals = document.querySelectorAll('.modal');
    
    concertModals.forEach(modal => {
        const addToCartBtn = modal.querySelector('.modal-add-to-cart');
        
        // Check if quantity controls already exist
        if (!modal.querySelector('.ticket-quantity-wrapper') && addToCartBtn) {
            // Get the ticket info div
            const ticketInfo = modal.querySelector('.ticket-info');
            
            if (ticketInfo) {
                // Create quantity control wrapper
                const quantityWrapper = document.createElement('div');
                quantityWrapper.className = 'ticket-quantity-wrapper';
                
                // Create label
                const quantityLabel = document.createElement('div');
                quantityLabel.className = 'ticket-quantity-label';
                quantityLabel.textContent = 'Anzahl:';
                
                // Create quantity control
                const quantityControl = document.createElement('div');
                quantityControl.className = 'ticket-quantity-control';
                
                // Create decrease button
                const decreaseBtn = document.createElement('button');
                decreaseBtn.className = 'ticket-quantity-btn';
                decreaseBtn.textContent = '-';
                decreaseBtn.addEventListener('click', function() {
                    const valueEl = this.parentNode.querySelector('.ticket-quantity-value');
                    let value = parseInt(valueEl.textContent, 10);
                    if (value > 1) {
                        valueEl.textContent = value - 1;
                    }
                });
                
                // Create quantity value
                const quantityValue = document.createElement('span');
                quantityValue.className = 'ticket-quantity-value';
                quantityValue.textContent = '1';
                
                // Create increase button
                const increaseBtn = document.createElement('button');
                increaseBtn.className = 'ticket-quantity-btn';
                increaseBtn.textContent = '+';
                increaseBtn.addEventListener('click', function() {
                    const valueEl = this.parentNode.querySelector('.ticket-quantity-value');
                    let value = parseInt(valueEl.textContent, 10);
                    valueEl.textContent = value + 1;
                });
                
                // Assemble quantity control
                quantityControl.appendChild(decreaseBtn);
                quantityControl.appendChild(quantityValue);
                quantityControl.appendChild(increaseBtn);
                
                // Assemble quantity wrapper
                quantityWrapper.appendChild(quantityLabel);
                quantityWrapper.appendChild(quantityControl);
                
                // Insert before the add to cart button
                ticketInfo.insertBefore(quantityWrapper, addToCartBtn);
            }
        }
    });
}

/**
 * Handle add to cart from regular buttons
 */
function handleAddToCart() {
    // Get concert details from the closest concert card
    const concertCard = this.closest('.concert-card');
    
    if (!concertCard) return;
    
    const title = concertCard.querySelector('h3').textContent;
    const date = concertCard.querySelector('.detail-text') ? 
                concertCard.querySelector('.detail-text').textContent : '';
    
    // Get price (handle sale prices)
    const salePrice = concertCard.querySelector('.sale-price');
    const regularPrice = concertCard.querySelector('.concert-price');
    
    let price;
    if (salePrice) {
        price = parseFloat(salePrice.textContent.replace('€', '').replace(',', '.').trim());
    } else if (regularPrice) {
        price = parseFloat(regularPrice.textContent.replace('€', '').replace(',', '.').trim());
    } else {
        price = 0;
    }
    
    // Create unique ID for this concert
    const concertId = title.toLowerCase().replace(/\s+/g, '-');
    
    // Add to cart with quantity of 1
    addToCart(concertId, title, date, price, 1);
    
    // Show success message
    showToast('Ticket zum Warenkorb hinzugefügt!');
}

/**
 * Handle add to cart from modal
 */
function handleModalAddToCart() {
    const modal = this.closest('.modal');
    
    if (!modal) return;
    
    const title = modal.querySelector('.modal-header h2').textContent;
    const date = modal.querySelector('.modal-date').textContent;
    
    // Get price (handle sale prices)
    const salePrice = modal.querySelector('.sale-price');
    const regularPrice = modal.querySelector('.ticket-price').lastElementChild;
    
    let price;
    if (salePrice) {
        price = parseFloat(salePrice.textContent.replace('€', '').replace(',', '.').trim());
    } else if (regularPrice) {
        price = parseFloat(regularPrice.textContent.replace('€', '').replace(',', '.').trim());
    } else {
        price = 0;
    }
    
    // Get quantity
    const quantityValue = modal.querySelector('.ticket-quantity-value');
    const quantity = quantityValue ? parseInt(quantityValue.textContent, 10) : 1;
    
    // Create unique ID for this concert
    const concertId = title.toLowerCase().replace(/\s+/g, '-');
    
    // Add to cart
    addToCart(concertId, title, date, price, quantity);
    
    // Close modal and open cart
    closeModals();
    document.getElementById('cart-overlay').classList.add('active');
    
    // Show success message
    showToast('Tickets zum Warenkorb hinzugefügt!');
}

/**
 * Add item to cart
 */
function addToCart(id, title, date, price, quantity) {
    // Check if already in cart
    const existingItem = window.cart.items.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        window.cart.items.push({
            id: id,
            title: title,
            date: date,
            price: price,
            quantity: quantity
        });
    }
    
    // Update cart
    recalculateCart();
    saveCart();
    updateCartCount();
    renderCartItems();
}

/**
 * Recalculate cart total
 */
function recalculateCart() {
    window.cart.total = window.cart.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
}

/**
 * Save cart to localStorage
 */
function saveCart() {
    localStorage.setItem('klassikAsaedaCart', JSON.stringify(window.cart));
}

/**
 * Update cart item count in header
 */
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    
    if (!cartCount) return;
    
    const itemCount = window.cart.items.reduce((count, item) => {
        return count + item.quantity;
    }, 0);
    
    cartCount.textContent = itemCount;
}

/**
 * Render cart items in the cart overlay
 */
function renderCartItems() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const emptyCartMessage = document.querySelector('.empty-cart-message');
    const checkoutButton = document.getElementById('checkout-button');
    const totalPrice = document.querySelector('.total-price');
    
    if (!cartItemsContainer) return;
    
    // Clear existing items
    while (cartItemsContainer.firstChild) {
        if (cartItemsContainer.firstChild === emptyCartMessage) break;
        cartItemsContainer.removeChild(cartItemsContainer.firstChild);
    }
    
    // Show/hide empty cart message
    if (window.cart.items.length === 0) {
        if (emptyCartMessage) emptyCartMessage.style.display = 'block';
        if (checkoutButton) checkoutButton.disabled = true;
    } else {
        if (emptyCartMessage) emptyCartMessage.style.display = 'none';
        if (checkoutButton) checkoutButton.disabled = false;
        
        // Add each item to cart
        window.cart.items.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.dataset.id = item.id;
            
            const itemTitle = document.createElement('div');
            itemTitle.className = 'cart-item-title';
            itemTitle.textContent = item.title;
            
            const itemDetails = document.createElement('div');
            itemDetails.className = 'cart-item-details';
            itemDetails.textContent = item.date;
            
            const itemControls = document.createElement('div');
            itemControls.className = 'cart-item-controls';
            
            // Quantity control
            const quantityControl = document.createElement('div');
            quantityControl.className = 'quantity-control';
            
            const decreaseBtn = document.createElement('button');
            decreaseBtn.className = 'quantity-btn';
            decreaseBtn.textContent = '-';
            decreaseBtn.addEventListener('click', function() {
                updateCartItemQuantity(item.id, -1);
            });
            
            const quantityValue = document.createElement('span');
            quantityValue.className = 'quantity-value';
            quantityValue.textContent = item.quantity;
            
            const increaseBtn = document.createElement('button');
            increaseBtn.className = 'quantity-btn';
            increaseBtn.textContent = '+';
            increaseBtn.addEventListener('click', function() {
                updateCartItemQuantity(item.id, 1);
            });
            
            quantityControl.appendChild(decreaseBtn);
            quantityControl.appendChild(quantityValue);
            quantityControl.appendChild(increaseBtn);
            
            // Item price
            const itemPrice = document.createElement('div');
            itemPrice.className = 'cart-item-price';
            itemPrice.textContent = `€${(item.price * item.quantity).toFixed(2).replace('.', ',')}`;
            
            const removeButton = document.createElement('button');
            removeButton.className = 'remove-from-cart';
            removeButton.textContent = 'Entfernen';
            removeButton.addEventListener('click', function() {
                removeFromCart(item.id);
            });
            
            itemControls.appendChild(quantityControl);
            itemControls.appendChild(itemPrice);
            
            cartItem.appendChild(itemTitle);
            cartItem.appendChild(itemDetails);
            cartItem.appendChild(itemControls);
            cartItem.appendChild(removeButton);
            
            cartItemsContainer.insertBefore(cartItem, emptyCartMessage);
        });
    }
    
    // Update total price
    if (totalPrice) {
        totalPrice.textContent = `€${window.cart.total.toFixed(2).replace('.', ',')}`;
    }
}

/**
 * Update quantity of an item in the cart
 */
function updateCartItemQuantity(id, change) {
    const item = window.cart.items.find(item => item.id === id);
    
    if (!item) return;
    
    item.quantity += change;
    
    // Remove item if quantity is 0
    if (item.quantity <= 0) {
        removeFromCart(id);
        return;
    }
    
    // Update cart
    recalculateCart();
    saveCart();
    updateCartCount();
    renderCartItems();
}

/**
 * Remove item from cart
 */
function removeFromCart(id) {
    window.cart.items = window.cart.items.filter(item => item.id !== id);
    
    // Update cart
    recalculateCart();
    saveCart();
    updateCartCount();
    renderCartItems();
}

/**
 * Handle checkout
 */
function handleCheckout() {
    // Here you would implement the checkout process
    alert('Checkout functionality would be implemented here.');
    
    // For demo purposes, we'll just clear the cart
    window.cart.items = [];
    recalculateCart();
    saveCart();
    updateCartCount();
    renderCartItems();
    
    // Close cart
    document.getElementById('cart-overlay').classList.remove('active');
    document.body.style.overflow = '';
    
    // Show success message
    showToast('Vielen Dank für Ihren Einkauf!');
}

/**
 * Display a toast notification
 */
function showToast(message) {
    // Check if toast already exists
    let toast = document.querySelector('.toast');
    
    if (!toast) {
        // Create toast element
        toast = document.createElement('div');
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    
    // Set message
    toast.textContent = message;
    
    // Show toast
    toast.classList.add('show');
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

/**
 * Close all active modals
 */
function closeModals() {
    const activeModals = document.querySelectorAll('.modal.active');
    const modalOverlay = document.querySelector('.modal-overlay');
    
    activeModals.forEach(modal => {
        modal.classList.remove('active');
    });
    
    if (modalOverlay) {
        modalOverlay.classList.remove('active');
    }
    
    document.body.style.overflow = '';
}
