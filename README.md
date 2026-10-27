# event-calendar

## Meetup Málaga

Próximos eventos de [Meetup](https://www.meetup.com/) en un radio de ~16 millas alrededor de Málaga:

- `data/meetup-malaga.json` – listado de eventos (título, fecha, grupo, lugar, enlace).
- `data/meetup-malaga.ics` – calendario iCalendar para importar en Google Calendar, Outlook, etc.

Para actualizar los datos (por defecto, los próximos 35 días):

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\fetch-meetup-malaga.ps1 -Days 35
```
