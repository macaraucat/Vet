import { Col, Container, Row } from "react-bootstrap";
import TarjetaProducto from "../components/TarjetaProducto";
import { productos } from "../utils/productos";

// Lista de categorías sin repetir
const categorias = [...new Set(productos.map((p) => p.categoria))];

function Categorias() {
    return (
        <main>
            <Container className="mb-5">
                <h2 className="text-center mb-4">Categorías</h2>

                {categorias.map((categoria) => (
                    <section key={categoria} className="mb-5">
                        <h3 className="mb-3">{categoria}</h3>
                        <Row className="g-4">
                            {productos
                                .filter((p) => p.categoria === categoria)
                                .map((p) => (
                                    <Col xs={12} sm={6} lg={3} key={p.id}>
                                        <TarjetaProducto producto={p} />
                                    </Col>
                                ))}
                        </Row>
                    </section>
                ))}
            </Container>
        </main>
    );
}

export default Categorias;