export function EventEmitter() {
  this._events = {};
}

EventEmitter.prototype.on = function on(event, listener) {
  if (!this._events[event]) {
    this._events[event] = [];
  }
  this._events[event].push(listener);
  return this;
};

EventEmitter.prototype.off = function off(event, listener) {
  if (!this._events[event]) return this;

  if (!listener) {
    delete this._events[event];
    return this;
  }

  this._events[event] = this._events[event].filter(function (l) { return l !== listener; });
  return this;
};

EventEmitter.prototype.emit = function emit(event, data) {
  if (!this._events[event]) return this;

  var listeners = this._events[event].slice();
  for (var i = 0; i < listeners.length; i++) {
    listeners[i].call(this, data);
  }
  return this;
};

EventEmitter.prototype.destroy = function destroy() {
  this._events = {};
};
