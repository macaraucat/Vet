import { peticion } from './apiClient'

async function get(ruta) {
    const respuesta = await peticion(ruta)
    if (!respuesta.ok) {
        throw new Error('Ocurrió un error al obtener los productos.')
    }
    return respuesta.json()
}

export const obtenerProductos = () => get('/api/productos')
export const obtenerProductoPorId = (id) => get(`/api/productos/${id}`)