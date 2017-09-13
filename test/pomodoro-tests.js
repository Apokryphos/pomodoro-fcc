/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
const test = require('tape');
const moment = require('moment');
const Pomodoro = require('./../src/pomodoro.js');

test('Pomodoro construction', (t) => {
  t.doesNotThrow(() => new Pomodoro());

  t.doesNotThrow(() => {
    const pomodoro = new Pomodoro({
      taskDuration: moment.duration(30, 'minutes') });

    t.deepEqual(pomodoro.taskDuration, moment.duration(30, 'minutes'));
  });

  t.doesNotThrow(() => {
    const pomodoro = new Pomodoro({
      longBreakDuration: moment.duration(20, 'minutes') });

    t.deepEqual(pomodoro.longBreakDuration, moment.duration(20, 'minutes'));
  });

  t.doesNotThrow(() => {
    const pomodoro = new Pomodoro({
      shortBreakDuration: moment.duration(10, 'minutes') });

    t.deepEqual(pomodoro.shortBreakDuration, moment.duration(10, 'minutes'));
  });

  t.doesNotThrow(() => {
    const pomodoro = new Pomodoro({ longBreakInterval: 6 });

    t.equal(pomodoro.longBreakInterval, 6);
  });

  t.doesNotThrow(() => {
    const pomodoro = new Pomodoro({ tickInterval: 500 });

    t.equal(pomodoro.tickInterval, 500);
  });

  t.doesNotThrow(() => {
    const pomodoro = new Pomodoro({ autoStart: false });

    t.equal(pomodoro.autoStart, false);
  });

  t.end();
});

test('Pomodoro construction fails with invalid options', (t) => {
  t.throws(() => new Pomodoro({ taskDuration: 25 }));
  t.throws(() => new Pomodoro({ shortBreakDuration: 5 }));
  t.throws(() => new Pomodoro({ longBreakDuration: 15 }));
  t.throws(() => new Pomodoro({ tickInterval: 'one' }));
  t.throws(() => new Pomodoro({ autoStart: 'no' }));
  t.end();
});

test('Pomodoro stop', (t) => {
  const options = {
    taskDuration: moment.duration(10, 'seconds'),
    shortBreakDuration: moment.duration(10, 'seconds'),
    longBreakDuration: moment.duration(10, 'seconds'),
  };

  const pomodoro = new Pomodoro(options);

  t.equal(pomodoro.isActive(), false);
  pomodoro.start();
  t.equal(pomodoro.isActive(), true);
  pomodoro.stop();
  t.equal(pomodoro.isActive(), false);

  t.end();
});

test('Pomodoro state changes', (t) => {
  const options = {
    taskDuration: moment.duration(1, 'seconds'),
    shortBreakDuration: moment.duration(1, 'seconds'),
    longBreakDuration: moment.duration(1, 'seconds'),
    autoStart: false,
  };

  const pomodoro = new Pomodoro(options);

  t.equal(pomodoro.isActive(), false);
  t.equal(pomodoro.isBreakActive(), false);
  t.equal(pomodoro.isTaskActive(), false);

  pomodoro.start();

  t.equal(pomodoro.isActive(), true);
  t.equal(pomodoro.isBreakActive(), false);
  t.equal(pomodoro.isTaskActive(), true);

  t.end();
});

test('Pomodoro break interval changes', (t) => {
  const options = {
    taskDuration: moment.duration(1, 'seconds'),
    shortBreakDuration: moment.duration(1, 'seconds'),
    longBreakDuration: moment.duration(2, 'seconds'),
    longBreakInterval: 2,
    autoStart: false,
  };

  const pomodoro = new Pomodoro(options);

  const count = (pomodoro.longBreakInterval + 1) * 2;

  const estimatedTime =
    pomodoro.longBreakDuration +
    (pomodoro.shortBreakDuration * pomodoro.longBreakInterval) +
    (pomodoro.taskDuration * (pomodoro.longBreakInterval + 1));

  t.comment(`Estimated time: ${estimatedTime}ms`);

  const onComplete = () => {
    // t.comment(`onComplete(): ${pomodoro.taskCount} of ${count} tasks...`);
    if (pomodoro.taskCount >= count) {
      t.end();
    } else {
      pomodoro.start();
    }
  };

  const onTick = () => {
    if (pomodoro.isBreakActive()) {
      const inLongBreak =
          pomodoro.taskCount > 0 &&
          pomodoro.taskCount % pomodoro.longBreakInterval === 0;

      if (inLongBreak) {
        t.deepEqual(
          pomodoro.currentDuration,
          pomodoro.longBreakDuration,
        );
      } else {
        t.deepEqual(
          pomodoro.currentDuration,
          pomodoro.shortBreakDuration,
        );
      }
    }
  };

  pomodoro.addEventListener('onTick', onTick);
  pomodoro.addEventListener('onComplete', onComplete);
  pomodoro.start();
});

test('Pomodoro broadcasts onComplete event', (t) => {
  const duration = 1000;
  const count = 2;

  t.comment(`Estimated time: ${duration * count}ms`);
  t.timeoutAfter(duration * (count + 1));

  const options = {
    taskDuration: moment.duration(duration, 'milliseconds'),
    shortBreakDuration: moment.duration(duration, 'milliseconds'),
    longBreakDuration: moment.duration(duration, 'milliseconds'),
    autoStart: false,
  };

  const pomodoro = new Pomodoro(options);

  let completeCount = 0;
  const onComplete = () => {
    ++completeCount;
    t.pass(`onComplete() ${completeCount} of ${count} calls.`);
    if (completeCount >= count) {
      pomodoro.stop();
      t.end();
    } else {
      pomodoro.start(onComplete);
    }
  };

  pomodoro.addEventListener('onComplete', onComplete);
  pomodoro.start();
});

test('Pomodoro broadcasts onTick event', (t) => {
  const durationInSeconds = 5;

  t.plan(durationInSeconds);

  t.comment(`Estimated time: ${durationInSeconds * 1000}ms`);
  t.timeoutAfter(1000 * (durationInSeconds + 2));

  let tickCount = 0;
  const onTick = () => {
    ++tickCount;
    t.pass(`onTick() ${tickCount} of ${durationInSeconds} calls.`);
  };

  const options = {
    taskDuration: moment.duration(durationInSeconds, 'seconds'),
    shortBreakDuration: moment.duration(durationInSeconds, 'seconds'),
    longBreakDuration: moment.duration(durationInSeconds, 'seconds'),
    autoStart: false,
  };

  const pomodoro = new Pomodoro(options);
  pomodoro.addEventListener('onTick', onTick);
  pomodoro.start();
});
