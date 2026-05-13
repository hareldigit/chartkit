import { createDivElement } from '../utils/dom.js';
import { Header } from './Header.js';
import { Footer } from './Footer.js';
import { Legend } from './Legend.js';

export function Card(config) {
  this._config = config;
  this._el = createDivElement('ck-card');

  this.header = new Header(config);
  this._chartArea = createDivElement('ck-chart-area');
  this._chartBody = createDivElement('ck-chart-body');
  this.footer = new Footer(config.footer);

  this.legend = null;
  if (config.legend && config.legend.show) {
    this.legend = new Legend(config.legend);
  }

  this._build();
}

Card.prototype._build = function _build() {
  this._el.appendChild(this.header.getElement());
  this._el.appendChild(this._chartBody);
  this._chartBody.appendChild(this._chartArea);

  if (this.legend) {
    if (this.legend._config.position === 'bottom') {
      this._chartBody.classList.add('ck-chart-body-column');
    }
    this._chartBody.appendChild(this.legend.getElement());
  }

  this.footer.render();
  this._el.appendChild(this.footer.getElement());

  this.header.render();
};

Card.prototype.getChartArea = function getChartArea() {
  return this._chartArea;
};

Card.prototype.getChartBody = function getChartBody() {
  return this._chartBody;
};

Card.prototype.getLegend = function getLegend() {
  return this.legend;
};

Card.prototype.getHeader = function getHeader() {
  return this.header;
};

Card.prototype.getFooter = function getFooter() {
  return this.footer;
};

Card.prototype.getElement = function getElement() {
  return this._el;
};

Card.prototype.destroy = function destroy() {
  this.header.destroy();
  if (this.legend) this.legend.destroy();
  this.footer.destroy();
  if (this._el.parentNode) {
    this._el.parentNode.removeChild(this._el);
  }
};
