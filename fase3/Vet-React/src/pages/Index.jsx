import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Alert, Button, Card, Col, Container, Form, Image, Modal, Row } from 'react-bootstrap'
import { useAuthContext } from '../context/AuthContext'
import { useCarritoContext } from '../context/CarritoContext'
import useFormulario from '../hooks/useFormulario'
import { crearReglasCita } from '../utils/validaciones'

const HORARIOS = [ '10:00-10:45', '11:00-11:45', '12:00-12:45', '13:00-13:45', '15:00-15:45', '16:00-16:45', '17:00-17:45',]
const ESPECIES = ['Perro', 'Gato', 'Ave', 'Conejo']
const citaInicial = { fecha: '', hora: '', mascota: '', especie: '', edad: '' }

const SERVICIOS = [
    { nombre: 'Consultas', icono: 'consultas' },
    { nombre: 'Vacunación', icono: 'vacunacion' },
    { nombre: 'Cirugía', icono: 'cirugia' },
    { nombre: 'Desparasitación', icono: 'desparasitacion' },
    { nombre: 'Exámenes', icono: 'examenes' },
    { nombre: 'Medicamentos', icono: 'medicamentos' },
]

const NOTICIAS = [
    {
        titulo: 'Una cirugía de emergencia con final feliz',
        corto: 'Firulais llegó en estado crítico por un accidente, fue operado de urgencia y, tras semanas de cuidados y acompañamiento familiar, se recuperó por completo.',
        extendido: 'Firulais llegó a nuestra clínica en estado crítico tras un accidente, con signos vitales alterados y una lesión que requería intervención inmediata. Nuestro equipo médico actuó rápido: en menos de una hora ya estaba en cirugía, estabilizado y bajo constante monitoreo. Los días posteriores fueron clave, con curaciones diarias, controles de dolor y mucho acompañamiento de su familia, que no se separó de él en ningún momento. Hoy, varias semanas después, Firulais corre, juega y mueve la cola como si nada hubiera pasado, un recordatorio de por qué actuar a tiempo puede marcar toda la diferencia.',
        img: '/img/firulais.jpg',
        alt: 'Firulais',
    },
    {
        titulo: 'Problemas dentales en conejos',
        corto: 'Sus dientes crecen continuamente; desequilibrios en la dieta o alineación pueden causar problemas graves. Revisiones periódicas y dieta rica en fibra ayudan a prevenirlos.',
        extendido: 'Los conejos son pacientes poco comunes en la consulta diaria, pero cada vez llegan más a nuestra clínica, y sus dientes suelen ser la razón principal. A diferencia de perros y gatos, sus dientes crecen de forma continua durante toda su vida, así que cualquier desequilibrio en su dieta o alineación dental puede derivar en molestias serias. Señales como babeo, pérdida de apetito o cambios en el pelaje alrededor del hocico son motivo suficiente para pedir hora. Con revisiones periódicas y una dieta rica en fibra, la mayoría de estos problemas se puede prevenir antes de que se conviertan en una urgencia.',
        img: '/img/conejo.jpg',
        alt: 'Conejo',
    },
]

