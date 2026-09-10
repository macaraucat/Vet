(function protegerAdmin() {
    const usuarioActivo = localStorage.getItem('usuarioActivo');
    if (!usuarioActivo) {
        window.location.href = 'login.html';
    }
})();

document.addEventListener('DOMContentLoaded', function () {    
    // ==================== Navegación entre secciones ====================
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

    // ==================== Gestión de Usuarios ====================
    const btnAgregarUsuario = document.getElementById('btn-agregar-usuario');
    const btnModificarUsuario = document.getElementById('btn-modificar-usuario');
    const btnGuardarUsuario = document.getElementById('btn-guardar-usuario');
    const modalUsuario = new bootstrap.Modal(document.getElementById('modal-usuario'));
    const formUsuario = document.getElementById('form-usuario');
    const tbodyUsuarios = document.getElementById('tbody-usuarios');
    const selectAllUsuarios = document.getElementById('select-all-usuarios');
    let modoUsuario = 'agregar';
    let filaSeleccionadaUsuario = null;

    btnAgregarUsuario.addEventListener('click', function () {
        modoUsuario = 'agregar';
        formUsuario.reset();
        modalUsuario.show();
    });

    btnModificarUsuario.addEventListener('click', function () {
        const checkboxes = document.querySelectorAll('.checkbox-usuario');
        const filasSeleccionadas = Array.from(checkboxes).filter(cb => cb.checked);

        if (filasSeleccionadas.length === 0) {
            alert('Por favor, seleccione un usuario para modificar.');
            return;
        }
        if (filasSeleccionadas.length > 1) {
            alert('Por favor, seleccione solo un usuario para modificar.');
            return;
        }

        modoUsuario = 'modificar';
        filaSeleccionadaUsuario = filasSeleccionadas[0].closest('tr');
        const celdas = filaSeleccionadaUsuario.querySelectorAll('td');

        document.getElementById('modal-run').value = celdas[1].textContent;
        document.getElementById('modal-nombre').value = celdas[2].textContent;
        document.getElementById('modal-apellidos').value = celdas[3].textContent;
        document.getElementById('modal-email').value = celdas[4].textContent;
        document.getElementById('modal-fecha-nacimiento').value = convertirFecha(celdas[5].textContent);
        document.getElementById('modal-rol').value = celdas[6].textContent;
        document.getElementById('modal-comuna').value = celdas[7].textContent;
        document.getElementById('modal-direccion').value = celdas[8].textContent;

        modalUsuario.show();
    });

    btnGuardarUsuario.addEventListener('click', function () {
        const run = document.getElementById('modal-run').value.trim();
        const nombre = document.getElementById('modal-nombre').value.trim();
        const apellidos = document.getElementById('modal-apellidos').value.trim();
        const email = document.getElementById('modal-email').value.trim();
        const fechaNacimiento = document.getElementById('modal-fecha-nacimiento').value;
        const rol = document.getElementById('modal-rol').value;
        const comuna = document.getElementById('modal-comuna').value.trim();
        const direccion = document.getElementById('modal-direccion').value.trim();

        if (!run || !nombre || !apellidos || !email || !fechaNacimiento || !rol || !comuna || !direccion) {
            alert('Por favor, complete todos los campos obligatorios.');
            return;
        }

        if (modoUsuario === 'agregar') {
            const runsExistentes = Array.from(tbodyUsuarios.querySelectorAll('tr td:nth-child(2)')).map(td => td.textContent.trim());
            if (runsExistentes.includes(run)) {
                alert('El RUN ya está registrado.');
                return;
            }
            const emailsExistentes = Array.from(tbodyUsuarios.querySelectorAll('tr td:nth-child(5)')).map(td => td.textContent.trim());
            if (emailsExistentes.includes(email)) {
                alert('El correo electrónico ya está registrado.');
                return;
            }
            const nuevaFila = document.createElement('tr');
            nuevaFila.innerHTML = `
                    <td class="col-check"><input type="checkbox" name="seleccionar-usuario" class="checkbox-usuario"></td>
                    <td>${run}</td>
                    <td>${nombre}</td>
                    <td>${apellidos}</td>
                    <td>${email}</td>
                    <td>${formatearFecha(fechaNacimiento)}</td>
                    <td>${rol}</td>
                    <td>${comuna}</td>
                    <td>${direccion}</td>
                `;
            tbodyUsuarios.appendChild(nuevaFila);
            alert('Usuario agregado correctamente.');
        } else {
            const celdas = filaSeleccionadaUsuario.querySelectorAll('td');
            celdas[1].textContent = run;
            celdas[2].textContent = nombre;
            celdas[3].textContent = apellidos;
            celdas[4].textContent = email;
            celdas[5].textContent = formatearFecha(fechaNacimiento);
            celdas[6].textContent = rol;
            celdas[7].textContent = comuna;
            celdas[8].textContent = direccion;
            alert('Usuario modificado correctamente.');
        }
        modalUsuario.hide();
    });

    selectAllUsuarios.addEventListener('change', function () {
        document.querySelectorAll('.checkbox-usuario').forEach(cb => {
            cb.checked = this.checked;
        });
    });

    // ==================== Gestión de Productos ====================
    const btnAgregarProducto = document.getElementById('btn-agregar-producto');
    const btnModificarProducto = document.getElementById('btn-modificar-producto');
    const btnGuardarProducto = document.getElementById('btn-guardar-producto');
    const modalProducto = new bootstrap.Modal(document.getElementById('modal-producto'));
    const formProducto = document.getElementById('form-producto');
    const tbodyProductos = document.getElementById('tbody-productos');
    const selectAllProductos = document.getElementById('select-all-productos');
    let modoProducto = 'agregar';
    let filaSeleccionadaProducto = null;

    btnAgregarProducto.addEventListener('click', function () {
        modoProducto = 'agregar';
        formProducto.reset();
        modalProducto.show();
    });

    btnModificarProducto.addEventListener('click', function () {
        const checkboxes = document.querySelectorAll('.checkbox-producto');
        const filasSeleccionadas = Array.from(checkboxes).filter(cb => cb.checked);

        if (filasSeleccionadas.length === 0) {
            alert('Por favor, seleccione un producto para modificar.');
            return;
        }
        if (filasSeleccionadas.length > 1) {
            alert('Por favor, seleccione solo un producto para modificar.');
            return;
        }

        modoProducto = 'modificar';
        filaSeleccionadaProducto = filasSeleccionadas[0].closest('tr');
        const celdas = filaSeleccionadaProducto.querySelectorAll('td');

        document.getElementById('modal-sku').value = celdas[1].textContent;
        document.getElementById('modal-nombre-producto').value = celdas[2].textContent;
        document.getElementById('modal-descripcion').value = celdas[3].textContent;
        document.getElementById('modal-precio').value = celdas[4].textContent.replace('$', '').replace('.', '');
        document.getElementById('modal-stock').value = celdas[5].textContent;
        document.getElementById('modal-categoria').value = celdas[6].textContent;

        modalProducto.show();
    });

    btnGuardarProducto.addEventListener('click', function () {
        const sku = document.getElementById('modal-sku').value.trim();
        const nombre = document.getElementById('modal-nombre-producto').value.trim();
        const descripcion = document.getElementById('modal-descripcion').value.trim();
        const precio = document.getElementById('modal-precio').value.trim();
        const stock = document.getElementById('modal-stock').value.trim();
        const categoria = document.getElementById('modal-categoria').value;

        if (!sku || !nombre || !precio || !stock || !categoria) {
            alert('Por favor, complete todos los campos obligatorios.');
            return;
        }
        if (isNaN(parseInt(precio)) || isNaN(parseInt(stock))) {
            alert('Precio y Stock deben ser valores numéricos.');
            return;
        }

        if (modoProducto === 'agregar') {
            const skusExistentes = Array.from(tbodyProductos.querySelectorAll('tr td:nth-child(2)')).map(td => td.textContent.trim());
            if (skusExistentes.includes(sku)) {
                alert('El código SKU ya está registrado.');
                return;
            }
            const nuevaFila = document.createElement('tr');
            nuevaFila.innerHTML = `
                    <td class="col-check"><input type="checkbox" name="seleccionar-producto" class="checkbox-producto"></td>
                    <td>${sku}</td>
                    <td>${nombre}</td>
                    <td>${descripcion}</td>
                    <td>$${formatearNumero(precio)}</td>
                    <td>${stock}</td>
                    <td>${categoria}</td>
                `;
            tbodyProductos.appendChild(nuevaFila);
            alert('Producto agregado correctamente.');
        } else {
            const celdas = filaSeleccionadaProducto.querySelectorAll('td');
            celdas[1].textContent = sku;
            celdas[2].textContent = nombre;
            celdas[3].textContent = descripcion;
            celdas[4].textContent = `$${formatearNumero(precio)}`;
            celdas[5].textContent = stock;
            celdas[6].textContent = categoria;
            alert('Producto modificado correctamente.');
        }
        modalProducto.hide();
    });

    selectAllProductos.addEventListener('change', function () {
        document.querySelectorAll('.checkbox-producto').forEach(cb => {
            cb.checked = this.checked;
        });
    });

    // ==================== Funciones utilitarias ====================
    function convertirFecha(fecha) {
        if (!fecha) return '';
        const partes = fecha.split('-');
        if (partes.length === 3) {
            return `${partes[2]}-${partes[1].padStart(2, '0')}-${partes[0].padStart(2, '0')}`;
        }
        return fecha;
    }
    function formatearFecha(fecha) {
        if (!fecha) return '';
        const partes = fecha.split('-');
        if (partes.length === 3) {
            return `${partes[2].padStart(2, '0')}-${partes[1].padStart(2, '0')}-${partes[0]}`;
        }
        return fecha;
    }
    function formatearNumero(numero) {
        return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
});