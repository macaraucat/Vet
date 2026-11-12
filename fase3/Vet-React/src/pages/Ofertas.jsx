import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Badge, Button, Card, Col, Container, Row } from "react-bootstrap";
import { useCarritoContext } from "../context/CarritoContext";
import { obtenerProductos } from "../services/tiendaApi";

const CODIGOS_OFERTA = ["ME001", "ME005", "ME010", "ME013", "ME016", "ME021"];

function Ofertas() {
    const { agregarAlCarrito } = useCarritoContext();
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        obtenerProductos().then(setProductos).finally(() => setCargando(false));
    }, []);

    const ofertas = productos.filter((p) => CODIGOS_OFERTA.includes(p.codigo));

    if (cargando) {
        return <main><Container className="mb-5"><p className="text-center">Cargando...</p></Container></main>;
    }

    return (
        <main>
            <Container className="mb-5">
                <h2 className="text-center mb-2">Ofertas</h2>
                <p className="text-center text-muted mb-4">20% de descuento en productos seleccionados</p>
                <Row className="g-4">
                    {ofertas.map((p) => {
                        const precio = Math.round(p.precio * 0.8);
                        return (
                            <Col xs={12} sm={6} lg={3} key={p.id}>
                                <Card className="shadow-sm" style={{ height: "100%", minWidth: 0 }}>
                                    <Link to={`/producto/${p.id}`}>
                                        <Card.Img variant="top" src={p.imagen} alt={p.nombre} />
                                    </Link>
                                    <Card.Body className="d-flex flex-column">
                                        <Badge bg="secondary" className="align-self-start mb-2">{p.categoria.nombre}</Badge>
                                        <Card.Title>{p.nombre}</Card.Title>
                                        <Card.Text className="mb-1">{p.detalle}</Card.Text>
                                        <Card.Text className="fw-bold">
                                            <span className="text-decoration-line-through text-muted me-2">
                                                ${p.precio.toLocaleString("es-CL")}
                                            </span>
                                            <span className="text-danger">${precio.toLocaleString("es-CL")}</span>
                                        </Card.Text>
                                        <div className="mt-auto d-flex gap-2">
                                            <Button as={Link} to={`/producto/${p.id}`} variant="outline-secondary" size="sm" className="w-100">
                                                Ver detalle
                                            </Button>
                                            <Button variant="success" size="sm" className="w-100"
                                                    onClick={() => agregarAlCarrito(p.id, p.nombre, precio, p.imagen)}>
                                                Agregar
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            </Container>
        </main>
    );
}

export default Ofertas;