/* MĒTODO / AI LAB — Demostraciones simuladas (A: atención, B: seguimiento, C: contenido).
   Todo es ficticio y local: no se envía ningún mensaje ni se llama a ninguna API. */
(function () {
  function esc(s) { return LAB.esc(s); }
  var timers = [];
  function later(fn, ms) { var t = setTimeout(fn, ms); timers.push(t); return t; }
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }
  function hhmm() { var d = new Date(); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); }
  function fill(t, o) { return t.replace(/\{(\w+)\}/g, function (_, k) { return o[k] || ''; }); }

  function stepsHTML(list, state) {
    // state: número de pasos completados; -1 = ninguno; list.length = todos
    return '<ol class="steps">' + list.map(function (s, i) {
      var cls = i < state ? 'is-on' : (i === state ? 'is-working' : '');
      return '<li class="step ' + cls + '" data-step="' + i + '"><span class="tick" aria-hidden="true"></span><span>' + esc(s) + '</span></li>';
    }).join('') + '</ol>';
  }
  function animateSteps(rootSel, total, delay, onDone) {
    var i = 0;
    function tick() {
      var root = document.querySelector(rootSel); if (!root) return;
      var items = root.querySelectorAll('.step');
      items.forEach(function (el, k) {
        el.classList.toggle('is-on', k < i);
        el.classList.toggle('is-working', k === i);
      });
      if (i >= total) { onDone(); return; }
      i++; later(tick, delay);
    }
    tick();
  }
  function stage(num, title, body, cls) {
    return '<div class="stage ' + (cls || '') + '"><div class="stage-head"><span class="stage-num">' + num + '</span><span class="stage-title">' + esc(title) + '</span></div>' + body + '</div>';
  }
  function routeBanner(letter) {
    var r = LAB.currentResult(); if (!r) return '';
    if (letter === 'd') return '<div class="route-banner">Tu resultado: <strong>' + esc(r.area) + '</strong>. Marcamos en el flujo dónde está tu oportunidad.</div>';
    if (r.demo === letter) return '<div class="route-banner">Tu resultado: <strong>' + esc(r.area) + '</strong>. ' + esc(r.demoNota) + '</div>';
    var d = LAB.DEMOS[r.demo];
    return '<div class="route-banner">Tu resultado (' + esc(r.area) + ') se relaciona con la <a href="#/demos/' + r.demo + '">Demo ' + d.letra + ' · ' + esc(d.titulo) + '</a>.' + (letter ? ' Esta demo muestra otra parte del proceso.' : '') + '</div>';
  }
  function head(letter, intro) {
    var d = LAB.DEMOS[letter];
    return '<div class="demo-head"><div><span class="sim-badge">Demostración simulada</span>' +
      '<h1 class="h1">Demo ' + d.letra + ' · ' + esc(d.titulo) + '</h1><p>' + esc(intro) + '</p></div>' +
      '<div class="btn-row"><a class="btn btn-ghost btn-sm" href="#/demos">Todas las demos</a></div></div>' + routeBanner(letter);
  }
  function footer(note) {
    var hasResult = !!LAB.currentResult();
    return '<div class="demo-footer"><p class="small" style="margin:0;max-width:70ch">' + esc(note) + '</p>' +
      '<div class="btn-row">' + (hasResult ? '<a class="btn btn-primary btn-sm" href="#/resultado">Volver a mi resultado →</a>' : '') + '</div></div>';
  }
  function chrome(inner) { return LAB.chrome({ tag: 'Demostraciones', home: '#/demos' }, '<div class="shell">' + inner + '</div>'); }

  /* ================= Hub ================= */
  function hub() {
    var dd = LAB.DEMOS.d;
    var feature = '<a class="demo-feature" href="#/demos/d"><div><span class="demo-letter">D</span><h2 class="h2">' + esc(dd.titulo) + '</h2><p>' + esc(dd.resumen) + '</p><span class="go">Ver el sistema completo →</span></div>' +
      '<div class="mini-flow" aria-hidden="true">' + ['Anuncio', 'Landing', 'Mensaje', 'Agente', 'CRM', 'Seguimiento', 'Cita'].map(function (x, i) { return '<span style="--d:' + i + '">' + x + '</span>'; }).join('') + '</div></a>';
    var cards = ['a', 'b', 'c'].map(function (k) {
      var d = LAB.DEMOS[k];
      var rel = d.rutas.map(function (r) { return LAB.ROUTES[r].area; }).join(' · ');
      return '<a class="demo-card" href="#/demos/' + k + '"><span class="demo-letter">' + d.letra + '</span><h2 class="h3">' + esc(d.titulo) + '</h2><p>' + esc(d.resumen) + '</p><span class="rel">Para: ' + esc(rel) + '</span></a>';
    }).join('');
    var map = Object.keys(LAB.ROUTES).map(function (k) {
      var r = LAB.ROUTES[k], d = LAB.DEMOS[r.demo];
      return '<div class="map-row"><span>Resultado: ' + esc(r.area) + '</span><span><strong>Demo ' + d.letra + '</strong> · ' + esc(d.titulo) + '</span></div>';
    }).join('');
    return chrome('<section class="demo-hub"><span class="sim-badge">Demostraciones simuladas</span>' +
      '<h1 class="h1" style="margin-top:20px">Así trabajaría un agente en tu proceso.</h1>' +
      '<p class="lead">Cada demo muestra una parte del proceso: lo que entra, lo que hace el agente y lo que recibe tu equipo para revisar. Datos ficticios; no se envía nada.</p>' +
      routeBanner('') + feature + '<p class="eyebrow" style="margin-top:48px">Cada parte, de cerca</p><div class="demo-cards" style="margin-top:0">' + cards + '</div>' +
      '<div class="map-table">' + map + '</div></section>');
  }

  /* ================= Demo A ================= */
  var A = { sc: 0, phase: 'idle', editing: false, edited: null };
  function renderA() {
    var sc = LAB.DEMO_A[A.sc];
    var tabs = '<div class="scenario-tabs" role="tablist">' + LAB.DEMO_A.map(function (s, i) {
      return '<button class="tab" role="tab" aria-selected="' + (i === A.sc) + '" data-act="demoA_sc" data-i="' + i + '">' + esc(s.nombre) + '</button>';
    }).join('') + '</div>';
    var entrada = tabs + '<div class="msg"><div class="msg-meta"><span>' + esc(sc.remitente) + '</span><span>' + esc(sc.canal) + '</span></div>' + esc(sc.consulta) + '</div>' +
      (A.phase === 'idle' ? '<div class="btn-row" style="margin-top:18px"><button class="btn btn-primary" data-act="demoA_run">Procesar con el agente →</button></div>' : '');
    var stepState = A.phase === 'idle' ? -1 : (A.phase === 'running' ? 0 : sc.pasos.length);
    var trabajo = stepsHTML(sc.pasos, stepState);
    var resultado;
    if (A.phase === 'idle' || A.phase === 'running') {
      resultado = '<div class="stage-empty">Aquí aparecerá la respuesta en inglés con su traducción y la solicitud organizada para recepción.</div>';
    } else {
      var en = A.edited != null ? A.edited : sc.respuestaEN;
      resultado = '<div class="reveal">' +
        '<div class="out-block"><span class="out-label">Respuesta propuesta</span><div class="bi">' +
        '<div><span class="lang">EN · se enviaría</span><div class="out-card' + (A.phase === 'done' && !A.editing && A.edited == null ? ' type-reveal' : '') + '" id="respEN" ' + (A.editing ? 'contenteditable="true"' : '') + '>' + esc(en) + '</div></div>' +
        '<div><span class="lang">ES · traducción para el equipo</span><div class="out-card es-card">' + esc(sc.respuestaES) + '</div></div></div></div>' +
        '<div class="out-block"><span class="out-label">Solicitud organizada para recepción</span><div class="out-card"><table class="ficha">' +
        sc.ficha.map(function (f) { return '<tr><td>' + esc(f[0]) + '</td><td>' + esc(f[1]) + '</td></tr>'; }).join('') + '</table></div></div>' +
        '<div class="out-block"><span class="out-label">No respondió (pasa a una persona)</span><div class="out-card">' + esc(sc.noRespondio) + '</div></div>' +
        (A.phase === 'approved'
          ? '<div class="status-ok">Aprobada por recepción a las ' + hhmm() + '. Simulación: no se envió ningún mensaje.</div>'
          : '<div class="review"><p><strong>Revisión humana.</strong> Recepción lee la respuesta, la ajusta si hace falta y la aprueba. Nada sale sin esta confirmación.</p><div class="btn-row">' +
            '<button class="btn btn-primary btn-sm" data-act="demoA_ok">Aprobar respuesta</button>' +
            '<button class="btn btn-ghost btn-sm" data-act="demoA_edit">' + (A.editing ? 'Terminar edición' : 'Editar respuesta') + '</button></div></div>') +
        '</div>';
    }
    var cls2 = A.phase === 'running' ? 'is-active' : (A.phase === 'idle' ? '' : 'is-done');
    var cls3 = (A.phase === 'done' || A.phase === 'approved') ? 'is-active' : '';
    document.getElementById('demoBody').innerHTML = '<div class="pipeline pipeline-motion">' +
      stage(1, 'Entrada · consulta original', entrada, A.phase === 'idle' ? 'is-active' : 'is-done') +
      stage(2, 'Trabajo del agente', trabajo, cls2) +
      stage(3, 'Resultado para revisión', resultado, cls3) + '</div>' +
      '<div class="demo-footer" style="margin-top:16px"><button class="btn btn-quiet" data-act="demoA_reset">↺ Reiniciar demo</button></div>';
  }
  LAB.actions.demoA_sc = function (el) { clearTimers(); A = { sc: +el.getAttribute('data-i'), phase: 'idle', editing: false, edited: null }; renderA(); };
  LAB.actions.demoA_run = function () {
    A.phase = 'running'; renderA();
    animateSteps('#demoBody', LAB.DEMO_A[A.sc].pasos.length, 750, function () { A.phase = 'done'; renderA(); });
  };
  LAB.actions.demoA_edit = function () {
    if (A.editing) { var el = document.getElementById('respEN'); if (el) A.edited = el.textContent; A.editing = false; }
    else A.editing = true;
    renderA();
    if (A.editing) { var e2 = document.getElementById('respEN'); if (e2) e2.focus(); }
  };
  LAB.actions.demoA_ok = function () {
    var el = document.getElementById('respEN'); if (el && A.editing) A.edited = el.textContent;
    A.editing = false; A.phase = 'approved'; renderA();
  };
  LAB.actions.demoA_reset = function () { clearTimers(); A = { sc: A.sc, phase: 'idle', editing: false, edited: null }; renderA(); };

  /* ================= Demo B ================= */
  var B;
  function resetB(boardId) {
    var src = LAB.DEMO_B;
    B = { board: boardId || 'comercial', sel: null, phase: 'idle', msg: null, moved: null, log: [], cards: {} };
    Object.keys(src).forEach(function (k) {
      B.cards[k] = src[k].tarjetas.map(function (c) { return Object.assign({}, c, { aprobado: false }); });
    });
  }
  var B_PASOS = ['Lee el historial de la tarjeta.', 'Detecta si hay un pendiente y desde cuándo.', 'Revisa la etapa y quién es responsable.', 'Propone un mensaje con el contexto del caso.'];
  function renderB() {
    var cfg = LAB.DEMO_B[B.board], cards = B.cards[B.board];
    var tabs = '<div class="scenario-tabs" role="tablist">' + Object.keys(LAB.DEMO_B).map(function (k) {
      var b = LAB.DEMO_B[k];
      return '<button class="tab" role="tab" aria-selected="' + (k === B.board) + '" data-act="demoB_board" data-b="' + k + '">' + esc(b.nombre) + ' · ' + esc(b.descripcion) + '</button>';
    }).join('') + '</div>';
    var board = '<div class="board">' + cfg.etapas.map(function (et, i) {
      var list = cards.filter(function (c) { return c.etapa === i; });
      return '<div class="col"><div class="col-head"><span>' + esc(et) + '</span><span class="count">' + list.length + '</span></div>' +
        list.map(function (c) {
          var flag = c.aprobado ? '<span class="kflag done">Aprobado</span>' : (c.pendiente ? '<span class="kflag">Pendiente</span>' : '');
          return '<button class="kcard' + (B.moved === c.id ? ' moved' : '') + '" aria-pressed="' + (B.sel === c.id) + '" data-act="demoB_sel" data-id="' + c.id + '">' +
            '<span class="kname">' + esc(c.nombre) + '</span><span class="ktype">' + esc(c.tipo) + '</span><span class="kresp">' + esc(c.responsable) + '</span>' + flag + '</button>';
        }).join('') + '</div>';
    }).join('') + '</div>';

    var c = cards.filter(function (x) { return x.id === B.sel; })[0];
    var entrada, trabajo, resultado;
    if (!c) {
      entrada = '<div class="stage-empty">Selecciona una tarjeta del tablero.</div>';
      trabajo = stepsHTML(B_PASOS, -1);
      resultado = '<div class="stage-empty">Aquí aparecerá el pendiente y el mensaje propuesto.</div>';
    } else {
      entrada = '<div class="out-card"><strong>' + esc(c.nombre) + '</strong><br><span class="small">' + esc(c.tipo) + ' · Etapa: ' + esc(cfg.etapas[c.etapa]) + '</span>' +
        '<p style="margin:10px 0 0">' + esc(c.historial) + '</p></div>';
      trabajo = stepsHTML(B_PASOS, B.phase === 'running' ? 0 : B_PASOS.length);
      if (B.phase === 'running') resultado = '<div class="stage-empty">El agente está revisando la tarjeta…</div>';
      else if (c.aprobado) {
        resultado = '<div class="reveal status-ok">Mensaje aprobado. La tarjeta está en «' + esc(cfg.etapas[c.etapa]) + '». Siguiente paso: ' + esc(c.siguiente) + '</div>';
      } else if (!c.pendiente) {
        resultado = '<div class="reveal out-card">Sin pendientes. El agente no propone ningún mensaje: ' + esc(c.siguiente) + '</div>';
      } else {
        var last = c.etapa >= cfg.etapas.length - 1;
        resultado = '<div class="reveal">' +
          '<div class="out-block"><span class="out-label">Pendiente detectado</span><div class="out-card">' + esc(c.pendiente) + '</div></div>' +
          '<div class="out-block"><span class="out-label">' + (B.board === 'equipo' ? 'Mensaje propuesto al responsable' : 'Mensaje de seguimiento propuesto') + '</span>' +
          '<label class="small" for="bmsg" style="display:block;margin-bottom:6px">Puedes editarlo antes de aprobar.</label>' +
          '<textarea class="textarea" id="bmsg">' + esc(B.msg != null ? B.msg : c.mensaje) + '</textarea></div>' +
          '<div class="review"><p><strong>Revisión humana.</strong> Al aprobar, la tarjeta ' + (last ? 'queda marcada como resuelta' : 'pasa a «' + esc(cfg.etapas[c.etapa + 1]) + '»') + '. No se envía ningún mensaje real.</p>' +
          '<div class="btn-row"><button class="btn btn-primary btn-sm" data-act="demoB_ok">Aprobar mensaje</button></div></div></div>';
      }
    }
    var log = B.log.length ? '<div class="log">' + B.log.map(function (l) { return '<div>' + esc(l) + '</div>'; }).join('') + '</div>' : '';
    document.getElementById('demoBody').innerHTML = '<div class="board-wrap">' + tabs + board + '</div>' +
      '<div class="pipeline pipeline-motion">' +
      stage(1, 'Entrada · tarjeta seleccionada', entrada, c ? 'is-done' : 'is-active') +
      stage(2, 'Trabajo del agente', trabajo, B.phase === 'running' ? 'is-active' : (c ? 'is-done' : '')) +
      stage(3, 'Resultado para aprobar', resultado + log, c && B.phase !== 'running' ? 'is-active' : '') + '</div>' +
      '<div class="demo-footer" style="margin-top:16px"><button class="btn btn-quiet" data-act="demoB_reset">↺ Reiniciar tablero</button></div>';
    B.moved = null;
  }
  LAB.actions.demoB_board = function (el) { clearTimers(); B.board = el.getAttribute('data-b'); B.sel = null; B.phase = 'idle'; B.msg = null; renderB(); };
  LAB.actions.demoB_sel = function (el) {
    clearTimers();
    B.sel = el.getAttribute('data-id'); B.msg = null; B.phase = 'running'; renderB();
    animateSteps('.pipeline', B_PASOS.length, 450, function () { B.phase = 'done'; renderB(); });
  };
  LAB.actions.demoB_ok = function () {
    var cfg = LAB.DEMO_B[B.board];
    var c = B.cards[B.board].filter(function (x) { return x.id === B.sel; })[0]; if (!c) return;
    var ta = document.getElementById('bmsg'); B.msg = ta ? ta.value : null;
    var from = cfg.etapas[c.etapa];
    if (c.etapa < cfg.etapas.length - 1) c.etapa++;
    if (c.responsableNuevo) c.responsable = c.responsableNuevo;
    c.aprobado = true; B.moved = c.id;
    B.log.unshift(hhmm() + ' · ' + c.nombre + ': mensaje aprobado por el equipo · ' + from + ' → ' + cfg.etapas[c.etapa] + ' (simulación, no se envió nada)');
    renderB();
  };
  LAB.actions.demoB_reset = function () { clearTimers(); resetB(B.board); renderB(); };

  /* ================= Demo C ================= */
  var C = { esp: 'odontologia', pub: 'internacional', obj: 'confianza', phase: 'idle' };
  function selectHTML(id, label, list, val) {
    return '<div class="field"><label for="' + id + '">' + esc(label) + '</label><select id="' + id + '" data-c="' + id + '">' +
      list.map(function (o) { return '<option value="' + o.id + '"' + (o.id === val ? ' selected' : '') + '>' + esc(o.label) + '</option>'; }).join('') + '</select></div>';
  }
  function renderC() {
    var D = LAB.DEMO_C;
    var entrada = '<div class="picker">' + selectHTML('esp', 'Especialidad', D.especialidades, C.esp) +
      selectHTML('pub', 'Público', D.publicos, C.pub) + selectHTML('obj', 'Objetivo', D.objetivos, C.obj) +
      '<div class="btn-row"><button class="btn btn-primary" data-act="demoC_run"' + (C.phase === 'running' ? ' disabled' : '') + '>' + (C.phase === 'done' ? 'Generar de nuevo' : 'Generar propuesta') + ' →</button></div></div>';
    var trabajo = stepsHTML(D.pasos, C.phase === 'idle' ? -1 : (C.phase === 'running' ? 0 : D.pasos.length));
    var resultado;
    if (C.phase !== 'done') resultado = '<div class="stage-empty">Aquí aparecerán tres temas, un gancho, un guion breve y una llamada a la acción.</div>';
    else {
      var e = D.especialidades.filter(function (x) { return x.id === C.esp; })[0];
      var t = D.plantillas[C.obj][C.pub];
      resultado = '<div class="reveal">' +
        '<div class="out-block"><span class="out-label">Tres temas</span><div class="out-card"><ol class="topics">' + t.temas.map(function (x) { return '<li>' + esc(fill(x, e)) + '</li>'; }).join('') + '</ol></div></div>' +
        '<div class="out-block"><span class="out-label">Gancho</span><div class="out-card hook type-reveal">' + esc(fill(t.gancho, e)) + '</div></div>' +
        '<div class="out-block"><span class="out-label">Guion breve · tema 01</span><div class="out-card script">' + t.guion.map(function (x) { return '<p>' + esc(fill(x, e)) + '</p>'; }).join('') + '</div></div>' +
        '<div class="out-block"><span class="out-label">Llamada a la acción</span><div class="out-card"><strong>' + esc(fill(t.cta, e)) + '</strong></div></div>' +
        '<p class="warn">Pendiente de revisión profesional antes de publicar. Contenido educativo y administrativo general, sin promesas de resultados clínicos.</p>' +
        (C.pub === 'internacional' ? '<p class="small">Para público en EE.UU., el mismo guion se adapta al inglés después de la revisión.</p>' : '') +
        '</div>';
    }
    document.getElementById('demoBody').innerHTML = '<div class="pipeline pipeline-motion">' +
      stage(1, 'Entrada · tu caso', entrada, C.phase === 'idle' ? 'is-active' : 'is-done') +
      stage(2, 'Trabajo del agente', trabajo, C.phase === 'running' ? 'is-active' : (C.phase === 'done' ? 'is-done' : '')) +
      stage(3, 'Resultado para revisión', resultado, C.phase === 'done' ? 'is-active' : '') + '</div>';
  }
  LAB.actions.demoC_run = function () {
    clearTimers(); C.phase = 'running'; renderC();
    animateSteps('.pipeline', LAB.DEMO_C.pasos.length, 600, function () { C.phase = 'done'; renderC(); });
  };
  function onCChange(e) {
    var k = e.target.getAttribute && e.target.getAttribute('data-c'); if (!k) return;
    C[k] = e.target.value; if (C.phase === 'done') { C.phase = 'idle'; } clearTimers(); renderC();
    var el = document.getElementById(k); if (el) el.focus();
  }

  /* ================= Vista ================= */
  LAB.views.demos = function (letter) {
    clearTimers();
    if (!letter || !LAB.DEMOS[letter]) return { html: hub(), mount: null };
    if (letter === 'd') {
      return { html: chrome(head('d', 'Un negocio de salud ficticio, conectado de punta a punta: cómo llega un prospecto, qué hace el agente en cada paso y qué sigue haciendo tu equipo.') + '<div id="demoBody" class="demo-d"></div>' +
        footer('Simulación con un negocio ficticio. Ningún anuncio se publica y ningún mensaje se envía.')), mount: LAB.demoD.mount };
    }
    var intros = {
      a: 'Una persona escribe en inglés para pedir una cita. El agente prepara la respuesta administrativa, la traduce para el equipo y organiza la solicitud. Recepción revisa y confirma.',
      b: 'Un tablero con interesados y pendientes ficticios. Selecciona una tarjeta: el agente detecta qué falta y propone un mensaje. Al aprobarlo, la tarjeta avanza de etapa.',
      c: 'Elige una especialidad, un público y un objetivo. El agente propone temas, un gancho, un guion breve y una llamada a la acción para que un profesional los revise.'
    };
    var notes = {
      a: 'Simulación con datos ficticios. El agente no inventa disponibilidad, precios, diagnósticos ni recomendaciones médicas: esos temas siempre pasan a una persona.',
      b: 'Simulación con datos ficticios. No se envían mensajes reales: aprobar solo cambia la tarjeta de etapa dentro de esta pantalla.',
      c: 'Simulación con plantillas preparadas. Todo contenido pasa por revisión profesional antes de publicarse.'
    };
    var html = chrome(head(letter, intros[letter]) + '<div id="demoBody"></div>' + footer(notes[letter]));
    return {
      html: html,
      mount: function () {
        if (letter === 'a') { A = { sc: A.sc || 0, phase: 'idle', editing: false, edited: null }; renderA(); }
        if (letter === 'b') { resetB('comercial'); var r = LAB.currentResult(); if (r && r.routeId === 'operacion') B.board = 'equipo'; renderB(); }
        if (letter === 'c') { C.phase = 'idle'; renderC(); document.addEventListener('change', onCChange); }
        return function () { clearTimers(); document.removeEventListener('change', onCChange); };
      }
    };
  };
})();
