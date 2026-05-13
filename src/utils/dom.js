import { SVG_NS, CSS_PREFIX } from '../constants.js';

export function createElementNS(tag, attributes) {
  var el = document.createElementNS(SVG_NS, tag);
  if (attributes) {
    setAttributes(el, attributes);
  }
  return el;
}

export function setAttributes(el, attributes) {
  for (var key in attributes) {
    if (attributes.hasOwnProperty(key)) {
      el.setAttribute(key, attributes[key]);
    }
  }
}

export function createDivElement(className) {
  var el = document.createElement('div');
  el.className = className;
  return el;
}

export function getDataAttribute(el, attrName) {
  return el.getAttribute('data-' + CSS_PREFIX + '-' + attrName);
}

export function parseDataAttributeJSON(el, attrName) {
  var raw = getDataAttribute(el, attrName);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export function setCSSVar(el, name, value) {
  el.style.setProperty('--' + CSS_PREFIX + '-' + name, value);
}

export function getCSSVar(el, name) {
  return getComputedStyle(el).getPropertyValue('--' + CSS_PREFIX + '-' + name).trim();
}

export function removeAllChildren(el) {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
}

export function addClass(el, className) {
  if (el.classList) {
    el.classList.add(className);
  } else {
    el.className += ' ' + className;
  }
}

export function removeClass(el, className) {
  if (el.classList) {
    el.classList.remove(className);
  } else {
    el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
  }
}

export function hasClass(el, className) {
  if (el.classList) {
    return el.classList.contains(className);
  }
  return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
}
