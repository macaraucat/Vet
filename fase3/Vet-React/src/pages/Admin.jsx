import { useEffect, useState } from 'react'
import { Alert, Button, Card, Col, Collapse, Form, Modal, Nav, Row, Stack, Table } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'
import { REGIONES, REGION_COMUNAS } from '../utils/validaciones'
import { apiMe } from '../services/authApi'
import useAdmin from '../hooks/useAdmin'

const ROLES = ['ADMINISTRADOR', 'FUNCIONARIO', 'CLIENTE']
const ESPECIES = ['Perro', 'Gato', 'Perro / Gato', 'Ave', 'Conejo']
const precioCLP = new Intl.NumberFormat('es-CL')
const fechaCL = (f) => f?.split('-').reverse().join('-') || '—'

const MITAD = 'col-12 col-lg-6 mb-3'
const COMPLETO = 'col-12 mb-3'

const SECCIONES = {
    dashboard: { label: 'Dashboard', icono: '/img/icons/dashboard.svg', descripcion: 'Visión general de todas las métricas y estadísticas clave del sistema.' },
    productos: { label: 'Productos', icono: '/img/icons/productos.svg', descripcion: 'Administrar los productos disponibles en el catálogo.' },
    usuarios: { label: 'Usuarios', icono: '/img/icons/usuarios.svg', descripcion: 'Gestión de cuentas de usuario y sus roles dentro del sistema.' },
    ordenes: { label: 'Órdenes', icono: '/img/icons/ordenes.svg', descripcion: 'Historial de compras realizadas con el detalle de cada orden.' },
    perfil: { label: 'Perfil', icono: '/img/icons/perfil.svg', descripcion: 'Administración de la información personal y configuraciones de cuenta.' },
}
const SECCION_POR_ROL = {
    ADMINISTRADOR: ['dashboard', 'usuarios', 'productos', 'ordenes', 'perfil'],
    FUNCIONARIO: ['productos', 'perfil'],
}
const COLS_PRODUCTOS = [
    { titulo: 'SKU', render: (p) => p.codigo },
    { titulo: 'Nombre', render: (p) => p.nombre },
    { titulo: 'Descripción', render: (p) => p.detalle },
    { titulo: 'Especie', render: (p) => p.especie },
    { titulo: 'Precio', render: (p) => `$${precioCLP.format(p.precio)}` },
    { titulo: 'Categoría', render: (p) => p.categoria?.nombre ?? '—' },
]
const COLS_USUARIOS = [
    { titulo: 'RUN', render: (u) => u.run || '—' },
    { titulo: 'Nombre', render: (u) => u.nombre },
    { titulo: 'Apellidos', render: (u) => u.apellidos },
    { titulo: 'Correo', render: (u) => u.email || '—' },
    { titulo: 'Fecha Nac.', render: (u) => fechaCL(u.fechaNac) },
    { titulo: 'Rol', render: (u) => u.rol },
    { titulo: 'Comuna', render: (u) => u.comuna || '—' },
    { titulo: 'Dirección', render: (u) => u.direccion || '—' },
]

function NavLateral({ visibles, tab, onSelect }) {
    return (
        <Nav variant="pills" activeKey={tab} className="sidebar-nav" onSelect={(id) => id && onSelect(id)}>
            {visibles.map((id) => (
                <Nav.Item key={id} className="w-100 d-flex justify-content-center">
                    <Nav.Link as="button" type="button" eventKey={id} className="sidebar-link">
                        <img src={SECCIONES[id].icono} alt="" width="20" height="20" />
                        <span>{SECCIONES[id].label}</span>
                    </Nav.Link>
                </Nav.Item>
            ))}
        </Nav>
    )
}

function NavMovil({ visibles, tab, onSelect }) {
    return (
        <nav aria-label="Secciones" className="mobile-nav" style={{ '--cols': visibles.length }}>
            {visibles.map((id) => (
                <button
                    key={id}
                    type="button"
                    className={`mobile-btn${tab === id ? ' active' : ''}`}
                    aria-label={SECCIONES[id].label}
                    aria-current={tab === id ? 'page' : undefined}
                    title={SECCIONES[id].label}
                    onClick={() => onSelect(id)}
                >
                    <img src={SECCIONES[id].icono} alt="" width="26" height="26" />
                </button>
            ))}
        </nav>
    )
}

