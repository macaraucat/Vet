import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Badge, Button, Container, Nav, Navbar } from 'react-bootstrap'
import { useCarritoContext } from '../context/CarritoContext'
import { useAuthContext } from '../context/AuthContext'

function Header() {
    const [menuAbierto, setMenuAbierto] = useState(false)
    const { totalItems } = useCarritoContext()
    const { usuario, primerNombre, logout } = useAuthContext()
    const navigate = useNavigate()

    const cerrarMenu = () => setMenuAbierto(false)

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        cerrarMenu()
    }

    const cerrarSesion = () => {
        logout()
        cerrarMenu()
        navigate('/login')
    }

    return (
        <Navbar
            as="header"
            expand="xl"
            sticky="top"
            data-bs-theme="dark"
            className="header"
            expanded={menuAbierto}
            onToggle={setMenuAbierto}
            collapseOnSelect
        >
            <Container>
                <Navbar.Brand as={Link} to="/" onClick={scrollToTop} className="brand me-auto">
                    <img src="/img/logo.png" alt="Logo Veterinaria San Marcos" className="logo" />
                    <span className="site-title">Veterinaria San Marcos</span>
                </Navbar.Brand>

                <div className="d-flex align-items-center gap-2 order-xl-3">
                    {usuario ? (
                        <>
                            <span className="d-none d-md-inline fw-semibold" title={usuario.nombre}>
                                Hola, {primerNombre}
                            </span>
                            <Button variant="link" className="p-0 border-0" title="Cerrar sesión" onClick={cerrarSesion}>
                                <img src="/img/logout.svg" alt="Cerrar sesión" className="icon" />
                            </Button>
                        </>
                    ) : (
                        <Link to="/login" title="Iniciar sesión" onClick={cerrarMenu}>
                            <img src="/img/login.svg" alt="Iniciar sesión" className="icon" />
                        </Link>
                    )}

                    <Link to="/carrito" title="Carrito" className="position-relative" onClick={cerrarMenu}>
                        <img src="/img/carrito.svg" alt="Carrito" className="icon" />
                        <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle">
                            {totalItems}
                        </Badge>
                    </Link>

                    <Navbar.Toggle aria-controls="header-navbar" aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'} />
                </div>

                <Navbar.Collapse id="header-navbar" className="order-xl-2">
                    <Nav className="mx-auto text-center gap-xl-3">
                        <Nav.Link as={Link} to="/catalogo" onClick={scrollToTop}>Catálogo</Nav.Link>
                        {['Funcionario', 'Administrador'].includes(usuario?.role) && (
                            <Nav.Link as={Link} to="/admin" onClick={scrollToTop}>Administración</Nav.Link>
                        )}
                        <Nav.Link as={Link} to="/#nosotros">Nosotros</Nav.Link>
                        <Nav.Link as={Link} to="/#blogs">Blogs</Nav.Link>
                        <Nav.Link href="#contacto">Contacto</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Header