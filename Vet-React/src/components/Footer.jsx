import { useState } from 'react'
import { Alert, Button, Col, Container, Form, Image, Row } from 'react-bootstrap'
import MapaUbicacion from './Mapa'
import useFormulario from '../hooks/useFormulario'
import { reglasContacto } from '../utils/validaciones'
import './footer.css'

const valoresContactoIniciales = { asunto: '', email: '', mensaje: '' }

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
        <footer id="contacto" className="footer py-2">
            <Container className="w-100">
                <Row className="gy-1 align-items-center">
                    <Col xs={12} md={6} xl={4} className="d-flex flex-column align-items-center">
                        <h6>Horario</h6>
                        <p className="footer-text">
                            Lunes a viernes: 10:00 - 19:30<br />
                            Sábados: 10:00 - 16:00<br />
                            Domingos y festivos: Cerrado
                        </p>
                        <h6>Consulta veterinaria</h6>
                        <p className="footer-text">Valor de la consulta $15.000</p>
                        <Image src="/img/logo.png" alt="Logo" className="logo-footer" />
                    </Col>

                    <Col xs={12} md={6} xl={4} className="d-flex flex-column align-items-center">
                        <h6>Ubicación</h6>
                        <p className="footer-text">Recreo 26, Rancagua, Región de O'Higgins</p>
                        <MapaUbicacion />
                    </Col>

                    <Col xs={12} md={12} xl={4} className="d-flex flex-column align-items-center">
                        <h6>Contacto</h6>
                        {enviado && (
                            <Alert variant="success" className="py-1 px-2 mb-2">
                                ¡Mensaje enviado!
                            </Alert>
                        )}
                        {errorGeneral && (
                            <Alert variant="danger" className="py-1 px-2 mb-2">
                                {errorGeneral}
                            </Alert>
                        )}

                        <Form className="footer-form" onSubmit={handleSubmit} noValidate>
                            <Form.Group className="form-group" controlId="contacto-asunto">
                                <Form.Label>Asunto</Form.Label>
                                <Form.Control type="text" name="asunto" value={form.asunto} onChange={handleChange} placeholder="Sobre qué nos escribes" isInvalid={!!errores.asunto} />
                                <Form.Control.Feedback type="invalid">{errores.asunto}</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="form-group" controlId="contacto-email">
                                <Form.Label>Correo</Form.Label>
                                <Form.Control type="email" name="email" value={form.email} onChange={handleChange} placeholder="Ingresar correo electrónico" isInvalid={!!errores.email}/>
                                <Form.Control.Feedback type="invalid">{errores.email}</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="form-group" controlId="contacto-mensaje">
                                <Form.Label>Mensaje</Form.Label>
                                <Form.Control as="textarea" rows={1} name="mensaje" value={form.mensaje} onChange={handleChange} placeholder="Cuéntanos" isInvalid={!!errores.mensaje}/>
                                <Form.Control.Feedback type="invalid">{errores.mensaje}</Form.Control.Feedback>
                            </Form.Group>

                            <Button variant="success" type="submit">Enviar mensaje</Button>
                        </Form>
                    </Col>
                </Row>

                <p className="footer-copy text-center mb-0">© Veterinaria San Marcos 2026. Todos los derechos reservados.</p>
            </Container>
        </footer>
    );
}

export default Footer