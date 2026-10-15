import { useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Button, Container, Image, Table } from "react-bootstrap";
import { useCarritoContext } from "../context/CarritoContext";

function Carrito() {
    const { carrito, eliminarItem, vaciarCarrito, totalPrecio, cambiarCantidad } = useCarritoContext();
    const [pedidoConfirmado, setPedidoConfirmado] = useState("");

    function finalizarCompra() {
        const numeroPedido = Math.floor(100000 + Math.random() * 900000);
        vaciarCarrito();
        setPedidoConfirmado(`¡Pedido N.º ${numeroPedido} realizado con éxito! Te contactaremos para coordinar la entrega.`);
    }

    if (pedidoConfirmado) {
        return (
            <main>
                <Container className="mb-5">
                    <h2 className="text-center mb-4">Tu carrito de compras</h2>
                    <Alert variant="success" className="text-center mt-4">{pedidoConfirmado}</Alert>
                </Container>
            </main>
        );
    }

    if (carrito.length === 0) {
        return (
            <main>
                <Container className="mb-5">
                    <h2 className="text-center mb-4">Tu carrito de compras</h2>
                    <div className="text-center">
                        <p>Tu carrito está vacío.</p>
                        <Button as={Link} to="/catalogo" variant="success">Ir al catálogo</Button>
                    </div>
                </Container>
            </main>
        );
    }

    return (
        <main>
            <Container className="mb-5">
                <h2 className="text-center mb-4">Tu carrito de compras</h2>
                <Table responsive className="align-middle">
                    <thead>
                        <tr>
                            <th aria-label="Imagen del producto"></th>
                            <th>Producto o servicio</th>
                            <th>Precio</th>
                            <th>Cantidad</th>
                            <th>Subtotal</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {carrito.map((item) => (
                            <tr key={item.id}>
                                <td>{item.imagen && <Image src={item.imagen} alt={item.nombre} width={50} height={50} style={{ objectFit: "cover" }} />}</td>
                                <td>
                                    <strong>{item.nombre}</strong>
                                    {item.tipo === "cita" && (
                                        <div className="small text-muted mt-1">
                                            <div>Fecha: {new Date(`${item.fecha}T00:00:00`).toLocaleDateString("es-CL")}</div>
                                            <div>Hora: {item.hora}</div>
                                            <div>Mascota: {item.nombreMascota} ({item.especie})</div>
                                            {item.raza && <div>Raza: {item.raza}</div>}
                                            <div>Edad: {item.edad} {item.edad === 1 ? "año" : "años"}</div>
                                            <div>Tutor: {item.tutor}</div>
                                        </div>
                                    )}
                                </td>
                                <td>${item.precio.toLocaleString("es-CL")}</td>
                                <td>
                                    {item.tipo === "cita" ? item.cantidad : (
                                        <div className="d-flex align-items-center gap-2">
                                            <Button size="sm" variant="outline-secondary" aria-label={`Disminuir cantidad de ${item.nombre}`} onClick={() => cambiarCantidad(item.id, item.cantidad - 1)}>-</Button>
                                            <span>{item.cantidad}</span>
                                            <Button size="sm" variant="outline-secondary" aria-label={`Aumentar cantidad de ${item.nombre}`} onClick={() => cambiarCantidad(item.id, item.cantidad + 1)}>+</Button>
                                        </div>
                                    )}
                                </td>
                                <td>${(item.precio * item.cantidad).toLocaleString("es-CL")}</td>
                                <td><Button size="sm" variant="outline-danger" onClick={() => eliminarItem(item.id)}>Quitar</Button></td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <div className="text-end">
                    <h4>Total: ${totalPrecio.toLocaleString("es-CL")}</h4>
                    <Button variant="outline-danger" onClick={vaciarCarrito}>Vaciar carrito</Button>
                    <Button variant="success" className="ms-2" onClick={finalizarCompra}>Finalizar compra</Button>
                </div>
            </Container>
        </main>
    );
}

export default Carrito;