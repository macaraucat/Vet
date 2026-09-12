document.addEventListener('DOMContentLoaded', function() {
    const botonesExpandir = document.querySelectorAll('.boton-expandir');
    botonesExpandir.forEach(boton => {
        boton.addEventListener('click', function(e) {
            e.preventDefault();
            const noticia = this.closest('.noticia');
            const textoCorto = noticia.querySelector('.texto-corto');
            const textoExtendido = noticia.querySelector('.texto-extendido');

            if (textoCorto.style.display === 'none') {
                textoCorto.style.display = 'block';
                textoExtendido.style.display = 'none';
                this.textContent = 'Expandir';
            } else {
                textoCorto.style.display = 'none';
                textoExtendido.style.display = 'block';
                this.textContent = 'Contraer';
            }
        });
    });

    const contactoSection = document.getElementById('contacto');
    if (contactoSection) {
        const contactoForm = contactoSection.querySelector('form');
        if (contactoForm) {
            const asunto = document.getElementById('asunto');
            const emailContacto = document.getElementById('email');
            const mensaje = document.getElementById('mensaje');

            contactoForm.addEventListener('submit', (e) => {
                const asuntoValido = validarCampo(asunto, 'El asunto es obligatorio.', [
                    { test: v => v.length <= 100, mensaje: 'El asunto no puede exceder 100 caracteres.' }
                ]);

                const emailValido = validarCampo(emailContacto, 'El correo es obligatorio.', [
                    { test: validarCorreo, mensaje: 'Correo inválido. Solo @duoc.cl, @profesor.duoc.cl o @gmail.com.' }
                ]);

                const mensajeValido = validarCampo(mensaje, 'El mensaje es obligatorio.', [
                    { test: v => v.length <= 500, mensaje: 'El mensaje no puede superar los 500 caracteres.' }
                ]);

                if (!asuntoValido || !emailValido || !mensajeValido) {
                    e.preventDefault();
                }
            });
        }
    }
});