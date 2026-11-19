/* MĒTODO / AI LAB — Sistema recomendado por ruta, con estándar de operación in-house
   de hospitales y clínicas de clase mundial.
   Stack: [capa, nivel enterprise, para arrancar]. Son ejemplos de mercado: el proceso se define primero.
   Sin precios ni resultados prometidos. {indicador} se llena con el resultado de cada visitante. */
LAB.FASES = ['Fundamentos', 'Activación', 'Optimización y escala'];

LAB.SISTEMAS = {
  adquisicion: {
    nombre: 'Motor de adquisición de pacientes',
    resumen: 'Una operación de growth con ciclo semanal de experimentación: cada peso invertido se atribuye a un prospecto, cada prospecto a una cita y cada cita a un canal. El agente analiza y recomienda; tu equipo decide con datos.',
    piezas: ['Propuesta de valor por línea de servicio', 'Pauta en Meta y Google', 'Landing pages por servicio', 'Atribución de punta a punta', 'CRM con lead scoring', 'Agente analista de performance'],
    agente: 'Agente analista de performance y audiencias',
    tareas: [
      'Consolida el desempeño de todos los canales en un reporte ejecutivo semanal.',
      'Distingue los anuncios que generan citas de los que solo generan clics.',
      'Prioriza experimentos de mensaje, audiencia y canal según su impacto esperado.',
      'Redacta variantes de anuncios y titulares de landing para aprobación.',
      'Cruza la atribución de cada prospecto con su avance en el pipeline.',
      'Señala riesgos de cumplimiento en publicidad en salud antes de publicar.'
    ],
    stack: [
      ['CRM y marketing automation', 'Salesforce Health Cloud · HubSpot Marketing Hub Enterprise', 'HubSpot Starter · Kommo'],
      ['Pauta digital', 'Meta Ads con Conversions API · Google Ads con conversiones offline', 'Meta Ads y Google Ads con píxel'],
      ['Analítica y atribución', 'GA4 + BigQuery · Looker Studio o Power BI · CallRail para llamadas', 'GA4 con UTMs estandarizados'],
      ['Landing pages', 'Webflow o HubSpot CMS con pruebas A/B', 'WordPress o la plataforma actual'],
      ['IA', 'Agente con acceso a pauta y CRM, con reglas de marca y cumplimiento', 'Asistente con tus reportes y tu guía de comunicación']
    ],
    equipo: [
      ['Agente de IA', 'Analiza la pauta, reporta y propone experimentos todos los días.'],
      ['Tu equipo actual', 'Dirección aprueba presupuesto y mensajes; un especialista valida lo clínico.'],
      ['MĒTODO', 'Diseña el sistema, configura y entrena al agente y lo optimiza cada mes.']
    ],
    rutina: [
      ['Diario', 'Monitoreo de inversión, anuncios rechazados y alertas del agente.'],
      ['Semanal', 'Growth meeting de 30 minutos: resultados, experimentos y decisiones.'],
      ['Mensual', 'Revisión de atribución por canal y reasignación de presupuesto.']
    ],
    kpis: ['Costo por prospecto calificado', 'Conversión de prospecto a cita', 'Costo por cita agendada', 'Participación de cada canal en las citas'],
    gobernanza: [
      'Lineamientos de COFEPRIS para publicidad en salud y políticas de Meta y Google para el sector.',
      'Aviso de privacidad y consentimiento en cada formulario (LFPDPPP).',
      'Aprobación médica de toda afirmación sobre servicios o resultados.'
    ],
    plan: [
      ['Definir propuesta de valor y paciente ideal por línea de servicio.', 'Estandarizar UTMs y conectar la atribución al CRM.'],
      ['Activar al agente con datos de pauta, CRM y reglas de marca.', 'Lanzar los primeros experimentos aprobados.', 'Seguimiento semanal de: {indicador}.'],
      ['Reasignar presupuesto hacia los canales que generan citas.', 'Documentar el playbook de mensajes y audiencias ganadores.', 'Integrar el siguiente frente: atención o seguimiento.']
    ]
  },
  contenido: {
    nombre: 'Motor editorial de autoridad médica',
    resumen: 'Una operación editorial con gobierno de contenido: pilares definidos, producción continua y aprobación médica obligatoria. Tu marca publica con la consistencia de un medio y el rigor de una institución de salud.',
    piezas: ['Banco de preguntas de pacientes', 'Pilares editoriales por servicio', 'Agente editorial', 'Aprobación médica', 'Calendario y producción', 'Distribución orgánica y pagada'],
    agente: 'Agente productor editorial',
    tareas: [
      'Convierte preguntas de pacientes, notas y entrevistas con especialistas en temas.',
      'Propone ganchos y guiones para video corto, carruseles y artículos.',
      'Adapta cada pieza al paciente local, al internacional y al médico referidor.',
      'Prepara la versión en inglés para el mercado de EE.UU. tras la aprobación.',
      'Marca toda afirmación clínica que requiere validación.',
      'Arma el calendario editorial y el plan de producción del mes.'
    ],
    stack: [
      ['Gestión editorial', 'Asana o Monday.com con flujo de aprobación', 'Notion o Trello'],
      ['Producción', 'Adobe Creative Cloud · Frame.io para revisión', 'CapCut y Canva'],
      ['Publicación y escucha social', 'Sprout Social · Brandwatch', 'Meta Business Suite'],
      ['Activos de marca', 'Biblioteca de activos digitales (DAM) con lineamientos', 'Carpeta compartida con el brandbook'],
      ['IA', 'Agente entrenado con tu voz de marca, tu portafolio y tus reglas de comunicación en salud', 'Asistente con tu guía de tono']
    ],
    equipo: [
      ['Agente de IA', 'Convierte el conocimiento de tus especialistas en temas, guiones y calendario.'],
      ['Tu equipo actual', 'Tus especialistas aprueban y graban; recepción comparte las preguntas reales.'],
      ['MĒTODO', 'Define la línea editorial, configura y entrena al agente y lo optimiza cada mes.']
    ],
    rutina: [
      ['Diario', 'Captura de preguntas nuevas de pacientes.'],
      ['Semanal', 'Comité editorial con revisión médica de guiones.'],
      ['Mensual', 'Jornada de producción y revisión de desempeño por pilar.']
    ],
    kpis: ['Publicaciones aprobadas frente a las planeadas', 'Conversaciones iniciadas por contenido', 'Crecimiento de audiencia calificada', 'Contenido reutilizado en pauta y atención'],
    gobernanza: [
      'Revisión médica obligatoria antes de publicar.',
      'Lineamientos de COFEPRIS para publicidad en salud: sin promesas de resultados.',
      'Consentimiento por escrito de cualquier paciente que aparezca en contenido.'
    ],
    plan: [
      ['Construir un banco de 30 preguntas reales de pacientes.', 'Definir 3 a 4 pilares editoriales.'],
      ['Activar al agente con tu voz de marca y tus reglas.', 'Primera jornada de producción con guiones aprobados.', 'Seguimiento semanal de: {indicador}.'],
      ['Sostener una cadencia estable de publicación.', 'Reutilizar las piezas de mejor desempeño en pauta y en atención.', 'Integrar contenido con la estrategia de adquisición.']
    ]
  },
  atencion: {
    nombre: 'Centro de atención al paciente omnicanal y bilingüe',
    resumen: 'El modelo de los centros de acceso de pacientes de clase mundial, a la medida de tu operación: una sola bandeja para todos los canales, primera respuesta inmediata en el idioma del paciente y un SLA claro para tu equipo.',
    piezas: ['Bandeja omnicanal', 'Base de conocimiento EN/ES', 'Agente concierge bilingüe', 'Ficha y etapa en el CRM', 'Escalamiento con SLA', 'Encuesta de experiencia'],
    agente: 'Agente concierge bilingüe de primera respuesta',
    tareas: [
      'Responde 24/7 las consultas administrativas en inglés y español.',
      'Califica la solicitud y completa los datos necesarios para agendar.',
      'Identifica el canal, la campaña y la página de origen.',
      'Crea la ficha en el CRM y la asigna al coordinador correspondiente.',
      'Escala precios, disponibilidad y temas clínicos con el contexto completo.',
      'Entrega al equipo cada conversación traducida al español.'
    ],
    stack: [
      ['Contact center omnicanal', 'Zendesk · Talkdesk Healthcare · Genesys Cloud', 'Respond.io · Kommo'],
      ['Mensajería', 'WhatsApp Business Platform vía Twilio o proveedor oficial', 'WhatsApp Business API'],
      ['CRM', 'Salesforce Health Cloud · HubSpot Service Hub', 'HubSpot · Kommo'],
      ['Experiencia del paciente', 'Medallia · Qualtrics · Press Ganey', 'Encuesta breve por WhatsApp'],
      ['IA', 'Agente conversacional con base de conocimiento aprobada y reglas de escalamiento', 'Asistente con respuestas aprobadas']
    ],
    equipo: [
      ['Agente de IA', 'Atiende 24/7 en inglés y español, califica y arma la ficha de cada solicitud.'],
      ['Tu equipo actual', 'Recepción confirma citas y atiende lo que el agente escala.'],
      ['MĒTODO', 'Construye la base de conocimiento, configura y entrena al agente y lo optimiza cada mes.']
    ],
    rutina: [
      ['Diario', 'Revisión de bandeja, escalamientos y confirmación de citas.'],
      ['Semanal', 'Calibración de calidad y actualización de la base de conocimiento.'],
      ['Mensual', 'Revisión de SLA, experiencia del paciente y preguntas no resueltas.']
    ],
    kpis: ['Tiempo de primera respuesta (SLA)', 'Conversión de conversación a cita', 'Solicitudes con datos completos', 'Satisfacción del paciente con la atención'],
    gobernanza: [
      'El agente nunca responde precios, disponibilidad ni temas clínicos.',
      'Aviso de privacidad en el primer contacto (LFPDPPP; HIPAA si se manejan datos de pacientes de EE.UU.).',
      'Registro auditable de cada conversación.'
    ],
    plan: [
      ['Construir de 20 a 30 respuestas aprobadas en inglés y español.', 'Definir el protocolo de escalamiento y el SLA.'],
      ['Activar al agente en un canal con supervisión de recepción.', 'Integrar la ficha al CRM.', 'Seguimiento semanal de: {indicador}.'],
      ['Expandir a todos los canales.', 'Optimizar la base de conocimiento con conversaciones reales.', 'Integrar seguimiento automatizado para quien no agenda.']
    ]
  },
  seguimiento: {
    nombre: 'Pipeline comercial con cadencias de seguimiento',
    resumen: 'Cada paciente potencial, aliado o convenio vive en un pipeline con etapa, responsable y siguiente acción. El agente detecta qué se está enfriando y propone el contacto; tu equipo aprueba y cierra.',
    piezas: ['Pipeline único por línea de negocio', 'Cadencias por etapa', 'Agente de pipeline', 'Plantillas aprobadas', 'Lead scoring', 'Forecast semanal'],
    agente: 'Agente de gestión de pipeline',
    tareas: [
      'Prioriza cada mañana los seguimientos del día según etapa y antigüedad.',
      'Propone mensajes personalizados con el historial de cada oportunidad.',
      'Gestiona recordatorios de cita, confirmaciones y seguimientos poscotización.',
      'Actualiza la etapa cuando el prospecto responde.',
      'Genera el reporte semanal de pipeline: avance, riesgos y motivos de pérdida.'
    ],
    stack: [
      ['CRM', 'Salesforce Health Cloud · HubSpot Sales Hub Enterprise', 'HubSpot Starter · Pipedrive · Kommo'],
      ['Cadencias', 'Secuencias de HubSpot o Salesforce', 'Recordatorios por etapa en el CRM'],
      ['Mensajería', 'WhatsApp Business Platform y correo integrados al CRM', 'WhatsApp Business y correo'],
      ['Reportes', 'Dashboards de pipeline y forecast en Power BI o Looker Studio', 'Reportes nativos del CRM'],
      ['IA', 'Agente con acceso al historial y a las plantillas aprobadas', 'Asistente con tus plantillas']
    ],
    equipo: [
      ['Agente de IA', 'Vigila el pipeline, prioriza seguimientos y redacta cada mensaje.'],
      ['Tu equipo actual', 'Tu coordinador aprueba mensajes y conduce las conversaciones.'],
      ['MĒTODO', 'Diseña cadencias y plantillas, configura y entrena al agente y lo optimiza cada mes.']
    ],
    rutina: [
      ['Diario', 'Aprobación de los seguimientos propuestos.'],
      ['Semanal', 'Pipeline review: avance, riesgos y forecast.'],
      ['Mensual', 'Análisis de motivos de pérdida y ajuste de cadencias.']
    ],
    kpis: ['Oportunidades sin actividad por más de 7 días', 'Conversión por etapa del pipeline', 'Tiempo promedio de cierre', 'Motivos de pérdida documentados'],
    gobernanza: [
      'Ningún mensaje sale sin aprobación humana.',
      'Consentimiento de contacto registrado en el CRM (LFPDPPP).',
      'Opción de baja en cada comunicación.'
    ],
    plan: [
      ['Consolidar a todos los prospectos en un solo pipeline.', 'Definir etapas y cadencias de seguimiento.'],
      ['Activar al agente con plantillas aprobadas.', 'Aprobación diaria de seguimientos.', 'Seguimiento semanal de: {indicador}.'],
      ['Automatizar recordatorios de bajo riesgo, como confirmaciones.', 'Identificar la etapa con mayor pérdida y corregirla.', 'Integrar con atención para que todo prospecto entre con ficha.']
    ]
  },
  operacion: {
    nombre: 'Oficina de operaciones (PMO) asistida por IA',
    resumen: 'Una capa de coordinación que convierte conversaciones en ejecución: cada acuerdo se vuelve tarea con dueño y fecha, y dirección ve en un tablero qué avanza y qué está en riesgo.',
    piezas: ['Plataforma única de trabajo', 'Responsables y fechas', 'Agente coordinador', 'Tablero ejecutivo', 'Procesos estandarizados (SOPs)'],
    agente: 'Agente coordinador de operaciones',
    tareas: [
      'Convierte minutas, mensajes y correos en tareas con responsable y fecha.',
      'Sugiere al responsable según el área y el historial.',
      'Envía recordatorios antes de cada vencimiento.',
      'Prepara el reporte ejecutivo semanal: avances, atrasos y riesgos.',
      'Documenta en SOPs los procesos que se repiten.'
    ],
    stack: [
      ['Gestión de trabajo', 'Asana · Monday.com · Smartsheet · Jira Work Management', 'Notion · Trello · ClickUp'],
      ['Comunicación interna', 'Microsoft Teams o Slack', 'Grupos de WhatsApp ordenados por área'],
      ['Juntas y minutas', 'Grabación con transcripción en Teams, Zoom o Google Meet', 'Notas compartidas'],
      ['Tableros', 'Power BI o Looker Studio', 'Vista de tablero en la herramienta de tareas'],
      ['IA', 'Agente conectado a tu plataforma de trabajo y a tus minutas', 'Asistente con tus notas de junta']
    ],
    equipo: [
      ['Agente de IA', 'Convierte acuerdos en tareas, da seguimiento y reporta cada semana.'],
      ['Tu equipo actual', 'Cada área ejecuta; dirección destraba lo crítico.'],
      ['MĒTODO', 'Diseña el tablero, configura y entrena al agente y lo optimiza cada mes.']
    ],
    rutina: [
      ['Diario', 'Revisión de vencimientos del día.'],
      ['Semanal', 'Junta operativa con el reporte del agente.'],
      ['Mensual', 'Estandarizar en SOPs lo que se repitió.']
    ],
    kpis: ['Tareas sin responsable o sin fecha', 'Pendientes vencidos por semana', 'Acuerdos convertidos en tarea el mismo día', 'Procesos documentados en SOPs'],
    gobernanza: [
      'Accesos por rol a la información sensible.',
      'La información clínica se queda en el expediente, nunca en la herramienta de tareas.',
      'Registro de decisiones y responsables.'
    ],
    plan: [
      ['Migrar los pendientes activos a una sola plataforma.', 'Definir responsables por área.'],
      ['Activar al agente con minutas y correos.', 'Reporte ejecutivo semanal.', 'Seguimiento semanal de: {indicador}.'],
      ['Documentar SOPs de los procesos repetidos.', 'Integrar marketing y ventas al mismo tablero.', 'Definir el siguiente proceso a automatizar.']
    ]
  }
};
