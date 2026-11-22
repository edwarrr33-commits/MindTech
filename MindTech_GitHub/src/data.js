export const assessments = [
  {
    id: 'stress', title: 'Nivel de estrés', subtitle: 'Reconoce qué tanto te está exigiendo tu día a día.',
    icon: 'activity', duration: '3 min', color: 'violet',
    questions: [
      '¿Con qué frecuencia has sentido que tienes demasiadas cosas por hacer?',
      '¿Te ha costado relajarte al terminar tus actividades?',
      '¿Has sentido que no tienes control sobre situaciones importantes?',
      '¿Has tenido dificultad para concentrarte por las preocupaciones?',
      '¿Has sentido tensión física, como hombros rígidos o mandíbula apretada?'
    ]
  },
  {
    id: 'anxiety', title: 'Señales de ansiedad', subtitle: 'Explora cómo te has sentido emocionalmente.',
    icon: 'heart-pulse', duration: '3 min', color: 'blue',
    questions: [
      '¿Te has sentido inquieto o en alerta sin una razón clara?',
      '¿Te ha resultado difícil detener o controlar tus preocupaciones?',
      '¿Has sentido dificultad para descansar o conciliar el sueño?',
      '¿Has notado tensión, agitación o sensación de nerviosismo?',
      '¿Las preocupaciones han interferido con tus actividades cotidianas?'
    ]
  },
  {
    id: 'burnout', title: 'Agotamiento (burnout)', subtitle: 'Identifica señales de cansancio relacionado con tus actividades.',
    icon: 'battery-low', duration: '4 min', color: 'orange',
    questions: [
      '¿Has terminado el día sintiéndote emocionalmente agotado?',
      '¿Te ha costado encontrar motivación para comenzar tus tareas?',
      '¿Has sentido que necesitas más tiempo del habitual para recuperarte?',
      '¿Te has sentido distante o desconectado de tus actividades?',
      '¿Sientes que tus responsabilidades superan los recursos que tienes?'
    ]
  }
];

export const options = [
  { label: 'Nunca', value: 0 },
  { label: 'Pocas veces', value: 1 },
  { label: 'Algunas veces', value: 2 },
  { label: 'Frecuentemente', value: 3 },
  { label: 'Casi siempre', value: 4 }
];

export function interpretation(score, max) {
  const ratio = score / max;
  if (ratio < .34) return { label: 'Bajo', tone: 'green', text: 'Tus respuestas reflejan pocas señales en este momento. Mantén tus hábitos de autocuidado.' };
  if (ratio < .67) return { label: 'Moderado', tone: 'amber', text: 'Puede ser útil prestar atención a cómo te estás sintiendo e incorporar pausas de cuidado.' };
  return { label: 'Elevado', tone: 'rose', text: 'Tus respuestas sugieren que sería conveniente buscar apoyo y revisar qué cambios pueden ayudarte.' };
}