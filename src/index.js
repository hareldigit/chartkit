import { CHART_TYPES, CSS_PREFIX } from './constants.js';
import { registerChartType, createChart, getAvailableTypes } from './core/ChartFactory.js';
import { DonutChart } from './charts/DonutChart.js';
import { BarChart } from './charts/BarChart.js';

registerChartType(CHART_TYPES.DONUT, DonutChart);
registerChartType(CHART_TYPES.PIE, DonutChart);
registerChartType(CHART_TYPES.BAR, BarChart);

function create(elementOrSelector, config) {
  var el;

  if (typeof elementOrSelector === 'string') {
    el = document.querySelector(elementOrSelector);
  } else {
    el = elementOrSelector;
  }

  if (!el) {
    throw new Error('ChartKit: element not found.');
  }

  var finalConfig = config || {};
  var chartType = finalConfig.type || el.getAttribute('data-' + CSS_PREFIX + '-type');

  if (chartType) {
    finalConfig.type = chartType;
  }

  return createChart(el, finalConfig);
}

function autoInit(scope) {
  var container = scope || document;
  var selector = '[' + 'data-' + CSS_PREFIX + '-type' + ']';
  var elements = container.querySelectorAll(selector);

  var charts = [];
  for (var i = 0; i < elements.length; i++) {
    if (elements[i]._chartkit) continue;
    var chart = create(elements[i], {});
    elements[i]._chartkit = chart;
    charts.push(chart);
  }

  return charts;
}

function injectStyles() {
  if (document.getElementById('chartkit-styles')) return;

  var styleEl = document.createElement('style');
  styleEl.id = 'chartkit-styles';
  styleEl.textContent = getDefaultStyles();
  document.head.appendChild(styleEl);
}

