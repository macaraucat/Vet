export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

const TOKEN_KEY = 'token'
const REFRESH_KEY = 'refreshToken'

export const guardarToken = (token) => localStorage.setItem(TOKEN_KEY, token)
export const obtenerToken = () => localStorage.getItem(TOKEN_KEY)
export const guardarRefreshToken = (token) => localStorage.setItem(REFRESH_KEY, token)
export const obtenerRefreshToken = () => localStorage.getItem(REFRESH_KEY)
export const borrarSesion = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_KEY)
}

export async function peticion(ruta, { method = 'GET', cuerpo, autenticada = false } = {}) {
    const headers = {}
    if (cuerpo !== undefined) headers['Content-Type'] = 'application/json'

    const token = obtenerToken()
    if (autenticada && token) headers.Authorization = `Bearer ${token}`

    try {
        return await fetch(`${API_URL}${ruta}`, {
            method,
            headers,
            body: cuerpo !== undefined ? JSON.stringify(cuerpo) : undefined,
        })
    } catch {
        throw new Error('No se pudo conectar con el servidor. Intenta nuevamente.')
    }
}