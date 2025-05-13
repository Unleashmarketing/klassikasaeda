/**
 * Klassik Asaeda - Checkout JavaScript
 * Handles checkout functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize checkout page
    initCheckout();
    
    // Handle form submission
    setupFormHandling();
});

/**
 * Initialize checkout page
 */
function initCheckout() {
    // Only run on checkout page
    if (!document.querySelector('.checkout-section')) return;
    
    // Get cart from localStorage
    const cart = JSON.parse(localStorage.getItem('klassikAsaedaCart')) || {
        items: [],
        total: 0
    };
    
    // Render order summary
    renderOrderSummary(cart);
    
    // Prepare order details for form submission
    prepareOrderData(cart);
}

/**
 * Render order summary in checkout page
 */
function renderOrderSummary(cart) {
    const checkoutItemsContainer = document.getElementById('checkout-items');
    const checkoutTotal = document.getElementById('checkout-total');
    
    if (!checkoutItemsContainer || !checkoutTotal) return;
    
    // Clear container
    checkoutItemsContainer.innerHTML = '';
    
    // Check if cart is empty
    if (cart.items.length === 0) {
        // Redirect to home page if cart is empty
        window.location.href = 'index.html';
        return;
    }
    
    // Add each item to order summary
    cart.items.forEach(item => {
        const checkoutItem = document.createElement('div');
        checkoutItem.className = 'checkout-item';
        
        const itemInfo = document.createElement('div');
        itemInfo.className = 'checkout-item-info';
        
        const itemTitle = document.createElement('div');
        itemTitle.className = 'checkout-item-title';
        itemTitle.textContent = item.title;
        
        const itemDetails = document.createElement('div');
        itemDetails.className = 'checkout-item-details';
        itemDetails.textContent = item.date;
        
        itemInfo.appendChild(itemTitle);
        itemInfo.appendChild(itemDetails);
        
        const itemPrice = document.createElement('div');
        itemPrice.className = 'checkout-item-price';
        
        const price = document.createElement('div');
        price.textContent = `€${(item.price).toFixed(2).replace('.', ',')}`;
        
        const quantity = document.createElement('div');
        quantity.className = 'checkout-item-quantity';
        quantity.textContent = `${item.quantity}x`;
        
        itemPrice.appendChild(price);
        itemPrice.appendChild(quantity);
        
        checkoutItem.appendChild(itemInfo);
        checkoutItem.appendChild(itemPrice);
        
        checkoutItemsContainer.appendChild(checkoutItem);
    });
    
    // Update total price
    checkoutTotal.textContent = `€${cart.total.toFixed(2).replace('.', ',')}`;
}

/**
 * Prepare order data for form submission
 */
function prepareOrderData(cart) {
    const orderDetailsInput = document.getElementById('order_details');
    const orderTotalInput = document.getElementById('order_total');
    
    if (!orderDetailsInput || !orderTotalInput) return;
    
    // Create order details string
    let orderDetails = '';
    cart.items.forEach(item => {
        orderDetails += `${item.title} (${item.date}) - ${item.quantity}x €${item.price.toFixed(2)} = €${(item.price * item.quantity).toFixed(2)}\n`;
    });
    
    // Set form input values
    orderDetailsInput.value = orderDetails;
    orderTotalInput.value = `€${cart.total.toFixed(2)}`;
}

/**
 * Setup form handling
 */
function setupFormHandling() {
    const checkoutForm = document.querySelector('form[name="checkout"]');
    
    if (!checkoutForm) return;
    
    // Add hidden field for Netlify form handling
    if (!checkoutForm.querySelector('input[name="form-name"]')) {
        const hiddenField = document.createElement('input');
        hiddenField.type = 'hidden';
        hiddenField.name = 'form-name';
        hiddenField.value = 'checkout';
        checkoutForm.appendChild(hiddenField);
    }
    
    // Form submission handling
    checkoutForm.addEventListener('submit', function(e) {
        // Form will be handled by Netlify
        // After successful submission, the page will be redirected to a success page
        
        // Here you can add additional validation if needed
        
        // Clear cart after successful submission (will be executed only if form is valid)
        localStorage.removeItem('klassikAsaedaCart');
    });
}
