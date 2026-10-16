import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import Index from "./Index";

const authState = vi.hoisted(() => ({ usuario: null }));

vi.mock("../context/AuthContext", () => ({
    useAuthContext: () => ({ usuario: authState.usuario }),
}));

vi.mock("./Cita", () => ({
    default: ({ mostrar, onCerrar }) => (
        mostrar ? (
            <div role="dialog" aria-label="Agendar cita">
                <button onClick={onCerrar}>Cerrar cita</button>
            </div>
        ) : null
    ),
}));

function UbicacionActual() {
    const location = useLocation();
    return <output aria-label="Ruta actual">{location.pathname}</output>;
}

function mostrarIndex() {
    return render(
        <MemoryRouter initialEntries={["/"]}>
            <Routes>
                <Route path="/" element={<><Index /><UbicacionActual /></>} />
                <Route path="/login" element={<p>Página de inicio de sesión</p>} />
            </Routes>
        </MemoryRouter>,
    );
}

describe("Index", () => {
    beforeEach(() => {
        authState.usuario = null;
    });

    it("muestra las secciones principales de la página", () => {
        mostrarIndex();

        expect(screen.getByRole("heading", { name: "Cuidado cercano y profesional" })).toBeInTheDocument();
        expect(screen.getByRole("heading", { name: "Nuestros servicios" })).toBeInTheDocument();
        expect(screen.getByRole("heading", { name: "Sobre nosotros" })).toBeInTheDocument();
        expect(screen.getByRole("heading", { name: "Noticias importantes" })).toBeInTheDocument();
    });

    it("navega al login cuando un visitante intenta agendar una cita", async () => {
        mostrarIndex();

        await userEvent.click(screen.getByRole("button", { name: "Agendar cita" }));

        expect(screen.getByText("Página de inicio de sesión")).toBeInTheDocument();
    });

    it("navega al login cuando un usuario que no es cliente intenta agendar", async () => {
        authState.usuario = { nombre: "Admin", role: "Administrador" };
        mostrarIndex();

        await userEvent.click(screen.getByRole("button", { name: "Agendar cita" }));

        expect(screen.getByText("Página de inicio de sesión")).toBeInTheDocument();
    });

    it("permite que un cliente abra y cierre el formulario de cita", async () => {
        authState.usuario = { nombre: "Ana", role: "Cliente" };
        mostrarIndex();

        await userEvent.click(screen.getByRole("button", { name: "Agendar cita" }));
        expect(screen.getByRole("dialog", { name: "Agendar cita" })).toBeInTheDocument();

        await userEvent.click(screen.getByRole("button", { name: "Cerrar cita" }));
        expect(screen.queryByRole("dialog", { name: "Agendar cita" })).not.toBeInTheDocument();
    });

    it("expande y contrae el contenido de una noticia", async () => {
        mostrarIndex();

        await userEvent.click(screen.getAllByRole("button", { name: "Expandir" })[0]);
        expect(screen.getByText(/Nuestro equipo médico actuó rápido/)).toBeInTheDocument();

        await userEvent.click(screen.getByRole("button", { name: "Contraer" }));
        expect(screen.queryByText(/Nuestro equipo médico actuó rápido/)).not.toBeInTheDocument();
    });
});
