import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Container, Row, Col, Card, Form, Button, Alert, Nav } from 'react-bootstrap'
import { useAuthContext } from '../context/AuthContext'
import useFormulario from '../hooks/useFormulario'
import { reglasLogin, reglasRegistro, REGIONES, REGION_COMUNAS } from '../utils/validaciones'

const loginInicial = { email: '', pass: '' }
const registroInicial = { run: '', nombre: '', apellidos: '', email: '', fechaNac: '', region: '', comuna: '', direccion: '', pass: '', pass2: '' }

const CAMPOS_REGISTRO = [
    { name: 'run', label: 'RUN', placeholder: 'Ingresar RUN' },
    { name: 'nombre', label: 'Nombre', placeholder: 'Ingresar nombre' },
    { name: 'apellidos', label: 'Apellidos', placeholder: 'Ingresar apellidos' },
    { name: 'email', label: 'Correo electrónico', type: 'email', placeholder: 'Ingresar correo electrónico' },
    { name: 'fechaNac', label: 'Fecha de nacimiento', type: 'date' },
    { name: 'region', label: 'Región', opciones: REGIONES, placeholder: 'Seleccionar región' },
    { name: 'comuna', label: 'Comuna',
        opcionesFn:    (v) => REGION_COMUNAS[v.region] ?? [],
        placeholderFn: (v) => v.region ? 'Seleccionar comuna' : 'Primero selecciona una región',
        disabledFn:    (v) => !v.region },
    { name: 'direccion', label: 'Dirección', placeholder: 'Ingresar dirección' },
    { name: 'pass', label: 'Contraseña', type: 'password', placeholder: 'Ingresar contraseña' },
    { name: 'pass2', label: 'Confirmar Contraseña',type: 'password', placeholder: 'Confirmar contraseña' },
]

function Login() {
    const { usuario, login, registrar } = useAuthContext()
    const [tab, setTab] = useState('login')
    const [exito, setExito] = useState('')

    const formularioLogin = useFormulario(loginInicial, reglasLogin, async (valores) => {
        const r = await login(valores.email.trim(), valores.pass)
        return r.ok ? null : r.error
    })
    const formularioRegistro = useFormulario(registroInicial, reglasRegistro, async (valores) => {
        const r = await registrar(valores)
        if (!r.ok) return r.error
        setExito('¡Registro completado! Ahora puedes iniciar sesión.')
        setTab('login')
        return null
    })

    const { valores: credenciales, errores: erroresLogin, errorGeneral: errorLogin, enviando: enviandoLogin, handleChange: actualizarLogin, handleSubmit: enviarLogin, limpiarErrores: limpiarErroresLogin } = formularioLogin
    const { valores: registro, errores: erroresRegistro, errorGeneral: errorRegistro, enviando: enviandoRegistro, handleChange: actualizarRegistro, handleSubmit: enviarRegistro, limpiarErrores: limpiarErroresRegistro } = formularioRegistro

    if (usuario) {
        const puedeAdministrar = ['FUNCIONARIO', 'ADMINISTRADOR'].includes(usuario.role)
        return <Navigate to={puedeAdministrar ? '/admin' : '/'} replace />
    }

    const handleTabChange = (key) => {
        setTab(key); limpiarErroresLogin(); limpiarErroresRegistro(); setExito('')
    }
    const actualizarCampoLogin = (e) => { setExito(''); actualizarLogin(e) }
    const actualizarCampoRegistro = (e) => {
        setExito('')
        if (e.target.name === 'region') actualizarRegistro({ target: { name: 'comuna', value: '' } })
        actualizarRegistro(e)
    }

    return (
        <section id="login" className="auth standard-section py-5">
            <Container>
                <Row className="justify-content-center">
                    <Col xs={12} md={8} lg={6}>
                        <Card className="shadow-sm border">
                            <Card.Body className="p-4 p-md-5">
                                <Nav variant="tabs" activeKey={tab} onSelect={handleTabChange} className="login-tabs mb-4">
                                    <Nav.Item><Nav.Link eventKey="login">Iniciar sesión</Nav.Link></Nav.Item>
                                    <Nav.Item><Nav.Link eventKey="registro">Registrar cuenta</Nav.Link></Nav.Item>
                                </Nav>

                                {tab === 'login' ? (
                                    <Form id="login-form" onSubmit={enviarLogin} noValidate>
                                        {exito && <Alert variant="success" className="py-2">{exito}</Alert>}
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
                                        {errorLogin && <Alert variant="danger" className="py-2">{errorLogin}</Alert>}
                                        <div className="d-grid gap-2">
                                            <Button variant="success" type="submit" disabled={enviandoLogin}>
                                                {enviandoLogin ? 'Ingresando...' : 'Iniciar sesión'}
                                            </Button>
                                        </div>
                                    </Form>
                                ) : (
                                    <Form id="signup-form" onSubmit={enviarRegistro} noValidate>
                                        {CAMPOS_REGISTRO.map((c) => {
                                            const opciones = c.opcionesFn ? c.opcionesFn(registro) : c.opciones
                                            const placeholder = c.placeholderFn ? c.placeholderFn(registro) : c.placeholder
                                            const disabled = c.disabledFn ? c.disabledFn(registro) : false
                                            return (
                                                <Form.Group key={c.name} className="mb-3" controlId={`registro-${c.name}`}>
                                                    <Form.Label><b>{c.label}</b></Form.Label>
                                                    {opciones ? (
                                                        <Form.Select name={c.name} value={registro[c.name]} onChange={actualizarCampoRegistro} isInvalid={!!erroresRegistro[c.name]} disabled={disabled}>
                                                            <option value="" disabled>{placeholder}</option>
                                                            {opciones.map((o) => <option key={o} value={o}>{o}</option>)}
                                                        </Form.Select>
                                                    ) : (
                                                        <Form.Control type={c.type ?? 'text'} name={c.name} placeholder={placeholder} value={registro[c.name]} onChange={actualizarCampoRegistro} isInvalid={!!erroresRegistro[c.name]} />
                                                    )}
                                                    <Form.Control.Feedback type="invalid">{erroresRegistro[c.name]}</Form.Control.Feedback>
                                                </Form.Group>
                                            )
                                        })}
                                        {errorRegistro && <Alert variant="danger" className="py-2">{errorRegistro}</Alert>}
                                        <div className="d-grid gap-2">
                                            <Button variant="success" type="submit" disabled={enviandoRegistro}>
                                                {enviandoRegistro ? 'Registrando...' : 'Registrar cuenta'}
                                            </Button>
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