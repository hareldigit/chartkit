import { CSS_PREFIX } from '../constants.js';
import { setCSSVar } from '../utils/dom.js';

var DEFAULT_THEME = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  primaryColor: '#4F46E5',
  cardBackground: '#FFFFFF',
  cardRadius: '16px',
  cardShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
  cardPadding: '20px',
  titleColor: '#1E293B',
  titleSize: '18px',
  titleWeight: '600',
  textColor: '#64748B',
  textSize: '13px',
  valueColor: '#0F172A',
  valueSize: '15px',
  valueWeight: '600',
  legendDotSize: '10px',
  legendGap: '12px',
  segmentGapColor: '#FFFFFF',
  toggleActiveBg: '#4F46E5',
  toggleActiveColor: '#FFFFFF',
  toggleInactiveBg: '#F1F5F9',
  toggleInactiveColor: '#64748B',
  toggleRadius: '8px',
  tooltipBg: '#1E293B',
  tooltipColor: '#FFFFFF',
  tooltipRadius: '8px',
  footerColor: '#4F46E5',
  footerWeight: '500',
  barRadius: '4px',
  barGap: '0.2',
  transitionDuration: '300ms',
};

var THEME_PREFIX = '--' + CSS_PREFIX + '-';

export function initTheme(el, customTheme) {
  var theme = mergeThemes(DEFAULT_THEME, customTheme || {});
  var keys = Object.keys(theme);

  for (var i = 0; i < keys.length; i++) {
    setCSSVar(el, keys[i], theme[keys[i]]);
  }

  return theme;
}

function mergeThemes(defaults, custom) {
  var result = {};
  var keys = Object.keys(defaults);

  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    result[key] = custom.hasOwnProperty(key) ? custom[key] : defaults[key];
  }

  return result;
}
