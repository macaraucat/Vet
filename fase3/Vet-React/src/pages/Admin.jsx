import { useEffect, useState } from 'react'
import { Alert, Badge, Button, Card, Col, Container, Form, Modal, Nav, Offcanvas, Row, Stack, Table } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'
import { REGIONES, REGION_COMUNAS } from '../utils/validaciones'
import { apiMe } from '../services/authApi'
import useAdmin from '../hooks/useAdmin'

const CATEGORIAS = ['Antibióticos', 'Antiparasitarios', 'Antiinflamatorios', 'Dermatología', 'Digestivo', 'Cardíaco', 'Analgésicos', 'Vacunas', 'Suplementos']
const ROLES = ['ADMINISTRADOR', 'FUNCIONARIO', 'CLIENTE']
const ESPECIES = ['Perro', 'Gato', 'Ave', 'Conejo']
const ROLES_PANEL = ['FUNCIONARIO', 'ADMINISTRADOR']
const COLOR_ESTADO = { Confirmada: 'success', Anulada: 'secondary' }

const precioCLP = new Intl.NumberFormat('es-CL')
const formatearFecha = (fecha) => fecha?.split('-').reverse().join('-')

const ICONOS = {
    dashboard: '/img/icons/dashboard.svg',
    usuarios: '/img/icons/usuarios.svg',
    productos: '/img/icons/productos.svg',
    citas: '/img/icons/citas.svg',
    mensajes: '/img/icons/mensajes.svg',
    perfil: '/img/icons/perfil.svg',
}

const DESCRIPCIONES = {
    dashboard: 'Visión general de todas las métricas y estadísticas clave del sistema.',
    usuarios: 'Gestión de cuentas de usuario y sus roles dentro del sistema.',
    productos: 'Administrar inventario y detalles de los productos disponibles.',
    citas: 'Gestión y seguimiento de las citas agendadas por los clientes.',
    mensajes: 'Bandeja de entrada con las consultas enviadas por los clientes.',
    perfil: 'Administración de la información personal y configuraciones de cuenta.'
}

const secciones = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'usuarios', label: 'Usuarios' },
    { id: 'productos', label: 'Productos' },
    { id: 'citas', label: 'Citas' },
    { id: 'mensajes', label: 'Mensajes' },
    { id: 'perfil', label: 'Perfil' },
]

// ... (las configuraciones de columnasProductos, columnasUsuarios, columnasCitas, ESTILO_BOTON, etc., se mantienen igual)
const columnasProductos = [
    { titulo: 'SKU', render: (p) => p.sku },
    { titulo: 'Nombre', render: (p) => p.nombre },
    { titulo: 'Descripción', render: (p) => p.descripcion },
    { titulo: 'Precio', render: (p) => `$${precioCLP.format(p.precio)}` },
    { titulo: 'Stock', render: (p) => p.stock },
    { titulo: 'Categoría', render: (p) => p.categoria },
]

const columnasUsuarios = [
    { titulo: 'RUN', render: (u) => u.run || '—' },
    { titulo: 'Nombre', render: (u) => u.nombre },
    { titulo: 'Apellidos', render: (u) => u.apellidos },
    { titulo: 'Correo', render: (u) => u.email || '—' },
    { titulo: 'F. Nacimiento', render: (u) => formatearFecha(u.fechaNac) || '—' },
    { titulo: 'Rol', render: (u) => u.rol },
    { titulo: 'Comuna', render: (u) => u.comuna || '—' },
    { titulo: 'Dirección', render: (u) => u.direccion || '—' },
]

const columnasCitas = [
    { titulo: 'Fecha', render: (c) => formatearFecha(c.fecha) || '' },
    { titulo: 'Hora', render: (c) => c.hora },
    { titulo: 'Mascota', render: (c) => c.nombreMascota },
    { titulo: 'Especie', render: (c) => c.especie },
    { titulo: 'Edad', render: (c) => c.edad },
    { titulo: 'Tutor', render: (c) => c.nombreTutor },
    { titulo: 'Estado', render: (c) => <Badge bg={COLOR_ESTADO[c.estado] ?? 'warning'}>{c.estado}</Badge> },
]

const ESTILO_BOTON = {
    primario: 'admin-btn-primario',
    secundario: 'admin-btn-secundario',
    peligro: 'admin-btn-peligro',
}

function BotonAdmin({ tipo = 'secundario', className = '', ...props }) {
    return (
        <Button
            variant=""
            className={`admin-action-button ${ESTILO_BOTON[tipo] ?? 'admin-btn-secundario'} ${className}`.trim()}
            {...props}
        />
    )
}

