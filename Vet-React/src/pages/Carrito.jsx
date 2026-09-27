import { Link } from "react-router-dom";
import { useCarritoContext } from "../context/CarritoContext";

function Carrito() {
    const { carrito, eliminarItem, vaciarCarrito, totalPrecio, cambiarCantidad } = useCarritoContext();

    if (carrito.length === 0) {
        return (
            <main className="container mb-5">
                <h2 className="text-center mb-4">Tu carrito de compras</h2>
                <div className="text-center">
                    <p>Tu carrito está vacío.</p>
                    <Link to="/catalogo" className="btn btn-success">Ir al catálogo</Link>
                </div>
            </main>
        );
    }

    return (
        <main className="container mb-5">
            <h2 className="text-center mb-4">Tu carrito de compras</h2>
            <table className="table align-middle">
                <thead>
                    <tr>
                        <th></th>
                        <th>Producto</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                        <th>Subtotal</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {carrito.map((item) => (
                        <tr key={item.id}>
                            <td><img src={item.imagen} alt={item.nombre} className="img-carrito" /></td>
                            <td>{item.nombre}</td>
                            <td>${item.precio.toLocaleString("es-CL")}</td>
                            <td>
                                <div className="d-flex align-items-center gap-2">
                                    <button className="btn btn-sm btn-outline-secondary" onClick={() => cambiarCantidad(item.id, item.cantidad - 1)}>-</button>
                                    <span>{item.cantidad}</span>
                                    <button className="btn btn-sm btn-outline-secondary" onClick={() => cambiarCantidad(item.id, item.cantidad + 1)}>+</button>
                                </div>
                            </td>
                            <td>${(item.precio * item.cantidad).toLocaleString("es-CL")}</td>
                            <td><button className="btn btn-sm btn-outline-danger" onClick={() => eliminarItem(item.id)}>Quitar</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="text-end">
                <h4>Total: ${totalPrecio.toLocaleString("es-CL")}</h4>
                <button className="btn btn-outline-danger" onClick={vaciarCarrito}>Vaciar carrito</button>
            </div>
        </main>
    );
}

export default Carrito;