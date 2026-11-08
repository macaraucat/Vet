const PRODUCTOS_URL = import.meta.env.VITE_PRODUCTOS_URL ?? 'http://localhost:8083'

async function get(ruta) {
    let respuesta
    try {
        respuesta = await fetch(`${PRODUCTOS_URL}${ruta}`)
    } catch {
        throw new Error('No se pudo conectar con el servidor. Intenta nuevamente.')
    }

    if (!respuesta.ok) {
        throw new Error('Ocurrió un error al obtener los productos.')
    }
    return respuesta.json()
}

export const obtenerProductos = () => get('/api/productos')

export const obtenerProductoPorId = (id) => get(`/api/productos/${id}`)