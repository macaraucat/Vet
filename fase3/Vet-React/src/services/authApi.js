import { peticion } from './apiClient'
import { obtenerToken } from './sesion'

export {
    guardarToken, obtenerToken, guardarRefreshToken, obtenerRefreshToken, borrarSesion,
} from './sesion'

const MENSAJES_POR_ESTADO = {
    400: 'Los datos enviados no son válidos.',
    401: 'Correo o contraseña incorrectos.',
    409: 'El correo o el RUN ya están registrados.',
}

export async function apiMe() {
    if (!obtenerToken()) throw new Error('Sin sesión activa.')

    const respuesta = await peticion('/api/v1/users/me', { autenticada: true })
    if (!respuesta.ok) throw new Error('Sesión inválida.')
    return respuesta.json()
}

async function post(ruta, cuerpo) {
    const respuesta = await peticion(ruta, { method: 'POST', cuerpo })
    if (!respuesta.ok) {
        throw new Error(MENSAJES_POR_ESTADO[respuesta.status] ?? 'Ocurrió un error inesperado en el servidor.')
    }
    return respuesta.json()
}

export const apiLogin = (email, password) => post('/api/v1/auth/login', { email, password })
export const apiRegistro = (datos) => post('/api/v1/auth/registro', datos)
export const apiRefresh = (refreshToken) => post('/api/v1/auth/refresh', { refreshToken })