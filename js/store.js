/* Almacenamiento local seguro: si localStorage no está disponible,
   se usa memoria (se pierde al recargar) y se avisa en el panel de operador. */
(function () {
  var mem = {};
  var ok = true;
  try {
    var k = '__metodo_test__';
    window.localStorage.setItem(k, '1');
    window.localStorage.removeItem(k);
  } catch (e) { ok = false; }

  function get(key, fallback) {
    try {
      var raw = ok ? window.localStorage.getItem(key) : mem[key];
      return raw == null ? fallback : JSON.parse(raw);
    } catch (e) { return fallback; }
  }
  function set(key, value) {
    var raw = JSON.stringify(value);
    try { if (ok) window.localStorage.setItem(key, raw); else mem[key] = raw; return true; }
    catch (e) { mem[key] = raw; return false; }
  }
  function remove(key) {
    try { if (ok) window.localStorage.removeItem(key); } catch (e) {}
    delete mem[key];
  }

  var KEYS = {
    session: 'metodo.lab.session.v1',
    contacts: 'metodo.lab.contacts.v1',
    settings: 'metodo.lab.settings.v1',
    stats: 'metodo.lab.stats.v1'
  };

  LAB.store = {
    persistent: ok,
    KEYS: KEYS,
    get: get, set: set, remove: remove,

    session: function () { return get(KEYS.session, { answers: {}, counted: false }); },
    saveSession: function (s) { set(KEYS.session, s); },
    clearSession: function () { remove(KEYS.session); },

    settings: function () {
      var s = get(KEYS.settings, {});
      if (!s.deviceName) s.deviceName = 'Computadora 1';
      if (s.captureEnabled === undefined) s.captureEnabled = true;
      return s;
    },
    saveSettings: function (s) { set(KEYS.settings, s); },

    contacts: function () { return get(KEYS.contacts, []); },
    saveContacts: function (list) { return set(KEYS.contacts, list); },

    stats: function () { return get(KEYS.stats, { completados: 0, porRuta: {}, exportadoEn: null }); },
    saveStats: function (s) { set(KEYS.stats, s); }
  };

  /* ¿Estamos en un entorno local (stand) o en un sitio publicado?
     La captura de contactos solo se permite en local mientras no exista backend. */
  LAB.isLocalContext = function () {
    var h = location.hostname;
    if (location.protocol === 'file:') return true;
    if (h === 'localhost' || h === '127.0.0.1' || h === '::1' || h === '[::1]' || h === '') return true;
    if (/^10\./.test(h) || /^192\.168\./.test(h) || /^172\.(1[6-9]|2\d|3[01])\./.test(h)) return true;
    return false;
  };

  LAB.captureState = function () {
    var s = LAB.store.settings();
    if (LAB.CONFIG.contactEndpoint) return { enabled: true, mode: 'backend' };
    if (!LAB.isLocalContext()) return { enabled: false, reason: 'publicado' };
    if (!s.captureEnabled) return { enabled: false, reason: 'operador' };
    return { enabled: true, mode: 'local' };
  };
})();
