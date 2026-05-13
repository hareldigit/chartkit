import { Chart } from '../core/Chart.js';
import { SVGRenderer } from '../rendering/SVGRenderer.js';
import { Animator } from '../animation/Animator.js';
import { Card } from '../components/Card.js';
import { Tooltip } from '../components/Tooltip.js';
import { Toggle } from '../components/Toggle.js';
import { CenterContent } from '../components/CenterContent.js';
import {
  describeArc,
  calculateAngles,
  calculateTotal,
  formatValue,
  applyOthersThreshold,
  polarToCartesian,
} from '../utils/math.js';
import { getColor } from '../utils/colors.js';
import { TOGGLE_MODE, FULL_CIRCLE, HALF_CIRCLE, QUARTER_CIRCLE } from '../constants.js';

export function DonutChart(el, jsConfig) {
  Chart.call(this, el, jsConfig);

  this._renderer = new SVGRenderer(null);
  this._animator = new Animator();
  this._tooltip = new Tooltip();
  this._toggle = null;
  this._centerContent = null;
  this._card = null;
  this._segments = [];
  this._processedData = [];
  this._toggleMode = TOGGLE_MODE.AMOUNT;
  this._hoveredIndex = -1;
  this._DONUT_SIZE_RATIO = 0.7;

  this._init();
}

DonutChart.prototype = Object.create(Chart.prototype);
DonutChart.prototype.constructor = DonutChart;

DonutChart.prototype._init = function _init() {
  var config = this._config;

  this._card = new Card(config);
  this._el.appendChild(this._card.getElement());

  this._renderer = new SVGRenderer(this._card.getChartArea());
  this._tooltip.attachTo(this._card.getChartArea());

  if (config.centerContent) {
    this._centerContent = new CenterContent(config.centerContent);
    this._card.getChartArea().appendChild(this._centerContent.getElement());
  }

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

  this._setupLegendHover();
};

DonutChart.prototype._setupLegendHover = function _setupLegendHover() {
  var self = this;
  var legend = this._card.getLegend();
  if (!legend) return;

  var chartArea = this._card.getChartArea();

  function handler(e) {
    var detail = e.detail;
    var segments = self._segments;
    if (!segments) return;

    for (var i = 0; i < segments.length; i++) {
      var seg = segments[i];
      if (!seg || !seg.data || !seg.path) continue;
      if (seg.data.id === detail.item.id) {
        if (detail.action === 'enter') {
          seg.path.setAttribute('transform', 'scale(1.08)');
          seg.path.setAttribute('opacity', '0.85');
          seg.path.style.filter = 'drop-shadow(0 2px 6px rgba(0,0,0,0.2))';
        } else {
          seg.path.setAttribute('transform', 'scale(1)');
          seg.path.setAttribute('opacity', '1');
          seg.path.style.filter = 'none';
        }
      }
    }
  }

  chartArea.addEventListener('legend-hover', handler);
  this._legendHoverHandler = handler;
};

