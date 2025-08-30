## Emprende San José – Backend (Node.js + Express + EJS)

Backend de una aplicación Express con motor de vistas EJS. El flujo de trabajo incluye colocar primero tus archivos HTML, CSS y JS en `src/views`, luego ejecutar tres scripts de migración/arreglo de rutas en orden, y finalmente levantar el servidor como en cualquier proyecto Node.

### Requisitos
- Node.js 18+ (ES Modules habilitado por `"type": "module"`)
- npm 9+
- MongoDB en local (por defecto `mongodb://localhost:27017/EmprendeSanJose`)

### Instalación rápida
1) Clona el repositorio y entra al directorio del proyecto.
2) Instala dependencias:
```bash
npm install
```
3) Crea un archivo `.env` (opcional pero recomendado):
```bash
# Puerto del servidor (por defecto 3000)
PORT=3000

# Secreto de sesión (cámbialo en producción)
SESSION_SECRET=your-secret-here

# Entorno
NODE_ENV=development

# Mongo db uri
MONGO_URI=mongodb://localhost:27017/EmprendeSanJose
```
4) Asegúrate de tener MongoDB levantado en tu máquina (o ajusta la conexión en `src/db.js`).

### Migración de HTML a EJS y corrección de rutas (tus pasos)
El proyecto incluye tres scripts para automatizar la conversión y normalización de rutas. Ejecútalos desde la raíz del proyecto en este orden:

1) Coloca tus archivos en `src/views/` manteniendo tu estructura (por ejemplo: `src/views/index.html`, `src/views/css/*`, `src/views/js/*`, `src/views/imgs/*`).

2) Convierte los `.html` a `.ejs` manteniendo referencias y estructura:
```bash
node scripts/automation_paths_to_ejs.js
```

3) Normaliza rutas a assets (CSS, JS, imgs) dentro de archivos `.html` y `.ejs`:
```bash
node scripts/change_directories_in_css_and_js.js
```

4) Limpia rutas de links y includes eliminando prefijos y extensiones `.html`:
```bash
node scripts/change_link_directories_html.js
```

Antes de ejecutar los scripts, se recomienda respaldar tus vistas. Los scripts modifican archivos dentro de `src/views` de forma recursiva.

### Ejecutar en desarrollo
```bash
npm run dev
```
Luego visita: `http://localhost:3000`

### Scripts de npm
- `npm run dev`: inicia el servidor con `nodemon` apuntando a `src/app.js`.

### Estructura principal
```
src/
  app.js                    # Arranque del servidor, middlewares y registro de rutas
  config/
    server.js               # Configuración de Express, vistas EJS y estáticos
    session.js              # Configuración de sesión
  routes/                   # Rutas: auth, rol, transport, entrepreneurship, announcement, report
  views/                    # Vistas EJS + assets (css, js, imgs)
  db.js                     # Conexión a MongoDB (local por defecto)
scripts/
  automation_paths_to_ejs.js
  change_directories_in_css_and_js.js
  change_link_directories_html.js
```

### Rutas base registradas
- `/auth`
- `/rol`
- `/transport`
- `/entrepreneurship`
- `/announcement`
- `/report`

Los detalles de cada endpoint se encuentran en los archivos dentro de `src/routes/`.

### Archivos estáticos
El servidor sirve estáticos desde `src/views` en estas rutas públicas:
- `/css` → `src/views/css`
- `/js` → `src/views/js`
- `/imgs` → `src/views/imgs`

### Notas y problemas comunes
- Si cambias la estructura de `src/views`, vuelve a ejecutar los scripts de normalización en el mismo orden.
- Asegúrate de que MongoDB esté corriendo localmente o ajusta la cadena de conexión en `src/db.js`.
- Define `SESSION_SECRET` en producción y usa `NODE_ENV=production` para cookies seguras.

### Licencia
ISC
