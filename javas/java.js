// Global variables
let currentSlide = 0;
let selectedSize = null;

// Document ready function
document.addEventListener("DOMContentLoaded", function() {
    // Set up event listeners for product buttons
    document.querySelectorAll(".buy-now, .ver-detalles").forEach(button => {
        button.addEventListener("click", function() {
            showProductDetails(this);
        });
    });

    // Set up event listeners for shopping cart
    const cartToggle = document.querySelector(".cart-toggle");
    if (cartToggle) {
        cartToggle.addEventListener("click", function(e) {
            e.preventDefault();
            toggleCart();
        });
    }

    const cartClose = document.querySelector(".cart-close");
    if (cartClose) {
        cartClose.addEventListener("click", function() {
            toggleCart(false);
        });
    }

    // Set up search functionality
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                filterProducts();
            }
        });
    }

    // Initialize carousel slider if present
    const sliderWrapper = document.querySelector(".sliderWrapper");
    if (sliderWrapper) {
        // Auto-slider for homepage
        setInterval(() => {
            moveSlider(1);
        }, 5000);
    }

    // Initialize cart display
    updateCartDisplay();

    // Set up scroll animation for text elements
    initScrollAnimation();
});

// Product details modal functions
function showProductDetails(button) {
    const product = button.closest(".card-product");
    if (!product) {
        console.error("No se encontró el producto.");
        return;
    }

    // Get product details
    const productId = product.dataset.id || "product";
    const name = product.dataset.name || "Nombre no disponible";
    const price = product.dataset.price || "Precio no disponible";
    const description = product.dataset.description || "Descripción no disponible";
    
    // Get product images (either from JSON array or single image)
    let images = [];
    if (product.dataset.images) {
        try {
            images = JSON.parse(product.dataset.images);
        } catch (e) {
            console.error("Error al parsear las imágenes:", e);
            const imageSrc = product.dataset.image || product.querySelector("img").src;
            images = [imageSrc];
        }
    } else {
        const imageSrc = product.dataset.image || product.querySelector("img").src;
        images = [imageSrc];
    }
    
    // Get available sizes (default if not specified)
    const productType = productId.includes("gorra") ? "cap" : "clothing";
    let productSizes;
    
    if (product.dataset.sizes) {
        productSizes = product.dataset.sizes.split(',');
    } else if (productType === "cap") {
        productSizes = ["55-60 cm", "58-62 cm", "60-64 cm"];
    } else {
        productSizes = ["S", "M", "L", "XL"];
    }

    // Get or create modal
    let modal = document.getElementById("product-details");
    if (!modal) {
        console.error("Modal de detalles no encontrado.");
        return;
    }

    // Update product details in modal
    document.getElementById("details-name").textContent = name;
    document.getElementById("details-price").textContent = price;
    document.getElementById("details-description").textContent = description;

    // Update carousel images
    const carousel = document.getElementById("carousel-images") || document.getElementById("imageSlider");
    if (carousel) {
        carousel.innerHTML = "";
        images.forEach((imgSrc, index) => {
            const img = document.createElement("img");
            img.src = imgSrc.trim();
            img.alt = name;
            img.classList.add("carousel-slide");
            if (index === 0) img.classList.add("active");
            carousel.appendChild(img);
        });
    } else if (document.getElementById("details-image")) {
        // Single image display fallback
        document.getElementById("details-image").src = images[0];
    }

    // Update size options
    const sizeContainer = document.querySelector(".size-options");
    if (sizeContainer) {
        sizeContainer.innerHTML = "";
        productSizes.forEach(size => {
            const sizeButton = document.createElement("button");
            sizeButton.classList.add("size-button");
            sizeButton.textContent = size;
            sizeButton.onclick = function() {
                selectSize(this, size);
            };
            sizeContainer.appendChild(sizeButton);
        });
    }

    // Set up add to cart button
    const addToCartButton = document.getElementById("add-to-cart");
    if (addToCartButton) {
        addToCartButton.onclick = function() {
            addToCart(productId, name, price, images[0]);
        };
    }

    // Reset carousel position
    currentSlide = 0;
    updateCarousel();

    // Store product ID in modal for reference
    modal.setAttribute("data-product-id", productId);

    // Show modal
    modal.classList.remove("hidden");
    modal.style.display = "flex";
}

function closeProductDetails(event) {
    const modal = document.getElementById("product-details");
    if (!event || event.target === modal || event.target.id === "close-details") {
        if (modal) {
            modal.classList.add("hidden");
            modal.style.display = "none";
        }
    }
}

function selectSize(button, size) {
    document.querySelectorAll(".size-button").forEach(btn => {
        btn.classList.remove("selected");
    });
    button.classList.add("selected");
    selectedSize = size;
}

// Carousel functions
function updateCarousel() {
    const carousel = document.getElementById("carousel-images") || document.getElementById("imageSlider");
    if (carousel) {
        if (carousel.style.transform !== undefined) {
            carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
        } else {
            // Alternative for browsers that might not support transform
            const slides = document.querySelectorAll(".carousel-slide");
            slides.forEach((slide, index) => {
                slide.classList.toggle("active", index === currentSlide);
            });
        }
    }
    updateIndicators();
}

