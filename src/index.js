const Pomodoro = require('./pomodoro.js');
const PomodoroView = require('./pomodoro-view/pomodoro-view.js');
const moment = require('moment');

//  Change tick interval to twice a second to prevent counter display
//  from skipping seconds (and showing the same value for too long).
const pomodoroOptions = {
  'tickInterval': 500,
};

const pomodoro = new Pomodoro(pomodoroOptions);
const pomodoroView = new PomodoroView(pomodoro);
