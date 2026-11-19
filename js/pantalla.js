/* MĒTODO / AI LAB — Modo televisión (/pantalla).
   Presentación automática con motion graphics, silenciosa y en bucle. 16:9.
   No lee datos de visitantes. Cada pantalla se vuelve a dibujar al mostrarse para reiniciar sus animaciones. */
(function () {
  function esc(s) { return LAB.esc(s); }

  var FLOW = ['Anuncio', 'Landing', 'Mensaje', 'Agente IA', 'CRM', 'Seguimiento', 'Cita'];

  function words(text, cls, delay, step) {
    return text.split(' ').map(function (w, i) {
      return '<span class="w ' + (cls || '') + '"><span style="animation-delay:' + (delay + i * step).toFixed(2) + 's">' + w + '</span></span>';
    }).join(' ');
  }

  var SLIDES = [
    { dur: 9000, html: function () {
      var orbit = ['Anuncios', 'Landing', 'WhatsApp', 'Agente IA', 'CRM', 'Seguimiento'];
      return '<div class="t-hero"><div class="t-center">' +
        '<p class="t-eyebrow" style="animation-delay:.2s">MĒTODO / AI LAB · ' + esc(LAB.CONFIG.ciudad) + '</p>' +
        '<h1 class="t-mega">' + words('Hospitalidad', '', .4, .1) + '<br>' + words('inteligente.', 'accent-w', .75, .1) + '</h1>' +
        '<p class="t-sub" style="animation-delay:1.6s">Marketing y experiencia para el paciente internacional, con IA.</p>' +
        '<div class="t-underline"></div></div>' +
        '<div class="t-orbit" aria-hidden="true"><i class="ring r1"></i><i class="ring r2"></i><i class="ring r3"></i><span class="core">IA</span>' +
        '<div class="spin">' + orbit.map(function (o, i) { return '<b style="--a:' + (i * 60) + 'deg;--d:' + (1.2 + i * .2).toFixed(1) + 's"><em>' + o + '</em></b>'; }).join('') + '</div></div></div>';
    } },
    { dur: 10000, html: function () {
      return '<div class="t-left">' +
        '<p class="t-eyebrow" style="animation-delay:.1s">Una pregunta</p>' +
        '<h2 class="t-big">' + words('¿Qué proceso de tu negocio necesita dejar de depender de', '', .3, .14) +
        ' <span class="hl"><span class="hl-bar"></span>' + words('tareas manuales?', '', 1.95, .14) + '</span></h2>' +
        '<div class="t-chips">' + ['Mensajes sin responder', 'Citas por confirmar', 'Interesados olvidados', 'Contenido que no sale'].map(function (c, i) {
          return '<span style="animation-delay:' + (3.2 + i * .35) + 's">' + c + '</span>';
        }).join('') + '</div></div>';
    } },
    { dur: 14000, html: function () {
      var n = FLOW.length, w = 1600, h = 520, pts = [];
      for (var i = 0; i < n; i++) { var x = 90 + i * ((w - 180) / (n - 1)); var y = 300 + Math.sin(i * 0.9) * 120; pts.push([x, y]); }
      var d = 'M' + pts.map(function (p) { return p[0].toFixed(0) + ' ' + p[1].toFixed(0); }).join(' L');
      var nodes = pts.map(function (p, i) {
        var dl = (0.6 + i * 0.55).toFixed(2);
        return '<g class="eco-node" style="animation-delay:' + dl + 's"><circle cx="' + p[0] + '" cy="' + p[1] + '" r="46" class="eco-halo" style="animation-delay:' + dl + 's"/>' +
          '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="34" class="eco-dot"/>' +
          '<text x="' + p[0] + '" y="' + (p[1] + 7) + '" class="eco-num">' + String(i + 1).padStart(2, '0') + '</text>' +
          '<text x="' + p[0] + '" y="' + (p[1] + (i % 2 ? -64 : 84)) + '" class="eco-label">' + FLOW[i] + '</text></g>';
      }).join('');
      return '<div class="t-eco">' +
        '<div class="t-eco-head"><span class="t-tag">Ejemplo simulado</span><h2 class="t-title">' + words('Tu negocio, conectado.', '', .1, .12) + '</h2>' +
        '<p class="t-sub" style="animation-delay:.8s">Del primer anuncio a la cita, sin que nadie pierda el hilo.</p></div>' +
        '<svg class="eco" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="xMidYMid meet" aria-hidden="true">' +
        '<defs><linearGradient id="ecoG" x1="0" x2="1"><stop offset="0" stop-color="#3F75FF"/><stop offset="1" stop-color="#B5AEFF"/></linearGradient>' +
        '<filter id="glow"><feGaussianBlur stdDeviation="8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>' +
        '<path d="' + d + '" class="eco-track"/><path id="ecoPath" d="' + d + '" class="eco-line" pathLength="1"/>' +
        nodes +
        '<circle r="11" class="eco-particle" filter="url(#glow)" opacity="0"><set attributeName="opacity" to="1" begin="4.4s"/><animateMotion dur="3.6s" begin="4.4s" repeatCount="indefinite" rotate="auto"><mpath href="#ecoPath"/></animateMotion></circle>' +
        '<circle r="7" class="eco-particle p2" filter="url(#glow)" opacity="0"><set attributeName="opacity" to="1" begin="6.2s"/><animateMotion dur="3.6s" begin="6.2s" repeatCount="indefinite"><mpath href="#ecoPath"/></animateMotion></circle>' +
        '</svg></div>';
    } },
    { dur: 13000, html: function () {
      return '<div class="t-split">' +
        '<div><span class="t-tag">Ejemplo simulado</span><h2 class="t-title">' + words('Atención bilingüe', '', .1, .12) + '</h2>' +
        '<p class="t-sub" style="animation-delay:.6s">Una pregunta en inglés se convierte en una solicitud organizada para recepción. Una persona confirma.</p></div>' +
        '<div class="t-phone-stage"><div class="t-phone"><div class="t-phone-top"><span class="av">J</span><div><b>Jordan</b><small>WhatsApp · 10:42 p.m.</small></div></div>' +
        '<div class="t-bubble in" style="animation-delay:1s">How do I book a first appointment, and what do I need to bring?</div>' +
        '<div class="t-reply"><div class="t-typing"><i></i><i></i><i></i></div>' +
        '<div class="t-bubble out" style="animation-delay:4.4s">Hi Jordan! Please share your full name and two or three dates. Our front desk will confirm availability with you.</div></div>' +
        '<div class="t-flag" style="animation-delay:5.6s">Traducido al español para el equipo</div></div>' +
        '<div class="t-ficha" style="animation-delay:6.6s"><span class="k">Ficha para recepción</span>' +
        '<div><span>Idioma</span><b>Inglés</b></div><div><span>Solicitud</span><b>Primera cita</b></div><div><span>Falta</span><b>Fechas preferidas</b></div><div><span>Siguiente paso</span><b>Confirmar disponibilidad</b></div>' +
        '<div class="t-ok" style="animation-delay:8.6s">✓ Revisado por recepción</div></div></div></div>';
    } },
    { dur: 13000, html: function () {
      return '<div class="t-split">' +
        '<div><span class="t-tag">Ejemplo simulado</span><h2 class="t-title">' + words('Seguimiento', '', .1, .12) + '</h2>' +
        '<p class="t-sub" style="animation-delay:.6s">Ningún interesado se queda sin respuesta. El agente propone el mensaje; tu equipo lo aprueba.</p></div>' +
        '<div class="t-kanban-stage"><div class="t-kanban">' +
        '<div class="t-col"><span class="h">Contactado</span><div class="t-card">Médico que refiere<small>Falta contacto de asistente</small></div><div class="t-card hot">Agencia de turismo médico<small>6 días sin respuesta</small></div></div>' +
        '<div class="t-col"><span class="h">En seguimiento</span><div class="t-card">Convenio empresarial<small>Propuesta enviada</small></div><div class="t-slot"></div></div>' +
        '<div class="t-col"><span class="h">Cita</span><div class="t-card">Aliado de hospedaje<small>Respuesta el viernes</small></div></div></div>' +
        '<div class="t-toast"><span class="k">El agente propone</span><p>“Hola, ¿pudiste revisar la información con tu equipo? Si te sirve, agendamos una llamada corta.”</p><b class="t-approve">Aprobar</b></div>' +
        '<div class="t-cursor"></div></div></div>';
    } },
    { dur: 12000, html: function () {
      return '<div class="t-split">' +
        '<div><span class="t-tag">Ejemplo simulado</span><h2 class="t-title">' + words('Contenido', '', .1, .12) + '</h2>' +
        '<p class="t-sub" style="animation-delay:.6s">La experiencia de tu equipo, convertida en temas y guiones. Un profesional revisa antes de publicar.</p></div>' +
        '<div class="t-content">' +
        '<div class="t-input" style="animation-delay:.9s"><span>Odontología</span><span>Paciente internacional</span><span>Generar confianza</span></div>' +
        '<div class="t-cards">' +
        '<div class="t-ccard c1"><span class="k">Tema</span><p>Cómo es tu valoración dental si vienes desde Estados Unidos, paso a paso.</p></div>' +
        '<div class="t-ccard c2"><span class="k">Gancho</span><p class="type">Si vas a cruzar la frontera para atenderte, esto es lo que deberías saber antes de elegir con quién.</p></div>' +
        '<div class="t-ccard c3"><span class="k">Guion · 4 líneas</span><p>Nos escribes → te pedimos datos administrativos → confirmamos tu cita → llegas sabiendo qué esperar.</p><b class="t-review">Pendiente de revisión profesional</b></div>' +
        '</div></div></div>';
    } },
    { dur: 13000, qrBig: true, html: function () {
      var url = LAB.qrURL();
      return '<div class="t-cta">' +
        '<div><p class="t-eyebrow" style="animation-delay:.1s">MĒTODO / AI LAB</p>' +
        '<h2 class="t-big">' + words('Descubre qué automatizar primero.', '', .2, .12) + '</h2>' +
        '<p class="t-sub" style="animation-delay:1.3s">Escanea con la cámara de tu celular. Diagnóstico de 3 minutos.</p>' +
        '<p class="t-arrow" style="animation-delay:1.8s">o acércate y prueba el laboratorio</p></div>' +
        (url ? '<div class="t-qr"><div class="t-qr-inner">' + LAB.qrSVG(url) + '<span class="scan"></span></div><i class="c tl"></i><i class="c tr"></i><i class="c bl"></i><i class="c br"></i></div>' : '') +
        '</div>';
    } }
  ];

  LAB.views.pantalla = function () {
    var url = LAB.qrURL();
    var html = '<div class="tv tv2" id="tv">' +
      '<div class="tv-bg"><i class="orb o1"></i><i class="orb o2"></i><i class="orb o3"></i><i class="grid"></i></div>' +
      '<div class="tv-progress">' + SLIDES.map(function () { return '<span><i></i></span>'; }).join('') + '</div>' +
      '<div class="tv-paused" id="tvPaused" hidden>En pausa</div>' +
      '<div class="tv-controls" aria-label="Controles">' +
      '<button data-tv="prev" aria-label="Anterior">←</button><button data-tv="pause" id="tvPause">Pausar</button>' +
      '<button data-tv="next" aria-label="Siguiente">→</button><button data-tv="fs" id="tvFs">Pantalla completa</button>' +
      '<button data-tv="exit" aria-label="Salir del modo TV">Salir</button></div>' +
      SLIDES.map(function (s, i) { return '<section class="slide2" data-i="' + i + '"></section>'; }).join('') +
      '<div class="tv-brand">' + LAB.logoHTML() + '<span class="brand-sep"></span><span class="brand-lab">AI Lab</span></div>' +
      (url ? '<div class="tv-miniqr" id="tvMiniQR"><div>' + LAB.qrSVG(url) + '</div><span>Escanea<br>y pruébalo</span></div>' : '') +
      '</div>';

    function mount() {
      var tv = document.getElementById('tv');
      var slideEls = tv.querySelectorAll('.slide2');
      var bars = tv.querySelectorAll('.tv-progress span');
      var mini = document.getElementById('tvMiniQR');
      var idx = 0, elapsed = 0, last = performance.now(), paused = false, raf = null, idleT = null;

      function show(i) {
        idx = (i + SLIDES.length) % SLIDES.length; elapsed = 0;
        slideEls.forEach(function (el, k) {
          if (k === idx) { el.innerHTML = SLIDES[k].html(); void el.offsetWidth; el.classList.add('is-on'); }
          else if (el.classList.contains('is-on')) {
            el.classList.remove('is-on');
            (function (e2) { setTimeout(function () { if (!e2.classList.contains('is-on')) e2.innerHTML = ''; }, 1100); })(el);
          }
        });
        bars.forEach(function (b, k) { b.classList.toggle('done', k < idx); b.querySelector('i').style.width = k < idx ? '100%' : '0'; });
        if (mini) mini.classList.toggle('hide', !!SLIDES[idx].qrBig || idx === 0);
        if (paused) setPaused(true);
      }
      function loop(now) {
        var dt = now - last; last = now;
        if (!paused && !document.hidden) {
          elapsed += dt;
          var d = SLIDES[idx].dur;
          bars[idx].querySelector('i').style.width = Math.min(100, (elapsed / d) * 100) + '%';
          if (elapsed >= d) show(idx + 1);
        }
        raf = requestAnimationFrame(loop);
      }
      function setPaused(p) {
        paused = p;
        document.getElementById('tvPause').textContent = p ? 'Reanudar' : 'Pausar';
        document.getElementById('tvPaused').hidden = !p;
        tv.classList.toggle('paused', p);
        var svg = tv.querySelector('.slide2.is-on svg.eco');
        if (svg && svg.pauseAnimations) { if (p) svg.pauseAnimations(); else svg.unpauseAnimations(); }
      }
      function fs() {
        var d = document;
        if (!d.fullscreenElement && !d.webkitFullscreenElement) {
          var el = d.documentElement; (el.requestFullscreen || el.webkitRequestFullscreen || function () {}).call(el);
        } else (d.exitFullscreen || d.webkitExitFullscreen || function () {}).call(d);
      }
      function onFs() { var b = document.getElementById('tvFs'); if (b) b.textContent = document.fullscreenElement ? 'Salir de pantalla completa' : 'Pantalla completa'; }
      function wake() {
        document.body.classList.remove('idle');
        clearTimeout(idleT); idleT = setTimeout(function () { document.body.classList.add('idle'); }, 2500);
      }
      function onClick(e) {
        var b = e.target.closest('[data-tv]'); if (!b) return;
        var a = b.getAttribute('data-tv');
        if (a === 'prev') show(idx - 1);
        if (a === 'next') show(idx + 1);
        if (a === 'pause') setPaused(!paused);
        if (a === 'fs') fs();
        if (a === 'exit') { if (document.fullscreenElement) fs(); LAB.go('/'); }
      }
      function onKey(e) {
        wake();
        if (e.key === ' ' || e.key === 'k') { e.preventDefault(); setPaused(!paused); }
        else if (e.key === 'ArrowRight') show(idx + 1);
        else if (e.key === 'ArrowLeft') show(idx - 1);
        else if (e.key === 'f' || e.key === 'F') fs();
      }
      tv.addEventListener('click', onClick);
      document.addEventListener('keydown', onKey);
      document.addEventListener('mousemove', wake);
      document.addEventListener('fullscreenchange', onFs);
      show(0); wake(); raf = requestAnimationFrame(loop);
      LAB._tvShow = show;
      return function () {
        cancelAnimationFrame(raf); clearTimeout(idleT);
        document.removeEventListener('keydown', onKey);
        document.removeEventListener('mousemove', wake);
        document.removeEventListener('fullscreenchange', onFs);
        document.body.classList.remove('idle');
        LAB._tvShow = null;
      };
    }
    return { html: html, mount: mount };
  };
  LAB.TV_SLIDES = SLIDES;
})();
