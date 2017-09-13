function StartButton(
  pomodoro,
  buttonElement,
  startIconElement,
  stopIconElement) {
  this.pomodoro = pomodoro;
  this.buttonElement = buttonElement;
  this.startIconElement = startIconElement;
  this.stopIconElement = stopIconElement;

  this.addEventListener('click', () => this.activate());
}

StartButton.prototype.activate = function() {
  if (this.pomodoro.isActive()) {
    this.pomodoro.stop();
    this.buttonElement.title = 'Start Pomodoro.';
    this.startIconElement.style.display = 'inline';
    this.stopIconElement.style.display = 'none';
  } else {
    this.pomodoro.start();
    this.buttonElement.title = 'Stop Pomodoro.';
    this.startIconElement.style.display = 'none';
    this.stopIconElement.style.display = 'inline';
  }
};

StartButton.prototype.addEventListener = function(type, listener) {
  this.buttonElement.addEventListener(type, listener);
};

module.exports = StartButton;
