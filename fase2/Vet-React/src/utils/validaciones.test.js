import { describe, it, expect } from 'vitest'
import {
    validar,
    reglasLogin,
    reglasRegistro,
    reglasContacto,
    reglasCheckout,
    crearReglasCita,
} from './validaciones'

const anio = new Date().getFullYear()

describe('reglasLogin', () => {
    it('no devuelve errores con datos válidos', () => {
        const errores = validar({ email: 'ana@duoc.cl', pass: '1234' }, reglasLogin)
        expect(errores).toEqual({})
    })

    it('exige el correo', () => {
        const errores = validar({ email: '', pass: '1234' }, reglasLogin)
        expect(errores.email).toBe('El correo es obligatorio.')
    })

    it('rechaza un correo de más de 40 caracteres', () => {
        const largo = 'a'.repeat(35) + '@gmail.com'
        const errores = validar({ email: largo, pass: '1234' }, reglasLogin)
        expect(errores.email).toBe('Máximo 40 caracteres.')
    })

    it('rechaza un dominio no permitido', () => {
        const errores = validar({ email: 'juan@hotmail.com', pass: '1234' }, reglasLogin)
        expect(errores.email).toBe('Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com.')
    })

    it('acepta el dominio en mayúsculas', () => {
        const errores = validar({ email: 'JUAN@GMAIL.COM', pass: '1234' }, reglasLogin)
        expect(errores.email).toBeUndefined()
    })

    it('rechaza una contraseña demasiado corta', () => {
        const errores = validar({ email: 'ana@duoc.cl', pass: '123' }, reglasLogin)
        expect(errores.pass).toBe('La contraseña debe tener entre 4 y 10 caracteres.')
    })

    it('rechaza una contraseña demasiado larga', () => {
        const errores = validar({ email: 'ana@duoc.cl', pass: 'a'.repeat(11) }, reglasLogin)
        expect(errores.pass).toBe('La contraseña debe tener entre 4 y 10 caracteres.')
    })
})

describe('reglasRegistro', () => {
    const valoresValidos = {
        run: '19011022K',
        nombre: 'Ana Pérez',
        email: 'ana@duoc.cl',
        fechaNac: `${anio - 30}-01-01`,
        comuna: 'Viña del Mar',
        direccion: 'Calle 1 número 123',
        pass: '1234',
        pass2: '1234',
    }

    it('no devuelve errores con datos válidos', () => {
        expect(validar(valoresValidos, reglasRegistro)).toEqual({})
    })

    it('acepta un RUN con la K en minúscula', () => {
        const errores = validar({ ...valoresValidos, run: '19011022k' }, reglasRegistro)
        expect(errores.run).toBeUndefined()
    })

    it('acepta un RUN de 7 dígitos', () => {
        const errores = validar({ ...valoresValidos, run: '1234567K' }, reglasRegistro)
        expect(errores.run).toBeUndefined()
    })

    it('rechaza un RUN inválido', () => {
        const errores = validar({ ...valoresValidos, run: '1234' }, reglasRegistro)
        expect(errores.run).toBe('Ingrese un RUN válido sin puntos ni guion (ej: 19011022K).')
    })

    it('exige el nombre', () => {
        const errores = validar({ ...valoresValidos, nombre: '   ' }, reglasRegistro)
        expect(errores.nombre).toBe('El nombre es obligatorio.')
    })

    it('rechaza un nombre de más de 50 caracteres', () => {
        const errores = validar({ ...valoresValidos, nombre: 'a'.repeat(51) }, reglasRegistro)
        expect(errores.nombre).toBe('Máximo 50 caracteres.')
    })

    it('exige la fecha de nacimiento', () => {
        const errores = validar({ ...valoresValidos, fechaNac: '' }, reglasRegistro)
        expect(errores.fechaNac).toBe('La fecha de nacimiento es obligatoria.')
    })

    it('rechaza a un menor de edad', () => {
        const errores = validar({ ...valoresValidos, fechaNac: `${anio - 10}-01-01` }, reglasRegistro)
        expect(errores.fechaNac).toBe('Debes ser mayor de 18 años para registrarte.')
    })

    it('exige la comuna', () => {
        const errores = validar({ ...valoresValidos, comuna: '' }, reglasRegistro)
        expect(errores.comuna).toBe('Selecciona una comuna.')
    })

    it('exige la dirección', () => {
        const errores = validar({ ...valoresValidos, direccion: '' }, reglasRegistro)
        expect(errores.direccion).toBe('La dirección es obligatoria.')
    })

    it('rechaza una dirección de más de 300 caracteres', () => {
        const errores = validar({ ...valoresValidos, direccion: 'a'.repeat(301) }, reglasRegistro)
        expect(errores.direccion).toBe('Máximo 300 caracteres.')
    })

    it('rechaza contraseñas que no coinciden', () => {
        const errores = validar({ ...valoresValidos, pass2: '12345' }, reglasRegistro)
        expect(errores.pass2).toBe('Las contraseñas no coinciden.')
    })
})

