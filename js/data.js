/* MĒTODO / AI LAB — contenido y reglas.
   Todo el texto del diagnóstico, las rutas y las demos vive aquí.
   Edita este archivo para ajustar redacción sin tocar la lógica. */

window.LAB = window.LAB || {};
LAB.views = LAB.views || {};
LAB.actions = LAB.actions || {};

LAB.CONFIG = {
  evento: 'Encuentro Binacional de Hospitalidad Médica',
  fecha: '19 de noviembre de 2026',
  ciudad: 'Tijuana',
  // Sitio que aparece en el resumen descargable. Déjalo vacío ('') para ocultarlo.
  sitio: { texto: 'mētodo.com', url: 'https://xn--mtodo-iza.com' },
  // Dirección pública de la app (GitHub Pages). El QR apunta a esta URL + #/diagnostico.
  urlPublica: 'https://ateneaherk35-del.github.io/metodo-ai-lab/',
  // URL de la implementación web de Apps Script que guarda los contactos en Google Sheets.
  // Mientras esté vacía, los contactos se guardan solo en el dispositivo (y en las computadoras
  // del stand se pueden exportar a CSV). También puede capturarse desde el panel de operador.
  contactEndpoint: 'https://script.google.com/macros/s/AKfycbxlF7i1h3GlVFuMnwboeUF5DxQ6-9dZLjHCm8hlyLrvczZGnccnwyW0tSJF-3IMMbiU/exec',
  // El celular es obligatorio antes de ver el resultado.
  celularObligatorio: true,
  // Supuestos de la calculadora (editables por el visitante en el resultado).
  supuestos: { cierre: 25, fuga: 20, inasistencia: 10, cargaPatronal: 35 },
  // Inversión mensual del sistema con IA de MĒTODO por ruta (MXN). null = se define en la sesión estratégica.
  inversionIA: { adquisicion: null, contenido: null, atencion: null, seguimiento: null, operacion: null }
};

LAB.AVISO = [
  'MĒTODO (Atenea Kurevelis), con domicilio en Tijuana, Baja California, es responsable de los datos que nos compartes aquí: nombre, celular, organización, correo (opcional) y tus respuestas sobre la operación de tu negocio. No pedimos ni guardamos información de pacientes.',
  'Los usamos para mostrarte tu resultado y contactarte por WhatsApp o correo para dar seguimiento a este diagnóstico. Solo si lo autorizas por separado, también para enviarte información de talleres y eventos de MĒTODO.',
  'No vendemos tus datos ni los compartimos con terceros para fines comerciales. Se guardan en las herramientas de trabajo de MĒTODO.',
  'Puedes pedir acceso, corrección o cancelación de tus datos, oponerte a su uso o retirar tu consentimiento respondiendo al mensaje que te enviemos o a través de mētodo.com.'
];

