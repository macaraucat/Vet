document.addEventListener('DOMContentLoaded', () => {
    const dominiosPermitidos = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];

    // Validación de Correo (Max 100 caracteres y dominios específicos)
    function validarCorreo(correo) {
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

    // Feedback visual con clases Bootstrap
    function mostrarError(element, mensaje) {
        element.classList.add('is-invalid');
        element.classList.remove('is-valid');
        let feedback = element.nextElementSibling;
        if (!feedback || !feedback.classList.contains('invalid-feedback')) {
            feedback = document.createElement('div');
            feedback.className = 'invalid-feedback';
            element.parentNode.insertBefore(feedback, element.nextSibling);
        }
        feedback.textContent = mensaje;
    }

    function mostrarExito(element) {
        element.classList.remove('is-invalid');
        element.classList.add('is-valid');
    }

    /* LOGIN */
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        const email = document.getElementById('email');
        const pass = document.getElementById('pass');

        loginForm.addEventListener('submit', (e) => {
            let valido = true;

            // Correo: máx 100, dominios permitidos
            if (!email.value.trim()) {
                mostrarError(email, 'El correo es obligatorio.');
                valido = false;
            } else if (!validarCorreo(email.value.trim())) {
                mostrarError(email, 'Correo inválido. Solo @duoc.cl, @profesor.duoc.cl o @gmail.com (máx. 100 caracteres).');
                valido = false;
            } else {
                mostrarExito(email);
            }

            // Contraseña: entre 4 y 10 caracteres
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

            if (!valido) e.preventDefault();
        });
    }

    /* REGISTRO */
    const registroForm = document.getElementById('registro-form');
    if (registroForm) {
        const run = document.getElementById('run');
        const nombre = document.getElementById('nombre');
        const apellidos = document.getElementById('apellidos');
        const emailReg = document.getElementById('email-registro');
        const direccion = document.getElementById('direccion');
        const passReg = document.getElementById('pass-registro');
        const pass2Reg = document.getElementById('pass2-registro');

        registroForm.addEventListener('submit', (e) => {
            let valido = true;

            // RUN: Requerido, 7-9 caracteres, formato válido
            if (!run.value.trim()) {
                mostrarError(run, 'El RUN es obligatorio.');
                valido = false;
            } else if (!validarRunChileno(run.value.trim())) {
                mostrarError(run, 'Ingrese un RUN válido sin puntos ni guion (Ej: 19011022K).');
                valido = false;
            } else {
                mostrarExito(run);
            }

            // Nombre: Requerido, máx 50 caracteres
            if (!nombre.value.trim()) {
                mostrarError(nombre, 'El nombre es obligatorio.');
                valido = false;
            } else if (nombre.value.trim().length > 50) {
                mostrarError(nombre, 'El nombre no puede exceder los 50 caracteres.');
                valido = false;
            } else {
                mostrarExito(nombre);
            }

            // Apellidos: Requerido, máx 100 caracteres
            if (!apellidos.value.trim()) {
                mostrarError(apellidos, 'Los apellidos son obligatorios.');
                valido = false;
            } else if (apellidos.value.trim().length > 100) {
                mostrarError(apellidos, 'Los apellidos no pueden exceder los 100 caracteres.');
                valido = false;
            } else {
                mostrarExito(apellidos);
            }

            // Correo: Requerido, máx 100, dominios autorizados
            if (!emailReg.value.trim()) {
                mostrarError(emailReg, 'El correo es obligatorio.');
                valido = false;
            } else if (!validarCorreo(emailReg.value.trim())) {
                mostrarError(emailReg, 'Correo inválido. Usar @duoc.cl, @profesor.duoc.cl o @gmail.com.');
                valido = false;
            } else {
                mostrarExito(emailReg);
            }

            // Dirección: Requerido, máx 300 caracteres
            if (!direccion.value.trim()) {
                mostrarError(direccion, 'La dirección es obligatoria.');
                valido = false;
            } else if (direccion.value.trim().length > 300) {
                mostrarError(direccion, 'La dirección no puede exceder 300 caracteres.');
                valido = false;
            } else {
                mostrarExito(direccion);
            }

            // Contraseña: Entre 4 y 10 caracteres
            if (!passReg.value) {
                mostrarError(passReg, 'La contraseña es obligatoria.');
                valido = false;
            } else if (passReg.value.length < 4 || passReg.value.length > 10) {
                mostrarError(passReg, 'La contraseña debe tener entre 4 y 10 caracteres.');
                valido = false;
            } else {
                mostrarExito(passReg);
            }

            // Confirmar contraseña
            if (!pass2Reg.value) {
                mostrarError(pass2Reg, 'Debe confirmar la contraseña.');
                valido = false;
            } else if (pass2Reg.value !== passReg.value) {
                mostrarError(pass2Reg, 'Las contraseñas no coinciden.');
                valido = false;
            } else {
                mostrarExito(pass2Reg);
            }

            if (!valido) e.preventDefault();
        });
    }

    /* CONTACTO */
    const contactoSection = document.getElementById('contacto');
    if (contactoSection) {
        const contactoForm = contactoSection.querySelector('form');
        if (contactoForm) {
            const asunto = document.getElementById('asunto');
            const emailContacto = document.getElementById('email');
            const mensaje = document.getElementById('mensaje');

            contactoForm.addEventListener('submit', (e) => {
                let valido = true;

                // Asunto: máx 100 caracteres
                if (asunto) {
                    if (!asunto.value.trim()) {
                        mostrarError(asunto, 'El asunto es obligatorio.');
                        valido = false;
                    } else if (asunto.value.trim().length > 100) {
                        mostrarError(asunto, 'El asunto no puede exceder 100 caracteres.');
                        valido = false;
                    } else {
                        mostrarExito(asunto);
                    }
                }

                // Correo: máx 100, dominios válidos
                if (emailContacto) {
                    if (!emailContacto.value.trim()) {
                        mostrarError(emailContacto, 'El correo es obligatorio.');
                        valido = false;
                    } else if (!validarCorreo(emailContacto.value.trim())) {
                        mostrarError(emailContacto, 'Correo inválido. Solo @duoc.cl, @profesor.duoc.cl o @gmail.com.');
                        valido = false;
                    } else {
                        mostrarExito(emailContacto);
                    }
                }

                // Mensaje: máx 500 caracteres
                if (mensaje) {
                    if (!mensaje.value.trim()) {
                        mostrarError(mensaje, 'El mensaje es obligatorio.');
                        valido = false;
                    } else if (mensaje.value.trim().length > 500) {
                        mostrarError(mensaje, 'El mensaje no puede superar los 500 caracteres.');
                        valido = false;
                    } else {
                        mostrarExito(mensaje);
                    }
                }

                if (!valido) e.preventDefault();
            });
        }
    }
});