const dominiosPermitidos = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com']

export function validarCorreo(correo) {
    return correo.length > 0 && correo.length <= 40 && dominiosPermitidos.some((d) => correo.toLowerCase().endsWith(d))
}

export function validarPass(pass) {
    return typeof pass === 'string' && pass.length >= 4 && pass.length <= 10
}