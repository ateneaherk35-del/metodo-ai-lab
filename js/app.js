/* MĒTODO / AI LAB — núcleo de la app: utilidades, layout, router y recorrido del visitante. */
(function () {
  var Q = LAB.QUESTIONS;
  LAB.views = LAB.views || {};
  LAB.actions = LAB.actions || {};
  LAB.logoOK = false;
  LAB.logoDataURI = null;

  /* ---------- Utilidades ---------- */
  var esc = LAB.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  LAB.go = function (path) { if (location.hash !== '#' + path) location.hash = '#' + path; else render(); };
  LAB.toast = function (msg) {
    var old = document.querySelector('.toast'); if (old) old.remove();
    var t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); t.textContent = msg;
    document.body.appendChild(t); setTimeout(function () { t.remove(); }, 3200);
  };
  LAB.modal = function (opts) {
    var wrap = document.createElement('div');
    wrap.className = 'modal-backdrop';
    wrap.innerHTML = '<div class="modal ' + (opts.wide ? 'modal-wide' : '') + '" role="dialog" aria-modal="true" aria-labelledby="mtitle">' +
      '<h2 class="h3" id="mtitle">' + esc(opts.title) + '</h2>' + (opts.body || '') +
      '<div class="btn-row">' +
      (opts.confirm ? '<button class="btn ' + (opts.danger ? 'btn-danger' : 'btn-primary') + '" data-m="ok">' + esc(opts.confirm) + '</button>' : '') +
      '<button class="btn btn-ghost" data-m="cancel">' + esc(opts.cancel || 'Cancelar') + '</button></div></div>';
    function close() { wrap.remove(); document.removeEventListener('keydown', onKey); }
    function onKey(e) { if (e.key === 'Escape') close(); }
    wrap.addEventListener('click', function (e) {
      if (e.target === wrap || e.target.getAttribute('data-m') === 'cancel') close();
      if (e.target.getAttribute('data-m') === 'ok') {
        if (opts.onConfirm && opts.onConfirm(wrap) === false) return;
        close();
      }
    });
    document.addEventListener('keydown', onKey);
    document.body.appendChild(wrap);
    var f = wrap.querySelector('input, [data-m="ok"], [data-m="cancel"]'); if (f) f.focus();
    return wrap;
  };
  LAB.download = function (filename, content, mime) {
    var blob = new Blob([content], { type: mime || 'text/plain;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a'); a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
  };
  LAB.logoHTML = function () {
    return LAB.logoOK
      ? '<img class="brand-logo" src="assets/logo-metodo.svg" alt="MĒTODO">'
      : '<span class="wordmark">MĒTODO</span>';
  };

  /* ---------- Layout ---------- */
  LAB.chrome = function (opts, inner) {
    opts = opts || {};
    return '<div class="app">' +
      '<header class="topbar no-print"><div class="shell">' +
      '<a class="brand" href="' + (opts.home || '#/') + '" aria-label="MĒTODO AI LAB">' + LAB.logoHTML() +
      '<span class="brand-sep"></span><span class="brand-lab">AI Lab</span></a>' +
      '<div class="topbar-right">' + (opts.right || '') + (opts.tag ? '<span class="mode-tag">' + esc(opts.tag) + '</span>' : '') + '</div>' +
      '</div></header>' +
      '<main class="main" id="main">' + inner + '</main>' +
      '<footer class="footer no-print"><div class="shell"><span>Hospitalidad inteligente · ' + esc(LAB.CONFIG.evento) + ' · ' + esc(LAB.CONFIG.ciudad) + '</span>' +
      '<a href="#/">Cambiar modo</a></div></footer></div>';
  };

  /* ---------- Sesión del visitante ---------- */
  function session() { return LAB.store.session(); }
  function firstUnanswered(a) {
    for (var i = 0; i < Q.length; i++) if (!a[Q[i].id]) return i + 1;
    return 0;
  }
  function countCompletion(s, res) {
    var st = LAB.store.stats();
    if (s.countedRoute === res.routeId) return;
    if (s.countedRoute) st.porRuta[s.countedRoute] = Math.max(0, (st.porRuta[s.countedRoute] || 1) - 1);
    else st.completados++;
    st.porRuta[res.routeId] = (st.porRuta[res.routeId] || 0) + 1;
    LAB.store.saveStats(st);
    s.countedRoute = res.routeId; LAB.store.saveSession(s);
  }
  LAB.currentResult = function () {
    var s = session(); if (!LAB.isComplete(s.answers)) return null;
    var r = LAB.buildResult(s.answers);
    if (s.dineroEdit) { r.dineroIn = Object.assign({}, r.dineroIn, s.dineroEdit); r.dinero = LAB.calcRiesgo(r.dineroIn); }
    return r;
  };

  /* ---------- Vista: selector de modos ---------- */
  LAB.views.modos = function () {
    return LAB.bgHTML() + LAB.chrome({ tag: 'Inicio' },
      '<section class="shell modes-hero">' +
      '<p class="eyebrow anim" style="--i:0">' + esc(LAB.CONFIG.evento) + ' · ' + esc(LAB.CONFIG.fecha) + '</p>' +
      '<h1 class="display2 anim" style="--i:1">Hospitalidad <span class="grad">inteligente.</span></h1>' +
      '<p class="lead anim" style="--i:2">Marketing y experiencia para el paciente internacional, con IA.</p>' +
      '</section>' +
      '<div class="shell"><nav class="modes" aria-label="Modos">' +
      '<a class="mode-card" href="#/diagnostico"><span class="mode-num">01</span><h2 class="h2">Diagnóstico</h2><p>Primera computadora. El visitante responde seis preguntas con ayuda del equipo.</p><span class="go">Abrir →</span></a>' +
      '<a class="mode-card" href="#/demos"><span class="mode-num">02</span><h2 class="h2">Demostraciones</h2><p>Segunda computadora. Mostramos el caso relacionado con su resultado.</p><span class="go">Abrir →</span></a>' +
      '<a class="mode-card" href="#/pantalla"><span class="mode-num">03</span><h2 class="h2">Pantalla de exhibición</h2><p>Televisión. Presentación automática en bucle para atraer visitantes.</p><span class="go">Abrir →</span></a>' +
      '</nav></div>');
  };

  /* ---------- Visual animado (órbita) ---------- */
  LAB.orbitHTML = function () {
    var items = ['Anuncios', 'Landing', 'WhatsApp', 'Agente IA', 'CRM', 'Seguimiento'];
    return '<div class="orbit-sm" aria-hidden="true"><i class="ring r1"></i><i class="ring r2"></i><i class="ring r3"></i>' +
      '<span class="core">IA</span><div class="spin">' + items.map(function (o, i) {
        return '<b style="--a:' + (i * 60) + 'deg;--d:' + (0.5 + i * 0.15).toFixed(2) + 's"><em>' + o + '</em></b>';
      }).join('') + '</div></div>';
  };
  LAB.bgHTML = function () { return '<div class="app-bg" aria-hidden="true"><i class="orb o1"></i><i class="orb o2"></i><i class="grid"></i></div>'; };

  /* ---------- Vista: bienvenida del diagnóstico ---------- */
  LAB.views.bienvenida = function () {
    var s = session(), a = s.answers || {};
    var answered = Q.filter(function (q) { return a[q.id]; }).length;
    var resume = '';
    if (LAB.isComplete(a)) {
      resume = '<div class="resume-box anim" style="--i:5"><p>Hay un resultado guardado de la sesión anterior.</p><div class="btn-row">' +
        '<a class="btn btn-ghost btn-sm" href="#/' + (s.leadId ? 'resultado' : 'datos') + '">Ver ese resultado</a>' +
        '<button class="btn btn-primary btn-sm" data-act="nuevoVisitante">Nuevo visitante</button></div></div>';
    } else if (answered > 0) {
      resume = '<div class="resume-box anim" style="--i:5"><p>Hay un diagnóstico en curso: ' + answered + ' de ' + Q.length + ' respuestas.</p><div class="btn-row">' +
        '<a class="btn btn-primary btn-sm" href="#/diagnostico/' + firstUnanswered(a) + '">Continuar</a>' +
        '<button class="btn btn-ghost btn-sm" data-act="nuevoVisitante">Empezar de nuevo</button></div></div>';
    }
    var pasos = [['3 min', '8 preguntas sobre tu operación'], ['1', 'oportunidad prioritaria para tu negocio'], ['Demo', 'de cómo trabajaría un agente']];
    return LAB.bgHTML() + LAB.chrome({ tag: 'Diagnóstico', home: '#/diagnostico' },
      '<section class="shell welcome2">' +
      '<div class="welcome-copy">' +
      '<p class="eyebrow anim" style="--i:0">MĒTODO / AI LAB</p>' +
      '<h1 class="display2 anim" style="--i:1">Hospitalidad <span class="grad">inteligente.</span></h1>' +
      '<p class="lead anim" style="--i:2">Marketing y experiencia para el paciente internacional, con IA.</p>' +
      '<p class="claim2 anim" style="--i:3">Descubre qué puedes automatizar primero en tu negocio.</p>' +
      (answered > 0 ? '' : '<div class="btn-row anim" style="--i:4"><a class="btn btn-primary btn-glow" href="#/diagnostico/1">Comenzar diagnóstico <span class="arrow">→</span></a></div>') +
      resume +
      '<div class="mini-steps anim" style="--i:6">' + pasos.map(function (p) { return '<div><strong>' + p[0] + '</strong><span>' + p[1] + '</span></div>'; }).join('') + '</div>' +
      '<div class="notice anim" style="--i:7"><span class="dot"></span><span>Responde sobre tu operación. No incluyas información de pacientes.</span></div>' +
      '</div><div class="welcome-visual anim" style="--i:2">' + LAB.orbitHTML() + '</div>' +
      '</section>');
  };

  /* ---------- Vista: pregunta ---------- */
  LAB.views.pregunta = function (n) {
    var i = n - 1, q = Q[i], s = session(), a = s.answers || {};
    var sel = a[q.id];
    var keys = 'ABCDE';
    var opts = q.opciones.map(function (o, k) {
      return '<li class="opt-li" style="--i:' + k + '"><button type="button" class="option2 option" role="radio" aria-checked="' + (sel === o.id) + '" data-act="answer" data-q="' + q.id + '" data-v="' + o.id + '">' +
        '<span class="key">' + keys[k] + '</span><span class="opt-label">' + esc(o.label.replace(/\.$/, '')) + '</span><span class="check" aria-hidden="true"></span></button></li>';
    }).join('');
    var stepper = Q.map(function (qq, k) {
      var st = k < i ? (a[qq.id] ? 'done' : '') : (k === i ? 'on' : '');
      var ans = '';
      if (a[qq.id] && k !== i) { var o = qq.opciones.filter(function (x) { return x.id === a[qq.id]; })[0]; ans = o ? o.label.replace(/\.$/, '') : ''; }
      var inner = '<span class="dot">' + (st === 'done' ? '✓' : (k + 1)) + '</span><span class="txt"><b>' + esc(qq.corto) + '</b>' + (ans ? '<small>' + esc(ans) + '</small>' : '') + '</span>';
      return a[qq.id] || k <= i ? '<li class="' + st + '"><a href="#/diagnostico/' + (k + 1) + '">' + inner + '</a></li>' : '<li>' + inner + '</li>';
    }).join('');
    var pct = Math.round((i / Q.length) * 100);
    var right = '<button class="btn btn-quiet" data-act="reiniciar">Reiniciar</button>';
    return LAB.bgHTML() + LAB.chrome({ tag: 'Diagnóstico', home: '#/diagnostico', right: right },
      '<div class="topline"><i style="width:' + pct + '%"></i></div>' +
      '<div class="shell q-layout">' +
      '<aside class="q-side"><ol class="stepper">' + stepper + '</ol></aside>' +
      '<section class="q-main" aria-labelledby="qtitle">' +
      '<p class="q-count anim" style="--i:0"><span>Pregunta ' + String(n).padStart(2, '0') + '</span> / ' + String(Q.length).padStart(2, '0') + '</p>' +
      '<h1 class="q-title anim" id="qtitle" style="--i:1">' + esc(q.titulo) + '</h1>' +
      '<p class="q-help anim" style="--i:2">' + esc(q.ayuda) + '</p>' +
      '<ul class="options options2" role="radiogroup" aria-labelledby="qtitle">' + opts + '</ul>' +
      '<div class="q-nav2">' +
      (n > 1 ? '<a class="btn btn-ghost btn-sm" href="#/diagnostico/' + (n - 1) + '">← Atrás</a>' : '<a class="btn btn-ghost btn-sm" href="#/diagnostico">← Inicio</a>') +
      '<span class="q-hint">Teclas 1–' + q.opciones.length + ' o A–' + keys[q.opciones.length - 1] + '</span>' +
      '<button class="btn btn-primary btn-sm" data-act="nextQ" data-n="' + n + '" ' + (sel ? '' : 'disabled') + '>' + (n === Q.length ? 'Ver mi resultado' : 'Siguiente') + ' <span class="arrow">→</span></button>' +
      '</div></section></div>');
  };

  LAB.actions.answer = function (el) {
    var s = session(); s.answers = s.answers || {};
    s.answers[el.getAttribute('data-q')] = el.getAttribute('data-v');
    LAB.store.saveSession(s);
    var group = el.closest('.options');
    group.querySelectorAll('.option').forEach(function (b) { b.setAttribute('aria-checked', b === el ? 'true' : 'false'); });
    var next = document.querySelector('[data-act="nextQ"]'); if (next) next.disabled = false;
    var n = parseInt(next.getAttribute('data-n'), 10), hash = location.hash;
    clearTimeout(LAB._adv);
    LAB._adv = setTimeout(function () { if (location.hash === hash) goNext(n); }, 380);
  };
  function goNext(n) {
    var s = session();
    if (n < Q.length) LAB.go('/diagnostico/' + (n + 1));
    else if (LAB.isComplete(s.answers)) LAB.go(s.leadId || !LAB.CONFIG.celularObligatorio ? '/resultado' : '/datos');
    else LAB.go('/diagnostico/' + firstUnanswered(s.answers));
  }
  LAB.actions.nextQ = function (el) { clearTimeout(LAB._adv); goNext(parseInt(el.getAttribute('data-n'), 10)); };
  LAB.actions.reiniciar = function () {
    LAB.modal({
      title: '¿Reiniciar el diagnóstico?',
      body: '<p>Se borran las respuestas de esta sesión en esta pantalla.</p>',
      confirm: 'Reiniciar', danger: true,
      onConfirm: function () { LAB.store.clearSession(); LAB.go('/diagnostico'); LAB.toast('Diagnóstico reiniciado'); }
    });
  };
  LAB.actions.nuevoVisitante = function () {
    LAB.store.clearSession();
    LAB.go('/diagnostico');
    window.scrollTo(0, 0);
    LAB.toast('Listo para el siguiente visitante');
  };

  /* ---------- Vista: resultado ---------- */
  function section(num, title, body, cls) {
    return '<article class="section scroll-in ' + (cls || '') + '"><div class="section-head"><span class="section-num">' + num + '</span><h2 class="section-title">' + esc(title) + '</h2></div>' + body + '</article>';
  }
  LAB.views.resultado = function () {
    var s = session();
    if (!LAB.isComplete(s.answers)) { LAB.go(firstUnanswered(s.answers || {}) ? '/diagnostico/' + firstUnanswered(s.answers || {}) : '/diagnostico'); return null; }
    if (LAB.CONFIG.celularObligatorio && !s.leadId) { LAB.go('/datos'); return null; }
    var r = LAB.buildResult(s.answers);
    countCompletion(s, r);
    var d = LAB.DEMOS[r.demo];

    var porQue = r.porQue.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') +
      '<div class="callout"><strong>Prioridad:</strong> ' + esc(r.frecuenciaContexto) + '</div>';
    var S = r.sistema;
    var sistema = '<p class="sys-name">' + esc(S.nombre) + '</p><p class="muted sys-sum">' + esc(S.resumen) + '</p>' +
      '<div class="sys-flow">' + S.piezas.map(function (p, k) { return '<span style="--k:' + k + '"><i>' + String(k + 1).padStart(2, '0') + '</i>' + esc(p) + '</span>'; }).join('') + '</div>';
    var agente = '<p class="big">' + esc(r.agente) + '</p><p class="muted">' + esc(r.tarea) + '</p>' +
      '<p class="sub-k">Responsabilidades del agente</p><ul class="checks">' + S.tareas.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' +
      (r.relacion
        ? '<div class="callout"><strong>Cómo se conecta con tu prioridad.</strong> ' + esc(r.relacion) + ' ' + esc(r.beneficio) + '</div>'
        : '<div class="callout"><strong>Lo que ganas:</strong> ' + esc(r.beneficio) + '</div>');
    var dineroHTML = LAB.dineroHTML(r);
    var ih = r.inhouse;
    var refLink = function (k) { var f = LAB.FUENTES[k]; return '<a class="ref" href="#ref-' + k + '">' + esc(f.corto) + '</a>'; };
    var vs = '<div class="vs">' +
      '<div class="vs-col vs-in"><p class="vs-k">Equipo in-house contratado</p>' +
      '<table class="vs-roles">' + ih.roles.map(function (x) { return '<tr><td>' + esc(x[0]) + '<small>' + refLink(x[2]) + '</small></td><td>' + LAB.money(x[1]) + '</td></tr>'; }).join('') +
      '<tr class="sub"><td>Carga patronal (IMSS, Infonavit, ISN, prestaciones) +' + LAB.CONFIG.supuestos.cargaPatronal + '%<small>' + refLink('carga') + '</small></td><td>' + LAB.money(ih.total - ih.bruto) + '</td></tr></table>' +
      '<div class="vs-total"><span>Costo mensual estimado</span><b>' + LAB.money(ih.total) + '</b><small>' + LAB.money(ih.anual) + ' al año, sin contar reclutamiento, capacitación ni rotación.</small></div></div>' +
      '<div class="vs-col vs-ai"><p class="vs-k">Sistema con IA de MĒTODO</p>' +
      '<ul class="checks">' + S.tareas.slice(0, 4).map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' +
      '<div class="vs-total"><span>Inversión mensual</span><b>' + (r.inversionIA ? 'Desde ' + LAB.money(r.inversionIA) : 'A la medida') + '</b><small>' +
      (r.inversionIA ? 'Incluye implementación, entrenamiento del agente y optimización mensual.' : 'La definimos en tu sesión estratégica según volumen y alcance.') + '</small></div></div></div>' +
      '<table class="vs-table"><thead><tr><th></th><th>In-house contratado</th><th>Sistema con IA</th></tr></thead><tbody>' +
      LAB.COMPARATIVA.map(function (c) { return '<tr><td>' + esc(c[0]) + '</td><td>' + esc(c[1]) + '</td><td>' + esc(c[2]) + '</td></tr>'; }).join('') + '</tbody></table>' +
      '<p class="small" style="margin-top:12px">La IA no sustituye el criterio clínico ni la relación con el paciente: le quita a tu equipo el trabajo repetitivo para que se enfoque en lo que sí requiere a una persona.</p>';
    var refs = '<ol class="refs">' + Object.keys(LAB.FUENTES).map(function (k) { var f = LAB.FUENTES[k]; return '<li id="ref-' + k + '">' + esc(f.texto) + ' <a href="' + esc(f.url) + '" target="_blank" rel="noopener">Ver fuente</a></li>'; }).join('') + '</ol>';
    var kpis = '<p class="sub-k" style="margin-top:0 !important">Empieza midiendo</p><p class="indicator">' + esc(r.indicador) + '</p><p class="muted">' + esc(r.medir) + '</p>' +
      '<p class="sub-k">Tablero del sistema</p><div class="kpi-grid">' + S.kpis.map(function (k, i) { return '<span style="--k:' + i + '">' + esc(k) + '</span>'; }).join('') + '</div>' +
      '<p class="small" style="margin-top:12px">Toma la línea base antes de activar cualquier agente. Este laboratorio no estima ahorros ni retorno: esos se miden con tus datos.</p>';
    var gob = '<ul class="checks">' + S.gobernanza.map(function (g) { return '<li>' + esc(g) + '</li>'; }).join('') + '</ul>' +
      '<div class="callout"><strong>Principio:</strong> el agente propone y ejecuta tareas administrativas; las decisiones clínicas y comerciales siempre son de una persona.</div>';
    var humano = '<p>' + esc(r.humano) + '</p>' +
      '<p class="sub-k">Quién hace qué</p><div class="roles">' + S.equipo.map(function (e) { return '<div><b>' + esc(e[0]) + '</b><span>' + esc(e[1]) + '</span></div>'; }).join('') + '</div>' +
      '<p class="sub-k">Ritmo operativo</p><div class="rutina">' + S.rutina.map(function (e) { return '<div><b>' + esc(e[0]) + '</b><span>' + esc(e[1]) + '</span></div>'; }).join('') + '</div>' +
      '<div class="callout"><strong>Quién debería liderarlo:</strong> ' + esc(r.lidera) + '</div>';
    var plan = '<div class="plan90"><div class="plan-line"><i></i></div>' + S.plan.map(function (fase, k) {
      return '<div class="plan-col" style="--k:' + k + '"><span class="plan-d">Días ' + ['1–30', '31–60', '61–90'][k] + '</span><b>' + ['Ordenar la base', 'Activar y probar', 'Ajustar y escalar'][k] + '</b><ul>' +
        fase.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul></div>';
    }).join('') + '</div>';
    var reqs = '<ul>' + r.requisitos.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' +
      '<div class="first-step"><span class="label">Primer paso</span>' + esc(r.primerPaso) + '</div>';
    var ind = '<p class="indicator">' + esc(r.indicador) + '</p><p class="muted">' + esc(r.medir) + '</p>' +
      '<p class="small">Toma el punto de partida antes de activar cualquier agente. Este laboratorio no estima ahorros ni resultados: esos los medirás tú.</p>';
    var demo = '<p class="big">Demo ' + d.letra + ' · ' + esc(d.titulo) + '</p><p class="muted">' + esc(r.demoNota) + '</p>' +
      '<p class="small">En el stand: pide al equipo la Demo ' + d.letra + ' en la segunda computadora.</p>' +
      '<p style="margin-top:14px"><a href="#/demos/d">Ver cómo se conecta todo el negocio (Demo D) →</a></p>';

    return LAB.bgHTML() + LAB.chrome({ tag: 'Resultado', home: '#/diagnostico', right: '<a class="btn btn-quiet no-print" href="#/diagnostico/1">Cambiar respuestas</a>' },
      '<section class="shell result-hero result-hero2"><div>' +
      '<span class="chip anim" style="--i:0"><span class="dot"></span>Ruta · ' + esc(r.area) + '</span>' +
      '<p class="eyebrow anim" style="margin-top:24px;--i:1">01 · Tu oportunidad prioritaria</p>' +
      '<h1 class="h1 result-title anim" style="--i:2">' + esc(r.oportunidad) + '</h1>' +
      '<div class="result-actions btn-row anim" style="--i:3">' +
      '<a class="btn btn-primary" href="#/demos/' + r.demo + '">Ver una demostración <span class="arrow">→</span></a>' +
      '<button class="btn btn-ghost" data-act="descargarResumen">Descargar mi resumen</button>' +
      '<button class="btn btn-quiet" data-act="imprimir">Imprimir o guardar PDF</button>' +
      '</div></div>' +
      '<aside class="glance anim" style="--i:3"><p class="glance-k">Tu resultado en corto</p>' +
      '<div class="glance-row glance-money" style="--j:0"><span>Dinero en riesgo al mes</span><b id="glanceMoney">' + LAB.money(r.dinero.mensual) + '</b></div>' +
      '<div class="glance-row" style="--j:1"><span>Sistema recomendado</span><b>' + esc(r.sistema.nombre) + '</b></div>' +
      
      '<div class="glance-row" style="--j:2"><span>Equipo in-house equivalente</span><b>' + LAB.money(r.inhouse.total) + ' al mes</b></div>' +
      '<div class="glance-row" style="--j:3"><span>KPI inicial</span><b>' + esc(r.indicador) + '</b></div>' +
      '<div class="glance-row" style="--j:4"><span>Demos</span><b>Demo ' + d.letra + ' · ' + esc(d.titulo) + ' · <a href="#/demos/d">Demo D →</a></b></div>' +
      '</aside></section>' +
      '<div class="shell"><div class="sections">' +
      section('02', 'Cuánto dinero se te puede estar escapando', dineroHTML, 'section-wide section-money') +
      section('03', 'Por qué aparece', porQue) +
      section('04', 'El sistema que te recomendamos', sistema) +
      section('05', 'El agente, en concreto', agente) +
      section('06', 'Cómo se opera: IA + tu equipo', humano) +
      section('07', 'IA vs. contratar un equipo in-house', vs, 'section-wide') +
      section('08', 'Hoja de ruta a 90 días', plan, 'section-wide') +
      section('09', 'KPIs del sistema', kpis) +
      section('10', 'Gobernanza y cumplimiento', gob) +
      section('11', 'Qué necesitas para empezar', reqs) +
      section('12', 'Demostración relacionada', demo) +
      section('13', 'Referencias', refs, 'section-wide section-refs') +
      '</div>' +
      '<section class="next-block no-print">' +
      '<p class="eyebrow">Siguiente paso</p><h2 class="h2">¿Quieres aterrizar esta oportunidad a tu negocio?</h2>' +
      (s.quiereSeguimiento
        ? '<div class="ok-box reveal" style="margin-top:28px;max-width:640px"><h3 class="h3">Listo, lo anotamos.</h3><p>El equipo de MĒTODO te contactará después del evento al celular que nos dejaste para coordinar tu sesión estratégica. Todavía no se agendó nada: lo acordamos contigo.</p></div>'
        : '<p class="lead" style="margin-top:16px">MĒTODO diseña e implementa este sistema con tu equipo: arquitectura, configuración del CRM y del agente, y capacitación in-house. Empezamos con una sesión estratégica de 20 minutos sobre tu caso.</p>' +
          '<div class="btn-row" style="margin-top:28px"><button class="btn btn-primary" data-act="quiereSeguimiento">Quiero una sesión estratégica con MĒTODO <span class="arrow">→</span></button>' +
          '<button class="btn btn-ghost" data-act="descargarResumen">Solo descargar mi resumen</button></div>') +
      '<div class="btn-row" style="margin-top:40px;padding-top:28px;border-top:1px solid var(--linea)">' +
      '<button class="btn btn-ghost" data-act="nuevoVisitante">Nuevo visitante</button>' +
      '<span class="small">Borra las respuestas de esta pantalla para la siguiente persona.</span></div>' +
      '<p class="disclaimer">Este resultado sale de reglas preparadas a partir de tus respuestas. No es un diagnóstico clínico, no usa datos de pacientes y no estima ahorros ni retorno de inversión.</p>' +
      '</section></div>');
  };

  /* ---------- Dinero en riesgo ---------- */
  LAB.money = function (n) {
    n = Math.round(+n || 0);
    try { return '$' + n.toLocaleString('es-MX') + ' MXN'; } catch (e) { return '$' + n + ' MXN'; }
  };
  function dineroInputs() {
    var s = session(), r = LAB.buildResult(s.answers);
    return Object.assign({}, r.dineroIn, s.dineroEdit || {});
  }
  LAB.dineroHTML = function (r) {
    var x = dineroInputs(), d = LAB.calcRiesgo(x);
    function field(id, label, val, suf, hint) {
      return '<label class="calc-f"><span>' + esc(label) + '</span><div class="calc-in">' + (suf === '$' ? '<i>$</i>' : '') +
        '<input type="number" inputmode="decimal" min="0" ' + (suf === '%' ? 'max="100" step="1"' : 'step="1"') + ' data-calc="' + id + '" value="' + esc(val) + '">' + (suf === '%' ? '<i>%</i>' : '') + '</div>' +
        (hint ? '<small>' + hint + '</small>' : '') + '</label>';
    }
    return '<div class="calc">' +
      '<div class="calc-out"><p class="sub-k" style="margin-top:0 !important">Estimación con tus números</p>' +
      '<p class="calc-big"><span id="calcMensual" data-to="' + Math.round(d.mensual) + '">' + LAB.money(d.mensual) + '</span><small>al mes</small></p>' +
      '<p class="calc-year">≈ <b id="calcAnual">' + LAB.money(d.anual) + '</b> al año</p>' +
      '<div class="calc-split"><div><span>Por respuesta lenta o sin seguimiento</span><b id="calcResp">' + LAB.money(d.dineroRespuesta) + '</b><small id="calcRespP">' + d.pacientesRespuesta.toFixed(1) + ' pacientes al mes</small></div>' +
      '<div><span>Por inasistencias a citas</span><b id="calcNoshow">' + LAB.money(d.dineroInasistencia) + '</b><small id="calcNoshowP">' + d.pacientesInasistencia.toFixed(1) + ' pacientes al mes</small></div></div></div>' +
      '<div class="calc-form"><p class="sub-k" style="margin-top:0 !important">Ajusta los supuestos</p>' +
      field('ticket', 'Ticket promedio por paciente', x.ticket, '$') +
      field('volumen', 'Solicitudes o prospectos al mes', x.volumen, '') +
      field('cierre', 'Tasa de cierre (solicitud → paciente)', x.cierre, '%', 'Pon tu dato real si lo tienes.') +
      field('fuga', 'Solicitudes que se pierden por respuesta lenta o falta de seguimiento', x.fuga, '%', 'Supuesto conservador: en el estudio de HBR, 23% de las empresas nunca respondió.') +
      field('inasistencia', 'Inasistencia a citas', x.inasistencia, '%', 'Supuesto conservador: el promedio en 105 estudios es de 23%.') +
      '</div></div>' +
      '<p class="small" style="margin-top:14px">Fórmula: solicitudes × % que se pierde × tasa de cierre × ticket, más citas agendadas × % de inasistencia × ticket. Es una estimación para dimensionar la oportunidad, no una medición de tu negocio. Referencias: <a class="ref" href="#ref-hbr">Harvard Business Review, 2011</a> · <a class="ref" href="#ref-noshow">Dantas et al., 2018</a>.</p>';
  };
  function recalc(input) {
    var k = input.getAttribute('data-calc'), v = parseFloat(input.value);
    if (isNaN(v) || v < 0) return;
    LAB._countStop = true;
    var s = session(); s.dineroEdit = s.dineroEdit || {}; s.dineroEdit[k] = v; LAB.store.saveSession(s);
    var d = LAB.calcRiesgo(dineroInputs());
    var set = function (id, t) { var el = document.getElementById(id); if (el) el.textContent = t; };
    set('calcMensual', LAB.money(d.mensual)); set('calcAnual', LAB.money(d.anual)); set('glanceMoney', LAB.money(d.mensual));
    set('calcResp', LAB.money(d.dineroRespuesta)); set('calcNoshow', LAB.money(d.dineroInasistencia));
    set('calcRespP', d.pacientesRespuesta.toFixed(1) + ' pacientes al mes'); set('calcNoshowP', d.pacientesInasistencia.toFixed(1) + ' pacientes al mes');
    var big = document.getElementById('calcMensual'); if (big) { big.classList.remove('bump'); void big.offsetWidth; big.classList.add('bump'); }
  }
  document.addEventListener('input', function (e) { if (e.target && e.target.getAttribute && e.target.getAttribute('data-calc')) recalc(e.target); });
  LAB.countUp = function (root) {
    var el = root.querySelector('#calcMensual'); if (!el) return;
    var to = +el.getAttribute('data-to') || 0, t0 = performance.now(), dur = 1400;
    LAB._countStop = false;
    (function step(t) {
      if (LAB._countStop) return;
      var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = LAB.money(to * e);
      if (p < 1 && document.body.contains(el)) requestAnimationFrame(step);
    })(t0);
  };

  LAB.actions.imprimir = function () { window.print(); };

  /* ---------- Resumen descargable ---------- */
  LAB.summaryHTML = function (r) {
    var d = LAB.DEMOS[r.demo];
    var fecha = new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
    var brand = LAB.logoDataURI
      ? '<img src="' + LAB.logoDataURI + '" alt="MĒTODO" style="height:28px">'
      : '<strong style="font-size:22px;letter-spacing:.02em">MĒTODO</strong>';
    function block(n, t, body) {
      return '<section><div class="h"><span>' + n + '</span>' + esc(t) + '</div>' + body + '</section>';
    }
    var list = '<ul>' + r.requisitos.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>';
    var sitio = LAB.CONFIG.sitio && LAB.CONFIG.sitio.texto
      ? '<p>Si quieres aterrizar esta oportunidad con MĒTODO: <a href="' + esc(LAB.CONFIG.sitio.url) + '">' + esc(LAB.CONFIG.sitio.texto) + '</a></p>' : '';
    return '<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
      '<title>Mi resumen · MĒTODO AI LAB</title><style>' +
      'body{margin:0;background:#F3F6FC;color:#10141D;font-family:"Nimbus Sans",Arial,Helvetica,sans-serif;line-height:1.5;font-size:16px}' +
      '.w{max-width:780px;margin:0 auto;padding:40px 24px 60px}' +
      'header{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #d5dbe8;padding-bottom:18px}' +
      'header small{color:#5a6273;letter-spacing:.12em;text-transform:uppercase;font-size:11px}' +
      '.k{margin:36px 0 8px;font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#3F75FF;font-weight:700}' +
      'h1{font-size:34px;line-height:1.08;letter-spacing:-.025em;margin:0 0 12px}' +
      '.chip{display:inline-block;font-size:12px;letter-spacing:.1em;text-transform:uppercase;border:1px solid #b9c2d6;border-radius:99px;padding:4px 12px;color:#3a4252}' +
      'section{border-top:1px solid #d5dbe8;padding:20px 0}' +
      '.h{font-size:12px;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:#3a4252;margin-bottom:10px}' +
      '.h span{color:#7a6ff0;margin-right:10px}' +
      'p{margin:0 0 10px}.big{font-size:20px;font-weight:700;letter-spacing:-.01em}' +
      '.note{background:#fff;border-left:3px solid #B5AEFF;padding:10px 14px;margin-top:10px;font-size:15px;color:#2b3140}' +
      'ul{margin:0;padding-left:20px}li{margin-bottom:6px}' +
      'footer{margin-top:30px;font-size:13px;color:#5a6273;border-top:1px solid #d5dbe8;padding-top:16px}' +
      'a{color:#3F75FF}.st{width:100%;border-collapse:collapse;font-size:14px}.st th,.st td{text-align:left;padding:7px 8px;border-bottom:1px solid #d5dbe8;vertical-align:top}.st th{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#5a6273}@media print{body{background:#fff}}' +
      '</style></head><body><div class="w">' +
      '<header>' + brand + '<small>AI LAB · Hospitalidad inteligente</small></header>' +
      '<p class="k">Tu oportunidad prioritaria</p><h1>' + esc(r.oportunidad) + '</h1><span class="chip">Ruta · ' + esc(r.area) + '</span>' +
      '<div style="height:22px"></div>' +
      block('01', 'Cuánto dinero se te puede estar escapando', '<p class="big" style="font-size:28px;color:#3F75FF">' + LAB.money(r.dinero.mensual) + ' al mes</p><p>≈ ' + LAB.money(r.dinero.anual) + ' al año. Por respuesta lenta o sin seguimiento: ' + LAB.money(r.dinero.dineroRespuesta) + '. Por inasistencias: ' + LAB.money(r.dinero.dineroInasistencia) + '.</p><p style="font-size:13px;color:#5a6273">Supuestos: ticket ' + LAB.money(r.dineroIn.ticket) + ', ' + r.dineroIn.volumen + ' solicitudes al mes, cierre ' + r.dineroIn.cierre + '%, pérdida por respuesta ' + r.dineroIn.fuga + '%, inasistencia ' + r.dineroIn.inasistencia + '%. Estimación para dimensionar la oportunidad, no una medición.</p>') +
      block('02', 'Por qué aparece', r.porQue.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') + '<div class="note">' + esc(r.frecuenciaContexto) + '</div>') +
      block('03', 'El sistema que te recomendamos', '<p class="big">' + esc(r.sistema.nombre) + '</p><p>' + esc(r.sistema.resumen) + '</p><p>' + r.sistema.piezas.map(esc).join(' → ') + '</p>') +
      block('04', 'El agente, en concreto', '<p class="big">' + esc(r.agente) + '</p><p>' + esc(r.tarea) + '</p><ul>' + r.sistema.tareas.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul><div class="note">' + (r.relacion ? esc(r.relacion) + ' ' : '') + esc(r.beneficio) + '</div>') +
      block('05', 'Modelo operativo in-house', '<p>' + esc(r.humano) + '</p><ul>' + r.sistema.equipo.map(function (e) { return '<li><strong>' + esc(e[0]) + ':</strong> ' + esc(e[1]) + '</li>'; }).join('') + '</ul><p style="margin-top:10px"><strong>Ritmo operativo</strong></p><ul>' + r.sistema.rutina.map(function (e) { return '<li><strong>' + esc(e[0]) + ':</strong> ' + esc(e[1]) + '</li>'; }).join('') + '</ul><div class="note">' + esc(r.lidera) + '</div>') +
      block('06', 'Hoja de ruta a 90 días', r.sistema.plan.map(function (f, k) { return '<p><strong>Días ' + ['1–30', '31–60', '61–90'][k] + ' · ' + esc(r.sistema.fases[k]) + '</strong></p><ul>' + f.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>'; }).join('')) +
      block('07', 'IA vs. contratar un equipo in-house', '<table class="st"><tr><th>Puesto in-house equivalente</th><th>Sueldo bruto mensual</th></tr>' + r.inhouse.roles.map(function (x) { return '<tr><td>' + esc(x[0]) + ' <span style="color:#5a6273">(' + esc(LAB.FUENTES[x[2]].corto) + ')</span></td><td>' + LAB.money(x[1]) + '</td></tr>'; }).join('') + '<tr><td>Carga patronal +' + LAB.CONFIG.supuestos.cargaPatronal + '%</td><td>' + LAB.money(r.inhouse.total - r.inhouse.bruto) + '</td></tr><tr><td><strong>Costo mensual estimado</strong></td><td><strong>' + LAB.money(r.inhouse.total) + '</strong></td></tr></table><p><strong>Sistema con IA de MĒTODO:</strong> ' + (r.inversionIA ? 'desde ' + LAB.money(r.inversionIA) + ' al mes.' : 'inversión a la medida, definida en la sesión estratégica.') + '</p><table class="st"><tr><th></th><th>In-house contratado</th><th>Sistema con IA</th></tr>' + LAB.COMPARATIVA.map(function (c) { return '<tr><td><strong>' + esc(c[0]) + '</strong></td><td>' + esc(c[1]) + '</td><td>' + esc(c[2]) + '</td></tr>'; }).join('') + '</table>') +
      block('08', 'KPIs del sistema', '<p class="big">Empieza midiendo: ' + esc(r.indicador) + '</p><p>' + esc(r.medir) + '</p><ul>' + r.sistema.kpis.map(function (k) { return '<li>' + esc(k) + '</li>'; }).join('') + '</ul>') +
      block('09', 'Gobernanza y cumplimiento', '<ul>' + r.sistema.gobernanza.map(function (g) { return '<li>' + esc(g) + '</li>'; }).join('') + '</ul>') +
      block('10', 'Qué necesitas para empezar', list + '<div class="note"><strong>Primer paso:</strong> ' + esc(r.primerPaso) + '</div>') +
      block('11', 'Demostración relacionada', '<p><strong>Demo ' + d.letra + ' · ' + esc(d.titulo) + '.</strong> ' + esc(r.demoNota) + '</p>') +
      '<section><div class="h">Referencias</div><ol style="font-size:13px;color:#3a4252;padding-left:18px">' + Object.keys(LAB.FUENTES).map(function (k) { var f = LAB.FUENTES[k]; return '<li>' + esc(f.texto) + ' <a href="' + esc(f.url) + '">' + esc(f.url) + '</a></li>'; }).join('') + '</ol></section>' +
      '<section><div class="h">Tus respuestas</div><p>Organización: ' + esc(r.respuestas.org) + ' · Función: ' + esc(r.respuestas.rol) + '<br>Proceso: ' + esc(r.respuestas.problema) + '<br>Cómo lo resuelven hoy: ' + esc(r.respuestas.nivel) + ' · Frecuencia: ' + esc(r.respuestas.frecuencia) + '<br>Prioridad a 90 días: ' + esc(r.respuestas.objetivo) + '<br>Ticket promedio: ' + esc(r.respuestas.ticket) + ' · Solicitudes al mes: ' + esc(r.respuestas.volumen) + '</p></section>' +
      '<footer><p>Generado el ' + esc(fecha) + ' en MĒTODO / AI LAB · ' + esc(LAB.CONFIG.evento) + ', ' + esc(LAB.CONFIG.ciudad) + '.</p>' +
      '<p>Este resumen sale de reglas preparadas a partir de tus respuestas. No es un diagnóstico clínico ni una medición: no estima ahorros ni retorno de inversión.</p>' + sitio + '</footer>' +
      '</div></body></html>';
  };
  LAB.actions.descargarResumen = function () {
    var r = LAB.currentResult(); if (!r) return;
    LAB.download('MeTODO-AI-LAB-resumen-' + r.routeId + '.html', LAB.summaryHTML(r), 'text/html;charset=utf-8');
    LAB.toast('Resumen descargado. Ábrelo en cualquier navegador.');
  };

  /* ---------- Vista: datos (celular obligatorio antes del resultado) ---------- */
  LAB.views.datos = function () {
    var s = session();
    if (!LAB.isComplete(s.answers)) { LAB.go('/diagnostico'); return null; }
    if (s.leadId) { LAB.go('/resultado'); return null; }
    var d = s.borrador || {};
    var pr = LAB.buildResult(s.answers);
    var preview = '<aside class="gate-preview anim" style="--i:3" aria-hidden="true"><span class="chip"><span class="dot"></span>Ruta · ' + esc(pr.area) + '</span>' +
      '<p class="gp-k">Dinero en riesgo al mes</p><p class="gp-money">' + LAB.money(pr.dinero.mensual) + '</p>' +
      '<p class="gp-k">Tu oportunidad prioritaria</p><p class="gp-title">' + esc(pr.oportunidad) + '</p>' +
      '<div class="gp-lines"><i></i><i></i><i style="width:70%"></i><i></i><i style="width:55%"></i></div>' +
      '<div class="gp-grid"><span>Sistema recomendado</span><span>IA vs. in-house</span><span>Hoja de ruta 90 días</span><span>Referencias</span></div>' +
      '<div class="gp-lock"><svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/></svg>Se desbloquea con tus datos</div></aside>';
    return LAB.bgHTML() + LAB.chrome({ tag: 'Diagnóstico', home: '#/diagnostico', right: '<button class="btn btn-quiet" data-act="reiniciar">Reiniciar</button>' },
      '<div class="topline"><i style="width:100%"></i></div>' +
      '<div class="shell gate-layout"><section class="lead-gate">' +
      '<p class="q-count anim" style="--i:0"><span>Último paso</span></p>' +
      '<h1 class="q-title anim" style="--i:1">Tu resultado está listo. ¿A qué celular te contactamos?</h1>' +
      '<p class="q-help anim" style="--i:2">Déjanos tus datos para verlo. Te escribimos por WhatsApp para darle seguimiento.</p>' +
      '<form class="form lead-form anim" id="leadForm" style="--i:3" novalidate>' +
      '<div class="field"><label for="f-nombre">Nombre *</label><input type="text" id="f-nombre" name="nombre" autocomplete="name" maxlength="80" value="' + esc(d.nombre || '') + '" required></div>' +
      '<div class="field"><label for="f-cel">Celular (WhatsApp) *</label><input type="tel" id="f-cel" name="celular" autocomplete="tel" inputmode="tel" maxlength="20" placeholder="664 123 4567" value="' + esc(d.celular || '') + '" required></div>' +
      '<div class="field"><label for="f-org">Organización</label><input type="text" id="f-org" name="organizacion" autocomplete="organization" maxlength="100" value="' + esc(d.organizacion || '') + '"></div>' +
      '<div class="field"><label for="f-mail">Correo (opcional)</label><input type="email" id="f-mail" name="correo" autocomplete="email" inputmode="email" maxlength="100" value="' + esc(d.correo || '') + '"></div>' +
      '<label class="consent"><input type="checkbox" name="aviso" id="f-aviso"><span>Acepto el <a href="#" data-act="verAviso">aviso de privacidad</a> y que MĒTODO me contacte por WhatsApp sobre mi resultado. *</span></label>' +
      '<label class="consent"><input type="checkbox" name="promos" id="f-promos"><span>También quiero recibir información de talleres y eventos de MĒTODO.</span></label>' +
      '<p class="form-error" id="formError" role="alert" hidden></p>' +
      '<div class="btn-row"><button type="submit" class="btn btn-primary" id="leadSubmit">Ver mi resultado <span class="arrow">→</span></button>' +
      '<a class="btn btn-quiet" href="#/diagnostico/6">← Atrás</a></div>' +
      '<p class="small">No pedimos información de pacientes. * Obligatorio.</p>' +
      '</form></section>' + preview + '</div>');
  };
  LAB.actions.verAviso = function () {
    LAB.modal({ title: 'Aviso de privacidad simplificado', body: LAB.AVISO.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join(''), cancel: 'Cerrar' });
  };

  LAB.origen = function () {
    if (LAB.isLocalContext()) return LAB.store.settings().deviceName;
    return (window.matchMedia && matchMedia('(pointer: coarse)').matches) ? 'QR · celular' : 'Web';
  };
  function normCel(v) {
    var t = v.trim(), plus = t.charAt(0) === '+', dg = t.replace(/\D/g, '');
    return { digits: dg, value: (plus ? '+' : '') + dg };
  }

  function onLeadSubmit(e) {
    e.preventDefault();
    var f = e.target, err = document.getElementById('formError');
    var nombre = f.nombre.value.trim(), org = f.organizacion.value.trim(), correo = f.correo.value.trim();
    var cel = normCel(f.celular.value);
    var s0 = session(); s0.borrador = { nombre: nombre, celular: f.celular.value, organizacion: org, correo: correo }; LAB.store.saveSession(s0);
    var msg = '';
    if (!nombre) msg = 'Escribe tu nombre.';
    else if (cel.digits.length < 10 || cel.digits.length > 13) msg = 'Revisa tu celular: escribe los 10 dígitos (con lada si es de EE.UU.).';
    else if (correo && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo)) msg = 'Revisa tu correo o déjalo vacío.';
    else if (!f.aviso.checked) msg = 'Para ver tu resultado necesitamos que aceptes el aviso de privacidad.';
    if (msg) { err.textContent = msg; err.hidden = false; return; }
    var btn = document.getElementById('leadSubmit'); btn.disabled = true; btn.textContent = 'Guardando…';
    var r = LAB.buildResult(session().answers);
    var entry = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      fecha: new Date().toISOString(),
      dispositivo: LAB.origen(),
      nombre: nombre, celular: cel.value, organizacion: org, correo: correo,
      aviso: 'Sí', promos: f.promos.checked ? 'Sí' : 'No', quiereSeguimiento: 'No',
      ruta: r.area, tipoOrganizacion: r.respuestas.org, funcion: r.respuestas.rol,
      proceso: r.respuestas.problema, herramientas: r.respuestas.nivel,
      frecuencia: r.respuestas.frecuencia, objetivo: r.respuestas.objetivo,
      ticket: r.respuestas.ticket, volumen: r.respuestas.volumen, riesgoMensual: Math.round(r.dinero.mensual),
      enviado: LAB.endpoint() ? 'Pendiente' : 'No (solo local)'
    };
    // Respaldo local en las computadoras del stand
    if (LAB.isLocalContext()) { var list = LAB.store.contacts(); list.push(entry); LAB.store.saveContacts(list); }
    var s = session(); s.leadId = entry.id; delete s.borrador; LAB.store.saveSession(s);
    var payload = Object.assign({ tipo: 'contacto' }, entry);
    var done = function () { LAB.go('/resultado'); };
    if (LAB.endpoint()) {
      var timer = setTimeout(done, 5000); // nunca bloquear al visitante más de 5 s
      LAB.sync.enqueue(payload).then(function () { clearTimeout(timer); done(); }, function () { clearTimeout(timer); done(); });
    } else done();
  }

  LAB.actions.quiereSeguimiento = function () {
    var s = session(); if (!s.leadId) return;
    s.quiereSeguimiento = true; LAB.store.saveSession(s);
    var list = LAB.store.contacts(); list.forEach(function (c) { if (c.id === s.leadId) c.quiereSeguimiento = 'Sí'; }); LAB.store.saveContacts(list);
    if (LAB.endpoint()) LAB.sync.enqueue({ tipo: 'seguimiento', id: s.leadId, quiereSeguimiento: 'Sí' });
    render();
    var nb = document.querySelector('.next-block'); if (nb) nb.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  /* ---------- Vista: QR para el stand ---------- */
  LAB.views.qr = function () {
    var url = LAB.qrURL();
    return LAB.chrome({ tag: 'QR', home: '#/' },
      '<section class="shell qr-page">' +
      '<div><p class="eyebrow">Hazlo desde tu celular</p><h1 class="h1">Escanea y descubre qué automatizar primero.</h1>' +
      '<p class="lead" style="margin-top:18px">Diagnóstico de 3 minutos para tu negocio de salud.</p>' +
      '<p class="small" style="margin-top:24px;word-break:break-all">' + esc(url) + '</p></div>' +
      '<div class="qr-box">' + (url ? LAB.qrSVG(url) : '<p>Configura urlPublica en js/data.js</p>') + '</div>' +
      '</section>');
  };

  /* ---------- Router ---------- */
  function parse() {
    var h = (location.hash || '#/').replace(/^#/, '');
    var parts = h.split('?')[0].split('/').filter(Boolean);
    return parts;
  }
  var cleanup = null;
  function render() {
    if (cleanup) { try { cleanup(); } catch (e) {} cleanup = null; }
    clearTimeout(LAB._adv);
    var p = parse(), html = null, mount = null, mode = '';
    var root = document.getElementById('root');
    document.body.className = '';
    if (p[0] === 'diagnostico') {
      var n = parseInt(p[1], 10);
      if (n >= 1 && n <= Q.length) {
        var s = session(), fu = firstUnanswered(s.answers || {});
        if (fu && n > fu) { LAB.go('/diagnostico/' + fu); return; }
        html = LAB.views.pregunta(n);
      } else html = LAB.views.bienvenida();
      mode = 'diagnostico';
    } else if (p[0] === 'resultado') { html = LAB.views.resultado(); mode = 'diagnostico'; }
    else if (p[0] === 'datos') { html = LAB.views.datos(); mode = 'diagnostico'; }
    else if (p[0] === 'siguiente') { LAB.go('/resultado'); return; }
    else if (p[0] === 'qr') { html = LAB.views.qr(); mode = 'qr'; }
    else if (p[0] === 'demos') { var v = LAB.views.demos(p[1]); html = v.html; mount = v.mount; mode = 'demos'; }
    else if (p[0] === 'pantalla') { var t = LAB.views.pantalla(); html = t.html; mount = t.mount; mode = 'tv'; }
    else if (p[0] === 'operador') { var o = LAB.views.operador(); html = o.html; mount = o.mount; mode = 'operador'; }
    else html = LAB.views.modos();
    if (html == null) return;
    document.body.classList.add('mode-' + (mode || 'inicio'));
    root.innerHTML = html;
    window.scrollTo(0, 0);
    var titles = { diagnostico: 'Diagnóstico', demos: 'Demostraciones', tv: 'Pantalla', operador: 'Operador' };
    document.title = (titles[mode] ? titles[mode] + ' · ' : '') + 'MĒTODO / AI LAB';
    var form = document.getElementById('leadForm');
    if (form) form.addEventListener('submit', onLeadSubmit);
    if (mount) cleanup = mount(root) || null;
    LAB.observeReveal(root);
    if (document.getElementById('calcMensual')) LAB.countUp(root);
    var h1 = root.querySelector('h1'); if (h1 && mode !== 'tv') { h1.setAttribute('tabindex', '-1'); h1.focus({ preventScroll: true }); }
  }
  LAB.render = render;
  LAB.observeReveal = function (root) {
    var els = root.querySelectorAll('.scroll-in');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    els.forEach(function (e, k) { e.style.setProperty('--k', k % 2); io.observe(e); });
  };

  /* ---------- Eventos globales ---------- */
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-act]');
    if (!el || el.disabled) return;
    var fn = LAB.actions[el.getAttribute('data-act')];
    if (fn) { e.preventDefault(); fn(el, e); }
  });
  document.addEventListener('keydown', function (e) {
    if (document.querySelector('.modal-backdrop')) return;
    var tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable) return;
    var p = parse();
    if (p[0] === 'diagnostico' && p[1]) {
      var n = parseInt(p[1], 10), q = Q[n - 1]; if (!q) return;
      var k = parseInt(e.key, 10);
      var li = 'abcde'.indexOf((e.key || '').toLowerCase()); if (isNaN(k) && li >= 0 && e.key.length === 1) k = li + 1;
      if (k >= 1 && k <= q.opciones.length) {
        var b = document.querySelector('.option[data-v="' + q.opciones[k - 1].id + '"]'); if (b) b.click();
      } else if (e.key === 'ArrowLeft' && n > 1) LAB.go('/diagnostico/' + (n - 1));
      else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        var nx = document.querySelector('[data-act="nextQ"]'); if (nx && !nx.disabled && e.key === 'ArrowRight') nx.click();
      }
    }
  });
  window.addEventListener('hashchange', render);

  /* ---------- Arranque: detectar logo maestro ---------- */
  function boot() {
    var img = new Image();
    img.onload = function () {
      LAB.logoOK = true;
      // Incrustar el logo en el resumen descargable (solo funciona con servidor local).
      if (location.protocol !== 'file:' && window.fetch) {
        fetch('assets/logo-metodo.svg').then(function (r) { return r.text(); }).then(function (t) {
          LAB.logoDataURI = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(t);
        }).catch(function () {});
      }
      render();
    };
    img.onerror = function () { LAB.logoOK = false; };
    img.src = 'assets/logo-metodo.svg';
    render();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
