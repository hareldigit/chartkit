import { EventEmitter } from './EventEmitter.js';
import { parseConfig } from './ChartConfig.js';
import { initTheme } from './Theme.js';
import { applyDirection, detectDirection } from '../utils/direction.js';
import { createResizeObserver, destroyResizeObserver } from '../utils/responsive.js';
import { removeAllChildren, addClass } from '../utils/dom.js';

export function Chart(el, jsConfig) {
  EventEmitter.call(this);

  this._el = el;
  this._config = parseConfig(el, jsConfig);
  this._direction = this._config.direction || detectDirection(el);
  this._resizeObserver = null;
  this._isDestroyed = false;

  addClass(el, 'ck-chart');

  initTheme(el, this._config.theme);
  applyDirection(el, this._direction);

  if (this._config.responsive) {
    this._setupResize();
  }
}

Chart.prototype = Object.create(EventEmitter.prototype);
Chart.prototype.constructor = Chart;

Chart.prototype.render = function render() {
  if (this._isDestroyed) return;
};

Chart.prototype.updateData = function updateData(newData) {
  if (this._isDestroyed) return;
  this._config.data = newData;
  this.render();
  this.emit('update', { data: newData });
};

Chart.prototype.setType = function setType(newType) {
  if (this._isDestroyed) return;
  this.emit('typechange', { type: newType });
};

Chart.prototype.setDirection = function setDirection(direction) {
  if (this._isDestroyed) return;
  this._direction = direction;
  applyDirection(this._el, direction);
  this.render();
};

Chart.prototype.getConfig = function getConfig() {
  return this._config;
};

Chart.prototype.getDirection = function getDirection() {
  return this._direction;
};

Chart.prototype.getContainer = function getContainer() {
  return this._el;
};

Chart.prototype.destroy = function destroy() {
  this._isDestroyed = true;
  destroyResizeObserver(this._resizeObserver);

  if (this._el && this._el._resizeCleanup) {
    this._el._resizeCleanup();
  }

  removeAllChildren(this._el);
  this.emit('destroy');
  EventEmitter.prototype.destroy.call(this);
};

Chart.prototype._setupResize = function setupResize() {
  var self = this;
  this._resizeObserver = createResizeObserver(this._el, function () {
    self.render();
  });
};
