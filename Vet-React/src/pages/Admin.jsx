import { useEffect, useState } from 'react'
import { Alert, Button, Form, Modal, Nav, Table } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'
import useAdmin from '../hooks/useAdmin'
import './admin.css'

const categorias = ['Antibióticos', 'Antiparasitarios', 'Antiinflamatorios', 'Dermatología', 'Digestivo', 'Cardíaco', 'Analgésicos', 'Vacunas', 'Suplementos', ]

const roles = ['Administrador', 'Funcionario', 'Dueño de mascota']

const secciones = [
    { id: 'productos', label: 'Gestión de Productos' },
    { id: 'usuarios', label: 'Gestión de Usuarios' },
    { id: 'citas', label: 'Citas'},
    { id: 'mensajes', label: 'Mensajes' },
]

const precioCLP = new Intl.NumberFormat('es-CL')

function fechaVisible(fecha) {
    if (!fecha) return ''
    const [year, month, day] = fecha.split('-')
    return `${day}-${month}-${year}`
}

function Admin() {
    const { usuario } = useAuthContext()
    const navigate = useNavigate()
    const esFuncionario = usuario?.role === 'Funcionario'
    const [tabActual, setTabActual] = useState('productos')
    const admin = useAdmin()

    useEffect(() => {
        if (!usuario) {
            navigate('/login', { replace: true })
        } else if (!['Funcionario', 'Administrador'].includes(usuario.role)) {
            navigate('/', { replace: true })
        }
    }, [navigate, usuario])

    if (!usuario || !['Funcionario', 'Administrador'].includes(usuario.role)) return null

    const modalProducto = admin.modal?.tipo === 'producto'
    const modalUsuario = admin.modal?.tipo === 'usuario'
    const modalCita = admin.modal?.tipo === 'cita'

    return (
        <main className="admin-container">
            <aside className="admin-sidebar" aria-label="Navegación de administración">
                <Nav
                    as="nav"
                    activeKey={tabActual}
                    className="admin-nav"
                    onSelect={(id) => {
                        if (!id) return
                        setTabActual(id)
                        admin.setFeedback(null)
                    }}
                >
                    {secciones.filter(({ id }) => id !== 'usuarios' || !esFuncionario).map(({ id, label }) => (
                        <Nav.Item key={id}>
                            <Nav.Link as="button" type="button" eventKey={id} className="tab">{label}</Nav.Link>
                        </Nav.Item>
                    ))}
                </Nav>
            </aside>

            <section className="admin-main-content">
                {admin.feedback && <Alert variant={admin.feedback.variant} dismissible onClose={() => admin.setFeedback(null)}>{admin.feedback.message}</Alert>}

                {tabActual === 'productos' && (
                    <section aria-labelledby="admin-title">
                        <h2 id="admin-title">Gestión de Productos</h2>
                        <div className="admin-toolbar">
                            <Button variant="success" onClick={() => admin.abrirProducto('agregar')}>+ Agregar</Button>
                            <Button variant="warning" onClick={() => admin.abrirProducto('modificar')}>Modificar</Button>
                        </div>
                        <div className="admin-table-wrapper">
                            <Table bordered hover responsive className="admin-table align-middle">
                                <thead>
                                    <tr>
                                        <th className="admin-check-column" aria-label="Seleccionar un producto" />
                                        <th>SKU</th>
                                        <th>Nombre</th>
                                        <th>Descripción (opcional)</th>
                                        <th>Precio</th>
                                        <th>Stock</th>
                                        <th>Categoría</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {admin.productosAdmin.map((producto) => (
                                        <tr key={producto.sku}>
                                            <td className="admin-check-column">
                                                <Form.Check
                                                    type="radio"
                                                    name="producto-seleccionado"
                                                    aria-label={`Seleccionar ${producto.nombre}`}
                                                    checked={admin.productoSeleccionado === producto.sku}
                                                    onChange={() => admin.setProductoSeleccionado(producto.sku)}
                                                />
                                            </td>
                                            <td>{producto.sku}</td>
                                            <td>{producto.nombre}</td>
                                            <td>{producto.descripcion}</td>
                                            <td>${precioCLP.format(producto.precio)}</td>
                                            <td>{producto.stock}</td>
                                            <td>{producto.categoria}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </section>
                )}

                {tabActual === 'usuarios' && !esFuncionario && (
                    <section aria-labelledby="admin-title">
                        <h2 id="admin-title">Gestión de Usuarios</h2>
                        <div className="admin-toolbar">
                            <Button variant="success" onClick={() => admin.abrirUsuario('agregar')}>+ Agregar</Button>
                            <Button variant="warning" onClick={() => admin.abrirUsuario('modificar')}>Modificar</Button>
                        </div>
                        <div className="admin-table-wrapper">
                            <Table bordered hover responsive className="admin-table align-middle">
                                <thead>
                                    <tr>
                                        <th className="admin-check-column" aria-label="Seleccionar un usuario" />
                                        <th>RUN</th>
                                        <th>Nombre</th>
                                        <th>Apellidos</th>
                                        <th>Correo electrónico</th>
                                        <th>Fecha de nacimiento</th>
                                        <th>Rol</th>
                                        <th>Comuna</th>
                                        <th>Dirección</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {admin.usuarios.map((user) => (
                                        <tr key={user.id}>
                                            <td className="admin-check-column">
                                                <Form.Check
                                                    type="radio"
                                                    name="usuario-seleccionado"
                                                    aria-label={`Seleccionar a ${user.nombre} ${user.apellidos}`}
                                                    checked={admin.usuarioSeleccionado === user.id}
                                                    onChange={() => admin.setUsuarioSeleccionado(user.id)}
                                                />
                                            </td>
                                            <td>{user.run || '—'}</td>
                                            <td>{user.nombre}</td>
                                            <td>{user.apellidos}</td>
                                            <td>{user.email || '—'}</td>
                                            <td>{fechaVisible(user.fechaNac) || '—'}</td>
                                            <td>{user.rol}</td>
                                            <td>{user.comuna || '—'}</td>
                                            <td>{user.direccion || '—'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </section>
                )}

                {tabActual === 'citas' && (
                    <section aria-labelledby="admin-title">
                        <h2 id="admin-title">Gestión de Citas</h2>
                        <div className="admin-toolbar">
                            <Button variant="success" disabled={admin.citaSeleccionada === null} onClick={() => admin.actualizarEstadoCita('Confirmada')}>Confirmar</Button>
                            <Button variant="warning" disabled={admin.citaSeleccionada === null} onClick={admin.abrirCita}>Modificar</Button>
                            <Button variant="danger" disabled={admin.citaSeleccionada === null} onClick={() => admin.actualizarEstadoCita('Anulada')}>Anular</Button>
                        </div>
                        <div className="admin-table-wrapper">
                            <Table bordered hover responsive className="admin-table admin-citas-table align-middle">
                                <thead>
                                    <tr>
                                        <th className="admin-check-column" aria-label="Seleccionar una cita" />
                                        <th>Fecha</th>
                                        <th>Hora</th>
                                        <th>Nombre mascota</th>
                                        <th>Especie</th>
                                        <th>Raza</th>
                                        <th>Edad</th>
                                        <th>Nombre tutor</th>
                                        <th>Estado cita</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {admin.citas.map((cita) => (
                                        <tr key={cita.id}>
                                            <td className="admin-check-column">
                                                <Form.Check
                                                    type="radio"
                                                    name="cita-seleccionada"
                                                    aria-label={`Seleccionar cita de ${cita.nombreMascota}`}
                                                    checked={admin.citaSeleccionada === cita.id}
                                                    onChange={() => admin.setCitaSeleccionada(cita.id)}
                                                />
                                            </td>
                                            <td>{fechaVisible(cita.fecha)}</td>
                                            <td>{cita.hora}</td>
                                            <td>{cita.nombreMascota}</td>
                                            <td>{cita.especie}</td>
                                            <td>{cita.raza}</td>
                                            <td>{cita.edad}</td>
                                            <td>{cita.nombreTutor}</td>
                                            <td>
                                                <span className={`badge ${cita.estado === 'Confirmada' ? 'text-bg-success' : cita.estado === 'Anulada' ? 'text-bg-secondary' : 'text-bg-warning'}`}>
                                                    {cita.estado}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </section>
                )}

                {tabActual === 'mensajes' && (
                    <section aria-labelledby="admin-title">
                        <h2 id="admin-title">Mensajes</h2>
                        <p>No hay mensajes nuevos por el momento.</p>
                    </section>
                )}
            </section>

            <Modal show={modalProducto} onHide={() => admin.setModal(null)} size="lg" aria-labelledby="admin-producto-modal-title">
                <Form onSubmit={admin.guardarProducto}>
                    <Modal.Header closeButton>
                        <Modal.Title id="admin-producto-modal-title">{admin.modal?.modo === 'agregar' ? 'Agregar Producto' : 'Modificar Producto'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Código producto (SKU)</Form.Label>
                            <Form.Control required value={admin.productoForm.sku || ''} onChange={(event) => admin.setProductoForm({ ...admin.productoForm, sku: event.target.value })} placeholder="Ej: ME023" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control required value={admin.productoForm.nombre || ''} onChange={(event) => admin.setProductoForm({ ...admin.productoForm, nombre: event.target.value })} placeholder="Ingresar nombre del producto" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Descripción (opcional)</Form.Label>
                            <Form.Control as="textarea" rows={2} value={admin.productoForm.descripcion || ''} onChange={(event) => admin.setProductoForm({ ...admin.productoForm, descripcion: event.target.value })} placeholder="Descripción del producto" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Precio</Form.Label>
                            <Form.Control required type="number" min="0" step="1" value={admin.productoForm.precio ?? ''} onChange={(event) => admin.setProductoForm({ ...admin.productoForm, precio: event.target.value })} placeholder="Ej: 4200" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Stock</Form.Label>
                            <Form.Control required type="number" min="0" step="1" value={admin.productoForm.stock ?? ''} onChange={(event) => admin.setProductoForm({ ...admin.productoForm, stock: event.target.value })} placeholder="Cantidad en stock" />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Categorías</Form.Label>
                            <Form.Select required value={admin.productoForm.categoria || ''} onChange={(event) => admin.setProductoForm({ ...admin.productoForm, categoria: event.target.value })}>
                                <option value="">Seleccionar categoría</option>
                                {categorias.map((categoria) => <option key={categoria} value={categoria}>{categoria}</option>)}
                            </Form.Select>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => admin.setModal(null)}>Cancelar</Button>
                        <Button variant="primary" type="submit">Guardar</Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            <Modal show={modalUsuario} onHide={() => admin.setModal(null)} size="lg" aria-labelledby="admin-usuario-modal-title">
                <Form onSubmit={admin.guardarUsuario}>
                    <Modal.Header closeButton>
                        <Modal.Title id="admin-usuario-modal-title">{admin.modal?.modo === 'agregar' ? 'Agregar Usuario' : 'Modificar Usuario'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>RUN (sin dígito verificador)</Form.Label>
                            <Form.Control required value={admin.usuarioForm.run || ''} onChange={(event) => admin.setUsuarioForm({ ...admin.usuarioForm, run: event.target.value })} placeholder="Ingresar RUN" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control required value={admin.usuarioForm.nombre || ''} onChange={(event) => admin.setUsuarioForm({ ...admin.usuarioForm, nombre: event.target.value })} placeholder="Ingresar nombre" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Apellidos</Form.Label>
                            <Form.Control required value={admin.usuarioForm.apellidos || ''} onChange={(event) => admin.setUsuarioForm({ ...admin.usuarioForm, apellidos: event.target.value })} placeholder="Ingresar apellidos" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Correo electrónico</Form.Label>
                            <Form.Control required type="email" value={admin.usuarioForm.email || ''} onChange={(event) => admin.setUsuarioForm({ ...admin.usuarioForm, email: event.target.value })} placeholder="Ingresar correo electrónico" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Fecha de nacimiento</Form.Label>
                            <Form.Control required type="date" value={admin.usuarioForm.fechaNac || ''} onChange={(event) => admin.setUsuarioForm({ ...admin.usuarioForm, fechaNac: event.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Rol</Form.Label>
                            <Form.Select required value={admin.usuarioForm.rol || ''} onChange={(event) => admin.setUsuarioForm({ ...admin.usuarioForm, rol: event.target.value })}>
                                <option value="">Seleccionar rol</option>
                                {roles.map((rol) => <option key={rol} value={rol}>{rol}</option>)}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Región y comuna</Form.Label>
                            <Form.Control required value={admin.usuarioForm.comuna || ''} onChange={(event) => admin.setUsuarioForm({ ...admin.usuarioForm, comuna: event.target.value })} placeholder="Ej: O'Higgins - Rancagua" />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Dirección</Form.Label>
                            <Form.Control required value={admin.usuarioForm.direccion || ''} onChange={(event) => admin.setUsuarioForm({ ...admin.usuarioForm, direccion: event.target.value })} placeholder="Ingresar dirección" />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => admin.setModal(null)}>Cancelar</Button>
                        <Button variant="primary" type="submit">Guardar</Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            <Modal show={modalCita} onHide={() => admin.setModal(null)} aria-labelledby="admin-cita-title">
                <Form onSubmit={admin.guardarCita}>
                    <Modal.Header closeButton>
                        <Modal.Title id="admin-cita-title">Modificar Cita</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3" controlId="cita-fecha">
                            <Form.Label>Fecha</Form.Label>
                            <Form.Control required type="date" value={admin.citaForm.fecha || ''} onChange={(event) => admin.setCitaForm({ ...admin.citaForm, fecha: event.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="cita-hora">
                            <Form.Label>Hora</Form.Label>
                            <Form.Control required type="time" value={admin.citaForm.hora || ''} onChange={(event) => admin.setCitaForm({ ...admin.citaForm, hora: event.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="cita-mascota">
                            <Form.Label>Nombre mascota</Form.Label>
                            <Form.Control required value={admin.citaForm.nombreMascota || ''} onChange={(event) => admin.setCitaForm({ ...admin.citaForm, nombreMascota: event.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="cita-especie">
                            <Form.Label>Especie</Form.Label>
                            <Form.Select required value={admin.citaForm.especie || ''} onChange={(event) => admin.setCitaForm({ ...admin.citaForm, especie: event.target.value })}>
                                <option value="">Seleccionar especie</option>
                                {['Perro', 'Gato', 'Ave', 'Conejo'].map((especie) => <option key={especie} value={especie}>{especie}</option>)}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="cita-raza">
                            <Form.Label>Raza</Form.Label>
                            <Form.Control required value={admin.citaForm.raza || ''} onChange={(event) => admin.setCitaForm({ ...admin.citaForm, raza: event.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="cita-edad">
                            <Form.Label>Edad</Form.Label>
                            <Form.Control required type="number" min="0" step="1" value={admin.citaForm.edad ?? ''} onChange={(event) => admin.setCitaForm({ ...admin.citaForm, edad: event.target.value })} />
                        </Form.Group>
                        <Form.Group controlId="cita-tutor">
                            <Form.Label>Nombre tutor</Form.Label>
                            <Form.Control required value={admin.citaForm.nombreTutor || ''} onChange={(event) => admin.setCitaForm({ ...admin.citaForm, nombreTutor: event.target.value })} />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => admin.setModal(null)}>Cancelar</Button>
                        <Button variant="primary" type="submit">Guardar cambios</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </main>
    )
}

export default Admin