function Seccion({ id, titulo, acciones, children }) {
    return (
        <section aria-labelledby={`admin-${id}-title`}>
            <Card className="shadow-sm border-0 h-100">
                <Card.Header className="bg-white border-0 pt-3 pb-0">
                    <Card.Title as="h2" id={`admin-${id}-title`} className="h4 admin-titulo mb-0">{titulo}</Card.Title>
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
        <Table bordered hover responsive className="align-middle mb-0 admin-tabla">
            <thead><tr>
                <th className="text-center"><span className="visually-hidden">{descripcion}</span></th>
                {columnas.map(({ titulo }) => <th key={titulo}>{titulo}</th>)}
            </tr></thead>
            <tbody>
            {filas.map((fila) => (
                <tr key={getId(fila)}>
                    <td className="text-center" data-label="Seleccionar">
                        <Form.Check type="radio" name={name} aria-label={getAriaLabel(fila)} className="d-flex justify-content-center m-0"
                                    checked={seleccionado === getId(fila)} onChange={() => onSeleccionar(getId(fila))} />
                    </td>
                    {columnas.map(({ titulo, render }) => <td key={titulo} data-label={titulo}>{render(fila)}</td>)}
                </tr>
            ))}
            </tbody>
        </Table>
    )
}

function Campo({ id, label, value, onChange, opciones, placeholder, className = 'mb-3', ...props }) {
    return (
        <Form.Group className={className} controlId={id}>
            <Form.Label>{label}</Form.Label>
            {opciones
                ? <Form.Select value={value ?? ''} onChange={(e) => onChange(e.target.value)} {...props}>
                    <option value="">{placeholder}</option>
                    {opciones.map((o) => <option key={o} value={o}>{o}</option>)}
                </Form.Select>
                : <Form.Control value={value ?? ''} onChange={(e) => onChange(e.target.value)} {...props} />}
        </Form.Group>
    )
}

function PerfilUsuario({ onLogout }) {
    const [datos, setDatos] = useState(null)
    const [error, setError] = useState('')
    useEffect(() => {
        let activo = true
        apiMe().then((d) => activo && setDatos(d)).catch((e) => activo && setError(e.message || 'No se pudo cargar el perfil.'))
        return () => { activo = false }
    }, [])
    if (error) return <Alert variant="danger" className="mb-0">{error}</Alert>
    if (!datos) return <Alert variant="info" className="mb-0">Cargando perfil...</Alert>
    return (
        <div>
            <Row className="g-3 mb-3">
                <Col xs={12} md={6}>
                    <p className="mb-1"><strong>RUN:</strong> {datos.run || '—'}</p>
                    <p className="mb-1"><strong>Nombre:</strong> {datos.nombre} {datos.apellidos}</p>
                    <p className="mb-1"><strong>Correo:</strong> {datos.email}</p>
                    <p className="mb-1"><strong>F. Nacimiento:</strong> {fechaCL(datos.fechaNac)}</p>
                </Col>
                <Col xs={12} md={6}>
                    <p className="mb-1"><strong>Rol:</strong> {datos.rol}</p>
                    <p className="mb-1"><strong>Región:</strong> {datos.region || '—'}</p>
                    <p className="mb-1"><strong>Comuna:</strong> {datos.comuna || '—'}</p>
                    <p className="mb-1"><strong>Dirección:</strong> {datos.direccion || '—'}</p>
                </Col>
            </Row>
            <div className="text-end"><Button variant="danger" onClick={onLogout}>Cerrar sesión</Button></div>
        </div>
    )
}

