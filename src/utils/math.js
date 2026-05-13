import { FULL_CIRCLE, HALF_CIRCLE, QUARTER_CIRCLE, DEG_TO_RAD } from '../constants.js';

export function polarToCartesian(cx, cy, radius, angleDeg) {
  var rad = (angleDeg - QUARTER_CIRCLE) * DEG_TO_RAD;
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad),
  };
}

export function describeArc(cx, cy, outerRadius, innerRadius, startAngle, endAngle) {
  var startOuter = polarToCartesian(cx, cy, outerRadius, startAngle);
  var endOuter = polarToCartesian(cx, cy, outerRadius, endAngle);

  var largeArcFlag = endAngle - startAngle > HALF_CIRCLE ? 1 : 0;

  if (innerRadius === 0) {
    return [
      'M', cx, cy,
      'L', startOuter.x, startOuter.y,
      'A', outerRadius, outerRadius, 0, largeArcFlag, 1, endOuter.x, endOuter.y,
      'Z',
    ].join(' ');
  }

  var startInner = polarToCartesian(cx, cy, innerRadius, startAngle);
  var endInner = polarToCartesian(cx, cy, innerRadius, endAngle);

  return [
    'M', startOuter.x, startOuter.y,
    'A', outerRadius, outerRadius, 0, largeArcFlag, 1, endOuter.x, endOuter.y,
    'L', endInner.x, endInner.y,
    'A', innerRadius, innerRadius, 0, largeArcFlag, 0, startInner.x, startInner.y,
    'Z',
  ].join(' ');
}

export function calculateAngles(data, total) {
  var currentAngle = 0;
  return data.map(function (item) {
    var percentage = total > 0 ? (item.value / total) * 100 : 0;
    var angle = total > 0 ? (item.value / total) * FULL_CIRCLE : 0;
    var startAngle = currentAngle;
    currentAngle += angle;
    return {
      startAngle: startAngle,
      endAngle: currentAngle,
      angle: angle,
      percentage: percentage,
    };
  });
}

export function calculateTotal(data) {
  return data.reduce(function (sum, item) { return sum + item.value; }, 0);
}

export function formatValue(value, format) {
  if (format === 'percent') {
    return value.toFixed(1) + '%';
  }

  if (value >= 1000000000) {
    return (value / 1000000000).toFixed(1) + 'B';
  }
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M';
  }
  if (value >= 1000) {
    return (value / 1000).toFixed(1) + 'K';
  }
  return value.toFixed(1);
}

export function applyOthersThreshold(data, thresholdPercent) {
  if (!thresholdPercent || thresholdPercent <= 0) return { items: data, hasOthers: false, othersCount: 0 };

  var total = calculateTotal(data);
  var threshold = (thresholdPercent / 100) * total;

  var mainItems = [];
  var othersItems = [];
  var othersValue = 0;

  for (var i = 0; i < data.length; i++) {
    if (data[i].value < threshold && mainItems.length >= 5) {
      othersItems.push(data[i]);
      othersValue += data[i].value;
    } else {
      mainItems.push(data[i]);
    }
  }

  if (othersItems.length === 0) return { items: data, hasOthers: false, othersCount: 0 };

  mainItems.push({
    id: '__others__',
    label: 'Others (' + othersItems.length + ')',
    value: othersValue,
    color: '#94A3B8',
    isOthers: true,
  });

  return {
    items: mainItems,
    hasOthers: true,
    othersCount: othersItems.length,
    othersItems: othersItems,
  };
}

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
