//  @flow
function getElementById(id: string): HTMLElement {
  const element = document.getElementById(id);

  if (!element) {
    throw new Error(`Element with ID ${id} does not exist in document.`);
  }

  if (!(element instanceof HTMLElement)) {
    throw new Error(`Element with ID ${id} is not an HTMLElement.`);
  }

  return element;
}

function getInputElementById(id: string): HTMLInputElement {
  const element = getElementById(id);

  if (!(element instanceof HTMLInputElement)) {
    throw new Error(`Element with ID ${id} is not an HTMLInputElement.`);
  }

  return element;
}

module.exports = {
  getElementById,
  getInputElementById,
};
