#!/bin/bash
# MĒTODO / AI LAB — arranque en Mac. Doble clic (la primera vez: clic derecho → Abrir).
cd "$(dirname "$0")"
PORT=8787
if python3 -c "import sys" >/dev/null 2>&1; then
  echo ""
  echo "  MĒTODO / AI LAB corriendo en http://localhost:$PORT/"
  echo "  No cierres esta ventana mientras uses la app."
  echo ""
  (sleep 1.5; open "http://localhost:$PORT/") &
  python3 -m http.server $PORT --bind 127.0.0.1
else
  echo "No se encontró Python 3. Abriendo la app directamente (también funciona sin servidor)."
  open "index.html"
fi
