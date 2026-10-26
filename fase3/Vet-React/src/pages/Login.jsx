import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Container, Row, Col, Card, Form, Button, Alert, Nav } from 'react-bootstrap'
import { useAuthContext } from '../context/AuthContext'
import useFormulario from '../hooks/useFormulario'
import { reglasLogin, reglasRegistro } from '../utils/validaciones'
const loginInicial = { email: '', pass: '' }
const registroInicial = { run: '', nombre: '', email: '', fechaNac: '', comuna: '', direccion: '', pass: '', pass2: '' }

function Login() {
    const { usuario, login, registrar } = useAuthContext()
    const [tab, setTab] = useState('login')
    const [exito, setExito] = useState('')

    const formularioLogin = useFormulario(loginInicial, reglasLogin, (valores) => {
        const resultado = login(valores.email.trim(), valores.pass)
        return resultado.ok ? null : resultado.error
    })

    const formularioRegistro = useFormulario(registroInicial, reglasRegistro, (valores) => {
        const resultado = registrar(valores)
        if (!resultado.ok) return resultado.error

        setExito('¡Registro completado! Ahora puedes iniciar sesión.')
        setTab('login')
        return null
    })

    const { valores: credenciales, errores: erroresLogin, errorGeneral: errorLogin, handleChange: actualizarLogin, handleSubmit: enviarLogin, limpiarErrores: limpiarErroresLogin } = formularioLogin
    const { valores: registro, errores: erroresRegistro, errorGeneral: errorRegistro, handleChange: actualizarRegistro, handleSubmit: enviarRegistro, limpiarErrores: limpiarErroresRegistro } = formularioRegistro

    if (usuario) {
        const puedeAdministrar = ['Funcionario', 'Administrador'].includes(usuario.role)
        return <Navigate to={puedeAdministrar ? '/admin' : '/'} replace />
    }

    const handleTabChange = (key) => {
        setTab(key)
        limpiarErroresLogin()
        limpiarErroresRegistro()
        setExito('')
    }

    const actualizarCampoLogin = (event) => {
        setExito('')
        actualizarLogin(event)
    }

    const actualizarCampoRegistro = (event) => {
        setExito('')
        actualizarRegistro(event)
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
                                    <Form id="login-form" onSubmit={enviarLogin} noValidate>
                                        {exito && (
                                            <Alert variant="success" className="py-2">{exito}</Alert>
                                        )}

                                        <Form.Group className="mb-3" controlId="email">
                                            <Form.Label><b>Correo electrónico</b></Form.Label>
                                            <Form.Control type="email" name="email" placeholder="Ingresar correo electrónico" value={credenciales.email} onChange={actualizarCampoLogin} isInvalid={!!erroresLogin.email}/>
                                            <Form.Control.Feedback type="invalid">{erroresLogin.email}</Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group className="mb-4" controlId="pass">
                                            <Form.Label><b>Contraseña</b></Form.Label>
                                            <Form.Control type="password" name="pass" placeholder="Ingresar contraseña" value={credenciales.pass} onChange={actualizarCampoLogin} isInvalid={!!erroresLogin.pass}/>
                                            <Form.Control.Feedback type="invalid">{erroresLogin.pass}</Form.Control.Feedback>
                                        </Form.Group>

                                        {errorLogin && (
                                            <Alert variant="danger" className="py-2">{errorLogin}</Alert>
                                        )}

                                        <div className="d-grid gap-2">
                                            <Button variant="success" type="submit">Iniciar sesión</Button>
                                        </div>
                                    </Form>
                                ) : (
                                    <Form id="signup-form" onSubmit={enviarRegistro} noValidate>
                                        <Form.Group className="mb-3" controlId="registro-run">
                                            <Form.Label><b>RUN</b></Form.Label>
                                            <Form.Control type="text" name="run" placeholder="Ingresar RUN" value={registro.run} onChange={actualizarCampoRegistro} isInvalid={!!erroresRegistro.run}/>
                                            <Form.Control.Feedback type="invalid">{erroresRegistro.run}</Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="registro-nombre">
                                            <Form.Label><b>Nombre</b></Form.Label>
                                            <Form.Control type="text" name="nombre" placeholder="Ingresar nombre" value={registro.nombre} onChange={actualizarCampoRegistro} isInvalid={!!erroresRegistro.nombre}/>
                                            <Form.Control.Feedback type="invalid">{erroresRegistro.nombre}</Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="registro-epellidos">
                                            <Form.Label><b>Apellidos</b></Form.Label>
                                            <Form.Control type="text" name="apellidos" placeholder="Ingresar apellidos" value={registro.apellidos} onChange={actualizarCampoRegistro} isInvalid={!!erroresRegistro.apellidos}/>
                                            <Form.Control.Feedback type="invalid">{erroresRegistro.apellidos}</Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="registro-email">
                                            <Form.Label><b>Correo electrónico</b></Form.Label>
                                            <Form.Control type="email" name="email" placeholder="Ingresar correo electrónico" value={registro.email} onChange={actualizarCampoRegistro} isInvalid={!!erroresRegistro.email}/>
                                            <Form.Control.Feedback type="invalid">{erroresRegistro.email}</Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="registro-fecha-nacimiento">
                                            <Form.Label><b>Fecha de nacimiento</b></Form.Label>
                                            <Form.Control type="date" name="fechaNac" value={registro.fechaNac} onChange={actualizarCampoRegistro} isInvalid={!!erroresRegistro.fechaNac}/>
                                            <Form.Control.Feedback type="invalid">{erroresRegistro.fechaNac}</Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="registro-comuna">
                                            <Form.Label><b>Comuna</b></Form.Label>
                                            <Form.Select name="comuna" value={registro.comuna} onChange={actualizarCampoRegistro} isInvalid={!!erroresRegistro.comuna}>
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
                                            <Form.Control.Feedback type="invalid">{erroresRegistro.comuna}</Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="registro-direccion">
                                            <Form.Label><b>Dirección</b></Form.Label>
                                            <Form.Control type="text" name="direccion" placeholder="Ingresar dirección" value={registro.direccion} onChange={actualizarCampoRegistro} isInvalid={!!erroresRegistro.direccion}/>
                                            <Form.Control.Feedback type="invalid">{erroresRegistro.direccion}</Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="registro-pass">
                                            <Form.Label><b>Contraseña</b></Form.Label>
                                            <Form.Control type="password" name="pass" placeholder="Ingresar contraseña" value={registro.pass} onChange={actualizarCampoRegistro} isInvalid={!!erroresRegistro.pass}/>
                                            <Form.Control.Feedback type="invalid">{erroresRegistro.pass}</Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group className="mb-4" controlId="registro-confirmar-pass">
                                            <Form.Label><b>Confirmar Contraseña</b></Form.Label>
                                            <Form.Control type="password" name="pass2" placeholder="Confirmar contraseña" value={registro.pass2} onChange={actualizarCampoRegistro} isInvalid={!!erroresRegistro.pass2}/>
                                            <Form.Control.Feedback type="invalid">{erroresRegistro.pass2}</Form.Control.Feedback>
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