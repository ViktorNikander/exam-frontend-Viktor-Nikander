// Cart display functions
function displayCart() {
    const cart = getCart();
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalContainer = document.getElementById('cart-total');
    const clearCartBtn = document.getElementById('clear-cart-btn');
    const checkoutBtn = document.getElementById('checkout-btn');
    const checkoutSection = document.getElementById('checkout-section');

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="text-center"><h3>Your cart is empty</h3><a href="index.html" class="btn btn-primary">Continue Shopping</a></div>';
        cartTotalContainer.innerHTML = '';
        if (clearCartBtn) clearCartBtn.style.display = 'none';
        if (checkoutBtn) checkoutBtn.style.display = 'none';
        if (checkoutSection) checkoutSection.style.display = 'none';
        return;
    }

    if (clearCartBtn) clearCartBtn.style.display = 'inline-block';
    if (checkoutBtn) checkoutBtn.style.display = 'inline-block';
    if (checkoutSection) checkoutSection.style.display = 'none';

    let cartHTML = '<div class="table-responsive"><table class="table"><thead><tr><th>Product</th><th>Price</th><th>Quantity</th><th>Total</th><th>Actions</th></tr></thead><tbody>';

    cart.forEach(item => {
        const itemTotal = (item.price * item.quantity).toFixed(2);
        cartHTML += `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <img src="${item.image}" alt="${item.title}" style="width: 50px; height: 50px; object-fit: contain; margin-right: 10px;">
                        <span>${item.title}</span>
                    </div>
                </td>
                <td>$${item.price}</td>
                <td>
                    <div class="d-flex align-items-center">
                        <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <span class="mx-2">${item.quantity}</span>
                        <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                </td>
                <td>$${itemTotal}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="removeItem(${item.id})">Remove</button>
                </td>
            </tr>
        `;
    });

    cartHTML += '</tbody></table></div>';
    cartItemsContainer.innerHTML = cartHTML;

    const total = getCartTotal().toFixed(2);
    cartTotalContainer.innerHTML = `<h4>Total: $${total}</h4>`;
}

function updateQuantity(productId, newQuantity) {
    updateCartItemQuantity(productId, newQuantity);
    displayCart();
}

function removeItem(productId) {
    removeFromCart(productId);
    displayCart();
}

function validateCheckoutField(value, minLength, maxLength, fieldName) {
    if (!value || value.trim().length < minLength) {
        return `${fieldName} must be at least ${minLength} characters long`;
    }
    if (value.trim().length > maxLength) {
        return `${fieldName} cannot exceed ${maxLength} characters`;
    }
    return "";
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return "Please enter a valid email address";
    }
    return "";
}

function validatePhone(phone) {
    const phoneRegex = /^[\d\s\-\(\)\+]+$/;
    if (!phoneRegex.test(phone) || phone.length < 7) {
        return "Please enter a valid phone number";
    }
    return "";
}

function validatePostalCode(postalCode) {
    const postalRegex = /^\d{5}$/;
    if (!postalRegex.test(postalCode)) {
        return "Postal code must be exactly 5 digits";
    }
    return "";
}

function validateCheckoutForm() {
    document.querySelectorAll('.invalid-feedback').forEach(el => el.textContent = '');
    document.querySelectorAll('.form-control').forEach(el => el.classList.remove('is-invalid'));

    const name = document.getElementById('checkout-name').value.trim();
    const email = document.getElementById('checkout-email').value.trim();
    const phone = document.getElementById('checkout-phone').value.trim();
    const address = document.getElementById('checkout-address').value.trim();
    const city = document.getElementById('checkout-city').value.trim();
    const postal = document.getElementById('checkout-postal').value.trim();

    let isValid = true;

    const nameError = validateCheckoutField(name, 2, 50, "Name");
    if (nameError) {
        document.getElementById('name-error').textContent = nameError;
        document.getElementById('checkout-name').classList.add('is-invalid');
        isValid = false;
    }

    const emailError = validateEmail(email);
    if (emailError) {
        document.getElementById('email-error').textContent = emailError;
        document.getElementById('checkout-email').classList.add('is-invalid');
        isValid = false;
    }

    const phoneError = validatePhone(phone);
    if (phoneError) {
        document.getElementById('phone-error').textContent = phoneError;
        document.getElementById('checkout-phone').classList.add('is-invalid');
        isValid = false;
    }

    const addressError = validateCheckoutField(address, 5, 50, "Street address");
    if (addressError) {
        document.getElementById('address-error').textContent = addressError;
        document.getElementById('checkout-address').classList.add('is-invalid');
        isValid = false;
    }

    const cityError = validateCheckoutField(city, 2, 20, "City");
    if (cityError) {
        document.getElementById('city-error').textContent = cityError;
        document.getElementById('checkout-city').classList.add('is-invalid');
        isValid = false;
    }

    const postalError = validatePostalCode(postal);
    if (postalError) {
        document.getElementById('postal-error').textContent = postalError;
        document.getElementById('checkout-postal').classList.add('is-invalid');
        isValid = false;
    }

    return isValid;
}

function showCheckoutForm() {
    const checkoutSection = document.getElementById('checkout-section');
    if (checkoutSection) {
        checkoutSection.style.display = 'block';
        checkoutSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function hideCheckoutForm() {
    const checkoutSection = document.getElementById('checkout-section');
    if (checkoutSection) {
        checkoutSection.style.display = 'none';
    }
}

function processCheckout() {
    if (!validateCheckoutForm()) {
        return;
    }

    const orderData = {
        customer: {
            name: document.getElementById('checkout-name').value.trim(),
            email: document.getElementById('checkout-email').value.trim(),
            phone: document.getElementById('checkout-phone').value.trim()
        },
        address: {
            street: document.getElementById('checkout-address').value.trim(),
            city: document.getElementById('checkout-city').value.trim(),
            postalCode: document.getElementById('checkout-postal').value.trim()
        },
        items: getCart(),
        total: getCartTotal(),
        orderDate: new Date().toISOString()
    };

    console.log('Order processed:', orderData);

    clearCart();
    
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalContainer = document.getElementById('cart-total');
    const checkoutSection = document.getElementById('checkout-section');
    const cartActions = document.getElementById('cart-actions');
    
    cartItemsContainer.innerHTML = `
        <div class="text-center">
            <div class="alert alert-success" role="alert">
                <h4 class="alert-heading">Order Placed Successfully!</h4>
                <p>Thank you for your purchase. Your order has been received and will be processed shortly.</p>
                <hr>
                <p class="mb-0">Order details have been logged to the console for processing.</p>
            </div>
            <a href="index.html" class="btn btn-primary">Continue Shopping</a>
        </div>
    `;
    cartTotalContainer.innerHTML = '';
    if (checkoutSection) checkoutSection.style.display = 'none';
    cartActions.style.display = 'none';
    
    // Reset form for future use
    document.getElementById('checkout-form').reset();
}

if (document.getElementById('cart-items')) {
    displayCart();
    updateCartBadge();
    
    const clearCartBtn = document.getElementById('clear-cart-btn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', function() {
            clearCart();
            displayCart();
        });
    }

    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', showCheckoutForm);
    }

    const checkoutSubmitBtn = document.getElementById('checkout-submit-btn');
    if (checkoutSubmitBtn) {
        checkoutSubmitBtn.addEventListener('click', processCheckout);
    }

    const checkoutCancelBtn = document.getElementById('checkout-cancel-btn');
    if (checkoutCancelBtn) {
        checkoutCancelBtn.addEventListener('click', hideCheckoutForm);
    }
}