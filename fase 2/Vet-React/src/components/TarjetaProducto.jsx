import { Link } from "react-router-dom";
import { Badge, Button, Card } from "react-bootstrap";
import { useCarritoContext } from "../context/CarritoContext";

function TarjetaProducto({ producto, descuento = 0 }) {
    const { agregarAlCarrito } = useCarritoContext();
    const precioFinal = Math.round(producto.precio * (1 - descuento));

    return (
        <Card className="shadow-sm" style={{ height: "100%", minWidth: 0 }}>
            <Link to={`/producto/${producto.id}`}>
                <Card.Img
                    variant="top"
                    src={producto.imagen}
                    alt={producto.nombre}
                    style={{ height: "180px", objectFit: "cover" }}
                />
            </Link>
            <Card.Body className="d-flex flex-column">
                <Badge bg="secondary" className="align-self-start mb-2">{producto.categoria}</Badge>
                <Card.Title>{producto.nombre}</Card.Title>
                <Card.Text className="mb-1">{producto.detalle}</Card.Text>

                <Card.Text className="fw-bold">
                    {descuento > 0 && (
                        <span className="text-decoration-line-through text-muted me-2">
                            ${producto.precio.toLocaleString("es-CL")}
                        </span>
                    )}
                    <span className={descuento > 0 ? "text-danger" : ""}>
                        ${precioFinal.toLocaleString("es-CL")}
                    </span>
                </Card.Text>

                <div className="mt-auto d-flex gap-2">
                    <Button as={Link} to={`/producto/${producto.id}`} variant="outline-secondary" size="sm" className="w-100">
                        Ver detalle
                    </Button>
                    <Button
                        variant="success"
                        size="sm"
                        className="w-100"
                        onClick={() => agregarAlCarrito(producto.id, producto.nombre, precioFinal, producto.imagen)}
                    >
                        Agregar
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
}

export default TarjetaProducto;