import { useState } from 'react';

const noticias = [
  {
    titulo: 'Una cirugía de emergencia con final feliz',
    corto: 'Firulais llegó en estado crítico por un accidente, fue operado de urgencia y, tras semanas de cuidados y acompañamiento familiar, se recuperó por completo.',
    extendido: 'Firulais llegó a nuestra clínica en estado crítico tras un accidente, con signos vitales alterados y una lesión que requería intervención inmediata. Nuestro equipo médico actuó rápido: en menos de una hora ya estaba en cirugía, estabilizado y bajo constante monitoreo. Los días posteriores fueron clave, con curaciones diarias, controles de dolor y mucho acompañamiento de su familia, que no se separó de él en ningún momento. Hoy, varias semanas después, Firulais corre, juega y mueve la cola como si nada hubiera pasado, un recordatorio de por qué actuar a tiempo puede marcar toda la diferencia.',
    img: '/img/firulais.jpg',
    alt: 'Firulais',
  },
  {
    titulo: 'Problemas dentales en conejos',
    corto: 'Sus dientes crecen continuamente; desequilibrios en la dieta o alineación pueden causar problemas graves. Revisiones periódicas y dieta rica en fibra ayudan a prevenirlos.',
    extendido: 'Los conejos son pacientes poco comunes en la consulta diaria, pero cada vez llegan más a nuestra clínica, y sus dientes suelen ser la razón principal. A diferencia de perros y gatos, sus dientes crecen de forma continua durante toda su vida, así que cualquier desequilibrio en su dieta o alineación dental puede derivar en molestias serias. Señales como babeo, pérdida de apetito o cambios en el pelaje alrededor del hocico son motivo suficiente para pedir hora. Con revisiones periódicas y una dieta rica en fibra, la mayoría de estos problemas se puede prevenir antes de que se convierta en una urgencia.',
    img: '/img/conejo.jpg',
    alt: 'Conejo',
  },
];

function useNoticias() {
  const [expandido, setExpandido] = useState({});

  const toggleExpandir = (i) => {
    setExpandido((prev) => ({ ...prev, [i]: !prev[i] }));
  };

  return { noticias, expandido, toggleExpandir };
}

export default useNoticias;