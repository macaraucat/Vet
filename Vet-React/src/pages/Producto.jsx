import { useParams, Link } from "react-router-dom";
import { useCarritoContext } from "../context/CarritoContext";
import { productos } from "../utils/productos";
import "./tienda.css";

function Producto() {
    const { id } = useParams();
    const { agregarAlCarrito } = useCarritoContext();
    const producto = productos.find((p) => p.id === id);

    if (!producto) {
        return (
            <main className="container py-5">
                <p>Producto no encontrado.</p>
                <Link to="/catalogo" className="btn btn-outline-secondary">Volver al catálogo</Link>
            </main>
        );
    }

    return (
        <main className="container py-5">
            <div className="row g-2 align-items-start">
                <div className="col-12 col-md-5">
                    <img src={producto.imagen} alt={producto.nombre} className="img-fluid rounded shadow-sm" />
                </div>
                <div className="col-12 col-md-7">
                    <span className="badge bg-secondary mb-2">{producto.categoria}</span>
                    <h2>{producto.nombre}</h2>
                    <p className="fs-4 fw-bold">${producto.precio.toLocaleString("es-CL")}</p>
                    <ul className="list-unstyled">
                        <li><strong>Detalle:</strong> {producto.detalle}</li>
                        <li><strong>Especie:</strong> {producto.especie}</li>
                    </ul>
                    <div className="d-flex gap-2 mt-3">
                        <button className="btn btn-success" onClick={() => agregarAlCarrito(producto.id, producto.nombre, producto.precio, producto.imagen)}>Agregar al carrito</button>
                        <Link to="/catalogo" className="btn btn-outline-secondary">Volver al catálogo</Link>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Producto;