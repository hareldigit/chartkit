import { createDivElement } from '../utils/dom.js';

export function Legend(config) {
  this._config = config;
  this._el = createDivElement('ck-legend');
  this._el.classList.add('ck-legend-' + config.position);
  this._listEl = createDivElement('ck-legend-list');
  this._el.appendChild(this._listEl);
  this._items = [];
}

Legend.prototype.build = function build(data, formatFn) {
  var self = this;

  while (this._listEl.firstChild) {
    this._listEl.removeChild(this._listEl.firstChild);
  }
  this._items = [];

  for (var i = 0; i < data.length; i++) {
    var item = data[i];
    var row = createDivElement('ck-legend-item');
    row.setAttribute('data-id', item.id);

    var dot = createDivElement('ck-legend-dot');
    dot.style.backgroundColor = item.color;

    var label = createDivElement('ck-legend-label');
    label.textContent = item.label;

    var value = createDivElement('ck-legend-value');
    value.textContent = formatFn ? formatFn(item) : String(item.value);

    row.appendChild(dot);
    row.appendChild(label);
    row.appendChild(value);

    row.addEventListener('mouseenter', function (itemData, rowEl) {
      return function () {
        rowEl.classList.add('ck-legend-item-active');
        self._el.dispatchEvent(new CustomEvent('legend-hover', {
          bubbles: true,
          detail: { item: itemData, action: 'enter' },
        }));
      };
    }(item, row));

    row.addEventListener('mouseleave', function (itemData, rowEl) {
      return function () {
        rowEl.classList.remove('ck-legend-item-active');
        self._el.dispatchEvent(new CustomEvent('legend-hover', {
          bubbles: true,
          detail: { item: itemData, action: 'leave' },
        }));
      };
    }(item, row));

    this._listEl.appendChild(row);
    this._items.push(row);
  }
};

Legend.prototype.update = function update(data, formatFn) {
  this.build(data, formatFn);
};

Legend.prototype.getElement = function getElement() {
  return this._el;
};

Legend.prototype.destroy = function destroy() {
  if (this._el.parentNode) {
    this._el.parentNode.removeChild(this._el);
  }
};
