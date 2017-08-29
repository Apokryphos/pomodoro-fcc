const Countdown = require('./countdown.js');
const ConfigButton = require('./config-button.js');
const Sliders = require('./sliders.js');
const StartButton = require('./start-button.js');

function PomodoroView(pomodoro) {
  this.pomodoro = pomodoro;

  this.countdownComponent = new Countdown(document.getElementById('countdown'));

  this.startButtonComponent = new StartButton(
    pomodoro,
    document.getElementById('startButton'),
    document.getElementById('startIcon'),
    document.getElementById('stopIcon'));

  this.configButton = new ConfigButton(
    document.getElementById('configButton'),
    document.getElementById('configContainer'));

  this.longBreakIntervalSlider = Sliders.createLongBreakIntervalSlider(this.pomodoro);
  this.taskDurationSlider = Sliders.createTaskDurationSlider(this.pomodoro);
  this.shortBreakDurationSlider = Sliders.createShortBreakDurationSlider(this.pomodoro);
  this.longBreakDurationSlider = Sliders.createLongBreakDurationSlider(this.pomodoro);

  const updateCountdownComponent = () =>
    this.countdownComponent.update(this.pomodoro);

  //  Update countdown display whenever task duration is changed
  this.taskDurationSlider.addModifiedEventListener(updateCountdownComponent);

    //  Update countdown display whenever start button is clicked
  this.startButtonComponent.addEventListener('click', updateCountdownComponent);

  //  Update countdown display every Pomodoro tick
  this.pomodoro.addEventListener('onTick', updateCountdownComponent);

  //  Update countdown display to initial Pomodoro duration
  updateCountdownComponent();
}

module.exports = PomodoroView;
