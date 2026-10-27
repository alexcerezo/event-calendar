import test from 'node:test';
import assert from 'node:assert/strict';
import { events, filterEvents } from './events.js';

test('all events are returned in chronological order by default', () => {
  assert.equal(filterEvents(events).length, 6);
  assert.deepEqual(events.map((event) => event.date), events.map((event) => event.date).sort());
});
test('category and accent-insensitive search work together', () => {
  assert.equal(filterEvents(events, { category: 'meetup', query: 'malaga ai' })[0].id, 'ai');
  assert.equal(filterEvents(events, { query: 'diseno' })[0].id, 'design');
  assert.equal(filterEvents(events, { category: 'workshop', query: 'React' }).length, 0);
});
test('saved events and selected dates combine with other filters', () => {
  assert.deepEqual(filterEvents(events, { savedOnly: true, saved: ['ai', 'react'], day: '2026-10-29' }).map((event) => event.id), ['react']);
  assert.equal(filterEvents(events, { savedOnly: true }).length, 0);
  assert.equal(filterEvents(events, { day: '2026-10-27' }).length, 0);
});
test('unknown searches return no events', () => {
  assert.equal(filterEvents(events, { query: 'no-such-event' }).length, 0);
});
