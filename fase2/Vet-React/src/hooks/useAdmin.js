import { useState } from 'react'
import { productos } from '../utils/productos'

const stockInicial = [45, 30, 28, 60, 40, 35, 80, 50, 55, 30, 25, 20, 18, 40, 35, 15, 22, 48, 60, 36, 30, 25]

const productosIniciales = productos.map((producto, index) => ({
    sku: producto.id,
    nombre: producto.nombre,
    descripcion: `${producto.detalle}. Uso en ${producto.especie}.`,
    precio: producto.precio,
    stock: stockInicial[index],
    categoria: producto.categoria,
}))

const usuariosIniciales = [
    { id: '154567823', run: '154567823', nombre: 'Sofía', apellidos: 'Astorga Zapata', email: 'sastorga@sanmarcos.cl', fechaNac: '1980-10-03', rol: 'Administrador', comuna: 'Machalí', direccion: 'Pasaje Los Nogales 12' },
    { id: '152873490', run: '152873490', nombre: 'Laura', apellidos: 'Claro Hernández', email: 'lclaro@sanmarcos.cl', fechaNac: '1980-05-30', rol: 'Funcionario', comuna: 'Rancagua', direccion: 'Av. Cachapoal 780' },
    { id: '162345893', run: '162345893', nombre: 'Carmen', apellidos: 'Martínez Larraín', email: 'cmartinez@sanmarcos.cl', fechaNac: '1985-12-20', rol: 'Funcionario', comuna: 'San Fernando', direccion: 'Calle Manuel Rodríguez 345' },
    { id: '178901230', run: '178901230', nombre: 'Ignacio', apellidos: 'Solar Guzmán', email: 'isolar@sanmarcos.cl', fechaNac: '1990-08-15', rol: 'Funcionario', comuna: 'Rengo', direccion: 'Calle Arturo Prat 238' },
    { id: '160803216', run: '145673216', nombre: 'Jorge', apellidos: 'Vial Peña', email: 'jvial@sanmarcos.cl', fechaNac: '1984-11-06', rol: 'Funcionario', comuna: 'Chépica', direccion: 'Pasaje Los Aromos 89' },
]

const citasIniciales = [
    { id: 1, fecha: '2026-10-15', hora: '10:00', nombreMascota: 'Luna', especie: 'Perro', raza: 'Golden Retriever', edad: 4, nombreTutor: 'Camila Rojas', estado: 'Pendiente' },
    { id: 2, fecha: '2026-10-16', hora: '11:00', nombreMascota: 'Michi', especie: 'Gato', raza: 'Doméstico de pelo corto', edad: 2, nombreTutor: 'Javier Soto', estado: 'Confirmada' },
    { id: 3, fecha: '2026-10-17', hora: '12:00', nombreMascota: 'Coco', especie: 'Conejo', raza: 'Cabeza de león', edad: 1, nombreTutor: 'Fernanda Díaz', estado: 'Pendiente' },
    { id: 4, fecha: '2026-10-19', hora: '15:00', nombreMascota: 'Rocky', especie: 'Perro', raza: 'Mestizo', edad: 7, nombreTutor: 'Diego Pérez', estado: 'Anulada' },
    { id: 5, fecha: '2026-10-20', hora: '16:00', nombreMascota: 'Kiwi', especie: 'Ave', raza: 'Cotorra', edad: 3, nombreTutor: 'Valentina Muñoz', estado: 'Pendiente' },
]

function useAdmin() {
    const [productosAdmin, setProductosAdmin] = useState(productosIniciales)
    const [usuarios, setUsuarios] = useState(usuariosIniciales)
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

    function abrirUsuario(modo) {
        if (modo === 'modificar') {
            const seleccionado = usuarios.find((user) => user.id === usuarioSeleccionado)
            if (!seleccionado) {
                setFeedback({ variant: 'warning', message: 'Seleccione un único usuario para modificar.' })
                return
            }
            setUsuarioForm({ ...seleccionado })
        } else {
            setUsuarioForm({ id: '', run: '', nombre: '', apellidos: '', email: '', fechaNac: '', rol: '', comuna: '', direccion: '' })
        }
        setFeedback(null)
        setModal({
            tipo: 'usuario',
            modo,
            ...(modo === 'modificar' ? { idOriginal: usuarioSeleccionado } : {}),
        })
    }

    function guardarUsuario(event) {
        event.preventDefault()
        const datos = {
            ...usuarioForm,
            id: modal.modo === 'modificar' ? modal.idOriginal : usuarioForm.run.trim(),
            run: usuarioForm.run.trim(),
            nombre: usuarioForm.nombre.trim(),
            apellidos: usuarioForm.apellidos.trim(),
            email: usuarioForm.email.trim(),
            comuna: usuarioForm.comuna.trim(),
            direccion: usuarioForm.direccion.trim(),
        }
        const runEnUso = usuarios.some((user) => user.run === datos.run && (modal.modo === 'agregar' || user.id !== modal.idOriginal))
        if (runEnUso) {
            setFeedback({ variant: 'warning', message: 'Ya existe un usuario con ese RUN.' })
            return
        }
        const correoEnUso = usuarios.some((user) => user.email.toLowerCase() === datos.email.toLowerCase() && (modal.modo === 'agregar' || user.id !== modal.idOriginal))
        if (correoEnUso) {
            setFeedback({ variant: 'warning', message: 'Ya existe un usuario con ese correo electrónico.' })
            return
        }

        if (modal.modo === 'agregar') {
            setUsuarios((actuales) => [...actuales, datos])
            setFeedback({ variant: 'success', message: 'Usuario agregado correctamente.' })
        } else {
            setUsuarios((actuales) => actuales.map((user) => user.id === modal.idOriginal ? datos : user))
            setFeedback({ variant: 'success', message: 'Usuario modificado correctamente.' })
        }
        setUsuarioSeleccionado(null)
        setModal(null)
    }

    function eliminarUsuario() {
        if (usuarioSeleccionado === null) return
        setUsuarios((actuales) => actuales.filter((user) => user.id !== usuarioSeleccionado))
        setUsuarioSeleccionado(null)
        setFeedback({ variant: 'success', message: 'Usuario eliminado correctamente.' })
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
        abrirUsuario,
        guardarUsuario,
        eliminarUsuario,
        abrirCita,
        guardarCita,
        actualizarEstadoCita,
    }
}

export default useAdmin