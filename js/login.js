document.addEventListener('DOMContentLoaded', function () {
    const showReg = document.getElementById('show-registro');
    const showLogin = document.getElementById('show-login');
    const loginSection = document.getElementById('login');
    const regSection = document.getElementById('registro');

    const loginForm = document.getElementById('login-form');
    const registroForm = document.getElementById('registro-form');

    // Usuarios predefinidos con acceso al panel de administración.
    const usuariosPredefinidos = [
        { nombre: 'Admin', email: 'admin@gmail.com', pass: 'admin123', role: 'Administrador' },
        { nombre: 'Funcionario', email: 'func@gmail.com', pass: 'func123', role: 'Funcionario' }
    ];

    // Inicializar la "base de datos" de usuarios en localStorage si aún no existe.
    let usuariosDB = JSON.parse(localStorage.getItem('usuariosDB'));
    if (!usuariosDB) {
        usuariosDB = usuariosPredefinidos;
        localStorage.setItem('usuariosDB', JSON.stringify(usuariosDB));
    }

    // 1. Registro de nuevos usuarios (siempre quedan como Cliente)
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

            if (usuariosDB.some(user => user.email === email)) {
                alert('Este correo electrónico ya está registrado.');
                return;
            }

            usuariosDB.push({ nombre, email, pass, role: 'Cliente' });
            localStorage.setItem('usuariosDB', JSON.stringify(usuariosDB));

            alert('¡Registro completado! Ahora puedes iniciar sesión.');
            registroForm.reset();

            regSection.style.display = 'none';
            loginSection.style.display = 'block';
        });
    }

    // 2. Login: valida contra la base de usuarios y redirige según el rol
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const email = document.getElementById('email').value.trim().toLowerCase();
            const pass = document.getElementById('pass').value;

            const usuario = usuariosDB.find(u => u.email === email && u.pass === pass);

            if (!usuario) {
                alert('Correo o contraseña incorrectos.');
                return;
            }

            // Cliente -> queda predefinido y navega al sitio público.
            // Funcionario / Administrador -> navegan al panel de administración.
            localStorage.setItem('usuarioActivo', usuario.nombre);
            localStorage.setItem('tipoUsuario', usuario.role);
            window.location.href = usuario.role === 'Cliente' ? 'index.html' : 'admin.html';
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