describe('reglasContacto', () => {
    const valoresValidos = {
        asunto: 'Consulta',
        email: 'ana@gmail.com',
        mensaje: 'Hola, quisiera información.',
    }

    it('no devuelve errores con datos válidos', () => {
        expect(validar(valoresValidos, reglasContacto)).toEqual({})
    })

    it('exige el asunto', () => {
        const errores = validar({ ...valoresValidos, asunto: '' }, reglasContacto)
        expect(errores.asunto).toBe('El asunto es obligatorio.')
    })

    it('rechaza un asunto de más de 100 caracteres', () => {
        const errores = validar({ ...valoresValidos, asunto: 'a'.repeat(101) }, reglasContacto)
        expect(errores.asunto).toBe('Máximo 100 caracteres.')
    })

    it('exige el mensaje', () => {
        const errores = validar({ ...valoresValidos, mensaje: '' }, reglasContacto)
        expect(errores.mensaje).toBe('El mensaje es obligatorio.')
    })

    it('rechaza un mensaje de más de 500 caracteres', () => {
        const errores = validar({ ...valoresValidos, mensaje: 'a'.repeat(501) }, reglasContacto)
        expect(errores.mensaje).toBe('Máximo 500 caracteres.')
    })
})

describe('reglasCheckout', () => {
    const valoresValidos = {
        nombre: 'Ana',
        apellidos: 'Pérez Soto',
        correo: 'ana@duoc.cl',
        calle: 'Avenida Libertad 100',
        departamento: '',
        region: 'Valparaíso',
        comuna: 'Viña del Mar',
        indicaciones: '',
    }

    it('no devuelve errores con datos válidos', () => {
        expect(validar(valoresValidos, reglasCheckout)).toEqual({})
    })

    it('exige los apellidos', () => {
        const errores = validar({ ...valoresValidos, apellidos: '' }, reglasCheckout)
        expect(errores.apellidos).toBe('Los apellidos son obligatorios.')
    })

    it('exige la calle', () => {
        const errores = validar({ ...valoresValidos, calle: '' }, reglasCheckout)
        expect(errores.calle).toBe('La calle es obligatoria.')
    })

    it('rechaza un departamento de más de 20 caracteres', () => {
        const errores = validar({ ...valoresValidos, departamento: 'a'.repeat(21) }, reglasCheckout)
        expect(errores.departamento).toBe('Máximo 20 caracteres.')
    })

    it('exige la región', () => {
        const errores = validar({ ...valoresValidos, region: '' }, reglasCheckout)
        expect(errores.region).toBe('Selecciona una región.')
    })

    it('exige la comuna', () => {
        const errores = validar({ ...valoresValidos, comuna: '' }, reglasCheckout)
        expect(errores.comuna).toBe('La comuna es obligatoria.')
    })

    it('rechaza indicaciones de más de 300 caracteres', () => {
        const errores = validar({ ...valoresValidos, indicaciones: 'a'.repeat(301) }, reglasCheckout)
        expect(errores.indicaciones).toBe('Máximo 300 caracteres.')
    })
})

describe('crearReglasCita', () => {
    const reglas = crearReglasCita({
        hoy: '2026-10-16',
        horariosDisponibles: ['10:00', '11:00'],
    })

    const valoresValidos = {
        fecha: '2026-10-20',
        hora: '10:00',
        nombreMascota: 'Rocky',
        especie: 'Perro',
        edad: '3',
    }

    it('no devuelve errores con datos válidos', () => {
        expect(validar(valoresValidos, reglas)).toEqual({})
    })

    it('acepta la fecha de hoy', () => {
        const errores = validar({ ...valoresValidos, fecha: '2026-10-16' }, reglas)
        expect(errores.fecha).toBeUndefined()
    })

    it('exige la fecha', () => {
        const errores = validar({ ...valoresValidos, fecha: '' }, reglas)
        expect(errores.fecha).toBe('Selecciona una fecha.')
    })

    it('rechaza una fecha pasada', () => {
        const errores = validar({ ...valoresValidos, fecha: '2026-10-15' }, reglas)
        expect(errores.fecha).toBe('No puedes seleccionar una fecha pasada.')
    })

    it('exige la hora', () => {
        const errores = validar({ ...valoresValidos, hora: '' }, reglas)
        expect(errores.hora).toBe('Selecciona un horario disponible.')
    })

    it('rechaza una hora no disponible', () => {
        const errores = validar({ ...valoresValidos, hora: '12:00' }, reglas)
        expect(errores.hora).toBe('Selecciona un horario disponible.')
    })

    it('exige el nombre de la mascota', () => {
        const errores = validar({ ...valoresValidos, nombreMascota: '' }, reglas)
        expect(errores.nombreMascota).toBe('Ingresa el nombre de la mascota.')
    })

    it('exige la especie', () => {
        const errores = validar({ ...valoresValidos, especie: '' }, reglas)
        expect(errores.especie).toBe('Selecciona una especie.')
    })

    it('exige la edad', () => {
        const errores = validar({ ...valoresValidos, edad: '' }, reglas)
        expect(errores.edad).toBe('Ingresa una edad válida (en años).')
    })

    it('acepta la edad cero', () => {
        const errores = validar({ ...valoresValidos, edad: '0' }, reglas)
        expect(errores.edad).toBeUndefined()
    })

    it('rechaza una edad negativa', () => {
        const errores = validar({ ...valoresValidos, edad: '-1' }, reglas)
        expect(errores.edad).toBe('Ingresa una edad válida (en años).')
    })

    it('rechaza una edad con decimales', () => {
        const errores = validar({ ...valoresValidos, edad: '2.5' }, reglas)
        expect(errores.edad).toBe('Ingresa una edad válida (en años).')
    })

    it('rechaza una edad que no es número', () => {
        const errores = validar({ ...valoresValidos, edad: 'abc' }, reglas)
        expect(errores.edad).toBe('Ingresa una edad válida (en años).')
    })
})