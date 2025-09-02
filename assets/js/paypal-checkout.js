/**
 * PayPal Integration für Klassik Asaeda Checkout
 * Erweitert die bestehende checkout.js
 */

// PayPal SDK laden
function loadPayPalSDK(paymentType = 'paypal') {
    return new Promise((resolve, reject) => {
        const existingScript = document.getElementById('paypal-sdk');
        if (existingScript) {
            existingScript.remove();
        }
        
        const script = document.createElement('script');
        script.id = 'paypal-sdk';
        
        // Verschiedene Konfigurationen je nach Zahlungsart
        if (paymentType === 'paypal') {
            script.src = 'https://www.paypal.com/sdk/js?client-id=AUAYCSmwSxa19nMRK3PIweqv499nKlhRjt-SSsxblU7rjjpyvnE0K432pgwWA7gITr6HXmsm0_4uavXs&currency=EUR&disable-funding=credit,card,sepa';
        } else if (paymentType === 'card') {
            script.src = 'https://www.paypal.com/sdk/js?client-id=AUAYCSmwSxa19nMRK3PIweqv499nKlhRjt-SSsxblU7rjjpyvnE0K432pgwWA7gITr6HXmsm0_4uavXs&currency=EUR&disable-funding=paypal';
        }
        
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('PayPal SDK konnte nicht geladen werden'));
        document.head.appendChild(script);
    });
}

// PayPal initialisieren
let paypalButtonsInitialized = false;
let currentPaymentType = null;

function initPayPal(paymentType = 'paypal') {
    // Container erstellen oder leeren
    let paypalContainer = document.getElementById('paypal-button-container');
    if (!paypalContainer) {
        paypalContainer = document.createElement('div');
        paypalContainer.id = 'paypal-button-container';
        paypalContainer.style.display = 'none';
        
        const submitButton = document.getElementById('submit-order');
        submitButton.parentNode.insertBefore(paypalContainer, submitButton);
    }
    
    // Container immer leeren bei neuer Initialisierung
    paypalContainer.innerHTML = '';
    
    // PayPal Buttons initialisieren
    paypal.Buttons({
        style: {
            layout: 'vertical',
            color: paymentType === 'card' ? 'blue' : 'gold',
            shape: 'rect',
            label: paymentType === 'card' ? 'pay' : 'checkout'
        },
        
        createOrder: function(data, actions) {
            const cart = JSON.parse(localStorage.getItem('klassikAsaedaCart'));
            if (!cart || cart.items.length === 0) {
                alert('Ihr Warenkorb ist leer.');
                return;
            }
            
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: cart.total.toFixed(2),
                        currency_code: 'EUR'
                    },
                    description: 'Klassik Asaeda Konzerttickets',
                    items: cart.items.map(item => ({
                        name: item.title,
                        unit_amount: {
                            value: item.price.toFixed(2),
                            currency_code: 'EUR'
                        },
                        quantity: item.quantity,
                        description: item.date
                    }))
                }]
            });
        },
        
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                // Zahlung erfolgreich
                console.log('PayPal Zahlung erfolgreich:', details);
                
                // Bestelldaten für Formspree vorbereiten
                submitFormWithPayPalData(details, data.orderID, paymentType);
            });
        },
        
        onError: function(err) {
            console.error('PayPal Error:', err);
            const errorMsg = paymentType === 'card' ? 
                'Kreditkartenzahlung fehlgeschlagen. Bitte versuchen Sie es erneut.' :
                'PayPal-Zahlung fehlgeschlagen. Bitte versuchen Sie es erneut.';
            showToast(errorMsg, 'error');
            
            // Zurück zum normalen Formular
            showRegularForm();
        },
        
        onCancel: function(data) {
            console.log('Zahlung abgebrochen:', data);
            const cancelMsg = paymentType === 'card' ? 
                'Kreditkartenzahlung wurde abgebrochen.' :
                'PayPal-Zahlung wurde abgebrochen.';
            showToast(cancelMsg, 'info');
            
            // Zurück zum normalen Formular
            showRegularForm();
        }
    }).render('#paypal-button-container').then(() => {
        paypalButtonsInitialized = true;
        currentPaymentType = paymentType;
        console.log(`${paymentType} Buttons erfolgreich initialisiert`);
    }).catch(error => {
        console.error('Fehler beim Rendern der Buttons:', error);
        paypalButtonsInitialized = false;
        currentPaymentType = null;
    });
}

