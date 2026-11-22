# MindTech

Plataforma web demostrativa para el seguimiento del bienestar emocional. Construida con React, Vite y Recharts.

## Requisitos
- Node.js 18 o superior
- npm

## Instalación
```bash
npm install
npm run dev
```
Abre la dirección local que muestra Vite (normalmente http://localhost:5173).

## Compilar para producción
```bash
npm run build
npm run preview
```

## Publicar en GitHub
1. Crea un repositorio nuevo en GitHub llamado `mindtech`.
2. Descomprime este proyecto y abre una terminal en esta carpeta.
3. Ejecuta:
```bash
git init
git add .
git commit -m "Primer lanzamiento de MindTech"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/mindtech.git
git push -u origin main
```
4. Reemplaza `TU-USUARIO` por tu usuario de GitHub.

## Publicar en GitHub Pages
Puedes usar Vercel o Netlify para publicar la aplicación fácilmente. Para GitHub Pages será necesario configurar la ruta base de Vite según el nombre del repositorio.

## Alcance y privacidad
Esta versión es un prototipo frontend. Los datos de demostración se guardan en el almacenamiento local del navegador (`localStorage`) y no se sincronizan entre dispositivos. No incluye autenticación real, servidor ni base de datos. No introduzcas información personal sensible.

Las evaluaciones son orientativas, no constituyen diagnósticos ni sustituyen la atención de profesionales de salud. Si necesitas ayuda, consulta a un profesional. Ante una emergencia o riesgo inmediato, contacta los servicios de emergencia de tu localidad.