function SeccionAdmin({ id, titulo, acciones, children }) {
    return (
        <section aria-labelledby={`admin-${id}-title`} className="h-100">
            <Card className="shadow-sm border-0 h-100">
                <Card.Header className="bg-white border-0 pt-3 pb-0">
                    <Card.Title as="h2" id={`admin-${id}-title`} className="h4 admin-titulo mb-0">{titulo}</Card.Title>
                </Card.Header>
                <Card.Body className="d-flex flex-column">
                    {acciones && <Stack direction="horizontal" gap={2} className="admin-actions mb-3">{acciones}</Stack>}
                    <div className="flex-grow-1 overflow-auto">
                        {children}
                    </div>
                </Card.Body>
            </Card>
        </section>
    )
}

// ... (TablaSeleccionable, Campo, CampoSelect, ModalFormulario, confirmarYEjecutar, TarjetaKPI, PerfilUsuario se mantienen igual)
function TablaSeleccionable({ name, descripcion, columnas, filas, getId, getAriaLabel, seleccionado, onSeleccionar }) {
    return (
        <Table bordered hover responsive className="align-middle mb-0 admin-tabla">
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
                    <BotonAdmin tipo="secundario" onClick={onHide}>Cancelar</BotonAdmin>
                    <BotonAdmin tipo="primario" type="submit">{textoGuardar}</BotonAdmin>
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

function TarjetaKPI({ valor, etiqueta, cargando, icono }) {
    return (
        <Card className="shadow-sm h-100 text-center border-0">
            <Card.Body className="d-flex flex-column align-items-center justify-content-center py-4">
                {icono && <img src={icono} alt="" className="kpi-icon mb-2" />}
                <Card.Title as="h3" className="admin-titulo mb-1 fw-bold" style={{ fontSize: '2rem' }}>
                    {cargando ? '…' : valor}
                </Card.Title>
                <Card.Text className="text-muted mb-0 fw-semibold">{etiqueta}</Card.Text>
            </Card.Body>
        </Card>
    )
}

function PerfilUsuario({ onLogout }) {
    const [datos, setDatos] = useState(null)
    const [error, setError] = useState('')
    const [cargando, setCargando] = useState(true)

    useEffect(() => {
        let activo = true
        apiMe()
            .then((d) => { if (activo) setDatos(d) })
            .catch((e) => { if (activo) setError(e.message || 'No se pudo cargar el perfil.') })
            .finally(() => { if (activo) setCargando(false) })
        return () => { activo = false }
    }, [])

    if (cargando) return <Alert variant="info" className="mb-0">Cargando perfil...</Alert>
    if (error) return <Alert variant="danger" className="mb-0">{error}</Alert>
    if (!datos) return null

    return (
        <div className="overflow-auto">
            <Row className="g-3 mb-3">
                <Col xs={12} md={6}>
                    <p className="mb-1"><strong>RUN:</strong> {datos.run || '—'}</p>
                    <p className="mb-1"><strong>Nombre:</strong> {datos.nombre} {datos.apellidos}</p>
                    <p className="mb-1"><strong>Correo:</strong> {datos.email}</p>
                    <p className="mb-1"><strong>Fecha de nacimiento:</strong> {formatearFecha(datos.fechaNac) || '—'}</p>
                </Col>
                <Col xs={12} md={6}>
                    <p className="mb-1"><strong>Rol:</strong> {datos.rol}</p>
                    <p className="mb-1"><strong>Región:</strong> {datos.region || '—'}</p>
                    <p className="mb-1"><strong>Comuna:</strong> {datos.comuna || '—'}</p>
                    <p className="mb-1"><strong>Dirección:</strong> {datos.direccion || '—'}</p>
                </Col>
            </Row>
            <div className="text-end">
                <BotonAdmin tipo="peligro" onClick={onLogout}>Cerrar sesión</BotonAdmin>
            </div>
        </div>
    )
}

// --- COMPONENTE DEL MENÚ LATERAL REUTILIZABLE ---
function SidebarMenu({ tabActual, setTabActual, seccionesVisibles, admin }) {
    return (
        <Nav
            variant="pills"
            activeKey={tabActual}
            className="admin-sidebar-nav"
            onSelect={(id) => {
                if (!id) return
                setTabActual(id)
                admin.setFeedback(null)
            }}
        >
            {seccionesVisibles.map(({ id, label }) => (
                <Nav.Item key={id} className="w-100 d-flex justify-content-center">
                    <Nav.Link as="button" type="button" eventKey={id} className="admin-sidebar-link">
                        <img src={ICONOS[id]} alt="" width="20" height="20" />
                        <span>{label}</span>
                    </Nav.Link>
                </Nav.Item>
            ))}
        </Nav>
    )
}

function Admin() {
    const { usuario, logout } = useAuthContext()
    const navigate = useNavigate()
    const [tabActual, setTabActual] = useState('dashboard')
    const [mostrarSidebar, setMostrarSidebar] = useState(false) // Para móviles
    const admin = useAdmin()
    const esFuncionario = usuario?.role === 'FUNCIONARIO'
    const tienePermiso = ROLES_PANEL.includes(usuario?.role)
    const totalMensajes = 0

    useEffect(() => {
        if (!usuario) navigate('/login', { replace: true })
        else if (!tienePermiso) navigate('/', { replace: true })
    }, [navigate, usuario, tienePermiso])

    useEffect(() => {
        if (esFuncionario && tabActual === 'usuarios') setTabActual('dashboard')
    }, [esFuncionario, tabActual])

    if (!usuario || !tienePermiso) return null

    const cerrarModal = () => admin.setModal(null)
    const esAgregar = admin.modal?.modo === 'agregar'
    const setP = (cambios) => admin.setProductoForm({ ...admin.productoForm, ...cambios })
    const setU = (cambios) => admin.setUsuarioForm({ ...admin.usuarioForm, ...cambios })
    const setC = (cambios) => admin.setCitaForm({ ...admin.citaForm, ...cambios })
    const { productoForm: pf, usuarioForm: uf, citaForm: cf } = admin

    const seccionesVisibles = secciones.filter(({ id }) => !(esFuncionario && id === 'usuarios'))

    const handleLogout = () => {
        logout()
        navigate('/login', { replace: true })
    }

    const handleTabClick = (id) => {
        setTabActual(id)
        admin.setFeedback(null)
        setMostrarSidebar(false) // Cierra el menú en móvil al hacer clic
    }

    return (
        <div className="admin-layout">
            {/* Botón menú móvil */}
            <div className="d-md-none bg-verde text-white p-3 d-flex align-items-center shadow-sm" style={{ zIndex: 1050 }}>
                <Button variant="link" className="text-white p-0 me-3 border-0" onClick={() => setMostrarSidebar(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
                    </svg>
                </Button>
                <span className="fw-bold">Panel de Administración</span>
            </div>

            {/* Sidebar Desktop */}
            <aside className="admin-sidebar-wrapper d-none d-md-flex">
                <h5 className="admin-sidebar-title">Panel de Administración</h5>
                <SidebarMenu tabActual={tabActual} setTabActual={handleTabClick} seccionesVisibles={seccionesVisibles} admin={admin} />
            </aside>

            {/* Sidebar Mobile (Offcanvas) */}
            <Offcanvas show={mostrarSidebar} onHide={() => setMostrarSidebar(false)} className="admin-offcanvas bg-verde">
                <Offcanvas.Header closeButton closeVariant="white" className="border-bottom border-light">
                    <Offcanvas.Title className="text-white fw-bold">Menú</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body className="p-0 pt-3">
                    <SidebarMenu tabActual={tabActual} setTabActual={handleTabClick} seccionesVisibles={seccionesVisibles} admin={admin} />
                </Offcanvas.Body>
            </Offcanvas>

            {/* Área de contenido principal */}
            <main className="admin-content-area">
                <div className="admin-content-inner">
                    {admin.feedback && (
                        <Alert variant={admin.feedback.variant} dismissible onClose={() => admin.setFeedback(null)}>
                            {admin.feedback.message}
                        </Alert>
                    )}

                    {tabActual === 'dashboard' && (
                        <SeccionAdmin id="dashboard" titulo="Dashboard">
                            <Row className="g-3 mb-4">
                                {!esFuncionario && (
                                    <Col xs={12} sm={6} xl={3}>
                                        <TarjetaKPI
                                            valor={admin.usuarios.length}
                                            etiqueta="Usuarios registrados"
                                            cargando={admin.cargandoUsuarios}
                                            icono={ICONOS.usuarios}
                                        />
                                    </Col>
                                )}
                                <Col xs={12} sm={6} xl={3}>
                                    <TarjetaKPI valor={admin.productosAdmin.length} etiqueta="Productos en catálogo" icono={ICONOS.productos} />
                                </Col>
                                <Col xs={12} sm={6} xl={3}>
                                    <TarjetaKPI valor={admin.citas.length} etiqueta="Citas registradas" icono={ICONOS.citas} />
                                </Col>
                                <Col xs={12} sm={6} xl={3}>
                                    <TarjetaKPI valor={totalMensajes} etiqueta="Mensajes recibidos" icono={ICONOS.mensajes} />
                                </Col>
                            </Row>

                            <Row className="g-3">
                                {seccionesVisibles.map(({ id, label }) => (
                                    <Col xs={12} sm={6} lg={4} key={id}>
                                        <div className="dashboard-card" onClick={() => handleTabClick(id)}>
                                            <img src={ICONOS[id]} alt={label} className="dashboard-card-icon" />
                                            <h5>{label}</h5>
                                            <p>{DESCRIPCIONES[id]}</p>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        </SeccionAdmin>
                    )}

                    {tabActual === 'productos' && (
                        <SeccionAdmin
                            id="productos"
                            titulo="Gestión de Productos"
                            acciones={<>
                                <BotonAdmin tipo="primario" onClick={() => admin.abrirProducto('agregar')}>+ Agregar</BotonAdmin>
                                <BotonAdmin tipo="secundario" disabled={admin.productoSeleccionado === null} onClick={() => admin.abrirProducto('modificar')}>Modificar</BotonAdmin>
                                <BotonAdmin tipo="peligro" disabled={admin.productoSeleccionado === null}
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
                                <BotonAdmin tipo="primario" onClick={admin.agregarUsuario}>+ Agregar</BotonAdmin>
                                <BotonAdmin tipo="secundario" disabled={admin.usuarioSeleccionado === null} onClick={admin.modificarUsuario}>Modificar</BotonAdmin>
                                <BotonAdmin tipo="peligro" disabled={admin.usuarioSeleccionado === null}
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
                                <BotonAdmin tipo="primario" disabled={admin.citaSeleccionada === null} onClick={() => admin.actualizarEstadoCita('Confirmada')}>Confirmar</BotonAdmin>
                                <BotonAdmin tipo="secundario" disabled={admin.citaSeleccionada === null} onClick={admin.abrirCita}>Modificar</BotonAdmin>
                                <BotonAdmin tipo="peligro" disabled={admin.citaSeleccionada === null} onClick={() => admin.actualizarEstadoCita('Anulada')}>Anular</BotonAdmin>
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

                    {tabActual === 'perfil' && (
                        <SeccionAdmin id="perfil" titulo="Mi Perfil">
                            <PerfilUsuario onLogout={handleLogout} />
                        </SeccionAdmin>
                    )}
                </div>
            </main>

            {/* Modales */}
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
                <Campo id="usuario-run" label="RUN (sin puntos ni guion)" required maxLength={9} value={uf.run} onChange={(v) => setU({ run: v })} placeholder="Ingresar RUN" />
                <Campo id="usuario-nombre" label="Nombre" required maxLength={30} value={uf.nombre} onChange={(v) => setU({ nombre: v })} placeholder="Ingresar nombre" />
                <Campo id="usuario-apellidos" label="Apellidos" required maxLength={30} value={uf.apellidos} onChange={(v) => setU({ apellidos: v })} placeholder="Ingresar apellidos" />
                <Campo id="usuario-email" label="Correo electrónico" required type="email" maxLength={40} value={uf.email} onChange={(v) => setU({ email: v })} placeholder="Ingresar correo electrónico" />
                <Campo id="usuario-fecha" label="Fecha de nacimiento" required type="date" value={uf.fechaNac} onChange={(v) => setU({ fechaNac: v })} />
                <CampoSelect id="usuario-rol" label="Rol" required value={uf.rol} onChange={(v) => setU({ rol: v })} placeholder="Seleccionar rol" opciones={ROLES} />
                <CampoSelect id="usuario-region" label="Región" required value={uf.region} onChange={(v) => setU({ region: v, comuna: '' })} placeholder="Seleccionar región" opciones={REGIONES} />
                <CampoSelect id="usuario-comuna" label="Comuna" required disabled={!uf.region} value={uf.comuna} onChange={(v) => setU({ comuna: v })}
                             placeholder={uf.region ? 'Seleccionar comuna' : 'Primero selecciona una región'} opciones={REGION_COMUNAS[uf.region] ?? []} />
                <Campo id="usuario-direccion" label="Dirección" required maxLength={100} value={uf.direccion} onChange={(v) => setU({ direccion: v })} placeholder="Ingresar dirección" />
                <Campo id="usuario-password" className="" label={esAgregar ? 'Contraseña' : 'Nueva contraseña (opcional)'} type="password" maxLength={10} required={esAgregar}
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
        </div>
    )
}

export default Admin