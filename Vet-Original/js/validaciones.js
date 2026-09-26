function validarCorreo(correo) {
    const dominiosPermitidos = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
    if (!correo || correo.length > 100) return false;
    return dominiosPermitidos.some(dominio => correo.toLowerCase().endsWith(dominio));
}

function validarRun(run) {
    return /^[0-9]{7,8}[0-9K]$/.test(run);
}

function mostrarError(element, mensaje) {
    element.classList.add('is-invalid');
    element.classList.remove('is-valid');
    element.nextElementSibling.textContent = mensaje;
}

function mostrarExito(element) {
    element.classList.remove('is-invalid');
    element.classList.add('is-valid');
}

// ==================== Función genérica de validación de campos ====================
function validarCampo(element, mensajeVacio, reglas = [], { trim = true } = {}) {
    const valor = trim ? element.value.trim() : element.value;

    if (!valor) {
        mostrarError(element, mensajeVacio);
        return false;
    }

    for (const regla of reglas) {
        if (!regla.test(valor)) {
            mostrarError(element, regla.mensaje);
            return false;
        }
    }

    mostrarExito(element);
    return true;
}

function validarLogin() {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;

    const email = document.getElementById('email');
    const pass = document.getElementById('pass');

    loginForm.addEventListener('submit', (e) => {
        const emailValido = validarCampo(email, 'El correo electrónico es obligatorio.', [
            { test: validarCorreo, mensaje: 'Correo inválido. Solo se permiten @duoc.cl, @profesor.duoc.cl o @gmail.com (máx. 100 caracteres).' }
        ]);

        const passValido = validarCampo(pass, 'La contraseña es obligatoria.', [
            { test: v => v.length >= 4 && v.length <= 10, mensaje: 'La contraseña debe tener entre 4 y 10 caracteres.' }
        ], { trim: false });

        if (!emailValido || !passValido) {
            e.preventDefault();
        }
    });
}

function validarRegistro() {
    const registroForm = document.getElementById('registro-form');
    if (!registroForm) return;

    const run = document.getElementById('run');
    const nombre = document.getElementById('nombre');
    const emailReg = document.getElementById('email-registro');
    const direccion = document.getElementById('direccion');
    const passReg = document.getElementById('pass-registro');
    const pass2Reg = document.getElementById('pass2-registro');

    registroForm.addEventListener('submit', (e) => {
        const runValido = validarCampo(run, 'El RUN es obligatorio.', [
            { test: validarRun, mensaje: 'Ingrese un RUN válido sin puntos ni guion (Ej: 19011022K).' }
        ]);

        const nombreValido = validarCampo(nombre, 'El nombre es obligatorio.', [
            { test: v => v.length <= 50, mensaje: 'El nombre no puede exceder los 50 caracteres.' }
        ]);

        const emailValido = validarCampo(emailReg, 'El correo electrónico es obligatorio.', [
            { test: validarCorreo, mensaje: 'Correo inválido. Solo se permiten @duoc.cl, @profesor.duoc.cl o @gmail.com.' }
        ]);

        const direccionValida = validarCampo(direccion, 'La dirección es obligatoria.', [
            { test: v => v.length <= 300, mensaje: 'La dirección no puede exceder 300 caracteres.' }
        ]);

        const passValida = validarCampo(passReg, 'La contraseña es obligatoria.', [
            { test: v => v.length >= 4 && v.length <= 10, mensaje: 'La contraseña debe tener entre 4 y 10 caracteres.' }
        ], { trim: false });

        const pass2Valida = validarCampo(pass2Reg, 'Debe confirmar la contraseña.', [
            { test: v => v === passReg.value, mensaje: 'Las contraseñas no coinciden.' }
        ], { trim: false });

        if (!runValido || !nombreValido || !emailValido || !direccionValida || !passValida || !pass2Valida) {
            e.preventDefault();
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    validarLogin();
    validarRegistro();
});