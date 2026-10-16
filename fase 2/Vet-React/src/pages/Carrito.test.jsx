import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Carrito from "./Carrito";

const mocks = vi.hoisted(() => ({
    carrito: [],
    navigate: vi.fn(),
    eliminarItem: vi.fn(),
    vaciarCarrito: vi.fn(),
    cambiarCantidad: vi.fn(),
}));

vi.mock("react-router-dom", async (importOriginal) => ({
    ...(await importOriginal()),
    useNavigate: () => mocks.navigate,
}));

vi.mock("../context/CarritoContext", () => ({
    useCarritoContext: () => ({
        carrito: mocks.carrito,
        totalPrecio: 8400,
        eliminarItem: mocks.eliminarItem,
        vaciarCarrito: mocks.vaciarCarrito,
        cambiarCantidad: mocks.cambiarCantidad,
    }),
}));

const producto = { id: "ME001", nombre: "Amoxibay 250mg", precio: 4200, cantidad: 2 };

const cita = {
    id: "cita-1",
    tipo: "cita",
    nombre: "Consulta veterinaria",
    precio: 15000,
    cantidad: 1,
    fecha: "2026-10-20",
    hora: "10:00",
    nombreMascota: "Firulais",
    especie: "Perro",
    raza: "Quiltro",
    edad: 3,
    tutor: "Ana",
};

const mostrarCarrito = () => render(<MemoryRouter><Carrito /></MemoryRouter>);

describe("Carrito", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.carrito = [producto];
    });

    it("avisa que el carrito está vacío y enlaza al catálogo", () => {
        mocks.carrito = [];
        mostrarCarrito();
        expect(screen.getByText("Tu carrito está vacío.")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Ir al catálogo" })).toHaveAttribute("href", "/catalogo");
    });

    it("muestra el producto y el total", () => {
        mostrarCarrito();
        expect(screen.getByText("Amoxibay 250mg")).toBeInTheDocument();
        expect(screen.getByText(`Total: $${(8400).toLocaleString("es-CL")}`)).toBeInTheDocument();
    });

    it("aumenta la cantidad del producto", async () => {
        mostrarCarrito();
        await userEvent.click(screen.getByRole("button", { name: "Aumentar cantidad de Amoxibay 250mg" }));
        expect(mocks.cambiarCantidad).toHaveBeenCalledWith("ME001", 3);
    });

    it("disminuye la cantidad del producto", async () => {
        mostrarCarrito();
        await userEvent.click(screen.getByRole("button", { name: "Disminuir cantidad de Amoxibay 250mg" }));
        expect(mocks.cambiarCantidad).toHaveBeenCalledWith("ME001", 1);
    });

    it("quita el producto del carrito", async () => {
        mostrarCarrito();
        await userEvent.click(screen.getByRole("button", { name: "Quitar" }));
        expect(mocks.eliminarItem).toHaveBeenCalledWith("ME001");
    });

    it("vacía el carrito", async () => {
        mostrarCarrito();
        await userEvent.click(screen.getByRole("button", { name: "Vaciar carrito" }));
        expect(mocks.vaciarCarrito).toHaveBeenCalledTimes(1);
    });

    it("lleva al checkout al presionar Ir a pagar", async () => {
        mostrarCarrito();
        await userEvent.click(screen.getByRole("button", { name: "Ir a pagar" }));
        expect(mocks.navigate).toHaveBeenCalledWith("/checkout");
    });

    it("muestra los datos de una cita sin botones de cantidad", () => {
        mocks.carrito = [cita];
        mostrarCarrito();
        expect(screen.getByText("Mascota: Firulais (Perro)")).toBeInTheDocument();
        expect(screen.getByText("Tutor: Ana")).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: /Aumentar cantidad/ })).not.toBeInTheDocument();
    });
});