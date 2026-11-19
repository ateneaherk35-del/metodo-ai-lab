# MĒTODO / AI LAB

**Hospitalidad inteligente.** Laboratorio presencial para el Encuentro Binacional de Hospitalidad Médica · 19 de noviembre de 2026 · Tijuana.

Aplicación web estática. Funciona sin internet en las computadoras del stand, y publicada en GitHub Pages para que la gente la use desde su celular con el QR.

- **Diagnóstico** (6 preguntas) → **celular obligatorio** → resultado.
- **Demostraciones**: D · Negocio conectado (anuncio → landing → mensaje → agente → CRM → seguimiento → cita), A · Atención bilingüe, B · Seguimiento, C · Contenido.
- **Pantalla de exhibición** (TV): motion graphics en bucle con QR.
- Los contactos llegan a la hoja de Google **«MĒTODO AI LAB · Contactos (Encuentro Binacional 2026)»** en tu Drive.

---

## 1. Lista para mañana

- [ ] **Conectar la hoja de Google** (sección 2). Sin esto, los celulares capturados desde el QR no llegan a ningún lado.
- [ ] Confirmar que la app publicada abre: `https://ateneaherk35-del.github.io/metodo-ai-lab/`
- [ ] Desde tu celular: escanea el QR (en `#/qr` o en la TV), haz un diagnóstico de prueba y revisa que aparezca la fila en la hoja.
- [ ] Copia esta carpeta a **las dos computadoras** y arráncala (sección 3).
- [ ] En cada computadora, entra a `#/operador` y escribe el nombre del dispositivo ("Computadora 1" / "Computadora 2").
- [ ] TV en pantalla extendida con `#/pantalla` (sección 5). Activa *No molestar*.
- [ ] (Opcional) Logo maestro en `assets/logo-metodo.svg` (ver `assets/LEEME-logo.txt`).
- [ ] Al cierre: revisa la hoja y exporta el CSV de respaldo en las dos computadoras.

---

## 2. Conectar la hoja de Google (una vez, ~3 minutos)

1. Abre en tu Drive la hoja **«MĒTODO AI LAB · Contactos (Encuentro Binacional 2026)»**.
2. Menú **Extensiones → Apps Script**.
3. Borra lo que haya, pega todo el contenido de `apps-script/Codigo.gs` y guarda.
4. **Implementar → Nueva implementación → ⚙ → Aplicación web**.
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier usuario**
5. **Implementar** → **Autorizar acceso** → elige tu cuenta → *Configuración avanzada* → *Ir a … (no seguro)* → **Permitir**. Google muestra esa advertencia en cualquier script nuevo; es tu propio script.
6. Copia la **URL de la aplicación web** (termina en `/exec`).
7. Ponla en `js/data.js`, en `contactEndpoint: '…'`, y vuelve a publicar. Para el stand también puedes pegarla en `#/operador → Google Sheet`.

**Cómo funciona:** cada diagnóstico agrega una fila con fecha, origen (Computadora 1/2 o «QR · celular»), nombre, celular, organización, correo, ruta, respuestas, consentimientos y si pidió seguimiento. Si no hay internet en el momento, la app guarda el envío y lo reintenta sola cada 30 segundos y cuando vuelve la conexión. Si se reintenta, la fila no se duplica.

---

## 3. Arrancar en las computadoras del stand

**Mac:** doble clic en `Iniciar-Mac.command` (la primera vez: clic derecho → Abrir → Abrir). No cierres la ventana de Terminal.
**Windows:** doble clic en `Iniciar-Windows.bat`. No cierres la ventana negra.
**Sin Python:** el script abre `index.html` directo; la app funciona igual.

Se abre `http://localhost:8787/`. En cada computadora usa **siempre la misma forma de abrir la app**: el navegador guarda el respaldo local por dirección.

Si en el lugar hay internet, también puedes usar la versión publicada en las computadoras. La versión local es tu plan B si falla la red.

---

## 4. Rutas

| Ruta | Para qué |
|---|---|
| `#/` | Pantalla inicial con los modos |
| `#/diagnostico` | Diagnóstico (computadora 1 y celulares vía QR) |
| `#/datos` | Paso obligatorio: nombre, celular y aviso de privacidad |
| `#/resultado` | Resultado del visitante |
| `#/demos` · `#/demos/d` · `#/demos/a` · `#/demos/b` · `#/demos/c` | Demostraciones (computadora 2) |
| `#/pantalla` | Modo TV en bucle |
| `#/qr` | QR grande para mostrar o imprimir |
| `#/operador` | Panel de operador (no enlazado desde el recorrido del visitante) |