/* ---------- Preguntas ---------- */
LAB.QUESTIONS = [
  {
    id: 'org',
    corto: 'Organización',
    ayuda: 'Para adaptar los ejemplos a tu tipo de operación.',
    titulo: '¿Qué tipo de organización representas?',
    opciones: [
      { id: 'consultorio', label: 'Consultorio', cita: 'un consultorio', tu: 'tu consultorio' },
      { id: 'clinica', label: 'Clínica', cita: 'una clínica', tu: 'tu clínica' },
      { id: 'hospital', label: 'Hospital', cita: 'un hospital', tu: 'tu hospital' },
      { id: 'turismo', label: 'Servicios para turismo médico', cita: 'una empresa de servicios para turismo médico', tu: 'tu empresa' },
      { id: 'otro', label: 'Otro', cita: 'otro tipo de organización del sector', tu: 'tu organización' }
    ]
  },
  {
    id: 'rol',
    corto: 'Tu función',
    ayuda: 'Para saber quién debería liderar el cambio en tu equipo.',
    titulo: '¿Cuál es tu función?',
    opciones: [
      { id: 'direccion', label: 'Dirección o propietario', cita: 'dirección o propietario',
        lidera: 'Como dirección, eres el sponsor ejecutivo: defines prioridades y presupuesto. Asigna un responsable operativo que supervise al agente día a día.' },
      { id: 'salud', label: 'Profesional de salud', cita: 'profesional de salud',
        lidera: 'Tu rol es el de validación clínica: nada que implique criterio médico sale sin tu visto bueno. La operación diaria la lidera atención o marketing.' },
      { id: 'admin', label: 'Administración', cita: 'administración',
        lidera: 'Tú serías el responsable operativo del sistema. Pide a dirección que formalice el protocolo de escalamiento y los temas que el agente nunca debe tocar.' },
      { id: 'marketing', label: 'Marketing y ventas', cita: 'marketing y ventas',
        lidera: 'Tú puedes liderar la implementación como dueño del sistema. Involucra a dirección como sponsor y a un especialista como validador clínico.' },
      { id: 'otra', label: 'Otra', cita: 'otra función',
        lidera: 'Antes de arrancar, define un dueño del sistema, un sponsor en dirección y un validador clínico.' }
    ]
  },
  {
    id: 'problema',
    corto: 'El atasco',
    ayuda: 'Esta respuesta define tu recomendación principal.',
    titulo: '¿Dónde se está atorando más tu operación?',
    opciones: [
      { id: 'adquisicion', label: 'Atraer prospectos adecuados.' },
      { id: 'contenido', label: 'Crear contenido que comunique nuestra experiencia.' },
      { id: 'atencion', label: 'Responder mensajes y coordinar solicitudes de cita.' },
      { id: 'seguimiento', label: 'Dar seguimiento a interesados y clientes.' },
      { id: 'operacion', label: 'Organizar tareas e información del equipo.' }
    ]
  },
  {
    id: 'nivel',
    corto: 'Herramientas',
    ayuda: 'Define qué necesitas antes de empezar y tu primer paso.',
    titulo: '¿Cómo resuelven actualmente ese proceso?',
    opciones: [
      { id: 'manual', label: 'Manualmente', cita: 'lo resuelven de forma manual' },
      { id: 'desconectadas', label: 'Con varias herramientas desconectadas', cita: 'lo resuelven con varias herramientas que no están conectadas entre sí' },
      { id: 'centralizado', label: 'Con un sistema centralizado', cita: 'ya trabajan con un sistema centralizado' },
      { id: 'parcial', label: 'Ya está parcialmente automatizado', cita: 'ya lo tienen parcialmente automatizado' }
    ]
  },
  {
    id: 'frecuencia',
    corto: 'Frecuencia',
    ayuda: 'Nos dice si conviene empezar por aquí o primero documentar.',
    titulo: '¿Con qué frecuencia genera trabajo o retrasos?',
    opciones: [
      { id: 'diario', label: 'Todos los días', cita: 'todos los días' },
      { id: 'semanal', label: 'Varias veces por semana', cita: 'varias veces por semana' },
      { id: 'ocasional', label: 'Ocasionalmente', cita: 'de forma ocasional' }
    ]
  },
  {
    id: 'objetivo',
    corto: 'Prioridad',
    ayuda: 'Define el indicador que vas a medir para saber si funciona.',
    titulo: '¿Qué resultado quieren priorizar en los próximos 90 días?',
    opciones: [
      { id: 'oportunidades', label: 'Más oportunidades comerciales' },
      { id: 'rapidez', label: 'Responder más rápido' },
      { id: 'tiempo', label: 'Recuperar tiempo del equipo' },
      { id: 'seguimiento', label: 'Mejor seguimiento' },
      { id: 'comunicacion', label: 'Comunicación más consistente' }
    ]
  },
  {
    id: 'ticket',
    corto: 'Ticket promedio',
    ayuda: 'Con esto calculamos cuánto dinero puede estar escapándose. Puedes ajustarlo después.',
    titulo: '¿Cuál es el ticket promedio por paciente?',
    opciones: [
      { id: 't1', label: 'Menos de $2,000 MXN', valor: 1500 },
      { id: 't2', label: '$2,000 a $10,000 MXN', valor: 6000 },
      { id: 't3', label: '$10,000 a $50,000 MXN', valor: 30000 },
      { id: 't4', label: '$50,000 a $150,000 MXN', valor: 100000 },
      { id: 't5', label: 'Más de $150,000 MXN', valor: 200000 }
    ]
  },
  {
    id: 'volumen',
    corto: 'Volumen',
    ayuda: 'Mensajes, llamadas o formularios de personas interesadas, de todos los canales.',
    titulo: '¿Cuántas solicitudes o prospectos reciben al mes?',
    opciones: [
      { id: 'v1', label: 'Menos de 50', valor: 30 },
      { id: 'v2', label: '50 a 150', valor: 100 },
      { id: 'v3', label: '150 a 500', valor: 300 },
      { id: 'v4', label: 'Más de 500', valor: 600 }
    ]
  }
];

/* ---------- Nivel de herramientas → requisito extra y primer paso ---------- */
LAB.NIVELES = {
  manual: {
    corto: 'Documentar el proceso actual paso a paso.',
    requisito: 'Antes de cualquier herramienta: escribir el proceso actual paso a paso.',
    primerPaso: 'Documenta en una sola hoja {proceso}: qué pasos hay, quién los hace y qué información usan. Ese documento es la base para configurar el agente.'
  },
  desconectadas: {
    corto: 'Elegir una sola herramienta como fuente principal.',
    requisito: 'Elegir cuál herramienta será la fuente principal de información.',
    primerPaso: 'Elige una sola herramienta como fuente principal y anota dónde vive hoy cada dato sobre {proceso}. El agente necesita un solo punto de partida.'
  },
  centralizado: {
    corto: 'Revisar qué permite conectar tu sistema y armar el piloto.',
    requisito: 'Confirmar qué datos permite exportar o conectar tu sistema actual.',
    primerPaso: 'Revisa qué permite exportar o conectar tu sistema y arma una prueba piloto con {piloto}, con revisión humana de cada resultado.'
  },
  parcial: {
    corto: 'Ubicar dónde se rompe la automatización que ya tienen.',
    requisito: 'Ubicar exactamente en qué punto la automatización actual se queda corta.',
    primerPaso: 'Identifica dónde se rompe la automatización que ya tienen. El agente debe cubrir el tramo que hoy sigue dependiendo de una persona: {tramo}.'
  }
};

/* ---------- Frecuencia → contexto de prioridad ---------- */
LAB.FRECUENCIAS = {
  diario: 'Como ocurre todos los días, es buen candidato para empezar: en poco tiempo tendrás suficientes casos para comparar el antes y el después.',
  semanal: 'Ocurre varias veces por semana, así que hay volumen suficiente para una prueba piloto y para medir si cambia algo.',
  ocasional: 'Ocurre de vez en cuando. Antes de automatizar, confirma que cada retraso cuesta lo suficiente para justificarlo; a veces basta con documentar bien el proceso.'
};

