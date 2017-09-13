function ConfigButton(buttonElement, configContainer) {
  this.buttonElement = buttonElement;
  this.configContainer = configContainer;

  this.addEventListener('click', () => this.activate());
}

ConfigButton.prototype.activate = function() {
  if (this.configContainer.style.display === 'block') {
    this.configContainer.style.display = 'none';
    this.buttonElement.title = 'Edit settings...';
  } else {
    this.configContainer.style.display = 'block';
    this.buttonElement.title = 'Hide settings...';
  }
};

ConfigButton.prototype.addEventListener = function(type, listener) {
  this.buttonElement.addEventListener(type, listener);
};

module.exports = ConfigButton;
