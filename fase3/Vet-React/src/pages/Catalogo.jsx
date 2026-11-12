import { useState, useEffect } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Badge, Button, Card, Col, Container, Form, Image, Row } from "react-bootstrap";
import { useCarritoContext } from "../context/CarritoContext";
import { obtenerProductos, obtenerProductoPorId } from "../services/tiendaApi";

function Producto() {
    const { id } = useParams();
    const esDetalle = Boolean(id);
    const { agregarAlCarrito } = useCarritoContext();
    const [searchParams, setSearchParams] = useSearchParams();
    const categoria = searchParams.get("categoria") || "";
    const [busqueda, setBusqueda] = useState("");
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        setCargando(true);
        setError("");
        const peticion = esDetalle ? obtenerProductoPorId(id).then((p) => [p]) : obtenerProductos();
        peticion.then(setProductos)
            .catch(() => setError("No se pudieron cargar los productos."))
            .finally(() => setCargando(false));
    }, [id, esDetalle]);

    if (cargando) return <main><Container className="mb-5"><p className="text-center">Cargando...</p></Container></main>;
    if (error) return <main><Container className="mb-5"><p className="text-center text-danger">{error}</p></Container></main>;

    if (esDetalle) {
        const producto = productos[0];
        if (!producto) return (
            <main><Container className="py-5"><p>Producto no encontrado.</p>
                <Button as={Link} to="/catalogo" variant="outline-secondary">Volver al catálogo</Button>
            </Container></main>
        );
        return (
            <main>
                <Container className="py-5">
                    <Row className="g-2 align-items-start">
                        <Col xs={12} md={5}><Image src={producto.imagen} alt={producto.nombre} fluid rounded className="shadow-sm" /></Col>
                        <Col xs={12} md={7}>
                            <Badge bg="secondary" className="mb-2">{producto.categoria.nombre}</Badge>
                            <h2>{producto.nombre}</h2>
                            <p className="fs-4 fw-bold">${producto.precio.toLocaleString("es-CL")}</p>
                            <ul className="list-unstyled">
                                <li><strong>Detalle:</strong> {producto.detalle}</li>
                                <li><strong>Especie:</strong> {producto.especie}</li>
                            </ul>
                            <div className="d-flex gap-2 mt-3">
                                <Button variant="success" onClick={() => agregarAlCarrito(producto.id, producto.nombre, producto.precio, producto.imagen)}>Agregar al carrito</Button>
                                <Button as={Link} to="/catalogo" variant="outline-secondary">Volver al catálogo</Button>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </main>
        );
    }

    const categorias = [...new Set(productos.map((p) => p.categoria.nombre))];
    const productosFiltrados = productos.filter((p) => {
        const coincideNombre = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
        const coincideCategoria = categoria === "" || p.categoria.nombre === categoria;
        return coincideNombre && coincideCategoria;
    });

    return (
        <main>
            <Container className="mb-5">
                <h2 className="text-center mb-4">Nuestro catálogo</h2>
                <Row className="g-3 mb-4">
                    <Col md={8}><Form.Control type="search" placeholder="Buscar producto por nombre..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} /></Col>
                    <Col md={4}>
                        <Form.Select value={categoria} onChange={(e) => setSearchParams(e.target.value ? { categoria: e.target.value } : {})}>
                            <option value="">Todas las categorías</option>
                            {categorias.map((c) => (<option key={c} value={c}>{c}</option>))}
                        </Form.Select>
                    </Col>
                </Row>
                {productosFiltrados.length === 0 && <p className="text-center text-muted">No se encontraron productos.</p>}
                <Row className="g-4">
                    {productosFiltrados.map((p) => (
                        <Col xs={12} sm={6} lg={3} key={p.id}>
                            <Card className="shadow-sm" style={{ height: "100%", minWidth: 0 }}>
                                <Link to={`/producto/${p.id}`} className="text-decoration-none text-dark"><Card.Img variant="top" src={p.imagen} className="catalogo-product-image" alt={p.nombre} /></Link>
                                <Card.Body className="d-flex flex-column" style={{ minWidth: 0 }}>
                                    <Badge bg="secondary" className="align-self-start mb-2">{p.categoria.nombre}</Badge>
                                    <Link to={`/producto/${p.id}`} className="text-decoration-none text-dark"><Card.Title>{p.nombre}</Card.Title></Link>
                                    <Card.Text className="mb-1">{p.detalle}</Card.Text>
                                    <Card.Text className="text-muted small">{p.especie}</Card.Text>
                                    <Card.Text className="fw-bold">${p.precio.toLocaleString("es-CL")}</Card.Text>
                                    <div className="mt-auto d-flex gap-2">
                                        <Button as={Link} to={`/producto/${p.id}`} variant="outline-secondary" size="sm" className="w-100">Ver detalle</Button>
                                        <Button variant="success" size="sm" className="w-100" onClick={() => agregarAlCarrito(p.id, p.nombre, p.precio, p.imagen)}>Agregar</Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </main>
    );
}

export default Producto;