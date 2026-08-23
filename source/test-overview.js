import test from 'node:test';
import assert from 'node:assert';
import { lessonPath, routeFromLocation, canonicalPathForRoute } from './src/surfaces/group-3-8104/routing/routes.js';

test('no Overview nav/tab', () => {
  const path = lessonPath({ level: 'hsk1', number: 1 });
  assert.ok(path.includes('/contents/'), 'Lesson default should be contents');
});

test('old Overview URL redirects', () => {
  const route = routeFromLocation({ pathname: '/home/hsk1/lessons/lesson-01/overview/' });
  assert.strictEqual(route.name, 'contents');
  assert.strictEqual(route.redirect, true);
  
  const canonical = canonicalPathForRoute(route);
  assert.ok(canonical.includes('/contents/'));
});
