document.addEventListener('DOMContentLoaded', function () {
    const itemsMenu = document.querySelectorAll('.nav-section .nav-item');
    const secciones = document.querySelectorAll('.admin-section');

    itemsMenu.forEach(function (item) {
        item.addEventListener('click', function () {
            const destino = item.getAttribute('data-target');

            // Muestra solo la sección que corresponde al ítem clickeado
            secciones.forEach(function (seccion) {
                seccion.classList.toggle('active', seccion.id === 'seccion-' + destino);
            });

            // Marca como activo únicamente el ítem del menú seleccionado
            itemsMenu.forEach(function (otroItem) {
                otroItem.classList.toggle('active', otroItem === item);
            });
        });
    });
});