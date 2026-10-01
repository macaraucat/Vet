const dominiosPermitidos = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com']

export function validarCorreo(correo) {
    return correo.length > 0 && correo.length <= 40 && dominiosPermitidos.some((d) => correo.toLowerCase().endsWith(d))
}

export function validarPass(pass) {
    return typeof pass === 'string' && pass.length >= 4 && pass.length <= 10
}

export function validarRun(run) {
    return /^[0-9]{7,8}[0-9K]$/.test(run.toUpperCase())
}

export function validarNombre(nombre) {
    return nombre.length > 0 && nombre.length <= 50
}

export function validarDireccion(direccion) {
    return direccion.length > 0 && direccion.length <= 300
}

export function validarFechaNacimiento(fechaNac, edadMinima = 18) {
    if (!fechaNac) return false

    const [anio, mes, dia] = fechaNac.split('-').map(Number)
    const hoy = new Date()

    let edad = hoy.getFullYear() - anio
    const yaCumplio =
        hoy.getMonth() + 1 > mes ||
        (hoy.getMonth() + 1 === mes && hoy.getDate() >= dia)

    if (!yaCumplio) edad--

    return edad >= edadMinima
}

export function validarPassIguales(pass, pass2) {
    return pass === pass2
}