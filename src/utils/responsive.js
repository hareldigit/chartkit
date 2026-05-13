export function createResizeObserver(el, callback) {
  if (typeof ResizeObserver === 'undefined') {
    fallbackResize(el, callback);
    return null;
  }

  var observer = new ResizeObserver(function () {
    callback();
  });
  observer.observe(el);
  return observer;
}

export function destroyResizeObserver(observer) {
  if (observer && observer.disconnect) {
    observer.disconnect();
  }
}

function fallbackResize(el, callback) {
  var debounceTimer = null;

  function handleResize() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(callback, 100);
  }

  window.addEventListener('resize', handleResize);

  el._resizeCleanup = function () {
    window.removeEventListener('resize', handleResize);
    clearTimeout(debounceTimer);
  };
}
