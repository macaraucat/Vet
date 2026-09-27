import { Link } from 'react-router-dom';

function Header() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <header className="py-3">
            <div className="container">
                <div className="header">
                    <Link to="/" onClick={scrollToTop} className="brand">
                        <img src="/img/logo.png" alt="Logo Veterinaria San Marcos" className="logo" />
                        <h1 className="site-title mb-0">Veterinaria San Marcos</h1>
                    </Link>

                    <nav>
                        <Link to="/catalogo">Producto</Link>
                        <a href="#nosotros">Nosotros</a>
                        <a href="#blogs">Blogs</a>
                        <a href="#contacto">Contacto</a>
                    </nav>

                    <div className="header-icons">
                        <Link to="/login" title="Iniciar sesión">
                            <img src="/img/cuenta.svg" alt="Iniciar sesión" className="icon" />
                        </Link>
                        <Link to="/carrito" title="Carrito" className="position-relative">
                            <img src="/img/carrito.svg" alt="Carrito" className="icon" />
                            <span className="badge bg-danger rounded-pill position-absolute top-0 start-100 translate-middle">0</span>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header;