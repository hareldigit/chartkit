import { createDivElement } from '../utils/dom.js';

export function Tooltip() {
  this._el = createDivElement('ck-tooltip');
  this._el.style.display = 'none';
  this._labelEl = createDivElement('ck-tooltip-label');
  this._valueEl = createDivElement('ck-tooltip-value');
  this._el.appendChild(this._labelEl);
  this._el.appendChild(this._valueEl);
}

Tooltip.prototype.attachTo = function attachTo(container) {
  container.appendChild(this._el);
};

Tooltip.prototype.show = function show(x, y, label, value, color) {
  this._labelEl.textContent = label;
  this._valueEl.textContent = value;
  if (color) {
    this._valueEl.style.color = color;
  }
  this._el.style.display = 'block';
  this._el.style.left = x + 'px';
  this._el.style.top = y + 'px';
};

Tooltip.prototype.hide = function hide() {
  this._el.style.display = 'none';
};

Tooltip.prototype.updatePosition = function updatePosition(x, y) {
  this._el.style.left = x + 'px';
  this._el.style.top = y + 'px';
};

Tooltip.prototype.destroy = function destroy() {
  if (this._el.parentNode) {
    this._el.parentNode.removeChild(this._el);
  }
};