DonutChart.prototype.render = function render() {
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

  var size = Math.min(width, height);
  var cx = width / 2;
  var cy = height / 2;
  var outerRadius = (size / 2) * this._DONUT_SIZE_RATIO;
  var innerRadius = outerRadius * config.innerRadius;

  renderer.init(width, height);

  chartArea.appendChild(this._tooltip._el);

  if (this._centerContent) {
    chartArea.appendChild(this._centerContent.getElement());
  }

  this._setupCenterContent(innerRadius);

  var total = calculateTotal(data);
  var thresholdResult = applyOthersThreshold(data, config.othersThreshold);
  this._processedData = thresholdResult.items;

  var enrichedData = this._processedData.map(function (item, index) {
    return {
      id: item.id,
      label: item.label,
      value: item.value,
      color: getColor(index, item.color),
      isOthers: item.isOthers || false,
    };
  });

  var angles = calculateAngles(enrichedData, total);

  this._segments = [];

  for (var i = 0; i < enrichedData.length; i++) {
    var item = enrichedData[i];
    var angle = angles[i];
    var segmentGap = config.segmentGap;

    var segStartAngle = angle.startAngle + (i > 0 ? segmentGap * 0.5 : 0);
    var segEndAngle = angle.endAngle - segmentGap * 0.5;

    if (segEndAngle - segStartAngle < 1) continue;

    var d = describeArc(cx, cy, outerRadius, innerRadius, segStartAngle, segEndAngle);

    var path = renderer.createPath(d, {
      fill: item.color,
      stroke: 'var(--ck-segment-gap-color)',
      'stroke-width': config.segmentGap,
      'data-index': i,
      'data-id': item.id,
      class: 'ck-segment',
      style: 'cursor: pointer; transform-origin: ' + cx + 'px ' + cy + 'px;',
    });

    this._segments.push({
      path: path,
      data: item,
      angle: angle,
      cx: cx,
      cy: cy,
      outerRadius: outerRadius,
      innerRadius: innerRadius,
    });

    this._attachSegmentHover(path, i, cx, cy, item);
  }

  if (config.animation.enabled && config.animation.duration > 0) {
    this._animateEntry(config.animation.duration);
  }

  this._updateLegend();
};

DonutChart.prototype._setupCenterContent = function _setupCenterContent(innerRadius) {
  if (!this._centerContent) return;

  var maxCenterSize = innerRadius * 1.6;
  var availableWidth = maxCenterSize * 0.85;
  var el = this._centerContent.getElement();
  el.style.maxWidth = maxCenterSize + 'px';
  el.style.maxHeight = maxCenterSize + 'px';
  el.style.left = '50%';
  el.style.top = '50%';
  el.style.transform = 'translate(-50%, -50%)';

  this._scaleCenterText(availableWidth);
};

DonutChart.prototype._scaleCenterText = function _scaleCenterText(availableWidth) {
  var cc = this._centerContent;
  if (!cc) return;

  var valueEl = cc._valueEl;
  var labelEl = cc._labelEl;
  var unitEl = cc._unitEl;

  var BASE_VALUE_SIZE = 22;
  var BASE_LABEL_SIZE = 12;
  var BASE_UNIT_SIZE = 11;
  var CHAR_WIDTH_RATIO = 0.55;

  if (valueEl && valueEl.textContent) {
    var valueChars = valueEl.textContent.length;
    var valueFontSize = scaleToFit(valueChars, availableWidth, BASE_VALUE_SIZE, CHAR_WIDTH_RATIO);
    valueEl.style.fontSize = valueFontSize + 'px';
  }

  if (labelEl && labelEl.textContent) {
    var labelChars = labelEl.textContent.length;
    var labelFontSize = scaleToFit(labelChars, availableWidth, BASE_LABEL_SIZE, CHAR_WIDTH_RATIO);
    labelEl.style.fontSize = labelFontSize + 'px';
  }

  if (unitEl && unitEl.textContent) {
    var unitChars = unitEl.textContent.length;
    var unitFontSize = scaleToFit(unitChars, availableWidth, BASE_UNIT_SIZE, CHAR_WIDTH_RATIO);
    unitEl.style.fontSize = unitFontSize + 'px';
  }
};

function scaleToFit(charCount, availableWidth, baseSize, ratio) {
  var estimatedWidth = charCount * baseSize * ratio;
  if (estimatedWidth <= availableWidth) return baseSize;
  return Math.max(8, (availableWidth / (charCount * ratio)));
}

DonutChart.prototype._animateEntry = function _animateEntry(duration) {
  var self = this;
  var animator = this._animator;

  animator.cancel();

  if (this._segments.length === 0) return;

  for (var i = 0; i < this._segments.length; i++) {
    var s = this._segments[i];
    if (s && s.path) {
      s.path.setAttribute('opacity', '0');
      s.path.setAttribute('transform', 'rotate(-90) scale(0.6)');
    }
  }

  animator.animateSequence(this._segments.length, duration, function (progress, index) {
    if (index < 0 || index >= self._segments.length) return;

    var seg = self._segments[index];
    if (!seg || !seg.path) return;
    var eased = easeOutBack(progress);

    var rotation = -90 * (1 - eased);
    var scale = 0.6 + eased * 0.4;
    var opacity = eased;

    seg.path.setAttribute('transform', 'rotate(' + rotation + ') scale(' + scale + ')');
    seg.path.setAttribute('opacity', opacity.toString());
  });
};

