import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCarritoContext } from '../context/CarritoContext'
import { useAuthContext } from '../context/AuthContext'
import './header.css'

// Ícono de "cerrar sesión" (inline para no depender de un archivo nuevo en /public/img).
// Si prefieres una imagen, cámbialo por: <img src="/img/logout.svg" alt="Cerrar sesión" className="icon" />
function IconoLogout() {
    return (
        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" role="img" aria-label="Cerrar sesión">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
    )
}

function Header() {
    const [menuAbierto, setMenuAbierto] = useState(false);
    const { totalItems } = useCarritoContext();
    const { usuario, primerNombre, logout } = useAuthContext();
    const navigate = useNavigate();

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setMenuAbierto(false);
    };

    const toggleMenu = () => setMenuAbierto(!menuAbierto);
    const cerrarMenu = () => setMenuAbierto(false);

    const cerrarSesion = () => {
        logout();
        cerrarMenu();
        navigate('/login');
    };

    return (
        <header className="py-2">
            <div className="container">
                <div className="header">
                    <Link to="/" onClick={scrollToTop} className="brand">
                        <img src="/img/logo.png" alt="Logo Veterinaria San Marcos" className="logo" />
                        <h1 className="site-title mb-0">Veterinaria San Marcos</h1>
                    </Link>

                    <button type="button" className={`hamburger ${menuAbierto ? 'active' : ''}`} aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={menuAbierto} onClick={toggleMenu}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>

                    <nav className={menuAbierto ? 'nav-open' : ''}>
                        <Link to="/catalogo" onClick={scrollToTop}>Catálogo</Link>
                        <Link to="/#nosotros" onClick={cerrarMenu}>Nosotros</Link>
                        <Link to="/#blogs" onClick={cerrarMenu}>Blogs</Link>
                        <a href="#contacto" onClick={cerrarMenu}>Contacto</a>
                    </nav>

                    <div className="header-icons">
                        {usuario ? (
                            <>
                                <span className="nombre-usuario fw-semibold" title={usuario.nombre}>Hola, {primerNombre}</span>
                                <button type="button" className="btn btn-link p-0 border-0" title="Cerrar sesión" onClick={cerrarSesion}>
                                    <IconoLogout />
                                </button>
                            </>
                        ) : (
                            <Link to="/login" title="Iniciar sesión" onClick={cerrarMenu}>
                                <img src="/img/cuenta.svg" alt="Iniciar sesión" className="icon" />
                            </Link>
                        )}
                        <Link to="/carrito" title="Carrito" className="position-relative" onClick={cerrarMenu}>
                            <img src="/img/carrito.svg" alt="Carrito" className="icon" />
                            <span className="badge bg-danger rounded-pill position-absolute top-0 start-100 translate-middle">{totalItems}</span>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header;