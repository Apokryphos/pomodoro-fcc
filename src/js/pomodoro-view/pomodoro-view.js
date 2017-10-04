//  @flow
const Countdown = require('./countdown.js');
const ConfigButton = require('./config-button.js');
const DomUtil = require('./dom-util.js');
const Pomodoro = require('./../pomodoro.js');
const Slider = require('./slider.js');
const Sliders = require('./sliders.js');
const StartButton = require('./start-button.js');

class PomodoroView {
  pomodoro: Pomodoro;
  countdownComponent: Countdown;
  startButtonComponent: StartButton;
  configButton: ConfigButton;
  longBreakIntervalSlider: Slider;
  taskDurationSlider: Slider;
  shortBreakDurationSlider: Slider;
  longBreakDurationSlider: Slider;
  startDescription: string;

  constructor(pomodoro: Pomodoro) {
    this.pomodoro = pomodoro;

    const countdownElement = DomUtil.getElementById('countdown');
    if (!(countdownElement instanceof HTMLElement)) {
      throw new Error('countdown element is not valid.');
    }

    this.countdownComponent = new Countdown(countdownElement);

    this.startButtonComponent = new StartButton(
      pomodoro,
      DomUtil.getElementById('startButton'),
      DomUtil.getElementById('startIcon'),
      DomUtil.getElementById('stopIcon'));

    const configButtonElement = DomUtil.getElementById('configButton');
    if (!(configButtonElement instanceof HTMLElement)) {
      throw new Error('configButton element is not valid.');
    }

    const configContainerElement = DomUtil.getElementById('configContainer');
    if (!(configContainerElement instanceof HTMLElement)) {
      throw new Error('configContainer element is not valid.');
    }

    this.configButton = new ConfigButton(
      configButtonElement,
      configContainerElement);

    this.longBreakIntervalSlider = Sliders.createLongBreakIntervalSlider(this.pomodoro);
    this.taskDurationSlider = Sliders.createTaskDurationSlider(this.pomodoro);
    this.shortBreakDurationSlider = Sliders.createShortBreakDurationSlider(this.pomodoro);
    this.longBreakDurationSlider = Sliders.createLongBreakDurationSlider(this.pomodoro);

    const descriptionElement = DomUtil.getElementById('pomodoroDescription');
    const startDescription = descriptionElement.innerHTML;

    const updateCountdownComponent = () => {
      this.countdownComponent.update(this.pomodoro);

      descriptionElement.innerHTML =
        pomodoro.isTaskActive() ? 'Focus on your task.' :
          pomodoro.isBreakActive() ? 'Take a break.' :
            startDescription;
    };

    //  Update countdown display whenever task duration is changed
    this.taskDurationSlider.addModifiedEventListener(updateCountdownComponent);

    //  Update countdown display whenever start button is clicked
    this.startButtonComponent.addEventListener('click', updateCountdownComponent);

    //  Update countdown display every Pomodoro tick
    this.pomodoro.addEventListener('onTick', updateCountdownComponent);

    //  Update countdown display to initial Pomodoro duration
    updateCountdownComponent();
  }
}

module.exports = PomodoroView;
