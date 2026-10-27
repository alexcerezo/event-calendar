# málaga.dev

Agenda de la comunidad tecnológica de Málaga, con vistas de tarjetas y calendario,
filtros por tipo, búsqueda, eventos guardados y temas claro y oscuro.

## Desarrollo

Requiere Node.js 20.19+ o 22.12+.

```sh
npm install
npm run dev
```

`npm run build` genera la web estática en `dist`. `npm run preview` permite
previsualizarla y `npm test` comprueba los filtros.

## GitHub Pages

En **Settings > Pages > Build and deployment > Source**, selecciona
**GitHub Actions**. El workflow `.github/workflows/deploy-pages.yml` ejecuta las
pruebas, compila con Vite y publica exclusivamente `dist` al actualizar `main`.
También se puede lanzar manualmente desde Actions.

No publiques la raíz del repositorio con **Deploy from a branch**: el HTML
fuente carga `/src/main.js` y necesita la compilación de Vite. Publicarlo
directamente provoca un 404 y deja la página en blanco. La compilación usa rutas
relativas para funcionar tanto en `/event-calendar/` como en un dominio propio.

## Datos y privacidad

Los eventos de `src/events.js` son ejemplos ficticios, no una agenda verificada.
La demo se sitúa en octubre de 2026. La exportación `.ics` identifica los eventos
como demostraciones. Publicar evento permite descargar una propuesta JSON;
no envía ni publica datos. No hay backend ni registro.

Los guardados y el tema se conservan en `localStorage` del navegador. La web
usa Google Fonts para las tipografías y Pravatar para los avatares decorativos;
estos recursos requieren conexión a Internet. El resto de las ilustraciones es
CSS local.

## Meetup Málaga

Próximos eventos de [Meetup](https://www.meetup.com/) en un radio de ~16 millas alrededor de Málaga:

- `data/meetup-malaga.json` – listado de eventos (título, fecha, grupo, lugar, enlace).
- `data/meetup-malaga.ics` – calendario iCalendar para importar en Google Calendar, Outlook, etc.

Para actualizar los datos (por defecto, los próximos 35 días):

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\fetch-meetup-malaga.ps1 -Days 35
```
