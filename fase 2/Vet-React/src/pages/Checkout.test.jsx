import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Checkout from "./Checkout";

const mocks = vi.hoisted(() => ({
    carrito: [],
    usuario: null,
    vaciarCarrito: vi.fn(),
}));

vi.mock("../context/CarritoContext", () => ({
    useCarritoContext: () => ({
        carrito: mocks.carrito,
        totalPrecio: 4200,
        vaciarCarrito: mocks.vaciarCarrito,
    }),
}));

vi.mock("../context/AuthContext", () => ({
    useAuthContext: () => ({ usuario: mocks.usuario }),
}));

const producto = { id: "ME001", nombre: "Amoxibay 250mg", precio: 4200, cantidad: 1 };

const mostrarCheckout = () => render(<MemoryRouter><Checkout /></MemoryRouter>);

const elegirRetiro = async () => {
    await userEvent.selectOptions(screen.getByDisplayValue("Despacho a domicilio"), "Retiro en tienda");
};

const llenarDatosCliente = async () => {
    const [nombre, apellidos, correo] = screen.getAllByRole("textbox");
    await userEvent.type(nombre, "Ana");
    await userEvent.type(apellidos, "Pérez");
    await userEvent.type(correo, "ana@gmail.com");
};

describe("Checkout", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        mocks.carrito = [producto];
        mocks.usuario = null;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("avisa que el carrito está vacío", () => {
        mocks.carrito = [];
        mostrarCheckout();
        expect(screen.getByText("Tu carrito está vacío.")).toBeInTheDocument();
    });

    it("muestra errores al pagar con el formulario vacío", async () => {
        mostrarCheckout();
        await userEvent.click(screen.getByRole("button", { name: /Pagar ahora/ }));
        expect(screen.getByText("El nombre es obligatorio.")).toBeInTheDocument();
        expect(screen.getByText("El correo es obligatorio.")).toBeInTheDocument();
        expect(screen.getByText("La calle es obligatoria.")).toBeInTheDocument();
    });

    it("rechaza un correo con dominio no permitido", async () => {
        mostrarCheckout();
        await userEvent.type(screen.getAllByRole("textbox")[2], "a@yahoo.com");
        await userEvent.click(screen.getByRole("button", { name: /Pagar ahora/ }));
        expect(screen.getByText("Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com.")).toBeInTheDocument();
    });

    it("oculta la dirección si se elige retiro en tienda", async () => {
        mostrarCheckout();
        expect(screen.getByText("Dirección de entrega")).toBeInTheDocument();
        await elegirRetiro();
        expect(screen.queryByText("Dirección de entrega")).not.toBeInTheDocument();
    });

    it("completa los datos si hay una sesión iniciada", () => {
        localStorage.setItem("usuariosDB", JSON.stringify([
            { nombre: "Ana", email: "ana@gmail.com", direccion: "Calle 1", comuna: "Rancagua" },
        ]));
        mocks.usuario = { nombre: "Ana" };
        mostrarCheckout();
        expect(screen.getByDisplayValue("ana@gmail.com")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Calle 1")).toBeInTheDocument();
    });

    it("muestra la compra exitosa y vacía el carrito", async () => {
        vi.spyOn(Math, "random").mockReturnValue(0.5);
        mostrarCheckout();
        await elegirRetiro();
        await llenarDatosCliente();
        await userEvent.click(screen.getByRole("button", { name: /Pagar ahora/ }));
        expect(screen.getByText(/Se ha realizado la compra/)).toBeInTheDocument();
        expect(mocks.vaciarCarrito).toHaveBeenCalledTimes(1);
    });

    it("muestra el error de pago y permite reintentar sin vaciar el carrito", async () => {
        vi.spyOn(Math, "random").mockReturnValue(0.1);
        mostrarCheckout();
        await elegirRetiro();
        await llenarDatosCliente();
        await userEvent.click(screen.getByRole("button", { name: /Pagar ahora/ }));
        expect(screen.getByText(/No se pudo realizar el pago/)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Volver a realizar el pago" })).toBeInTheDocument();
        expect(mocks.vaciarCarrito).not.toHaveBeenCalled();
    });
});