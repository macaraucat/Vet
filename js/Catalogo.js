// Agrega un producto al carrito (guardado en localStorage)
function agregarAlCarrito(id, nombre, precio, imagen) {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const item = carrito.find(p => p.id === id);

    if (item) {
        item.cantidad += 1;
    } else {
        carrito.push({ id, nombre, precio, imagen, cantidad: 1 });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarContadorCarrito();
    alert("Producto agregado al carrito");
}

function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const total = carrito.reduce((suma, item) => suma + item.cantidad, 0);
    const contador = document.getElementById("contador-carrito");
    if (contador) {
        contador.textContent = total;
    }
}

document.addEventListener("DOMContentLoaded", actualizarContadorCarrito);