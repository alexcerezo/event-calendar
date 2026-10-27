import './style.css';
import { categories, events, filterEvents } from './events.js';

const paths = {
  arrow: '<path d="M7 17 17 7M7 7h10v10"/>',
  right: '<path d="m9 5 7 7-7 7"/>',
  left: '<path d="m15 5-7 7 7 7"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
  moon: '<path d="M20.5 13A9 9 0 0 1 11 3.5 9 9 0 1 0 20.5 13Z"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  users: '<circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3m1-16a3 3 0 0 1 0 6m2 4a5 5 0 0 1 3 5"/>',
  code: '<path d="m8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18"/>',
  mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2m-7 9v3m-4 0h8"/>',
  coffee: '<path d="M4 8h13v9a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4Zm13 1h2a3 3 0 1 1 0 6h-2M7 2v3m4-3v3m4-3v3"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  bookmark: '<path d="M6 3h12v18l-6-4-6 4Z"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18m-12 4h.01M12 15h.01M16 15h.01"/>',
  list: '<path d="M9 5h12M9 12h12M9 19h12M3 5h1M3 12h1M3 19h1"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0l-1 1-1-1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
};
const icon = (name, cls = '') => `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.code}</svg>`;
const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const date = (value) => new Date(`${value}T12:00:00`);
const shortDate = (value) => date(value).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }).replace('.', '');
const fullDate = (value) => date(value).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
function readSaved() {
  try {
    const value = JSON.parse(localStorage.getItem('malaga-saved') || '[]');
    return Array.isArray(value) ? value.filter((id) => typeof id === 'string') : [];
  } catch { return []; }
}
const state = { category: 'all', query: '', day: '', savedOnly: false, saved: readSaved(), view: 'grid', month: new Date(2026, 9, 1) };

function artwork(type) {
  const contents = {
    ai: '<div class="art-label">MÁLAGA AI / MEETUP #08</div><div class="ai-orbit orbit-one"></div><div class="ai-orbit orbit-two"></div><div class="ai-orbit orbit-three"></div><div class="ai-core">✳</div><span class="art-bottom">HUMAN IDEAS. ARTIFICIAL INTELLIGENCE.</span>',
    react: '<div class="art-label">MÁLAGA JS PRESENTS</div><div class="react-atom"><i></i><i></i><i></i><b></b></div><div class="react-copy">React<br><span>& cañas.</span></div><span class="art-bottom">GOOD CODE. BETTER COMPANY.</span>',
    design: '<div class="art-label">MAKE IT REAL.</div><div class="design-shapes"><i></i><i></i><i></i><i></i><i></i></div><div class="design-copy">Design.<br>Build. Repeat.</div><span class="art-bottom">FIGMA → CODE</span>',
    coffee: '<div class="art-label">OFFLINE IS THE NEW ONLINE</div><div class="coffee-drawing">☕</div><div class="coffee-copy">hello,<br>community<span>_</span></div><span class="art-bottom">LESS SCROLLING. MORE CONNECTING.</span>',
    cloud: '<div class="art-label">CLOUD NATIVE MÁLAGA</div><div class="cloud-drawing">{ ☁ }</div><div class="cloud-copy">There is<br>no localhost.</div><span class="art-bottom">BUILD. SHIP. SCALE.</span>',
    security: '<div class="art-label">MÁLAGA HACKERS / LAB 01</div><div class="security-copy">&gt; hello, hacker<span>_</span></div><div class="security-grid"></div><span class="art-bottom">STAY CURIOUS. THINK DIFFERENT.</span>',
  };
  return `<div class="event-art art-${type}" aria-hidden="true">${contents[type]}</div>`;
}

