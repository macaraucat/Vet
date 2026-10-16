import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import useFormulario from './useFormulario'

const valoresIniciales = { nombre: '', correo: '' }

describe('useFormulario', () => {
    it('inicia con los valores y estados de error vacíos', () => {
        const { result } = renderHook(() => useFormulario(valoresIniciales, {}, vi.fn()))

        expect(result.current.valores).toEqual(valoresIniciales)
        expect(result.current.errores).toEqual({})
        expect(result.current.errorGeneral).toBe('')
    })

    it('actualiza el campo y limpia su error y el error general', () => {
        const { result } = renderHook(() => useFormulario(
            valoresIniciales,
            { nombre: [(valor) => valor ? '' : 'El nombre es obligatorio.'] },
            () => 'No se pudo guardar.',
        ))

        act(() => {
            result.current.handleSubmit({ preventDefault: vi.fn() })
        })
        expect(result.current.errores.nombre).toBe('El nombre es obligatorio.')

        act(() => {
            result.current.handleChange({ target: { name: 'nombre', value: 'Ana' } })
        })
        expect(result.current.valores.nombre).toBe('Ana')
        expect(result.current.errores).toEqual({})
        expect(result.current.errorGeneral).toBe('')
    })

    it('calcula las reglas con los valores actuales y no envía si hay errores', () => {
        const reglas = vi.fn(() => ({
            nombre: [(valor) => valor === 'Ana' ? '' : 'Nombre inválido.'],
        }))
        const alEnviar = vi.fn()
        const { result } = renderHook(() => useFormulario(valoresIniciales, reglas, alEnviar))

        act(() => {
            result.current.handleSubmit({ preventDefault: vi.fn() })
        })

        expect(reglas).toHaveBeenCalledWith(valoresIniciales)
        expect(result.current.errores).toEqual({ nombre: 'Nombre inválido.' })
        expect(alEnviar).not.toHaveBeenCalled()
    })

    it('envía los valores válidos y restablece el formulario', () => {
        const alEnviar = vi.fn(() => '')
        const { result } = renderHook(() => useFormulario(
            valoresIniciales,
            { nombre: [(valor) => valor ? '' : 'El nombre es obligatorio.'] },
            alEnviar,
        ))

        act(() => {
            result.current.handleChange({ target: { name: 'nombre', value: 'Ana' } })
        })
        act(() => {
            result.current.handleSubmit({ preventDefault: vi.fn() })
        })

        expect(alEnviar).toHaveBeenCalledWith({ nombre: 'Ana', correo: '' })
        expect(result.current.valores).toEqual(valoresIniciales)
        expect(result.current.errores).toEqual({})
    })

    it('muestra el error devuelto al enviar sin restablecer los valores', () => {
        const alEnviar = vi.fn(() => 'No se pudo guardar.')
        const { result } = renderHook(() => useFormulario(
            valoresIniciales,
            { nombre: [(valor) => valor ? '' : 'El nombre es obligatorio.'] },
            alEnviar,
        ))

        act(() => {
            result.current.handleChange({ target: { name: 'nombre', value: 'Ana' } })
        })
        act(() => {
            result.current.handleSubmit({ preventDefault: vi.fn() })
        })

        expect(result.current.errorGeneral).toBe('No se pudo guardar.')
        expect(result.current.valores.nombre).toBe('Ana')
    })

    it('limpia los errores de campo y el error general', () => {
        const { result } = renderHook(() => useFormulario(
            valoresIniciales,
            { nombre: [(valor) => valor ? '' : 'El nombre es obligatorio.'] },
            () => 'No se pudo guardar.',
        ))

        act(() => {
            result.current.handleSubmit({ preventDefault: vi.fn() })
        })
        act(() => {
            result.current.handleChange({ target: { name: 'nombre', value: 'Ana' } })
        })
        act(() => {
            result.current.handleSubmit({ preventDefault: vi.fn() })
        })
        expect(result.current.errorGeneral).toBe('No se pudo guardar.')

        act(() => {
            result.current.limpiarErrores()
        })
        expect(result.current.errores).toEqual({})
        expect(result.current.errorGeneral).toBe('')
    })
})
