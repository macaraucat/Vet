document.addEventListener('DOMContentLoaded', function () {
    const userNameDisplay = document.getElementById('user-name-display');
    const usuarioActivo = localStorage.getItem('usuarioActivo');

    if (usuarioActivo && userNameDisplay) {
        userNameDisplay.textContent = usuarioActivo;
    }
});