document.querySelector('#app').innerHTML = `
  <header class="site-header"><div class="header-inner">
    <a class="brand" href="#" aria-label="málaga.dev, inicio"><span class="brand-mark">&gt;_</span><span>málaga<span class="brand-dot">.</span>dev</span></a>
    <nav aria-label="Navegación principal"><a href="#eventos" class="nav-link active">Explorar eventos</a><button class="nav-link" data-action="community">La comunidad ${icon('arrow')}</button></nav>
    <div class="header-actions"><button class="theme-toggle icon-button" data-action="theme" aria-label="Cambiar a modo oscuro"></button><span class="header-divider"></span><button class="button button-dark submit-event" data-action="submit">${icon('plus')} Publicar evento</button></div>
  </div></header>
  <main>
    <section class="hero page-width">
      <div class="hero-content"><div class="eyebrow"><span class="status-dot"></span> EL SUR TAMBIÉN ES TECH</div>
        <h1>Menos scroll.<br>Más <span class="accent-word">conexiones<svg viewBox="0 0 560 20" preserveAspectRatio="none" aria-hidden="true"><path d="M3 14Q270-4 555 9M24 19Q300 4 530 15"/></svg></span>.</h1>
        <p>Lo mejor de la tecnología pasa cerca de ti.<br>Descubre eventos, comparte ideas y encuentra tu tribu en Málaga.</p>
        <div class="hero-bottom"><div class="avatar-stack" aria-hidden="true"><img src="https://i.pravatar.cc/80?img=47" alt="" /><img src="https://i.pravatar.cc/80?img=12" alt="" /><img src="https://i.pravatar.cc/80?img=49" alt="" /><span>&gt;_</span></div><span>Gente curiosa. <strong>Ideas que conectan.</strong></span></div>
      </div>
      <div class="hero-visual" aria-hidden="true"><div class="visual-grid"></div><span class="visual-coordinate top-coordinate">36.7213° N · 4.4214° W</span><div class="pixel-spark"><span></span><i></i><b></b><em></em></div><div class="floating-tag tag-code">${icon('code')} code, meet, repeat</div><div class="floating-tag tag-location">${icon('pin')} Málaga, Spain <span>☀</span></div><span class="visual-coordinate bottom-coordinate">BUILT FOR REAL-LIFE CONNECTIONS ↗</span><span class="visual-star">+</span></div>
    </section>
    <div class="ticker"><div class="ticker-inner"><span>COMUNIDAD LOCAL</span><b>✳</b><span>MENTALIDAD ABIERTA</span><b>✳</b><span>IDEAS SIN LÍMITES</span><b>✳</b><span>DEL CÓDIGO A LAS CAÑAS</span><b>✳</b><span>MUCHO MÁS QUE NETWORKING</span><b>✳</b><span>COMUNIDAD LOCAL</span><b>✳</b></div></div>
    <section class="events-section page-width" id="eventos">
      <div class="section-heading"><div><div class="eyebrow muted-eyebrow">// TU PRÓXIMO PLAN</div><h2>Fuera de la pantalla<span class="brand-dot">.</span></h2></div><label class="search-box">${icon('search')}<input id="search" type="search" placeholder="Busca un tema, evento, comunidad..." aria-label="Buscar eventos" /><kbd>/</kbd></label></div>
      <div class="filter-row"><div class="category-filters" role="group" aria-label="Filtrar por tipo">${categories.map((category) => `<button class="filter-chip ${category.id === 'all' ? 'selected' : ''}" data-category="${category.id}" aria-pressed="${category.id === 'all'}">${icon(category.icon)}${category.label}</button>`).join('')}</div><button class="saved-filter" data-action="saved" aria-pressed="false">${icon('bookmark')}<span>Guardados</span><span id="saved-count">0</span></button></div>
      <div class="content-layout"><div class="events-main"><div class="results-toolbar"><div><span class="live-dot"></span><span id="results-count"></span><button id="clear-day" hidden data-action="clear-day"></button></div><div class="view-switch" role="group" aria-label="Vista de eventos"><button data-view="grid" class="selected" aria-label="Vista de tarjetas" aria-pressed="true">${icon('grid')}</button><button data-view="calendar" aria-label="Vista de calendario" aria-pressed="false">${icon('calendar')}</button></div></div><div id="events-results" aria-live="polite"></div><div class="demo-note">${icon('code')} Modo demo · Eventos de ejemplo para explorar la comunidad.</div></div>
      <aside class="sidebar"><section class="calendar-panel"><div class="calendar-title"><h3 id="month-label"></h3><div><button class="icon-button" data-action="previous-month" aria-label="Mes anterior">${icon('left')}</button><button class="icon-button" data-action="next-month" aria-label="Mes siguiente">${icon('right')}</button></div></div><div class="calendar-weekdays">${['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day) => `<span>${day}</span>`).join('')}</div><div id="mini-calendar" class="mini-calendar"></div><div class="calendar-legend"><span></span> Hay algo interesante este día</div><button class="calendar-reset" data-action="today">Volver a octubre ${icon('right')}</button></section>
      <section class="community-card"><div class="community-top"><span class="terminal-icon">&gt;_</span><span>BETTER TOGETHER</span><span>↗</span></div><h3>Tu gente está aquí.</h3><p>No importa tu stack, tu experiencia o de dónde vengas. Hay un sitio para ti.</p><div class="community-tags"><span>#developers</span><span>#designers</span><span>#curiosos</span></div><button data-action="community">Conoce las comunidades ${icon('arrow')}</button><div class="community-pixels" aria-hidden="true">▗ ▟ ▙ ▖</div></section>
      <a class="suggestion-link" href="#publicar" data-action="submit"><span>¿Echas de menos algún evento?<br><strong>Ayúdanos a ponerlo en el mapa.</strong></span>${icon('arrow')}</a></aside></div>
    </section>
    <section class="bottom-cta page-width"><div><span class="eyebrow">// HECHO AQUÍ, PARA TODOS</span><h2>La próxima gran idea<br>empieza con un «hola».</h2><p>Sal de casa. Aprende algo. Conoce a alguien.</p></div><div class="cta-right"><span class="cta-spark" aria-hidden="true">✳</span><span>MÁLAGA TIENE MUCHO QUE COMPARTIR.</span></div></section>
  </main>
  <footer class="page-width"><a class="brand footer-brand" href="#"><span class="brand-mark">&gt;_</span><span>málaga.dev</span></a><span>Hecho con ${icon('heart')} y mucho sol en Málaga.</span><button data-action="about">Un proyecto de la comunidad ${icon('arrow')}</button><span class="footer-version">v.01 / 2026</span></footer>
  <dialog id="modal"><div id="modal-content"></div></dialog><div class="toast" id="toast" role="status"></div>
`;

