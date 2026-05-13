import { getColor, generatePalette, hexToRgba, lightenColor } from '../src/utils/colors.js';

describe('getColor', () => {
  test('returns provided color when given', () => {
    expect(getColor(0, '#FF0000')).toBe('#FF0000');
  });

  test('returns palette color based on index', () => {
    expect(getColor(0, null)).toBe('#4F46E5');
  });

  test('wraps around palette length', () => {
    var first = getColor(0, null);
    var wrapped = getColor(12, null);
    expect(wrapped).toBe(first);
  });
});

describe('generatePalette', () => {
  test('generates palette of requested size', () => {
    var palette = generatePalette(5);
    expect(palette).toHaveLength(5);
  });

  test('wraps for larger counts', () => {
    var palette = generatePalette(15);
    expect(palette).toHaveLength(15);
    expect(palette[0]).toBe(palette[12]);
  });
});

describe('hexToRgba', () => {
  test('converts hex to rgba', () => {
    expect(hexToRgba('#FF0000', 0.5)).toBe('rgba(255, 0, 0, 0.5)');
  });

  test('converts hex to fully opaque rgba', () => {
    expect(hexToRgba('#00FF00', 1)).toBe('rgba(0, 255, 0, 1)');
  });
});

describe('lightenColor', () => {
  test('lightens a color', () => {
    var result = lightenColor('#000000', 50);
    expect(result).toContain('#');
  });

  test('clamps at 255', () => {
    var result = lightenColor('#FFFFFF', 50);
    expect(result).toBe('#ffffff');
  });
});