// Formular mit PayPal-Daten übermitteln
function submitFormWithPayPalData(paypalDetails, orderID, paymentType = 'paypal') {
    const form = document.querySelector('.checkout-form');
    const cart = JSON.parse(localStorage.getItem('klassikAsaedaCart'));
    
    // Versteckte Felder mit PayPal-Daten füllen
    document.getElementById('order_id').value = generateOrderId();
    document.getElementById('order_timestamp').value = new Date().toISOString();
    document.getElementById('order_total').value = cart.total.toFixed(2);
    
    // PayPal-spezifische Daten hinzufügen
    const paymentMethodLabel = paymentType === 'card' ? 'KREDITKARTE' : 'PAYPAL';
    
    let orderDetails = `Bestellnummer: ${document.getElementById('order_id').value}\n`;
    orderDetails += `PayPal Transaction ID: ${orderID}\n`;
    orderDetails += `PayPal Zahler: ${paypalDetails.payer.name.given_name} ${paypalDetails.payer.name.surname}\n`;
    orderDetails += `PayPal Email: ${paypalDetails.payer.email_address}\n`;
    orderDetails += `Zahlungsstatus: BEZAHLT (${paymentMethodLabel})\n`;
    orderDetails += `Bestelldatum: ${new Date().toLocaleDateString('de-DE')}\n`;
    orderDetails += `---\n`;
    
    cart.items.forEach(item => {
        orderDetails += `${item.title}\n`;
        orderDetails += `Datum: ${item.date}\n`;
        orderDetails += `Anzahl: ${item.quantity}x\n`;
        orderDetails += `Preis: €${item.price.toFixed(2)}\n`;
        orderDetails += `Gesamt: €${(item.price * item.quantity).toFixed(2)}\n`;
        orderDetails += `---\n`;
    });
    
    orderDetails += `\nGesamtbetrag: €${cart.total.toFixed(2)} (ÜBER ${paymentMethodLabel} BEZAHLT)`;
    
    document.getElementById('order_details').value = orderDetails;
    
    // Zahlungsmethode entsprechend setzen
    const methodValue = paymentType === 'card' ? 'Kreditkarte' : 'PayPal';
    const methodRadio = document.querySelector(`input[name="payment_method"][value="${methodValue}"]`);
    if (methodRadio) methodRadio.checked = true;
    
    // Zusätzliche PayPal-Felder hinzufügen
    addHiddenField('paypal_transaction_id', orderID);
    addHiddenField('paypal_payer_email', paypalDetails.payer.email_address);
    addHiddenField('paypal_payment_status', 'COMPLETED');
    addHiddenField('payment_type', paymentType);
    
    // Betreff für E-Mail anpassen
    const subjectField = document.querySelector('input[name="_subject"]');
    if (subjectField) {
        const methodLabel = paymentType === 'card' ? 'Kreditkarten' : 'PayPal';
        subjectField.value = `Neue ${methodLabel}-Bestellung - Klassik Asaeda - ${document.getElementById('order_id').value}`;
    }
    
    // Formular automatisch übermitteln
    form.submit();
}

// Verstecktes Feld hinzufügen
function addHiddenField(name, value) {
    const existing = document.querySelector(`input[name="${name}"]`);
    if (existing) {
        existing.value = value;
        return;
    }
    
    const hiddenField = document.createElement('input');
    hiddenField.type = 'hidden';
    hiddenField.name = name;
    hiddenField.value = value;
    document.querySelector('.checkout-form').appendChild(hiddenField);
}

