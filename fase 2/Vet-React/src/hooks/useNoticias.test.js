import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import useNoticias from './useNoticias'

describe('useNoticias', () => {
    it('devuelve las noticias y comienza con todas contraídas', () => {
        const { result } = renderHook(() => useNoticias())

        expect(result.current.noticias).toHaveLength(2)
        expect(result.current.noticias[0]).toMatchObject({
            titulo: 'Una cirugía de emergencia con final feliz',
            img: '/img/firulais.jpg',
            alt: 'Firulais',
        })
        expect(result.current.noticias[1]).toMatchObject({
            titulo: 'Problemas dentales en conejos',
            img: '/img/conejo.jpg',
            alt: 'Conejo',
        })
        expect(result.current.expandido).toEqual({})
    })

    it('expande una noticia sin cambiar las demás', () => {
        const { result } = renderHook(() => useNoticias())

        act(() => {
            result.current.toggleExpandir(0)
        })

        expect(result.current.expandido).toEqual({ 0: true })
    })

    it('contrae una noticia al volver a alternarla', () => {
        const { result } = renderHook(() => useNoticias())

        act(() => {
            result.current.toggleExpandir(1)
            result.current.toggleExpandir(1)
        })

        expect(result.current.expandido).toEqual({ 1: false })
    })

    it('mantiene de forma independiente los cambios de varias noticias', () => {
        const { result } = renderHook(() => useNoticias())

        act(() => {
            result.current.toggleExpandir(0)
            result.current.toggleExpandir(1)
            result.current.toggleExpandir(0)
        })

        expect(result.current.expandido).toEqual({ 0: false, 1: true })
    })
})
