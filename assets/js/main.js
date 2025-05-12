increaseBtn.addEventListener('click', function() {
                    const valueEl = this.parentNode.querySelector('.ticket-quantity-value');
                    let value = parseInt(valueEl.textContent, 10);
                    valueEl.textContent = value + 1;
                /**
 * Replace emoji icons with SVG icons in concert details
 */
function replaceConcertDetailIcons() {
    const concertDetails = document.querySelectorAll('.concert-detail');
    
    if (concertDetails.length === 0) return;
    
    // Define SVG icons
    const icons = {
        date: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="detail-icon">
            <path d="M19,4h-1V3c0-0.6-0.4-1-1-1s-1,0.4-1,1v1H8V3c0-0.6-0.4-1-1-1S6,2.4,6,3v1H5C3.3,4,2,5.3,2,7v12c0,1.7,1.3,3,3,3h14c1.7,0,3-1.3,3-3V7C22,5.3,20.7,4,19,4z M20,19c0,0.6-0.4,1-1,1H5c-0.6,0-1-0.4-1-1V10h16V19z M20,8H4V7c0-0.6,0.4-1,1-1h1v1c0,0.6,0.4,1,1,1s1-0.4,1-1V6h8v1c0,0.6,0.4,1,1,1s1-0.4,1-1V6h1c0.6,0,1,0.4,1,1V8z"/>
        </svg>`,
        
        location: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="detail-icon">
            <path d="M12,2C8.1,2,5,5.1,5,9c0,5.3,7,13,7,13s7-7.7,7-13C19,5.1,15.9,2,12,2z M12,11.5c-1.4,0-2.5-1.1-2.5-2.5s1.1-2.5,2.5-2.5s2.5,1.1,2.5,2.5S13.4,11.5,12,11.5z"/>
        </svg>`,
        
        music: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="detail-icon">
            <path d="M9,17H7c-1.1,0-2,0.9-2,2s0.9,2,2,2h2c1.1,0,2-0.9,2-2S10.1,17,9,17z M19,17h-2c-1.1,0-2,0.9-2,2s0.9,2,2,2h2c1.1,0,2-0.9,2-2S20.1,17,19,17z M22,2c0-0.5-0.3-1-0.8-1.2c-0.5-0.2-1.1,0-1.4,0.4L15,8V3c0-0.5-0.3-1-0.8-1.2C13.7,1.5,13.1,1.8,12.8,2.2L7,9v8l8-5v-3l3.8-4.8C19.5,3.7,20,3,20,2H22z"/>
        </svg>`
    };
    
    // Replace emoji icons with SVG
    concertDetails.forEach((detail, index) => {
        const emojiIcon = detail.querySelector('.detail-icon');
        if (!emojiIcon) return;
        
        // Determine which icon to use based on emoji content or position
        const emojiContent = emojiIcon.textContent.trim();
        
        if (emojiContent === '📅' || index === 0) {
            emojiIcon.outerHTML = icons.date;
        } else if (emojiContent === '📍' || index === 1) {
            emojiIcon.outerHTML = icons.location;
        } else if (emojiContent === '🎵' || index === 2) {
            emojiIcon.outerHTML = icons.music;
        }
    });
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
    try {
        // Get concert details from the closest concert card
        const concertCard = this.closest('.concert-card');
        
        if (!concertCard) return;
        
        const title = concertCard.querySelector('h3').textContent;
        
        // Try to get date from different selectors to handle different layouts
        let date = '';
        if (concertCard.querySelector('.detail-text')) {
            date = concertCard.querySelector('.detail-text').textContent;
        } else if (concertCard.querySelector('.concert-date')) {
            date = concertCard.querySelector('.concert-date').textContent;
        }
        
        // Get price (handle sale prices)
        const salePrice = concertCard.querySelector('.sale-price');
        const regularPrice = concertCard.querySelector('.concert-price');
        
        let price;
        if (salePrice) {
            price = parseFloat(salePrice.textContent.replace('€', '').replace(',', '.').trim());
        } else if (regularPrice) {
            // Handle different formats of price presentation
            const priceText = regularPrice.textContent.trim();
            // This gives us the last part of the string which should contain just the price
            const priceMatch = priceText.match(/€(\d+),?(\d*)?\s*EUR?/);
            if (priceMatch) {
                // Replace comma with dot and convert to float
                price = parseFloat(priceMatch[0].replace('€', '').replace(',', '.').replace('EUR', '').trim());
            } else {
                price = parseFloat(priceText.replace('€', '').replace(',', '.').replace('EUR', '').trim());
            }
        } else {
            price = 0;
            console.error('Konnte keinen Preis finden');
        }
        
        // Create unique ID for this concert
        const concertId = title.toLowerCase().replace(/\s+/g, '-');
        
        // Add to cart with quantity of 1
        addToCart(concertId, title, date, price, 1);
    } catch (error) {
        console.error('Fehler beim Hinzufügen zum Warenkorb:', error);
        showToast('Beim Hinzufügen zum Warenkorb ist ein Fehler aufgetreten.', 'error');
    }
}

/**
 * Handle add to cart from modal
 */
function handleModalAddToCart() {
    try {
        const modal = this.closest('.modal');
        
        if (!modal) return;
        
        const title = modal.querySelector('.modal-header h2').textContent;
        const date = modal.querySelector('.modal-date').textContent;
        
        // Get price (handle sale prices)
        const salePrice = modal.querySelector('.sale-price');
        const regularPrice = modal.querySelector('.ticket-price').lastElementChild || modal.querySelector('.ticket-price');
        
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
    } catch (error) {
        console.error('Fehler beim Hinzufügen zum Warenkorb:', error);
        showToast('Beim Hinzufügen zum Warenkorb ist ein Fehler aufgetreten.', 'error');
    }
}

/**
 * Add item to cart
 */
function addToCart(id, title, date, price, quantity) {
    try {
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
        
        // Show success message
        const message = quantity > 1 
            ? `${quantity} Tickets für "${title}" wurden zum Warenkorb hinzugefügt.`
            : `Ticket für "${title}" wurde zum Warenkorb hinzugefügt.`;
        
        showToast(message, 'success');
    } catch (error) {
        console.error('Fehler beim Hinzufügen zum Warenkorb:', error);
        showToast('Beim Hinzufügen zum Warenkorb ist ein Fehler aufgetreten.', 'error');
    }
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
    
    // Clear existing items except the empty message
    const cartItems = cartItemsContainer.querySelectorAll('.cart-item');
    cartItems.forEach(item => {
        item.remove();
    });
    
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
    
    // Show toast message
    showToast('Artikel wurde aus dem Warenkorb entfernt.', 'success');
}

/**
 * Handle checkout
 */
function handleCheckout() {
    // Here you would implement the checkout process
    alert('Checkout-Funktionalität würde hier implementiert werden.');
    
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
    showToast('Vielen Dank für Ihren Einkauf!', 'success');
}

/**
 * Display a toast notification
 * @param {string} message - The message to display
 * @param {string} type - The type of notification (success or error)
 */
function showToast(message, type = 'success') {
    // Check if toast already exists
    let toast = document.querySelector('.toast');
    
    if (!toast) {
        // Create toast element
        toast = document.createElement('div');
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    
    // Remove any existing classes and add the type class
    toast.classList.remove('success', 'error');
    toast.classList.add(type);
    
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
