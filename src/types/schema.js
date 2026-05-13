import { CHART_TYPES, LEGEND_POSITIONS, DIRECTION, TOGGLE_MODE } from '../constants.js';

export function validateType(type) {
  const valid = Object.values(CHART_TYPES);
  if (!valid.includes(type)) {
    throw new Error(`Invalid chart type "${type}". Must be one of: ${valid.join(', ')}`);
  }
  return type;
}

export function validateData(data) {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Chart data must be a non-empty array.');
  }

  return data.map(function validateItem(item, index) {
    if (typeof item !== 'object' || item === null) {
      throw new Error(`Data item at index ${index} must be an object.`);
    }
    if (typeof item.value !== 'number' || item.value < 0) {
      throw new Error(`Data item at index ${index} must have a non-negative numeric "value".`);
    }
    return {
      id: item.id || String(index),
      label: typeof item.label === 'string' ? item.label : String(item.value),
      value: item.value,
      color: item.color || null,
    };
  });
}

export function validateLegendConfig(config) {
  if (!config) return { position: LEGEND_POSITIONS.RIGHT, show: true };

  const position = config.position || LEGEND_POSITIONS.RIGHT;
  const valid = Object.values(LEGEND_POSITIONS);
  if (!valid.includes(position)) {
    throw new Error(`Invalid legend position "${position}". Must be one of: ${valid.join(', ')}`);
  }

  return {
    position: position,
    show: config.show !== false,
  };
}

export function validateToggleConfig(config) {
  if (!config) return { show: false, options: [], defaultValue: TOGGLE_MODE.AMOUNT };

  return {
    show: config.show !== false && Array.isArray(config.options) && config.options.length > 0,
    options: Array.isArray(config.options) ? config.options : [],
    defaultValue: config.defaultValue || TOGGLE_MODE.AMOUNT,
  };
}

export function validateCenterContent(config) {
  if (!config) return null;

  return {
    label: config.label || '',
    value: config.value || '',
    unit: config.unit || '',
  };
}

export function validateFooterConfig(config) {
  if (!config) return null;

  return {
    label: config.label || '',
    onClick: typeof config.onClick === 'function' ? config.onClick : null,
  };
}

export function validateDirection(direction) {
  if (!direction) return DIRECTION.LTR;

  const valid = Object.values(DIRECTION);
  if (!valid.includes(direction)) {
    return DIRECTION.LTR;
  }
  return direction;
}

export function validateAnimationConfig(config) {
  if (config === false) return { enabled: false, duration: 0 };
  if (!config) return { enabled: true, duration: 800 };

  return {
    enabled: config.enabled !== false,
    duration: typeof config.duration === 'number' && config.duration > 0 ? config.duration : 800,
  };
}

export function validateNumericProp(value, defaultValue) {
  if (typeof value !== 'number' || value < 0) return defaultValue;
  return value;
}

export function validateOthersThreshold(value) {
  const num = Number(value);
  if (isNaN(num) || num < 0 || num > 100) return 5;
  return num;
}
