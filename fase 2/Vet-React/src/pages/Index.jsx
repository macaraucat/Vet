import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Alert, Button, Card, Col, Container, Form, Image, Modal, Row } from 'react-bootstrap'
import useNoticias from '../hooks/useNoticias'
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

function AgendarCita({ mostrar, onCerrar }) {
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

const SERVICIOS = [
    { nombre: 'Consultas', icono: 'consultas' },
    { nombre: 'Vacunación', icono: 'vacunacion' },
    { nombre: 'Cirugía', icono: 'cirugia' },
    { nombre: 'Desparasitación', icono: 'desparasitacion' },
    { nombre: 'Exámenes', icono: 'examenes' },
    { nombre: 'Medicamentos', icono: 'medicamentos' },
]

function Index() {
    const { noticias, expandido, toggleExpandir } = useNoticias()
    const [animar, setAnimar] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()
    const { usuario } = useAuthContext()
    const [mostrarCita, setMostrarCita] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => setAnimar(true), 0)
        return () => clearTimeout(timer)
    }, []);

    useEffect(() => {
        if (!location.hash) return

        document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })
    }, [location.hash, location.pathname])

    const esCliente = usuario && usuario.role === 'Cliente'

    const agendarCita = () => {
        if (!esCliente) {
            navigate('/login')
            return
        }
        setMostrarCita(true)
    }

    return (
        <main>
            <section id="hero" className="hero py-4 py-lg-5">
                <Container>
                    <Row className="align-items-center g-4 g-xl-5">
                        <Col md={6} xl={7} className="text-center text-md-start">
                            <h2 className="hero-tagline fs-1 fw-bold lh-sm mb-3">Cuidado cercano y profesional</h2>
                            <p className="mb-4">Llevamos más de 15 años entregando atención cercana y de calidad a las mascotas. Contamos con médicos veterinarios, técnico veterinario y equipamiento especializado. Sabemos lo importante que es tu mascota para ti, por eso trabajamos con dedicación y cariño en cada visita.</p>
                            <Button variant="success" className="boton-primario" onClick={agendarCita}>Agendar cita</Button>
                        </Col>
                        <Col md={6} xl={5}>
                            <div className="hero-pets-wrapper overflow-hidden">
                                <Image src="/img/hero.jpg" alt="Mascotas" className={`hero-pets-img d-block w-100 ${animar ? 'bounce-on-load' : ''}`} />
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            <section id="servicios" className="servicios container">
                <h2 className="text-center mb-4">Nuestros servicios</h2>
                <Row className="g-3">
                    {SERVICIOS.map(({ nombre, icono }) => (
                        <Col key={nombre} xs={6} md={4} xl={2}>
                            <Card className="servicio h-100 text-center rounded-4">
                                <Card.Body>
                                    <Card.Title as="h6">{nombre}</Card.Title>
                                    <Image src={`/img/servicios/${icono}.png`} alt={nombre} className="servicio-img d-block mx-auto my-3" />
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </section>

            <section id="nosotros" className="nosotros container">
                <h2 className="text-center mb-4">Sobre nosotros</h2>
                <p>Veterinaria San Marcos es una clínica veterinaria ubicada en Rancagua, Región del Libertador General Bernardo O'Higgins, fundada en 2009. Contamos con un equipo integral dedicado a brindar una atención cercana y profesional, para tus mascotas. A lo largo de estos años, hemos visto crecer la confianza de nuestros clientes, lo que nos motiva a seguir mejorando cada aspecto de nuestra atención, desde la comodidad de nuestras instalaciones hasta la calidez con la que recibimos a cada mascota y su familia.</p>
                <Image src="/img/team.jpg" alt="Team" className="team-img mx-auto d-block my-4"/>
                <h3>Nuestro equipo:</h3>
                <p>
                    <b>Laura Claro Hernández:</b> Médica Veterinaria, Universidad de Concepción. Diplomado en Cirugía de Pequeños Animales (Universidad de Chile). Directora clínica y fundadora de Veterinaria San Marcos, con más de 15 años de trayectoria en medicina y cirugía de perros y gatos.<hr />
                    <b>Carmen Martínez Larraín:</b> Médica Veterinaria, Universidad Austral de Chile. Diplomado en Medicina Interna de Pequeños Animales; responsable de consultas generales, vacunación y programas preventivos.<hr />
                    <b>Ignacio Solar Guzmán:</b> Médico Veterinario, Universidad de Concepción. Magíster en Medicina de Especies Exóticas, con dedicación especial a aves y conejos; a cargo de la atención de mascotas no convencionales.<hr />
                    <b>Jorge Vial Peña:</b> Técnico en Enfermería Veterinaria, Universidad Santo Tomás. Encargado de pabellón y apoyo en procedimientos quirúrgicos, cuidados intensivos y toma de exámenes.<hr />
                    <b>Sofía Astorga Zapata:</b> Administradora, Universidad de Talca. Recepcionista y encargada de atención a clientes, agendamiento de horas y gestión administrativa de la clínica.
                </p>
            </section>

            <section id="noticias" className="noticias container">
                <h2>Noticias importantes</h2>
                <Row className="g-3 my-1">
                    {noticias.map((n, i) => (
                        <Col key={n.titulo} xs={12} md={6}>
                            <Card className="h-100 border-0 bg-body-secondary rounded-4">
                                <Card.Body className="d-flex flex-column p-4">
                                    <Card.Title as="h4">{n.titulo}</Card.Title>
                                    <Card.Text>{expandido[i] ? n.extendido : n.corto}</Card.Text>
                                    <Button variant="link" className="link-success fw-bold text-decoration-none p-0 w-100" onClick={() => toggleExpandir(i)}>
                                        {expandido[i] ? 'Contraer' : 'Expandir'}
                                    </Button>
                                    <div className="ratio ratio-3x2 mt-3">
                                        <Image src={n.img} alt={n.alt} className="object-fit-cover rounded-3" />
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </section>

            <AgendarCita mostrar={mostrarCita} onCerrar={() => setMostrarCita(false)} />
        </main>
    )
}

export default Index