/* ---------- Las cinco rutas ---------- */
LAB.ROUTES = {
  adquisicion: {
    area: 'Adquisición',
    problemaCorto: 'atraer prospectos adecuados',
    oportunidad: 'Construir un motor de adquisición de pacientes predecible y medible',
    agente: 'Asistente de adquisición',
    tarea: 'Analiza tu oferta por línea de servicio, tus audiencias y el desempeño de cada canal, y propone experimentos priorizados para que tu equipo los apruebe antes de invertir.',
    humano: 'Tu equipo define la estrategia comercial, aprueba presupuesto y creatividades, y garantiza que cada pieza cumpla con la normativa de publicidad en salud.',
    requisitos: [
      'Propuesta de valor y paciente ideal definidos por línea de servicio.',
      'Acceso a las cuentas publicitarias y a la analítica actual.',
      'Un responsable con autoridad para aprobar experimentos y presupuesto.'
    ],
    proceso: 'cómo consiguen hoy sus prospectos (de dónde llegan y dónde se registran)',
    piloto: 'un solo servicio y un solo canal',
    tramo: 'el análisis de resultados y la propuesta de la siguiente prueba',
    natural: 'oportunidades',
    demo: 'c',
    demoNota: 'La demo C muestra la parte de contenido: cómo un agente convierte la experiencia de tu equipo en mensajes. En adquisición, esos mensajes son la materia prima de las pruebas que se proponen.'
  },
  contenido: {
    area: 'Contenido',
    problemaCorto: 'crear contenido que comunique su experiencia',
    oportunidad: 'Convertir el expertise médico de tu equipo en autoridad de marca',
    agente: 'Asistente editorial',
    tarea: 'Transforma el conocimiento de tus especialistas —preguntas frecuentes, procesos, experiencia clínica— en una línea editorial constante, lista para aprobación médica.',
    humano: 'Tus especialistas aportan el criterio clínico y son la cara de la marca; tu equipo de marketing dirige la línea editorial y aprueba cada publicación.',
    requisitos: [
      'Un banco de preguntas reales de pacientes.',
      'Un bloque fijo de revisión con un especialista del equipo.',
      'Una política clara: nada se publica sin aprobación médica.'
    ],
    proceso: 'cómo deciden hoy qué publicar y quién lo produce',
    piloto: 'un solo formato (por ejemplo, video corto)',
    tramo: 'pasar de la idea al guion revisado',
    natural: 'comunicacion',
    demo: 'c',
    demoNota: 'La demo C muestra exactamente esta parte: de una especialidad, un público y un objetivo a temas, gancho, guion y llamada a la acción.'
  },
  atencion: {
    area: 'Atención',
    problemaCorto: 'responder mensajes y coordinar solicitudes de cita',
    oportunidad: 'Responder a cada paciente en minutos, en su idioma y con información aprobada',
    agente: 'Asistente bilingüe de atención',
    tarea: 'Atiende en inglés y español las consultas administrativas de todos los canales, califica cada solicitud y la entrega a recepción como una ficha lista para agendar. Nunca responde precios, disponibilidad ni temas clínicos sin validación humana.',
    humano: 'Tu equipo de atención confirma disponibilidad, agenda, resuelve cualquier tema clínico o comercial y supervisa la calidad de cada respuesta.',
    requisitos: [
      'Base de respuestas aprobadas en inglés y español.',
      'Protocolo de escalamiento: qué temas siempre pasan a una persona.',
      'Mapa de canales de entrada y responsables actuales.'
    ],
    proceso: 'cómo llegan hoy los mensajes y quién los contesta',
    piloto: 'un solo canal (por ejemplo, WhatsApp)',
    tramo: 'la primera respuesta y el armado de la solicitud de cita',
    natural: 'rapidez',
    demo: 'a',
    demoNota: 'La demo A muestra esta parte: una consulta en inglés, la respuesta administrativa con su traducción y la ficha para recepción, con revisión humana.'
  },
  seguimiento: {
    area: 'Seguimiento',
    problemaCorto: 'dar seguimiento a interesados y clientes',
    oportunidad: 'Que ninguna oportunidad comercial se enfríe por falta de seguimiento',
    agente: 'Asistente de seguimiento comercial',
    tarea: 'Monitorea tu pipeline, detecta oportunidades sin actividad y propone el siguiente contacto con el contexto de cada caso, listo para aprobación.',
    humano: 'Tu equipo comercial aprueba cada mensaje, conduce las conversaciones y decide cuándo avanzar o cerrar cada oportunidad.',
    requisitos: [
      'Un pipeline único con etapas definidas.',
      'Reglas de seguimiento por etapa (cadencias).',
      'Un responsable comercial que apruebe los mensajes.'
    ],
    proceso: 'dónde anotan hoy a los interesados y cómo saben a quién falta darle seguimiento',
    piloto: 'los interesados de un solo servicio',
    tramo: 'detectar el pendiente y redactar el mensaje con contexto',
    natural: 'seguimiento',
    demo: 'b',
    demoNota: 'La demo B muestra esta parte: el tablero de interesados, el pendiente, el mensaje propuesto y la aprobación.'
  },
  operacion: {
    area: 'Operación',
    problemaCorto: 'organizar tareas e información del equipo',
    oportunidad: 'Una operación ordenada, visible y con responsables claros',
    agente: 'Asistente de operación',
    tarea: 'Convierte acuerdos de juntas, mensajes y correos en tareas con responsable y fecha, y entrega a dirección una visión semanal de pendientes y riesgos.',
    humano: 'Tu equipo asigna prioridades, ejecuta y resuelve; dirección destraba lo que se atora.',
    requisitos: [
      'Una plataforma única de gestión de tareas.',
      'Responsables definidos por área.',
      'Un ritual fijo de revisión de pendientes.'
    ],
    proceso: 'cómo se reparten hoy las tareas y cómo se enteran de lo que está pendiente',
    piloto: 'un solo tipo de pendiente (por ejemplo, el seguimiento administrativo de citas)',
    tramo: 'pasar de un acuerdo a una tarea con responsable y fecha',
    natural: 'tiempo',
    demo: 'b',
    demoNota: 'La demo B, en su tablero de pendientes del equipo, muestra una parte de esto: cómo un acuerdo se convierte en tarea con responsable y cambia de etapa cuando alguien la aprueba.'
  }
};

