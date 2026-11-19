/**
 * MĒTODO / AI LAB — recibe los contactos de la app y los guarda en la hoja
 * "MĒTODO AI LAB · Contactos (Encuentro Binacional 2026)".
 *
 * Instalación (una sola vez, ~3 minutos):
 * 1. Abre la hoja en Google Drive → menú Extensiones → Apps Script.
 * 2. Borra lo que haya en el editor, pega TODO este archivo y guarda (icono de disco).
 * 3. Botón azul "Implementar" → "Nueva implementación" → engrane → "Aplicación web".
 *      Ejecutar como: Yo
 *      Quién tiene acceso: Cualquier usuario
 *    → Implementar → Autorizar acceso (elige tu cuenta → Configuración avanzada →
 *      Ir a … (no seguro) → Permitir). Es tu propio script; Google muestra esa advertencia
 *      a todos los scripts nuevos.
 * 4. Copia la "URL de la aplicación web" (termina en /exec) y pásasela a Claude,
 *    o pégala en el panel de operador de la app (#/operador).
 */

var COLUMNAS = ['Fecha', 'Origen', 'Nombre', 'Celular', 'Organización', 'Correo', 'Ruta',
  'Tipo de organización', 'Función', 'Proceso', 'Herramientas', 'Frecuencia', 'Objetivo 90 días',
  'Acepta aviso', 'Acepta promociones', 'Quiere seguimiento', 'ID',
  'Ticket promedio', 'Solicitudes al mes', 'Dinero en riesgo al mes (MXN)'];
var COL_SEGUIMIENTO = 16, COL_ID = 17;

function hoja_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheets()[0];
  if (sh.getLastRow() === 0) sh.appendRow(COLUMNAS);
  else if (sh.getLastColumn() < COLUMNAS.length) sh.getRange(1, 1, 1, COLUMNAS.length).setValues([COLUMNAS]);
  return sh;
}

function texto_(v) {
  v = v == null ? '' : String(v).slice(0, 300);
  return /^[=+\-@]/.test(v) ? "'" + v : v; // evita fórmulas inyectadas
}

function buscarFila_(sh, id) {
  var n = sh.getLastRow() - 1;
  if (n < 1 || !id) return -1;
  var ids = sh.getRange(2, COL_ID, n, 1).getValues();
  for (var i = 0; i < ids.length; i++) if (String(ids[i][0]) === String(id)) return i + 2;
  return -1;
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    var d = JSON.parse(e.postData.contents);
    var sh = hoja_();
    var fila = buscarFila_(sh, d.id);
    if (d.tipo === 'seguimiento') {
      if (fila > 0) sh.getRange(fila, COL_SEGUIMIENTO).setValue('Sí');
      return json_({ ok: true, actualizado: fila > 0 });
    }
    if (fila > 0) return json_({ ok: true, duplicado: true }); // reintento: no duplicar
    var fecha = d.fecha ? new Date(d.fecha) : new Date();
    sh.appendRow([
      fecha, texto_(d.dispositivo), texto_(d.nombre), "'" + String(d.celular || '').slice(0, 20), texto_(d.organizacion),
      texto_(d.correo), texto_(d.ruta), texto_(d.tipoOrganizacion), texto_(d.funcion), texto_(d.proceso),
      texto_(d.herramientas), texto_(d.frecuencia), texto_(d.objetivo), texto_(d.aviso), texto_(d.promos),
      texto_(d.quiereSeguimiento || 'No'), texto_(d.id),
      texto_(d.ticket), texto_(d.volumen), Number(d.riesgoMensual) || ''
    ]);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return json_({ ok: true, servicio: 'MĒTODO AI LAB' });
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
