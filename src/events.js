export const categories = [
  { id: 'all', label: 'Todos los eventos', icon: 'grid' },
  { id: 'meetup', label: 'Meetups', icon: 'users' },
  { id: 'workshop', label: 'Workshops', icon: 'code' },
  { id: 'conference', label: 'Conferencias', icon: 'mic' },
  { id: 'networking', label: 'Networking', icon: 'coffee' },
];

// Example programming, not a feed of verified community events.
export const events = [
  { id: 'ai', title: 'IA en producción: del notebook al mundo real', category: 'meetup', date: '2026-10-28', time: '18:30', end: '20:30', venue: 'Polo Nacional de Contenidos Digitales', address: 'Av. de Sor Teresa Prat, 15, Málaga', host: 'Málaga AI', initials: 'AI', tags: ['Inteligencia artificial', 'Python'], attendees: 48, art: 'ai', description: 'Una tarde para explorar cómo llevar modelos de inteligencia artificial a producción. Hablaremos de despliegue, evaluación y de esos pequeños detalles que no salen en los notebooks. Terminamos compartiendo ideas con la comunidad.', free: true },
  { id: 'react', title: 'React & cañas: construyendo para la web de hoy', category: 'meetup', date: '2026-10-29', time: '19:00', end: '21:00', venue: 'La Térmica', address: 'Av. de los Guindos, 48, Málaga', host: 'Málaga JS', initials: 'JS', tags: ['Frontend', 'React'], attendees: 36, art: 'react', description: 'Componentes, nuevas ideas y buenas conversaciones. Un encuentro para compartir lo que estamos construyendo con React, aprender de proyectos de la comunidad y conocer a otros developers de Málaga.', free: true },
  { id: 'design', title: 'De Figma a código, sin perder un píxel', category: 'workshop', date: '2026-10-30', time: '17:00', end: '20:00', venue: 'Innovation Campus', address: 'C. Medellín, 3, Málaga', host: 'Friends of Figma Málaga', initials: 'FoF', tags: ['Diseño', 'Frontend'], attendees: 24, art: 'design', description: 'Un taller práctico sobre sistemas de diseño y colaboración entre diseño y desarrollo. Trae tu portátil: vamos a transformar un diseño en una interfaz accesible y responsive.', free: true },
  { id: 'coffee', title: 'Café, código y conexiones', category: 'networking', date: '2026-10-31', time: '10:00', end: '12:00', venue: 'Santa Coffee Soho', address: 'C. Tomás Heredia, 5, Málaga', host: 'Málaga Tech Community', initials: 'mt', tags: ['Comunidad', 'Café'], attendees: 18, art: 'coffee', description: 'Sin slides, sin agenda y sin prisas. Solo un buen café y gente con ganas de conversar sobre tecnología, proyectos y la vida en Málaga. Tanto si acabas de llegar como si llevas aquí toda la vida, este es tu sitio.', free: true },
  { id: 'cloud', title: 'Cloud Native Málaga: más allá de los contenedores', category: 'conference', date: '2026-11-05', time: '18:00', end: '21:00', venue: 'Google Safety Engineering Center', address: 'Paseo de la Farola, 6, Málaga', host: 'Cloud Native Málaga', initials: 'CN', tags: ['Cloud', 'DevOps'], attendees: 64, art: 'cloud', description: 'Una jornada dedicada a la infraestructura cloud native: observabilidad, Kubernetes y experiencias de equipos locales. Ideas prácticas y conversaciones sobre los retos de operar a escala.', free: true },
  { id: 'security', title: 'Hack & learn: tu primer reto de ciberseguridad', category: 'workshop', date: '2026-11-07', time: '10:00', end: '13:00', venue: 'Link by UMA', address: 'Bulevar Louis Pasteur, 30, Málaga', host: 'Málaga Hackers', initials: '>_', tags: ['Ciberseguridad', 'Hands-on'], attendees: 30, art: 'security', description: 'Una introducción práctica a la ciberseguridad en un entorno de aprendizaje controlado. Resolveremos retos de iniciación en equipo. Solo necesitas tu portátil y curiosidad.', free: true },
];

export function filterEvents(items, { category = 'all', query = '', day = '', savedOnly = false, saved = [] } = {}) {
  const normalize = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const needle = normalize(query.trim());
  return items.filter((event) =>
    (category === 'all' || event.category === category) &&
    (!day || event.date === day) &&
    (!savedOnly || saved.includes(event.id)) &&
    (!needle || normalize([event.title, event.host, event.venue, ...event.tags].join(' ')).includes(needle)),
  );
}
