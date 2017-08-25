const moment = require('moment');
const EventHub = require('./event-hub.js');

const PomodoroState = {
  READY: 0,
  TASK: 1,
  BREAK: 2,
};

function getBooleanOption(options, propertyName, defaultValue) {
  if (options && options.hasOwnProperty(propertyName)) {
    const value = options[propertyName];

    if (typeof value === 'boolean')
    {
      return value;
    }
    else {
      throw new Error(`Boolean option ${propertyName} is invalid.`);
    }
  }

  if (typeof defaultValue !== 'boolean') {
    throw new Error(`Default boolean for ${propertyName} is invalid.`);
  }

  return defaultValue;
}

function getDurationOption(options, propertyName, defaultValue) {
  if (options) {
    const value = options[propertyName];

    if (value) {
      if (moment.isDuration(value))
      {
        return value;
      } else {
        throw new Error(`Duration option ${propertyName} is invalid.`);
      }
    }
  }

  if (!moment.isDuration(defaultValue)) {
    throw new Error(`Default duration for ${propertyName} is invalid.`);
  }

  return defaultValue;
}

function getNumberOption(options, propertyName, defaultValue) {
  if (options) {
    const value = options[propertyName];

    if (value) {
      if (Number.isInteger(value))
      {
        return value;
      } else {
        throw new Error(`Number option ${propertyName} is invalid.`);
      }
    }
  }

  if (!Number.isInteger(defaultValue)) {
    throw new Error(`Default number for ${propertyName} is invalid.`);
  }

  return defaultValue;
}

function Pomodoro(options) {
  this.taskDuration = getDurationOption(
    options,
    'taskDuration',
    moment.duration(25, 'minutes')
  );

  this.shortBreakDuration = getDurationOption(
    options,
    'shortBreakDuration',
    moment.duration(5, 'minutes')
  );

  this.longBreakDuration = getDurationOption(
    options,
    'longBreakDuration',
    moment.duration(15, 'minutes')
  );

  this.longBreakInterval = getNumberOption(
    options,
    'longBreakInterval',
    4
  );

  this.tickInterval = getNumberOption(
    options,
    'tickInterval',
    1000
  );

  this.autoStart = getBooleanOption(
    options,
    'autoStart',
    true
  );

  //  Completed tasks
  this.taskCount = 0;

  //  Completed breaks
  this.breakCount = 0;

  this.state = PomodoroState.READY;

  this.startDate = null;
  this.currentDuration = null;
  this.intervalId = null;

  this.eventHub = new EventHub();
  this.eventHub.registerEvent('onComplete');
  this.eventHub.registerEvent('onTick');
};

Pomodoro.prototype.addEventListener = function(eventName, callback) {
  this.eventHub.subscribe(eventName, callback);
};

Pomodoro.prototype.getElapsed = function() {
  if (this.isActive()) {
    //  Total milliseconds elapsed since start was called
    const elapsed = Date.now() - this.startDate;

    //  Moment.js duration to milliseconds
    const duration = this.currentDuration.asMilliseconds();

    //  duration.subtract() mutates...
    const remaining = duration - elapsed;

    return moment.duration(remaining);
  } else {
    return moment.duration(0);
  }
};

Pomodoro.prototype.isActive = function() {
  return (
    this.state === PomodoroState.TASK ||
    this.state === PomodoroState.BREAK
  );
};

Pomodoro.prototype.isBreakActive = function() {
  return this.state === PomodoroState.BREAK;
};

Pomodoro.prototype.isTaskActive = function() {
  return this.state === PomodoroState.TASK;
};

Pomodoro.prototype.getBreakDuration = function() {
  return (
    (this.breakCount > 0 && (this.breakCount % this.longBreakInterval) === 0) ?
    this.longBreakDuration :
    this.shortBreakDuration);
};

Pomodoro.prototype.start = function() {
  if (!moment.isDuration(this.taskDuration)) {
    throw new Error('Current duration is invalid.');
  }

  if (this.taskCount <= this.breakCount) {
    this.state = PomodoroState.TASK;
    this.currentDuration = this.taskDuration;
  } else {
    this.state = PomodoroState.BREAK;
    this.currentDuration = this.getBreakDuration();
  }

  this.startDate = Date.now();
  this.intervalId = null;

  const onTick = () => {
    this.eventHub.broadcast('onTick');

    const elapsed = Date.now() - this.startDate;

    if (elapsed >= this.currentDuration.asMilliseconds()) {
      //  Increment counters when interval is complete
      if (this.state === PomodoroState.TASK) {
        ++this.taskCount;
      } else if (this.state === PomodoroState.BREAK) {
        ++this.breakCount;
      }

      this.stop();
      this.eventHub.broadcast('onComplete');

      if (this.autoStart) {
        this.start();
      }
    }
  };

  this.intervalId = setInterval(onTick, this.tickInterval);
};

Pomodoro.prototype.stop = function() {
  if (this.intervalId) {
    clearInterval(this.intervalId);
  }

  this.intervalId = null;
  this.startDate = null;

  this.state = PomodoroState.READY;
};

module.exports = Pomodoro;
