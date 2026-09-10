document.addEventListener('DOMContentLoaded', function () {
    const userNameDisplay = document.getElementById('user-name-display');
    const btnLogin = document.getElementById('btn-login');
    const btnLogout = document.getElementById('btn-logout');

    const usuarioActivo = localStorage.getItem('usuarioActivo');

    if (usuarioActivo) {
        if (userNameDisplay) userNameDisplay.textContent = usuarioActivo;
        if (btnLogin) btnLogin.style.display = 'none';
        if (btnLogout) btnLogout.style.display = 'inline-block';
    } else {
        if (userNameDisplay) userNameDisplay.textContent = '';
        if (btnLogin) btnLogin.style.display = 'inline-block';
        if (btnLogout) btnLogout.style.display = 'none';
    }

    if (btnLogout) {
        btnLogout.addEventListener('click', function (e) {
            e.preventDefault();
            localStorage.removeItem('usuarioActivo');
            window.location.href = 'login.html';
        });
    }
});