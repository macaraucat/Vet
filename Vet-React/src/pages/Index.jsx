import { useEffect, useState } from 'react'
import useNoticias from '../hooks/useNoticias'
import Button from 'react-bootstrap/Button'
import './index.css'

function Index() {
    const { noticias, expandido, toggleExpandir } = useNoticias()
    const [animar, setAnimar] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => setAnimar(true), 0)
        return () => clearTimeout(timer)
    }, []);

    return (
        <main>
            <section id="hero" className="hero">
                <div className="hero-inner">
                    <div className="hero-text">
                        <h2 className="hero-tagline">Cuidado veterinario cercano y profesional</h2>
                        <p>Llevamos más de 15 años entregando atención cercana y de calidad a las mascotas. Contamos con médicos veterinarios, técnico veterinario y equipamiento especializado. Sabemos lo importante que es tu mascota para ti, por eso trabajamos con dedicación y cariño en cada visita.</p>
                        <Button variant="success" className="boton-primario">Agendar cita</Button>
                    </div>
                    <div className="hero-pets-wrapper">
                        <img src="/img/hero.jpg" alt="Mascotas" className={`hero-pets-img ${animar ? 'bounce-on-load' : ''}`}/>
                    </div>
                </div>
            </section>

            <section id="servicios" className="servicios standard-section">
                <h2>Nuestros servicios</h2>
                <div className="lista-servicios">
                    <article className="servicio py-2">
                        <h6>Consultas</h6>
                        <img src="/img/servicios/icon-consultas.png" alt="Consultas" className="icono-servicio" />
                    </article>
                    <article className="servicio py-2">
                        <h6>Vacunación</h6>
                        <img src="/img/servicios/icon-vacunacion.png" alt="Vacunación" className="icono-servicio" />
                    </article>
                    <article className="servicio py-2">
                        <h6>Cirugía</h6>
                        <img src="/img/servicios/icon-cirugia.png" alt="Cirugía" className="icono-servicio" />
                    </article>
                    <article className="servicio py-2">
                        <h6>Desparasitación</h6>
                        <img src="/img/servicios/icon-desparasitacion.png" alt="Desparasitación" className="icono-servicio" />
                    </article>
                    <article className="servicio py-2">
                        <h6>Exámenes</h6>
                        <img src="/img/servicios/icon-examenes.png" alt="Exámenes" className="icono-servicio" />
                    </article>
                    <article className="servicio py-2">
                        <h6>Medicamentos</h6>
                        <img src="/img/servicios/icon-medicamentos.png" alt="Medicamentos" className="icono-servicio" />
                    </article>
                </div>
            </section>

            <section id="nosotros" className="nosotros standard-section">
                <h2 className="text-center mb-4">Sobre nosotros</h2>
                <p>Veterinaria San Marcos es una clínica veterinaria ubicada en Rancagua, Región del Libertador General Bernardo O'Higgins, fundada en 2009. Contamos con un equipo integral dedicado a brindar una atención cercana y profesional, para tus mascotas. A lo largo de estos años, hemos visto crecer la confianza de nuestros clientes, lo que nos motiva a seguir mejorando cada aspecto de nuestra atención, desde la comodidad de nuestras instalaciones hasta la calidez con la que recibimos a cada mascota y su familia.</p>
                <img src="/img/team.jpg" alt="Veterinaria San Marcos team" className="team-img mx-auto d-block my-4" />
                <h3>Nuestro equipo:</h3>
                <p>
                    <b>Laura Claro Hernández:</b> Médica Veterinaria, Universidad de Concepción. Diplomado en Cirugía de Pequeños Animales (Universidad de Chile). Directora clínica y fundadora de Veterinaria San Marcos, con más de 15 años de trayectoria en medicina y cirugía de perros y gatos.<hr />
                    <b>Carmen Martínez Larraín:</b> Médica Veterinaria, Universidad Austral de Chile. Diplomado en Medicina Interna de Pequeños Animales; responsable de consultas generales, vacunación y programas preventivos.<hr />
                    <b>Ignacio Solar Guzmán:</b> Médico Veterinario, Universidad de Concepción. Magíster en Medicina de Especies Exóticas, con dedicación especial a aves y conejos; a cargo de la atención de mascotas no convencionales.<hr />
                    <b>Jorge Vial Peña:</b> Técnico en Enfermería Veterinaria, Universidad Santo Tomás. Encargado de pabellón y apoyo en procedimientos quirúrgicos, cuidados intensivos y toma de exámenes.<hr />
                    <b>Sofía Astorga Zapata:</b> Administradora, Universidad de Talca. Recepcionista y encargada de atención a clientes, agendamiento de horas y gestión administrativa de la clínica.
                </p>
            </section>

            <section id="blogs" className="blogs standard-section">
                <h2>Noticias importantes</h2>
                <div className="lista-noticias">
                    {noticias.map((n, i) => (
                        <article className="noticia" key={n.titulo}>
                            <h4>{n.titulo}</h4>
                            <p className="texto-corto" style={{ display: expandido[i] ? 'none' : 'block' }}>{n.corto}</p>
                            <p className="texto-extendido" style={{ display: expandido[i] ? 'block' : 'none' }}>{n.extendido}</p>
                            <a href="#" className="boton-expandir" onClick={(e) => { e.preventDefault(); toggleExpandir(i); }}>
                                {expandido[i] ? 'Contraer' : 'Expandir'}
                            </a>
                            <img src={n.img} alt={n.alt} className="blog-img" />
                        </article>
                    ))}
                </div>
            </section>

        </main>
    )

}

export default Index