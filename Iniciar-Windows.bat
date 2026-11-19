@echo off
REM MeTODO / AI LAB - arranque en Windows. Doble clic.
cd /d "%~dp0"
set PORT=8787
set PY=
where py >nul 2>nul
if %errorlevel%==0 set PY=py
if "%PY%"=="" (
  python -c "import sys" >nul 2>nul
  if not errorlevel 1 set PY=python
)
if "%PY%"=="" goto sinpython
echo.
echo   MeTODO / AI LAB corriendo en http://localhost:%PORT%/
echo   No cierres esta ventana mientras uses la app.
echo.
start "" powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep 2; Start-Process http://localhost:%PORT%/"
%PY% -m http.server %PORT% --bind 127.0.0.1
goto :eof
:sinpython
echo No se encontro Python. Abriendo la app directamente (tambien funciona sin servidor).
start "" "%~dp0index.html"
pause
