import { useParams, Link } from "react-router-dom";
import { Badge, Button, Col, Container, Image, Row } from "react-bootstrap";
import { useCarritoContext } from "../context/CarritoContext";
import { productos } from "../utils/productos";

function Producto() {
    const { id } = useParams();
    const { agregarAlCarrito } = useCarritoContext();
    const producto = productos.find((p) => p.id === id);

    if (!producto) {
        return (
            <main>
                <Container className="py-5">
                    <p>Producto no encontrado.</p>
                    <Button as={Link} to="/catalogo" variant="outline-secondary">Volver al catálogo</Button>
                </Container>
            </main>
        );
    }

    return (
        <main>
            <Container className="py-5">
                <Row className="g-2 align-items-start">
                    <Col xs={12} md={5}>
                        <Image src={producto.imagen} alt={producto.nombre} fluid rounded className="shadow-sm" />
                    </Col>
                    <Col xs={12} md={7}>
                        <Badge bg="secondary" className="mb-2">{producto.categoria}</Badge>
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

export default Producto;