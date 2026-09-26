(function protegerAdmin() {
    const usuarioActivo = localStorage.getItem('usuarioActivo');
    const tipoUsuario = localStorage.getItem('tipoUsuario');

    if (!usuarioActivo) {
        window.location.href = 'login.html';
        return;
    }

    if (tipoUsuario !== 'Funcionario' && tipoUsuario !== 'Administrador') {
        window.location.href = 'index.html';
    }
})();

document.addEventListener('DOMContentLoaded', function () {

    // Restricción por rol: ocultar "Gestión de Usuarios" a Funcionario
    const tipoUsuario = localStorage.getItem('tipoUsuario');

    if (tipoUsuario === 'Funcionario') {
        const navUsuarios = document.querySelector('.nav-item[data-target="usuarios"]');
        const seccionUsuarios = document.getElementById('seccion-usuarios');

        if (navUsuarios) navUsuarios.remove();
        if (seccionUsuarios) seccionUsuarios.remove();
    }

    // Navegación entre secciones
    const itemsMenu = document.querySelectorAll('.nav-section .nav-item');
    const secciones = document.querySelectorAll('.admin-section');

    itemsMenu.forEach(function (item) {
        item.addEventListener('click', function () {
            const destino = item.getAttribute('data-target');
            secciones.forEach(function (seccion) {
                seccion.classList.toggle('active', seccion.id === 'seccion-' + destino);
            });
            itemsMenu.forEach(function (otroItem) {
                otroItem.classList.toggle('active', otroItem === item);
            });
        });
    });

    // Gestión de Usuarios
    const btnAgregarUsuario = document.getElementById('btn-agregar-usuario');
    const btnModificarUsuario = document.getElementById('btn-modificar-usuario');
    const btnGuardarUsuario = document.getElementById('btn-guardar-usuario');
    const modalUsuario = new bootstrap.Modal(document.getElementById('modal-usuario'));
    const formUsuario = document.getElementById('form-usuario');
    const tbodyUsuarios = document.getElementById('tbody-usuarios');
    const selectAllUsuarios = document.getElementById('select-all-usuarios');
    let modoUsuario = 'agregar';
    let filaUsuarioSeleccionada = null;

    btnAgregarUsuario.addEventListener('click', function () {
        modoUsuario = 'agregar';
        filaUsuarioSeleccionada = null;
        formUsuario.reset();
        modalUsuario.show();
    });

    btnModificarUsuario.addEventListener('click', function () {
        const seleccionadas = Array.from(document.querySelectorAll('.checkbox-usuario')).filter(cb => cb.checked);

        if (seleccionadas.length !== 1) {
            alert('Seleccione un único usuario para modificar.');
            return;
        }

        modoUsuario = 'modificar';
        filaUsuarioSeleccionada = seleccionadas[0].closest('tr');
        const celdas = filaUsuarioSeleccionada.querySelectorAll('td');

        document.getElementById('modal-run').value = celdas[1].textContent;
        document.getElementById('modal-nombre').value = celdas[2].textContent;
        document.getElementById('modal-apellidos').value = celdas[3].textContent;
        document.getElementById('modal-email').value = celdas[4].textContent;
        document.getElementById('modal-fecha-nacimiento').value = celdas[5].textContent;
        document.getElementById('modal-rol').value = celdas[6].textContent;
        document.getElementById('modal-comuna').value = celdas[7].textContent;
        document.getElementById('modal-direccion').value = celdas[8].textContent;

        modalUsuario.show();
    });

    btnGuardarUsuario.addEventListener('click', function () {
        if (!formUsuario.checkValidity()) {
            formUsuario.reportValidity();
            return;
        }

        const datos = [
            document.getElementById('modal-run').value.trim(),
            document.getElementById('modal-nombre').value.trim(),
            document.getElementById('modal-apellidos').value.trim(),
            document.getElementById('modal-email').value.trim(),
            document.getElementById('modal-fecha-nacimiento').value,
            document.getElementById('modal-rol').value,
            document.getElementById('modal-comuna').value.trim(),
            document.getElementById('modal-direccion').value.trim()
        ];

        if (modoUsuario === 'agregar') {
            const nuevaFila = document.createElement('tr');
            nuevaFila.innerHTML = '<td class="col-check"><input type="checkbox" name="seleccionar-usuario" class="checkbox-usuario"></td>' +
                datos.map(valor => `<td>${valor}</td>`).join('');
            tbodyUsuarios.appendChild(nuevaFila);
            alert('Usuario agregado correctamente.');
        } else {
            const celdas = filaUsuarioSeleccionada.querySelectorAll('td');
            datos.forEach((valor, i) => celdas[i + 1].textContent = valor);
            alert('Usuario modificado correctamente.');
        }

        modalUsuario.hide();
    });

    selectAllUsuarios.addEventListener('change', function () {
        document.querySelectorAll('.checkbox-usuario').forEach(cb => {
            cb.checked = this.checked;
        });
    });

    // Gestión de Productos
    const btnAgregarProducto = document.getElementById('btn-agregar-producto');
    const btnModificarProducto = document.getElementById('btn-modificar-producto');
    const btnGuardarProducto = document.getElementById('btn-guardar-producto');
    const modalProducto = new bootstrap.Modal(document.getElementById('modal-producto'));
    const formProducto = document.getElementById('form-producto');
    const tbodyProductos = document.getElementById('tbody-productos');
    const selectAllProductos = document.getElementById('select-all-productos');
    let modoProducto = 'agregar';
    let filaProductoSeleccionada = null;

    btnAgregarProducto.addEventListener('click', function () {
        modoProducto = 'agregar';
        filaProductoSeleccionada = null;
        formProducto.reset();
        modalProducto.show();
    });

    btnModificarProducto.addEventListener('click', function () {
        const seleccionadas = Array.from(document.querySelectorAll('.checkbox-producto')).filter(cb => cb.checked);

        if (seleccionadas.length !== 1) {
            alert('Seleccione un único producto para modificar.');
            return;
        }

        modoProducto = 'modificar';
        filaProductoSeleccionada = seleccionadas[0].closest('tr');
        const celdas = filaProductoSeleccionada.querySelectorAll('td');

        document.getElementById('modal-sku').value = celdas[1].textContent;
        document.getElementById('modal-nombre-producto').value = celdas[2].textContent;
        document.getElementById('modal-descripcion').value = celdas[3].textContent;
        document.getElementById('modal-precio').value = celdas[4].textContent.replace(/\D/g, '');
        document.getElementById('modal-stock').value = celdas[5].textContent;
        document.getElementById('modal-categoria').value = celdas[6].textContent;

        modalProducto.show();
    });

    btnGuardarProducto.addEventListener('click', function () {
        if (!formProducto.checkValidity()) {
            formProducto.reportValidity();
            return;
        }

        const sku = document.getElementById('modal-sku').value.trim();
        const nombre = document.getElementById('modal-nombre-producto').value.trim();
        const descripcion = document.getElementById('modal-descripcion').value.trim();
        const precio = document.getElementById('modal-precio').value.trim();
        const stock = document.getElementById('modal-stock').value.trim();
        const categoria = document.getElementById('modal-categoria').value;

        const datos = [
            sku,
            nombre,
            descripcion,
            `$${Number(precio).toLocaleString('es-CL')}`,
            stock,
            categoria
        ];

        if (modoProducto === 'agregar') {
            const nuevaFila = document.createElement('tr');
            nuevaFila.innerHTML = '<td class="col-check"><input type="checkbox" name="seleccionar-producto" class="checkbox-producto"></td>' +
                datos.map(valor => `<td>${valor}</td>`).join('');
            tbodyProductos.appendChild(nuevaFila);
            alert('Producto agregado correctamente.');
        } else {
            const celdas = filaProductoSeleccionada.querySelectorAll('td');
            datos.forEach((valor, i) => celdas[i + 1].textContent = valor);
            alert('Producto modificado correctamente.');
        }

        modalProducto.hide();
    });

    selectAllProductos.addEventListener('change', function () {
        document.querySelectorAll('.checkbox-producto').forEach(cb => {
            cb.checked = this.checked;
        });
    });

});