/* ---------- Objetivo × ruta → beneficio e indicador ----------
   beneficio: cómo se conecta el agente con lo que quieren priorizar.
   indicador: qué medir primero. medir: cómo tomar el punto de partida. */
LAB.MATRIZ = {
  adquisicion: {
    oportunidades: { beneficio: 'Las pruebas se enfocan en traer prospectos que sí encajan con tus servicios, no solo más mensajes.', indicador: 'Prospectos calificados (MQL) por semana', medir: 'Define qué significa "sí es para nosotros" y cuenta cada semana cuántos prospectos cumplen ese criterio. Anota la cifra actual antes de empezar.' },
    rapidez: { beneficio: 'Si llegan prospectos mejor definidos, tu equipo pierde menos tiempo en conversaciones que no avanzan y puede contestar antes a los que sí.', indicador: 'SLA de primera respuesta a prospectos nuevos', medir: 'Toma una muestra de mensajes nuevos y anota cuánto pasa entre que llegan y la primera respuesta.' },
    tiempo: { beneficio: 'Revisar campañas y canales deja de ser una tarea manual; la persona solo revisa lo que propone el agente y decide.', indicador: 'Horas-equipo por semana dedicadas al análisis de campañas', medir: 'Pide al responsable que registre durante una semana cuánto tiempo le dedica hoy.' },
    seguimiento: { beneficio: 'Mejores prospectos de entrada facilitan el seguimiento, pero el seguimiento es otro proceso. Este agente trabaja la entrada; si el seguimiento también falla, revísalo después por separado.', indicador: 'Tasa de avance de prospecto nuevo a segunda conversación', medir: 'Cuenta de los prospectos de este mes cuántos tuvieron una segunda conversación.' },
    comunicacion: { beneficio: 'Probar mensajes te dice qué forma de explicar tus servicios conecta mejor, y eso te da una base para comunicar siempre igual.', indicador: 'Experimentos de mensaje con resultado documentado', medir: 'Haz una lista de los mensajes que ya usaron y anota si tienen o no un resultado registrado.' }
  },
  contenido: {
    oportunidades: { beneficio: 'El contenido que responde dudas reales atrae a personas que ya entienden lo que haces. No sustituye una estrategia de adquisición, pero la alimenta.', indicador: 'Solicitudes atribuidas a contenido', medir: 'Pregunta "¿cómo nos conociste?" en cada solicitud y anota cuándo mencionan contenido.' },
    rapidez: { beneficio: 'Si las dudas frecuentes ya están explicadas en contenido aprobado, recepción puede responder compartiendo esa pieza en lugar de escribir desde cero. El efecto en velocidad es indirecto.', indicador: 'Cobertura de preguntas frecuentes con contenido aprobado', medir: 'Lista las 10 preguntas más comunes y marca cuáles ya tienen una pieza aprobada.' },
    tiempo: { beneficio: 'El equipo deja de empezar cada publicación desde una hoja en blanco; su tiempo se va a revisar y grabar.', indicador: 'Tiempo de ciclo editorial: de la idea al guion aprobado', medir: 'Con las próximas tres publicaciones, anota la fecha de la idea y la fecha en que se aprobó el guion.' },
    seguimiento: { beneficio: 'Una pieza útil puede servir como mensaje de seguimiento para un interesado. El seguimiento como proceso necesita su propio sistema.', indicador: 'Contenido utilizado en cadencias de seguimiento', medir: 'Revisa los seguimientos de este mes y cuenta en cuántos se compartió una pieza de contenido.' },
    comunicacion: { beneficio: 'Publicas con ritmo constante y con el mismo criterio editorial, siempre validado por un profesional.', indicador: 'Cumplimiento del calendario editorial', medir: 'Define cuántas publicaciones planean por semana y anota cuántas salen aprobadas.' }
  },
  atencion: {
    oportunidades: { beneficio: 'Cuando una persona recibe una respuesta clara y a tiempo, es más fácil que la conversación llegue a una solicitud de cita. El agente no genera prospectos nuevos; cuida los que ya llegan.', indicador: 'Conversión de conversación a solicitud de cita', medir: 'Durante una semana, cuenta cuántas conversaciones llegan y cuántas terminan en una solicitud.' },
    rapidez: { beneficio: 'Las preguntas administrativas reciben respuesta en el idioma de la persona y recepción recibe la solicitud ya organizada.', indicador: 'Tiempo de primera respuesta (SLA)', medir: 'Con una muestra de mensajes de hoy, anota cuánto pasa entre que llega cada mensaje y la primera respuesta.' },
    tiempo: { beneficio: 'Recepción deja de escribir las mismas respuestas una y otra vez y se concentra en confirmar y agendar.', indicador: 'Respuestas manuales repetitivas por día en recepción', medir: 'Durante dos días, pide a recepción que marque cada respuesta que ya había escrito antes.' },
    seguimiento: { beneficio: 'Cada solicitud queda registrada en una ficha completa, lo que facilita retomarla después. El seguimiento comercial a largo plazo es otro proceso.', indicador: 'Solicitudes de cita con ficha completa en el CRM', medir: 'Revisa las solicitudes de la última semana y cuenta cuántas tienen todos los datos que recepción necesita.' },
    comunicacion: { beneficio: 'Todas las respuestas salen de la misma base aprobada, en inglés y en español, sin depender de quién conteste.', indicador: 'Cobertura bilingüe de la base de conocimiento', medir: 'Lista las preguntas administrativas más comunes y marca cuáles ya tienen respuesta aprobada en inglés y en español.' }
  },
  seguimiento: {
    oportunidades: { beneficio: 'Muchas oportunidades ya están en tu lista de interesados; el agente ayuda a que no se enfríen por falta de un mensaje a tiempo.', indicador: 'Tasa de reactivación de oportunidades', medir: 'Desde hoy, marca cada interesado que responde después de recibir un seguimiento.' },
    rapidez: { beneficio: 'El equipo sabe de inmediato a quién escribir y tiene un mensaje propuesto listo para revisar.', indicador: 'Tiempo de respuesta a oportunidades sin actividad', medir: 'Con los próximos diez pendientes, anota la fecha en que se detectan y la fecha en que se envía el mensaje.' },
    tiempo: { beneficio: 'Nadie tiene que revisar la lista completa para saber qué falta; el agente prepara los pendientes del día.', indicador: 'Tiempo diario de gestión manual del pipeline', medir: 'Pide al responsable que registre durante una semana cuánto tiempo le dedica.' },
    seguimiento: { beneficio: 'Cada interesado tiene una etapa clara y un siguiente paso, y cada mensaje se aprueba antes de enviarse.', indicador: 'Oportunidades sin actividad por más de 7 días', medir: 'Cuenta hoy cuántos hay en tu lista y repite la cuenta cada semana.' },
    comunicacion: { beneficio: 'Los mensajes de seguimiento mantienen el mismo tono y la misma información, sin importar quién del equipo los envíe.', indicador: 'Seguimientos basados en plantillas aprobadas', medir: 'Revisa los seguimientos de la última semana y cuenta cuántos partieron de un texto aprobado.' }
  },
  operacion: {
    oportunidades: { beneficio: 'Un equipo ordenado tiene más capacidad para atender oportunidades, pero este agente no las genera. Si tu prioridad es crecer, revisa también tu proceso de adquisición.', indicador: 'Pendientes comerciales sin responsable asignado', medir: 'Revisa los pendientes comerciales abiertos y cuenta cuántos no tienen responsable claro.' },
    rapidez: { beneficio: 'Cuando cada tarea tiene responsable y fecha, las solicitudes no se quedan esperando a que alguien se dé cuenta.', indicador: 'Tiempo de asignación de acuerdos a responsables', medir: 'Con los acuerdos de las próximas dos juntas, anota cuándo se acordó cada uno y cuándo tuvo responsable.' },
    tiempo: { beneficio: 'Menos tiempo buscando información, preguntando quién tiene qué o repitiendo acuerdos.', indicador: 'Tareas abiertas sin responsable o sin fecha', medir: 'Cuenta hoy cuántas hay y revisa la cifra cada semana.' },
    seguimiento: { beneficio: 'Los pendientes administrativos quedan visibles y nadie depende de su memoria para retomarlos.', indicador: 'Pendientes vencidos al cierre de semana', medir: 'Cada viernes, cuenta cuántos pendientes pasaron su fecha sin resolverse.' },
    comunicacion: { beneficio: 'Todo el equipo trabaja con la misma lista de pendientes y la misma información.', indicador: 'Acuerdos convertidos en tarea el mismo día', medir: 'En las próximas juntas, cuenta cuántos acuerdos quedan registrados como tarea antes de terminar el día.' }
  }
};

