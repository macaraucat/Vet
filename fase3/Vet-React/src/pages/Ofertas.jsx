import { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import TarjetaProducto from "../components/TarjetaProducto";
import { obtenerProductos } from "../services/productosApi";

const productosEnOferta = ["ME001", "ME005", "ME010", "ME013", "ME016", "ME021"];
const DESCUENTO_OFERTA = 0.2;

function Ofertas() {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        obtenerProductos()
            .then(setProductos)
            .finally(() => setCargando(false));
    }, []);

    const ofertas = productos.filter((p) => productosEnOferta.includes(p.codigo));

    if (cargando) {
        return <main><Container className="mb-5"><p className="text-center">Cargando...</p></Container></main>;
    }

    return (
        <main>
            <Container className="mb-5">
                <h2 className="text-center mb-2">Ofertas</h2>
                <p className="text-center text-muted mb-4">
                    {DESCUENTO_OFERTA * 100}% de descuento en productos seleccionados
                </p>

                <Row className="g-4">
                    {ofertas.map((p) => (
                        <Col xs={12} sm={6} lg={3} key={p.id}>
                            <TarjetaProducto producto={p} descuento={DESCUENTO_OFERTA} />
                        </Col>
                    ))}
                </Row>
            </Container>
        </main>
    );
}

export default Ofertas;