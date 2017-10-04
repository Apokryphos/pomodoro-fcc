//  @flow
const moment = require('moment');
const EventHub = require('./event-hub.js');

function getElapsedTime(time: ?number): number {
  if (time !== null && typeof time === 'number') {
    return Date.now() - time;
  } else {
    throw new Error('Invalid time specified.');
  }
}

const PomodoroState = {
  READY: 0,
  TASK: 1,
  BREAK: 2,
};

type PomodoroStateEnum = $Values<typeof PomodoroState>

type PomodoroOptions = {
  autoStart?: boolean,
  taskDuration?: moment$MomentDuration,
  shortBreakDuration?: moment$MomentDuration,
  longBreakDuration?: moment$MomentDuration,
  longBreakInterval?: number,
  tickInterval?: number,
};

class Pomodoro {
  autoStart: boolean;
  taskDuration: moment$MomentDuration;
  shortBreakDuration: moment$MomentDuration;
  longBreakDuration: moment$MomentDuration;
  longBreakInterval: number;
  tickInterval: number;
  taskCount: number;
  breakCount: number;
  state: PomodoroStateEnum;
  startDate: ?number;
  currentDuration: ?moment$MomentDuration;
  intervalId: ?number;
  eventHub: EventHub;

  constructor(options?: PomodoroOptions) {
    if (options && options.shortBreakDuration != null) {
      this.shortBreakDuration = options.shortBreakDuration;
    } else {
      this.shortBreakDuration = moment.duration(5, 'minutes');
    }

    if (options && options.taskDuration != null) {
      this.taskDuration = options.taskDuration;
    } else {
      this.taskDuration = moment.duration(25, 'minutes');
    }

    if (options && options.longBreakDuration != null) {
      this.longBreakDuration = options.longBreakDuration;
    } else {
      this.longBreakDuration = moment.duration(15, 'minutes');
    }

    if (options && options.longBreakInterval != null) {
      this.longBreakInterval = options.longBreakInterval;
    } else {
      this.longBreakInterval = 4;
    }

    if (options && options.tickInterval != null) {
      this.tickInterval = options.tickInterval;
    } else {
      this.tickInterval = 1000;
    }

    if (options && options.autoStart != null) {
      this.autoStart = options.autoStart;
    } else {
      this.autoStart = true;
    }

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
  }

  addEventListener(eventName: string, callback: Function) {
    this.eventHub.subscribe(eventName, callback);
  }

  getElapsed() {
    if (this.isActive() && typeof this.startDate === 'number') {
      //  Total milliseconds elapsed since start was called
      const elapsed = getElapsedTime(this.startDate);

      if (!this.currentDuration) {
        throw new Error('currentDuration cannot be null.');
      }

      //  Moment.js duration to milliseconds
      const duration = this.currentDuration.asMilliseconds();

      //  duration.subtract() mutates...
      let remaining = duration - elapsed;

      if (remaining < 0) {
        remaining = 0;
      }

      return moment.duration(remaining);
    } else {
      return moment.duration(0);
    }
  }

  isActive() {
    return (
      this.state === PomodoroState.TASK ||
      this.state === PomodoroState.BREAK);
  }

  isBreakActive() {
    return this.state === PomodoroState.BREAK;
  }

  isTaskActive() {
    return this.state === PomodoroState.TASK;
  }

  getBreakDuration() {
    return (
      (this.taskCount > 0 && (this.taskCount % this.longBreakInterval) === 0) ?
        this.longBreakDuration :
        this.shortBreakDuration);
  }

  start() {
    if (!moment.isDuration(this.taskDuration)) {
      throw new Error('Task duration is invalid.');
    }

    if (!moment.isDuration(this.shortBreakDuration)) {
      throw new Error('Short break duration is invalid.');
    }

    if (!moment.isDuration(this.longBreakDuration)) {
      throw new Error('Long break duration is invalid.');
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

      const elapsed = getElapsedTime(this.startDate);

      if (!this.currentDuration) {
        throw new Error('currentDuration cannot be null.');
      }

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
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.intervalId = null;
    this.startDate = null;

    this.state = PomodoroState.READY;
  }
}

module.exports = Pomodoro;
