/* MĒTODO / AI LAB — Panel de operador (#/operador).
   No está enlazado desde el recorrido del visitante. No tiene contraseña:
   cualquiera que conozca la ruta puede abrirlo. Úsalo solo en las computadoras del stand. */
(function () {
  function esc(s) { return LAB.esc(s); }
  var COLS = [
    ['fecha', 'Fecha'], ['dispositivo', 'Dispositivo'], ['nombre', 'Nombre'], ['organizacion', 'Organización'],
    ['celular', 'Celular'], ['correo', 'Correo'], ['aviso', 'Acepta aviso'], ['promos', 'Acepta promociones'], ['quiereSeguimiento', 'Quiere seguimiento'], ['enviado', 'Enviado a Google Sheet'],
    ['ruta', 'Ruta'], ['tipoOrganizacion', 'Tipo de organización'], ['funcion', 'Función'], ['proceso', 'Proceso'],
    ['herramientas', 'Herramientas actuales'], ['frecuencia', 'Frecuencia'], ['objetivo', 'Objetivo 90 días'], ['ticket', 'Ticket promedio'], ['volumen', 'Solicitudes al mes'], ['riesgoMensual', 'Dinero en riesgo al mes (MXN)'], ['id', 'ID']
  ];
  function fmt(iso) {
    try { return new Date(iso).toLocaleString('es-MX', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }); } catch (e) { return iso; }
  }
  function csv(list) {
    var q = function (v) { v = String(v == null ? '' : v); if (/^[=+\-@]/.test(v)) v = "'" + v; return '"' + v.replace(/"/g, '""') + '"'; };
    var rows = [COLS.map(function (c) { return q(c[1]); }).join(',')];
    list.forEach(function (r) { rows.push(COLS.map(function (c) { return q(c[0] === 'fecha' ? fmt(r.fecha) : r[c[0]]); }).join(',')); });
    return '﻿' + rows.join('\r\n');
  }

  function view() {
    var st = LAB.store.settings(), list = LAB.store.contacts(), stats = LAB.store.stats();
    var ep = LAB.endpoint(), pend = LAB.sync.pending();
    var sinExportar = list.filter(function (c) { return !stats.exportadoEn || c.fecha > stats.exportadoEn; }).length;
    var rutas = Object.keys(LAB.ROUTES).map(function (k) {
      return '<div class="map-row"><span>' + esc(LAB.ROUTES[k].area) + '</span><span>' + (stats.porRuta[k] || 0) + '</span></div>';
    }).join('');
    var rows = list.slice().reverse().map(function (c) {
      return '<tr><td>' + esc(fmt(c.fecha)) + '</td><td>' + esc(c.dispositivo) + '</td><td>' + esc(c.nombre) + '</td><td>' + esc(c.organizacion) + '</td><td>' + esc(c.celular) + '</td><td>' + esc(c.ruta) + '</td><td>' + esc(c.quiereSeguimiento) + '</td><td>' + esc(c.enviado) + '</td>' +
        '<td><button class="btn btn-danger btn-sm" data-act="opDelete" data-id="' + esc(c.id) + '">Eliminar</button></td></tr>';
    }).join('');

    return LAB.chrome({ tag: 'Operador', home: '#/operador' },
      '<section class="shell" style="padding-top:40px">' +
      '<p class="eyebrow">Solo para el equipo</p><h1 class="h1">Panel de operador</h1>' +
      '<div class="op-warning"><strong>Este panel no tiene contraseña real.</strong> Cualquiera que conozca la dirección puede abrirlo. Ciérralo después de usarlo y no lo dejes visible para visitantes.</div>' +
      (LAB.store.persistent ? '' : '<div class="op-warning" style="margin-top:12px"><strong>Este navegador no permite guardar datos de forma permanente</strong> (modo incógnito o almacenamiento bloqueado). Los contactos se perderán al recargar. Abre la app en una ventana normal.</div>') +

      '<div class="op-grid">' +
      '<div class="stat"><div class="n">' + list.length + '</div><div class="l">Contactos guardados en este dispositivo</div></div>' +
      '<div class="stat"><div class="n">' + sinExportar + '</div><div class="l">Sin exportar desde el último respaldo' + (stats.exportadoEn ? ' (' + esc(fmt(stats.exportadoEn)) + ')' : '') + '</div></div>' +
      '<div class="stat"><div class="n">' + (stats.completados || 0) + '</div><div class="l">Diagnósticos completados aquí (conteo local, sin datos personales)</div></div>' +
      '</div>' +

      '<div class="panel" style="margin-top:20px"><h2 class="h3">Respaldo</h2>' +
      '<p>Además de la hoja de Google, cada computadora guarda un respaldo en su navegador. <strong>La otra computadora tiene su propia lista</strong>: exporta las dos. Si se borra el historial del navegador o se cambia de navegador, los contactos se pierden. Exporta al terminar cada bloque de visitas y al cierre del día.</p>' +
      '<div class="btn-row"><button class="btn btn-primary" data-act="opExport"' + (list.length ? '' : ' disabled') + '>Exportar CSV</button>' +
      '<button class="btn btn-danger" data-act="opDeleteAll"' + (list.length ? '' : ' disabled') + '>Eliminar todos</button></div></div>' +

      '<div class="panel" style="margin-top:20px"><h2 class="h3">Google Sheet</h2>' +
      (ep ? '<p>Conectado. Cada contacto se envía a tu hoja en cuanto hay internet. <strong>Pendientes de envío en este dispositivo: ' + pend + '</strong>.</p>'
          : '<p><strong>Sin conectar.</strong> Los contactos se guardan solo en este dispositivo. Pega aquí la URL de la implementación de Apps Script (termina en /exec).</p>') +
      (LAB.CONFIG.contactEndpoint ? '' : '<div class="field" style="max-width:640px;margin-bottom:12px"><label for="op-endpoint">URL de Apps Script</label><input type="text" id="op-endpoint" value="' + esc(st.endpoint || '') + '" placeholder="https://script.google.com/macros/s/…/exec"></div>') +
      '<div class="btn-row">' + (LAB.CONFIG.contactEndpoint ? '' : '<button class="btn btn-ghost btn-sm" data-act="opSave">Guardar URL</button>') +
      (ep ? '<button class="btn btn-ghost btn-sm" data-act="opFlush"' + (pend ? '' : ' disabled') + '>Reintentar envío</button>' : '') + '</div></div>' +

      '<div class="panel" style="margin-top:20px"><h2 class="h3">Este dispositivo</h2>' +
      '<div class="form" style="max-width:520px"><div class="field"><label for="op-device">Nombre del dispositivo (aparece en la hoja y el CSV)</label>' +
      '<input type="text" id="op-device" value="' + esc(st.deviceName) + '" maxlength="40"></div>' +
      '<div class="btn-row"><button class="btn btn-ghost btn-sm" data-act="opSave">Guardar ajustes</button>' +
      '<a class="btn btn-quiet btn-sm" href="#/qr">Ver QR</a></div></div></div>' +

      '<h2 class="h3" style="margin-top:40px">Contactos</h2>' +
      (list.length
        ? '<div class="table-wrap"><table class="table"><thead><tr><th>Fecha</th><th>Dispositivo</th><th>Nombre</th><th>Organización</th><th>Celular</th><th>Ruta</th><th>Quiere seguimiento</th><th>Google Sheet</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div>'
        : '<p class="muted" style="margin-top:12px">Todavía no hay contactos guardados en este dispositivo.</p>') +

      '<h2 class="h3" style="margin-top:40px">Diagnósticos por ruta</h2><div class="map-table" style="margin-top:12px">' + rutas + '</div>' +
      '<div class="btn-row" style="margin-top:20px"><button class="btn btn-ghost btn-sm" data-act="opResetStats">Reiniciar conteo</button>' +
      '<button class="btn btn-ghost btn-sm" data-act="nuevoVisitante">Borrar diagnóstico en pantalla</button>' +
      '<a class="btn btn-quiet btn-sm" href="#/">Salir del panel</a></div>' +
      '</section>');
  }

  LAB.actions.opExport = function () {
    var list = LAB.store.contacts(); if (!list.length) return;
    var st = LAB.store.settings();
    var d = new Date(), stamp = d.getFullYear() + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0') + '-' + String(d.getHours()).padStart(2, '0') + String(d.getMinutes()).padStart(2, '0');
    var dev = st.deviceName.replace(/[^\w-]+/g, '-').replace(/^-|-$/g, '') || 'dispositivo';
    LAB.download('contactos-ai-lab-' + dev + '-' + stamp + '.csv', csv(list), 'text/csv;charset=utf-8');
    var stats = LAB.store.stats(); stats.exportadoEn = new Date().toISOString(); LAB.store.saveStats(stats);
    LAB.toast('CSV exportado. Guárdalo también fuera de esta computadora.');
    LAB.render();
  };
  LAB.actions.opDelete = function (el) {
    var id = el.getAttribute('data-id');
    var c = LAB.store.contacts().filter(function (x) { return x.id === id; })[0]; if (!c) return;
    LAB.modal({
      title: '¿Eliminar este contacto?', body: '<p>' + esc(c.nombre) + ' · ' + esc(c.celular) + '. Esta acción no se puede deshacer.</p>',
      confirm: 'Eliminar', danger: true,
      onConfirm: function () { LAB.store.saveContacts(LAB.store.contacts().filter(function (x) { return x.id !== id; })); LAB.render(); LAB.toast('Contacto eliminado'); }
    });
  };
  LAB.actions.opDeleteAll = function () {
    var n = LAB.store.contacts().length;
    LAB.modal({
      title: '¿Eliminar los ' + n + ' contactos?',
      body: '<p>Exporta el CSV antes si no lo has hecho. Para confirmar, escribe <strong>BORRAR</strong>.</p><div class="field" style="margin-bottom:20px"><input type="text" id="confirmText" autocomplete="off" aria-label="Escribe BORRAR"></div>',
      confirm: 'Eliminar todos', danger: true,
      onConfirm: function (w) {
        var v = (w.querySelector('#confirmText').value || '').trim().toUpperCase();
        if (v !== 'BORRAR') { w.querySelector('#confirmText').focus(); return false; }
        LAB.store.saveContacts([]); LAB.render(); LAB.toast('Contactos eliminados de este dispositivo');
      }
    });
  };
  LAB.actions.opSave = function () {
    var st = LAB.store.settings();
    var dv = document.getElementById('op-device'); if (dv) st.deviceName = (dv.value || '').trim() || 'Computadora 1';
    var epi = document.getElementById('op-endpoint'); if (epi) st.endpoint = epi.value.trim();
    LAB.store.saveSettings(st); LAB.render(); LAB.toast('Ajustes guardados');
  };
  LAB.actions.opFlush = function () {
    LAB.toast('Enviando…');
    LAB.sync.flush().then(function (r) { LAB.render(); LAB.toast(r && r.left ? 'Quedan ' + r.left + ' pendientes. Revisa la conexión.' : 'Todo enviado'); });
  };
  LAB.actions.opResetStats = function () {
    LAB.modal({
      title: '¿Reiniciar el conteo de diagnósticos?', body: '<p>No afecta a los contactos guardados.</p>', confirm: 'Reiniciar', danger: true,
      onConfirm: function () { var s = LAB.store.stats(); s.completados = 0; s.porRuta = {}; LAB.store.saveStats(s); LAB.render(); }
    });
  };

  LAB.views.operador = function () { return { html: view(), mount: null }; };
})();
