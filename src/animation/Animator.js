import { DEFAULT_ANIMATION_DURATION } from '../constants.js';

export function Animator() {
  this._animationFrameId = null;
}

Animator.prototype.animate = function animate(callback, duration, easing) {
  var self = this;
  var startTime = null;
  var animDuration = duration || DEFAULT_ANIMATION_DURATION;
  var easingFn = easing || easeInOutCubic;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    var elapsed = timestamp - startTime;
    var progress = Math.min(elapsed / animDuration, 1);
    var easedProgress = easingFn(progress);

    callback(easedProgress);

    if (progress < 1) {
      self._animationFrameId = requestAnimationFrame(step);
    }
  }

  this._animationFrameId = requestAnimationFrame(step);
};

Animator.prototype.animateSequence = function animateSequence(items, duration, callback) {
  var self = this;
  var index = 0;
  var itemDuration = duration / items;

  function animateNext() {
    if (index >= items) {
      callback(1, -1);
      return;
    }

    var startTime = null;
    var itemIndex = index;
    index++;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var elapsed = timestamp - startTime;
      var progress = Math.min(elapsed / itemDuration, 1);
      var easedProgress = easeInOutCubic(progress);

      callback(easedProgress, itemIndex);

      if (progress < 1) {
        self._animationFrameId = requestAnimationFrame(step);
      } else {
        animateNext();
      }
    }

    self._animationFrameId = requestAnimationFrame(step);
  }

  animateNext();
};

Animator.prototype.cancel = function cancel() {
  if (this._animationFrameId) {
    cancelAnimationFrame(this._animationFrameId);
    this._animationFrameId = null;
  }
};

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function easeOutQuad(t) {
  return 1 - (1 - t) * (1 - t);
}

export function easeOutBounce(t) {
  var n1 = 7.5625;
  var d1 = 2.75;

  if (t < 1 / d1) {
    return n1 * t * t;
  } else if (t < 2 / d1) {
    return n1 * (t -= 1.5 / d1) * t + 0.75;
  } else if (t < 2.5 / d1) {
    return n1 * (t -= 2.25 / d1) * t + 0.9375;
  } else {
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
  }
}
