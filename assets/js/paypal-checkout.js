/**
 * PayPal Integration für Klassik Asaeda Checkout
 * Erweitert die bestehende checkout.js
 */

// PayPal SDK laden
function loadPayPalSDK() {
    return new Promise((resolve, reject) => {
        if (document.getElementById('paypal-sdk')) {
            // SDK bereits geladen
            resolve();
            return;
        }
        
        const script = document.createElement('script');
        script.id = 'paypal-sdk';
        script.src = 'https://www.paypal.com/sdk/js?client-id=AUAYCSmwSxa19nMRK3PIweqv499nKlhRjt-SSsxblU7rjjpyvnE0K432pgwWA7gITr6HXmsm0_4uavXs&currency=EUR';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('PayPal SDK konnte nicht geladen werden'));
        document.head.appendChild(script);
    });
}

// PayPal initialisieren
function initPayPal() {
    // PayPal Button Container erstellen falls nicht vorhanden
    if (!document.getElementById('paypal-button-container')) {
        const paypalContainer = document.createElement('div');
        paypalContainer.id = 'paypal-button-container';
        paypalContainer.style.display = 'none';
        
        const submitButton = document.getElementById('submit-order');
        submitButton.parentNode.insertBefore(paypalContainer, submitButton);
    }
    
    // PayPal Buttons initialisieren
    paypal.Buttons({
        style: {
            layout: 'vertical',
            color: 'gold',
            shape: 'rect',
            label: 'checkout'
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
                submitFormWithPayPalData(details, data.orderID);
            });
        },
        
        onError: function(err) {
            console.error('PayPal Error:', err);
            showToast('PayPal-Zahlung fehlgeschlagen. Bitte versuchen Sie es erneut.', 'error');
            
            // Zurück zum normalen Formular
            showRegularForm();
        },
        
        onCancel: function(data) {
            console.log('PayPal Zahlung abgebrochen:', data);
            showToast('PayPal-Zahlung wurde abgebrochen.', 'info');
            
            // Zurück zum normalen Formular
            showRegularForm();
        }
    }).render('#paypal-button-container');
}

// Formular mit PayPal-Daten übermitteln
function submitFormWithPayPalData(paypalDetails, orderID) {
    const form = document.querySelector('.checkout-form');
    const cart = JSON.parse(localStorage.getItem('klassikAsaedaCart'));
    
    // Versteckte Felder mit PayPal-Daten füllen
    document.getElementById('order_id').value = generateOrderId();
    document.getElementById('order_timestamp').value = new Date().toISOString();
    document.getElementById('order_total').value = cart.total.toFixed(2);
    
    // PayPal-spezifische Daten hinzufügen
    let orderDetails = `Bestellnummer: ${document.getElementById('order_id').value}\n`;
    orderDetails += `PayPal Transaction ID: ${orderID}\n`;
    orderDetails += `PayPal Zahler: ${paypalDetails.payer.name.given_name} ${paypalDetails.payer.name.surname}\n`;
    orderDetails += `PayPal Email: ${paypalDetails.payer.email_address}\n`;
    orderDetails += `Zahlungsstatus: BEZAHLT\n`;
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
    
    orderDetails += `\nGesamtbetrag: €${cart.total.toFixed(2)} (ÜBER PAYPAL BEZAHLT)`;
    
    document.getElementById('order_details').value = orderDetails;
    
    // Zahlungsmethode auf PayPal setzen
    const paypalRadio = document.querySelector('input[name="payment_method"][value="PayPal"]');
    if (paypalRadio) paypalRadio.checked = true;
    
    // Zusätzliche PayPal-Felder hinzufügen
    addHiddenField('paypal_transaction_id', orderID);
    addHiddenField('paypal_payer_email', paypalDetails.payer.email_address);
    addHiddenField('paypal_payment_status', 'COMPLETED');
    
    // Betreff für E-Mail anpassen
    const subjectField = document.querySelector('input[name="_subject"]');
    if (subjectField) {
        subjectField.value = `Neue PayPal-Bestellung - Klassik Asaeda - ${document.getElementById('order_id').value}`;
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
    
    showToast('Bitte klicken Sie auf den PayPal-Button unten, um zu bezahlen.', 'info');
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
            if (this.value === 'PayPal') {
                // Formular validieren bevor PayPal angezeigt wird
                if (validateFormBasic()) {
                    try {
                        showToast('PayPal wird geladen...', 'info');
                        await loadPayPalSDK();
                        initPayPal();
                        showPayPalForm();
                    } catch (error) {
                        console.error('PayPal SDK Fehler:', error);
                        showToast('PayPal konnte nicht geladen werden. Bitte versuchen Sie es erneut.', 'error');
                        // Zurück zu Überweisung
                        document.querySelector('input[name="payment_method"][value="Überweisung"]').checked = true;
                    }
                } else {
                    // Zurück zu Überweisung wenn Formular invalid
                    document.querySelector('input[name="payment_method"][value="Überweisung"]').checked = true;
                    showToast('Bitte füllen Sie alle Pflichtfelder aus, bevor Sie PayPal wählen.', 'error');
                }
            } else {
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
