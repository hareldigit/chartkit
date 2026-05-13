import {
  polarToCartesian,
  describeArc,
  calculateAngles,
  calculateTotal,
  formatValue,
  applyOthersThreshold,
  clamp,
} from '../src/utils/math.js';

describe('calculateTotal', () => {
  test('calculates sum of values', () => {
    const data = [{ value: 10 }, { value: 20 }, { value: 30 }];
    expect(calculateTotal(data)).toBe(60);
  });

  test('returns 0 for empty array', () => {
    expect(calculateTotal([])).toBe(0);
  });

  test('handles single item', () => {
    const data = [{ value: 42 }];
    expect(calculateTotal(data)).toBe(42);
  });
});

describe('calculateAngles', () => {
  test('calculates angles for 100% distribution', () => {
    const data = [
      { value: 50, label: 'A' },
      { value: 50, label: 'B' },
    ];
    const result = calculateAngles(data, 100);

    expect(result[0].startAngle).toBe(0);
    expect(result[0].endAngle).toBe(180);
    expect(result[0].percentage).toBe(50);

    expect(result[1].startAngle).toBe(180);
    expect(result[1].endAngle).toBe(360);
    expect(result[1].percentage).toBe(50);
  });

  test('handles total of zero', () => {
    const data = [{ value: 10 }];
    const result = calculateAngles(data, 0);
    expect(result[0].angle).toBe(0);
    expect(result[0].percentage).toBe(0);
  });
});

describe('formatValue', () => {
  test('formats amount with K for thousands', () => {
    expect(formatValue(1500, 'amount')).toBe('1.5K');
  });

  test('formats amount with M for millions', () => {
    expect(formatValue(2500000, 'amount')).toBe('2.5M');
  });

  test('formats amount with B for billions', () => {
    expect(formatValue(1500000000, 'amount')).toBe('1.5B');
  });

  test('formats percent', () => {
    expect(formatValue(42.567, 'percent')).toBe('42.6%');
  });

  test('formats small values', () => {
    expect(formatValue(42, 'amount')).toBe('42.0');
  });
});

describe('applyOthersThreshold', () => {
  test('returns original data when threshold is 0', () => {
    const data = [
      { id: 'a', value: 10 },
      { id: 'b', value: 20 },
    ];
    const result = applyOthersThreshold(data, 0);
    expect(result.hasOthers).toBe(false);
    expect(result.items).toHaveLength(2);
  });

  test('returns original data when threshold is undefined', () => {
    const data = [{ id: 'a', value: 10 }];
    const result = applyOthersThreshold(data, undefined);
    expect(result.hasOthers).toBe(false);
  });

  test('groups small items into Others', () => {
    const data = [
      { id: 'a', label: 'A', value: 50 },
      { id: 'b', label: 'B', value: 30 },
      { id: 'c', label: 'C', value: 10 },
      { id: 'd', label: 'D', value: 5 },
      { id: 'e', label: 'E', value: 2 },
      { id: 'f', label: 'F', value: 2 },
      { id: 'g', label: 'G', value: 1 },
    ];
    const result = applyOthersThreshold(data, 10);
    expect(result.hasOthers).toBe(true);
    expect(result.items.length).toBeLessThan(data.length);
  });
});

describe('clamp', () => {
  test('clamps value within range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  test('clamps below minimum', () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  test('clamps above maximum', () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });
});

describe('polarToCartesian', () => {
  test('converts 0 degrees', () => {
    const result = polarToCartesian(100, 100, 50, 0);
    expect(result.x).toBeCloseTo(100);
    expect(result.y).toBeCloseTo(50);
  });

  test('converts 90 degrees', () => {
    const result = polarToCartesian(100, 100, 50, 90);
    expect(result.x).toBeCloseTo(150);
    expect(result.y).toBeCloseTo(100);
  });
});

describe('describeArc', () => {
  test('generates SVG path for pie segment (inner 0)', () => {
    const d = describeArc(100, 100, 80, 0, 0, 90);
    expect(d).toContain('M');
    expect(d).toContain('A');
    expect(d).toContain('Z');
  });

  test('generates SVG path for donut segment', () => {
    const d = describeArc(100, 100, 80, 40, 0, 90);
    expect(d).toContain('M');
    expect(d).toContain('A');
    expect(d).toContain('L');
    expect(d).toContain('Z');
  });
});
