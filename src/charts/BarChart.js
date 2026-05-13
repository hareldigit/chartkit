import { Chart } from '../core/Chart.js';
import { SVGRenderer } from '../rendering/SVGRenderer.js';
import { Animator } from '../animation/Animator.js';
import { Card } from '../components/Card.js';
import { Tooltip } from '../components/Tooltip.js';
import { Toggle } from '../components/Toggle.js';
import { getColor, lightenColor } from '../utils/colors.js';
import { calculateTotal, formatValue, clamp } from '../utils/math.js';
import { TOGGLE_MODE } from '../constants.js';

var PADDING = { top: 20, right: 20, bottom: 40, left: 60 };
var BAR_MAX_WIDTH = 60;
var AXIS_COLOR = '#E2E8F0';
var LABEL_COLOR = '#94A3B8';

export function BarChart(el, jsConfig) {
  Chart.call(this, el, jsConfig);

  this._renderer = new SVGRenderer(null);
  this._animator = new Animator();
  this._tooltip = new Tooltip();
  this._toggle = null;
  this._card = null;
  this._bars = [];
  this._toggleMode = TOGGLE_MODE.AMOUNT;
  this._MAX_BAR_RATIO = 0.85;

  this._init();
}

BarChart.prototype = Object.create(Chart.prototype);
BarChart.prototype.constructor = BarChart;

BarChart.prototype._init = function _init() {
  var config = this._config;

  this._card = new Card(config);
  this._el.appendChild(this._card.getElement());

  this._renderer = new SVGRenderer(this._card.getChartArea());
  this._tooltip.attachTo(this._card.getChartArea());

  if (config.toggle && config.toggle.show) {
    this._toggle = new Toggle(config.toggle);
    this._card.getHeader().render(this._toggle.getElement());

    var self = this;
    this._toggle.on('change', function (data) {
      self._toggleMode = data.value.value;
      self._updateLegend();
    });
  }

  this.render();
};

BarChart.prototype.render = function render() {
  if (this._isDestroyed) return;

  var config = this._config;
  var data = config.data;
  var renderer = this._renderer;

  var chartArea = this._card.getChartArea();
  var width = chartArea.clientWidth;
  var height = chartArea.clientHeight;

  if (width === 0 || height === 0) {
    var self = this;
    requestAnimationFrame(function () { self.render(); });
    return;
  }

  renderer.init(width, height);

  var plotLeft = PADDING.left;
  var plotRight = width - PADDING.right;
  var plotTop = PADDING.top;
  var plotBottom = height - PADDING.bottom;
  var plotWidth = plotRight - plotLeft;
  var plotHeight = plotBottom - plotTop;

  var maxValue = 0;
  for (var i = 0; i < data.length; i++) {
    if (data[i].value > maxValue) maxValue = data[i].value;
  }
  if (maxValue === 0) maxValue = 1;

  this._drawAxes(renderer, plotLeft, plotRight, plotTop, plotBottom, maxValue);
  this._drawBars(renderer, data, plotLeft, plotTop, plotWidth, plotHeight, maxValue);
  this._updateLegend();

  if (config.animation.enabled && config.animation.duration > 0) {
    this._animateEntry(config.animation.duration, maxValue, plotBottom);
  }
};

BarChart.prototype._drawAxes = function _drawAxes(renderer, left, right, top, bottom, maxValue) {
  var yLine = renderer.createLine(left, top, left, bottom, {
    stroke: AXIS_COLOR,
    'stroke-width': '1',
  });

  var xLine = renderer.createLine(left, bottom, right, bottom, {
    stroke: AXIS_COLOR,
    'stroke-width': '1',
  });

  var yTicks = 5;
  for (var i = 0; i <= yTicks; i++) {
    var value = (maxValue / yTicks) * i;
    var y = bottom - (bottom - top) * (i / yTicks);

    if (i > 0) {
      renderer.createLine(left - 6, y, left, y, {
        stroke: AXIS_COLOR,
        'stroke-width': '1',
      });

      renderer.createText(formatValue(value, TOGGLE_MODE.AMOUNT), left - 10, y + 4, {
        fill: LABEL_COLOR,
        'font-size': '11px',
        'text-anchor': 'end',
        class: 'ck-axis-label',
      });
    }
  }
};