---

## 5. Televisión como pantalla extendida

**Windows:** conecta la TV → **Windows + P → Extender** → abre una ventana nueva (Ctrl + N) en `#/pantalla` → arrástrala a la TV → tecla **F** o botón **Pantalla completa**.
**Mac:** Ajustes del Sistema → Pantallas → TV como pantalla **extendida** (sin duplicar) → ventana nueva (Cmd + N) en `#/pantalla` → arrástrala a la TV → **F**.

En la TV: espacio = pausa · ← → = anterior/siguiente · F = pantalla completa. Los controles se ocultan solos. El QR aparece en la esquina de cada pantalla y en grande al final del bucle (unos 84 segundos por vuelta).

Secuencia: Hospitalidad inteligente → la pregunta → tu negocio conectado → atención bilingüe → seguimiento → contenido → QR.

---

## 6. Operación durante el evento

| Resultado | Demo específica | Demo general |
|---|---|---|
| Adquisición | C · Contenido | D marca: Anuncio y Landing |
| Contenido | C · Contenido | D marca: Anuncio y Landing |
| Atención | A · Atención bilingüe | D marca: Mensaje y Agente |
| Seguimiento | B · Interesados | D marca: CRM y Seguimiento |
| Operación | B · Pendientes del equipo | D marca: CRM y Cita |

- **Celular obligatorio:** nadie ve su resultado sin dejar nombre, celular y aceptar el aviso de privacidad. Las promociones van en una casilla aparte, opcional.
- **«Sí, quiero platicarlo con MĒTODO»** (al final del resultado) marca la fila como *Quiere seguimiento = Sí*. Esos son tus prospectos calientes.
- **Nuevo visitante** borra la pantalla para la siguiente persona.
- **Panel de operador:** estado de la conexión con la hoja, envíos pendientes y **Reintentar envío**, respaldo local, exportación a CSV y eliminación. No tiene contraseña real: no lo dejes abierto.

---

## 7. Logo, textos y aviso de privacidad

- **Logo:** copia el SVG maestro (versión para fondo oscuro) como `assets/logo-metodo.svg`. Mientras no exista, se ve el texto provisional «MĒTODO».
- **Textos:** todo el contenido está en `js/data.js` (preguntas, rutas, demos, aviso, URL pública, URL de la hoja).
- **Aviso de privacidad:** `LAB.AVISO` en `js/data.js`. Es un aviso simplificado. Revísalo y, si tienes un correo de contacto oficial, agrégalo como medio para ejercer derechos ARCO.

---

## 8. Qué funciona (verificado)

Probado en Chrome de escritorio y en celular (390 px), con servidor local y abriendo `index.html` sin internet:

- Las 5 rutas; las 7,500 combinaciones de respuestas generan un resultado completo.
- Atrás sin perder respuestas, progreso guardado, reinicio y «Nuevo visitante».
- Celular obligatorio con validación, aviso de privacidad y casilla de promociones aparte.
- Envío a la hoja (probado contra un servidor de prueba con el mismo formato que el Apps Script), sin duplicados al reintentar, y con «Quiere seguimiento».
- Demo D animada e interactiva, y las demos A, B y C.
- TV con 7 pantallas animadas en bucle, QR, pausa, avanzar y pantalla completa.
- Descarga e impresión del resumen, panel de operador y CSV.
- El QR se genera dentro de la app, sin servicios externos.

## 9. Pendiente

1. **Conectar la hoja de Google** (sección 2) y poner la URL en `contactEndpoint`. Es el único paso que no se puede hacer sin tu cuenta.
2. Probar el QR desde un iPhone y un Android antes de abrir el stand.
3. Logo SVG y revisión del aviso de privacidad.

## 10. Estructura

```
index.html · LEEME.md · Iniciar-Mac.command · Iniciar-Windows.bat
css/styles.css
js/data.js        contenido, configuración y aviso
js/store.js       guardado local
js/engine.js      reglas del diagnóstico
js/sync.js        envío a Google Sheets con reintento + QR
js/app.js         recorrido, datos obligatorios, resultado, resumen, QR
js/demos.js       demos A, B, C y catálogo
js/demo-d.js      demo D · negocio conectado
js/pantalla.js    modo TV
js/operador.js    panel de operador
js/vendor/qrcode.js  generador de QR (MIT, Kazuhiko Arase)
apps-script/Codigo.gs  código para la hoja de Google
assets/           logo y fuentes
```
