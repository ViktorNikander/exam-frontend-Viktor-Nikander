/*!
* Start Bootstrap - Shop Homepage v5.0.6 (https://startbootstrap.com/template/shop-homepage)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-shop-homepage/blob/master/LICENSE)
*/
// Cart management functions
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(product) {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    saveCart(cart);
    updateCartBadge();
    console.log('Added to cart:', product.title);
}

function updateCartBadge() {
    const cart = getCart();
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.querySelector('.badge');
    if (badge) {
        badge.textContent = totalQuantity;
    }
}

function removeFromCart(productId) {
    const cart = getCart();
    const updatedCart = cart.filter(item => item.id !== productId);
    saveCart(updatedCart);
    updateCartBadge();
}

function updateCartItemQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    const cart = getCart();
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        saveCart(cart);
        updateCartBadge();
    }
}

function clearCart() {
    localStorage.removeItem('cart');
    updateCartBadge();
    console.log('Cart cleared');
}

function getCartTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function createProductCard(product) {
    const div = document.createElement("div");
    
    const img = document.createElement("img");
    img.src = product.image;
    img.classList.add("card-img-top");
    img.style.height = "250px";
    img.style.objectFit = "contain";
    div.appendChild(img);
    
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body", "p-4");
    cardBody.style.height = "150px";
    const textCenter = document.createElement("div");
    textCenter.classList.add("text-center");
    const productName = document.createElement("h5");
    productName.classList.add("fw-bolder");
    productName.textContent = product.title;
    productName.style.overflow = "hidden";
    productName.style.textOverflow = "ellipsis";
    productName.style.display = "-webkit-box";
    productName.style.webkitLineClamp = "2";
    productName.style.webkitBoxOrient = "vertical";
    textCenter.appendChild(productName);
    
    const productPrice = document.createElement("p");
    productPrice.textContent = `$${product.price}`;
    textCenter.appendChild(productPrice);
    cardBody.appendChild(textCenter);
    div.appendChild(cardBody);
    
    const cardFooter = document.createElement("div");
    cardFooter.classList.add("card-footer", "p-4", "pt-0", "border-top-0", "bg-transparent");
    const footerTextCenter = document.createElement("div");
    footerTextCenter.classList.add("text-center");
    const viewButton = document.createElement("a");
    viewButton.classList.add("btn", "btn-outline-dark", "mt-auto");
    viewButton.href = "#!";
    viewButton.textContent = "Add to cart";
    viewButton.addEventListener("click", (e) => {
        e.preventDefault();
        addToCart(product);
    });
    footerTextCenter.appendChild(viewButton);
    cardFooter.appendChild(footerTextCenter);
    div.appendChild(cardFooter);
    
    div.classList.add("col", "mb-5");
    return div;
}

function getProducts() {
    console.log("Fetching all products...");
    fetch("https://fakestoreapi.com/products")
        .then(response => response.json())
        .then(products => { 
            console.log("Products fetched successfully:");
            document.getElementById("products-container").innerHTML = "";
            products.forEach(product => {
                const productCard = createProductCard(product);
                document.getElementById("products-container").appendChild(productCard);
            });
        })
        .catch(error => console.error("Error fetching products:", error));
}

function getProductsByCategory(category) {
    console.log(`Fetching products for category: ${category}...`);
    fetch(`https://fakestoreapi.com/products/category/${category}`)
        .then(response => response.json())
        .then(products => {
            document.getElementById("products-container").innerHTML = "";
            console.log(`Products for category "${category}" fetched successfully:`, products);
            products.forEach(product => {
                const productCard = createProductCard(product);
                document.getElementById("products-container").appendChild(productCard);
            });
        })
        .catch(error => console.error(`Error fetching products for category "${category}":`, error));
}

function getCategoriesToDropdown() {
    console.log("Fetching categories for dropdown...");
    const dropdownTarget = document.getElementById("dropdown-category-target");
    fetch("https://fakestoreapi.com/products/categories")
        .then(response => response.json())
        .then(categories => {
            categories.forEach(category => {
                const li = document.createElement("li");
                const button = document.createElement("button");
                button.classList.add("dropdown-item");
                button.type = "button";
                button.id = `${category.id}-btn`;
                button.textContent = category;
                button.addEventListener("click", () => {
                    // If on about page, navigate to index.html with category hash, otherwise filter products
                    if (window.location.pathname.includes("about.html")) {
                        window.location.href = `index.html#${category}`;
                    } else {
                        getProductsByCategory(category);
                    }
                });
                li.appendChild(button);
                dropdownTarget.appendChild(li);
            });
        })
        .catch(error => console.error("Error fetching categories:", error));
}

onload = () => {
    getCategoriesToDropdown();
    getProducts();
    updateCartBadge();
    
    // Check for category hash parameter and load category if present
    const hash = window.location.hash.substring(1); // Remove the '#'
    if (hash && hash !== 'all') {
        getProductsByCategory(hash);
    }
    
    // Add navigation event listeners
    document.getElementById("home-btn").addEventListener("click", () => {
        window.location.href = "index.html";
    });

    document.getElementById("about-btn").addEventListener("click", () => {
        window.location.href = "about.html";
    });

    document.getElementById("navbarDropdown").addEventListener("click", () => {
        // Toggle dropdown - Bootstrap handles this
    });

    document.getElementById("all-btn").addEventListener("click", () => {
        // If on about page, navigate to index.html, otherwise load all products and clear hash
        if (window.location.pathname.includes("about.html")) {
            window.location.href = "index.html";
        } else {
            getProducts();
            window.location.hash = ''; // Clear any category hash
        }
    });
};