BarChart.prototype._drawBars = function _drawBars(renderer, data, plotLeft, plotTop, plotWidth, plotHeight, maxValue) {
  var barCount = data.length;
  var barGroupWidth = plotWidth / barCount;
  var barWidth = Math.min(barGroupWidth * this._MAX_BAR_RATIO, BAR_MAX_WIDTH);
  var barSpacing = (barGroupWidth - barWidth) / 2;
  var barRadius = 4;

  this._bars = [];

  for (var i = 0; i < data.length; i++) {
    var item = data[i];
    var color = getColor(i, item.color);
    var barHeight = (item.value / maxValue) * plotHeight;
    var x = plotLeft + i * barGroupWidth + barSpacing;
    var baseline = plotTop + plotHeight;
    var barTop = baseline - barHeight;

    var rect = renderer.createRect({
      x: x,
      y: barTop,
      width: barWidth,
      height: barHeight,
      fill: color,
      rx: barRadius,
      ry: barRadius,
      'data-index': i,
      'data-id': item.id,
      class: 'ck-bar',
    });

    var barLabelY = baseline + 16;

    var label = renderer.createText(item.label, x + barWidth / 2, barLabelY, {
      fill: LABEL_COLOR,
      'font-size': '11px',
      'text-anchor': 'middle',
      class: 'ck-bar-label',
    });

    this._bars.push({
      rect: rect,
      label: label,
      data: item,
      color: color,
      baseline: baseline,
      barTop: barTop,
      targetHeight: barHeight,
    });

    this._attachBarHover(rect, i, item, x, barTop, barWidth, barHeight);
  }
};

BarChart.prototype._animateEntry = function _animateEntry(duration, maxValue, plotBottom) {
  var self = this;
  var animator = this._animator;
  var bars = this._bars;

  animator.cancel();
  if (!bars || bars.length === 0) return;

  self._finalizeBars();
  return;

  for (var i = 0; i < bars.length; i++) {
    bars[i].rect.setAttribute('y', bars[i].baseline);
    bars[i].rect.setAttribute('height', '0');
  }

  animator.animateSequence(bars.length, duration, function (progress, index) {
    if (index < 0 || index >= bars.length) {
      self._finalizeBars();
      return;
    }

    var bar = bars[index];
    var h = progress * bar.targetHeight;

    bar.rect.setAttribute('y', bar.baseline - h);
    bar.rect.setAttribute('height', Math.max(0, h).toString());
    bar.rect.setAttribute('fill', progress > 0.25 ? bar.color : lightenColor(bar.color, 40));
  });

  var safety = setTimeout(function () {
    self._finalizeBars();
  }, duration + 300);
  this._animSafety = safety;
};

BarChart.prototype._finalizeBars = function _finalizeBars() {
  if (!this._bars) return;
  for (var i = 0; i < this._bars.length; i++) {
    var bar = this._bars[i];
    if (bar && bar.rect) {
      bar.rect.setAttribute('y', bar.barTop);
      bar.rect.setAttribute('height', bar.targetHeight.toString());
      bar.rect.setAttribute('fill', bar.color);
    }
  }
  if (this._animSafety) { clearTimeout(this._animSafety); this._animSafety = null; }
};

BarChart.prototype._attachBarHover = function _attachBarHover(rect, index, item, x, y, barWidth, barHeight) {
  var self = this;

  rect.addEventListener('mouseenter', function (e) {
    rect.setAttribute('opacity', '0.85');
    rect.setAttribute('fill', lightenColor(item.color || getColor(index), 20));

    var chartArea = self._card.getChartArea();
    var chartRect = chartArea.getBoundingClientRect();

    self._tooltip.show(
      e.clientX - chartRect.left + 12,
      e.clientY - chartRect.top - 40,
      item.label,
      formatValue(item.value, self._toggleMode),
      item.color || getColor(index)
    );

    if (self._bars) {
      for (var i = 0; i < self._bars.length; i++) {
        if (i !== index && self._bars[i].rect) {
          self._bars[i].rect.setAttribute('opacity', '0.3');
        }
      }
    }
  });

  rect.addEventListener('mouseleave', function () {
    rect.setAttribute('opacity', '1');
    if (item.color) {
      rect.setAttribute('fill', item.color);
    } else {
      rect.setAttribute('fill', getColor(index));
    }
    self._tooltip.hide();

    if (self._bars) {
      for (var i = 0; i < self._bars.length; i++) {
        if (self._bars[i].rect) {
          self._bars[i].rect.setAttribute('opacity', '1');
        }
      }
    }
  });

  rect.addEventListener('mousemove', function (e) {
    var chartArea = self._card.getChartArea();
    var chartRect = chartArea.getBoundingClientRect();
    self._tooltip.updatePosition(
      e.clientX - chartRect.left + 12,
      e.clientY - chartRect.top - 40
    );
  });
};

BarChart.prototype._updateLegend = function _updateLegend() {
  var legend = this._card.getLegend();
  if (!legend) return;

  var self = this;

  legend.build(this._config.data, function (item) {
    return formatValue(item.value, self._toggleMode);
  });
};

BarChart.prototype.destroy = function destroy() {
  this._animator.cancel();
  this._tooltip.destroy();
  if (this._toggle) this._toggle.destroy();
  if (this._card) this._card.destroy();
  Chart.prototype.destroy.call(this);
};
