document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // Reglas Generales y Funciones Auxiliares
    // ----------------------------------------------------
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
        const emailInput = document.getElementById('email');
        const passInput = document.getElementById('pass');

        loginForm.addEventListener('submit', (e) => {
            let valido = true;

            // Correo: Requerido, máx 100, dominios permitidos
            if (!emailInput.value.trim()) {
                mostrarError(emailInput, 'El correo es obligatorio.');
                valido = false;
            } else if (!validarCorreo(emailInput.value.trim())) {
                mostrarError(emailInput, 'Correo inválido. Solo @duoc.cl, @profesor.duoc.cl o @gmail.com (máx. 100 caracteres).');
                valido = false;
            } else {
                mostrarExito(emailInput);
            }

            // Contraseña: Requerido, entre 4 y 10 caracteres
            const passVal = passInput.value;
            if (!passVal) {
                mostrarError(passInput, 'La contraseña es obligatoria.');
                valido = false;
            } else if (passVal.length < 4 || passVal.length > 10) {
                mostrarError(passInput, 'La contraseña debe tener entre 4 y 10 caracteres.');
                valido = false;
            } else {
                mostrarExito(passInput);
            }

            if (!valido) e.preventDefault();
        });
    }

    /* REGISTRO */
    const registroForm = document.getElementById('registro-form');
    if (registroForm) {
        const runInput = document.getElementById('run');
        const nombreInput = document.getElementById('nombre');
        const apellidosInput = document.getElementById('apellidos');
        const emailRegInput = document.getElementById('email-registro');
        const direccionInput = document.getElementById('direccion');
        const passRegInput = document.getElementById('pass-registro');
        const pass2RegInput = document.getElementById('pass2-registro');

        registroForm.addEventListener('submit', (e) => {
            let valido = true;

            // RUN: Requerido, 7-9 caracteres, formato válido
            if (!runInput.value.trim()) {
                mostrarError(runInput, 'El RUN es obligatorio.');
                valido = false;
            } else if (!validarRunChileno(runInput.value.trim())) {
                mostrarError(runInput, 'Ingrese un RUN válido sin puntos ni guion (Ej: 19011022K).');
                valido = false;
            } else {
                mostrarExito(runInput);
            }

            // Nombre: Requerido, máx 50 caracteres
            if (!nombreInput.value.trim()) {
                mostrarError(nombreInput, 'El nombre es obligatorio.');
                valido = false;
            } else if (nombreInput.value.trim().length > 50) {
                mostrarError(nombreInput, 'El nombre no puede exceder los 50 caracteres.');
                valido = false;
            } else {
                mostrarExito(nombreInput);
            }

            // Apellidos: Requerido, máx 100 caracteres
            if (!apellidosInput.value.trim()) {
                mostrarError(apellidosInput, 'Los apellidos son obligatorios.');
                valido = false;
            } else if (apellidosInput.value.trim().length > 100) {
                mostrarError(apellidosInput, 'Los apellidos no pueden exceder los 100 caracteres.');
                valido = false;
            } else {
                mostrarExito(apellidosInput);
            }

            // Correo: Requerido, máx 100, dominios autorizados
            if (!emailRegInput.value.trim()) {
                mostrarError(emailRegInput, 'El correo es obligatorio.');
                valido = false;
            } else if (!validarCorreo(emailRegInput.value.trim())) {
                mostrarError(emailRegInput, 'Correo inválido. Usar @duoc.cl, @profesor.duoc.cl o @gmail.com.');
                valido = false;
            } else {
                mostrarExito(emailRegInput);
            }

            // Dirección: Requerido, máx 300 caracteres
            if (!direccionInput.value.trim()) {
                mostrarError(direccionInput, 'La dirección es obligatoria.');
                valido = false;
            } else if (direccionInput.value.trim().length > 300) {
                mostrarError(direccionInput, 'La dirección no puede exceder 300 caracteres.');
                valido = false;
            } else {
                mostrarExito(direccionInput);
            }

            // Contraseña: Entre 4 y 10 caracteres
            if (!passRegInput.value) {
                mostrarError(passRegInput, 'La contraseña es obligatoria.');
                valido = false;
            } else if (passRegInput.value.length < 4 || passRegInput.value.length > 10) {
                mostrarError(passRegInput, 'La contraseña debe tener entre 4 y 10 caracteres.');
                valido = false;
            } else {
                mostrarExito(passRegInput);
            }

            // Confirmar contraseña
            if (!pass2RegInput.value) {
                mostrarError(pass2RegInput, 'Debe confirmar la contraseña.');
                valido = false;
            } else if (pass2RegInput.value !== passRegInput.value) {
                mostrarError(pass2RegInput, 'Las contraseñas no coinciden.');
                valido = false;
            } else {
                mostrarExito(pass2RegInput);
            }

            if (!valido) e.preventDefault();
        });
    }

    /* CONTACTO */
    const contactoSection = document.getElementById('contacto');
    if (contactoSection) {
        const contactoForm = contactoSection.querySelector('form');
        if (contactoForm) {
            const asuntoInput = document.getElementById('asunto');
            const emailContactoInput = document.getElementById('email');
            const mensajeInput = document.getElementById('mensaje');

            contactoForm.addEventListener('submit', (e) => {
                let valido = true;

                // Asunto / Nombre: Requerido, máx 100 caracteres
                if (asuntoInput) {
                    if (!asuntoInput.value.trim()) {
                        mostrarError(asuntoInput, 'El asunto es obligatorio.');
                        valido = false;
                    } else if (asuntoInput.value.trim().length > 100) {
                        mostrarError(asuntoInput, 'El asunto no puede exceder 100 caracteres.');
                        valido = false;
                    } else {
                        mostrarExito(asuntoInput);
                    }
                }

                // Correo: Requerido, máx 100, dominios válidos
                if (emailContactoInput) {
                    if (!emailContactoInput.value.trim()) {
                        mostrarError(emailContactoInput, 'El correo es obligatorio.');
                        valido = false;
                    } else if (!validarCorreo(emailContactoInput.value.trim())) {
                        mostrarError(emailContactoInput, 'Correo inválido. Solo @duoc.cl, @profesor.duoc.cl o @gmail.com.');
                        valido = false;
                    } else {
                        mostrarExito(emailContactoInput);
                    }
                }

                // Mensaje / Comentario: Requerido, máx 500 caracteres
                if (mensajeInput) {
                    if (!mensajeInput.value.trim()) {
                        mostrarError(mensajeInput, 'El mensaje es obligatorio.');
                        valido = false;
                    } else if (mensajeInput.value.trim().length > 500) {
                        mostrarError(mensajeInput, 'El mensaje no puede superar los 500 caracteres.');
                        valido = false;
                    } else {
                        mostrarExito(mensajeInput);
                    }
                }

                if (!valido) e.preventDefault();
            });
        }
    }

    /* AGENDAR CITA */
    const agendarForm = document.getElementById('form-agendar');
    if (agendarForm) {
        const nombreDueno = document.getElementById('nombre-dueno');
        const telefono = document.getElementById('telefono');
        const nombreMascota = document.getElementById('nombre-mascota');
        const especie = document.getElementById('especie');
        const servicio = document.getElementById('servicio');
        const fecha = document.getElementById('fecha');
        const hora = document.getElementById('hora');

        agendarForm.addEventListener('submit', (e) => {
            let valido = true;

            // Nombre dueño: Mínimo 3 letras
            if (!nombreDueno.value.trim() || nombreDueno.value.trim().length < 3) {
                mostrarError(nombreDueno, 'Ingresa tu nombre (mínimo 3 letras).');
                valido = false;
            } else {
                mostrarExito(nombreDueno);
            }

            // Teléfono chileno (+56 9 XXXX XXXX)
            const regexTel = /^(\+?56)?\s?9\s?\d{4}\s?\d{4}$/;
            if (!telefono.value.trim() || !regexTel.test(telefono.value.trim())) {
                mostrarError(telefono, 'Ingresa un celular chileno válido (Ej: +56 9 8765 4321).');
                valido = false;
            } else {
                mostrarExito(telefono);
            }

            // Nombre mascota: Mínimo 2 letras
            if (!nombreMascota.value.trim() || nombreMascota.value.trim().length < 2) {
                mostrarError(nombreMascota, 'Ingresa el nombre de tu mascota (mínimo 2 letras).');
                valido = false;
            } else {
                mostrarExito(nombreMascota);
            }

            // Especie y Servicio
            if (!especie.value) { mostrarError(especie, 'Selecciona una opción.'); valido = false; } else { mostrarExito(especie); }
            if (!servicio.value) { mostrarError(servicio, 'Selecciona una opción.'); valido = false; } else { mostrarExito(servicio); }

            // Fecha: No puede ser anterior a la fecha actual
            if (fecha.value) {
                const [year, month, day] = fecha.value.split('-').map(Number);
                const fechaSeleccionada = new Date(year, month - 1, day);
                const hoy = new Date();
                hoy.setHours(0, 0, 0, 0);

                if (fechaSeleccionada < hoy) {
                    mostrarError(fecha, 'La fecha no puede ser anterior a hoy.');
                    valido = false;
                } else {
                    mostrarExito(fecha);
                }
            } else {
                mostrarError(fecha, 'Elige una fecha válida.');
                valido = false;
            }

            // Hora
            if (!hora.value) { mostrarError(hora, 'Elige una hora.'); valido = false; } else { mostrarExito(hora); }

            if (!valido) e.preventDefault();
        });
    }
});