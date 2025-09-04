@echo off
echo === Instalando dependencias del proyecto NUAM ===

cd frontend
echo Instalando dependencias de Next.js...
npm install

echo.
echo === Instalación completada ===
echo Para ejecutar en desarrollo:
echo   cd frontend
echo   npm run dev
echo.
echo Para hacer build:
echo   cd frontend  
echo   npm run build
echo.
pause
