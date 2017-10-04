//  @flow
const DomUtil = require('./dom-util.js');
const Pomodoro = require('./../pomodoro.js');
const Slider = require('./slider.js');
const moment = require('moment');

function createLongBreakIntervalSlider(pomodoro: Pomodoro) {
  const slider = new Slider(
    DomUtil.getElementById('longBreakIntervalValue'),
    DomUtil.getInputElementById('longBreakIntervalInput'));

  slider.setValue(pomodoro.longBreakInterval);

  slider.addModifiedEventListener(() => {
    pomodoro.longBreakInterval = slider.getValue();
  });

  return slider;
}

function createLongBreakDurationSlider(pomodoro: Pomodoro) {
  const slider = new Slider(
    DomUtil.getElementById('longBreakDurationValue'),
    DomUtil.getInputElementById('longBreakDurationInput'));

  slider.setValue(pomodoro.longBreakDuration.asMinutes());

  slider.addModifiedEventListener(() => {
    pomodoro.longBreakDuration = moment.duration(slider.getValue(), 'minutes');
    // console.log(pomodoro.longBreakDuration.asMinutes());
    // console.log(pomodoro.longBreakDuration.asMinutes());
  });

  return slider;
}

function createShortBreakDurationSlider(pomodoro: Pomodoro) {
  const slider = new Slider(
    DomUtil.getElementById('shortBreakDurationValue'),
    DomUtil.getInputElementById('shortBreakDurationInput'));

  slider.setValue(pomodoro.shortBreakDuration.asMinutes());

  slider.addModifiedEventListener(() => {
    pomodoro.shortBreakDuration = moment.duration(slider.getValue(), 'minutes');
  });

  return slider;
}

function createTaskDurationSlider(pomodoro: Pomodoro) {
  const slider = new Slider(
    DomUtil.getElementById('taskDurationValue'),
    DomUtil.getInputElementById('taskDurationInput'));

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
