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
  validateNumericProp,
} from '../src/types/schema.js';

describe('validateType', () => {
  test('accepts valid chart type "donut"', () => {
    expect(validateType('donut')).toBe('donut');
  });

  test('accepts valid chart type "pie"', () => {
    expect(validateType('pie')).toBe('pie');
  });

  test('accepts valid chart type "bar"', () => {
    expect(validateType('bar')).toBe('bar');
  });

  test('throws error for invalid chart type', () => {
    expect(() => validateType('line')).toThrow('Invalid chart type');
  });
});

describe('validateData', () => {
  test('accepts valid data array', () => {
    const data = [
      { id: 'a', label: 'Item A', value: 10 },
      { id: 'b', label: 'Item B', value: 20 },
    ];
    expect(validateData(data)).toHaveLength(2);
    expect(validateData(data)[0].value).toBe(10);
  });

  test('throws error for empty array', () => {
    expect(() => validateData([])).toThrow('non-empty array');
  });

  test('throws error for non-array', () => {
    expect(() => validateData('not array')).toThrow('non-empty array');
  });

  test('throws error for item without numeric value', () => {
    expect(() => validateData([{ label: 'X', value: 'abc' }])).toThrow('non-negative numeric');
  });

  test('throws error for negative value', () => {
    expect(() => validateData([{ label: 'X', value: -5 }])).toThrow('non-negative numeric');
  });

  test('auto-generates id if missing', () => {
    const result = validateData([{ value: 10 }]);
    expect(result[0].id).toBe('0');
  });

  test('auto-generates label if missing', () => {
    const result = validateData([{ value: 42 }]);
    expect(result[0].label).toBe('42');
  });
});

describe('validateLegendConfig', () => {
  test('returns defaults for undefined config', () => {
    const result = validateLegendConfig(undefined);
    expect(result.show).toBe(true);
    expect(result.position).toBe('right');
  });

  test('returns defaults for null config', () => {
    const result = validateLegendConfig(null);
    expect(result.show).toBe(true);
    expect(result.position).toBe('right');
  });

  test('accepts custom position', () => {
    const result = validateLegendConfig({ position: 'bottom', show: true });
    expect(result.position).toBe('bottom');
  });

  test('throws for invalid position', () => {
    expect(() => validateLegendConfig({ position: 'top' })).toThrow('Invalid legend position');
  });

  test('accepts show: false', () => {
    const result = validateLegendConfig({ show: false });
    expect(result.show).toBe(false);
  });
});

describe('validateToggleConfig', () => {
  test('returns default config for undefined', () => {
    const result = validateToggleConfig(undefined);
    expect(result.show).toBe(false);
    expect(result.options).toEqual([]);
  });

  test('accepts valid toggle config', () => {
    const result = validateToggleConfig({
      show: true,
      options: [{ label: 'Amount', value: 'amount' }],
    });
    expect(result.show).toBe(true);
    expect(result.options).toHaveLength(1);
  });
});

describe('validateCenterContent', () => {
  test('returns null for undefined', () => {
    expect(validateCenterContent(undefined)).toBeNull();
  });

  test('returns null for null', () => {
    expect(validateCenterContent(null)).toBeNull();
  });

  test('parses center content config', () => {
    const result = validateCenterContent({ label: 'Total', value: '100', unit: 'USD' });
    expect(result.label).toBe('Total');
    expect(result.value).toBe('100');
    expect(result.unit).toBe('USD');
  });
});

describe('validateFooterConfig', () => {
  test('returns null for undefined', () => {
    expect(validateFooterConfig(undefined)).toBeNull();
  });

  test('returns null for null', () => {
    expect(validateFooterConfig(null)).toBeNull();
  });

  test('parses footer config', () => {
    const fn = () => {};
    const result = validateFooterConfig({ label: 'View all', onClick: fn });
    expect(result.label).toBe('View all');
    expect(result.onClick).toBe(fn);
  });

  test('sets onClick to null for non-function', () => {
    const result = validateFooterConfig({ label: 'View all', onClick: 'string' });
    expect(result.onClick).toBeNull();
  });
});

describe('validateDirection', () => {
  test('returns ltr for undefined', () => {
    expect(validateDirection(undefined)).toBe('ltr');
  });

  test('accepts rtl', () => {
    expect(validateDirection('rtl')).toBe('rtl');
  });

  test('accepts ltr', () => {
    expect(validateDirection('ltr')).toBe('ltr');
  });

  test('defaults to ltr for invalid direction', () => {
    expect(validateDirection('auto')).toBe('ltr');
  });
});

describe('validateAnimationConfig', () => {
  test('returns enabled defaults for undefined', () => {
    const result = validateAnimationConfig(undefined);
    expect(result.enabled).toBe(true);
    expect(result.duration).toBe(800);
  });

  test('returns disabled for false', () => {
    const result = validateAnimationConfig(false);
    expect(result.enabled).toBe(false);
    expect(result.duration).toBe(0);
  });

  test('accepts custom duration', () => {
    const result = validateAnimationConfig({ duration: 1200 });
    expect(result.duration).toBe(1200);
  });
});

describe('validateOthersThreshold', () => {
  test('returns default 5 for undefined', () => {
    expect(validateOthersThreshold(undefined)).toBe(5);
  });

  test('accepts valid threshold', () => {
    expect(validateOthersThreshold(10)).toBe(10);
  });

  test('clamps to 0-100 range', () => {
    expect(validateOthersThreshold(150)).toBe(5);
    expect(validateOthersThreshold(-1)).toBe(5);
  });
});

describe('validateNumericProp', () => {
  test('returns value if valid', () => {
    expect(validateNumericProp(5, 10)).toBe(5);
  });

  test('returns default for invalid', () => {
    expect(validateNumericProp('abc', 10)).toBe(10);
  });

  test('returns default for negative', () => {
    expect(validateNumericProp(-1, 10)).toBe(10);
  });
});