/* ---------- Demos: catálogo ---------- */
LAB.DEMOS = {
  d: { letra: 'D', titulo: 'Negocio conectado', rutas: ['adquisicion', 'contenido', 'atencion', 'seguimiento', 'operacion'], resumen: 'Anuncio, website y landing, mensaje, agente, CRM, seguimiento y cita: cómo se ve todo conectado, del primer clic a la reseña.' },
  a: { letra: 'A', titulo: 'Atención bilingüe', rutas: ['atencion'], resumen: 'Una consulta en inglés se convierte en respuesta administrativa, traducción y solicitud organizada para recepción.' },
  b: { letra: 'B', titulo: 'Seguimiento comercial', rutas: ['seguimiento', 'operacion'], resumen: 'Un tablero de interesados y pendientes: el agente detecta qué falta, propone un mensaje y la tarjeta avanza cuando alguien aprueba.' },
  c: { letra: 'C', titulo: 'Contenido', rutas: ['adquisicion', 'contenido'], resumen: 'De una especialidad, un público y un objetivo a tres temas, un gancho, un guion breve y una llamada a la acción.' }
};

/* ---------- Demo A: escenarios ---------- */
LAB.DEMO_A = [
  {
    id: 'cita',
    nombre: 'Solicitud de cita',
    canal: 'WhatsApp · 10:42',
    remitente: 'Jordan (ficticio)',
    consulta: "Hi! I live in San Diego and I'd like to book a first appointment at your clinic sometime next month. How do I request it, and what information or documents do I need to bring? Thanks, Jordan",
    pasos: [
      'Detecta el idioma: inglés.',
      'Clasifica el mensaje: solicitud de cita + requisitos administrativos. No contiene preguntas médicas.',
      'Busca en las respuestas aprobadas por la clínica (base ficticia): proceso de cita e identificación.',
      'Revisa qué no puede responder: disponibilidad y horarios quedan para recepción.',
      'Redacta la respuesta en inglés, la traduce al español y arma la ficha para recepción.'
    ],
    respuestaEN: "Hi Jordan, thank you for reaching out! To request your first appointment, please reply with your full name, a phone number or WhatsApp, and two or three dates that work for you next month. Our front desk team will confirm availability directly with you. For your visit, please bring a valid photo ID. If you are crossing from San Diego, we recommend planning extra time for the border crossing. We'll be happy to help with any other questions.",
    respuestaES: 'Hola, Jordan. ¡Gracias por escribirnos! Para solicitar tu primera cita, responde con tu nombre completo, un teléfono o WhatsApp y dos o tres fechas que te funcionen el próximo mes. Nuestro equipo de recepción te confirmará la disponibilidad directamente. Para tu visita, trae una identificación oficial con foto. Si cruzas desde San Diego, te recomendamos considerar tiempo extra para el cruce fronterizo. Con gusto te ayudamos con cualquier otra duda.',
    ficha: [
      ['Nombre', 'Jordan (falta apellido)'],
      ['Idioma preferido', 'Inglés'],
      ['Origen', 'San Diego, CA'],
      ['Tipo de solicitud', 'Primera cita'],
      ['Fecha deseada', 'Próximo mes, sin fecha específica'],
      ['Datos pendientes', 'Nombre completo · teléfono o WhatsApp · fechas preferidas'],
      ['Acción para recepción', 'Confirmar disponibilidad cuando responda']
    ],
    noRespondio: 'Disponibilidad y horarios. Los confirma recepción.'
  },
  {
    id: 'precio',
    nombre: 'Precio y disponibilidad',
    canal: 'Formulario web · 18:05',
    remitente: 'Taylor (ficticio)',
    consulta: "Hello, how much does a consultation cost and do you have anything available this Saturday morning? Also, will the treatment hurt?",
    pasos: [
      'Detecta el idioma: inglés.',
      'Clasifica el mensaje: pregunta de precio + disponibilidad + una pregunta sobre el tratamiento.',
      'Detecta tres temas que no puede responder: precio, disponibilidad y una pregunta médica.',
      'No inventa respuestas: prepara un mensaje que reconoce cada pregunta y la canaliza a una persona.',
      'Marca la solicitud como prioridad alta para recepción por la fecha cercana.'
    ],
    respuestaEN: "Hello, thank you for your message! Our front desk team will get back to you with the consultation details and to confirm whether there is availability this Saturday morning. Questions about the treatment itself are best answered by the doctor during your consultation, so you get accurate information for your case. Could you share your full name and a phone number or WhatsApp so we can reach you?",
    respuestaES: 'Hola, ¡gracias por tu mensaje! Nuestro equipo de recepción te contactará con los detalles de la consulta y para confirmar si hay disponibilidad este sábado por la mañana. Las preguntas sobre el tratamiento las responde mejor el médico durante tu consulta, para que recibas información precisa para tu caso. ¿Nos compartes tu nombre completo y un teléfono o WhatsApp para contactarte?',
    ficha: [
      ['Nombre', 'Taylor (falta apellido)'],
      ['Idioma preferido', 'Inglés'],
      ['Tipo de solicitud', 'Precio y disponibilidad'],
      ['Fecha deseada', 'Este sábado por la mañana'],
      ['Pasan a una persona', 'Precio de consulta · disponibilidad del sábado · pregunta sobre el tratamiento (médico)'],
      ['Prioridad', 'Alta: fecha cercana'],
      ['Datos pendientes', 'Nombre completo · teléfono o WhatsApp']
    ],
    noRespondio: 'Precio, disponibilidad y la pregunta sobre el tratamiento. Los responde una persona.'
  }
];

