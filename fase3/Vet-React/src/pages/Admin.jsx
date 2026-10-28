import { useEffect, useState } from 'react'
import { Alert, Badge, Button, Card, Col, Container, Form, Modal, Nav, Row, Stack, Table } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'
import { REGIONES, REGION_COMUNAS } from '../utils/validaciones'
import useAdmin from '../hooks/useAdmin'

const CATEGORIAS = ['Antibióticos', 'Antiparasitarios', 'Antiinflamatorios', 'Dermatología', 'Digestivo', 'Cardíaco', 'Analgésicos', 'Vacunas', 'Suplementos']
const ROLES = ['ADMINISTRADOR', 'FUNCIONARIO', 'CLIENTE']
const ESPECIES = ['Perro', 'Gato', 'Ave', 'Conejo']
const ROLES_PANEL = ['FUNCIONARIO', 'ADMINISTRADOR']
const COLOR_ESTADO = { Confirmada: 'success', Anulada: 'secondary' }

const precioCLP = new Intl.NumberFormat('es-CL')
const formatearFecha = (fecha) => fecha?.split('-').reverse().join('-')

const secciones = [
    { id: 'productos', label: 'Gestión de Productos' },
    { id: 'usuarios', label: 'Gestión de Usuarios' },
    { id: 'citas', label: 'Citas' },
    { id: 'mensajes', label: 'Mensajes' },
]

const columnasProductos = [
    { titulo: 'SKU', render: (p) => p.sku },
    { titulo: 'Nombre', render: (p) => p.nombre },
    { titulo: 'Descripción (opcional)', render: (p) => p.descripcion },
    { titulo: 'Precio', render: (p) => `$${precioCLP.format(p.precio)}` },
    { titulo: 'Stock', render: (p) => p.stock },
    { titulo: 'Categoría', render: (p) => p.categoria },
]

const columnasUsuarios = [
    { titulo: 'RUN', render: (u) => u.run || '—' },
    { titulo: 'Nombre', render: (u) => u.nombre },
    { titulo: 'Apellidos', render: (u) => u.apellidos },
    { titulo: 'Correo electrónico', render: (u) => u.email || '—' },
    { titulo: 'Fecha de nacimiento', render: (u) => formatearFecha(u.fechaNac) || '—' },
    { titulo: 'Rol', render: (u) => u.rol },
    { titulo: 'Comuna', render: (u) => u.comuna || '—' },
    { titulo: 'Dirección', render: (u) => u.direccion || '—' },
]

const columnasCitas = [
    { titulo: 'Fecha', render: (c) => formatearFecha(c.fecha) || '' },
    { titulo: 'Hora', render: (c) => c.hora },
    { titulo: 'Nombre mascota', render: (c) => c.nombreMascota },
    { titulo: 'Especie', render: (c) => c.especie },
    { titulo: 'Edad', render: (c) => c.edad },
    { titulo: 'Nombre tutor', render: (c) => c.nombreTutor },
    { titulo: 'Estado cita', render: (c) => <Badge bg={COLOR_ESTADO[c.estado] ?? 'warning'}>{c.estado}</Badge> },
]

function BotonAdmin(props) {
    return <Button className="admin-action-button" {...props} />
}

function SeccionAdmin({ id, titulo, acciones, children }) {
    return (
        <section aria-labelledby={`admin-${id}-title`}>
            <Card className="shadow-sm">
                <Card.Header className="bg-white border-0 pb-0">
                    <Card.Title as="h2" id={`admin-${id}-title`} className="h4 text-success mb-0">{titulo}</Card.Title>
                </Card.Header>
                <Card.Body>
                    {acciones && <Stack direction="horizontal" gap={2} className="admin-actions mb-3">{acciones}</Stack>}
                    {children}
                </Card.Body>
            </Card>
        </section>
    )
}

function TablaSeleccionable({ name, descripcion, columnas, filas, getId, getAriaLabel, seleccionado, onSeleccionar }) {
    return (
        <Table bordered hover responsive className="align-middle mb-0">
            <thead>
            <tr>
                <th className="text-center"><span className="visually-hidden">{descripcion}</span></th>
                {columnas.map(({ titulo }) => <th key={titulo}>{titulo}</th>)}
            </tr>
            </thead>
            <tbody>
            {filas.map((fila) => (
                <tr key={getId(fila)}>
                    <td className="text-center">
                        <Form.Check
                            type="radio"
                            name={name}
                            aria-label={getAriaLabel(fila)}
                            className="d-flex justify-content-center m-0"
                            checked={seleccionado === getId(fila)}
                            onChange={() => onSeleccionar(getId(fila))}
                        />
                    </td>
                    {columnas.map(({ titulo, render }) => <td key={titulo}>{render(fila)}</td>)}
                </tr>
            ))}
            </tbody>
        </Table>
    )
}

