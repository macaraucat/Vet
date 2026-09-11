document.addEventListener('DOMContentLoaded', function() {
    // Función para expandir/contraer noticias
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

    // Función para el toast de "Agendar cita"
    const btnAgendarCita = document.getElementById('btnAgendarCita');
    if (btnAgendarCita) {
        btnAgendarCita.addEventListener('click', function(e) {
            e.preventDefault();
            const toastElement = document.getElementById('toastFuncionEnConstruccion');
            if (toastElement) {
                const toast = new bootstrap.Toast(toastElement, { autohide: true, delay: 3000 });
                toast.show();
            }
        });
    }
});