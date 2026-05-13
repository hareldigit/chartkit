import { createDivElement } from '../utils/dom.js';

export function Footer(config) {
  this._config = config;
  this._el = createDivElement('ck-footer');
  this._buttonEl = null;
}

Footer.prototype._build = function _build() {
  if (!this._config || !this._config.label) {
    this._el.style.display = 'none';
    return;
  }

  this._el.style.display = '';
  var self = this;

  while (this._el.firstChild) {
    this._el.removeChild(this._el.firstChild);
  }

  this._buttonEl = document.createElement('button');
  this._buttonEl.className = 'ck-footer-btn';
  this._buttonEl.type = 'button';
  this._buttonEl.textContent = this._config.label;

  if (this._config.onClick) {
    this._buttonEl.addEventListener('click', this._config.onClick);
  }

  this._buttonEl.addEventListener('click', function () {
    self._el.dispatchEvent(new CustomEvent('footer-click', {
      bubbles: true,
      detail: { label: self._config.label },
    }));
  });

  this._el.appendChild(this._buttonEl);
};

Footer.prototype.render = function render() {
  this._build();
};

Footer.prototype.update = function update(config) {
  this._config = config;
  this._build();
};

Footer.prototype.getElement = function getElement() {
  return this._el;
};

Footer.prototype.destroy = function destroy() {
  if (this._el.parentNode) {
    this._el.parentNode.removeChild(this._el);
  }
};
