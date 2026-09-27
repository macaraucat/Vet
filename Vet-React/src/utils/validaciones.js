const dominiosPermitidos = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];

export function validarCorreo(correo) {
    return correo.length > 0 && correo.length <= 100 && dominiosPermitidos.some((d) => correo.toLowerCase().endsWith(d));
}