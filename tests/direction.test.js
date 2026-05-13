import { detectDirection, applyDirection, flipLegendPosition, isRTL } from '../src/utils/direction.js';

describe('detectDirection', () => {
  test('returns rtl when element has dir="rtl"', () => {
    var el = document.createElement('div');
    el.dir = 'rtl';
    expect(detectDirection(el)).toBe('rtl');
  });

  test('returns ltr when element has dir="ltr"', () => {
    var el = document.createElement('div');
    el.dir = 'ltr';
    expect(detectDirection(el)).toBe('ltr');
  });

  test('detects direction from ancestor', () => {
    var parent = document.createElement('div');
    parent.dir = 'rtl';
    var child = document.createElement('span');
    parent.appendChild(child);
    document.body.appendChild(parent);

    expect(detectDirection(child)).toBe('rtl');

    document.body.removeChild(parent);
  });

  test('detects direction from html element', () => {
    var originalDir = document.documentElement.dir;
    document.documentElement.dir = 'rtl';

    var el = document.createElement('div');
    expect(detectDirection(el)).toBe('rtl');

    document.documentElement.dir = originalDir;
  });

  test('defaults to ltr when no direction set', () => {
    var el = document.createElement('div');
    expect(detectDirection(el)).toBe('ltr');
  });
});

describe('applyDirection', () => {
  test('sets dir attribute and class', () => {
    var el = document.createElement('div');
    el.classList.add('ck-rtl');

    applyDirection(el, 'ltr');

    expect(el.getAttribute('dir')).toBe('ltr');
    expect(el.classList.contains('ck-ltr')).toBe(true);
    expect(el.classList.contains('ck-rtl')).toBe(false);
  });
});

describe('flipLegendPosition', () => {
  test('flips right to left in RTL', () => {
    expect(flipLegendPosition('right', 'rtl')).toBe('left');
  });

  test('flips left to right in RTL', () => {
    expect(flipLegendPosition('left', 'rtl')).toBe('right');
  });

  test('does not change bottom', () => {
    expect(flipLegendPosition('bottom', 'rtl')).toBe('bottom');
  });

  test('does not flip in LTR', () => {
    expect(flipLegendPosition('right', 'ltr')).toBe('right');
  });
});

describe('isRTL', () => {
  test('returns true for rtl', () => {
    expect(isRTL('rtl')).toBe(true);
  });

  test('returns false for ltr', () => {
    expect(isRTL('ltr')).toBe(false);
  });
});
