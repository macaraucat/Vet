import { useState } from 'react'
import { validar } from '../utils/validaciones'

function useFormulario(valoresIniciales, reglas, alEnviar) {
    const [valores, setValores] = useState(valoresIniciales)
    const [errores, setErrores] = useState({})
    const [errorGeneral, setErrorGeneral] = useState('')

    const handleChange = (e) => {
        const { name, value } = e.target
        setValores((prev) => ({ ...prev, [name]: value }))
        setErrores((prev) => {
            if (!prev[name]) return prev
            const restantes = { ...prev }
            delete restantes[name]
            return restantes
        })
        setErrorGeneral('')
    }

    const limpiarErrores = () => {
        setErrores({})
        setErrorGeneral('')
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const reglasActuales = typeof reglas === 'function' ? reglas(valores) : reglas
        const nuevos = validar(valores, reglasActuales)
        setErrores(nuevos)
        setErrorGeneral('')
        if (Object.keys(nuevos).length > 0) return

        const error = alEnviar(valores)
        if (error) setErrorGeneral(error)
        else setValores(valoresIniciales)
    }

    return { valores, errores, errorGeneral, handleChange, handleSubmit, limpiarErrores }
}

export default useFormulario