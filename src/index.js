const Pomodoro = require('./pomodoro.js');
const moment = require('moment');

function updateCounterElement(pomodoro, counterElement) {
  const elapsed = pomodoro.getElapsed();

  //  Handle display of hours separate from minutes and seconds.
  //  moment.js doesn't implement duration.format() now, and
  //  hours in the format string (e.g. hh:mm:ss) using moment.format()
  //  don't display the correct value.
  //  https://github.com/moment/moment/issues/1048
  const str = moment(pomodoro.getElapsed().asMilliseconds()).format('mm:ss');

  //  Only show hours if non-zero
  const hoursStr =
    elapsed.hours() === 0 ?
    '' :
    `${elapsed.hours() < 10 ? '0' : ''}${elapsed.hours()}:`;

  counterElement.innerHTML = `${hoursStr}${str}`;
}

const counterElement = document.getElementById('counter');

//  Change tick interval to twice a second to prevent counter display
//  from skipping seconds (and showing the same value for too long).
const pomodoroOptions = {
  'tickInterval': 500,
};

const pomodoro = new Pomodoro(pomodoroOptions);

pomodoro.addEventListener('onTick', () => {
  updateCounterElement(pomodoro, counterElement);
});

updateCounterElement(pomodoro, counterElement);

pomodoro.start();
