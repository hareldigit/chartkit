import { SVG_NS } from '../constants.js';
import { createElementNS, setAttributes, removeAllChildren } from '../utils/dom.js';

export function SVGRenderer(container) {
  this._container = container;
  this._svg = null;
  this._width = 0;
  this._height = 0;
  this._viewBox = '0 0 100 100';
}

SVGRenderer.prototype.init = function init(width, height) {
  removeAllChildren(this._container);

  this._width = width;
  this._height = height;
  this._viewBox = '0 0 ' + width + ' ' + height;

  this._svg = createElementNS('svg', {
    width: '100%',
    height: '100%',
    viewBox: this._viewBox,
    preserveAspectRatio: 'xMidYMid meet',
    class: 'ck-svg',
  });

  this._container.appendChild(this._svg);
};

SVGRenderer.prototype.createGroup = function createGroup(attributes) {
  var g = createElementNS('g', attributes || {});
  this._svg.appendChild(g);
  return g;
};

SVGRenderer.prototype.createPath = function createPath(d, attributes, parent) {
  var path = createElementNS('path', Object.assign({ d: d }, attributes || {}));
  (parent || this._svg).appendChild(path);
  return path;
};

SVGRenderer.prototype.createRect = function createRect(attributes, parent) {
  var rect = createElementNS('rect', attributes);
  (parent || this._svg).appendChild(rect);
  return rect;
};

SVGRenderer.prototype.createText = function createText(content, x, y, attributes, parent) {
  var text = createElementNS('text', Object.assign({ x: x, y: y }, attributes || {}));
  text.textContent = content;
  (parent || this._svg).appendChild(text);
  return text;
};

SVGRenderer.prototype.createLine = function createLine(x1, y1, x2, y2, attributes, parent) {
  var line = createElementNS('line', Object.assign({ x1: x1, y1: y1, x2: x2, y2: y2 }, attributes || {}));
  (parent || this._svg).appendChild(line);
  return line;
};

SVGRenderer.prototype.createCircle = function createCircle(cx, cy, r, attributes, parent) {
  var circle = createElementNS('circle', Object.assign({ cx: cx, cy: cy, r: r }, attributes || {}));
  (parent || this._svg).appendChild(circle);
  return circle;
};

SVGRenderer.prototype.setAttribute = function setAttribute(el, name, value) {
  el.setAttribute(name, value);
};

SVGRenderer.prototype.removeElement = function removeElement(el) {
  if (el && el.parentNode) {
    el.parentNode.removeChild(el);
  }
};

SVGRenderer.prototype.clear = function clear() {
  removeAllChildren(this._svg);
};

SVGRenderer.prototype.getSVG = function getSVG() {
  return this._svg;
};

SVGRenderer.prototype.getWidth = function getWidth() {
  return this._width;
};

SVGRenderer.prototype.getHeight = function getHeight() {
  return this._height;
};

SVGRenderer.prototype.getViewBox = function getViewBox() {
  return this._viewBox;
};
