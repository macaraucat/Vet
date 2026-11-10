import { peticion } from './api'

async function get(ruta) {
    const respuesta = await peticion(ruta)
    if (!respuesta.ok) {
        throw new Error('Ocurrió un error al obtener los productos.')
    }
    return respuesta.json()
}

export const obtenerProductos = () => get('/api/v1/productos')
export const obtenerProductoPorId = (id) => get(`/api/v1/productos/${id}`)

export async function crearBoleta(usuarioId, items) {
    const productos = items.filter((item) => item.tipo !== 'cita')

    const cuerpo = {
        usuarioId,
        items: productos.map((item) => ({ productoId: item.id, cantidad: item.cantidad })),
    }

    const respuesta = await peticion('/api/v1/boletas', { method: 'POST', cuerpo, autenticada: true })
    if (!respuesta.ok) {
        throw new Error('No se pudo generar la boleta.')
    }
    return respuesta.json()
}