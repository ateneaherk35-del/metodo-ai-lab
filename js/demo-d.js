/* MĒTODO / AI LAB — Demo D: el negocio conectado.
   Anuncio → website/landing → mensaje → agente → CRM → seguimiento → cita y reseña.
   Negocio ficticio; nada se publica ni se envía. */
(function () {
  function esc(s) { return LAB.esc(s); }

  var N = [
    { id: 'ads', n: '01', label: 'Anuncio', sub: 'Meta · Google', icon: '<path d="M4 9v6h3l6 4V5L7 9H4z"/><path d="M16 9a3 3 0 010 6"/>',
      titulo: 'Un anuncio llega a la persona correcta',
      que: 'La clínica pauta en Meta y Google para personas en San Diego que buscan atención dental en Tijuana. El mensaje y el público salen de lo que ya funciona en su contenido.',
      agente: 'Analiza qué anuncios y públicos traen conversaciones reales y propone la siguiente prueba.',
      humano: 'Aprueba presupuesto, mensajes y que todo cumpla con la regulación de publicidad en salud.' },
    { id: 'web', n: '02', label: 'Website + landing', sub: 'Una sola acción', icon: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M8 13h8M8 16h5"/>',
      titulo: 'La landing explica y pide una sola cosa',
      que: 'El anuncio lleva a una página hecha para ese público: cómo es el proceso, cómo llegar desde la garita y un botón para pedir su valoración. El website da contexto; la landing convierte.',
      agente: 'Propone versiones de titulares y preguntas frecuentes a partir de lo que la gente pregunta por mensaje.',
      humano: 'Valida la información profesional y aprueba cada cambio publicado.' },
    { id: 'msg', n: '03', label: 'Mensaje', sub: 'WhatsApp · formulario', icon: '<path d="M4 5h16v11H9l-5 4z"/>',
      titulo: 'La persona escribe, a la hora que sea',
      que: 'Llega un WhatsApp en inglés a las 10:42 p.m. El sistema ya sabe de qué anuncio y de qué página vino.',
      agente: 'Recibe el mensaje y detecta idioma, intención y origen.',
      humano: 'Nada todavía: nadie tiene que estar despierto para que la conversación arranque bien.' },
    { id: 'agente', n: '04', label: 'Agente IA', sub: 'Responde y organiza', icon: '<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>',
      titulo: 'El agente contesta lo administrativo y organiza la solicitud',
      que: 'Responde en inglés con información aprobada por la clínica, pide los datos que faltan y deja todo listo para recepción. Precios, disponibilidad y temas médicos siempre pasan a una persona.',
      agente: 'Primera respuesta, datos faltantes, clasificación y ficha para recepción.',
      humano: 'Recepción revisa la respuesta y confirma disponibilidad.' },
    { id: 'crm', n: '05', label: 'CRM', sub: 'Ficha y etapa', icon: '<rect x="3" y="4" width="5" height="16" rx="1"/><rect x="10" y="4" width="5" height="11" rx="1"/><rect x="17" y="4" width="4" height="7" rx="1"/>',
      titulo: 'Cada interesado queda registrado, con origen y siguiente paso',
      que: 'La conversación crea una ficha en el CRM: quién es, de qué anuncio vino, en qué etapa va y quién es responsable. Nadie depende de su memoria ni de capturas de pantalla.',
      agente: 'Crea y actualiza la ficha, mueve la etapa y avisa al responsable.',
      humano: 'Recepción toma la ficha y decide el siguiente paso.' },
    { id: 'seg', n: '06', label: 'Seguimiento', sub: 'Recordatorios', icon: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/>',
      titulo: 'Nadie se queda sin respuesta',
      que: 'Si la persona no contesta, el agente propone un recordatorio. Antes de la cita, envía la confirmación con indicaciones para llegar. Cada mensaje pasa por aprobación.',
      agente: 'Detecta pendientes y propone mensajes con contexto.',
      humano: 'Aprueba o ajusta cada mensaje y conversa cuando la persona responde.' },
    { id: 'cita', n: '07', label: 'Cita y reseña', sub: 'Cierre del ciclo', icon: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M9 15l2 2 4-4"/>',
      titulo: 'La cita sucede y el ciclo se cierra',
      que: 'Recepción confirma la cita. Después, un mensaje de agradecimiento y una invitación a dejar reseña. Y en el reporte ves de qué anuncio vino cada cita, para invertir donde sí funciona.',
      agente: 'Prepara el mensaje posterior y el reporte por origen.',
      humano: 'La atención, la consulta y la relación con el paciente.' }
  ];

  var ROUTE_NODES = {
    adquisicion: ['ads', 'web'], contenido: ['ads', 'web'], atencion: ['msg', 'agente'],
    seguimiento: ['crm', 'seg'], operacion: ['crm', 'cita']
  };

  function mock(id) {
    switch (id) {
      case 'ads': return '<div class="mk-ad"><div class="mk-ad-head"><span class="mk-avatar">CB</span><div><strong>Clínica Dental Bahía</strong><small>Patrocinado · negocio ficticio</small></div></div>' +
        '<p>¿Vives en San Diego? Haz tu valoración dental en Tijuana, con atención en inglés y español.</p>' +
        '<div class="mk-ad-img"><span>Tu valoración dental,<br>sin complicarte el cruce.</span></div>' +
        '<div class="mk-ad-cta"><span>clinicabahia.ejemplo</span><b>Enviar mensaje</b></div></div>' +
        '<div class="mk-google"><small>Patrocinado · clinicabahia.ejemplo</small><strong>Dentista en Tijuana para pacientes de San Diego</strong><span>Agenda tu valoración. Te explicamos el proceso paso a paso.</span></div>';
      case 'web': return '<div class="mk-browser"><div class="mk-bar"><i></i><i></i><i></i><span>clinicabahia.ejemplo/valoracion</span></div>' +
        '<div class="mk-page"><small>VALORACIÓN DENTAL · TIJUANA</small><h4>Tu valoración dental, sin complicarte el cruce.</h4>' +
        '<ul><li>Cómo es el proceso, paso a paso</li><li>Atención en inglés y español</li><li>Cómo llegar desde la garita</li></ul>' +
        '<div class="mk-form"><span>Nombre</span><span>WhatsApp</span><span>Fecha preferida</span><b>Solicitar valoración</b></div></div></div>';
      case 'msg': return '<div class="mk-chat"><div class="mk-chat-head"><span class="mk-avatar">J</span><div><strong>Jordan (ficticio)</strong><small>WhatsApp · 10:42 p.m.</small></div></div>' +
        '<div class="mk-in">Hi! I saw your ad. How do I book a first appointment? I live in San Diego.</div>' +
        '<div class="mk-tags"><span>Origen: anuncio Meta</span><span>Página: /valoracion</span></div></div>';
      case 'agente': return '<div class="mk-chat"><div class="mk-in mk-small">Hi! I saw your ad. How do I book a first appointment?…</div>' +
        '<div class="mk-out">Hi Jordan! To request your first appointment, please share your full name and two or three dates that work for you. Our front desk will confirm availability directly with you.</div>' +
        '<div class="mk-tags"><span>Idioma: inglés</span><span>Intención: primera cita</span><span>Falta: fechas</span><span class="warn-tag">Precio y disponibilidad → recepción</span></div></div>';
      case 'crm': return '<div class="mk-crm"><div class="mk-crm-head"><strong>Jordan (ficticio)</strong><small>Ficha creada 10:43 p.m.</small></div>' +
        '<div class="mk-stages"><span class="done">Nuevo</span><span class="on">Contactado</span><span>Cita</span><span>Atendido</span></div>' +
        '<table class="ficha"><tr><td>Origen</td><td>Meta Ads · campaña «Valoración SD»</td></tr><tr><td>Canal</td><td>WhatsApp · inglés</td></tr>' +
        '<tr><td>Responsable</td><td>Sofía · Recepción</td></tr><tr><td>Siguiente paso</td><td>Confirmar disponibilidad</td></tr></table></div>';
      case 'seg': return '<ol class="mk-timeline">' +
        '<li class="ok"><b>Mañana, 9:00</b><span>Recepción confirma disponibilidad.</span><em>Persona</em></li>' +
        '<li class="ok"><b>Si no responde en 2 días</b><span>El agente propone un recordatorio amable.</span><em>Aprobado por recepción</em></li>' +
        '<li><b>1 día antes de la cita</b><span>Confirmación con indicaciones para llegar desde la garita.</span><em>Aprobado por recepción</em></li>' +
        '<li><b>Después de la cita</b><span>Agradecimiento e invitación a dejar reseña.</span><em>Aprobado por recepción</em></li></ol>';
      case 'cita': return '<div class="mk-crm"><div class="mk-confirm">✓ Cita confirmada por recepción<small>Martes · 10:00 a.m. (ejemplo)</small></div>' +
        '<div class="mk-stages"><span class="done">Nuevo</span><span class="done">Contactado</span><span class="done">Cita</span><span class="on">Atendido</span></div>' +
        '<div class="mk-report"><small>ESTA CITA VINO DE</small><p>Meta Ads · campaña «Valoración SD» → landing /valoracion → WhatsApp</p><span>Así sabes qué anuncio trae pacientes reales, no solo clics.</span></div></div></div>';
    }
    return '';
  }

  var D = { i: -1, playing: false, t: null };
  function stop() { clearTimeout(D.t); D.playing = false; }

  function render() {
    var root = document.getElementById('demoBody'); if (!root) return;
    var r = LAB.currentResult(), mine = r ? ROUTE_NODES[r.routeId] : [];
    var pct = D.i <= 0 ? 0 : (D.i / (N.length - 1)) * 100;
    var nodes = N.map(function (n, k) {
      var st = k < D.i ? 'done' : (k === D.i ? 'on' : '');
      return '<button class="flow-node ' + st + (mine.indexOf(n.id) >= 0 ? ' mine' : '') + '" data-act="demoD_go" data-i="' + k + '" aria-pressed="' + (k === D.i) + '">' +
        '<span class="flow-icon"><svg viewBox="0 0 24 24" aria-hidden="true">' + n.icon + '</svg></span>' +
        '<span class="flow-n">' + n.n + '</span><span class="flow-label">' + esc(n.label) + '</span><span class="flow-sub">' + esc(n.sub) + '</span>' +
        (mine.indexOf(n.id) >= 0 ? '<span class="flow-mine">Tu oportunidad</span>' : '') + '</button>';
    }).join('');
    var detail;
    if (D.i < 0) {
      detail = '<div class="flow-intro"><p class="lead">Así se ve un negocio de salud conectado: del anuncio a la cita, sin que nadie pierda el hilo. Presiona <strong>Simular un prospecto</strong> o toca cualquier paso.</p>' +
        (r ? '<p class="small" style="margin-top:12px">Los pasos marcados como «Tu oportunidad» son donde aparece tu resultado (' + esc(r.area) + ').</p>' : '') + '</div>';
    } else {
      var n = N[D.i];
      detail = '<div class="flow-detail reveal" key="' + D.i + '"><div class="flow-mock">' + mock(n.id) + '</div>' +
        '<div class="flow-copy"><span class="out-label">Paso ' + n.n + ' · ' + esc(n.label) + '</span><h2 class="h2">' + esc(n.titulo) + '</h2><p class="muted">' + esc(n.que) + '</p>' +
        '<div class="who"><div><span>Lo hace el agente</span><p>' + esc(n.agente) + '</p></div><div><span>Lo hace una persona</span><p>' + esc(n.humano) + '</p></div></div></div></div>';
    }
    root.innerHTML = '<div class="flow-controls btn-row">' +
      '<button class="btn btn-primary btn-sm" data-act="demoD_play">' + (D.playing ? 'Pausar' : (D.i >= N.length - 1 ? '↺ Simular otra vez' : (D.i >= 0 ? 'Continuar' : '▶ Simular un prospecto'))) + '</button>' +
      '<button class="btn btn-ghost btn-sm" data-act="demoD_prev"' + (D.i <= 0 ? ' disabled' : '') + '>←</button>' +
      '<button class="btn btn-ghost btn-sm" data-act="demoD_next"' + (D.i >= N.length - 1 ? ' disabled' : '') + '>→</button></div>' +
      '<div class="flow-wrap"><div class="flow"><div class="flow-line"><i style="width:' + pct + '%"><b></b></i></div>' + nodes + '</div></div>' + detail;
  }
  function step() {
    if (!D.playing) return;
    if (D.i >= N.length - 1) { D.playing = false; render(); return; }
    D.i++; render(); D.t = setTimeout(step, 4200);
  }
  LAB.actions.demoD_play = function () {
    if (D.playing) { stop(); render(); return; }
    if (D.i >= N.length - 1) D.i = -1;
    D.playing = true; step();
  };
  LAB.actions.demoD_go = function (el) { stop(); D.i = +el.getAttribute('data-i'); render(); };
  LAB.actions.demoD_prev = function () { stop(); D.i = Math.max(0, D.i - 1); render(); };
  LAB.actions.demoD_next = function () { stop(); D.i = Math.min(N.length - 1, D.i + 1); render(); };

  LAB.demoD = {
    nodes: N,
    mount: function () { D = { i: -1, playing: false, t: null }; render(); return function () { stop(); }; }
  };
})();
