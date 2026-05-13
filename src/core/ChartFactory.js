import { CHART_TYPES } from '../constants.js';

var registry = {};

export function registerChartType(type, ChartClass) {
  registry[type] = ChartClass;
}

export function createChart(el, jsConfig, typeOverride) {
  var type = typeOverride || jsConfig.type || CHART_TYPES.DONUT;

  var ChartClass = registry[type];
  if (!ChartClass) {
    throw new Error('No chart registered for type "' + type + '". Available types: ' + Object.keys(registry).join(', '));
  }

  return new ChartClass(el, jsConfig);
}

export function getAvailableTypes() {
  return Object.keys(registry);
}
