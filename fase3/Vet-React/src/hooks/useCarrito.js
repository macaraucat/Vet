import { useState, useEffect } from "react";
import { PRECIO_CONSULTA } from "../utils/productos";

export function useCarrito() {
    const [carrito, setCarrito] = useState(() => {
        return JSON.parse(localStorage.getItem("carrito")) || [];
    });
    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }, [carrito]);

    function agregarAlCarrito(id, nombre, precio, imagen) {
        setCarrito((actuales) => {
            const existe = actuales.find((producto) => producto.id === id);
            if (existe) {
                return actuales.map((producto) => producto.id === id
                    ? { ...producto, cantidad: producto.cantidad + 1 }
                    : producto)
            }
            return [...actuales, { id, nombre, precio, imagen, cantidad: 1 }]
        });
        setMensaje("Producto agregado correctamente");
        setTimeout(() => setMensaje(""), 2500);
    }

    function agregarCitaAlCarrito(cita, tutor) {
        setCarrito((actuales) => [...actuales, {
            id: `cita-${Date.now()}`,
            tipo: "cita",
            nombre: "Consulta veterinaria",
            precio: PRECIO_CONSULTA,
            cantidad: 1,
            fecha: cita.fecha,
            hora: cita.hora,
            nombreMascota: cita.nombreMascota,
            especie: cita.especie,
            edad: Number(cita.edad),
            tutor,
        }]);
        setMensaje("Cita agregada al carrito");
        setTimeout(() => setMensaje(""), 2500);
    }

    function eliminarItem(id) {
        setCarrito((actuales) => actuales.filter((producto) => producto.id !== id));
    }

    function cambiarCantidad(id, nuevaCantidad) {
        if (nuevaCantidad < 1) return;
        setCarrito((actuales) => actuales.map((producto) => producto.id === id
            ? { ...producto, cantidad: nuevaCantidad }
            : producto));
    }

    function vaciarCarrito() {
        setCarrito([]);
    }

    const totalItems = carrito.reduce((suma, item) => suma + item.cantidad, 0);
    const totalPrecio = carrito.reduce((suma, item) => suma + item.precio * item.cantidad, 0);

    return { carrito, agregarAlCarrito, agregarCitaAlCarrito, eliminarItem, vaciarCarrito, totalItems, totalPrecio, mensaje, cambiarCantidad };
}