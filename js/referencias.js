/* MĒTODO / AI LAB — Referencias públicas para la calculadora y la comparación IA vs. in-house.
   Revisadas el 18 de noviembre de 2026. Los sueldos son brutos mensuales de referencia, no ofertas. */
LAB.FUENTES = {
  hbr: { corto: 'Harvard Business Review, 2011', texto: 'Oldroyd, McElheran y Elkington, «The Short Life of Online Sales Leads», Harvard Business Review (2011). Auditoría de 2,241 empresas de EE.UU.: 37% respondió en menos de una hora, 24% tardó más de 24 horas y 23% nunca respondió. Quienes respondieron en la primera hora tuvieron casi 7 veces más probabilidad de calificar al prospecto.', url: 'https://hbr.org/2011/03/the-short-life-of-online-sales-leads' },
  noshow: { corto: 'Dantas et al., Health Policy, 2018', texto: 'Dantas, Fleck, Cyrino Oliveira y Hamacher, «No-shows in appointment scheduling – a systematic literature review», Health Policy 122(4), 2018. Revisión de 105 estudios: la tasa promedio de inasistencia a citas es del orden de 23%.', url: 'https://pubmed.ncbi.nlm.nih.gov/29482948/' },
  carga: { corto: 'Costo patronal México 2026', texto: 'Cuotas del IMSS, Infonavit, impuesto sobre nómina y prestaciones de ley suman entre 35% y 50% sobre el sueldo bruto (cuantomecuesta.com, 2026). Usamos 35%, el extremo conservador.', url: 'https://cuantomecuesta.com/mx/nomina/' },
  indeedMkt: { corto: 'Indeed México, 2026', texto: 'Especialista en marketing: sueldo base promedio de $16,782 al mes en México (Indeed, actualizado en agosto de 2026).', url: 'https://mx.indeed.com/salaries/Especialista-en-marketing-Salaries' },
  cronoCM: { corto: 'Cronoshare, 2026', texto: 'Community manager en Baja California (Tijuana): $16,000 al mes; diseñador gráfico en Tijuana: $16,500 al mes (Cronoshare, salarios 2026).', url: 'https://www.cronoshare.com.mx/salarios/community-manager' },
  occ: { corto: 'OCC Mundial, 2026', texto: 'Vacantes publicadas de gerente y coordinador de mercadotecnia en México: de $23,000 a $55,000 al mes (OCC Mundial).', url: 'https://www.occ.com.mx/empleos/trabajo-en-mercadotecnia-publicidad-relaciones-publicas/en-mexico/permanente' },
  recep: { corto: 'Indeed y Jooble, Tijuana 2026', texto: 'Vacantes de recepcionista bilingüe en hospitales y clínicas de Tijuana: desde $12,000 y hasta $16,636–$22,479 al mes (Indeed y Jooble, 2026).', url: 'https://mx.indeed.com/cmp/Hospital-Excel-3/salaries' },
  secre: { corto: 'Indeed México, 2026', texto: 'Secretario/a bilingüe: sueldo base promedio de $11,645 al mes en México (Indeed, septiembre de 2026).', url: 'https://mx.indeed.com/salaries/secretario-biling%C3%BCe-Salaries' },
  pm: { corto: 'Universidades de México', texto: 'Marketing project manager en México: entre $17,500 y $27,289 al mes (Universidades de México, con datos de Indeed y Talent).', url: 'https://universidadesdemexico.mx/noticias/cuanto-gana-un-licenciado-en-mercadotecnia-en-mexico-2022' }
};

/* Equipo in-house que haría el mismo trabajo, por ruta: [puesto, sueldo bruto mensual, fuente] */
LAB.INHOUSE = {
  adquisicion: [['Coordinador(a) de marketing', 30000, 'occ'], ['Especialista en pauta digital', 16782, 'indeedMkt'], ['Diseñador(a) gráfico', 16500, 'cronoCM']],
  contenido: [['Coordinador(a) de marketing', 30000, 'occ'], ['Community manager', 16000, 'cronoCM'], ['Diseñador(a) y editor(a) de contenido', 16500, 'cronoCM']],
  atencion: [['Recepcionista bilingüe · turno matutino', 15000, 'recep'], ['Recepcionista bilingüe · turno vespertino', 15000, 'recep'], ['Especialista en marketing (CRM y reportes)', 16782, 'indeedMkt']],
  seguimiento: [['Coordinador(a) de pacientes bilingüe', 15000, 'recep'], ['Especialista en marketing (CRM y cadencias)', 16782, 'indeedMkt']],
  operacion: [['Coordinador(a) de proyectos', 22000, 'pm'], ['Asistente administrativo bilingüe', 11645, 'secre']]
};

LAB.COMPARATIVA = [
  ['Cobertura', 'Horario de oficina, por turnos', 'El agente responde 24/7; tu equipo supervisa en horario normal'],
  ['Idiomas', 'Depende de a quién contrates', 'Inglés y español desde el primer día'],
  ['Arranque', 'Reclutar, seleccionar y capacitar a cada persona', 'Implementación por fases con la hoja de ruta a 90 días'],
  ['Rotación', 'Cuando alguien se va, el conocimiento se va con esa persona', 'El conocimiento queda documentado en el sistema'],
  ['Escala', 'Más volumen exige más plazas', 'Más volumen sin abrir nuevas plazas'],
  ['Criterio humano', 'Sí', 'Sí: tu equipo aprueba y decide; el agente ejecuta lo operativo']
];
