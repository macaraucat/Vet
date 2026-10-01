import { useState } from 'react'
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap'
import { validarCorreo, validarPass } from '../utils/validaciones'
import './login.css'

function Login({ onLogin, onShowRegistro }) {
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')
    const [error, setError] = useState('')
    const [registro, setRegistro] = useState({
        run: '',
        nombre: '',
        email: '',
        fechaNacimiento: '',
        comuna: '',
        direccion: '',
        pass: '',
        confirmarPass: '',
    })

    const handleRegistroChange = (e) => {
        setRegistro({ ...registro, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setError('')

        // Validación con las funciones de validaciones.js
        if (!validarCorreo(email)) {
            setError('Ingrese un correo válido: @duoc.cl, @profesor.duoc.cl o @gmail.com (máx. 100 caracteres).')
            return
        }

        if (!validarPass(pass)) {
            setError('La contraseña debe tener entre 4 y 10 caracteres.')
            return
        }

        // Si todo es válido, se ejecuta el login
        onLogin?.({ email, pass })
    }

    return (
        <>
            <section id="login" className="login standard-section py-5">
                <Container>
                    <Row className="justify-content-center">
                        <Col xs={12} md={8} lg={6}>
                            <Card className="shadow-sm border">
                                <Card.Body className="p-4 p-md-5">
                                    <Card.Title as="h2" className="text-center mb-4">
                                        Iniciar sesión
                                    </Card.Title>

                                    <Form id="login-form" onSubmit={handleSubmit} noValidate>
                                        <Form.Group className="mb-3" controlId="email">
                                            <Form.Label><b>Correo electrónico</b></Form.Label>
                                            <Form.Control
                                                type="email"
                                                placeholder="Ingresar correo electrónico"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-4" controlId="pass">
                                            <Form.Label><b>Contraseña</b></Form.Label>
                                            <Form.Control
                                                type="password"
                                                placeholder="Ingresar contraseña"
                                                value={pass}
                                                onChange={(e) => setPass(e.target.value)}
                                            />
                                        </Form.Group>

                                        {error && (
                                            <Alert variant="danger" className="py-2">
                                                {error}
                                            </Alert>
                                        )}

                                        <div className="d-grid gap-2">
                                            <Button variant="success" type="submit">
                                                Iniciar sesión
                                            </Button>
                                        </div>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section>

            <section id="registro" className="registro standard-section py-5">
                <Container>
                    <Row className="justify-content-center">
                        <Col xs={12} md={8} lg={6}>
                            <Card className="shadow-sm border">
                                <Card.Body className="p-4 p-md-5">
                                    <Card.Title as="h2" className="text-center mb-4">
                                        Registrar cuenta
                                    </Card.Title>

                                    <Form id="signup-form" onSubmit={handleSubmit} noValidate>
                                        <Form.Group className="mb-3" controlId="registro-run">
                                            <Form.Label><b>RUN</b></Form.Label>
                                            <Form.Control type="text" placeholder="Ingresar RUN" value={registro.run} onChange={handleRegistroChange} />
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="registro-nombre">
                                            <Form.Label><b>Nombre completo</b></Form.Label>
                                            <Form.Control type="text" placeholder="Ingresar nombre completo" value={registro.nombre} onChange={handleRegistroChange} />
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="registro-email">
                                            <Form.Label><b>Correo electrónico</b></Form.Label>
                                            <Form.Control type="email" placeholder="Ingresar correo electrónico" value={registro.email} onChange={handleRegistroChange} />
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="registro-fecha-nacimiento">
                                            <Form.Label><b>Fecha de nacimiento</b></Form.Label>
                                            <Form.Control type="date" value={registro.fechaNacimiento} onChange={handleRegistroChange} />
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="registro-comuna">
                                            <Form.Label><b>Comuna</b></Form.Label>
                                            <Form.Select value={registro.comuna} onChange={handleRegistroChange}>
                                                <option value="" disabled>Seleccionar comuna</option>
                                                <option value="Rancagua">Rancagua</option>
                                                <option value="San Fernando">San Fernando</option>
                                                <option value="Rengo">Rengo</option>
                                                <option value="San Vicente de Tagua Tagua">San Vicente de Tagua Tagua</option>
                                                <option value="Santa Cruz">Santa Cruz</option>
                                                <option value="Chimbarongo">Chimbarongo</option>
                                                <option value="Graneros">Graneros</option>
                                                <option value="Machalí">Machalí</option>
                                            </Form.Select>
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="registro-direccion">
                                            <Form.Label><b>Dirección</b></Form.Label>
                                            <Form.Control type="text" placeholder="Ingresar dirección" value={registro.direccion} onChange={handleRegistroChange} />
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="registro-pass">
                                            <Form.Label><b>Contraseña</b></Form.Label>
                                            <Form.Control type="password" placeholder="Ingresar contraseña" value={registro.pass} onChange={handleRegistroChange} />
                                        </Form.Group>

                                        <Form.Group className="mb-4" controlId="registro-confirmar-pass">
                                            <Form.Label><b>Confirmar Contraseña</b></Form.Label>
                                            <Form.Control type="password" placeholder="Confirmar contraseña" value={registro.confirmarPass} onChange={handleRegistroChange} />
                                        </Form.Group>

                                        {error && (
                                            <Alert variant="danger" className="py-2">
                                                {error}
                                            </Alert>
                                        )}

                                        <div className="d-grid gap-2">
                                            <Button variant="success" type="submit">
                                                Registrar
                                            </Button>
                                        </div>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section>
        </>
    )
}

export default Login