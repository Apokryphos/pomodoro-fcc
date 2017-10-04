//  @flow
class Slider {
  displayElement: HTMLElement;
  inputElement: HTMLInputElement;

  constructor(displayElement: HTMLElement, inputElement: HTMLInputElement) {
    this.displayElement = displayElement;
    this.inputElement = inputElement;
    this.addModifiedEventListener(() => this.update());
  }

  addModifiedEventListener(listener: Function) {
    this.inputElement.addEventListener(
      'change',
      listener);

    this.inputElement.addEventListener(
      'input',
      listener);
  }

  getValue() {
    return parseInt(this.inputElement.value, 10);
  }

  setValue(value: number) {
    this.inputElement.value = value.toString();
  }

  update() {
    this.displayElement.innerHTML = this.getValue().toString();
  }
}

module.exports = Slider;
