import { useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Button, Card, Container, Form, Table } from "react-bootstrap";
import { useCarritoContext } from "../context/CarritoContext";
import { validar, reglasCheckout } from "../utils/validaciones";

function Checkout() {
    const { carrito, totalPrecio, vaciarCarrito } = useCarritoContext();

    const [datos, setDatos] = useState({
        nombre: "", apellidos: "", correo: "",
        calle: "", departamento: "", region: "", comuna: "", indicaciones: "",
    });
    const [errores, setErrores] = useState({});
    const [resultado, setResultado] = useState(null); // null, "exito" o "error"
    const [pedido, setPedido] = useState(null);
    const [correoEnviado, setCorreoEnviado] = useState(false);

    function cambiar(e) {
        setDatos({ ...datos, [e.target.name]: e.target.value });
    }

    function pagar(e) {
        e.preventDefault();
        const nuevosErrores = validar(datos, reglasCheckout);
        setErrores(nuevosErrores);
        if (Object.keys(nuevosErrores).length > 0) return;

        const numero = Math.floor(100000 + Math.random() * 900000);
        const pagoCorrecto = Math.random() > 0.2;

        setPedido({ numero, items: carrito, total: totalPrecio });
        setResultado(pagoCorrecto ? "exito" : "error");
        if (pagoCorrecto) vaciarCarrito();
    }

    // Vista: compra exitosa o pago con error
    if (resultado) {
        const exito = resultado === "exito";
        return (
            <main>
                <Container className="mb-5" style={{ maxWidth: 720 }}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <p className="text-end text-muted small">Código orden: ORDER{pedido.numero}</p>
                            <h3 className={exito ? "text-success" : "text-danger"}>
                                {exito ? "✔ Se ha realizado la compra" : "✖ No se pudo realizar el pago"} nro #{pedido.numero}
                            </h3>

                            <h5 className="mt-4">Cliente</h5>
                            <p>{datos.nombre} {datos.apellidos} - {datos.correo}</p>

                            <h5>Dirección de entrega</h5>
                            <p>
                                {datos.calle} {datos.departamento}, {datos.comuna}, {datos.region}
                                <br />
                                {datos.indicaciones}
                            </p>

                            <Table responsive>
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th>Precio</th>
                                        <th>Cantidad</th>
                                        <th>Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pedido.items.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.nombre}</td>
                                            <td>${item.precio.toLocaleString("es-CL")}</td>
                                            <td>{item.cantidad}</td>
                                            <td>${(item.precio * item.cantidad).toLocaleString("es-CL")}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>

                            <h4 className="text-center">Total: ${pedido.total.toLocaleString("es-CL")}</h4>

                            <div className="text-center mt-4 d-print-none">
                                {exito ? (
                                    <>
                                        <Button variant="danger" className="me-2" onClick={() => window.print()}>
                                            Imprimir boleta en PDF
                                        </Button>
                                        <Button variant="success" onClick={() => setCorreoEnviado(true)}>
                                            Enviar boleta por email
                                        </Button>
                                        {correoEnviado && (
                                            <Alert variant="success" className="mt-3">
                                                Boleta enviada a {datos.correo}
                                            </Alert>
                                        )}
                                    </>
                                ) : (
                                    <Button variant="success" onClick={() => setResultado(null)}>
                                        Volver a realizar el pago
                                    </Button>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Container>
            </main>
        );
    }

    // Vista: carrito vacío
    if (carrito.length === 0) {
        return (
            <main>
                <Container className="mb-5 text-center">
                    <h2 className="mb-4">Checkout</h2>
                    <p>Tu carrito está vacío.</p>
                    <Button as={Link} to="/catalogo" variant="success">Ir al catálogo</Button>
                </Container>
            </main>
        );
    }

    // Vista: formulario
    return (
        <main>
            <Container className="mb-5" style={{ maxWidth: 720 }}>
                <h2 className="text-center mb-4">Checkout</h2>
                <h4 className="text-end">Total a pagar: ${totalPrecio.toLocaleString("es-CL")}</h4>

                <Form onSubmit={pagar} noValidate>
                    <h5>Información del cliente</h5>

                    <Form.Group className="mb-3">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control name="nombre" value={datos.nombre} onChange={cambiar} isInvalid={!!errores.nombre} />
                        <Form.Control.Feedback type="invalid">{errores.nombre}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Apellidos</Form.Label>
                        <Form.Control name="apellidos" value={datos.apellidos} onChange={cambiar} isInvalid={!!errores.apellidos} />
                        <Form.Control.Feedback type="invalid">{errores.apellidos}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Correo</Form.Label>
                        <Form.Control name="correo" value={datos.correo} onChange={cambiar} isInvalid={!!errores.correo} />
                        <Form.Control.Feedback type="invalid">{errores.correo}</Form.Control.Feedback>
                    </Form.Group>

                    <h5 className="mt-4">Dirección de entrega</h5>

                    <Form.Group className="mb-3">
                        <Form.Label>Calle</Form.Label>
                        <Form.Control name="calle" value={datos.calle} onChange={cambiar} isInvalid={!!errores.calle} />
                        <Form.Control.Feedback type="invalid">{errores.calle}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Departamento (opcional)</Form.Label>
                        <Form.Control name="departamento" value={datos.departamento} onChange={cambiar} isInvalid={!!errores.departamento} />
                        <Form.Control.Feedback type="invalid">{errores.departamento}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Región</Form.Label>
                        <Form.Select name="region" value={datos.region} onChange={cambiar} isInvalid={!!errores.region}>
                            <option value="">Selecciona...</option>
                            <option>Región del Libertador General Bernardo O'Higgins</option>
                            <option>Región Metropolitana de Santiago</option>
                            <option>Región de Valparaíso</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">{errores.region}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Comuna</Form.Label>
                        <Form.Control name="comuna" value={datos.comuna} onChange={cambiar} isInvalid={!!errores.comuna} />
                        <Form.Control.Feedback type="invalid">{errores.comuna}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Indicaciones para la entrega (opcional)</Form.Label>
                        <Form.Control as="textarea" rows={2} name="indicaciones" value={datos.indicaciones} onChange={cambiar} isInvalid={!!errores.indicaciones} />
                        <Form.Control.Feedback type="invalid">{errores.indicaciones}</Form.Control.Feedback>
                    </Form.Group>

                    <div className="text-end">
                        <Button type="submit" variant="success">
                            Pagar ahora ${totalPrecio.toLocaleString("es-CL")}
                        </Button>
                    </div>
                </Form>
            </Container>
        </main>
    );
}

export default Checkout;