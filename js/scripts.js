/*!
* Start Bootstrap - Shop Homepage v5.0.6 (https://startbootstrap.com/template/shop-homepage)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-shop-homepage/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project

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
                button.addEventListener("click", () => {
                    console.log(`Category "${category}" button clicked!`);
                    // Here you can add code to filter products based on the selected category
                });
                li.appendChild(button);
                dropdownTarget.appendChild(li);
            });
        })
        .catch(error => console.error("Error fetching categories:", error));
}

onload = () => {
    getCategoriesToDropdown();
};