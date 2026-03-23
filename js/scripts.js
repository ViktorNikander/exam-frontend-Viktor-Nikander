/*!
* Start Bootstrap - Shop Homepage v5.0.6 (https://startbootstrap.com/template/shop-homepage)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-shop-homepage/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project

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
    footerTextCenter.appendChild(viewButton);
    cardFooter.appendChild(footerTextCenter);
    div.appendChild(cardFooter);
    
    div.classList.add("col", "mb-5");
    return div;
}

function getProducts() {
    console.log("Fetching products...");
    fetch("https://fakestoreapi.com/products")
        .then(response => response.json())
        .then(products => { 
            console.log("Products fetched successfully:");
            document.getElementById("products-container").innerHTML = "";
            products.forEach(product => {
                console.log("Product:", product);
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
                console.log("Product:", product);
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
                console.log("Adding category to dropdown:", category);
                const li = document.createElement("li");
                const button = document.createElement("button");
                button.classList.add("dropdown-item");
                button.type = "button";
                button.id = `${category.id}-btn`;
                button.textContent = category;
                button.addEventListener("click", () => getProductsByCategory(category));
                li.appendChild(button);
                dropdownTarget.appendChild(li);
            });
        })
        .catch(error => console.error("Error fetching categories:", error));
}

document.getElementById("all-btn").addEventListener("click", getProducts);

onload = () => {
    getCategoriesToDropdown();
    getProducts();
};