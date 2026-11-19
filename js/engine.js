/* Reglas transparentes del diagnóstico.
   - problema → recomendación principal (ruta)
   - objetivo → beneficio e indicador (matriz ruta × objetivo)
   - nivel de herramientas → requisito extra y primer paso
   - frecuencia → contexto de prioridad
   Sin IA, sin porcentajes, sin ROI. */
(function () {
  function opt(qid, id) {
    var q = LAB.QUESTIONS.filter(function (x) { return x.id === qid; })[0];
    return q ? q.opciones.filter(function (o) { return o.id === id; })[0] : null;
  }
  function fill(tpl, r) {
    return tpl.replace(/\{(\w+)\}/g, function (_, k) { return r[k] != null ? r[k] : ''; });
  }

  /* Dinero en riesgo: estimación transparente con los números del visitante.
     perdidosRespuesta = solicitudes × fuga × cierre
     perdidosInasistencia = solicitudes × cierre × inasistencia
     dinero = (perdidos) × ticket */
  LAB.calcRiesgo = function (x) {
    var S = Math.max(0, +x.volumen || 0), T = Math.max(0, +x.ticket || 0);
    var C = Math.min(100, Math.max(0, +x.cierre || 0)) / 100;
    var F = Math.min(100, Math.max(0, +x.fuga || 0)) / 100;
    var N = Math.min(100, Math.max(0, +x.inasistencia || 0)) / 100;
    var pr = S * F * C, pn = S * C * N;
    return { pacientesRespuesta: pr, pacientesInasistencia: pn, pacientes: pr + pn,
      dineroRespuesta: pr * T, dineroInasistencia: pn * T, mensual: (pr + pn) * T, anual: (pr + pn) * T * 12 };
  };
  LAB.calcInhouse = function (routeId) {
    var f = 1 + LAB.CONFIG.supuestos.cargaPatronal / 100;
    var roles = LAB.INHOUSE[routeId] || [];
    var bruto = roles.reduce(function (a, r) { return a + r[1]; }, 0);
    return { roles: roles, bruto: bruto, factor: f, total: Math.round(bruto * f), anual: Math.round(bruto * f * 12) };
  };

  LAB.isComplete = function (a) {
    return LAB.QUESTIONS.every(function (q) { return a && a[q.id] && opt(q.id, a[q.id]); });
  };

  LAB.buildResult = function (a) {
    if (!LAB.isComplete(a)) return null;
    var routeId = a.problema;
    var r = LAB.ROUTES[routeId];
    var org = opt('org', a.org), rol = opt('rol', a.rol), prob = opt('problema', a.problema);
    var nivel = opt('nivel', a.nivel), freq = opt('frecuencia', a.frecuencia), obj = opt('objetivo', a.objetivo);
    var m = LAB.MATRIZ[routeId][a.objetivo];
    var tk = opt('ticket', a.ticket), vol = opt('volumen', a.volumen);
    var sup = LAB.CONFIG.supuestos;
    var dineroIn = { ticket: tk.valor, volumen: vol.valor, cierre: sup.cierre, fuga: sup.fuga, inasistencia: sup.inasistencia };
    var nv = LAB.NIVELES[a.nivel];
    var coincide = r.natural === a.objetivo;

    var porQue = [
      'Representas ' + org.cita + ' y tu función es ' + rol.cita + '.',
      'Dijiste que lo que más se atora es «' + prob.label.replace(/\.$/, '') + '», que hoy ' + nivel.cita + ' y que genera trabajo o retrasos ' + freq.cita + '.',
      'Para los próximos 90 días quieren priorizar «' + obj.label + '». Reciben ' + vol.label.toLowerCase() + ' solicitudes al mes, con un ticket promedio de ' + tk.label.replace(' MXN', '') + ' MXN.'
    ];

    var relacion = coincide ? null :
      'Tu prioridad («' + obj.label + '») no coincide directamente con el proceso que más se atora (' + r.problemaCorto + '). ' +
      'La recomendación parte del proceso, porque ahí es donde hoy se pierde trabajo.';

    var sis = LAB.SISTEMAS[routeId];
    var primer = fill(nv.primerPaso, r);
    var indLower = m.indicador.charAt(0).toLowerCase() + m.indicador.slice(1);
    var plan = sis.plan.map(function (fase, k) {
      var f = fase.map(function (t) { return t.replace('{indicador}', indLower); });
      return k === 0 ? [nv.corto].concat(f) : f;
    });
    return {
      routeId: routeId,
      sistema: { nombre: sis.nombre, resumen: sis.resumen, piezas: sis.piezas, tareas: sis.tareas, stack: sis.stack, equipo: sis.equipo, rutina: sis.rutina, kpis: sis.kpis, gobernanza: sis.gobernanza, plan: plan, fases: LAB.FASES },
      area: r.area,
      oportunidad: r.oportunidad,
      porQue: porQue,
      frecuenciaContexto: LAB.FRECUENCIAS[a.frecuencia],
      agente: sis.agente,
      tarea: r.tarea,
      beneficio: m.beneficio,
      coincide: coincide,
      relacion: relacion,
      humano: r.humano,
      lidera: rol.lidera,
      requisitos: r.requisitos.concat([nv.requisito]),
      primerPaso: primer,
      indicador: m.indicador,
      medir: m.medir,
      demo: r.demo,
      demoNota: r.demoNota,
      dineroIn: dineroIn,
      dinero: LAB.calcRiesgo(dineroIn),
      inhouse: LAB.calcInhouse(routeId),
      inversionIA: (LAB.CONFIG.inversionIA || {})[routeId] || null,
      respuestas: {
        org: org.label, rol: rol.label, problema: prob.label, nivel: nivel.label,
        frecuencia: freq.label, objetivo: obj.label, ticket: tk.label, volumen: vol.label
      },
      tu: org.tu
    };
  };
})();