function fechaLocal(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function obtenerBloquesDisponibles(fecha, hoy) {
    if (!fecha || fecha === hoy) return []
    return HORARIOS
}

function Campo({ name, label, errores, children }) {
    return (
        <Form.Group className="mb-3" controlId={`cita-${name}`}>
            <Form.Label><b>{label}</b></Form.Label>
            {children}
            <Form.Control.Feedback type="invalid">{errores[name]}</Form.Control.Feedback>
        </Form.Group>
    )
}

function Index() {
    const [expandido, setExpandido] = useState({})
    const { usuario } = useAuthContext()
    const { agregarCitaAlCarrito } = useCarritoContext()
    const [animar, setAnimar] = useState(false)
    const [mostrarCita, setMostrarCita] = useState(false)
    const [confirmada, setConfirmada] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        const timer = setTimeout(() => setAnimar(true), 0)
        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        if (!location.hash) return
        document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })
    }, [location.hash, location.pathname])

    const hoy = fechaLocal(new Date())
    const { valores: cita, errores, handleChange: cambiarCampo, handleSubmit, limpiarErrores } = useFormulario(
        citaInicial,
        (valores) => crearReglasCita({ hoy, horariosDisponibles: obtenerBloquesDisponibles(valores.fecha, hoy) }),
        (valores) => {
            agregarCitaAlCarrito(valores, usuario.nombre)
            setConfirmada(true)
            return null
        },
    )

    const bloquesDisponibles = obtenerBloquesDisponibles(cita.fecha, hoy)
    const sinHorarios = !cita.fecha || bloquesDisponibles.length === 0
    const esCliente = usuario?.role === 'CLIENTE'

    const toggleExpandir = (i) => {
        setExpandido((prev) => ({ ...prev, [i]: !prev[i] }))
    }

    const handleChange = (event) => {
        const { name } = event.target
        cambiarCampo(event)
        if (name === 'fecha') cambiarCampo({ target: { name: 'hora', value: '' } })
    }

    const agendarCita = () => {
        if (!esCliente) {
            navigate('/login')
            return
        }
        setMostrarCita(true)
    }

    const cerrarCita = () => {
        setMostrarCita(false)
        setConfirmada(false)
        limpiarErrores()
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
                <Image src="/img/team.jpg" alt="Team" className="team-img mx-auto d-block my-4" />
                <h3>Nuestro equipo:</h3>
                <div>
                    <b>Laura Claro Hernández:</b> Médica Veterinaria, Universidad de Concepción. Diplomado en Cirugía de Pequeños Animales (Universidad de Chile). Directora clínica y fundadora de Veterinaria San Marcos, con más de 15 años de trayectoria en medicina y cirugía de perros y gatos.
                    <b>Carmen Martínez Larraín:</b> Médica Veterinaria, Universidad Austral de Chile. Diplomado en Medicina Interna de Pequeños Animales; responsable de consultas generales, vacunación y programas preventivos.
                    <b>Ignacio Solar Guzmán:</b> Médico Veterinario, Universidad de Concepción. Magíster en Medicina de Especies Exóticas, con dedicación especial a aves y conejos; a cargo de la atención de mascotas no convencionales.
                    <b>Jorge Vial Peña:</b> Técnico en Enfermería Veterinaria, Universidad Santo Tomás. Encargado de pabellón y apoyo en procedimientos quirúrgicos, cuidados intensivos y toma de exámenes.
                    <b>Sofía Astorga Zapata:</b> Administradora, Universidad de Talca. Recepcionista y encargada de atención a clientes, agendamiento de horas y gestión administrativa de la clínica.
                </div>
            </section>

            <section id="noticias" className="noticias container">
                <h2>Noticias importantes</h2>
                <Row className="g-3 my-1">
                    {NOTICIAS.map((n, i) => (
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

            <Modal show={mostrarCita} onHide={cerrarCita} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Agendar cita</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {confirmada ? (
                        <Alert variant="success" className="mb-0">
                            ¡Cita agregada al carrito! Completa el pago para confirmarla.
                        </Alert>
                    ) : (
                        <Form className="cita-form" onSubmit={handleSubmit} noValidate>
                            <Campo name="fecha" label="Fecha" errores={errores}>
                                <Form.Control type="date" name="fecha" min={hoy} value={cita.fecha} onChange={handleChange} isInvalid={!!errores.fecha} />
                            </Campo>

                            <Campo name="hora" label="Hora" errores={errores}>
                                <Form.Select name="hora" value={cita.hora} onChange={handleChange} disabled={sinHorarios} isInvalid={!!errores.hora}>
                                    <option value="" disabled>
                                        {cita.fecha && bloquesDisponibles.length === 0
                                            ? 'No hay horas disponibles para hoy'
                                            : 'Seleccionar hora'}
                                    </option>
                                    {bloquesDisponibles.map((bloque) => (
                                        <option key={bloque} value={bloque}>{bloque}</option>
                                    ))}
                                </Form.Select>
                            </Campo>

                            <Campo name="mascota" label="Nombre mascota" errores={errores}>
                                <Form.Control type="text" name="mascota" value={cita.mascota} onChange={handleChange} isInvalid={!!errores.mascota} />
                            </Campo>

                            <Campo name="especie" label="Especie" errores={errores}>
                                <Form.Select name="especie" value={cita.especie} onChange={handleChange} isInvalid={!!errores.especie}>
                                    <option value="" disabled>Seleccionar especie</option>
                                    {ESPECIES.map((especie) => <option key={especie} value={especie}>{especie}</option>)}
                                </Form.Select>
                            </Campo>

                            <Campo name="edad" label="Edad mascota (años)" errores={errores}>
                                <Form.Control type="number" name="edad" min="0" step="1" value={cita.edad} onChange={handleChange} isInvalid={!!errores.edad} />
                            </Campo>

                            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                <Button variant="success" type="submit">Agendar cita</Button>
                            </div>
                        </Form>
                    )}
                </Modal.Body>
            </Modal>
        </main>
    )
}

export default Index