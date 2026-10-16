import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Footer from './Footer'

vi.mock('./Mapa', () => ({
    default: () => <div data-testid="mapa-ubicacion" />,
}))

describe('Footer', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('muestra horarios, ubicación, valor de consulta y derechos de autor', () => {
        render(<Footer />)

        expect(screen.getByRole('contentinfo')).toHaveAttribute('id', 'contacto')
        expect(screen.getByText('Horario Tienda')).toBeInTheDocument()
        expect(screen.getByText('Horario Consulta')).toBeInTheDocument()
        expect(screen.getByText('Recreo 26, Rancagua, Región de O\'Higgins')).toBeInTheDocument()
        expect(screen.getByText('Valor de la consulta $15.000')).toBeInTheDocument()
        expect(screen.getByText(/Veterinaria San Marcos 2026/)).toBeInTheDocument()
        expect(screen.getByTestId('mapa-ubicacion')).toBeInTheDocument()
    })

    it('muestra errores de validación al enviar el formulario vacío', async () => {
        render(<Footer />)

        await userEvent.click(screen.getByRole('button', { name: 'Enviar mensaje' }))

        expect(screen.getByText('El asunto es obligatorio.')).toBeInTheDocument()
        expect(screen.getByText('El correo es obligatorio.')).toBeInTheDocument()
        expect(screen.getByText('El mensaje es obligatorio.')).toBeInTheDocument()
    })

    it('rechaza correos fuera de los dominios permitidos', async () => {
        render(<Footer />)

        await userEvent.type(screen.getByLabelText('Asunto'), 'Consulta')
        await userEvent.type(screen.getByLabelText('Correo'), 'persona@ejemplo.com')
        await userEvent.type(screen.getByLabelText('Mensaje'), 'Necesito información')
        await userEvent.click(screen.getByRole('button', { name: 'Enviar mensaje' }))

        expect(screen.getByText('Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com.')).toBeInTheDocument()
        expect(screen.queryByText('¡Mensaje enviado!')).not.toBeInTheDocument()
    })

    it('confirma el envío con datos válidos y limpia los campos', async () => {
        render(<Footer />)

        await userEvent.type(screen.getByLabelText('Asunto'), 'Consulta de atención')
        await userEvent.type(screen.getByLabelText('Correo'), 'persona@gmail.com')
        await userEvent.type(screen.getByLabelText('Mensaje'), 'Quisiera conocer sus horarios.')
        await userEvent.click(screen.getByRole('button', { name: 'Enviar mensaje' }))

        expect(screen.getByText('¡Mensaje enviado!')).toBeInTheDocument()
        expect(screen.getByLabelText('Asunto')).toHaveValue('')
        expect(screen.getByLabelText('Correo')).toHaveValue('')
        expect(screen.getByLabelText('Mensaje')).toHaveValue('')
    })

    it('oculta la confirmación cuando el usuario vuelve a editar el formulario', async () => {
        render(<Footer />)

        await userEvent.type(screen.getByLabelText('Asunto'), 'Consulta')
        await userEvent.type(screen.getByLabelText('Correo'), 'persona@gmail.com')
        await userEvent.type(screen.getByLabelText('Mensaje'), 'Tengo una pregunta.')
        await userEvent.click(screen.getByRole('button', { name: 'Enviar mensaje' }))
        expect(screen.getByText('¡Mensaje enviado!')).toBeInTheDocument()

        await userEvent.type(screen.getByLabelText('Asunto'), 'Otra consulta')

        expect(screen.queryByText('¡Mensaje enviado!')).not.toBeInTheDocument()
    })
})
