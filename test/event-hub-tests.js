/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
const test = require('tape');
const EventHub = require('./../src/js/event-hub.js');

test('EventHub construction', (t) => {
  t.doesNotThrow(() => new EventHub());
  t.end();
});

test('EventHub event registration', (t) => {
  const eventHub = new EventHub();

  t.doesNotThrow(() => eventHub.registerEvent('onComplete'));
  t.doesNotThrow(() => eventHub.registerEvent('onTick'));
  t.end();
});

test('EventHub event subscription', (t) => {
  t.plan(4);

  const eventHub = new EventHub();
  eventHub.registerEvent('onComplete');
  eventHub.registerEvent('onTick');

  const onComplete = () => {
    t.pass();
  };

  const onTick = () => {
    t.pass();
  };

  t.doesNotThrow(() => eventHub.subscribe('onComplete', onComplete));
  t.doesNotThrow(() => eventHub.subscribe('onTick', onTick));

  eventHub.broadcast('onTick');
  eventHub.broadcast('onComplete');
});