/* ---------- Demo B: tableros ---------- */
LAB.DEMO_B = {
  comercial: {
    nombre: 'Interesados',
    descripcion: 'Seguimiento comercial',
    etapas: ['Nuevo', 'Contactado', 'En seguimiento', 'Reunión o cita'],
    tarjetas: [
      { id: 'b1', nombre: 'Kevin R.', tipo: 'Paciente internacional · solicitó información', etapa: 0, responsable: 'Sofía · Recepción',
        historial: 'Preguntó cómo solicitar una valoración. Recepción le envió los requisitos hace 3 días; falta que comparta sus fechas.',
        pendiente: 'Pedir fechas preferidas para su valoración.',
        mensaje: "Hi Kevin! Just following up on your request. Could you share two or three dates that work for you? Our front desk will confirm availability with you directly.",
        siguiente: 'Si responde con fechas, recepción confirma disponibilidad.' },
      { id: 'b2', nombre: 'Agencia Viajes Salud SD', tipo: 'Agencia de turismo médico · San Diego', etapa: 1, responsable: 'Mariana · Ventas',
        historial: 'Se le envió información general de servicios hace 6 días. No ha respondido.',
        pendiente: 'Retomar la conversación después de enviar información.',
        mensaje: 'Hola, ¿cómo estás? Te escribo para dar seguimiento a la información que te compartimos la semana pasada. ¿Pudiste revisarla con tu equipo? Si te sirve, agendamos una llamada corta para resolver dudas sobre cómo coordinamos a los pacientes que nos refieren.',
        siguiente: 'Si responde, agendar llamada de 20 minutos.' },
      { id: 'b3', nombre: 'Dr. Ramírez', tipo: 'Médico que refiere · contacto de evento', etapa: 1, responsable: 'Mariana · Ventas',
        historial: 'Se conocieron en un evento. Quedó de compartir el contacto de su asistente para coordinar referencias.',
        pendiente: 'Pedir el contacto de su asistente.',
        mensaje: 'Dr. Ramírez, qué gusto saludarle. Quedamos en coordinar las referencias con su asistente; ¿me comparte su contacto para enviarle nuestro proceso? Así no le quitamos tiempo de consulta.',
        siguiente: 'Enviar el proceso de referencias a su asistente.' },
      { id: 'b4', nombre: 'RH · Planta manufacturera', tipo: 'Convenio empresarial · Otay', etapa: 2, responsable: 'Daniel · Dirección',
        historial: 'Pidieron información sobre un convenio de atención para su personal. Se envió la propuesta hace 10 días.',
        pendiente: 'Confirmar si recibieron la propuesta y quién toma la decisión.',
        mensaje: 'Hola, ¿qué tal? Quería confirmar que les llegó la propuesta de convenio que enviamos. ¿Hay alguien más en su equipo que deba revisarla? Con gusto les presentamos el proceso en una reunión breve.',
        siguiente: 'Agendar reunión con quien decide.' },
      { id: 'b5', nombre: 'Hotel Frontera Business', tipo: 'Aliado de hospedaje', etapa: 3, responsable: 'Daniel · Dirección',
        historial: 'Reunión realizada. Su gerencia revisa un convenio de hospedaje para pacientes. Quedaron de responder el viernes.',
        pendiente: null, mensaje: null, siguiente: 'Esperar respuesta del viernes.' }
    ]
  },
  equipo: {
    nombre: 'Pendientes del equipo',
    descripcion: 'Operación',
    etapas: ['Por asignar', 'Asignada', 'En proceso', 'Lista'],
    tarjetas: [
      { id: 'o1', nombre: 'Actualizar hoja de requisitos en inglés', tipo: 'Acuerdo de junta del lunes', etapa: 0, responsable: 'Sin responsable',
        historial: 'En la junta del lunes se dijo: "alguien revise la hoja de requisitos en inglés". No quedó responsable ni fecha.',
        pendiente: 'Asignar responsable y fecha. Sugerencia: Daniel, porque editó la versión anterior.',
        mensaje: 'Daniel, en la junta del lunes quedó pendiente actualizar la hoja de requisitos en inglés. ¿Te la puedo asignar con fecha al viernes?',
        responsableNuevo: 'Daniel · Administración',
        siguiente: 'Tarea asignada a Daniel con fecha al viernes.' },
      { id: 'o2', nombre: 'Confirmar horario de recepción en diciembre', tipo: 'Correo de dirección', etapa: 1, responsable: 'Sofía · Recepción',
        historial: 'Dirección pidió el horario de fin de año para publicarlo. Sofía lo tiene asignado desde hace 5 días.',
        pendiente: 'Recordar a Sofía y confirmar si necesita algo para cerrarlo.',
        mensaje: 'Sofía, ¿cómo vas con el horario de recepción de diciembre? Si te falta confirmar algún turno, dime con quién y lo resolvemos hoy.',
        siguiente: 'Sofía confirma el horario y pasa a revisión.' },
      { id: 'o3', nombre: 'Ordenar solicitudes de cita sin confirmar', tipo: 'Pendiente recurrente', etapa: 2, responsable: 'Sofía · Recepción',
        historial: 'Hay solicitudes de esta semana sin confirmación. Se revisan cada viernes.',
        pendiente: 'Preparar la lista de solicitudes sin confirmar para la revisión del viernes.',
        mensaje: 'Sofía, te dejo la lista de solicitudes de esta semana que siguen sin confirmar, ordenadas por fecha deseada. ¿Las revisamos el viernes a primera hora?',
        siguiente: 'Revisión del viernes con la lista lista.' },
      { id: 'o4', nombre: 'Respaldo semanal de la agenda', tipo: 'Pendiente recurrente', etapa: 3, responsable: 'Daniel · Administración',
        historial: 'Respaldo hecho esta semana.',
        pendiente: null, mensaje: null, siguiente: 'Se repite el próximo lunes.' }
    ]
  }
};

