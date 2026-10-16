import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Producto from "./Producto";
import { productos } from "../utils/productos";

const { agregarAlCarrito } = vi.hoisted(() => ({ agregarAlCarrito: vi.fn() }));

vi.mock("../context/CarritoContext", () => ({
    useCarritoContext: () => ({ agregarAlCarrito }),
}));

const producto = productos.find((p) => p.id === "ME001");

const mostrarProducto = (id) => render(
    <MemoryRouter initialEntries={[`/producto/${id}`]}>
        <Routes>
            <Route path="/producto/:id" element={<Producto />} />
        </Routes>
    </MemoryRouter>
);

describe("Producto", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("muestra los datos del producto", () => {
        mostrarProducto("ME001");
        expect(screen.getByRole("heading", { name: producto.nombre })).toBeInTheDocument();
        expect(screen.getByText(producto.categoria)).toBeInTheDocument();
        expect(screen.getByText(producto.detalle)).toBeInTheDocument();
        expect(screen.getByText(producto.especie)).toBeInTheDocument();
        expect(screen.getByText(`$${producto.precio.toLocaleString("es-CL")}`)).toBeInTheDocument();
    });

    it("muestra la imagen del producto", () => {
        mostrarProducto("ME001");
        expect(screen.getByAltText(producto.nombre)).toHaveAttribute("src", producto.imagen);
    });

    it("agrega el producto al carrito", async () => {
        mostrarProducto("ME001");
        await userEvent.click(screen.getByRole("button", { name: "Agregar al carrito" }));
        expect(agregarAlCarrito).toHaveBeenCalledWith(producto.id, producto.nombre, producto.precio, producto.imagen);
    });

    it("permite volver al catálogo", () => {
        mostrarProducto("ME001");
        expect(screen.getByRole("button", { name: "Volver al catálogo" })).toHaveAttribute("href", "/catalogo");
    });

    it("avisa si el producto no existe", () => {
        mostrarProducto("XXXX");
        expect(screen.getByText("Producto no encontrado.")).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Agregar al carrito" })).not.toBeInTheDocument();
    });
});