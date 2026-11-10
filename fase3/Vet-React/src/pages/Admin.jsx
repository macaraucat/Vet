import { useEffect, useState } from 'react'
import { Alert, Button, Card, Col, Form, Modal, Nav, Offcanvas, Row, Stack, Table } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'
import { REGIONES, REGION_COMUNAS } from '../utils/validaciones'
import { apiMe } from '../services/authApi'
import useAdmin from '../hooks/useAdmin'

const ROLES = ['ADMINISTRADOR', 'FUNCIONARIO', 'CLIENTE']
const ESPECIES = ['Perro', 'Gato', 'Perro / Gato', 'Ave', 'Conejo']

const precioCLP = new Intl.NumberFormat('es-CL')
const formatearFecha = (fecha) => fecha?.split('-').reverse().join('-')

const ICONOS = {
    dashboard: '/img/icons/dashboard.svg',
    usuarios: '/img/icons/usuarios.svg',
    productos: '/img/icons/productos.svg',
    ordenes: '/img/icons/ordenes.svg',
    perfil: '/img/icons/perfil.svg',
}

const DESCRIPCIONES = {
    dashboard: 'Visión general de todas las métricas y estadísticas clave del sistema.',
    usuarios: 'Gestión de cuentas de usuario y sus roles dentro del sistema.',
    productos: 'Administrar los productos disponibles en el catálogo.',
    ordenes: 'Historial de compras realizadas con el detalle de cada orden.',
    perfil: 'Administración de la información personal y configuraciones de cuenta.',
}

const SECCIONES = {
    dashboard: { label: 'Dashboard' },
    usuarios: { label: 'Usuarios' },
    productos: { label: 'Productos' },
    ordenes: { label: 'Órdenes' },
    perfil: { label: 'Perfil' },
}

const SECCIONES_POR_ROL = {
    ADMINISTRADOR: ['dashboard', 'usuarios', 'productos', 'ordenes', 'perfil'],
    FUNCIONARIO: ['productos', 'ordenes', 'perfil'],
}

const columnasProductos = [
    { titulo: 'SKU', render: (p) => p.codigo },
    { titulo: 'Nombre', render: (p) => p.nombre },
    { titulo: 'Descripción', render: (p) => p.detalle },
    { titulo: 'Especie', render: (p) => p.especie },
    { titulo: 'Precio', render: (p) => `$${precioCLP.format(p.precio)}` },
    { titulo: 'Categoría', render: (p) => p.categoria?.nombre ?? '—' },
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
            {seccionesVisibles.map((id) => (
                <Nav.Item key={id} className="w-100 d-flex justify-content-center">
                    <Nav.Link as="button" type="button" eventKey={id} className="admin-sidebar-link">
                        <img src={ICONOS[id]} alt="" width="20" height="20" />
                        <span>{SECCIONES[id].label}</span>
                    </Nav.Link>
                </Nav.Item>
            ))}
        </Nav>
    )
}

