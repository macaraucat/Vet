import { peticion } from './api'

async function get(ruta) {
    const respuesta = await peticion(ruta)
    if (!respuesta.ok) {
        throw new Error('Ocurrió un error al obtener los productos.')
    }
    return respuesta.json()
}

const CODIGO_CONSULTA = 'CONSULTA'

export const obtenerProductos = () =>
    get('/api/v1/productos').then((lista) => lista.filter((p) => p.codigo !== CODIGO_CONSULTA))
export const obtenerProductoPorId = (id) => get(`/api/v1/productos/${id}`)

export async function crearBoleta(usuarioId, items) {
    const productos = items.filter((item) => item.tipo !== 'cita')
    const citas = items.filter((item) => item.tipo === 'cita')

    const lineas = productos.map((item) => ({ productoId: item.id, cantidad: item.cantidad }))

    if (citas.length > 0) {
        const todos = await get('/api/v1/productos')
        const consulta = todos.find((p) => p.codigo === CODIGO_CONSULTA)
        if (!consulta) {
            throw new Error('No se encontró el servicio de consulta.')
        }
        lineas.push({ productoId: consulta.id, cantidad: citas.reduce((total, c) => total + c.cantidad, 0) })
    }

    const cuerpo = { usuarioId, items: lineas }

    const respuesta = await peticion('/api/v1/boletas', { method: 'POST', cuerpo, autenticada: true })
    if (!respuesta.ok) {
        throw new Error('No se pudo generar la boleta.')
    }
    return respuesta.json()
}