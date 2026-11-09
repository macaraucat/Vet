import { peticion } from './apiClient'

export async function crearBoleta(usuarioId, items) {
    const cuerpo = {
        usuarioId,
        items: items.map((item) => ({ productoId: item.id, cantidad: item.cantidad })),
    }

    const respuesta = await peticion('/api/boletas', { method: 'POST', cuerpo, autenticada: true })
    if (!respuesta.ok) {
        throw new Error('No se pudo generar la boleta.')
    }
    return respuesta.json()
}