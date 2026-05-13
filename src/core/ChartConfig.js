import {
  validateType,
  validateData,
  validateLegendConfig,
  validateToggleConfig,
  validateCenterContent,
  validateFooterConfig,
  validateDirection,
  validateAnimationConfig,
  validateOthersThreshold,
} from '../types/schema.js';
import {
  CHART_TYPES,
  DEFAULT_INNER_RADIUS,
  DEFAULT_SEGMENT_GAP,
  DEFAULT_ANIMATION_DURATION,
  DEFAULT_OTHERS_THRESHOLD,
  DIRECTION,
  TOGGLE_MODE,
} from '../constants.js';
import {
  getDataAttribute,
  parseDataAttributeJSON,
} from '../utils/dom.js';
import { detectDirection } from '../utils/direction.js';

export function parseConfig(el, jsConfig) {
  var htmlConfig = parseHTMLConfig(el);
  var merged = mergeConfigs(htmlConfig, jsConfig || {});
  return validateAndFinalize(merged);
}

function parseHTMLConfig(el) {
  var config = {};

  var type = getDataAttribute(el, 'type');
  if (type) config.type = type;

  var data = parseDataAttributeJSON(el, 'data');
  if (data) config.data = data;

  var title = getDataAttribute(el, 'title');
  if (title) config.title = title;

  config.legend = {};
  var legendPosition = getDataAttribute(el, 'legend-position');
  var showLegend = getDataAttribute(el, 'show-legend');
  if (legendPosition) config.legend.position = legendPosition;
  if (showLegend !== null) config.legend.show = showLegend !== 'false';
  if (!legendPosition && showLegend === null) config.legend = undefined;

  config.toggle = {};
  var toggleOptions = parseDataAttributeJSON(el, 'toggle-options');
  var showToggle = getDataAttribute(el, 'show-toggle');
  if (toggleOptions) config.toggle.options = toggleOptions;
  if (showToggle !== null) config.toggle.show = showToggle !== 'false';
  if (!toggleOptions && showToggle === null) config.toggle = undefined;

  config.centerContent = {};
  var centerLabel = getDataAttribute(el, 'center-label');
  var centerValue = getDataAttribute(el, 'center-value');
  var centerUnit = getDataAttribute(el, 'center-unit');
  if (centerLabel) config.centerContent.label = centerLabel;
  if (centerValue) config.centerContent.value = centerValue;
  if (centerUnit) config.centerContent.unit = centerUnit;
  if (!centerLabel && !centerValue && !centerUnit) config.centerContent = undefined;

  config.footer = {};
  var footerLabel = getDataAttribute(el, 'footer-label');
  if (footerLabel) config.footer.label = footerLabel;
  else config.footer = undefined;

  var direction = getDataAttribute(el, 'direction');
  if (direction) config.direction = direction;

  config.animation = {};
  var animEnabled = getDataAttribute(el, 'animation');
  var animDuration = getDataAttribute(el, 'animation-duration');
  if (animEnabled !== null) config.animation.enabled = animEnabled !== 'false';
  if (animDuration) config.animation.duration = parseInt(animDuration, 10);
  if (animEnabled === null && !animDuration) config.animation = undefined;

  var innerRadius = getDataAttribute(el, 'inner-radius');
  if (innerRadius !== null) config.innerRadius = parseFloat(innerRadius);

  var segmentGap = getDataAttribute(el, 'segment-gap');
  if (segmentGap !== null) config.segmentGap = parseInt(segmentGap, 10);

  var othersThreshold = getDataAttribute(el, 'others-threshold');
  if (othersThreshold !== null) config.othersThreshold = parseInt(othersThreshold, 10);

  var responsive = getDataAttribute(el, 'responsive');
  if (responsive !== null) config.responsive = responsive !== 'false';

  return config;
}

function mergeConfigs(htmlConfig, jsConfig) {
  var merged = {};

  var keys = [
    'type', 'data', 'title', 'innerRadius', 'segmentGap',
    'direction', 'responsive', 'theme',
  ];

  for (var i = 0; i < keys.length; i++) {
    merged[keys[i]] = jsConfig.hasOwnProperty(keys[i]) ? jsConfig[keys[i]] : htmlConfig[keys[i]];
  }

  mergeObjectConfig(merged, htmlConfig, jsConfig, 'legend');
  mergeObjectConfig(merged, htmlConfig, jsConfig, 'toggle');
  mergeObjectConfig(merged, htmlConfig, jsConfig, 'centerContent');
  mergeObjectConfig(merged, htmlConfig, jsConfig, 'footer');
  mergeObjectConfig(merged, htmlConfig, jsConfig, 'animation');
  mergePrimitiveConfig(merged, htmlConfig, jsConfig, 'othersThreshold');

  return merged;
}

function mergeObjectConfig(merged, html, js, key) {
  var htmlVal = html[key];
  var jsVal = js[key];

  if (jsVal !== undefined) {
    merged[key] = jsVal;
  } else if (htmlVal !== undefined) {
    merged[key] = htmlVal;
  }
}

function mergePrimitiveConfig(merged, html, js, key) {
  if (js.hasOwnProperty(key)) {
    merged[key] = js[key];
  } else if (html.hasOwnProperty(key)) {
    merged[key] = html[key];
  }
}

function validateAndFinalize(config) {
  return {
    type: config.type ? validateType(config.type) : CHART_TYPES.DONUT,
    data: config.data ? validateData(config.data) : [],
    title: config.title || '',
    legend: validateLegendConfig(config.legend),
    toggle: validateToggleConfig(config.toggle),
    centerContent: validateCenterContent(config.centerContent),
    footer: validateFooterConfig(config.footer),
    direction: config.direction ? validateDirection(config.direction) : DIRECTION.LTR,
    animation: validateAnimationConfig(config.animation),
    innerRadius: config.innerRadius !== undefined ? Math.max(0, Math.min(1, config.innerRadius)) : DEFAULT_INNER_RADIUS,
    segmentGap: config.segmentGap !== undefined ? Math.max(0, config.segmentGap) : DEFAULT_SEGMENT_GAP,
    othersThreshold: validateOthersThreshold(config.othersThreshold),
    responsive: config.responsive !== false,
    theme: config.theme || {},
  };
}
