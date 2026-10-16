import { useMemo, useState } from 'react'
import { Alert, Button, Form, Modal } from 'react-bootstrap'
import { useAuthContext } from '../context/AuthContext'
import { useCarritoContext } from '../context/CarritoContext'
import useFormulario from '../hooks/useFormulario'
import { crearReglasCita } from '../utils/validaciones'
import { PRECIO_CONSULTA } from '../utils/productos'

const HORARIOS = ['10:00', '11:00', '12:00', '14:00', '15:00', '16:00']

const citaInicial = {
    fecha: '',
    hora: '',
    nombreMascota: '',
    especie: '',
    raza: '',
    edad: '',
}

function fechaLocal(date) {
    const anio = date.getFullYear()
    const mes = String(date.getMonth() + 1).padStart(2, '0')
    const dia = String(date.getDate()).padStart(2, '0')
    return `${anio}-${mes}-${dia}`
}

function obtenerHoraFin(hora) {
    return `${String(Number(hora.slice(0, 2)) + 1).padStart(2, '0')}:00`
}

function obtenerBloquesDisponibles(fecha, hoy) {
    if (!fecha) return []
    if (fecha !== hoy) return HORARIOS

    const horaActual = new Date().getHours()
    return HORARIOS.filter((hora) => Number(hora.slice(0, 2)) > horaActual)
}

function Cita({ mostrar, onCerrar }) {
    const { usuario } = useAuthContext()
    const { agregarCitaAlCarrito } = useCarritoContext()
    const [confirmada, setConfirmada] = useState(false)
    const [citaConfirmada, setCitaConfirmada] = useState(null)

    const hoy = fechaLocal(new Date())
    const formulario = useFormulario(
        citaInicial,
        (valores) => crearReglasCita({
            hoy,
            horariosDisponibles: obtenerBloquesDisponibles(valores.fecha, hoy),
        }),
        (valores) => {
            agregarCitaAlCarrito(valores, usuario.nombre)
            setCitaConfirmada(valores)
            setConfirmada(true)
            return null
        },
    )
    const { valores: cita, errores, handleChange: cambiarCampo, handleSubmit, limpiarErrores } = formulario

    const bloquesDisponibles = useMemo(() => {
        return obtenerBloquesDisponibles(cita.fecha, hoy)
    }, [cita.fecha, hoy])

    const handleChange = (event) => {
        const { name } = event.target
        cambiarCampo(event)

        if (name === 'fecha') {
            cambiarCampo({ target: { name: 'hora', value: '' } })
        }
    }

    const cerrarModal = () => {
        setConfirmada(false)
        setCitaConfirmada(null)
        limpiarErrores()
        onCerrar()
    }

    const citaVisible = citaConfirmada || cita
    const fechaFormateada = citaVisible.fecha
        ? new Date(...citaVisible.fecha.split('-').map((v, i) => (i === 1 ? v - 1 : v)))
            .toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
        : ''

    const horaFin = citaVisible.hora ? obtenerHoraFin(citaVisible.hora) : ''

    return (
        <Modal show={mostrar} onHide={confirmada ? cerrarModal : onCerrar} centered>
            <Modal.Header closeButton>
                <Modal.Title>Agendar cita</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {confirmada ? (
                    <Alert variant="success">
                        <p className="mb-1"><b>¡Cita agendada y agregada al carrito!</b></p>
                        <p className="mb-1"><b>Fecha:</b> {fechaFormateada}</p>
                        <p className="mb-1"><b>Hora:</b> {citaVisible.hora} a {horaFin}</p>
                        <p className="mb-1">
                            <b>Mascota:</b> {citaVisible.nombreMascota} ({citaVisible.especie}
                            {citaVisible.raza.trim() ? `, ${citaVisible.raza}` : ''}, {citaVisible.edad} {citaVisible.edad === '1' ? 'año' : 'años'})
                        </p>
                        <p className="mb-0"><b>Tutor:</b> {usuario.nombre}</p>
                        <p className="mb-0"><b>Valor consulta:</b> ${PRECIO_CONSULTA.toLocaleString('es-CL')}</p>
                    </Alert>
                ) : (
                    <Form className="cita-form" onSubmit={(event) => {
                        limpiarErrores()
                        handleSubmit(event)
                    }} noValidate>
                        <Form.Group className="mb-3" controlId="cita-fecha">
                            <Form.Label><b>Fecha de la cita</b></Form.Label>
                            <Form.Control type="date" name="fecha" min={hoy} value={cita.fecha} onChange={handleChange} isInvalid={!!errores.fecha}/>
                            <Form.Control.Feedback type="invalid">{errores.fecha}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="cita-hora">
                            <Form.Label><b>Hora</b> (bloques de 1 hora)</Form.Label>
                            <Form.Select name="hora" value={cita.hora} onChange={handleChange} disabled={!cita.fecha || bloquesDisponibles.length === 0 || !!errores.fecha} isInvalid={!!errores.hora}>
                                <option value="" disabled>
                                    {bloquesDisponibles.length === 0 && cita.fecha && !errores.fecha
                                        ? 'No quedan horarios este día'
                                        : 'Seleccionar hora'}
                                </option>
                                {bloquesDisponibles.map((hora) => {
                                    return (
                                        <option key={hora} value={hora}>{hora} a {obtenerHoraFin(hora)}</option>
                                    )
                                })}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">{errores.hora}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="cita-nombre-mascota">
                            <Form.Label><b>Nombre de la mascota</b></Form.Label>
                            <Form.Control type="text" name="nombreMascota" placeholder="Ingresar nombre de la mascota" value={cita.nombreMascota} onChange={handleChange} isInvalid={!!errores.nombreMascota}/>
                            <Form.Control.Feedback type="invalid">{errores.nombreMascota}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="cita-especie">
                            <Form.Label><b>Especie</b></Form.Label>
                            <Form.Select name="especie" value={cita.especie} onChange={handleChange} isInvalid={!!errores.especie}>
                                <option value="" disabled>Seleccionar especie</option>
                                <option value="Perro">Perro</option>
                                <option value="Gato">Gato</option>
                                <option value="Ave">Ave</option>
                                <option value="Conejo">Conejo</option>
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">{errores.especie}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="cita-raza">
                            <Form.Label><b>Raza</b> (opcional)</Form.Label>
                            <Form.Control type="text" name="raza" placeholder="Ingresar raza" value={cita.raza} onChange={handleChange}/>
                        </Form.Group>

                        <Form.Group className="mb-4" controlId="cita-edad">
                            <Form.Label><b>Edad</b> (años)</Form.Label>
                            <Form.Control type="number" name="edad" min="0" step="1" placeholder="Ingresar edad" value={cita.edad} onChange={handleChange} isInvalid={!!errores.edad}/>
                            <Form.Control.Feedback type="invalid">{errores.edad}</Form.Control.Feedback>
                        </Form.Group>

                        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                            <Button variant="success" type="submit">Agendar cita</Button>
                        </div>
                    </Form>
                )}
            </Modal.Body>
        </Modal>
    )
}

export default Cita