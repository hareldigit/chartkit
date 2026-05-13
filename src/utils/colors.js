import { DEFAULT_COLORS } from '../constants.js';

export function getColor(index, providedColor) {
  if (providedColor) return providedColor;
  return DEFAULT_COLORS[index % DEFAULT_COLORS.length];
}

export function generatePalette(count) {
  var palette = [];
  for (var i = 0; i < count; i++) {
    palette.push(DEFAULT_COLORS[i % DEFAULT_COLORS.length]);
  }
  return palette;
}

export function hexToRgba(hex, alpha) {
  var r = parseInt(hex.slice(1, 3), 16);
  var g = parseInt(hex.slice(3, 5), 16);
  var b = parseInt(hex.slice(5, 7), 16);
  return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
}

export function lightenColor(hex, percent) {
  var num = parseInt(hex.replace('#', ''), 16);
  var r = Math.min(255, (num >> 16) + percent);
  var g = Math.min(255, ((num >> 8) & 0x00FF) + percent);
  var b = Math.min(255, (num & 0x0000FF) + percent);
  return '#' + (0x1000000 + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
