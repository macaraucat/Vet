import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Badge, Button, Nav, Navbar } from 'react-bootstrap'
import { useCarritoContext } from '../context/CarritoContext'
import { useAuthContext } from '../context/AuthContext'
import './header.css'

function IconoLogout() {
    return (
        <img src="/img/logout.svg" alt="Cerrar sesión" className="icon"/>
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

    const cerrarMenu = () => setMenuAbierto(false);

    const cerrarSesion = () => {
        logout();
        cerrarMenu();
        navigate('/login');
    };

    return (
        <header className="py-2">
            <div className="container header">
                <Link to="/" onClick={scrollToTop} className="brand">
                    <img src="/img/logo.png" alt="Logo Veterinaria San Marcos" className="logo" />
                    <h1 className="site-title mb-0">Veterinaria San Marcos</h1>
                </Link>

                <Navbar expand="xl" expanded={menuAbierto} onToggle={setMenuAbierto} data-bs-theme="dark" collapseOnSelect>
                    <Navbar.Toggle aria-controls="header-navbar" aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'} />
                    <Navbar.Collapse id="header-navbar">
                        <Nav className="header-nav">
                            <Nav.Link as={Link} to="/catalogo" onClick={scrollToTop}>Catálogo</Nav.Link>
                            {['Funcionario', 'Administrador'].includes(usuario?.role) && (
                                <Nav.Link as={Link} to="/admin" onClick={scrollToTop}>Administración</Nav.Link>
                            )}
                            <Nav.Link as={Link} to="/#nosotros" onClick={cerrarMenu}>Nosotros</Nav.Link>
                            <Nav.Link as={Link} to="/#blogs" onClick={cerrarMenu}>Blogs</Nav.Link>
                            <Nav.Link href="#contacto" onClick={cerrarMenu}>Contacto</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>

                <div className="header-icons">
                    {usuario ? (
                        <>
                            <span className="nombre-usuario fw-semibold" title={usuario.nombre}>Hola, {primerNombre}</span>
                            <Button variant="link" className="p-0 border-0" title="Cerrar sesión" onClick={cerrarSesion}>
                                <IconoLogout />
                            </Button>
                        </>
                    ) : (
                        <Link to="/login" title="Iniciar sesión" onClick={cerrarMenu}>
                            <img src="/img/login.svg" alt="Iniciar sesión" className="icon" />
                        </Link>
                    )}
                    <Link to="/carrito" title="Carrito" className="position-relative" onClick={cerrarMenu}>
                        <img src="/img/carrito.svg" alt="Carrito" className="icon" />
                        <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle">{totalItems}</Badge>
                    </Link>
                </div>
            </div>
        </header>
    )
}

export default Header;