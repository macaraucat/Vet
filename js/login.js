document.addEventListener('DOMContentLoaded', function () {
    const showReg = document.getElementById('show-registro');
    const showLogin = document.getElementById('show-login');
    const loginSection = document.getElementById('login');
    const regSection = document.getElementById('registro');

    const loginForm = document.getElementById('login-form');
    const registroForm = document.getElementById('registro-form');
    const userNameDisplay = document.getElementById('user-name-display');

    // 1. Usuarios predefinidos requeridos
    const usuariosPredefinidos = [
        { nombre: 'Admin', email: 'admin@gmail.com', pass: 'admin123', role: 'admin' },
        { nombre: 'Funcionario', email: 'func@gmail.com', pass: 'func123', role: 'funcionario' }
    ];

    // Inicializar usuarios en localStorage si no existen
    let usuariosDB = JSON.parse(localStorage.getItem('usuariosDB'));
    if (!usuariosDB) {
        usuariosDB = usuariosPredefinidos;
        localStorage.setItem('usuariosDB', JSON.stringify(usuariosDB));
    } else {
        // Garantizar que los usuarios creados previamente sigan presentes
        usuariosPredefinidos.forEach(preUser => {
            if (!usuariosDB.some(user => user.email === preUser.email)) {
                usuariosDB.push(preUser);
            }
        });
        localStorage.setItem('usuariosDB', JSON.stringify(usuariosDB));
    }

    function cargarUsuarioHeader() {
        const usuarioGuardado = localStorage.getItem('usuarioActivo');
        if (usuarioGuardado && userNameDisplay) {
            userNameDisplay.textContent = usuarioGuardado;
        }
    }
    cargarUsuarioHeader();

    // 2. Registro de nuevos usuarios
    if (registroForm) {
        registroForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const nombre = document.getElementById('nombre').value;
            const email = document.getElementById('email-registro').value.trim().toLowerCase();
            const pass = document.getElementById('pass-registro').value;
            const pass2 = document.getElementById('pass2-registro').value;

            if (pass !== pass2) {
                alert('Las contraseñas no coinciden.');
                return;
            }

            const listaUsuarios = JSON.parse(localStorage.getItem('usuariosDB')) || [];

            if (listaUsuarios.some(user => user.email === email)) {
                alert('Este correo electrónico ya está registrado.');
                return;
            }

            listaUsuarios.push({ nombre, email, pass, role: 'cliente' });
            localStorage.setItem('usuariosDB', JSON.stringify(listaUsuarios));

            alert('¡Registro completado! Ahora puedes iniciar sesión.');
            registroForm.reset();
            
            regSection.style.display = 'none';
            loginSection.style.display = 'block';
        });
    }

    // 3. Login y Redirección condicionada
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const emailInput = document.getElementById('email').value.trim().toLowerCase();
            const passInput = document.getElementById('pass').value;

            const listaUsuarios = JSON.parse(localStorage.getItem('usuariosDB')) || [];
            const usuarioEncontrado = listaUsuarios.find(user => user.email === emailInput && user.pass === passInput);

            if (usuarioEncontrado) {
                // Guardar nombre del usuario activo
                localStorage.setItem('usuarioActivo', usuarioEncontrado.nombre);

                // Redirección condicionada
                if (usuarioEncontrado.email === 'admin@gmail.com' || usuarioEncontrado.email === 'func@gmail.com') {
                    window.location.href = 'admin.html';
                } else {
                    window.location.href = 'index.html';
                }
            } else {
                alert('Correo o contraseña incorrectos.');
            }
        });
    }

    // Alternar visibilidad Login / Registro
    if (showReg && showLogin && loginSection && regSection) {
        showReg.addEventListener('click', function (e) {
            e.preventDefault();
            loginSection.style.display = 'none';
            regSection.style.display = 'block';
        });

        showLogin.addEventListener('click', function (e) {
            e.preventDefault();
            regSection.style.display = 'none';
            loginSection.style.display = 'block';
        });
    }
});