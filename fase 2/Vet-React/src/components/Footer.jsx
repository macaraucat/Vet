import { useState } from 'react'
import { Alert, Button, Col, Container, Form, Image, Row } from 'react-bootstrap'
import MapaUbicacion from './Mapa'
import useFormulario from '../hooks/useFormulario'
import { reglasContacto } from '../utils/validaciones'
import { PRECIO_CONSULTA } from '../utils/productos'

const valoresContactoIniciales = { asunto: '', email: '', mensaje: '' }

const campos = [
    { name: 'asunto', label: 'Asunto', type: 'text', placeholder: 'Sobre qué nos escribes' },
    { name: 'email', label: 'Correo', type: 'email', placeholder: 'Ingresar correo electrónico' },
    { name: 'mensaje', label: 'Mensaje', as: 'textarea', rows: 1, placeholder: 'Cuéntanos' },
]

function Footer() {
    const [enviado, setEnviado] = useState(false)
    const {
        valores: form,
        errores,
        errorGeneral,
        handleChange: actualizarCampo,
        handleSubmit,
    } = useFormulario(valoresContactoIniciales, reglasContacto, () => {
        setEnviado(true)
        return null
    })

    const handleChange = (event) => {
        setEnviado(false)
        actualizarCampo(event)
    }

    return (
        <footer id="contacto" className="bg-verde text-white small py-2">
            <Container>
                <Row className="gy-1">
                    <Col xs={12} md={6} xl={4} className="d-flex flex-column align-items-center">
                        <h6 className="my-1 fw-semibold">Horario Tienda</h6>
                        <p className="mb-1 text-start">
                            Lunes a viernes: 10:00 - 19:30<br />
                            Sábados y domingos: 10:00 - 16:00
                        </p>
                        <h6 className="my-1 fw-semibold">Horario Consulta</h6>
                        <p className="mb-1 text-start">
                            Lunes a domingo: 10:00 - 13:00 y 14:00 - 17:00
                        </p>
                        <p className="mb-1 text-start">Valor de la consulta ${PRECIO_CONSULTA.toLocaleString('es-CL')}</p>
                        <Image src="/img/icons/logo.png" alt="Logo" width={96} height={96} className="mt-2" />
                    </Col>

                    <Col xs={12} md={6} xl={4} className="d-flex flex-column align-items-center">
                        <h6 className="my-1 fw-semibold">Ubicación</h6>
                        <p className="mb-1 text-start">Recreo 26, Rancagua, Región de O'Higgins</p>
                        <MapaUbicacion />
                    </Col>

                    <Col xs={12} xl={4} className="d-flex flex-column align-items-center">
                        <h6 className="my-1 fw-semibold">Contacto</h6>
                        {enviado && <Alert variant="success" className="py-1 px-2 mb-2">¡Mensaje enviado!</Alert>}
                        {errorGeneral && <Alert variant="danger" className="py-1 px-2 mb-2">{errorGeneral}</Alert>}

                        <Form className="footer-form d-flex flex-column gap-2" onSubmit={handleSubmit} noValidate>
                            {campos.map(({ name, label, ...props }) => (
                                <Form.Group key={name} controlId={`contacto-${name}`}>
                                    <Form.Label className="mb-0 fw-bold">{label}</Form.Label>
                                    <Form.Control
                                        name={name}
                                        value={form[name]}
                                        onChange={handleChange}
                                        isInvalid={!!errores[name]}
                                        {...props}
                                    />
                                    <Form.Control.Feedback type="invalid">{errores[name]}</Form.Control.Feedback>
                                </Form.Group>
                            ))}

                            <Button type="submit" variant="link" className="p-0 text-white text-decoration-none">Enviar mensaje</Button>
                        </Form>
                    </Col>
                </Row>

                <p className="text-center mb-0 mt-2 opacity-75">
                    © Veterinaria San Marcos 2026. Todos los derechos reservados.
                </p>
            </Container>
        </footer>
    )
}

export default Footer