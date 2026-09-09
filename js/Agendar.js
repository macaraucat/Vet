// Guarda y muestra las horas solicitadas usando localStorage (no hay backend)

function obtenerCitas() {
    return JSON.parse(localStorage.getItem("citas")) || [];
}

function guardarCitas(citas) {
    localStorage.setItem("citas", JSON.stringify(citas));
}

function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const total = carrito.reduce((suma, item) => suma + item.cantidad, 0);
    const contador = document.getElementById("contador-carrito");
    if (contador) {
        contador.textContent = total;
    }
}

function pintarCitas() {
    const citas = obtenerCitas();
    const contenedor = document.getElementById("lista-citas");
    contenedor.innerHTML = "";

    if (citas.length === 0) {
        contenedor.innerHTML = "<p class='text-center text-muted'>Todavía no has solicitado ninguna hora.</p>";
        return;
    }

    citas.forEach((cita, index) => {
        const div = document.createElement("div");
        div.className = "cita-card";
        div.innerHTML = `
            <p><strong>${cita.mascota}</strong> (${cita.especie}) — ${cita.servicio}</p>
            <p>Fecha: ${cita.fecha} a las ${cita.hora}</p>
            <p>Dueño: ${cita.dueno} · Teléfono: ${cita.telefono}</p>
            ${cita.comentario ? `<p>Comentario: ${cita.comentario}</p>` : ""}
            <button class="btn btn-outline-danger btn-sm mt-2" onclick="eliminarCita(${index})">Cancelar</button>
        `;
        contenedor.appendChild(div);
    });
}

function eliminarCita(index) {
    const citas = obtenerCitas();
    citas.splice(index, 1);
    guardarCitas(citas);
    pintarCitas();
}

const form = document.getElementById("form-agendar");
const inputFecha = document.getElementById("fecha");

// No permitir elegir una fecha anterior a hoy en el propio selector
const hoy = new Date().toISOString().split("T")[0];
inputFecha.setAttribute("min", hoy);

form.addEventListener("submit", function (evento) {
    evento.preventDefault();
    evento.stopPropagation();

    // Validación extra: la fecha no puede ser anterior a hoy
    if (inputFecha.value && inputFecha.value < hoy) {
        inputFecha.setCustomValidity("Fecha inválida");
    } else {
        inputFecha.setCustomValidity("");
    }

    // Si el formulario no cumple las validaciones (required, minlength, pattern, fecha), se detiene aquí
    if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return;
    }

    form.classList.add("was-validated");

    const nuevaCita = {
        dueno: document.getElementById("nombre-dueno").value.trim(),
        telefono: document.getElementById("telefono").value.trim(),
        mascota: document.getElementById("nombre-mascota").value.trim(),
        especie: document.getElementById("especie").value,
        servicio: document.getElementById("servicio").value,
        fecha: inputFecha.value,
        hora: document.getElementById("hora").value,
        comentario: document.getElementById("comentario").value.trim()
    };

    const citas = obtenerCitas();
    citas.push(nuevaCita);
    guardarCitas(citas);

    const confirmacion = document.getElementById("confirmacion");
    confirmacion.textContent = `Hora solicitada para ${nuevaCita.mascota} el ${nuevaCita.fecha} a las ${nuevaCita.hora}. Te contactaremos para confirmar.`;
    confirmacion.classList.remove("d-none");

    form.reset();
    form.classList.remove("was-validated");
    pintarCitas();
});

document.addEventListener("DOMContentLoaded", function () {
    pintarCitas();
    actualizarContadorCarrito();
});