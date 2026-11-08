const PRODUCTOS_URL = import.meta.env.VITE_PRODUCTOS_URL ?? 'http://localhost:8083'

export async function crearBoleta(usuarioId, items) {
    const cuerpo = {
        usuarioId,
        items: items.map((item) => ({ productoId: item.id, cantidad: item.cantidad })),
    }

    let respuesta
    try {
        respuesta = await fetch(`${PRODUCTOS_URL}/api/boletas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cuerpo),
        })
    } catch {
        throw new Error('No se pudo conectar con el servidor.')
    }

    if (!respuesta.ok) {
        throw new Error('No se pudo generar la boleta.')
    }
    return respuesta.json()
}