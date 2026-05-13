import { DIRECTION } from '../constants.js';

export function detectDirection(el) {
  if (el.dir && el.dir.toLowerCase() === 'rtl') return DIRECTION.RTL;

  var parent = el.closest('[dir]');
  if (parent && parent.dir.toLowerCase() === 'rtl') return DIRECTION.RTL;

  var htmlDir = document.documentElement.dir;
  if (htmlDir && htmlDir.toLowerCase() === 'rtl') return DIRECTION.RTL;

  return DIRECTION.LTR;
}

export function applyDirection(el, direction) {
  el.setAttribute('dir', direction);
  el.classList.remove('ck-ltr', 'ck-rtl');
  el.classList.add('ck-' + direction);
}

export function flipLegendPosition(position, direction) {
  if (direction !== DIRECTION.RTL) return position;

  if (position === 'right') return 'left';
  if (position === 'left') return 'right';
  return position;
}

export function isRTL(direction) {
  return direction === DIRECTION.RTL;
}