function Admin() {
    const { usuario, logout } = useAuthContext()
    const navigate = useNavigate()
    const a = useAdmin()
    const [tab, setTab] = useState(() => usuario?.role === 'FUNCIONARIO' ? 'productos' : 'dashboard')
    const [menuMovil, setMenuMovil] = useState(false)

    const esAdmin = usuario?.role === 'ADMINISTRADOR'
    const esFunc = usuario?.role === 'FUNCIONARIO'
    const permiso = esAdmin || esFunc
    const soloLectura = esFunc

    useEffect(() => {
        if (!usuario) navigate('/login', { replace: true })
        else if (!permiso) navigate('/', { replace: true })
    }, [navigate, usuario, permiso])

    if (!usuario || !permiso) return null

    const visibles = SECCION_POR_ROL[usuario.role] ?? []
    const cambiarTab = (id) => { setTab(id); a.setFeedback(null); setMenuMovil(false) }
    const confirmar = (msg, fn) => window.confirm(msg) && fn()
    const esAgregar = a.modal?.modo === 'agregar'
    const setP = (c) => a.setProductoForm((p) => ({ ...p, ...c }))
    const setU = (c) => a.setUsuarioForm((p) => ({ ...p, ...c }))
    const { productoForm: pf, usuarioForm: uf } = a

    return (
        <div className="admin-layout">
            {/* Móvil */}
            <div className="admin-mobile-header d-md-none bg-verde text-white">
                <div className="admin-mobile-bar">
                    <span className="admin-mobile-title">Panel de Administración</span>
                    <button
                        type="button"
                        className="admin-hamburger"
                        aria-label={menuMovil ? 'Cerrar menú' : 'Abrir menú'}
                        aria-expanded={menuMovil}
                        aria-controls="admin-menu-movil"
                        onClick={() => setMenuMovil((v) => !v)}
                    >
                        <svg width="30" height="30" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                            <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z" />
                        </svg>
                    </button>
                </div>
                <Collapse in={menuMovil}>
                    <div id="admin-menu-movil">
                        <NavMovil visibles={visibles} tab={tab} onSelect={cambiarTab} />
                    </div>
                </Collapse>
            </div>

            {/* Tablet y escritorio */}
            <aside className="admin-sidebar-wrapper d-none d-md-flex">
                <h5 className="admin-sidebar-title">Panel de Administración</h5>
                <NavLateral visibles={visibles} tab={tab} onSelect={cambiarTab} />
            </aside>

            <main className="admin-content-area">
                <div className="admin-content-inner">
                    {a.feedback && <Alert variant={a.feedback.variant} dismissible onClose={() => a.setFeedback(null)}>{a.feedback.message}</Alert>}

                    {tab === 'dashboard' && (
                        <Seccion id="dashboard" titulo="Dashboard">
                            <Row className="g-3 mb-4">
                                {[
                                    { valor: a.usuarios.length, etiqueta: 'Usuarios registrados', cargando: a.cargandoUsuarios, icono: SECCIONES.usuarios.icono },
                                    { valor: 871 , etiqueta: 'Productos en catálogo', icono: SECCIONES.productos.icono },
                                    { valor: a.ordenes.length, etiqueta: 'Órdenes registradas', cargando: a.cargandoOrdenes, icono: SECCIONES.ordenes.icono },
                                ].map((kpi) => (
                                    <Col xs={12} sm={6} xl={4} key={kpi.etiqueta}>
                                        <Card className="shadow-sm h-100 text-center border-0">
                                            <Card.Body className="d-flex flex-column align-items-center justify-content-center py-4">
                                                <img src={kpi.icono} alt="" className="kpi-icon mb-2" />
                                                <Card.Title as="h3" className="admin-titulo mb-1 fw-bold" style={{ fontSize: '2rem' }}>
                                                    {kpi.cargando ? '…' : kpi.valor}
                                                </Card.Title>
                                                <Card.Text className="text-muted mb-0 fw-semibold">{kpi.etiqueta}</Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                            <Row className="g-3">
                                {visibles.map((id) => (
                                    <Col xs={12} sm={6} lg={4} key={id}>
                                        <Card className="dashboard-card h-100 text-center rounded-4 shadow-sm" onClick={() => cambiarTab(id)}>
                                            <Card.Body className="d-flex flex-column align-items-center justify-content-center p-4">
                                                <img src={SECCIONES[id].icono} alt={SECCIONES[id].label} className="mb-3" style={{ width: '56px', height: '56px', objectFit: 'contain' }} />
                                                <Card.Title as="h5" className="admin-titulo fw-bold mb-2">{SECCIONES[id].label}</Card.Title>
                                                <Card.Text className="text-muted small mb-0 text-center">{SECCIONES[id].descripcion}</Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </Seccion>
                    )}

                    {tab === 'productos' && (
                        <Seccion id="productos" titulo="Gestión de Productos" acciones={soloLectura ? null : <>
                            <Button variant="success" onClick={() => a.abrirProducto('agregar')}>+ Agregar</Button>
                            <Button variant="outline-success" disabled={a.productoSeleccionado === null} onClick={() => a.abrirProducto('modificar')}>Modificar</Button>
                            <Button variant="danger" disabled={a.productoSeleccionado === null} onClick={() => confirmar('¿Eliminar el producto seleccionado?', a.eliminarProducto)}>Eliminar</Button>
                        </>}>
                            <TablaSeleccionable name="producto-seleccionado" descripcion="Seleccionar un producto" columnas={COLS_PRODUCTOS} filas={a.productos}
                                                getId={(p) => p.id} getAriaLabel={(p) => `Seleccionar ${p.nombre}`} seleccionado={a.productoSeleccionado} onSeleccionar={a.setProductoSeleccionado} />
                        </Seccion>
                    )}

                    {tab === 'usuarios' && esAdmin && (
                        <Seccion id="usuarios" titulo="Gestión de Usuarios" acciones={<>
                            <Button variant="success" onClick={a.agregarUsuario}>+ Agregar</Button>
                            <Button variant="outline-success" disabled={a.usuarioSeleccionado === null} onClick={a.modificarUsuario}>Modificar</Button>
                            <Button variant="danger" disabled={a.usuarioSeleccionado === null} onClick={() => confirmar('¿Eliminar el usuario seleccionado?', a.eliminarUsuario)}>Eliminar</Button>
                        </>}>
                            <TablaSeleccionable name="usuario-seleccionado" descripcion="Seleccionar un usuario" columnas={COLS_USUARIOS} filas={a.usuarios}
                                                getId={(u) => u.id} getAriaLabel={(u) => `Seleccionar a ${u.nombre} ${u.apellidos}`} seleccionado={a.usuarioSeleccionado} onSeleccionar={a.setUsuarioSeleccionado} />
                        </Seccion>
                    )}

                    {tab === 'ordenes' && (
                        <Seccion id="ordenes" titulo="Órdenes">
                            {a.cargandoOrdenes ? <Alert variant="info" className="mb-0">Cargando órdenes...</Alert>
                                : a.ordenes.length === 0 ? <Alert variant="secondary" className="mb-0">No hay órdenes registradas.</Alert>
                                    : <Table bordered hover responsive className="align-middle mb-0 admin-tabla">
                                        <thead><tr><th>N° Orden</th><th>Cliente (ID)</th><th>Fecha</th><th>Total</th><th></th></tr></thead>
                                        <tbody>
                                        {a.ordenes.map((o) => (
                                            <tr key={o.id}>
                                                <td data-label="N° Orden">#{o.id}</td>
                                                <td data-label="Cliente (ID)">{o.usuarioId}</td>
                                                <td data-label="Fecha">{new Date(o.fecha).toLocaleString('es-CL')}</td>
                                                <td data-label="Total">${precioCLP.format(o.total)}</td>
                                                <td data-label="Detalle"><Button variant="secondary" size="sm" onClick={() => a.verDetalleOrden(o.id)}>Ver detalle</Button></td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </Table>}
                        </Seccion>
                    )}

                    {tab === 'perfil' && (
                        <Seccion id="perfil" titulo="Mi Perfil">
                            <PerfilUsuario onLogout={() => { logout(); navigate('/login', { replace: true }) }} />
                        </Seccion>
                    )}
                </div>
            </main>

            {/* Modales: pantalla completa en móvil (< 576px) */}
            <Modal show={a.modal?.tipo === 'producto'} onHide={() => a.setModal(null)} size="lg" fullscreen="sm-down" aria-labelledby="prod-title">
                <Form onSubmit={a.guardarProducto}>
                    <Modal.Header closeButton><Modal.Title id="prod-title">{esAgregar ? 'Agregar Producto' : 'Modificar Producto'}</Modal.Title></Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Campo className={MITAD} id="producto-codigo" label="Código producto (SKU)" required value={pf.codigo} onChange={(v) => setP({ codigo: v })} placeholder="Ej: ME023" />
                            <Campo className={MITAD} id="producto-nombre" label="Nombre" required value={pf.nombre} onChange={(v) => setP({ nombre: v })} placeholder="Ingresar nombre del producto" />
                            <Campo className={COMPLETO} id="producto-detalle" label="Detalle" required value={pf.detalle} onChange={(v) => setP({ detalle: v })} placeholder="Ej: Amoxicilina · Blíster 10 comp." />
                            <Campo className={MITAD} id="producto-especie" label="Especie" required value={pf.especie} onChange={(v) => setP({ especie: v })} placeholder="Seleccionar especie" opciones={ESPECIES} />
                            <Campo className={MITAD} id="producto-precio" label="Precio" required type="number" min="0" step="1" value={pf.precio} onChange={(v) => setP({ precio: v })} placeholder="Ej: 4200" />
                            <Campo className={MITAD} id="producto-imagen" label="URL de imagen (opcional)" value={pf.imagen} onChange={(v) => setP({ imagen: v })} placeholder="/img/ME023.jpeg" />
                            <Form.Group className={MITAD} controlId="producto-categoria">
                                <Form.Label>Categoría</Form.Label>
                                <Form.Select value={pf.categoriaId ?? ''} onChange={(e) => setP({ categoriaId: e.target.value })} required>
                                    <option value="">Seleccionar categoría</option>
                                    {a.categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                                </Form.Select>
                            </Form.Group>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => a.setModal(null)}>Cancelar</Button>
                        <Button variant="success" type="submit">Guardar</Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            <Modal show={a.modal?.tipo === 'usuario'} onHide={() => a.setModal(null)} size="lg" fullscreen="sm-down" aria-labelledby="user-title">
                <Form onSubmit={a.guardarUsuario}>
                    <Modal.Header closeButton><Modal.Title id="user-title">{esAgregar ? 'Agregar Usuario' : 'Modificar Usuario'}</Modal.Title></Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Campo className={MITAD} id="u-run" label="RUN (sin puntos ni guion)" required maxLength={9} value={uf.run} onChange={(v) => setU({ run: v })} placeholder="Ingresar RUN" />
                            <Campo className={MITAD} id="u-nombre" label="Nombre" required maxLength={30} value={uf.nombre} onChange={(v) => setU({ nombre: v })} placeholder="Ingresar nombre" />
                            <Campo className={MITAD} id="u-apellidos" label="Apellidos" required maxLength={30} value={uf.apellidos} onChange={(v) => setU({ apellidos: v })} placeholder="Ingresar apellidos" />
                            <Campo className={MITAD} id="u-email" label="Correo electrónico" required type="email" maxLength={40} value={uf.email} onChange={(v) => setU({ email: v })} placeholder="Ingresar correo" />
                            <Campo className={MITAD} id="u-fecha" label="Fecha de nacimiento" required type="date" value={uf.fechaNac} onChange={(v) => setU({ fechaNac: v })} />
                            <Campo className={MITAD} id="u-rol" label="Rol" required value={uf.rol} onChange={(v) => setU({ rol: v })} placeholder="Seleccionar rol" opciones={ROLES} />
                            <Campo className={MITAD} id="u-region" label="Región" required value={uf.region} onChange={(v) => setU({ region: v, comuna: '' })} placeholder="Seleccionar región" opciones={REGIONES} />
                            <Campo className={MITAD} id="u-comuna" label="Comuna" required disabled={!uf.region} value={uf.comuna} onChange={(v) => setU({ comuna: v })} placeholder={uf.region ? 'Seleccionar comuna' : 'Primero selecciona una región'} opciones={REGION_COMUNAS[uf.region] ?? []} />
                            <Campo className={COMPLETO} id="u-direccion" label="Dirección" required maxLength={100} value={uf.direccion} onChange={(v) => setU({ direccion: v })} placeholder="Ingresar dirección" />
                            <Campo className={MITAD} id="u-password" label={esAgregar ? 'Contraseña' : 'Nueva contraseña (opcional)'} type="password" maxLength={10} required={esAgregar} value={uf.password} onChange={(v) => setU({ password: v })} placeholder={esAgregar ? 'Ingresar contraseña' : 'Dejar vacío para mantener la actual'} />
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => a.setModal(null)}>Cancelar</Button>
                        <Button variant="success" type="submit">Guardar</Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            <Modal show={a.detalleOrden !== null} onHide={() => a.setDetalleOrden(null)} size="lg" fullscreen="sm-down" aria-labelledby="orden-det-title">
                <Modal.Header closeButton><Modal.Title id="orden-det-title">Detalle de la orden #{a.detalleOrden?.id}</Modal.Title></Modal.Header>
                <Modal.Body>
                    {a.detalleOrden?.items.length === 0 ? <p className="text-muted mb-0">Esta orden no tiene detalles.</p>
                        : <Table responsive className="admin-tabla admin-tabla--compacta align-middle mb-0">
                            <thead><tr><th>Producto</th><th>Cantidad</th><th>Precio unitario</th><th>Subtotal</th></tr></thead>
                            <tbody>
                            {a.detalleOrden?.items.map((d) => (
                                <tr key={d.id}>
                                    <td data-label="Producto">{d.producto?.nombre ?? `Producto #${d.producto?.id ?? '?'}`}</td>
                                    <td data-label="Cantidad">{d.cantidad}</td>
                                    <td data-label="Precio unitario">${precioCLP.format(d.precioUnitario)}</td>
                                    <td data-label="Subtotal">${precioCLP.format(d.precioUnitario * d.cantidad)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>}
                </Modal.Body>
                <Modal.Footer><Button variant="secondary" onClick={() => a.setDetalleOrden(null)}>Cerrar</Button></Modal.Footer>
            </Modal>
        </div>
    )
}

export default Admin