document.addEventListener('DOMContentLoaded', function () {
    const showRegistroLink = document.getElementById('show-registro');
    const showLoginLink = document.getElementById('show-login');
    const loginSection = document.getElementById('login');
    const registroSection = document.getElementById('registro');

    if (showRegistroLink && showLoginLink && loginSection && registroSection) {
        showRegistroLink.addEventListener('click', function (e) {
            e.preventDefault();
            loginSection.style.display = 'none';
            registroSection.style.display = 'block';
        });

        showLoginLink.addEventListener('click', function (e) {
            e.preventDefault();
            registroSection.style.display = 'none';
            loginSection.style.display = 'block';
        });
    }
});