/* ---------- Demo C: contenido ---------- */
LAB.DEMO_C = {
  especialidades: [
    { id: 'odontologia', label: 'Odontología', area: 'odontología', visita: 'valoración dental' },
    { id: 'estetica', label: 'Medicina estética', area: 'medicina estética', visita: 'consulta de valoración' },
    { id: 'ortopedia', label: 'Ortopedia', area: 'ortopedia', visita: 'consulta de valoración' },
    { id: 'oftalmologia', label: 'Oftalmología', area: 'oftalmología', visita: 'revisión de la vista' },
    { id: 'turismo', label: 'Turismo médico (facilitador)', area: 'coordinación de turismo médico', visita: 'primera llamada de coordinación' }
  ],
  publicos: [
    { id: 'internacional', label: 'Paciente internacional (EE.UU.)' },
    { id: 'local', label: 'Paciente local' },
    { id: 'aliados', label: 'Médicos y aliados que refieren' }
  ],
  objetivos: [
    { id: 'confianza', label: 'Generar confianza' },
    { id: 'dudas', label: 'Resolver dudas frecuentes' },
    { id: 'solicitar', label: 'Invitar a solicitar información' }
  ],
  pasos: [
    'Toma la especialidad, el público y el objetivo que elegiste.',
    'Revisa las dudas frecuentes de ese público (base ficticia de ejemplo).',
    'Propone tres temas y elige el más claro para desarrollar.',
    'Redacta gancho, guion y llamada a la acción, sin promesas de resultados clínicos.',
    'Marca todo como pendiente de revisión profesional.'
  ],
  plantillas: {
    confianza: {
      internacional: {
        temas: ['Cómo es tu {visita} si vienes desde Estados Unidos, paso a paso', 'Quién te atiende: formación y experiencia de nuestro equipo de {area}', 'Qué preguntar antes de elegir con quién atenderte en Tijuana'],
        gancho: 'Si vas a cruzar la frontera para atenderte, esto es lo que deberías saber antes de elegir con quién.',
        guion: ['Si vas a venir desde Estados Unidos para atenderte, es normal que tengas dudas.', 'Te cuento cómo funciona con nuestro equipo de {area}: nos escribes, te pedimos algunos datos administrativos y te confirmamos tu {visita}.', 'Antes de tu cita sabes con quién te vas a ver, qué llevar y cómo llegar.', 'Cualquier decisión sobre tu caso se toma contigo, en consulta, nunca por mensaje.'],
        cta: 'Escríbenos y te explicamos el proceso de tu {visita}.'
      },
      local: {
        temas: ['Qué pasa en una {visita}: lo que revisamos y lo que no', 'Cómo trabajamos en {area}: nuestro proceso de atención', 'Preguntas que puedes hacer en tu primera cita'],
        gancho: '¿Te da pendiente tu primera {visita}? Te cuento exactamente qué pasa.',
        guion: ['Mucha gente pospone su {visita} porque no sabe qué esperar.', 'Con nuestro equipo de {area}, primero escuchamos qué necesitas, revisamos con calma y te explicamos tus opciones.', 'No sales con prisa ni con dudas: puedes preguntar todo lo que necesites.', 'Si después quieres pensarlo, está bien. La decisión es tuya.'],
        cta: 'Agenda tu {visita} por mensaje y te confirmamos el horario.'
      },
      aliados: {
        temas: ['Cómo recibimos a los pacientes que nos refieres', 'Qué información administrativa compartimos contigo después de una referencia', 'Nuestro equipo de {area}: formación y forma de trabajo'],
        gancho: 'Cuando refieres a un paciente, también confías tu nombre. Así lo cuidamos.',
        guion: ['Para un médico, referir a un paciente es una decisión de confianza.', 'En {area} tenemos un proceso claro: recibimos la referencia, contactamos al paciente y le explicamos los siguientes pasos.', 'Con su autorización, te mantenemos al tanto de forma administrativa.', 'Si quieres conocer cómo trabajamos, nos encantaría platicarlo.'],
        cta: 'Escríbenos para conocer nuestro proceso de referencias.'
      }
    },
    dudas: {
      internacional: {
        temas: ['Qué llevar a tu {visita} si vienes desde EE.UU.', 'Cómo planear el cruce y la llegada: recomendaciones generales', 'Cómo pedir atención en inglés'],
        gancho: 'Tres cosas que conviene saber antes de tu primera cita en Tijuana.',
        guion: ['Si vienes desde Estados Unidos, estas son las dudas que más nos hacen.', 'Uno: trae una identificación oficial vigente y los datos que te pedimos al confirmar tu cita.', 'Dos: considera el tiempo de cruce fronterizo al planear tu horario.', 'Tres: las dudas médicas se resuelven en consulta con el especialista, no por mensaje.'],
        cta: '¿Tienes otra duda? Escríbenos en inglés o en español.'
      },
      local: {
        temas: ['Cómo agendar, cambiar o cancelar tu cita', 'Qué llevar a tu {visita}', 'Las preguntas administrativas que más nos hacen en {area}'],
        gancho: 'Esta es la pregunta que más escuchamos en recepción.',
        guion: ['En recepción hay una pregunta que escuchamos todos los días: ¿cómo agendo?', 'Es sencillo: nos escribes, te pedimos tu nombre y tu horario preferido, y te confirmamos.', 'Si necesitas cambiar la cita, avísanos con anticipación por el mismo medio.', 'Y si tienes una duda sobre tu salud, la vemos en consulta con el especialista.'],
        cta: 'Guarda este video para cuando quieras agendar.'
      },
      aliados: {
        temas: ['Cómo enviarnos una referencia en tres pasos', 'Qué datos administrativos necesitamos del paciente referido', 'Quién recibe tus referencias y por qué canal'],
        gancho: 'Referir a un paciente con nosotros debería tomarte un minuto.',
        guion: ['Sabemos que tu tiempo en consulta vale mucho.', 'Para referir a un paciente a {area}, solo necesitamos su nombre y un dato de contacto.', 'Nuestro equipo lo contacta y le explica los siguientes pasos.', 'Tú sigues siendo su médico; nosotros cuidamos la parte administrativa.'],
        cta: 'Pídenos por mensaje el formato de referencia.'
      }
    },
    solicitar: {
      internacional: {
        temas: ['Cómo solicitar tu {visita} desde Estados Unidos', 'Qué pasa después de que nos escribes', 'Si prefieres atención en inglés: cómo pedirla'],
        gancho: '¿Quieres atenderte en Tijuana y no sabes por dónde empezar?',
        guion: ['Empezar es más fácil de lo que parece.', 'Nos escribes, en inglés o en español, y te pedimos algunos datos administrativos.', 'Nuestro equipo te confirma fecha y hora directamente.', 'Llegas sabiendo qué esperar de tu {visita}.'],
        cta: 'Mándanos mensaje para solicitar tu {visita}.'
      },
      local: {
        temas: ['Por qué tanta gente pospone su {visita} (y cómo hacerlo más fácil)', 'Cómo es el proceso para agendar con nosotros', 'Qué esperar el día de tu cita'],
        gancho: 'Si llevas meses diciendo "luego agendo", esto es para ti.',
        guion: ['Casi todos lo hemos hecho: dejar una cita para después.', 'Por eso hicimos el proceso lo más simple posible: un mensaje y te confirmamos.', 'Te decimos qué llevar y cuánto tiempo apartar.', 'El resto lo platicamos en tu {visita}.'],
        cta: 'Escríbenos hoy para solicitar tu {visita}.'
      },
      aliados: {
        temas: ['Cómo trabajar con nosotros si refieres pacientes', 'Qué recibe tu paciente cuando lo refieres', 'Conoce nuestro proceso en una llamada breve'],
        gancho: '¿Buscas con quién referir pacientes de {area} con confianza?',
        guion: ['Si a veces necesitas referir a un paciente de {area}, queremos conocerte.', 'Te explicamos cómo recibimos a tus pacientes y cómo te mantenemos al tanto de forma administrativa.', 'Sin compromiso: primero conoces el proceso.', 'Si encaja con tu forma de trabajar, empezamos.'],
        cta: 'Escríbenos para agendar una llamada de presentación.'
      }
    }
  }
};
