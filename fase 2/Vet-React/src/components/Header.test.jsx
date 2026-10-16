import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Header from './Header'

const mocks = vi.hoisted(() => ({
    navigate: vi.fn(),
    logout: vi.fn(),
    usuario: null,
    primerNombre: '',
    totalItems: 0,
}))

vi.mock('react-router-dom', async (importOriginal) => ({
    ...(await importOriginal()),
    useNavigate: () => mocks.navigate,
}))

vi.mock('../context/AuthContext', () => ({
    useAuthContext: () => ({
        usuario: mocks.usuario,
        primerNombre: mocks.primerNombre,
        logout: mocks.logout,
    }),
}))

vi.mock('../context/CarritoContext', () => ({
    useCarritoContext: () => ({ totalItems: mocks.totalItems }),
}))

const renderHeader = () => render(<MemoryRouter><Header /></MemoryRouter>)

const loguear = (role, nombre = 'Ana Pérez') => {
    mocks.usuario = { nombre, role }
    mocks.primerNombre = nombre.split(' ')[0]
}

describe('Header', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mocks.usuario = null
        mocks.primerNombre = ''
        mocks.totalItems = 0
        window.scrollTo = vi.fn()
    })

    describe('marca y navegación', () => {
        it('muestra el logo y el nombre de la veterinaria enlazados al inicio', () => {
            renderHeader()
            const marca = screen.getByRole('link', { name: /veterinaria san marcos/i })
            expect(marca).toHaveAttribute('href', '/')
            expect(screen.getByAltText('Logo Veterinaria San Marcos')).toBeInTheDocument()
        })

        it('muestra los enlaces principales con su destino', () => {
            renderHeader()
            expect(screen.getByRole('link', { name: 'Catálogo' })).toHaveAttribute('href', '/catalogo')
            expect(screen.getByRole('link', { name: 'Nosotros' })).toHaveAttribute('href', '/#nosotros')
            expect(screen.getByRole('link', { name: 'Blogs' })).toHaveAttribute('href', '/#noticias')
            expect(screen.getByRole('link', { name: 'Contacto' })).toHaveAttribute('href', '#contacto')
        })

        it('hace scroll al inicio al hacer clic en la marca', async () => {
            renderHeader()
            await userEvent.click(screen.getByRole('link', { name: /veterinaria san marcos/i }))
            expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
        })

        it('hace scroll al inicio al hacer clic en Catálogo', async () => {
            renderHeader()
            await userEvent.click(screen.getByRole('link', { name: 'Catálogo' }))
            expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
        })
    })

    describe('sin sesión iniciada', () => {
        it('muestra el enlace para iniciar sesión', () => {
            renderHeader()
            expect(screen.getByRole('link', { name: 'Iniciar sesión' })).toHaveAttribute('href', '/login')
        })

        it('no muestra el saludo ni el botón de cerrar sesión', () => {
            renderHeader()
            expect(screen.queryByText(/Hola,/)).not.toBeInTheDocument()
            expect(screen.queryByRole('button', { name: 'Cerrar sesión' })).not.toBeInTheDocument()
        })
    })

    describe('con sesión iniciada', () => {
        it('muestra el saludo con el primer nombre', () => {
            loguear('Cliente')
            renderHeader()
            expect(screen.getByText('Hola, Ana')).toBeInTheDocument()
        })

        it('reemplaza el enlace de login por el botón de cerrar sesión', () => {
            loguear('Cliente')
            renderHeader()
            expect(screen.queryByRole('link', { name: 'Iniciar sesión' })).not.toBeInTheDocument()
            expect(screen.getByRole('button', { name: 'Cerrar sesión' })).toBeInTheDocument()
        })

        it('cierra sesión y redirige a /login', async () => {
            loguear('Cliente')
            renderHeader()
            await userEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }))
            expect(mocks.logout).toHaveBeenCalledTimes(1)
            expect(mocks.navigate).toHaveBeenCalledWith('/login')
        })
    })

    describe('enlace de administración', () => {
        it.each(['Funcionario', 'Administrador'])('se muestra para el rol %s', (role) => {
            loguear(role)
            renderHeader()
            expect(screen.getByRole('link', { name: 'Administración' })).toHaveAttribute('href', '/admin')
        })

        it('no se muestra para un Cliente', () => {
            loguear('Cliente')
            renderHeader()
            expect(screen.queryByRole('link', { name: 'Administración' })).not.toBeInTheDocument()
        })

        it('no se muestra sin sesión', () => {
            renderHeader()
            expect(screen.queryByRole('link', { name: 'Administración' })).not.toBeInTheDocument()
        })
    })

    describe('carrito', () => {
        it('enlaza a /carrito', () => {
            renderHeader()
            expect(screen.getByRole('link', { name: /carrito/i })).toHaveAttribute('href', '/carrito')
        })

        it('muestra la cantidad de items en el badge', () => {
            mocks.totalItems = 5
            renderHeader()
            expect(screen.getByRole('link', { name: /carrito/i })).toHaveTextContent('5')
        })
    })

    describe('menú móvil', () => {
        it('alterna la etiqueta del botón al abrir y cerrar', async () => {
            renderHeader()
            await userEvent.click(screen.getByRole('button', { name: 'Abrir menú' }))
            expect(screen.getByRole('button', { name: 'Cerrar menú' })).toBeInTheDocument()

            await userEvent.click(screen.getByRole('button', { name: 'Cerrar menú' }))
            expect(screen.getByRole('button', { name: 'Abrir menú' })).toBeInTheDocument()
        })

        it('se cierra al seleccionar un enlace', async () => {
            renderHeader()
            await userEvent.click(screen.getByRole('button', { name: 'Abrir menú' }))
            await userEvent.click(screen.getByRole('link', { name: 'Catálogo' }))
            expect(screen.getByRole('button', { name: 'Abrir menú' })).toBeInTheDocument()
        })
    })
})