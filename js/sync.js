/* MĒTODO / AI LAB — envío de contactos a Google Sheets (Apps Script) con cola de reintento,
   y generador de QR local (sin internet). */
(function () {
  var QKEY = 'metodo.lab.queue.v1';

  LAB.endpoint = function () {
    if (LAB.CONFIG.contactEndpoint) return LAB.CONFIG.contactEndpoint;
    var s = LAB.store.settings();
    return s.endpoint || '';
  };

  function queue() { return LAB.store.get(QKEY, []); }
  function saveQueue(q) { LAB.store.set(QKEY, q); }

  function markLocal(id, field, value) {
    var list = LAB.store.contacts(), ch = false;
    list.forEach(function (c) { if (c.id === id) { c[field] = value; ch = true; } });
    if (ch) LAB.store.saveContacts(list);
  }

  function post(url, payload) {
    var body = JSON.stringify(payload);
    var ctrl = window.AbortController ? new AbortController() : null;
    var t = setTimeout(function () { if (ctrl) ctrl.abort(); }, 9000);
    return fetch(url, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: body, redirect: 'follow', signal: ctrl ? ctrl.signal : undefined })
      .then(function (r) { clearTimeout(t); if (!r.ok) throw new Error('HTTP ' + r.status); return r.json().catch(function () { return { ok: true }; }); })
      .then(function (j) { if (j && j.ok === false) throw new Error(j.error || 'rechazado'); return 'confirmado'; })
      .catch(function (err) {
        clearTimeout(t);
        if (err && err.name === 'AbortError') throw err;
        // Si el navegador bloquea la lectura de la respuesta (CORS), se envía igual sin confirmación.
        return fetch(url, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: body })
          .then(function () { return 'enviado'; });
      });
  }

  var flushing = null;
  LAB.sync = {
    pending: function () { return queue().length; },
    enqueue: function (payload) {
      if (!payload._k) payload._k = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
      var q = queue(); q.push(payload); saveQueue(q);
      return LAB.sync.flush();
    },
    flush: function () {
      if (flushing) return flushing;
      var url = LAB.endpoint();
      if (!url || !navigator.onLine && navigator.onLine !== undefined) return Promise.resolve({ sent: 0, left: queue().length });
      flushing = (function loop(sent) {
        var q = queue(); if (!q.length) return Promise.resolve({ sent: sent, left: 0 });
        var item = q[0];
        return post(url, item).then(function (estado) {
          var rest = queue().filter(function (x) { return x._k !== item._k; });
          saveQueue(rest);
          if (item.tipo === 'contacto') markLocal(item.id, 'enviado', estado === 'confirmado' ? 'Sí' : 'Sí (sin confirmación)');
          if (item.tipo === 'seguimiento') markLocal(item.id, 'seguimientoEnviado', 'Sí');
          return loop(sent + 1);
        }).catch(function () { return { sent: sent, left: queue().length, error: true }; });
      })(0).then(function (r) { flushing = null; return r; }, function (e) { flushing = null; throw e; });
      return flushing;
    }
  };

  // Reintentos automáticos
  window.addEventListener('online', function () { LAB.sync.flush(); });
  setInterval(function () { if (queue().length) LAB.sync.flush(); }, 30000);
  setTimeout(function () { if (queue().length) LAB.sync.flush(); }, 1500);

  /* ---------- QR ---------- */
  LAB.qrURL = function () {
    var base = LAB.CONFIG.urlPublica || '';
    return base ? base.replace(/\/?$/, '/') + '#/diagnostico' : '';
  };
  LAB.qrSVG = function (text, opts) {
    opts = opts || {};
    if (!text || typeof qrcode === 'undefined') return '';
    var qr = qrcode(0, 'M'); qr.addData(text); qr.make();
    var n = qr.getModuleCount(), q = 2, size = n + q * 2, d = '';
    for (var r = 0; r < n; r++) for (var c = 0; c < n; c++) if (qr.isDark(r, c)) d += 'M' + (c + q) + ' ' + (r + q) + 'h1v1h-1z';
    var fg = opts.fg || '#10141D', bg = opts.bg || '#F3F6FC';
    return '<svg class="qr-svg" viewBox="0 0 ' + size + ' ' + size + '" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" role="img" aria-label="Código QR">' +
      '<rect width="' + size + '" height="' + size + '" fill="' + bg + '"/><path d="' + d + '" fill="' + fg + '"/></svg>';
  };
})();
