//  @flow
const moment = require('moment');
const Pomodoro = require('./../pomodoro.js');

function getPomodoroCountdownString(pomodoro: Pomodoro) {
  let duration = pomodoro.taskDuration;

  if (pomodoro.isActive()) {
    duration = pomodoro.getElapsed();
  }

  //  Handle display of hours separate from minutes and seconds.
  //  moment.js doesn't implement duration.format() now, and
  //  hours in the format string (e.g. hh:mm:ss) using moment.format()
  //  don't display the correct value.
  //  https://github.com/moment/moment/issues/1048
  const str: string = moment(duration.asMilliseconds()).format('mm:ss');

  //  Only show hours if non-zero
  const hoursStr: string =
    duration.hours() === 0 ?
      '' :
      `${duration.hours() < 10 ? '0' : ''}${duration.hours()}:`;

  return `${hoursStr}${str}`;
}

class Countdown {
  element: HTMLElement;

  constructor(element: HTMLElement) {
    this.element = element;
  }

  update(pomodoro: Pomodoro) {
    this.element.innerHTML = getPomodoroCountdownString(pomodoro);

    if (pomodoro.isBreakActive()) {
      this.element.classList.add('breakActive');
      this.element.classList.remove('inactive');
      this.element.classList.remove('taskActive');
    } else if (pomodoro.isTaskActive()) {
      this.element.classList.add('taskActive');
      this.element.classList.remove('inactive');
      this.element.classList.remove('breakActive');
    } else {
      this.element.classList.add('inactive');
      this.element.classList.remove('taskActive');
      this.element.classList.remove('breakActive');
    }
  }
}

module.exports = Countdown;
