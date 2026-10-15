import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const usuariosPredefinidos = [
    { nombre: 'Admin', email: 'admin@gmail.com', pass: 'admin123', role: 'Administrador' },
    { nombre: 'Funcionario', email: 'func@gmail.com', pass: 'func123', role: 'Funcionario' },
]

function cargarUsuarios() {
    try {
        const guardados = JSON.parse(localStorage.getItem('usuariosDB'))
        if (Array.isArray(guardados)) return guardados
    } catch {
    }
    localStorage.setItem('usuariosDB', JSON.stringify(usuariosPredefinidos))
    return usuariosPredefinidos
}

function cargarSesion() {
    const nombre = localStorage.getItem('usuarioActivo')
    if (!nombre) return null
    return { nombre, role: localStorage.getItem('tipoUsuario') || 'Cliente' }
}

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(cargarSesion)

    function login(email, pass) {
        const correo = email.trim().toLowerCase()
        const encontrado = cargarUsuarios().find((u) => u.email === correo && u.pass === pass)

        if (!encontrado) return { ok: false, error: 'Correo o contraseña incorrectos.' }

        localStorage.setItem('usuarioActivo', encontrado.nombre)
        localStorage.setItem('tipoUsuario', encontrado.role)
        setUsuario({ nombre: encontrado.nombre, role: encontrado.role })
        return { ok: true }
    }

    function registrar(datos) {
        const usuarios = cargarUsuarios()
        const correo = datos.email.trim().toLowerCase()

        if (usuarios.some((u) => u.email === correo)) {
            return { ok: false, error: 'Este correo electrónico ya está registrado.' }
        }

        const nuevo = {
            run: datos.run.toUpperCase(),
            nombre: datos.nombre.trim(),
            email: correo,
            fechaNac: datos.fechaNac,
            comuna: datos.comuna,
            direccion: datos.direccion.trim(),
            pass: datos.pass,
            role: 'Cliente',
        }

        localStorage.setItem('usuariosDB', JSON.stringify([...usuarios, nuevo]))
        return { ok: true }
    }

    function logout() {
        localStorage.removeItem('usuarioActivo')
        localStorage.removeItem('tipoUsuario')
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