function renderCard(event) {
  const category = categories.find((item) => item.id === event.category);
  const saved = state.saved.includes(event.id);
  return `<article class="event-card"><button class="art-button" data-event="${event.id}" aria-label="Ver ${escape(event.title)}">${artwork(event.art)}<span class="date-badge"><strong>${date(event.date).getDate()}</strong><span>${date(event.date).toLocaleDateString('es', { month: 'short' }).replace('.', '').toUpperCase()}</span></span></button><div class="card-body"><div class="card-meta"><span class="category-label category-${event.category}"><span></span>${category.label === 'Meetups' ? 'Meetup' : category.label === 'Workshops' ? 'Workshop' : category.label === 'Conferencias' ? 'Conferencia' : category.label}</span><span class="free-label">Entrada libre</span></div><h3><button data-event="${event.id}">${escape(event.title)}</button></h3><div class="event-detail">${icon('clock')}<span>${fullDate(event.date).split(',')[0]} · ${event.time} h</span></div><div class="event-detail">${icon('pin')}<span>${escape(event.venue)}</span></div><div class="event-tags">${event.tags.map((tag) => `<span>${escape(tag)}</span>`).join('')}</div></div><div class="card-footer"><div class="organizer"><span class="organizer-avatar host-${event.art}">${event.initials}</span><span>${escape(event.host)}</span></div><button class="bookmark-button ${saved ? 'is-saved' : ''}" data-save="${event.id}" aria-label="${saved ? 'Quitar de guardados' : 'Guardar evento'}: ${escape(event.title)}" aria-pressed="${saved}">${icon('bookmark')}</button></div></article>`;
}

