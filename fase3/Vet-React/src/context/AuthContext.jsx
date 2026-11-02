import { createContext, useContext, useEffect, useState } from 'react'
import { apiLogin, apiRegistro, guardarToken, obtenerToken, borrarToken } from '../services/authApi'

const AuthContext = createContext(null)

function decodificarToken(token) {
    try {
        const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
        const json = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
                .join('')
        )
        const claims = JSON.parse(json)

        if (claims.exp && claims.exp * 1000 < Date.now()) return null

        return {
            id: claims.id,
            email: claims.sub,
            nombre: claims.nombre ?? claims.sub.split('@')[0],
            role: claims.rol,
            exp: claims.exp,
        }
    } catch {
        return null
    }
}

function cargarSesion() {
    const token = obtenerToken()
    if (!token) return null

    const sesion = decodificarToken(token)
    if (!sesion) borrarToken()
    return sesion
}

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(cargarSesion)

    useEffect(() => {
        if (!usuario?.exp) return
        const cerrarSesion = () => { borrarToken(); setUsuario(null) }
        const restante = usuario.exp * 1000 - Date.now()
        const timer = setTimeout(cerrarSesion, Math.min(Math.max(restante, 0), 2_147_483_647))
        return () => clearTimeout(timer)
    }, [usuario])

    async function login(email, pass) {
        try {
            const { token } = await apiLogin(email.trim().toLowerCase(), pass)
            const sesion = decodificarToken(token)
            if (!sesion) return { ok: false, error: 'No se pudo iniciar sesión. Intenta nuevamente.' }

            guardarToken(token)
            setUsuario(sesion)
            return { ok: true }
        } catch (e) {
            return { ok: false, error: e.message }
        }
    }

    async function registrar(datos) {
        try {
            await apiRegistro({
                run: datos.run.trim().toUpperCase(),
                nombre: datos.nombre.trim(),
                apellidos: datos.apellidos.trim(),
                email: datos.email.trim().toLowerCase(),
                fechaNac: datos.fechaNac,
                region: datos.region,
                comuna: datos.comuna,
                direccion: datos.direccion.trim(),
                password: datos.pass,
            })
            return { ok: true }
        } catch (e) {
            return { ok: false, error: e.message }
        }
    }

    function logout() {
        borrarToken()
        setUsuario(null)
    }

    const primerNombre = usuario ? usuario.nombre.trim().split(/\s+/)[0] : ''

    return (
        <AuthContext.Provider value={{ usuario, primerNombre, login, registrar, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuthContext() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuthContext debe usarse dentro de <AuthProvider>')
    return ctx
}