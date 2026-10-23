import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Catalogo from "./Catalogo";
import { productos } from "../utils/productos";

const { agregarAlCarrito } = vi.hoisted(() => ({ agregarAlCarrito: vi.fn() }));

vi.mock("../context/CarritoContext", () => ({
    useCarritoContext: () => ({ agregarAlCarrito }),
}));

const mostrarCatalogo = () => render(<MemoryRouter><Catalogo /></MemoryRouter>);

describe("Catalogo", () => {
    it("muestra todos los productos", () => {
        mostrarCatalogo();
        expect(screen.getAllByRole("button", { name: "Agregar" })).toHaveLength(productos.length);
    });

    it("filtra los productos al buscar por nombre", async () => {
        mostrarCatalogo();
        await userEvent.type(screen.getByPlaceholderText("Buscar producto por nombre..."), "nexgard");
        expect(screen.getByText("Nexgard")).toBeInTheDocument();
        expect(screen.queryByText("Bravecto")).not.toBeInTheDocument();
    });

    it("muestra un mensaje si no hay resultados", async () => {
        mostrarCatalogo();
        await userEvent.type(screen.getByPlaceholderText("Buscar producto por nombre..."), "zzzz");
        expect(screen.getByText("No se encontraron productos.")).toBeInTheDocument();
    });

    it("filtra los productos al elegir una categoría", async () => {
        mostrarCatalogo();
        await userEvent.selectOptions(screen.getByRole("combobox"), "Vacunas");
        const vacunas = productos.filter((p) => p.categoria === "Vacunas");
        expect(screen.getAllByRole("button", { name: "Agregar" })).toHaveLength(vacunas.length);
        expect(screen.queryByText("Nexgard")).not.toBeInTheDocument();
    });

    it("agrega el producto al carrito al presionar Agregar", async () => {
        mostrarCatalogo();
        await userEvent.click(screen.getAllByRole("button", { name: "Agregar" })[0]);
        const primero = productos[0];
        expect(agregarAlCarrito).toHaveBeenCalledWith(primero.id, primero.nombre, primero.precio, primero.imagen);
    });
});