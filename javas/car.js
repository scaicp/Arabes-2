

console.log("Script car.js cargado correctamente");

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let cartVisible = false;

// 📌 Crear dinámicamente el contenedor del carrito si no existe
function createCartUI() {
    let cartOverlay = document.createElement("div");
    cartOverlay.classList.add("cart-overlay");
    cartOverlay.innerHTML = `
        <div class="cart-container">
            <button class="cart-close">×</button>
            <h2>Carrito de Compras</h2>
            <div class="cart-items"></div>
            <div class="cart-footer">
                <p>Total: <span class="cart-total">$0.00</span></p>
                <button class="btn-checkout">Finalizar Compra</button>
            </div>
        </div>
    `;
    document.body.appendChild(cartOverlay);

    // Eventos del carrito
    document.querySelector(".cart-close").addEventListener("click", () => toggleCart(false));
    document.querySelector(".btn-checkout").addEventListener("click", checkout);
}

// 📌 Función para abrir o cerrar el carrito
function toggleCart(forceOpen = null) {
    let cartOverlay = document.querySelector(".cart-overlay");
    if (!cartOverlay) createCartUI();

    cartOverlay = document.querySelector(".cart-overlay");
    if (forceOpen === null) {
        cartOverlay.classList.toggle("cart-visible");
    } else {
        cartOverlay.classList.toggle("cart-visible", forceOpen);
    }
    cartVisible = cartOverlay.classList.contains("cart-visible");
}

