import { useEffect, useState } from 'react'
import { useAuthContext } from '../context/AuthContext'
import { peticion } from '../services/api'

function useAdmin() {
    const { usuario, logout } = useAuthContext()
    const esAdministrador = usuario?.role === 'ADMINISTRADOR'

    const [productos, setProductos] = useState([])
    const [categorias, setCategorias] = useState([])
    const [productoSeleccionado, setProductoSeleccionado] = useState(null)
    const [productoForm, setProductoForm] = useState({})

    const [usuarios, setUsuarios] = useState([])
    const [cargandoUsuarios, setCargandoUsuarios] = useState(true)
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null)
    const [usuarioForm, setUsuarioForm] = useState({})

    const [ordenes, setOrdenes] = useState([])
    const [cargandoOrdenes, setCargandoOrdenes] = useState(false)
    const [detalleOrden, setDetalleOrden] = useState(null)

    const [modal, setModal] = useState(null)
    const [feedback, setFeedback] = useState(null)

    async function api(ruta, opciones = {}) {
        const res = await peticion(ruta, { ...opciones, autenticada: true })
        if (res.status === 401) logout()
        return res
    }

    async function cargarProductos() {
        try {
            const [resP, resC] = await Promise.all([api('/api/v1/productos'), api('/api/v1/categorias')])
            if (!resP.ok || !resC.ok) throw new Error()
            setProductos(await resP.json())
            setCategorias(await resC.json())
        } catch {
            setFeedback({ variant: 'danger', message: 'No se pudieron cargar los productos.' })
        }
    }

    useEffect(() => { cargarProductos() }, [])

    function abrirProducto(modo) {
        if (modo === 'modificar') {
            const p = productos.find((x) => x.id === productoSeleccionado)
            if (!p) {
                setFeedback({ variant: 'warning', message: 'Seleccione un único producto para modificar.' })
                return
            }
            setProductoForm({
                codigo: p.codigo,
                nombre: p.nombre,
                detalle: p.detalle,
                especie: p.especie,
                precio: p.precio,
                imagen: p.imagen ?? '',
                categoriaId: p.categoria?.id ?? '',
            })
        } else {
            setProductoForm({ codigo: '', nombre: '', detalle: '', especie: 'Perro / Gato', precio: '', imagen: '', categoriaId: '' })
        }
        setFeedback(null)
        setModal({ tipo: 'producto', modo })
    }

    async function guardarProducto(event) {
        event.preventDefault()
        const esEditar = modal.modo === 'modificar'
        const body = {
            codigo: productoForm.codigo.trim(),
            nombre: productoForm.nombre.trim(),
            detalle: productoForm.detalle.trim(),
            especie: productoForm.especie,
            precio: Number(productoForm.precio),
            imagen: productoForm.imagen.trim(),
            categoria: { id: Number(productoForm.categoriaId) },
        }
        try {
            const url = esEditar ? `/api/v1/productos/${productoSeleccionado}` : '/api/v1/productos'
            const res = await api(url, { method: esEditar ? 'PUT' : 'POST', cuerpo: body })
            if (!res.ok) {
                setFeedback({ variant: 'danger', message: 'No se pudo guardar el producto.' })
                return
            }
            setFeedback({ variant: 'success', message: esEditar ? 'Producto modificado.' : 'Producto agregado.' })
            setProductoSeleccionado(null)
            setModal(null)
            await cargarProductos()
        } catch {
            setFeedback({ variant: 'danger', message: 'Error de conexión.' })
        }
    }

    async function eliminarProducto() {
        if (productoSeleccionado === null) return
        try {
            const res = await api(`/api/v1/productos/${productoSeleccionado}`, { method: 'DELETE' })
            if (!res.ok) {
                setFeedback({ variant: 'danger', message: 'No se pudo eliminar el producto.' })
                return
            }
            setProductoSeleccionado(null)
            setFeedback({ variant: 'success', message: 'Producto eliminado.' })
            await cargarProductos()
        } catch {
            setFeedback({ variant: 'danger', message: 'Error de conexión.' })
        }
    }

    async function cargarUsuarios() {
        setCargandoUsuarios(true)
        try {
            const res = await api('/api/v1/users')
            if (!res.ok) throw new Error()
            setUsuarios(await res.json())
        } catch {
            setFeedback({ variant: 'danger', message: 'No se pudieron cargar los usuarios.' })
        } finally {
            setCargandoUsuarios(false)
        }
    }

    useEffect(() => {
        if (esAdministrador) cargarUsuarios()
        else setCargandoUsuarios(false)
    }, [esAdministrador])

    function agregarUsuario() {
        setUsuarioForm({ run: '', nombre: '', apellidos: '', email: '', fechaNac: '', region: '', comuna: '', direccion: '', rol: '', password: '' })
        setFeedback(null)
        setModal({ tipo: 'usuario', modo: 'agregar' })
    }

    function modificarUsuario() {
        const u = usuarios.find((x) => x.id === usuarioSeleccionado)
        if (!u) {
            setFeedback({ variant: 'warning', message: 'Seleccione un único usuario para modificar.' })
            return
        }
        setUsuarioForm({ ...u, password: '' })
        setFeedback(null)
        setModal({ tipo: 'usuario', modo: 'modificar' })
    }

    async function guardarUsuario(event) {
        event.preventDefault()
        const esEditar = modal.modo === 'modificar'
        const body = {
            run: usuarioForm.run.trim(),
            nombre: usuarioForm.nombre.trim(),
            apellidos: usuarioForm.apellidos.trim(),
            email: usuarioForm.email.trim(),
            fechaNac: usuarioForm.fechaNac,
            region: usuarioForm.region,
            comuna: usuarioForm.comuna,
            direccion: usuarioForm.direccion.trim(),
            rol: usuarioForm.rol,
            password: usuarioForm.password || null,
        }
        try {
            const url = esEditar ? `/api/v1/users/${usuarioSeleccionado}` : '/api/v1/users'
            const res = await api(url, { method: esEditar ? 'PUT' : 'POST', cuerpo: body })
            if (!res.ok) {
                const err = await res.json().catch(() => null)
                setFeedback({ variant: 'danger', message: err?.message || 'No se pudo guardar el usuario.' })
                return
            }
            setFeedback({ variant: 'success', message: esEditar ? 'Usuario modificado.' : 'Usuario agregado.' })
            setUsuarioSeleccionado(null)
            setModal(null)
            await cargarUsuarios()
        } catch {
            setFeedback({ variant: 'danger', message: 'Error de conexión.' })
        }
    }

    async function eliminarUsuario() {
        if (usuarioSeleccionado === null) return
        try {
            const res = await api(`/api/v1/users/${usuarioSeleccionado}`, { method: 'DELETE' })
            if (!res.ok) {
                const err = await res.json().catch(() => null)
                setFeedback({ variant: 'danger', message: err?.message || 'No se pudo eliminar el usuario.' })
                return
            }
            setUsuarioSeleccionado(null)
            setFeedback({ variant: 'success', message: 'Usuario eliminado.' })
            await cargarUsuarios()
        } catch {
            setFeedback({ variant: 'danger', message: 'Error de conexión.' })
        }
    }

    async function cargarOrdenes() {
        setCargandoOrdenes(true)
        try {
            const res = await api('/api/v1/boletas')
            if (!res.ok) throw new Error()
            setOrdenes(await res.json())
        } catch {
            setFeedback({ variant: 'danger', message: 'No se pudieron cargar las órdenes.' })
        } finally {
            setCargandoOrdenes(false)
        }
    }

    useEffect(() => { cargarOrdenes() }, [])

    async function verDetalleOrden(id) {
        try {
            const res = await api(`/api/v1/boletas/${id}/detalle`)
            if (!res.ok) throw new Error()
            setDetalleOrden({ id, items: await res.json() })
        } catch {
            setFeedback({ variant: 'danger', message: 'No se pudo cargar el detalle.' })
        }
    }

    return {
        productos, categorias, productoSeleccionado, setProductoSeleccionado, productoForm, setProductoForm,
        abrirProducto, guardarProducto, eliminarProducto,
        usuarios, cargandoUsuarios, usuarioSeleccionado, setUsuarioSeleccionado, usuarioForm, setUsuarioForm,
        agregarUsuario, modificarUsuario, guardarUsuario, eliminarUsuario,
        ordenes, cargandoOrdenes, detalleOrden, setDetalleOrden, verDetalleOrden,
        modal, setModal, feedback, setFeedback,
    }
}

export default useAdmin