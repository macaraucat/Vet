import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge, Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useCarritoContext } from "../context/CarritoContext";
import { productos } from "../utils/productos";

// Lista de categorías sin repetir
const categorias = [...new Set(productos.map((p) => p.categoria))];

function Catalogo() {
    const { agregarAlCarrito } = useCarritoContext();
    const [busqueda, setBusqueda] = useState("");
    const [categoria, setCategoria] = useState("");

    // Solo quedan los productos que coinciden con el nombre y la categoría elegida
    const productosFiltrados = productos.filter((p) => {
        const coincideNombre = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
        const coincideCategoria = categoria === "" || p.categoria === categoria;
        return coincideNombre && coincideCategoria;
    });

    return (
        <main>
            <Container className="mb-5">
                <h2 className="text-center mb-4">Nuestro catálogo</h2>

                <Row className="g-3 mb-4">
                    <Col md={8}>
                        <Form.Control
                            type="search"
                            placeholder="Buscar producto por nombre..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </Col>
                    <Col md={4}>
                        <Form.Select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                            <option value="">Todas las categorías</option>
                            {categorias.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </Form.Select>
                    </Col>
                </Row>

                {productosFiltrados.length === 0 && (
                    <p className="text-center text-muted">No se encontraron productos.</p>
                )}

                <Row className="g-4">
                    {productosFiltrados.map((p) => (
                        <Col xs={12} sm={6} lg={3} key={p.id}>
                            <Card className="shadow-sm" style={{ height: "100%", minWidth: 0 }}>
                                <Link to={`/producto/${p.id}`} className="text-decoration-none text-dark">
                                    <Card.Img
                                        variant="top"
                                        src={p.imagen}
                                        className="catalogo-product-image"
                                        alt={p.nombre}
                                        style={{ height: "180px", objectFit: "cover" }}
                                    />
                                </Link>
                                <Card.Body className="d-flex flex-column" style={{ minWidth: 0 }}>
                                    <Badge bg="secondary" className="align-self-start mb-2">{p.categoria}</Badge>
                                    <Link to={`/producto/${p.id}`} className="text-decoration-none text-dark">
                                        <Card.Title>{p.nombre}</Card.Title>
                                    </Link>
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

export default Catalogo;