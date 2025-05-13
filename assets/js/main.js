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
    
    // Modal triggers
    const modalTriggers = document.querySelectorAll('.modal-trigger');
    if (modalTriggers.length > 0) {
        modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', function(e) {
                e.preventDefault();
                const modalId = this.getAttribute('href');
                const modal = document.querySelector(modalId);
                const modalOverlay = document.querySelector('.modal-overlay');
                
                if (modal && modalOverlay) {
                    modal.classList.add('active');
                    modalOverlay.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });
        
        // Close modal buttons
        const closeModalBtns = document.querySelectorAll('.close-modal, .modal-overlay');
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                closeModals();
            });
        });
    }
    
    // Filter functionality for concerts page
    const filterMonth = document.getElementById('filter-month');
    const filterLocation = document.getElementById('filter-location');
    const resetFilters = document.getElementById('reset-filters');
    
    if (filterMonth && filterLocation) {
        const filterFunction = function() {
            const selectedMonth = filterMonth.value;
            const selectedLocation = filterLocation.value;
            
            const concertCards = document.querySelectorAll('.concert-card');
            let visibleCount = 0;
            
            concertCards.forEach(card => {
                const month = card.dataset.month;
                const location = card.dataset.location;
                
                const monthMatch = selectedMonth === 'all' || month === selectedMonth;
                const locationMatch = selectedLocation === 'all' || location === selectedLocation;
                
                if (monthMatch && locationMatch) {
                    card.style.display = '';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });
            
            const noResultsMessage = document.getElementById('no-concerts-message');
            if (noResultsMessage) {
                if (visibleCount === 0) {
                    noResultsMessage.classList.remove('hidden');
                } else {
                    noResultsMessage.classList.add('hidden');
                }
            }
        };
        
        filterMonth.addEventListener('change', filterFunction);
        filterLocation.addEventListener('change', filterFunction);
        
        if (resetFilters) {
            resetFilters.addEventListener('click', function() {
                filterMonth.value = 'all';
                filterLocation.value = 'all';
                filterFunction();
            });
        }
    }
    
    // Filter functionality for recordings page
    const filterComposer = document.getElementById('filter-composer');
    const filterType = document.getElementById('filter-type');
    const resetRecordingsFilters = document.getElementById('reset-filters');
    
    if (filterComposer && filterType) {
        const filterRecordingsFunction = function() {
            const selectedComposer = filterComposer.value;
            const selectedType = filterType.value;
            
            const recordingItems = document.querySelectorAll('.recording-item');
            let visibleCount = 0;
            
            recordingItems.forEach(item => {
                const composer = item.dataset.composer;
                const type = item.dataset.type;
                
                const composerMatch = selectedComposer === 'all' || composer === selectedComposer;
                const typeMatch = selectedType === 'all' || type === selectedType;
                
                if (composerMatch && typeMatch) {
                    item.style.display = '';
                    visibleCount++;
                } else {
                    item.style.display = 'none';
                }
            });
            
            const noResultsMessage = document.getElementById('no-recordings-message');
            if (noResultsMessage) {
                if (visibleCount === 0) {
                    noResultsMessage.classList.remove('hidden');
                } else {
                    noResultsMessage.classList.add('hidden');
                }
            }
        };
        
        filterComposer.addEventListener('change', filterRecordingsFunction);
        filterType.addEventListener('change', filterRecordingsFunction);
        
        if (resetRecordingsFilters) {
            resetRecordingsFilters.addEventListener('click', function() {
                filterComposer.value = 'all';
                filterType.value = 'all';
                filterRecordingsFunction();
            });
        }
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
    /**
    // Define SVG icons with improved design
    const icons = {
        artists: `<svg class="feature-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C9.38 2 7.25 4.13 7.25 6.75C7.25 9.32 9.26 11.4 11.88 11.49C11.96 11.48 12.04 11.48 12.1 11.49C12.12 11.49 12.13 11.49 12.15 11.49C12.16 11.49 12.16 11.49 12.17 11.49C14.73 11.4 16.74 9.32 16.75 6.75C16.75 4.13 14.62 2 12 2Z"/>
            <path d="M17.08 14.15C14.29 12.29 9.74 12.29 6.93 14.15C5.66 15 4.96 16.15 4.96 17.38C4.96 18.61 5.66 19.75 6.92 20.59C8.32 21.53 10.16 22 12 22C13.84 22 15.68 21.53 17.08 20.59C18.34 19.74 19.04 18.6 19.04 17.36C19.03 16.13 18.34 14.99 17.08 14.15Z"/>
        </svg>`,
        
        dates: `<svg class="feature-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path opacity="0.4" d="M16.75 3.56V2C16.75 1.59 16.41 1.25 16 1.25C15.59 1.25 15.25 1.59 15.25 2V3.5H8.74999V2C8.74999 1.59 8.40999 1.25 7.99999 1.25C7.58999 1.25 7.24999 1.59 7.24999 2V3.56C4.54999 3.81 3.24999 5.42 3.24999 8.44V17.7C3.24999 21.01 4.74999 22.5 7.99999 22.5H16C19.25 22.5 20.75 21.01 20.75 17.7V8.44C20.75 5.42 19.45 3.81 16.75 3.56Z"/>
            <path d="M12 15C10.34 15 9 13.66 9 12C9 10.34 10.34 9 12 9C13.66 9 15 10.34 15 12C15 13.66 13.66 15 12 15ZM12 10.5C11.17 10.5 10.5 11.17 10.5 12C10.5 12.83 11.17 13.5 12 13.5C12.83 13.5 13.5 12.83 13.5 12C13.5 11.17 12.83 10.5 12 10.5Z"/>
            <path d="M15.75 16.5C15.34 16.5 15 16.84 15 17.25C15 17.66 15.34 18 15.75 18C16.16 18 16.5 17.66 16.5 17.25C16.5 16.84 16.16 16.5 15.75 16.5Z"/>
            <path d="M15.75 6C15.34 6 15 6.34 15 6.75C15 7.16 15.34 7.5 15.75 7.5C16.16 7.5 16.5 7.16 16.5 6.75C16.5 6.34 16.16 6 15.75 6Z"/>
            <path d="M8.25 16.5C7.84 16.5 7.5 16.84 7.5 17.25C7.5 17.66 7.84 18 8.25 18C8.66 18 9 17.66 9 17.25C9 16.84 8.66 16.5 8.25 16.5Z"/>
            <path d="M8.25 6C7.84 6 7.5 6.34 7.5 6.75C7.5 7.16 7.84 7.5 8.25 7.5C8.66 7.5 9 7.16 9 6.75C9 6.34 8.66 6 8.25 6Z"/>
        </svg>`,
        
        recordings: `<svg class="feature-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path opacity="0.4" d="M21 8.5V15.5C21 17.83 19.17 19.67 16.83 19.67H13.83C13.37 19.67 12.92 19.47 12.58 19.12L11.04 17.58C10.69 17.23 10.15 17.23 9.81 17.58L8.27 19.12C7.93 19.47 7.47 19.67 7.02 19.67H4C3.45 19.67 3 19.22 3 18.67V5.33C3 4.78 3.45 4.33 4 4.33H16.83C19.17 4.33 21 6.17 21 8.5Z"/>
            <path d="M7.93001 11.3301C7.55001 10.9501 7.00001 10.7501 6.42001 10.7501C5.85001 10.7501 5.29001 10.9501 4.90001 11.3301C4.52001 11.7201 4.32001 12.2701 4.32001 12.8401C4.32001 13.4201 4.52001 13.9701 4.90001 14.3501C5.29001 14.7401 5.84001 14.9401 6.42001 14.9401C7.00001 14.9401 7.55001 14.7401 7.93001 14.3501C8.32001 13.9601 8.52001 13.4101 8.52001 12.8401C8.52001 12.2701 8.32001 11.7201 7.93001 11.3301Z"/>
            <path d="M18.15 17.7799C18.49 17.4399 18.49 16.8999 18.15 16.5599C17.81 16.2199 17.27 16.2199 16.93 16.5599L15.92 17.5699C15.58 17.9099 15.58 18.4499 15.92 18.7899C16.26 19.1299 16.8 19.1299 17.14 18.7899L18.15 17.7799Z"/>
            <path d="M18.15 9.13C18.49 8.79 18.49 8.25 18.15 7.91L17.14 6.9C16.8 6.56 16.26 6.56 15.92 6.9C15.58 7.24 15.58 7.78 15.92 8.12L16.93 9.13C17.27 9.47 17.81 9.47 18.15 9.13Z"/>
            <path d="M15.01 12.85C15.01 13.45 14.6 13.95 14.01 14.09V14.1C13.32 14.27 12.64 13.74 12.54 13.04V12.64C12.54 11.98 13.06 11.44 13.72 11.42C13.74 11.42 13.76 11.42 13.78 11.42C14.45 11.42 15 11.97 15 12.64C15 12.71 15 12.78 15.01 12.85Z"/>
        </svg>`
    };
    */
    // Replace emoji with SVG icons
    featureBoxes.forEach((box, index) => {
        const iconContainer = box.querySelector('.feature-icon');
        
        if (iconContainer) {
            // Wenn bereits ein Icon-Container existiert, aber kein SVG enthält
            if (!iconContainer.querySelector('svg')) {
                switch(index) {
                    case 0:
                        iconContainer.innerHTML = icons.artists;
                        break;
                    case 1:
                        iconContainer.innerHTML = icons.dates;
                        break;
                    case 2:
                        iconContainer.innerHTML = icons.recordings;
                        break;
                }
            }
        } else {
            // Wenn kein Icon-Container existiert, einen erstellen
            const newIconContainer = document.createElement('div');
            newIconContainer.className = 'feature-icon';
            
            switch(index) {
                case 0:
                    newIconContainer.innerHTML = icons.artists;
                    break;
                case 1:
                    newIconContainer.innerHTML = icons.dates;
                    break;
                case 2:
                    newIconContainer.innerHTML = icons.recordings;
                    break;
            }
            
            // Container am Anfang der feature-box einfügen
            box.insertBefore(newIconContainer, box.firstChild);
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