// PayPal-Formular anzeigen
function showPayPalForm() {
    const regularButton = document.getElementById('submit-order');
    const paypalContainer = document.getElementById('paypal-button-container');
    
    regularButton.style.display = 'none';
    paypalContainer.style.display = 'block';
}

// Reguläres Formular anzeigen
function showRegularForm() {
    const regularButton = document.getElementById('submit-order');
    const paypalContainer = document.getElementById('paypal-button-container');
    
    regularButton.style.display = 'block';
    if (paypalContainer) paypalContainer.style.display = 'none';
}

// Zahlungsmethoden-Handler erweitern
function setupPaymentMethodHandlers() {
    const paymentRadios = document.querySelectorAll('input[name="payment_method"]');
    
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', async function() {
            const paymentMethod = this.value;
            
            if (paymentMethod === 'PayPal' || paymentMethod === 'Kreditkarte') {
                // Formular validieren bevor PayPal/Kreditkarte angezeigt wird
                if (validateFormBasic()) {
                    try {
                        const paymentType = paymentMethod === 'PayPal' ? 'paypal' : 'card';
                        
                        // Prüfe ob bereits für diesen Typ initialisiert
                        if (paypalButtonsInitialized && currentPaymentType === paymentType) {
                            // Nur anzeigen ohne neu zu initialisieren
                            showPayPalForm();
                            return;
                        }
                        
                        // SDK für entsprechenden Typ laden
                        showToast(`${paymentMethod} wird geladen...`, 'info');
                        await loadPayPalSDK(paymentType);
                        
                        // Buttons neu initialisieren
                        paypalButtonsInitialized = false;
                        initPayPal(paymentType);
                        showPayPalForm();
                        
                    } catch (error) {
                        console.error('Payment SDK Fehler:', error);
                        showToast(`${paymentMethod} konnte nicht geladen werden. Bitte versuchen Sie es erneut.`, 'error');
                        // Zurück zu Überweisung
                        document.querySelector('input[name="payment_method"][value="Überweisung"]').checked = true;
                    }
                } else {
                    // Zurück zu Überweisung wenn Formular invalid
                    document.querySelector('input[name="payment_method"][value="Überweisung"]').checked = true;
                    showToast('Bitte füllen Sie alle Pflichtfelder aus, bevor Sie eine elektronische Zahlungsmethode wählen.', 'error');
                }
            } else {
                // Überweisung gewählt
                showRegularForm();
            }
        });
    });
}

// Basis-Formularvalidierung
function validateFormBasic() {
    const requiredFields = ['name', 'email', 'address', 'postal_code', 'city', 'country'];
    let isValid = true;
    
    requiredFields.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (!field || !field.value.trim()) {
            isValid = false;
            if (field) field.classList.add('error');
        } else {
            if (field) field.classList.remove('error');
        }
    });
    
    return isValid;
}

// Bestellnummer generieren (wie in der ursprünglichen checkout.js)
function generateOrderId() {
    const date = new Date();
    const dateString = date.getFullYear().toString() + 
                      (date.getMonth() + 1).toString().padStart(2, '0') + 
                      date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    
    return `KA-${dateString}-${random}`;
}

// Toast-Funktion (falls nicht in main.js vorhanden)
function showToast(message, type = 'success') {
    let toast = document.querySelector('.toast');
    
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    
    toast.classList.remove('success', 'error', 'info');
    toast.classList.add(type);
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Initialisierung
document.addEventListener('DOMContentLoaded', function() {
    // PayPal SDK direkt beim Laden der Seite vorladen
    loadPayPalSDK().catch(error => {
        console.warn('PayPal SDK konnte nicht vorgeladen werden:', error);
    });
    
    // Warten bis normale checkout.js geladen ist
    setTimeout(() => {
        setupPaymentMethodHandlers();
    }, 100);
});
