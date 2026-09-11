document.addEventListener('DOMContentLoaded', () => {
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