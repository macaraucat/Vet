import { Form, Button, Alert } from 'react-bootstrap'
import useContacto from '../hooks/useContacto'
import './footer.css'

function Footer() {
    const { form, errores, enviado, handleChange, handleSubmit } = useContacto();

    return (
    <footer id="contacto" className="footer py-2">
      <div className="container">
        <div className="row footer-row gy-1">
          <div className="col-12 col-md-4 footer-col">
            <h6>Horario</h6>
            <p className="footer-text">
              Lunes a viernes: 10:00 - 19:30<br />
              Sábados: 10:00 - 16:00<br />
              Domingos y festivos: Cerrado
            </p>
            <h6>Consulta veterinaria</h6>
            <p className="footer-text">Valor consulta $15.000.<br /> Se recomienda reservar hora</p>
            <img src="/img/logo.png" alt="Logo" className="logo-footer" />
          </div>

          <div className="col-12 col-md-4 footer-col">
            <h6>Ubicación</h6>
            <p className="footer-text">Recreo 26, Rancagua, Región de O'Higgins</p>
            <iframe
              className="footer-map"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-70.7544%2C-34.1758%2C-70.7344%2C-34.1658&layer=mapnik&marker=-34.1708%2C-70.7444"
              loading="lazy"
              title="Mapa de ubicación de Veterinaria San Marcos"
            ></iframe>
          </div>

          <div className="col-12 col-md-4 footer-col">
            <h6>Contacto</h6>
            {enviado && (
              <Alert variant="success" className="py-1 px-2 mb-2">
                ¡Mensaje enviado!
              </Alert>
            )}

            <Form className="footer-form" onSubmit={handleSubmit} noValidate>
              <Form.Group className="form-group" controlId="contacto-asunto">
                <Form.Label>Asunto</Form.Label>
                <Form.Control
                  size="sm"
                  type="text"
                  name="asunto"
                  value={form.asunto}
                  onChange={handleChange}
                  placeholder="Sobre qué nos escribes"
                  isInvalid={!!errores.asunto}
                />
                <Form.Control.Feedback type="invalid">
                  {errores.asunto}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="form-group" controlId="contacto-email">
                <Form.Label>Correo</Form.Label>
                <Form.Control
                  size="sm"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="tú@correo.com"
                  isInvalid={!!errores.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errores.email}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="form-group" controlId="contacto-mensaje">
                <Form.Label>Mensaje</Form.Label>
                <Form.Control
                  size="sm"
                  as="textarea"
                  rows={1}
                  name="mensaje"
                  value={form.mensaje}
                  onChange={handleChange}
                  placeholder="Cuéntanos"
                  isInvalid={!!errores.mensaje}
                />
                <Form.Control.Feedback type="invalid">
                  {errores.mensaje}
                </Form.Control.Feedback>
              </Form.Group>

              <Button variant="success" size="sm" type="submit">
                Enviar mensaje
              </Button>
            </Form>
          </div>
        </div>

        <p className="footer-copy text-center mb-0">© Veterinaria San Marcos 2026. Todos los derechos reservados.</p>
      </div>
    </footer>        
    );

}

export default Footer