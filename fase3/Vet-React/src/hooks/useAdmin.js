import { useEffect, useState } from 'react'
import { productos } from '../utils/productos'

const API_URL = 'http://localhost:8080/auth/usuarios'

const stockInicial = [45, 30, 28, 60, 40, 35, 80, 50, 55, 30, 25, 20, 18, 40, 35, 15, 22, 48, 60, 36, 30, 25]

const productosIniciales = productos.map((producto, index) => ({
    sku: producto.id,
    nombre: producto.nombre,
    descripcion: `${producto.detalle}. Uso en ${producto.especie}.`,
    precio: producto.precio,
    stock: stockInicial[index],
    categoria: producto.categoria,
}))

const citasIniciales = [
    { id: 1, fecha: '2026-10-15', hora: '10:00', nombreMascota: 'Luna', especie: 'Perro', raza: 'Golden Retriever', edad: 4, nombreTutor: 'Camila Rojas', estado: 'Pendiente' },
    { id: 2, fecha: '2026-10-16', hora: '11:00', nombreMascota: 'Michi', especie: 'Gato', raza: 'Doméstico de pelo corto', edad: 2, nombreTutor: 'Javier Soto', estado: 'Confirmada' },
    { id: 3, fecha: '2026-10-17', hora: '12:00', nombreMascota: 'Coco', especie: 'Conejo', raza: 'Cabeza de león', edad: 1, nombreTutor: 'Fernanda Díaz', estado: 'Pendiente' },
    { id: 4, fecha: '2026-10-19', hora: '15:00', nombreMascota: 'Rocky', especie: 'Perro', raza: 'Mestizo', edad: 7, nombreTutor: 'Diego Pérez', estado: 'Anulada' },
    { id: 5, fecha: '2026-10-20', hora: '16:00', nombreMascota: 'Kiwi', especie: 'Ave', raza: 'Cotorra', edad: 3, nombreTutor: 'Valentina Muñoz', estado: 'Pendiente' },
]