function Admin() {
    const { usuario, logout } = useAuthContext()
    const navigate = useNavigate()
    const admin = useAdmin()

    const esAdministrador = usuario?.role === 'ADMINISTRADOR'
    const esFuncionario = usuario?.role === 'FUNCIONARIO'
    const tienePermiso = esAdministrador || esFuncionario
    const soloLectura = esFuncionario

    const [tabActual, setTabActual] = useState(() => (esFuncionario ? 'productos' : 'dashboard'))
    const [mostrarSidebar, setMostrarSidebar] = useState(false)

    useEffect(() => {
        if (!usuario) navigate('/login', { replace: true })
        else if (!tienePermiso) navigate('/', { replace: true })
    }, [navigate, usuario, tienePermiso])

    if (!usuario || !tienePermiso) return null

    const seccionesVisibles = SECCIONES_POR_ROL[usuario.role] ?? []

    const cerrarModal = () => admin.setModal(null)
    const esAgregar = admin.modal?.modo === 'agregar'

    const setP = (cambios) => admin.setProductoForm((prev) => ({ ...prev, ...cambios }))
    const setU = (cambios) => admin.setUsuarioForm((prev) => ({ ...prev, ...cambios }))
    const { productoForm: pf, usuarioForm: uf } = admin

    const handleLogout = () => {
        logout()
        navigate('/login', { replace: true })
    }

    const handleTabClick = (id) => {
        setTabActual(id)
        admin.setFeedback(null)
        setMostrarSidebar(false)
    }

    return (
        <div className="admin-layout">
            <div className="d-md-none bg-verde text-white p-3 d-flex align-items-center shadow-sm" style={{ zIndex: 1050 }}>
                <Button variant="link" className="text-white p-0 me-3 border-0" onClick={() => setMostrarSidebar(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z" />
                    </svg>
                </Button>
                <span className="fw-bold">Panel de Administración</span>
            </div>

            <aside className="admin-sidebar-wrapper d-none d-md-flex">
                <h5 className="admin-sidebar-title">Panel de Administración</h5>
                <SidebarMenu tabActual={tabActual} setTabActual={handleTabClick} seccionesVisibles={seccionesVisibles} admin={admin} />
            </aside>

            <Offcanvas show={mostrarSidebar} onHide={() => setMostrarSidebar(false)} className="admin-offcanvas bg-verde">
                <Offcanvas.Header closeButton closeVariant="white" className="border-bottom border-light">
                    <Offcanvas.Title className="text-white fw-bold">Menú</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body className="p-0 pt-3">
                    <SidebarMenu tabActual={tabActual} setTabActual={handleTabClick} seccionesVisibles={seccionesVisibles} admin={admin} />
                </Offcanvas.Body>
            </Offcanvas>

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
                                <Col xs={12} sm={6} xl={4}>
                                    <TarjetaKPI
                                        valor={admin.usuarios.length}
                                        etiqueta="Usuarios registrados"
                                        cargando={admin.cargandoUsuarios}
                                        icono={ICONOS.usuarios}
                                    />
                                </Col>
                                <Col xs={12} sm={6} xl={4}>
                                    <TarjetaKPI valor={admin.productos.length} etiqueta="Productos en catálogo" icono={ICONOS.productos} />
                                </Col>
                                <Col xs={12} sm={6} xl={4}>
                                    <TarjetaKPI
                                        valor={admin.ordenes.length}
                                        etiqueta="Órdenes registradas"
                                        cargando={admin.cargandoOrdenes}
                                        icono={ICONOS.ordenes}
                                    />
                                </Col>
                            </Row>

                            <Row className="g-3">
                                {seccionesVisibles.map((id) => (
                                    <Col xs={12} sm={6} lg={4} key={id}>
                                        <div className="dashboard-card" onClick={() => handleTabClick(id)}>
                                            <img src={ICONOS[id]} alt={SECCIONES[id].label} className="dashboard-card-icon" />
                                            <h5>{SECCIONES[id].label}</h5>
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
                            acciones={soloLectura ? null : (
                                <>
                                    <BotonAdmin tipo="primario" onClick={() => admin.abrirProducto('agregar')}>+ Agregar</BotonAdmin>
                                    <BotonAdmin tipo="secundario" disabled={admin.productoSeleccionado === null} onClick={() => admin.abrirProducto('modificar')}>Modificar</BotonAdmin>
                                    <BotonAdmin tipo="peligro" disabled={admin.productoSeleccionado === null}
                                                onClick={() => confirmarYEjecutar('¿Eliminar el producto seleccionado? Esta acción no se puede deshacer.', admin.eliminarProducto)}>
                                        Eliminar
                                    </BotonAdmin>
                                </>
                            )}
                        >
                            <TablaSeleccionable
                                name="producto-seleccionado"
                                descripcion="Seleccionar un producto"
                                columnas={columnasProductos}
                                filas={admin.productos}
                                getId={(p) => p.id}
                                getAriaLabel={(p) => `Seleccionar ${p.nombre}`}
                                seleccionado={admin.productoSeleccionado}
                                onSeleccionar={admin.setProductoSeleccionado}
                            />
                        </SeccionAdmin>
                    )}

                    {tabActual === 'usuarios' && esAdministrador && (
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

                    {tabActual === 'ordenes' && (
                        <SeccionAdmin id="ordenes" titulo="Órdenes">
                            {admin.cargandoOrdenes ? (
                                <Alert variant="info" className="mb-0">Cargando órdenes...</Alert>
                            ) : admin.ordenes.length === 0 ? (
                                <Alert variant="secondary" className="mb-0">No hay órdenes registradas.</Alert>
                            ) : (
                                <Table bordered hover responsive className="align-middle mb-0 admin-tabla">
                                    <thead>
                                    <tr>
                                        <th>N° Orden</th>
                                        <th>Cliente (ID)</th>
                                        <th>Fecha</th>
                                        <th>Total</th>
                                        <th></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {admin.ordenes.map((o) => (
                                        <tr key={o.id}>
                                            <td>#{o.id}</td>
                                            <td>{o.usuarioId}</td>
                                            <td>{new Date(o.fecha).toLocaleString('es-CL')}</td>
                                            <td>${precioCLP.format(o.total)}</td>
                                            <td>
                                                <BotonAdmin tipo="secundario" onClick={() => admin.verDetalleOrden(o.id)}>
                                                    Ver detalle
                                                </BotonAdmin>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </Table>
                            )}
                        </SeccionAdmin>
                    )}

                    {tabActual === 'perfil' && (
                        <SeccionAdmin id="perfil" titulo="Mi Perfil">
                            <PerfilUsuario onLogout={handleLogout} />
                        </SeccionAdmin>
                    )}
                </div>
            </main>

            <ModalFormulario id="admin-producto-modal" size="lg" show={admin.modal?.tipo === 'producto'} onHide={cerrarModal} onSubmit={admin.guardarProducto}
                             titulo={esAgregar ? 'Agregar Producto' : 'Modificar Producto'}>
                <Campo id="producto-codigo" label="Código producto (SKU)" required value={pf.codigo} onChange={(v) => setP({ codigo: v })} placeholder="Ej: ME023" />
                <Campo id="producto-nombre" label="Nombre" required value={pf.nombre} onChange={(v) => setP({ nombre: v })} placeholder="Ingresar nombre del producto" />
                <Campo id="producto-detalle" label="Detalle" required value={pf.detalle} onChange={(v) => setP({ detalle: v })} placeholder="Ej: Amoxicilina · Blíster 10 comp." />
                <CampoSelect id="producto-especie" label="Especie" required value={pf.especie} onChange={(v) => setP({ especie: v })} placeholder="Seleccionar especie" opciones={ESPECIES} />
                <Campo id="producto-precio" label="Precio" required type="number" min="0" step="1" value={pf.precio} onChange={(v) => setP({ precio: v })} placeholder="Ej: 4200" />
                <Campo id="producto-imagen" label="URL de imagen (opcional)" value={pf.imagen} onChange={(v) => setP({ imagen: v })} placeholder="/img/ME023.jpeg" />
                <Form.Group className="" controlId="producto-categoria">
                    <Form.Label>Categoría</Form.Label>
                    <Form.Select value={pf.categoriaId ?? ''} onChange={(e) => setP({ categoriaId: e.target.value })} required>
                        <option value="">Seleccionar categoría</option>
                        {admin.categorias.map((c) => (
                            <option key={c.id} value={c.id}>{c.nombre}</option>
                        ))}
                    </Form.Select>
                </Form.Group>
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

            <Modal
                show={admin.detalleOrden !== null}
                onHide={() => admin.setDetalleOrden(null)}
                size="lg"
                aria-labelledby="orden-detalle-title"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="orden-detalle-title">
                        Detalle de la orden #{admin.detalleOrden?.id}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {admin.detalleOrden?.items.length === 0 ? (
                        <p className="text-muted mb-0">Esta orden no tiene detalles.</p>
                    ) : (
                        <Table responsive>
                            <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Cantidad</th>
                                <th>Precio unitario</th>
                                <th>Subtotal</th>
                            </tr>
                            </thead>
                            <tbody>
                            {admin.detalleOrden?.items.map((d) => (
                                <tr key={d.id}>
                                    <td>{d.producto?.nombre ?? `Producto #${d.producto?.id ?? '?'}`}</td>
                                    <td>{d.cantidad}</td>
                                    <td>${precioCLP.format(d.precioUnitario)}</td>
                                    <td>${precioCLP.format(d.precioUnitario * d.cantidad)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <BotonAdmin tipo="secundario" onClick={() => admin.setDetalleOrden(null)}>Cerrar</BotonAdmin>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Admin