function Campo({ id, label, value, onChange, className = 'mb-3', ...props }) {
    return (
        <Form.Group className={className} controlId={id}>
            <Form.Label>{label}</Form.Label>
            <Form.Control value={value ?? ''} onChange={(e) => onChange(e.target.value)} {...props} />
        </Form.Group>
    )
}

function CampoSelect({ id, label, value, onChange, placeholder, opciones, className = 'mb-3', ...props }) {
    return (
        <Form.Group className={className} controlId={id}>
            <Form.Label>{label}</Form.Label>
            <Form.Select value={value ?? ''} onChange={(e) => onChange(e.target.value)} {...props}>
                <option value="">{placeholder}</option>
                {opciones.map((opcion) => <option key={opcion} value={opcion}>{opcion}</option>)}
            </Form.Select>
        </Form.Group>
    )
}

function ModalFormulario({ id, show, titulo, onHide, onSubmit, size, textoGuardar = 'Guardar', children }) {
    return (
        <Modal show={show} onHide={onHide} size={size} aria-labelledby={`${id}-title`}>
            <Form onSubmit={onSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title id={`${id}-title`}>{titulo}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{children}</Modal.Body>
                <Modal.Footer>
                    <BotonAdmin variant="secondary" onClick={onHide}>Cancelar</BotonAdmin>
                    <BotonAdmin variant="primary" type="submit">{textoGuardar}</BotonAdmin>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}

async function confirmarYEjecutar(mensaje, accion) {
    if (!window.confirm(mensaje)) return
    try {
        await accion()
    } catch (error) {
        console.error(error)
    }
}

function Admin() {
    const { usuario } = useAuthContext()
    const navigate = useNavigate()
    const [tabActual, setTabActual] = useState('productos')
    const admin = useAdmin()
    const esFuncionario = usuario?.role === 'FUNCIONARIO'
    const tienePermiso = ROLES_PANEL.includes(usuario?.role)

    useEffect(() => {
        if (!usuario) navigate('/login', { replace: true })
        else if (!tienePermiso) navigate('/', { replace: true })
    }, [navigate, usuario, tienePermiso])

    if (!usuario || !tienePermiso) return null

    const cerrarModal = () => admin.setModal(null)
    const esAgregar = admin.modal?.modo === 'agregar'
    const setP = (cambios) => admin.setProductoForm({ ...admin.productoForm, ...cambios })
    const setU = (cambios) => admin.setUsuarioForm({ ...admin.usuarioForm, ...cambios })
    const setC = (cambios) => admin.setCitaForm({ ...admin.citaForm, ...cambios })
    const { productoForm: pf, usuarioForm: uf, citaForm: cf } = admin

    return (
        <Container as="main" fluid className="py-3 py-md-4">
            <Row className="g-3">
                <Col xs={12} md={3} xl={2} className="bg-light p-2 p-md-3 rounded">
                    <Nav
                        variant="pills"
                        activeKey={tabActual}
                        className="flex-row flex-md-column flex-nowrap gap-2 overflow-auto"
                        onSelect={(id) => {
                            if (!id) return
                            setTabActual(id)
                            admin.setFeedback(null)
                        }}
                    >
                        {secciones.filter(({ id }) => id !== 'usuarios' || !esFuncionario).map(({ id, label }) => (
                            <Nav.Item key={id}>
                                <Nav.Link as="button" type="button" eventKey={id} className="text-start text-nowrap">{label}</Nav.Link>
                            </Nav.Item>
                        ))}
                    </Nav>
                </Col>

                <Col xs={12} md={9} xl={10} className="admin-main-content">
                    {admin.feedback && (
                        <Alert variant={admin.feedback.variant} dismissible onClose={() => admin.setFeedback(null)}>
                            {admin.feedback.message}
                        </Alert>
                    )}

                    {tabActual === 'productos' && (
                        <SeccionAdmin
                            id="productos"
                            titulo="Gestión de Productos"
                            acciones={<>
                                <BotonAdmin variant="success" onClick={() => admin.abrirProducto('agregar')}>+ Agregar</BotonAdmin>
                                <BotonAdmin variant="warning" disabled={admin.productoSeleccionado === null} onClick={() => admin.abrirProducto('modificar')}>Modificar</BotonAdmin>
                                <BotonAdmin variant="danger" disabled={admin.productoSeleccionado === null}
                                            onClick={() => confirmarYEjecutar('¿Eliminar el producto seleccionado? Esta acción no se puede deshacer.', admin.eliminarProducto)}>
                                    Eliminar
                                </BotonAdmin>
                            </>}
                        >
                            <TablaSeleccionable
                                name="producto-seleccionado"
                                descripcion="Seleccionar un producto"
                                columnas={columnasProductos}
                                filas={admin.productosAdmin}
                                getId={(p) => p.sku}
                                getAriaLabel={(p) => `Seleccionar ${p.nombre}`}
                                seleccionado={admin.productoSeleccionado}
                                onSeleccionar={admin.setProductoSeleccionado}
                            />
                        </SeccionAdmin>
                    )}

                    {tabActual === 'usuarios' && !esFuncionario && (
                        <SeccionAdmin
                            id="usuarios"
                            titulo="Gestión de Usuarios"
                            acciones={<>
                                <BotonAdmin variant="success" onClick={admin.agregarUsuario}>+ Agregar</BotonAdmin>
                                <BotonAdmin variant="warning" disabled={admin.usuarioSeleccionado === null} onClick={admin.modificarUsuario}>Modificar</BotonAdmin>
                                <BotonAdmin variant="danger" disabled={admin.usuarioSeleccionado === null}
                                            onClick={() => confirmarYEjecutar('¿Eliminar el usuario seleccionado? Esta acción no se puede deshacer.', admin.eliminarUsuario)}>
                                    Eliminar
                                </BotonAdmin>
                            </>}
                        >
                            <TablaSeleccionable
                                name="usuario-seleccionado"
                                descripcion="Seleccionar un usuario"
                                columnas={columnasUsuarios}
                                filas={admin.usuarios}
                                getId={(u) => u.id}
                                getAriaLabel={(u) => `Seleccionar a ${u.nombre} ${u.apellidos}`}
                                seleccionado={admin.usuarioSeleccionado}
                                onSeleccionar={admin.setUsuarioSeleccionado}
                            />
                        </SeccionAdmin>
                    )}

                    {tabActual === 'citas' && (
                        <SeccionAdmin
                            id="citas"
                            titulo="Gestión de Citas"
                            acciones={<>
                                <BotonAdmin variant="success" disabled={admin.citaSeleccionada === null} onClick={() => admin.actualizarEstadoCita('Confirmada')}>Confirmar</BotonAdmin>
                                <BotonAdmin variant="warning" disabled={admin.citaSeleccionada === null} onClick={admin.abrirCita}>Modificar</BotonAdmin>
                                <BotonAdmin variant="danger" disabled={admin.citaSeleccionada === null} onClick={() => admin.actualizarEstadoCita('Anulada')}>Anular</BotonAdmin>
                            </>}
                        >
                            <TablaSeleccionable
                                name="cita-seleccionada"
                                descripcion="Seleccionar una cita"
                                columnas={columnasCitas}
                                filas={admin.citas}
                                getId={(c) => c.id}
                                getAriaLabel={(c) => `Seleccionar cita de ${c.nombreMascota}`}
                                seleccionado={admin.citaSeleccionada}
                                onSeleccionar={admin.setCitaSeleccionada}
                            />
                        </SeccionAdmin>
                    )}

                    {tabActual === 'mensajes' && (
                        <SeccionAdmin id="mensajes" titulo="Mensajes">
                            <Alert variant="info" className="mb-0">No hay mensajes nuevos por el momento.</Alert>
                        </SeccionAdmin>
                    )}
                </Col>
            </Row>

            <ModalFormulario id="admin-producto-modal" size="lg" show={admin.modal?.tipo === 'producto'} onHide={cerrarModal} onSubmit={admin.guardarProducto}
                             titulo={esAgregar ? 'Agregar Producto' : 'Modificar Producto'}>
                <Campo id="producto-sku" label="Código producto (SKU)" required value={pf.sku} onChange={(v) => setP({ sku: v })} placeholder="Ej: ME023" />
                <Campo id="producto-nombre" label="Nombre" required value={pf.nombre} onChange={(v) => setP({ nombre: v })} placeholder="Ingresar nombre del producto" />
                <Campo id="producto-descripcion" label="Descripción (opcional)" as="textarea" rows={2} value={pf.descripcion} onChange={(v) => setP({ descripcion: v })} placeholder="Descripción del producto" />
                <Campo id="producto-precio" label="Precio" required type="number" min="0" step="1" value={pf.precio} onChange={(v) => setP({ precio: v })} placeholder="Ej: 4200" />
                <Campo id="producto-stock" label="Stock" required type="number" min="0" step="1" value={pf.stock} onChange={(v) => setP({ stock: v })} placeholder="Cantidad en stock" />
                <CampoSelect id="producto-categoria" label="Categoría" required className="" value={pf.categoria} onChange={(v) => setP({ categoria: v })} placeholder="Seleccionar categoría" opciones={CATEGORIAS} />
            </ModalFormulario>

            <ModalFormulario id="admin-usuario-modal" size="lg" show={admin.modal?.tipo === 'usuario'} onHide={cerrarModal} onSubmit={admin.guardarUsuario}
                             titulo={esAgregar ? 'Agregar Usuario' : 'Modificar Usuario'}>
                <Campo id="usuario-run" label="RUN (sin dígito verificador)" required maxLength={9} value={uf.run} onChange={(v) => setU({ run: v })} placeholder="Ingresar RUN" />
                <Campo id="usuario-nombre" label="Nombre" required maxLength={30} value={uf.nombre} onChange={(v) => setU({ nombre: v })} placeholder="Ingresar nombre" />
                <Campo id="usuario-apellidos" label="Apellidos" required maxLength={30} value={uf.apellidos} onChange={(v) => setU({ apellidos: v })} placeholder="Ingresar apellidos" />
                <Campo id="usuario-email" label="Correo electrónico" required type="email" maxLength={40} value={uf.email} onChange={(v) => setU({ email: v })} placeholder="Ingresar correo electrónico" />
                <Campo id="usuario-fecha" label="Fecha de nacimiento" required type="date" value={uf.fechaNac} onChange={(v) => setU({ fechaNac: v })} />
                <CampoSelect id="usuario-rol" label="Rol" required value={uf.rol} onChange={(v) => setU({ rol: v })} placeholder="Seleccionar rol" opciones={ROLES} />
                <CampoSelect id="usuario-region" label="Región" required value={uf.region} onChange={(v) => setU({ region: v, comuna: '' })} placeholder="Seleccionar región" opciones={REGIONES} />
                <CampoSelect id="usuario-comuna" label="Comuna" required disabled={!uf.region} value={uf.comuna} onChange={(v) => setU({ comuna: v })}
                             placeholder={uf.region ? 'Seleccionar comuna' : 'Primero selecciona una región'} opciones={REGION_COMUNAS[uf.region] ?? []} />
                <Campo id="usuario-direccion" label="Dirección" required maxLength={300} value={uf.direccion} onChange={(v) => setU({ direccion: v })} placeholder="Ingresar dirección" />
                <Campo id="usuario-password" className="" label={esAgregar ? 'Contraseña' : 'Nueva contraseña (opcional)'} type="password" maxLength={72} required={esAgregar}
                       value={uf.password} onChange={(v) => setU({ password: v })}
                       placeholder={esAgregar ? 'Ingresar contraseña' : 'Dejar vacío para mantener la actual'} />
            </ModalFormulario>

            <ModalFormulario id="admin-cita-modal" show={admin.modal?.tipo === 'cita'} onHide={cerrarModal} onSubmit={admin.guardarCita}
                             titulo="Modificar Cita" textoGuardar="Guardar cambios">
                <Campo id="cita-fecha" label="Fecha" required type="date" value={cf.fecha} onChange={(v) => setC({ fecha: v })} />
                <Campo id="cita-hora" label="Hora" required type="time" value={cf.hora} onChange={(v) => setC({ hora: v })} />
                <Campo id="cita-mascota" label="Nombre mascota" required value={cf.nombreMascota} onChange={(v) => setC({ nombreMascota: v })} />
                <CampoSelect id="cita-especie" label="Especie" required value={cf.especie} onChange={(v) => setC({ especie: v })} placeholder="Seleccionar especie" opciones={ESPECIES} />
                <Campo id="cita-edad" label="Edad" required type="number" min="0" step="1" value={cf.edad} onChange={(v) => setC({ edad: v })} />
                <Campo id="cita-tutor" className="" label="Nombre tutor" required value={cf.nombreTutor} onChange={(v) => setC({ nombreTutor: v })} />
            </ModalFormulario>
        </Container>
    )
}

export default Admin