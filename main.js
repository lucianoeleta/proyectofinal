let cart = JSON.parse(localStorage.getItem('cart')) || [];


function cargarProductosDesdejson() {
    fetch("data.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al cargar los productos desde la API");
            }
            return response.json();
        })
        .then(data => {
            mostrarProductos(data);
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.message,
            });
        });
}

// Función para mostrar los productos en el DOM
function mostrarProductos(productos) {
    const productsContainer = document.getElementById('products');
    productsContainer.innerHTML = '';

    productos.forEach(producto => {
        const productElement = document.createElement('div');
        productElement.className = 'product';
        productElement.setAttribute('data-id', producto.id);
        productElement.setAttribute('data-name', producto.name);
        productElement.setAttribute('data-price', producto.price);

        productElement.innerHTML = `
            <img src="${producto.image}" alt="${producto.name}">
            <div>
                <strong>${producto.name}</strong> - $${producto.price}
            </div>
            <button onclick="addToCart(${producto.id})">Agregar al carrito</button>
        `;

        productsContainer.appendChild(productElement);
    });
}

// Función para agregar productos al carrito
function addToCart(productId) {
    try {
        const productElement = document.querySelector(`.product[data-id='${productId}']`);
        const name = productElement.getAttribute('data-name');
        const price = parseFloat(productElement.getAttribute('data-price'));

        const existingProduct = cart.find(item => item.id === productId);

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push({ id: productId, name, price, quantity: 1 });
        }

        updateCart();
        saveCart();

        // Mostrar alerta de éxito con SweetAlert2
        Swal.fire({
            icon: 'success',
            title: 'Producto agregado',
            text: `${name} ha sido agregado al carrito.`,
            timer: 1500,
            showConfirmButton: false
        });

    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message,
        });
    }
}

// Actualizar la visualización del carrito
function updateCart() {
    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML = '';

    cart.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.name} - $${item.price} x ${item.quantity}`;
        cartItems.appendChild(listItem);
    });

    const totalElement = document.getElementById('total');
    const total = calculateTotal();
    totalElement.textContent = `Total: $${total.toFixed(2)}`;
}

// Calcular el total del carrito
function calculateTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// Guardar el carrito en localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Vaciar el carrito
function clearCart() {
    cart = [];
    updateCart();
    saveCart();

    // Mostrar alerta de carrito vaciado
    Swal.fire({
        icon: 'success',
        title: 'Carrito Vaciado',
        text: 'El carrito ha sido vaciado.',
        timer: 1500,
        showConfirmButton: false
    });
}

// Inicializa el carrito al cargar la página y carga los productos
document.addEventListener("DOMContentLoaded", () => {
    cargarProductosDesdejson(); // Asegúrate de llamar la función correctamente
    updateCart();
});

