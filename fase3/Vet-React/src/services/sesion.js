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