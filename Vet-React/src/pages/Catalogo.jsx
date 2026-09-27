import { Link } from "react-router-dom";
import { useCarrito } from "../hooks/useCarrito";
import { productos } from "../utils/productos";

function Catalogo() {
    const { agregarAlCarrito } = useCarrito();

    return (
        <main className="container mb-5">
            <h2 className="text-center mb-4">Nuestro catálogo</h2>
            <div className="row g-4">
                {productos.map((p) => (
                    <div className="col-12 col-sm-6 col-lg-3" key={p.id}>
                        <div className="card producto-card shadow-sm">
                            <img src={p.imagen} className="card-img-top" alt={p.nombre} />
                            <div className="card-body d-flex flex-column">
                                <span className="badge bg-secondary badge-stock mb-2">{p.categoria}</span>
                                <h5 className="card-title">{p.nombre}</h5>
                                <p className="card-text mb-1">{p.detalle}</p>
                                <p className="card-text text-muted small">{p.especie}</p>
                                <p className="card-text fw-bold">${p.precio.toLocaleString("es-CL")}</p>
                                <div className="mt-auto d-flex gap-2">
                                    <Link to={`/producto/${p.id}`} className="btn btn-outline-secondary btn-sm w-100">Ver detalle</Link>
                                    <button className="btn btn-success btn-sm w-100" onClick={() => agregarAlCarrito(p.id, p.nombre, p.precio, p.imagen)}>Agregar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}

export default Catalogo;