import { useState } from 'react';
import { validarCorreo } from '../utils/validaciones';

function useContacto() {
    const [form, setForm] = useState({ asunto: '', email: '', mensaje: '' });
    const [errores, setErrores] = useState({});
    const [enviado, setEnviado] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const nuevosErrores = {};

        if (!form.asunto.trim()) nuevosErrores.asunto = 'El asunto es obligatorio.';
        else if (form.asunto.length > 100) nuevosErrores.asunto = 'Máximo 100 caracteres.';

        if (!form.email.trim()) nuevosErrores.email = 'El correo es obligatorio.';
        else if (!validarCorreo(form.email.trim())) nuevosErrores.email = 'Solo @duoc.cl, @profesor.duoc.cl o @gmail.com.';

        if (!form.mensaje.trim()) nuevosErrores.mensaje = 'El mensaje es obligatorio.';
        else if (form.mensaje.length > 500) nuevosErrores.mensaje = 'Máximo 500 caracteres.';

        setErrores(nuevosErrores);

        if (Object.keys(nuevosErrores).length === 0) {
            setEnviado(true);
            setForm({ asunto: '', email: '', mensaje: '' });
        }
    };

    return { form, errores, enviado, handleChange, handleSubmit };
}

export default useContacto;