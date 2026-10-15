const dominiosPermitidos = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com']

const requerido = (mensaje) => (v) => (v.trim() ? '' : mensaje)
const maximo = (n) => (v) => (v.length <= n ? '' : `Máximo ${n} caracteres.`)
const entre = (min, max, mensaje) => (v) => (v.length >= min && v.length <= max ? '' : mensaje)
const patron = (regex, mensaje) => (v) => (regex.test(v.trim().toUpperCase()) ? '' : mensaje)
const igualA = (otroCampo, mensaje) => (v, todos) => (v === todos[otroCampo] ? '' : mensaje)

const correoPermitido = (v) =>
    dominiosPermitidos.some((d) => v.trim().toLowerCase().endsWith(d))
        ? ''
        : 'Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com.'

const mayorDeEdad = (edadMinima = 18) => (v) => {
    const hoy = new Date()
    const mes = String(hoy.getMonth() + 1).padStart(2, '0')
    const dia = String(hoy.getDate()).padStart(2, '0')
    const limite = `${hoy.getFullYear() - edadMinima}-${mes}-${dia}`
    return v <= limite ? '' : `Debes ser mayor de ${edadMinima} años para registrarte.`
}

const fechaNoPasada = (hoy) => (v) =>
    v >= hoy ? '' : 'No puedes seleccionar una fecha pasada.'

const horarioDisponible = (horariosDisponibles) => (v) =>
    horariosDisponibles.includes(v) ? '' : 'Selecciona un horario disponible.'

const edadValida = (v) =>
    Number.isInteger(Number(v)) && Number(v) >= 0
        ? ''
        : 'Ingresa una edad válida (en años).'

const email = [requerido('El correo es obligatorio.'), maximo(40), correoPermitido]
const pass = [entre(4, 10, 'La contraseña debe tener entre 4 y 10 caracteres.')]

export const reglasLogin = { email, pass }

export const reglasRegistro = {
    run: [patron(/^[0-9]{7,8}[0-9K]$/, 'Ingrese un RUN válido sin puntos ni guion (ej: 19011022K).')],
    nombre: [requerido('El nombre es obligatorio.'), maximo(50)],
    email,
    fechaNac: [requerido('La fecha de nacimiento es obligatoria.'), mayorDeEdad(18)],
    comuna: [requerido('Selecciona una comuna.')],
    direccion: [requerido('La dirección es obligatoria.'), maximo(300)],
    pass,
    pass2: [igualA('pass', 'Las contraseñas no coinciden.')],
}

export const reglasContacto = {
    asunto: [requerido('El asunto es obligatorio.'), maximo(100)],
    email,
    mensaje: [requerido('El mensaje es obligatorio.'), maximo(500)],
}

export function crearReglasCita({ hoy, horariosDisponibles }) {
    return {
        fecha: [
            requerido('Selecciona una fecha.'),
            fechaNoPasada(hoy),
        ],
        hora: [
            requerido('Selecciona un horario disponible.'),
            horarioDisponible(horariosDisponibles),
        ],
        nombreMascota: [requerido('Ingresa el nombre de la mascota.')],
        especie: [requerido('Selecciona una especie.')],
        edad: [
            requerido('Ingresa una edad válida (en años).'),
            edadValida,
        ],
    }
}

export function validar(valores, reglas) {
    const errores = {}
    for (const [campo, validadores] of Object.entries(reglas)) {
        for (const validador of validadores) {
            const mensaje = validador(valores[campo], valores)
            if (mensaje) {
                errores[campo] = mensaje
                break
            }
        }
    }
    return errores
}