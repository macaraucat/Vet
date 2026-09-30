import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCarritoContext } from '../context/CarritoContext'
import './header.css'

function Header() {
    const [menuAbierto, setMenuAbierto] = useState(false);
    const { totalItems } = useCarritoContext();

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setMenuAbierto(false);
    };

    const toggleMenu = () => setMenuAbierto(!menuAbierto);
    const cerrarMenu = () => setMenuAbierto(false);

    return (
        <header className="py-2">
            <div className="container">
                <div className="header">
                    <Link to="/" onClick={scrollToTop} className="brand">
                        <img src="/img/logo.png" alt="Logo Veterinaria San Marcos" className="logo" />
                        <h1 className="site-title mb-0">Veterinaria San Marcos</h1>
                    </Link>

                    {/* Hamburguesa: solo visible en móvil (< 768px) */}
                    <button
                        type="button"
                        className={`hamburger ${menuAbierto ? 'active' : ''}`}
                        aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
                        aria-expanded={menuAbierto}
                        onClick={toggleMenu}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>

                    <nav className={menuAbierto ? 'nav-open' : ''}>
                        <Link to="/catalogo" onClick={scrollToTop}>Catálogo</Link>
                        <a href="#nosotros" onClick={cerrarMenu}>Nosotros</a>
                        <a href="#blogs" onClick={cerrarMenu}>Blogs</a>
                        <a href="#contacto" onClick={cerrarMenu}>Contacto</a>
                    </nav>

                    <div className="header-icons">
                        <Link to="/login" title="Iniciar sesión" onClick={cerrarMenu}>
                            <img src="/img/cuenta.svg" alt="Iniciar sesión" className="icon" />
                        </Link>
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