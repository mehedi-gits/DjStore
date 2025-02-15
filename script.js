let cart = [];

document.addEventListener("DOMContentLoaded", () => {
    loadCartFromLocalStorage();
    updateCartUI();
});

function saveCartToLocalStorage() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function loadCartFromLocalStorage() {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
        cart = JSON.parse(storedCart);
    }
}


function addToCart(title, price, image) {
    let productIndex = cart.findIndex(item => item.title === title);

    if (productIndex !== -1) {
        cart[productIndex].quantity += 1;
    } else {
        cart.push({ title, price, image, quantity: 1 });
    }

    saveCartToLocalStorage();
    updateCartUI();
}

function updateCartUI() {
    let cartList = document.getElementById("cart-items");
    let cartCount = document.getElementById("cart-count");
    let cartCountHeader = document.getElementById("cart-count-header");
    let cartTotal = document.getElementById("cart-total");

    cartList.innerHTML = "";
    let total = 0;
    let totalQuantity = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        totalQuantity += item.quantity;

        cartList.innerHTML += `
            <div class="cart-item d-flex align-items-center border-bottom p-2">
                <img src="${item.image}" alt="${item.title}" class="cart-img me-2" style="width: 50px; height: 50px;">
                <div class="flex-grow-1">
                    <strong>${item.title}</strong>
                    <p class="mb-1">Tk ${item.price} X <span id="quantity-${index}">${item.quantity}</span></p>
                </div>
                <div class="d-flex align-items-center">
                    <button class="btn btn-sm btn-secondary me-1" onclick="decreaseQuantity(${index})">-</button>
                    <button class="btn btn-sm btn-primary" onclick="increaseQuantity(${index})">+</button>
                </div>
                <button class="btn btn-danger btn-sm ms-2" onclick="removeFromCart(${index})">
                    <i class="fa fa-trash"></i>
                </button>
                
            </div>
            
        `;
    });

    if (cart.length > 0) {
        cartList.innerHTML += `
            <div class="mt-3 d-flex justify-content-center">
                <button class="btn btn-danger btn-sm" onclick="clearCart()" id="clearcartbtn">Clear Cart</button>
            </div>
        `;
    }


    cartCount.innerText = cart.length;
    cartCountHeader.innerText = cart.length < 2 ? `${cart.length} Item` : `${cart.length} Items`;

    cartTotal.innerText = `Total Qty: ${totalQuantity} | Total: Tk ${total}`;

    document.getElementById("empty-cart-message").style.display = cart.length === 0 ? "block" : "none";

    saveCartToLocalStorage();
}

function increaseQuantity(index) {
    cart[index].quantity += 1;
    updateCartUI();
}

function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    } else {
        cart.splice(index, 1);
    }
    updateCartUI();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function clearCart() {
    document.getElementById("clearcartbtn");
    cart = [];
    saveCartToLocalStorage();
    updateCartUI()
}

fetch("products.json")
    .then(response => response.json())
    .then(data => {
        let productContainer = document.getElementById("product-list");
        data.forEach(product => {
            let productCard = `
                <div class="card me-4 mb-3" style="width: 16rem;">
                    <img class="mt-2 rounded card-img-top" src="${product.productimg}" alt="${product.title}">
                    <div class="card-body text-center">
                    <p class="productdes">${product.description.substr(0,40)}....</p>
                        <span class="card-title fw-bold text-success">${product.title}</span>
                        <span class="fw-bold ps-3">${product.price} <i class="fa-solid fa-bangladeshi-taka-sign"></i></span>
                        <center>
                            <button class="btn btn-primary add-to-cart btn-sm mt-1" 
                                onclick="addToCart('${product.title}', ${product.price}, '${product.productimg}')">
                                Add to Cart
                            </button>
                        </center>
                    </div>
                </div>
            `;
            productContainer.innerHTML += productCard;
        });
    });
