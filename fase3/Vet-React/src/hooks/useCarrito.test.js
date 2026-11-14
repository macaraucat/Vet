import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCarrito } from './useCarrito'

describe('useCarrito', () => {
    beforeEach(() => {
        localStorage.clear()
    })

    it('agregar el mismo producto dos veces suma cantidad, no duplica fila', () => {
        const { result } = renderHook(() => useCarrito())

        act(() => result.current.agregarAlCarrito(1, 'Pelota', 5000, 'pelota.png'))
        act(() => result.current.agregarAlCarrito(1, 'Pelota', 5000, 'pelota.png'))

        expect(result.current.carrito).toHaveLength(1)
        expect(result.current.carrito[0].cantidad).toBe(2)
    })

    it('calcula el total sumando precio por cantidad de cada ítem', () => {
        const { result } = renderHook(() => useCarrito())

        act(() => result.current.agregarAlCarrito(1, 'Pelota', 5000, 'pelota.png'))
        act(() => result.current.agregarAlCarrito(2, 'Correa', 8000, 'correa.png'))
        act(() => result.current.cambiarCantidad(1, 3))

        expect(result.current.totalPrecio).toBe(5000 * 3 + 8000)
    })

    it('eliminarItem quita solo el producto indicado', () => {
        const { result } = renderHook(() => useCarrito())

        act(() => result.current.agregarAlCarrito(1, 'Pelota', 5000, 'pelota.png'))
        act(() => result.current.agregarAlCarrito(2, 'Correa', 8000, 'correa.png'))
        act(() => result.current.eliminarItem(1))

        expect(result.current.carrito).toHaveLength(1)
        expect(result.current.carrito[0].id).toBe(2)
    })
})