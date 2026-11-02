const AUTH_URL = import.meta.env.VITE_AUTH_URL ?? 'http://localhost:8081'
const TOKEN_KEY = 'token'

export const guardarToken = (token) => localStorage.setItem(TOKEN_KEY, token)
export const obtenerToken = () => localStorage.getItem(TOKEN_KEY)
export const borrarToken = () => localStorage.removeItem(TOKEN_KEY)

const MENSAJES_POR_ESTADO = {
    400: 'Los datos enviados no son válidos.',
    401: 'Correo o contraseña incorrectos.',
    409: 'El correo o el RUN ya están registrados.',
}

async function post(ruta, cuerpo) {
    let respuesta
    try {
        respuesta = await fetch(`${AUTH_URL}${ruta}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cuerpo),
        })
    } catch {
        throw new Error('No se pudo conectar con el servidor. Intenta nuevamente.')
    }

    if (!respuesta.ok) {
        throw new Error(MENSAJES_POR_ESTADO[respuesta.status] ?? 'Ocurrió un error inesperado en el servidor.')
    }
    return respuesta.json()
}

export const apiLogin = (email, password) => post('/api/auth/login', { email, password })

export const apiRegistro = (datos) => post('/api/auth/registro', datos)