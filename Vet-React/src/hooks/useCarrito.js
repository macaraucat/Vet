import { useState, useEffect } from "react";

export function useCarrito() {
    const [carrito, setCarrito] = useState(() => {
        return JSON.parse(localStorage.getItem("carrito")) || [];
    });
    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }, [carrito]);

    function agregarAlCarrito(id, nombre, precio, imagen) {
        const existe = carrito.find(p => p.id === id);
        if (existe) {
            setCarrito(carrito.map(p => p.id === id ? { ...p, cantidad: p.cantidad + 1 } : p));
        } else {
            setCarrito([...carrito, { id, nombre, precio, imagen, cantidad: 1 }]);
        }
        setMensaje("Producto agregado correctamente");
        setTimeout(() => setMensaje(""), 2500);
    }

    function eliminarItem(id) {
        setCarrito(carrito.filter(p => p.id !== id));
    }

    function cambiarCantidad(id, nuevaCantidad) {
        if (nuevaCantidad < 1) return;
        setCarrito(carrito.map(p => p.id === id ? { ...p, cantidad: nuevaCantidad } : p));
    }

    function vaciarCarrito() {
        setCarrito([]);
    }

    const totalItems = carrito.reduce((suma, item) => suma + item.cantidad, 0);
    const totalPrecio = carrito.reduce((suma, item) => suma + item.precio * item.cantidad, 0);

    return { carrito, agregarAlCarrito, eliminarItem, vaciarCarrito, totalItems, totalPrecio, mensaje, cambiarCantidad };
}