function monthDays() {
  const year = state.month.getFullYear();
  const month = state.month.getMonth();
  const offset = (new Date(year, month, 1).getDay() + 6) % 7;
  const total = new Date(year, month + 1, 0).getDate();
  return { year, month, offset, total };
}
const dayKey = (year, month, day) => `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

function renderCalendar() {
  const { year, month, offset, total } = monthDays();
  document.querySelector('#month-label').textContent = state.month.toLocaleDateString('es', { month: 'long', year: 'numeric' });
  let html = '';
  for (let i = 0; i < offset; i++) html += `<span class="outside-day">${new Date(year, month, -offset + i + 1).getDate()}</span>`;
  for (let day = 1; day <= total; day++) {
    const key = dayKey(year, month, day);
    const hasEvent = events.some((event) => event.date === key);
    html += `<button class="calendar-day ${hasEvent ? 'has-event' : ''} ${key === state.day ? 'chosen-day' : ''} ${key === '2026-10-27' ? 'today' : ''}" data-day="${key}" aria-label="${fullDate(key)}${hasEvent ? ', con eventos' : ''}" aria-pressed="${key === state.day}">${day}${hasEvent ? '<i></i>' : ''}</button>`;
  }
  document.querySelector('#mini-calendar').innerHTML = html;
}

function renderResults() {
  const filtered = filterEvents(events, state);
  document.querySelector('#results-count').innerHTML = `<strong>${filtered.length} eventos</strong> ${state.savedOnly ? 'guardados' : 'para conectar con tu gente'}`;
  document.querySelector('#saved-count').textContent = state.saved.length;
  const clear = document.querySelector('#clear-day');
  clear.hidden = !state.day;
  clear.innerHTML = `${state.day ? shortDate(state.day) : ''} ${icon('close')}`;
  const container = document.querySelector('#events-results');
  if (state.view === 'calendar') {
    const { year, month, offset, total } = monthDays();
    container.className = 'large-calendar-wrap';
    const visible = filtered.filter((event) => date(event.date).getMonth() === month && date(event.date).getFullYear() === year);
    container.innerHTML = `<div class="large-calendar-heading"><h3>${state.month.toLocaleDateString('es', { month: 'long', year: 'numeric' })}</h3><span>${visible.length} eventos este mes</span></div><div class="large-calendar">${['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => `<div class="large-weekday">${day}</div>`).join('')}${'<div class="large-day blank"></div>'.repeat(offset)}${Array.from({ length: total }, (_, index) => {
      const key = dayKey(year, month, index + 1);
      return `<div class="large-day ${key === '2026-10-27' ? 'is-today' : ''}"><span>${index + 1}</span>${visible.filter((event) => event.date === key).map((event) => `<button data-event="${event.id}"><small>${event.time}</small>${escape(event.title)}</button>`).join('')}</div>`;
    }).join('')}</div>${!visible.length ? '<p class="calendar-empty">No hay eventos con estos filtros este mes. Prueba otro mes o cambia los filtros.</p>' : ''}`;
  } else {
    container.className = 'event-grid';
    container.innerHTML = filtered.length ? filtered.map(renderCard).join('') : `<div class="empty-state">${icon('search')}<h3>Ningún evento por aquí… todavía.</h3><p>Prueba con otro tema o cambia los filtros.</p><button class="button button-dark" data-action="reset">Ver todos los eventos</button></div>`;
  }
}
function refresh() { renderCalendar(); renderResults(); }

const modal = document.querySelector('#modal');
function openModal(content) {
  document.querySelector('#modal-content').innerHTML = `<button class="modal-close icon-button" data-action="close" aria-label="Cerrar">${icon('close')}</button>${content}`;
  modal.showModal();
}
function notify(message) {
  const toast = document.querySelector('#toast');
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(notify.timeout);
  notify.timeout = setTimeout(() => toast.classList.remove('visible'), 3500);
}
function showEvent(id) {
  const event = events.find((item) => item.id === id);
  if (!event) return;
  openModal(`${artwork(event.art)}<div class="modal-body"><span class="eyebrow">${escape(event.host)} · EVENTO DE EJEMPLO</span><h2>${escape(event.title)}</h2><div class="event-detail">${icon('calendar')}${fullDate(event.date)} · ${event.time}–${event.end}</div><div class="event-detail">${icon('pin')}${escape(event.venue)}</div><p>${escape(event.description)}</p><div class="event-tags">${event.tags.map((tag) => `<span>${tag}</span>`).join('')}</div><div class="event-notice">Este evento es una demostración. La fecha, el lugar y la programación no están confirmados; no hay inscripciones disponibles.</div><button class="button button-dark" data-action="download" data-id="${event.id}">${icon('calendar')} Añadir demo a mi calendario</button></div>`);
}

function updateTheme() {
  const dark = document.documentElement.dataset.theme === 'dark';
  document.querySelector('.theme-toggle').innerHTML = icon(dark ? 'sun' : 'moon');
  document.querySelector('.theme-toggle').setAttribute('aria-label', `Cambiar a modo ${dark ? 'claro' : 'oscuro'}`);
  document.querySelector('meta[name="theme-color"]').content = dark ? '#171916' : '#f6f5f0';
}
function downloadEvent(id) {
  const event = events.find((item) => item.id === id);
  const stamp = (time) => `${event.date.replaceAll('-', '')}T${time.replace(':', '')}00`;
  const icsEscape = (value) => value.replaceAll('\\', '\\\\').replaceAll('\n', '\\n').replaceAll(',', '\\,').replaceAll(';', '\\;');
  const content = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//malaga.dev//Eventos demo//ES', 'BEGIN:VEVENT', `UID:demo-${event.id}@malaga.dev`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`, `DTSTART;TZID=Europe/Madrid:${stamp(event.time)}`, `DTEND;TZID=Europe/Madrid:${stamp(event.end)}`, `SUMMARY:${icsEscape(`[DEMO] ${event.title}`)}`, `LOCATION:${icsEscape(event.address)}`, 'DESCRIPTION:Evento de ejemplo. Programación no confirmada.', 'END:VEVENT', 'END:VCALENDAR', ''].join('\r\n');
  const url = URL.createObjectURL(new Blob([content], { type: 'text/calendar;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url; link.download = `malaga-dev-demo-${event.id}.ics`; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  notify('Evento de ejemplo descargado en formato .ics');
}

document.addEventListener('click', (e) => {
  const target = e.target.closest('button, a[data-action]');
  if (!target) return;
  if (target.dataset.category) {
    state.category = target.dataset.category;
    document.querySelectorAll('[data-category]').forEach((button) => {
      button.classList.toggle('selected', button === target);
      button.setAttribute('aria-pressed', button === target);
    });
    renderResults();
  }
  if (target.dataset.view) {
    state.view = target.dataset.view;
    document.querySelectorAll('[data-view]').forEach((button) => {
      button.classList.toggle('selected', button === target);
      button.setAttribute('aria-pressed', button === target);
    });
    renderResults();
  }
  if (target.dataset.day) { state.day = state.day === target.dataset.day ? '' : target.dataset.day; refresh(); }
  if (target.dataset.event) showEvent(target.dataset.event);
  if (target.dataset.save) {
    const id = target.dataset.save;
    const next = state.saved.includes(id) ? state.saved.filter((item) => item !== id) : [...state.saved, id];
    try { localStorage.setItem('malaga-saved', JSON.stringify(next)); }
    catch { notify('No se pudo guardar en este navegador. Comprueba los permisos de almacenamiento.'); return; }
    state.saved = next;
    renderResults();
    const replacement = document.querySelector(`[data-save="${id}"]`);
    if (replacement) replacement.focus({ preventScroll: true });
  }
  const action = target.dataset.action;
  if (!action) return;
  e.preventDefault();
  if (action === 'theme') {
    const dark = document.documentElement.dataset.theme !== 'dark';
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    try { localStorage.setItem('malaga-theme', dark ? 'dark' : 'light'); }
    catch { notify('Tema cambiado. El navegador no permite recordar tu preferencia.'); }
    updateTheme();
  }
  if (action === 'saved') {
    state.savedOnly = !state.savedOnly;
    target.classList.toggle('selected', state.savedOnly);
    target.setAttribute('aria-pressed', state.savedOnly);
    renderResults();
  }
  if (action === 'clear-day') { state.day = ''; refresh(); }
  if (action === 'previous-month' || action === 'next-month') {
    state.month = new Date(state.month.getFullYear(), state.month.getMonth() + (action === 'next-month' ? 1 : -1), 1);
    state.day = ''; refresh();
  }
  if (action === 'today') { state.month = new Date(2026, 9, 1); state.day = ''; refresh(); }
  if (action === 'reset') {
    state.category = 'all'; state.query = ''; state.day = ''; state.savedOnly = false;
    document.querySelector('#search').value = '';
    document.querySelectorAll('[data-category]').forEach((button) => { button.classList.toggle('selected', button.dataset.category === 'all'); button.setAttribute('aria-pressed', button.dataset.category === 'all'); });
    document.querySelector('.saved-filter').classList.remove('selected');
    document.querySelector('.saved-filter').setAttribute('aria-pressed', 'false');
    refresh();
  }
  if (action === 'close') modal.close();
  if (action === 'download') downloadEvent(target.dataset.id);
  if (action === 'community') openModal(`<div class="modal-body community-modal"><span class="eyebrow">// ENCUENTRA TU TRIBU</span><h2>Distintos stacks.<br>La misma curiosidad.</h2><p>Descubre las comunidades tecnológicas de Málaga. Estos enlaces de búsqueda te ayudan a encontrar sus canales y próximos encuentros reales.</p>${[...new Map(events.map((event) => [event.host, event])).values()].map((event) => `<a class="community-row" href="https://www.google.com/search?q=${encodeURIComponent(event.host + ' comunidad Málaga')}" target="_blank" rel="noopener noreferrer"><span class="organizer-avatar host-${event.art}">${event.initials}</span><span><strong>${event.host}</strong><small>${event.tags.join(' · ')}</small></span>${icon('arrow')}</a>`).join('')}</div>`);
  if (action === 'about') openModal(`<div class="modal-body"><span class="eyebrow">// HELLO, MÁLAGA</span><h2>La tecnología conecta.<br>La comunidad lo cambia todo.</h2><p>málaga.dev es un prototipo de agenda local para acercar la tecnología a las personas: meetups, talleres, conferencias y conversaciones que merecen salir de la pantalla.</p><p>Los eventos de esta versión son ejemplos, no una agenda verificada. Tus eventos guardados y tu tema se conservan solo en este navegador.</p><button class="button button-dark" data-action="close">Entendido ${icon('check')}</button></div>`);
  if (action === 'submit') openModal(`<div class="modal-body"><span class="eyebrow">// HAZ CRECER EL MAPA</span><h2>Las buenas ideas<br>se comparten.</h2><p>Prepara una propuesta para la agenda de Málaga. En esta demo puedes descargarla; no se envía ni publica en ningún servidor.</p><form id="event-form"><label>Nombre del evento<input name="title" required maxlength="120" placeholder="Un nombre para tu próximo encuentro" /></label><div class="form-pair"><label>Fecha<input name="date" type="date" required min="2026-10-27" /></label><label>Tipo<select name="category">${categories.filter((item) => item.id !== 'all').map((item) => `<option>${item.label}</option>`).join('')}</select></label></div><label>Lugar o enlace<input name="venue" required maxlength="200" placeholder="¿Dónde nos vemos?" /></label><label>Descripción<textarea name="description" required maxlength="2000" rows="3" placeholder="Cuéntanos qué hace especial este evento"></textarea></label><button class="button button-dark" type="submit">${icon('arrow')} Descargar propuesta</button><small class="form-note">Sin registros. Sin envíos. Tu propuesta se queda contigo.</small></form></div>`);
});
document.querySelector('#search').addEventListener('input', (e) => { state.query = e.target.value; renderResults(); });
document.addEventListener('keydown', (e) => {
  if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName) && !modal.open) { e.preventDefault(); document.querySelector('#search').focus(); }
});
modal.addEventListener('click', (e) => { if (e.target === modal) { const rect = modal.getBoundingClientRect(); if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) modal.close(); } });
document.addEventListener('submit', (e) => {
  if (e.target.id !== 'event-form') return;
  e.preventDefault();
  const proposal = Object.fromEntries(new FormData(e.target));
  const url = URL.createObjectURL(new Blob([JSON.stringify({ ...proposal, status: 'propuesta no publicada' }, null, 2)], { type: 'application/json' }));
  const link = document.createElement('a'); link.href = url; link.download = 'propuesta-evento-malaga.json'; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  modal.close(); notify('Propuesta descargada. No se ha publicado ni enviado.');
});
updateTheme();
refresh();
