import { useState, useEffect } from "react";

export function useCarrito() {
    const [carrito, setCarrito] = useState(() => {
        return JSON.parse(localStorage.getItem("carrito")) || [];
    });

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
    }

    function eliminarItem(id) {
        setCarrito(carrito.filter(p => p.id !== id));
    }

    function vaciarCarrito() {
        setCarrito([]);
    }

    const totalItems = carrito.reduce((suma, item) => suma + item.cantidad, 0);
    const totalPrecio = carrito.reduce((suma, item) => suma + item.precio * item.cantidad, 0);

    return { carrito, agregarAlCarrito, eliminarItem, vaciarCarrito, totalItems, totalPrecio };
}