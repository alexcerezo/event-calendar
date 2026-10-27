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

## Datos y privacidad

Los eventos de `src/events.js` son ejemplos ficticios, no una agenda verificada.
La demo se sitúa en octubre de 2026. La exportación `.ics` identifica los eventos
como demostraciones. Publicar evento permite descargar una propuesta JSON;
no envía ni publica datos. No hay backend ni registro.

Los guardados y el tema se conservan en `localStorage` del navegador. La web
usa Google Fonts para las tipografías y Pravatar para los avatares decorativos;
estos recursos requieren conexión a Internet. El resto de las ilustraciones es
CSS local.