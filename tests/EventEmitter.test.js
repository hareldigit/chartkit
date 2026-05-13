import { EventEmitter } from '../src/core/EventEmitter.js';

describe('EventEmitter', () => {
  test('emits event to registered listener', () => {
    var ee = new EventEmitter();
    var received = null;

    ee.on('test', function (data) {
      received = data;
    });

    ee.emit('test', { value: 42 });
    expect(received).toEqual({ value: 42 });
  });

  test('supports multiple listeners for same event', () => {
    var ee = new EventEmitter();
    var count = 0;

    ee.on('test', function () { count++; });
    ee.on('test', function () { count++; });

    ee.emit('test');
    expect(count).toBe(2);
  });

  test('supports off with specific listener', () => {
    var ee = new EventEmitter();
    var count = 0;
    var listener = function () { count++; };

    ee.on('test', listener);
    ee.on('test', function () { count++; });
    ee.off('test', listener);

    ee.emit('test');
    expect(count).toBe(1);
  });

  test('supports off without listener (removes all)', () => {
    var ee = new EventEmitter();
    var count = 0;

    ee.on('test', function () { count++; });
    ee.on('test', function () { count++; });
    ee.off('test');

    ee.emit('test');
    expect(count).toBe(0);
  });

  test('chaining works', () => {
    var ee = new EventEmitter();
    var received = null;

    ee.on('test', function (d) { received = d; })
      .emit('test', 'hello');

    expect(received).toBe('hello');
  });

  test('does not throw when emitting with no listeners', () => {
    var ee = new EventEmitter();
    expect(function () { ee.emit('nonexistent'); }).not.toThrow();
  });

  test('destroy clears all events', () => {
    var ee = new EventEmitter();
    var count = 0;

    ee.on('test', function () { count++; });
    ee.destroy();
    ee.emit('test');

    expect(count).toBe(0);
  });

  test('does not mutate listeners during emit if listener adds/removes', () => {
    var ee = new EventEmitter();
    var results = [];

    ee.on('test', function () {
      results.push('first');
      ee.off('test');
    });

    ee.on('test', function () {
      results.push('second');
    });

    ee.emit('test');
    expect(results).toEqual(['first', 'second']);
  });
});
