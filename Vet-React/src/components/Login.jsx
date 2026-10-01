import { useState } from 'react'
import { Container, Row, Col, Card, Form, Button, Alert, Nav } from 'react-bootstrap'
import { validarCorreo, validarPass, validarRun, validarNombre, validarDireccion, validarPassIguales, validarFechaNacimiento } from '../utils/validaciones'
import './login.css'

function Login({ onLogin, onRegistro }) {
    const [tab, setTab] = useState('login')

    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')
    const [error, setError] = useState('')

    const [registro, setRegistro] = useState({ run:'', nombre:'', email:'', fechaNac:'', comuna:'', direccion:'', pass:'', pass2:'',})
    const [errorRegistro, setErrorRegistro] = useState('')

    const handleTabChange = (key) => {
        setTab(key)
        setError('')
        setErrorRegistro('')
    }

    const actualizarReg = (e) => {
        setRegistro({ ...registro, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setError('')

        if (!validarCorreo(email)) {
            setError('Ingrese un correo válido: @duoc.cl, @profesor.duoc.cl o @gmail.com (máx. 100 caracteres).')
            return
        }

        if (!validarPass(pass)) {
            setError('La contraseña debe tener entre 4 y 10 caracteres.')
            return
        }

        onLogin?.({ email, pass })
    }

    const handleSubmitRegistro = (e) => {
        e.preventDefault()
        setErrorRegistro('')

        if (!validarRun(registro.run)) {
            setErrorRegistro('Ingrese un RUN válido sin puntos ni guion (ej: 19011022K).')
            return
        }
        if (!validarNombre(registro.nombre)) {
            setErrorRegistro('El nombre es obligatorio (máx. 50 caracteres).')
            return
        }
        if (!validarCorreo(registro.email)) {
            setErrorRegistro('Ingrese un correo válido: @duoc.cl, @profesor.duoc.cl o @gmail.com.')
            return
        }
        if (!validarFechaNacimiento(registro.fechaNac)) {
            setErrorRegistro('Debes ser mayor de 18 años para registrarte.')
            return
        }        
        if (!validarDireccion(registro.direccion)) {
            setErrorRegistro('La dirección es obligatoria (máx. 300 caracteres).')
            return
        }
        if (!validarPass(registro.pass)) {
            setErrorRegistro('La contraseña debe tener entre 4 y 10 caracteres.')
            return
        }
        if (!validarPassIguales(registro.pass, registro.pass2)) {
            setErrorRegistro('Las contraseñas no coinciden.')
            return
        }

        onRegistro?.(registro)
    }

    return (
        <section id="login" className="auth standard-section py-5">
            <Container>
                <Row className="justify-content-center">
                    <Col xs={12} md={8} lg={6}>
                        <Card className="shadow-sm border">
                            <Card.Body className="p-4 p-md-5">
                                <Nav variant="tabs" activeKey={tab} onSelect={handleTabChange} className="login-tabs mb-4">
                                    <Nav.Item>
                                        <Nav.Link eventKey="login">Iniciar sesión</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="registro">Registrar cuenta</Nav.Link>
                                    </Nav.Item>
                                </Nav>

                                {tab === 'login' ? (
                                    <Form id="login-form" onSubmit={handleSubmit} noValidate>
                                        <Form.Group className="mb-3" controlId="email">
                                            <Form.Label><b>Correo electrónico</b></Form.Label>
                                            <Form.Control type="email" placeholder="Ingresar correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)}/>
                                        </Form.Group>

                                        <Form.Group className="mb-4" controlId="pass">
                                            <Form.Label><b>Contraseña</b></Form.Label>
                                            <Form.Control type="password" placeholder="Ingresar contraseña" value={pass} onChange={(e) => setPass(e.target.value)}/>
                                        </Form.Group>

                                        {error && (
                                            <Alert variant="danger" className="py-2">{error}</Alert>
                                        )}

                                        <div className="d-grid gap-2">
                                            <Button variant="success" type="submit">Iniciar sesión</Button>
                                        </div>
                                    </Form>
                                ) : (
                                    <Form id="signup-form" onSubmit={handleSubmitRegistro} noValidate>
                                        <Form.Group className="mb-3" controlId="registro-run">
                                            <Form.Label><b>RUN</b></Form.Label>
                                            <Form.Control type="text" name="run" placeholder="Ingresar RUN" value={registro.run} onChange={actualizarReg}/>
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="registro-nombre">
                                            <Form.Label><b>Nombre completo</b></Form.Label>
                                            <Form.Control type="text" name="nombre" placeholder="Ingresar nombre completo" value={registro.nombre} onChange={actualizarReg}/>
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="registro-email">
                                            <Form.Label><b>Correo electrónico</b></Form.Label>
                                            <Form.Control type="email" name="email" placeholder="Ingresar correo electrónico" value={registro.email} onChange={actualizarReg}
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="registro-fecha-nacimiento">
                                            <Form.Label><b>Fecha de nacimiento</b></Form.Label>
                                            <Form.Control type="date" name="fechaNac" value={registro.fechaNac} onChange={actualizarReg}/>
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="registro-comuna">
                                            <Form.Label><b>Comuna</b></Form.Label>
                                            <Form.Select name="comuna" value={registro.comuna} onChange={actualizarReg}>
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
                                            <Form.Control type="text" name="direccion" placeholder="Ingresar dirección" value={registro.direccion} onChange={actualizarReg}/>
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="registro-pass">
                                            <Form.Label><b>Contraseña</b></Form.Label>
                                            <Form.Control type="password" name="pass" placeholder="Ingresar contraseña" value={registro.pass} onChange={actualizarReg}/>
                                        </Form.Group>

                                        <Form.Group className="mb-4" controlId="registro-confirmar-pass">
                                            <Form.Label><b>Confirmar Contraseña</b></Form.Label>
                                            <Form.Control type="password" name="pass2" placeholder="Confirmar contraseña" value={registro.pass2} onChange={actualizarReg}/>
                                        </Form.Group>

                                        {errorRegistro && (
                                            <Alert variant="danger" className="py-2">{errorRegistro}</Alert>
                                        )}

                                        <div className="d-grid gap-2">
                                            <Button variant="success" type="submit">Registrar cuenta</Button>
                                        </div>
                                    </Form>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </section>
    )
}

export default Login