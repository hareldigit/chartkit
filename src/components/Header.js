import { createDivElement } from '../utils/dom.js';

export function Header(config) {
  this._config = config;
  this._el = createDivElement('ck-header');
  this._toggleSlot = createDivElement('ck-header-toggle-slot');
  this._dataEl = null;
}

Header.prototype.setDataEl = function setDataEl(el) {
  this._dataEl = el;
};

Header.prototype._build = function _build() {
  if (!this._config.title && !this._toggleSlot.children.length) return;

  while (this._el.firstChild) {
    this._el.removeChild(this._el.firstChild);
  }

  if (this._config.title) {
    var title = createDivElement('ck-title');
    title.textContent = this._config.title;
    this._el.appendChild(title);
  }

  if (this._toggleSlot.children.length) {
    this._el.appendChild(this._toggleSlot);
  }

  if (this._dataEl) {
    this._el.appendChild(this._dataEl);
  }
};

Header.prototype.render = function render(toggleEl) {
  while (this._toggleSlot.firstChild) {
    this._toggleSlot.removeChild(this._toggleSlot.firstChild);
  }

  if (toggleEl) {
    this._toggleSlot.appendChild(toggleEl);
  }

  this._build();
};

Header.prototype.getElement = function getElement() {
  return this._el;
};

Header.prototype.destroy = function destroy() {
  if (this._el.parentNode) {
    this._el.parentNode.removeChild(this._el);
  }
};
