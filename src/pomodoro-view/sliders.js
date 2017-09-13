const Slider = require('./slider.js');
const moment = require('moment');

function createLongBreakIntervalSlider(pomodoro) {
  const slider = new Slider(
    document.getElementById('longBreakIntervalValue'),
    document.getElementById('longBreakIntervalInput'));

  slider.setValue(pomodoro.longBreakInterval);

  slider.addModifiedEventListener(() => {
    pomodoro.longBreakInterval = slider.getValue();
  });

  return slider;
}

function createLongBreakDurationSlider(pomodoro) {
  const slider = new Slider(
    document.getElementById('longBreakDurationValue'),
    document.getElementById('longBreakDurationInput'));

  slider.setValue(pomodoro.longBreakDuration.asMinutes());

  slider.addModifiedEventListener(() => {
    pomodoro.longBreakDuration = moment.duration(slider.getValue(), 'minutes');
    // console.log(pomodoro.longBreakDuration.asMinutes());
    // console.log(pomodoro.longBreakDuration.asMinutes());
  });

  return slider;
}

function createShortBreakDurationSlider(pomodoro) {
  const slider = new Slider(
    document.getElementById('shortBreakDurationValue'),
    document.getElementById('shortBreakDurationInput'));

  slider.setValue(pomodoro.shortBreakDuration.asMinutes());

  slider.addModifiedEventListener(() => {
    pomodoro.shortBreakDuration = moment.duration(slider.getValue(), 'minutes');
  });

  return slider;
}

function createTaskDurationSlider(pomodoro) {
  const slider = new Slider(
    document.getElementById('taskDurationValue'),
    document.getElementById('taskDurationInput'));

  slider.setValue(pomodoro.taskDuration.asMinutes());

  slider.addModifiedEventListener(() => {
    pomodoro.taskDuration = moment.duration(slider.getValue(), 'minutes');
  });

  return slider;
}

module.exports = {
  createLongBreakIntervalSlider,
  createLongBreakDurationSlider,
  createShortBreakDurationSlider,
  createTaskDurationSlider,
};
