import { createDivElement } from '../utils/dom.js';

export function CenterContent(config) {
  this._config = config;
  this._el = createDivElement('ck-center-content');

  if (!config) {
    this._el.style.display = 'none';
    return;
  }

  this._valueEl = createDivElement('ck-center-value');
  this._valueEl.textContent = config.value || '';

  this._labelEl = createDivElement('ck-center-label');
  this._labelEl.textContent = config.label || '';

  if (config.unit) {
    this._unitEl = createDivElement('ck-center-unit');
    this._unitEl.textContent = config.unit;
  }

  this._el.appendChild(this._valueEl);
  this._el.appendChild(this._labelEl);

  if (this._unitEl) {
    this._el.appendChild(this._unitEl);
  }
}

CenterContent.prototype.update = function update(config) {
  this._config = config;

  if (!config) {
    this._el.style.display = 'none';
    return;
  }

  this._el.style.display = '';

  if (this._valueEl) {
    this._valueEl.textContent = config.value || '';
  }
  if (this._labelEl) {
    this._labelEl.textContent = config.label || '';
  }
  if (this._unitEl) {
    this._unitEl.textContent = config.unit || '';
  } else if (config.unit) {
    this._unitEl = createDivElement('ck-center-unit');
    this._unitEl.textContent = config.unit;
    this._el.appendChild(this._unitEl);
  }
};

CenterContent.prototype.getElement = function getElement() {
  return this._el;
};

CenterContent.prototype.destroy = function destroy() {
  if (this._el.parentNode) {
    this._el.parentNode.removeChild(this._el);
  }
};
