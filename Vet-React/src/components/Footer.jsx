import useContacto from '../hooks/useContacto';

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
            {enviado && <p className="footer-text text-success">¡Mensaje enviado!</p>}
            <form className="footer-form" onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="asunto">Asunto</label>
                <input
                  type="text" id="asunto" name="asunto" value={form.asunto} onChange={handleChange}
                  className={`form-control form-control-sm ${errores.asunto ? 'is-invalid' : ''}`}
                  placeholder="Sobre qué nos escribes"
                />
                {errores.asunto && <div className="invalid-feedback">{errores.asunto}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="email">Correo</label>
                <input
                  type="email" id="email" name="email" value={form.email} onChange={handleChange}
                  className={`form-control form-control-sm ${errores.email ? 'is-invalid' : ''}`}
                  placeholder="tú@correo.com"
                />
                {errores.email && <div className="invalid-feedback">{errores.email}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="mensaje">Mensaje</label>
                <textarea
                  id="mensaje" name="mensaje" rows="1" value={form.mensaje} onChange={handleChange}
                  className={`form-control form-control-sm ${errores.mensaje ? 'is-invalid' : ''}`}
                  placeholder="Cuéntanos"
                ></textarea>
                {errores.mensaje && <div className="invalid-feedback">{errores.mensaje}</div>}
              </div>
              <button type="submit" className="btn btn-sm">Enviar mensaje</button>
            </form>
          </div>
        </div>

        <p className="footer-copy text-center mb-0">© Veterinaria San Marcos 2026. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;