function Slider(displayElement, inputElement) {
  this.displayElement = displayElement;
  this.inputElement = inputElement;

  this.addModifiedEventListener(() => this.update());
}

Slider.prototype.addModifiedEventListener = function(listener) {
  this.inputElement.addEventListener(
    'change',
    listener);

  this.inputElement.addEventListener(
    'input',
    listener);
}

Slider.prototype.getValue = function() {
  return parseInt(this.inputElement.value, 10);
}

Slider.prototype.setValue = function(value) {
  this.inputElement.value = value;
}

Slider.prototype.update = function() {
  this.displayElement.innerHTML = this.getValue();
}

module.exports = Slider;