// 📌 Función para actualizar la vista del carrito
function updateCartDisplay() {
    let cartItemsContainer = document.querySelector(".cart-items");
    let cartTotal = document.querySelector(".cart-total");

    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        let cartItemElement = document.createElement("div");
        cartItemElement.classList.add("cart-item");
        cartItemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p>Talla: ${item.size}</p>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" data-index="${index}" data-action="-1">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" data-index="${index}" data-action="1">+</button>
                </div>
                <p>$${(item.price * item.quantity).toFixed(2)}</p>
            </div>
            <button class="cart-item-remove" data-index="${index}">×</button>
        `;
        cartItemsContainer.appendChild(cartItemElement);
    });

    cartTotal.textContent = `$${total.toFixed(2)}`;
    document.querySelector(".cart-badge").textContent = cart.length;

    // Asignar eventos usando delegación
    cartItemsContainer.addEventListener("click", function (e) {
        if (e.target.classList.contains("quantity-btn")) {
            let index = e.target.dataset.index;
            let action = parseInt(e.target.dataset.action);
            changeQuantity(index, action);
        } else if (e.target.classList.contains("cart-item-remove")) {
            let index = e.target.dataset.index;
            removeFromCart(index);
        }
    });
}

// 📌 Función para cambiar la cantidad de un producto en el carrito
function changeQuantity(index, change) {
    cart[index].quantity = Math.max(1, cart[index].quantity + change);
    saveCartToStorage();
    updateCartDisplay();
}

// 📌 Función para eliminar un producto del carrito
function removeFromCart(index) {
    cart.splice(index, 1);
    saveCartToStorage();
    updateCartDisplay();
}

// 📌 Función para guardar el carrito en localStorage
function saveCartToStorage() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// 📌 Función para procesar la compra
function checkout() {
    if (cart.length === 0) {
        showToast("El carrito está vacío");
        return;
    }

    showToast("¡Gracias por tu compra!");
    cart = [];
    saveCartToStorage();
    updateCartDisplay();
    toggleCart(false);
}

// 📌 Función para mostrar notificaciones personalizadas
function showToast(message) {
    let toast = document.createElement("div");
    toast.classList.add("toast");
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add("fade-out");
        setTimeout(() => toast.remove(), 500);
    }, 2000);
}

// ✅ Inicializar carrito al cargar la página
document.addEventListener("DOMContentLoaded", function () {
    createCartUI();
    updateCartDisplay();

    let cartToggle = document.querySelector(".cart-toggle");
    if (cartToggle) cartToggle.addEventListener("click", () => toggleCart(true));
});


// 📌 Función para cambiar la cantidad de un producto en el carrito
function changeQuantity(index, change) {
    cart[index].quantity = Math.max(1, cart[index].quantity + change);
    saveCartToStorage();
    updateCartDisplay();
}

// 📌 Función para eliminar un producto del carrito
function removeFromCart(index) {
    cart.splice(index, 1);
    saveCartToStorage();
    updateCartDisplay();
}

// 📌 Función para guardar el carrito en localStorage
function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// 📌 Función para procesar la compra
function checkout() {
    if (cart.length === 0) {
        alert('El carrito está vacío');
        return;
    }

    alert('¡Gracias por tu compra!');
    cart = [];
    saveCartToStorage();
    updateCartDisplay();
    toggleCart(false);
}









console.log("Script java.js cargado correctamente");

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".buy-now").forEach(button => {
        button.addEventListener("click", function () {
            showProductDetails(this);
        });
    });

    // Cerrar modal al hacer clic fuera de él
    document.getElementById("product-details").addEventListener("click", function(event) {
        if (event.target === this) {
            closeProductDetails();
        }
    });

    document.getElementById("close-details").addEventListener("click", function() {
        closeProductDetails();
    });
});

// 📌 Función para mostrar los detalles del producto
function showProductDetails(button) {
    const product = button.closest(".card-product");
    if (!product) {
        console.error("No se encontró el producto.");
        return;
    }

    // Obtener datos del producto
    const productId = product.dataset.id || "producto";
    const imageSrc = product.dataset.image || "";
    const name = product.dataset.name || "Nombre no disponible";
    const price = product.dataset.price || "Precio no disponible";
    const description = product.dataset.description || "Descripción no disponible";
    
    // Obtener tallas disponibles (si no hay, se usan por defecto para tenis)
    const productSizes = product.dataset.sizes ? product.dataset.sizes.split(',') : ["6", "7", "8", "9", "10"];

    // Insertar los datos en el modal
    document.getElementById("details-image").src = imageSrc;
    document.getElementById("details-name").textContent = name;
    document.getElementById("details-price").textContent = price;
    document.getElementById("details-description").textContent = description;

    // Generar botones de tallas
    const sizeContainer = document.querySelector(".size-options");
    sizeContainer.innerHTML = "";
    productSizes.forEach(size => {
        const sizeButton = document.createElement("button");
        sizeButton.classList.add("size-button");
        sizeButton.textContent = size;
        sizeButton.onclick = function () {
            document.querySelectorAll(".size-button").forEach(btn => btn.classList.remove("selected"));
            this.classList.add("selected");
        };
        sizeContainer.appendChild(sizeButton);
    });

    // Configurar botón de agregar al carrito
    document.getElementById("add-to-cart").onclick = function () {
        addToCart(productId, name, price, imageSrc);
    };

    // Mostrar el modal
    document.getElementById("product-details").classList.remove("hidden");
}

// 📌 Función para agregar al carrito con la talla seleccionada
function addToCart(productId, name, price, imageSrc) {
    const selectedSize = document.querySelector(".size-button.selected");
    if (!selectedSize) {
        alert("Por favor, selecciona una talla");
        return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const cartItem = {
        id: productId,
        name: name,
        price: parseFloat(price.replace("$", "")),
        image: imageSrc,
        size: selectedSize.textContent,
        quantity: 1
    };

    // Verificar si el producto con la misma talla ya está en el carrito
    const existingItemIndex = cart.findIndex(item => item.id === cartItem.id && item.size === cartItem.size);
    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity++;
    } else {
        cart.push(cartItem);
    }

    // Guardar en localStorage y actualizar carrito
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartDisplay();
    closeProductDetails();
    toggleCart(true);
}

// 📌 Función para cerrar el modal de detalles del producto
function closeProductDetails() {
    document.getElementById("product-details").classList.add("hidden");
}

// 📌 Función para actualizar el carrito en pantalla
function updateCartDisplay() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartItemsContainer = document.querySelector(".cart-items");
    const cartTotal = document.querySelector(".cart-total");
    
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;
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
    document.querySelector(".cart-badge").textContent = cart.length;
}

// 📌 Función para mostrar/ocultar el carrito
function toggleCart(forceOpen = false) {
    const cartOverlay = document.querySelector(".cart-overlay");
    cartOverlay.classList.toggle("cart-visible", forceOpen);
}

// 📌 Función para cambiar la cantidad de un producto en el carrito
function changeQuantity(index, change) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart[index].quantity = Math.max(1, cart[index].quantity + change);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartDisplay();
}

// 📌 Función para eliminar un producto del carrito
function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartDisplay();
}

// 📌 Función para finalizar la compra
function checkout() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
        alert("El carrito está vacío");
        return;
    }

    alert("¡Gracias por tu compra!");
    localStorage.removeItem("cart");
    updateCartDisplay();
    toggleCart();
}














// Para tenis.html - Actualizar la función de checkout
function checkout() {
    // Cerrar el carrito
    document.querySelector('.cart-overlay').classList.remove('show');
    
    // Verificar si hay productos en el carrito
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert('No hay productos en el carrito');
        return;
    }
    
    // Redireccionar a la página de finalización de compra
    window.location.href = 'final.html';
}

// Reemplazar el botón de finalizar compra en tenis.html
document.addEventListener('DOMContentLoaded', function() {
    const checkoutButton = document.querySelector('.btn-checkout');
    if (checkoutButton) {
        checkoutButton.innerHTML = 'Finalizar Compra';
        checkoutButton.onclick = checkout;
    }
});

// Para el archivo car.js - Asegurar que el botón de checkout funcione correctamente
function updateCartUI() {
    const cartItems = document.querySelector('.cart-items');
    const cartBadge = document.querySelector('.cart-badge');
    const cartTotal = document.querySelector('.cart-total');
    
    // Obtener carrito del localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Actualizar el contador del carrito
    cartBadge.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Limpiar el contenedor de items
    cartItems.innerHTML = '';
    
    // Mostrar mensaje si el carrito está vacío
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
        cartTotal.textContent = '$0.00';
        return;
    }
    
    // Calcular el total
    let total = 0;
    
    // Agregar cada item al carrito
    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="item-details">
                <h4>${item.name}</h4>
                <p>Talla: ${item.size}</p>
                <p>$${item.price.toFixed(2)}</p>
                <div class="quantity-controls">
                    <button class="quantity-btn minus" data-index="${index}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn plus" data-index="${index}">+</button>
                </div>
            </div>
            <button class="remove-item" data-index="${index}">&times;</button>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    // Actualizar el total
    cartTotal.textContent = `$${total.toFixed(2)}`;
    
    // Agregar eventos a los botones de cantidad y eliminar
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            const isPlus = this.classList.contains('plus');
            updateItemQuantity(index, isPlus);
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            removeFromCart(index);
        });
    });
}

// Función para actualizar la cantidad de un producto
function updateItemQuantity(index, increase) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (increase) {
        cart[index].quantity++;
    } else {
        cart[index].quantity--;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
}

// Función para eliminar un producto del carrito
function removeFromCart(index) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
}

// Mostrar/Ocultar el carrito
document.addEventListener('DOMContentLoaded', function() {
    const cartToggle = document.querySelector('.cart-toggle');
    const cartOverlay = document.querySelector('.cart-overlay');
    const cartClose = document.querySelector('.cart-close');
    
    if (cartToggle && cartOverlay && cartClose) {
        cartToggle.addEventListener('click', function(e) {
            e.preventDefault();
            cartOverlay.classList.add('show');
            updateCartUI();
        });
        
        cartClose.addEventListener('click', function() {
            cartOverlay.classList.remove('show');
        });
    }
    
    // Inicializar UI del carrito
    updateCartUI();
});














// Function to handle product details modal
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
    
    // Set product type and sizes based on product ID or name
    const isGorra = productId.includes("gorra") || name.toLowerCase().includes("gorra") || 
                   window.location.href.toLowerCase().includes("gorras.html");
    let productSizes;
    
    if (product.dataset.sizes) {
        productSizes = product.dataset.sizes.split(',');
    } else if (isGorra) {
        // For hats, use centimeter sizes
        productSizes = ["55-60 cm", "58-62 cm", "60-64 cm"];
    } else {
        // For clothing, use standard sizes
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

    // Update product image
    if (document.getElementById("details-image")) {
        document.getElementById("details-image").src = images[0];
        document.getElementById("details-image").alt = name;
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
        
        // Auto-select first size
        if (sizeContainer.firstChild) {
            selectSize(sizeContainer.firstChild, productSizes[0]);
        }
    }

    // Set up add to cart button
    const addToCartButton = document.getElementById("add-to-cart");
    if (addToCartButton) {
        addToCartButton.onclick = function() {
            addToCart(productId, name, price, images[0]);
        };
    }

    // Store product ID in modal for reference
    modal.setAttribute("data-product-id", productId);

    // Show modal
    modal.classList.remove("hidden");
    modal.style.display = "flex";
}

// Function to select a size
function selectSize(button, size) {
    document.querySelectorAll(".size-button").forEach(btn => {
        btn.classList.remove("selected");
    });
    button.classList.add("selected");
    selectedSize = size;
}

// Function to add an item to the cart
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

// Function to close the product details modal
function closeModal(event) {
    const modal = document.getElementById("product-details");
    if (!event || event.target === modal || event.target.id === "close-details") {
        if (modal) {
            modal.classList.add("hidden");
            modal.style.display = "none";
        }
    }
}

// Set up event listeners when DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
    // Set up event listeners for product buttons
    document.querySelectorAll(".buy-now").forEach(button => {
        button.addEventListener("click", function() {
            showProductDetails(this);
        });
    });
    
    // Initialize cart display
    updateCartDisplay();
    
    // Handle modal backdrop clicks
    const modal = document.getElementById("product-details");
    if (modal) {
        modal.addEventListener("click", function(event) {
            if (event.target === this) {
                closeModal(event);
            }
        });
    }
});




















