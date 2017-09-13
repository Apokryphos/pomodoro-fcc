//  @flow
class ConfigButton {
  buttonElement: HTMLElement;
  configContainer: HTMLElement;

  constructor(buttonElement: HTMLElement, configContainer: HTMLElement) {
    this.buttonElement = buttonElement;
    this.configContainer = configContainer;
    this.addEventListener('click', () => this.activate());
  }

  activate() {
    if (this.configContainer.style.display === 'block') {
      this.configContainer.style.display = 'none';
      this.buttonElement.title = 'Edit settings...';
    } else {
      this.configContainer.style.display = 'block';
      this.buttonElement.title = 'Hide settings...';
    }
  }

  addEventListener(type: string, listener: Function) {
    this.buttonElement.addEventListener(type, listener);
  }
}

module.exports = ConfigButton;