function easeOutBack(t) {
  var c1 = 1.70158;
  var c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

DonutChart.prototype._attachSegmentHover = function _attachSegmentHover(path, index, cx, cy, item) {
  var self = this;

  path.addEventListener('mouseenter', function (e) {
    self._hoveredIndex = index;

    path.setAttribute('transform', 'scale(1.08)');
    path.setAttribute('opacity', '0.85');
    path.style.filter = 'drop-shadow(0 2px 6px rgba(0,0,0,0.2))';

    var rect = self._card.getChartArea().getBoundingClientRect();
    self._tooltip.show(
      e.clientX - rect.left + 12,
      e.clientY - rect.top - 40,
      item.label,
      formatValue(item.value, self._toggleMode),
      item.color
    );

    self._highlightLegendItem(item.id);

    if (self._segments) {
      for (var i = 0; i < self._segments.length; i++) {
        if (i !== index && self._segments[i].path) {
          self._segments[i].path.setAttribute('opacity', '0.3');
          self._segments[i].path.style.filter = 'none';
        }
      }
    }
  });

  path.addEventListener('mouseleave', function () {
    self._hoveredIndex = -1;

    path.setAttribute('transform', 'scale(1)');
    path.setAttribute('opacity', '1');
    path.style.filter = 'none';
    self._tooltip.hide();
    self._unhighlightLegendItem(item.id);

    if (self._segments) {
      for (var i = 0; i < self._segments.length; i++) {
        if (self._segments[i].path) {
          self._segments[i].path.setAttribute('opacity', '1');
          self._segments[i].path.style.filter = 'none';
        }
      }
    }
  });

  path.addEventListener('mousemove', function (e) {
    if (self._hoveredIndex === index) {
      var rect = self._card.getChartArea().getBoundingClientRect();
      self._tooltip.updatePosition(
        e.clientX - rect.left + 12,
        e.clientY - rect.top - 40
      );
    }
  });
};

DonutChart.prototype._updateLegend = function _updateLegend() {
  var legend = this._card.getLegend();
  if (!legend) return;

  var self = this;

  legend.build(this._processedData, function (item) {
    return formatValue(item.value, self._toggleMode);
  });
};

DonutChart.prototype._highlightLegendItem = function _highlightLegendItem(id) {
  var legend = this._card.getLegend();
  if (!legend || !legend._listEl) return;

  var row = legend._listEl.querySelector('[data-id="' + id + '"]');
  if (row) {
    row.classList.add('ck-legend-item-active');
  }
};

DonutChart.prototype._unhighlightLegendItem = function _unhighlightLegendItem(id) {
  var legend = this._card.getLegend();
  if (!legend || !legend._listEl) return;

  var row = legend._listEl.querySelector('[data-id="' + id + '"]');
  if (row) {
    row.classList.remove('ck-legend-item-active');
  }
};

DonutChart.prototype.updateData = function updateData(newData) {
  Chart.prototype.updateData.call(this, newData);

  if (this._centerContent && this._config.centerContent) {
    var total = calculateTotal(newData);
    this._centerContent.update({
      label: this._config.centerContent.label,
      value: formatValue(total, TOGGLE_MODE.AMOUNT),
      unit: this._config.centerContent.unit,
    });
  }
};

DonutChart.prototype.destroy = function destroy() {
  this._animator.cancel();
  this._tooltip.destroy();
  if (this._toggle) this._toggle.destroy();
  if (this._centerContent) this._centerContent.destroy();
  if (this._card) this._card.destroy();
  Chart.prototype.destroy.call(this);
};