function useAdmin() {
    const [productosAdmin, setProductosAdmin] = useState(productosIniciales)
    const [usuarios, setUsuarios] = useState([])
    const [cargandoUsuarios, setCargandoUsuarios] = useState(true)
    const [citas, setCitas] = useState(citasIniciales)
    const [productoSeleccionado, setProductoSeleccionado] = useState(null)
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null)
    const [citaSeleccionada, setCitaSeleccionada] = useState(null)
    const [citaForm, setCitaForm] = useState({})
    const [modal, setModal] = useState(null)
    const [productoForm, setProductoForm] = useState({})
    const [usuarioForm, setUsuarioForm] = useState({})
    const [feedback, setFeedback] = useState(null)

    function abrirProducto(modo) {
        if (modo === 'modificar') {
            const seleccionado = productosAdmin.find((producto) => producto.sku === productoSeleccionado)
            if (!seleccionado) {
                setFeedback({ variant: 'warning', message: 'Seleccione un único producto para modificar.' })
                return
            }
            setProductoForm({ ...seleccionado })
        } else {
            setProductoForm({ sku: '', nombre: '', descripcion: '', precio: '', stock: '', categoria: '' })
        }
        setFeedback(null)
        setModal({
            tipo: 'producto',
            modo,
            ...(modo === 'modificar' ? { skuOriginal: productoSeleccionado } : {}),
        })
    }

    function guardarProducto(event) {
        event.preventDefault()
        const datos = {
            ...productoForm,
            sku: productoForm.sku.trim(),
            nombre: productoForm.nombre.trim(),
            descripcion: productoForm.descripcion.trim(),
            precio: Number(productoForm.precio),
            stock: Number(productoForm.stock),
        }
        const skuEnUso = productosAdmin.some((producto) => producto.sku === datos.sku && (modal.modo === 'agregar' || producto.sku !== modal.skuOriginal))
        if (skuEnUso) {
            setFeedback({ variant: 'warning', message: 'Ya existe un producto con ese código SKU.' })
            return
        }

        if (modal.modo === 'agregar') {
            setProductosAdmin((actuales) => [...actuales, datos])
            setFeedback({ variant: 'success', message: 'Producto agregado correctamente.' })
        } else {
            setProductosAdmin((actuales) => actuales.map((producto) => producto.sku === modal.skuOriginal ? datos : producto))
            setFeedback({ variant: 'success', message: 'Producto modificado correctamente.' })
        }
        setProductoSeleccionado(null)
        setModal(null)
    }

    function eliminarProducto() {
        if (productoSeleccionado === null) return
        setProductosAdmin((actuales) => actuales.filter((producto) => producto.sku !== productoSeleccionado))
        setProductoSeleccionado(null)
        setFeedback({ variant: 'success', message: 'Producto eliminado correctamente.' })
    }

    function authHeaders() {
        const token = localStorage.getItem('token')
        return token ? { Authorization: `Bearer ${token}` } : {}
    }

    async function cargarUsuarios() {
        setCargandoUsuarios(true)
        try {
            const res = await fetch(API_URL, { headers: authHeaders() })
            if (!res.ok) throw new Error('Error al consultar usuarios')
            const datos = await res.json()
            setUsuarios(datos)
        } catch {
            setFeedback({ variant: 'danger', message: 'No se pudieron cargar los usuarios desde el servidor.' })
        } finally {
            setCargandoUsuarios(false)
        }
    }

    useEffect(() => {
        cargarUsuarios()
    }, [])

    function agregarUsuario() {
        setUsuarioForm({ run: '', nombre: '', apellidos: '', email: '', fechaNac: '', region: '', comuna: '', direccion: '', rol: '', password: '' })
        setFeedback(null)
        setModal({ tipo: 'usuario', modo: 'agregar' })
    }

    function modificarUsuario() {
        const seleccionado = usuarios.find((user) => user.id === usuarioSeleccionado)
        if (!seleccionado) {
            setFeedback({ variant: 'warning', message: 'Seleccione un único usuario para modificar.' })
            return
        }
        setUsuarioForm({ ...seleccionado, password: '' })
        setFeedback(null)
        setModal({ tipo: 'usuario', modo: 'modificar', idOriginal: usuarioSeleccionado })
    }

    async function guardarUsuario(event) {
        event.preventDefault()
        const esModificar = modal.modo === 'modificar'
        const body = {
            run: usuarioForm.run.trim(),
            nombre: usuarioForm.nombre.trim(),
            apellidos: usuarioForm.apellidos.trim(),
            email: usuarioForm.email.trim(),
            fechaNac: usuarioForm.fechaNac,
            region: usuarioForm.region,
            comuna: usuarioForm.comuna.trim(),
            direccion: usuarioForm.direccion.trim(),
            rol: usuarioForm.rol,
            password: usuarioForm.password || '',
        }

        try {
            const res = await fetch(esModificar ? `${API_URL}/${modal.idOriginal}` : API_URL, {
                method: esModificar ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json', ...authHeaders() },
                body: JSON.stringify(body),
            })
            if (!res.ok) {
                const error = await res.json().catch(() => null)
                setFeedback({ variant: 'danger', message: error?.message || 'No se pudo guardar el usuario.' })
                return
            }
            setFeedback({ variant: 'success', message: esModificar ? 'Usuario modificado correctamente.' : 'Usuario agregado correctamente.' })
            setUsuarioSeleccionado(null)
            setModal(null)
            await cargarUsuarios()
        } catch {
            setFeedback({ variant: 'danger', message: 'Error de conexión con el servidor.' })
        }
    }

    async function eliminarUsuario() {
        if (usuarioSeleccionado === null) return
        try {
            const res = await fetch(`${API_URL}/${usuarioSeleccionado}`, {
                method: 'DELETE',
                headers: authHeaders(),
            })
            if (!res.ok) {
                const error = await res.json().catch(() => null)
                setFeedback({ variant: 'danger', message: error?.message || 'No se pudo eliminar el usuario.' })
                return
            }
            setUsuarioSeleccionado(null)
            setFeedback({ variant: 'success', message: 'Usuario eliminado correctamente.' })
            await cargarUsuarios()
        } catch {
            setFeedback({ variant: 'danger', message: 'Error de conexión con el servidor.' })
        }
    }

    function abrirCita() {
        const seleccionada = citas.find((cita) => cita.id === citaSeleccionada)
        if (!seleccionada) {
            setFeedback({ variant: 'warning', message: 'Seleccione una única cita para modificar.' })
            return
        }
        setCitaForm({ ...seleccionada })
        setModal({ tipo: 'cita', citaId: seleccionada.id })
    }

    function guardarCita(event) {
        event.preventDefault()
        setCitas((actuales) => actuales.map((cita) => (
            cita.id === modal.citaId
                ? { ...cita, ...citaForm, edad: Number(citaForm.edad) }
                : cita
        )))
        setCitaSeleccionada(null)
        setModal(null)
        setFeedback({ variant: 'success', message: 'Cita modificada correctamente.' })
    }

    function actualizarEstadoCita(estado) {
        if (citaSeleccionada === null) return
        setCitas((actuales) => actuales.map((cita) => (
            cita.id === citaSeleccionada ? { ...cita, estado } : cita
        )))
        setCitaSeleccionada(null)
        setFeedback({
            variant: 'success',
            message: estado === 'Confirmada' ? 'Cita confirmada correctamente.' : 'Cita anulada correctamente.',
        })
    }

    return {
        productosAdmin,
        usuarios,
        cargandoUsuarios,
        cargarUsuarios,
        citas,
        productoSeleccionado,
        setProductoSeleccionado,
        usuarioSeleccionado,
        setUsuarioSeleccionado,
        citaSeleccionada,
        setCitaSeleccionada,
        citaForm,
        setCitaForm,
        modal,
        setModal,
        productoForm,
        setProductoForm,
        usuarioForm,
        setUsuarioForm,
        feedback,
        setFeedback,
        abrirProducto,
        guardarProducto,
        eliminarProducto,
        agregarUsuario,
        guardarUsuario,
        eliminarUsuario,
        modificarUsuario,
        abrirCita,
        guardarCita,
        actualizarEstadoCita,
    }
}

export default useAdmin