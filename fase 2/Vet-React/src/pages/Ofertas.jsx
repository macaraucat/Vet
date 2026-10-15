import { Col, Container, Row } from "react-bootstrap";
import TarjetaProducto from "../components/TarjetaProducto";
import { productos, productosEnOferta, DESCUENTO_OFERTA } from "../utils/productos";

function Ofertas() {
    const ofertas = productos.filter((p) => productosEnOferta.includes(p.id));

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