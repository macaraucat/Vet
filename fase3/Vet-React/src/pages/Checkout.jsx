import { useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Button, Card, Col, Container, Form, Row, Table } from "react-bootstrap";
import { useCarritoContext } from "../context/CarritoContext";
import { useAuthContext } from "../context/AuthContext";
import { validar, reglasCheckout } from "../utils/validaciones";

function buscarDatosUsuario(nombre) {
    try {
        const usuarios = JSON.parse(localStorage.getItem("usuariosDB")) || [];
        return usuarios.find((u) => u.nombre === nombre);
    } catch {
        return undefined;
    }
}

function Checkout() {
    const { carrito, totalPrecio, vaciarCarrito } = useCarritoContext();
    const { usuario } = useAuthContext();

    const guardado = (usuario && buscarDatosUsuario(usuario.nombre)) || {};

    const [datos, setDatos] = useState({
        nombre: guardado.nombre || "",
        apellidos: "",
        correo: guardado.email || "",
        entrega: "Despacho a domicilio",
        calle: guardado.direccion || "",
        departamento: "",
        region: "",
        comuna: guardado.comuna || "",
        indicaciones: "",
    });
    const [errores, setErrores] = useState({});
    const [resultado, setResultado] = useState(null); 
    const [pedido, setPedido] = useState(null);
    const [correoEnviado, setCorreoEnviado] = useState(false);

    const esRetiro = datos.entrega === "Retiro en tienda";

    function cambiar(e) {
        const { name, value } = e.target;

        if (name === "region") {
            setDatos((prev) => ({ ...prev, region: value, comuna: "" }));
            setErrores((prev) => {
                const restantes = { ...prev };
                delete restantes.comuna;
                return restantes;
            });
            return;
        }

        setDatos({ ...datos, [name]: value });
    }

    function pagar(e) {
        e.preventDefault();

        const reglas = esRetiro
            ? { nombre: reglasCheckout.nombre, apellidos: reglasCheckout.apellidos, correo: reglasCheckout.correo }
            : reglasCheckout;

        const nuevosErrores = validar(datos, reglas);
        setErrores(nuevosErrores);
        if (Object.keys(nuevosErrores).length > 0) return;

        const numero = Math.floor(100000 + Math.random() * 900000);
        const pagoCorrecto = Math.random() > 0.2;

        setPedido({ numero, items: carrito, total: totalPrecio });
        setResultado(pagoCorrecto ? "exito" : "error");
        if (pagoCorrecto) vaciarCarrito();
    }

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

                            <h5>Entrega: {datos.entrega}</h5>
                            {esRetiro ? (
                                <p>Retiro en Veterinaria San Marcos, Rancagua.</p>
                            ) : (
                                <p>
                                    {datos.calle} {datos.departamento}, {datos.comuna}, {datos.region}
                                    <br />
                                    {datos.indicaciones}
                                </p>
                            )}

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

    return (
        <main>
            <Container className="mb-5" style={{ maxWidth: 720 }}>
                <h2 className="text-center mb-4">Checkout</h2>
                <h4 className="text-end mb-3">Total a pagar: ${totalPrecio.toLocaleString("es-CL")}</h4>

                {usuario && (
                    <Alert variant="info">Completamos tus datos con la información de tu cuenta.</Alert>
                )}

                <Form onSubmit={pagar} noValidate>
                    <h5>Información del cliente</h5>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control name="nombre" value={datos.nombre} onChange={cambiar} isInvalid={!!errores.nombre} />
                                <Form.Control.Feedback type="invalid">{errores.nombre}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Apellidos</Form.Label>
                                <Form.Control name="apellidos" value={datos.apellidos} onChange={cambiar} isInvalid={!!errores.apellidos} />
                                <Form.Control.Feedback type="invalid">{errores.apellidos}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>Correo</Form.Label>
                        <Form.Control type="email" name="correo" value={datos.correo} onChange={cambiar} isInvalid={!!errores.correo} />
                        <Form.Control.Feedback type="invalid">{errores.correo}</Form.Control.Feedback>
                    </Form.Group>

                    <h5 className="mt-3">Opción de entrega</h5>

                    <Form.Group className="mb-3">
                        <Form.Select name="entrega" value={datos.entrega} onChange={cambiar}>
                            <option>Despacho a domicilio</option>
                            <option>Retiro en tienda</option>
                        </Form.Select>
                    </Form.Group>

                    {!esRetiro && (
                        <>
                            <h5 className="mt-3">Dirección de entrega</h5>

                            <Row>
                                <Col md={8}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Calle</Form.Label>
                                        <Form.Control name="calle" value={datos.calle} onChange={cambiar} isInvalid={!!errores.calle} />
                                        <Form.Control.Feedback type="invalid">{errores.calle}</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Departamento (opcional)</Form.Label>
                                        <Form.Control name="departamento" value={datos.departamento} onChange={cambiar} isInvalid={!!errores.departamento} />
                                        <Form.Control.Feedback type="invalid">{errores.departamento}</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Región</Form.Label>
                                        <Form.Select name="region" value={datos.region} onChange={cambiar} isInvalid={!!errores.region}>
                                            <option value="">Seleccionar región</option>
                                            {REGIONES.map((region) => (
                                                <option key={region} value={region}>{region}</option>
                                            ))}
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">{errores.region}</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Comuna</Form.Label>
                                        <Form.Select name="comuna" value={datos.comuna} onChange={cambiar} isInvalid={!!errores.comuna} disabled={!datos.region}>
                                            <option value="">{datos.region ? "Seleccionar comuna" : "Primero selecciona una región"}</option>
                                            {(REGION_COMUNAS[datos.region] ?? []).map((comuna) => (
                                                <option key={comuna} value={comuna}>{comuna}</option>
                                            ))}
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">{errores.comuna}</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group className="mb-3">
                                <Form.Label>Indicaciones para la entrega (opcional)</Form.Label>
                                <Form.Control as="textarea" rows={2} name="indicaciones" value={datos.indicaciones} onChange={cambiar} isInvalid={!!errores.indicaciones} />
                                <Form.Control.Feedback type="invalid">{errores.indicaciones}</Form.Control.Feedback>
                            </Form.Group>
                        </>
                    )}

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