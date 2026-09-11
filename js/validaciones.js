// Función para validar correo electrónico con dominios permitidos
function validarCorreo(correo) {
    const dominiosPermitidos = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
    if (!correo || correo.length > 100) return false;
    return dominiosPermitidos.some(dominio => correo.toLowerCase().endsWith(dominio));
}

// Validación de RUN Chileno (Módulo 11, sin puntos ni guion, 7 a 9 caracteres)
function validarRunChileno(run) {
    const runLimpio = run.replace(/[\.\-]/g, '').toUpperCase();
    if (!/^[0-9]{7,8}[0-9K]$/.test(runLimpio)) return false;

    const cuerpo = runLimpio.slice(0, -1);
    const dv = runLimpio.slice(-1);

    let suma = 0;
    let multiplicador = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += parseInt(cuerpo.charAt(i), 10) * multiplicador;
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }

    const dvEsperado = 11 - (suma % 11);
    let dvCalc = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();

    return dv === dvCalc;
}

// Función para mostrar error en el campo
function mostrarError(element, mensaje) {
    element.classList.add('is-invalid');
    element.classList.remove('is-valid');

    // Eliminar feedback anterior si existe
    let feedback = element.nextElementSibling;
    if (feedback && feedback.classList.contains('invalid-feedback')) {
        feedback.remove();
    }

    // Crear nuevo elemento de feedback
    const errorElement = document.createElement('div');
    errorElement.className = 'invalid-feedback';
    errorElement.textContent = mensaje;
    element.parentNode.insertBefore(errorElement, element.nextSibling);
}

// Función para mostrar éxito en el campo
function mostrarExito(element) {
    element.classList.remove('is-invalid');
    element.classList.add('is-valid');

    // Eliminar feedback de error si existe
    let feedback = element.nextElementSibling;
    if (feedback && feedback.classList.contains('invalid-feedback')) {
        feedback.remove();
    }
}

// Validación del formulario de login
function validarLogin() {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;

    const email = document.getElementById('email');
    const pass = document.getElementById('pass');

    loginForm.addEventListener('submit', (e) => {
        let valido = true;

        // Validación de correo
        if (!email.value.trim()) {
            mostrarError(email, 'El correo electrónico es obligatorio.');
            valido = false;
        } else if (!validarCorreo(email.value.trim())) {
            mostrarError(email, 'Correo inválido. Solo se permiten @duoc.cl, @profesor.duoc.cl o @gmail.com (máx. 100 caracteres).');
            valido = false;
        } else {
            mostrarExito(email);
        }

        // Validación de contraseña
        const passVal = pass.value;
        if (!passVal) {
            mostrarError(pass, 'La contraseña es obligatoria.');
            valido = false;
        } else if (passVal.length < 4 || passVal.length > 10) {
            mostrarError(pass, 'La contraseña debe tener entre 4 y 10 caracteres.');
            valido = false;
        } else {
            mostrarExito(pass);
        }

        if (!valido) {
            e.preventDefault();
        }
    });
}

// Validación del formulario de registro
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
        let valido = true;

        // Validación de RUN
        if (!run.value.trim()) {
            mostrarError(run, 'El RUN es obligatorio.');
            valido = false;
        } else if (!validarRunChileno(run.value.trim())) {
            mostrarError(run, 'Ingrese un RUN válido sin puntos ni guion (Ej: 19011022K).');
            valido = false;
        } else {
            mostrarExito(run);
        }

        // Validación de nombre
        if (!nombre.value.trim()) {
            mostrarError(nombre, 'El nombre es obligatorio.');
            valido = false;
        } else if (nombre.value.trim().length > 50) {
            mostrarError(nombre, 'El nombre no puede exceder los 50 caracteres.');
            valido = false;
        } else {
            mostrarExito(nombre);
        }

        // Validación de correo
        if (!emailReg.value.trim()) {
            mostrarError(emailReg, 'El correo electrónico es obligatorio.');
            valido = false;
        } else if (!validarCorreo(emailReg.value.trim())) {
            mostrarError(emailReg, 'Correo inválido. Solo se permiten @duoc.cl, @profesor.duoc.cl o @gmail.com.');
            valido = false;
        } else {
            mostrarExito(emailReg);
        }

        // Validación de dirección
        if (!direccion.value.trim()) {
            mostrarError(direccion, 'La dirección es obligatoria.');
            valido = false;
        } else if (direccion.value.trim().length > 300) {
            mostrarError(direccion, 'La dirección no puede exceder 300 caracteres.');
            valido = false;
        } else {
            mostrarExito(direccion);
        }

        // Validación de contraseña
        if (!passReg.value) {
            mostrarError(passReg, 'La contraseña es obligatoria.');
            valido = false;
        } else if (passReg.value.length < 4 || passReg.value.length > 10) {
            mostrarError(passReg, 'La contraseña debe tener entre 4 y 10 caracteres.');
            valido = false;
        } else {
            mostrarExito(passReg);
        }

        // Validación de confirmación de contraseña
        if (!pass2Reg.value) {
            mostrarError(pass2Reg, 'Debe confirmar la contraseña.');
            valido = false;
        } else if (pass2Reg.value !== passReg.value) {
            mostrarError(pass2Reg, 'Las contraseñas no coinciden.');
            valido = false;
        } else {
            mostrarExito(pass2Reg);
        }

        if (!valido) {
            e.preventDefault();
        }
    });
}

// Inicializar validaciones cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    validarLogin();
    validarRegistro();
});