function updateIndicators() {
    const indicators = document.querySelectorAll(".indicator");
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle("active", index === currentSlide);
    });
}

function prevSlide() {
    const slides = document.querySelectorAll(".carousel-slide");
    const totalSlides = slides.length;
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarousel();
}

function nextSlide() {
    const slides = document.querySelectorAll(".carousel-slide");
    const totalSlides = slides.length;
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
}

function goToSlide(slideIndex) {
    currentSlide = slideIndex;
    updateCarousel();
}

// Home page slider function
function moveSlider(direction) {
    const wrapper = document.querySelector(".sliderWrapper");
    if (!wrapper) return;
    
    const totalItems = document.querySelectorAll(".sliderItem").length;
    let currentIndex = parseInt(wrapper.dataset.currentIndex || 0);
    
    currentIndex += direction;
    
    if (currentIndex < 0) {
        currentIndex = totalItems - 1;
    } else if (currentIndex >= totalItems) {
        currentIndex = 0;
    }
    
    wrapper.dataset.currentIndex = currentIndex;
    wrapper.style.transform = `translateX(-${currentIndex * 100}vw)`;
}

// Product filtering function
function filterProducts() {
    const searchValue = document.getElementById("searchInput").value.toLowerCase();
    const productCards = document.querySelectorAll(".product-card, .card-product");

    productCards.forEach((card) => {
        const title = card.querySelector("h3").textContent.toLowerCase();
        card.style.display = title.includes(searchValue) ? "block" : "none";
    });
}

// Shopping cart functions
function addToCart(productId, name, price, imageSrc) {
    if (!selectedSize) {
        alert("Por favor, selecciona una talla");
        return;
    }

    // Get current cart or initialize empty array
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // Format price as number
    const priceValue = parseFloat(price.replace(/[^0-9.-]+/g, ""));
    
    // Create cart item object
    const cartItem = {
        id: productId,
        name: name,
        price: priceValue,
        image: imageSrc,
        size: selectedSize,
        quantity: 1
    };

    // Check if item already exists in cart with same size
    const existingItemIndex = cart.findIndex(item => 
        item.id === cartItem.id && item.size === cartItem.size
    );
    
    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity++;
    } else {
        cart.push(cartItem);
    }

    // Save cart to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    
    // Update cart display and show confirmation
    updateCartDisplay();
    closeProductDetails();
    toggleCart(true);
}

function updateCartDisplay() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartItemsContainer = document.querySelector(".cart-items");
    const cartTotal = document.querySelector(".cart-total");
    const cartBadge = document.querySelector(".cart-badge");
    
    if (!cartItemsContainer || !cartTotal) return;
    
    cartItemsContainer.innerHTML = "";
    let total = 0;
    let itemCount = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        itemCount += item.quantity;
        
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("cart-item");
        cartItemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p>Talla: ${item.size}</p>
                <div class="cart-item-quantity">
                    <button onclick="changeQuantity(${index}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQuantity(${index}, 1)">+</button>
                </div>
                <p>$${(item.price * item.quantity).toFixed(2)}</p>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${index})">×</button>
        `;
        cartItemsContainer.appendChild(cartItemElement);
    });

    cartTotal.textContent = `$${total.toFixed(2)}`;
    
    if (cartBadge) {
        cartBadge.textContent = itemCount;
    }
}

function toggleCart(forceOpen = null) {
    const cartOverlay = document.querySelector(".cart-overlay");
    if (!cartOverlay) return;
    
    if (forceOpen !== null) {
        cartOverlay.classList.toggle("cart-visible", forceOpen);
    } else {
        cartOverlay.classList.toggle("cart-visible");
    }
}

function changeQuantity(index, change) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (!cart[index]) return;
    
    cart[index].quantity = Math.max(1, cart[index].quantity + change);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartDisplay();
}

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (!cart[index]) return;
    
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartDisplay();
}

function checkout() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
        alert("El carrito está vacío");
        return;
    }

    alert("¡Gracias por tu compra!");
    localStorage.removeItem("cart");
    updateCartDisplay();
    toggleCart(false);
}

// Product rating function
function rateProduct(rating) {
    const productDetails = document.getElementById('product-details');
    if (!productDetails) return;
    
    const productId = productDetails.getAttribute('data-product-id');
    if (!productId) return;
    
    // Save rating to localStorage
    localStorage.setItem(`product_rating_${productId}`, rating);
    
    // Update visual stars
    const stars = document.querySelectorAll('.product-rating .star');
    stars.forEach((star, index) => {
        star.classList.toggle('active', index < rating);
    });
}

// Scroll animation functions
function initScrollAnimation() {
    const scrollTexts = document.querySelectorAll('.scrolling-text');
    
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        return rect.top <= windowHeight * 0.7;
    }
    
    function handleScroll() {
        scrollTexts.forEach(text => {
            if (isElementInViewport(text) && !text.classList.contains('visible')) {
                text.classList.add('visible');
            }
        });
    }
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on page load
}

// Handle modal clicks outside content area
document.addEventListener('click', function(event) {
    const productDetails = document.getElementById('product-details');
    if (productDetails && event.target === productDetails) {
        closeProductDetails();
    }
});









