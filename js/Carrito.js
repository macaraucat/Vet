function obtenerCarrito() {
    return JSON.parse(localStorage.getItem("carrito")) || [];
}

function guardarCarrito(carrito) {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function quitarDelCarrito(id) {
    const carrito = obtenerCarrito().filter(p => p.id !== id);
    guardarCarrito(carrito);
}

function vaciarCarrito() {
    localStorage.removeItem("carrito");
}

// Pinta la tabla del carrito con lo que haya guardado
function pintarCarrito() {
    const carrito = obtenerCarrito();
    const cuerpoTabla = document.getElementById("items-carrito");
    const tabla = document.getElementById("tabla-carrito");
    const resumen = document.getElementById("resumen-carrito");
    const vacio = document.getElementById("carrito-vacio");

    cuerpoTabla.innerHTML = "";

    if (carrito.length === 0) {
        tabla.classList.add("d-none");
        resumen.classList.add("d-none");
        vacio.classList.remove("d-none");
        return;
    }

    tabla.classList.remove("d-none");
    resumen.classList.remove("d-none");
    vacio.classList.add("d-none");

    let total = 0;

    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;

        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td><img src="${item.imagen}" alt="${item.nombre}" class="img-carrito"></td>
            <td>${item.nombre}</td>
            <td>$${item.precio.toLocaleString("es-CL")}</td>
            <td>${item.cantidad}</td>
            <td>$${subtotal.toLocaleString("es-CL")}</td>
            <td><button class="btn btn-sm btn-outline-danger" onclick="eliminarItem('${item.id}')">Quitar</button></td>
        `;
        cuerpoTabla.appendChild(fila);
    });

    document.getElementById("total-carrito").textContent = total.toLocaleString("es-CL");
}

function eliminarItem(id) {
    quitarDelCarrito(id);
    pintarCarrito();
    actualizarContadorCarrito();
}

function limpiarCarrito() {
    vaciarCarrito();
    pintarCarrito();
    actualizarContadorCarrito();
}

// Simula que el pedido se concretó
function finalizarCompra() {
    const carrito = obtenerCarrito();

    if (carrito.length === 0) {
        return;
    }

    const numeroPedido = Math.floor(100000 + Math.random() * 900000);

    vaciarCarrito();
    pintarCarrito();
    actualizarContadorCarrito();

    const aviso = document.getElementById("pedido-confirmado");
    aviso.textContent = `¡Pedido N.º ${numeroPedido} realizado con éxito! Te contactaremos para coordinar la entrega.`;
    aviso.classList.remove("d-none");
}

document.addEventListener("DOMContentLoaded", function () {
    pintarCarrito();
    actualizarContadorCarrito();
});