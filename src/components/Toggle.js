import { createDivElement, addClass, removeClass } from '../utils/dom.js';
import { EventEmitter } from '../core/EventEmitter.js';

export function Toggle(config) {
  EventEmitter.call(this);

  this._config = config;
  this._el = createDivElement('ck-toggle');
  this._options = [];
  this._activeIndex = 0;

  this._build();
}

Toggle.prototype = Object.create(EventEmitter.prototype);
Toggle.prototype.constructor = Toggle;

Toggle.prototype._build = function _build() {
  var self = this;

  for (var i = 0; i < this._config.options.length; i++) {
    var option = this._config.options[i];
    var btn = document.createElement('button');
    btn.className = 'ck-toggle-btn';
    btn.textContent = option.label;
    btn.type = 'button';

    if (i === 0) {
      addClass(btn, 'ck-toggle-active');
    }

    (function (index) {
      btn.addEventListener('click', function () {
        self.setActive(index);
      });
    })(i);

    this._options.push(btn);
    this._el.appendChild(btn);
  }
};

Toggle.prototype.setActive = function setActive(index) {
  if (index < 0 || index >= this._options.length) return;

  for (var i = 0; i < this._options.length; i++) {
    removeClass(this._options[i], 'ck-toggle-active');
  }

  addClass(this._options[index], 'ck-toggle-active');
  this._activeIndex = index;

  this.emit('change', {
    index: index,
    value: this._config.options[index],
  });
};

Toggle.prototype.getValue = function getValue() {
  return this._config.options[this._activeIndex];
};

Toggle.prototype.getElement = function getElement() {
  return this._el;
};

Toggle.prototype.destroy = function destroy() {
  EventEmitter.prototype.destroy.call(this);
  if (this._el.parentNode) {
    this._el.parentNode.removeChild(this._el);
  }
};