function getDefaultStyles() {
  return ''
    + '.ck-chart { direction: ltr; font-family: var(--ck-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif); }'
    + '.ck-chart.ck-rtl { direction: rtl; }'
    + '.ck-card { background: var(--ck-card-background, #FFFFFF); border-radius: var(--ck-card-radius, 16px); box-shadow: var(--ck-card-shadow, 0 4px 24px rgba(0,0,0,0.08)); padding: var(--ck-card-padding, 20px); display: flex; flex-direction: column; gap: 16px; box-sizing: border-box; overflow: hidden; }'
    + '.ck-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }'
    + '.ck-title { font-size: var(--ck-title-size, 18px); font-weight: var(--ck-title-weight, 600); color: var(--ck-title-color, #1E293B); line-height: 1.3; }'
    + '.ck-chart-body { display: flex; gap: 20px; flex: 1; min-height: 0; }'
    + '.ck-chart-body-column { flex-direction: column; overflow: hidden; }'
    + '.ck-chart-area { flex: 1 1 auto; position: relative; min-width: 0; min-height: 120px; overflow: hidden; }'
    + '.ck-rtl .ck-chart-body { flex-direction: row-reverse; }'
    + '.ck-toggle { display: inline-flex; background: var(--ck-toggle-inactive-bg, #F1F5F9); border-radius: var(--ck-toggle-radius, 8px); padding: 3px; gap: 2px; }'
    + '.ck-toggle-btn { background: none; border: none; padding: 6px 14px; border-radius: var(--ck-toggle-radius, 8px); font-size: 13px; font-weight: 500; cursor: pointer; color: var(--ck-toggle-inactive-color, #64748B); transition: all var(--ck-transition-duration, 300ms); white-space: nowrap; }'
    + '.ck-toggle-btn:hover { color: var(--ck-toggle-active-color, #FFFFFF); }'
    + '.ck-toggle-active { background: var(--ck-toggle-active-bg, #4F46E5); color: var(--ck-toggle-active-color, #FFFFFF) !important; }'
    + '.ck-legend { min-width: 140px; max-width: 200px; overflow-y: auto; }'
    + '.ck-legend-bottom { width: 100%; min-width: 100%; max-width: 100%; max-height: 80px; overflow-y: auto; }'
    + '.ck-chart-body-column .ck-legend { min-width: 100%; max-width: 100%; max-height: 80px; width: 100%; }'
    + '.ck-legend-list { display: flex; flex-direction: column; gap: var(--ck-legend-gap, 12px); }'
    + '.ck-legend-bottom .ck-legend-list { flex-direction: row; flex-wrap: wrap; }'
    + '.ck-legend-item { display: flex; align-items: center; gap: 8px; cursor: pointer; transition: opacity 0.2s, transform 0.2s, background 0.2s; padding: 4px 6px; border-radius: 6px; }'
    + '.ck-legend-item:hover { opacity: 0.7; }'
    + '.ck-legend-item-active { background: rgba(79, 70, 229, 0.08); transform: translateX(4px); opacity: 1 !important; }'
    + '.ck-legend-dot { width: var(--ck-legend-dot-size, 10px); height: var(--ck-legend-dot-size, 10px); border-radius: 50%; flex-shrink: 0; }'
    + '.ck-legend-label { font-size: 13px; color: var(--ck-text-color, #64748B); flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }'
    + '.ck-legend-value { font-size: var(--ck-value-size, 15px); font-weight: var(--ck-value-weight, 600); color: var(--ck-value-color, #0F172A); white-space: nowrap; }'
    + '.ck-center-content { position: absolute; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; pointer-events: none; overflow: hidden; }'
    + '.ck-center-value { font-size: 22px; font-weight: 700; color: var(--ck-value-color, #0F172A); line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; }'
    + '.ck-center-label { font-size: 12px; color: var(--ck-text-color, #64748B); margin-top: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; }'
    + '.ck-center-unit { font-size: 11px; color: var(--ck-text-color, #64748B); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; }'
    + '.ck-tooltip { position: absolute; background: var(--ck-tooltip-bg, #1E293B); color: var(--ck-tooltip-color, #FFFFFF); border-radius: var(--ck-tooltip-radius, 8px); padding: 8px 12px; font-size: 13px; pointer-events: none; z-index: 1000; white-space: nowrap; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }'
    + '.ck-tooltip-label { font-size: 12px; opacity: 0.8; }'
    + '.ck-tooltip-value { font-size: 15px; font-weight: 600; }'
    + '.ck-footer { margin-top: auto; padding-top: 8px; }'
    + '.ck-footer-btn { background: none; border: none; padding: 8px 0; font-size: 14px; font-weight: var(--ck-footer-weight, 500); color: var(--ck-footer-color, #4F46E5); cursor: pointer; transition: opacity 0.2s; display: flex; align-items: center; gap: 4px; }'
    + '.ck-footer-btn:hover { opacity: 0.75; }'
    + '.ck-svg { overflow: visible; }'
    + '.ck-segment { transition: opacity 0.3s, transform 0.3s, filter 0.3s; }'
    + '.ck-bar { transition: opacity 0.2s; }'
    + '.ck-axis-label { user-select: none; }'
    + '.ck-bar-label { user-select: none; }'
    + '@media (max-width: 480px) {'
    + '  .ck-chart-body { flex-direction: column; }'
    + '  .ck-rtl .ck-chart-body { flex-direction: column; }'
    + '  .ck-legend { min-width: 100%; max-width: 100%; }'
    + '  .ck-legend-list { flex-direction: row; flex-wrap: wrap; }'
    + '  .ck-card { padding: 16px; }'
    + '}';
}

var ChartKit = {
  create: create,
  autoInit: autoInit,
  injectStyles: injectStyles,
  types: CHART_TYPES,
  getAvailableTypes: getAvailableTypes,
};

injectStyles();

document.addEventListener('DOMContentLoaded', function () {
  autoInit();
});

export default ChartKit;
export {
  create,
  autoInit,
  injectStyles,
  CHART_TYPES as types,
  getAvailableTypes,
};
