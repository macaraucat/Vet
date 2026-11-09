import { createContext, useContext, useEffect, useState } from 'react'
import {
    apiLogin, apiRegistro, apiRefresh,
    guardarToken, guardarRefreshToken, obtenerRefreshToken, borrarSesion,
} from '../services/authApi'

const AuthContext = createContext(null)
const MARGEN_RENOVACION = 30_000 // renueva 30 s antes de expirar

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
    const token = localStorage.getItem('token')
    return token ? decodificarToken(token) : null
}

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(cargarSesion)

    function cerrarSesion() {
        borrarSesion()
        setUsuario(null)
    }

    async function renovarSesion() {
        const refreshToken = obtenerRefreshToken()
        if (!refreshToken) { cerrarSesion(); return }

        try {
            const { token, refreshToken: nuevoRefresh } = await apiRefresh(refreshToken)
            const sesion = decodificarToken(token)

            if (sesion) {
                guardarToken(token)
                guardarRefreshToken(nuevoRefresh)
                setUsuario(sesion)
            } else {
                cerrarSesion()
            }
        } catch {
            cerrarSesion()
        }
    }

    useEffect(() => {
        if (!usuario && obtenerRefreshToken()) renovarSesion()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (!usuario?.exp) return
        const espera = Math.min(Math.max(usuario.exp * 1000 - MARGEN_RENOVACION - Date.now(), 0), 2_147_483_647)
        const timer = setTimeout(() => { renovarSesion() }, espera)
        return () => clearTimeout(timer)
    }, [usuario])

    async function login(email, pass) {
        try {
            const { token, refreshToken } = await apiLogin(email.trim().toLowerCase(), pass)
            const sesion = decodificarToken(token)
            if (!sesion) return { ok: false, error: 'No se pudo iniciar sesión. Intenta nuevamente.' }

            guardarToken(token)
            guardarRefreshToken(refreshToken)
            setUsuario(sesion)
            return { ok: true }
        } catch (e) {
            return { ok: false, error: e.message }
        }
    }

    async function registrar(datos) {
        try {
            const { token, refreshToken } = await apiRegistro({
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
            guardarToken(token)
            guardarRefreshToken(refreshToken)
            setUsuario(decodificarToken(token))
            return { ok: true }
        } catch (e) {
            return { ok: false, error: e.message }
        }
    }

    function logout() {
        cerrarSesion()
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