/*! Blueprint Paper · optional script. The CSS works without it.
    Adds: auto-measured dimension lines, menu light-dismiss, toasts, theme switching.
    Load it with a script tag (defer is fine), then bp.toast('Saved'), bp.theme('whiteprint'), etc. */
(function (root) {
  'use strict';
  var bp = {};
  var PX_PER = { px: 1, mm: 96 / 25.4, cm: 96 / 2.54, in: 96 };

  // bp.format(240, 'mm') -> "63.5 mm"  (CSS px at 96 dpi; a screen mm, not a ruler mm)
  bp.format = function (px, unit, scale) {
    unit = PX_PER[unit] ? unit : 'px';
    var v = (px / PX_PER[unit]) * (scale || 1);
    var digits = unit === 'px' ? 0 : unit === 'in' ? 2 : 1;
    return (Math.round(v * Math.pow(10, digits)) / Math.pow(10, digits)) + ' ' + unit;
  };
  function parseScale(s) {               // "1:50" -> 50, "2" -> 2, "" -> 1
    if (!s) return 1;
    var m = String(s).match(/^(\d*\.?\d+)\s*:\s*(\d*\.?\d+)$/);
    return m ? (+m[2] / +m[1]) : (+s || 1);
  }

  // bp.measure(el): draws dimension lines around el's first child, kept current on resize.
  // el.dataset.measure = "w" | "h" | "w h"; dataset.unit; dataset.scale; dataset.side = "bottom right" to flip sides.
  bp.measure = function (el) {
    var which = (el.getAttribute('data-measure') || 'w h').split(/\s+/);
    var unit = el.getAttribute('data-unit') || 'px';
    var scale = parseScale(el.getAttribute('data-scale'));
    var sides = (el.getAttribute('data-side') || '').split(/\s+/);
    var target = el.querySelector(':scope > :not(.bp-measure)') || el;
    var lines = {};
    el.classList.add('bp-measured');
    if (which.indexOf('w') !== -1) {
      lines.w = document.createElement('span');
      lines.w.className = 'bp-measure ' + (sides.indexOf('bottom') !== -1 ? 'bp-measure--bottom' : 'bp-measure--top');
      el.appendChild(lines.w);
    }
    if (which.indexOf('h') !== -1) {
      lines.h = document.createElement('span');
      lines.h.className = 'bp-measure bp-measure--v ' + (sides.indexOf('right') !== -1 ? 'bp-measure--right' : 'bp-measure--left');
      el.appendChild(lines.h);
    }
    function update() {
      if (lines.w) lines.w.setAttribute('data-label', bp.format(target.offsetWidth, unit, scale));
      if (lines.h) lines.h.setAttribute('data-label', bp.format(target.offsetHeight, unit, scale));
    }
    update();
    if (root.ResizeObserver) new ResizeObserver(update).observe(target);
    return update;
  };

  // Toasts stack like Sonner: newest in front, older ones peek out behind, the stack fans out on hover,
  // timers pause while hovered, and a sideways swipe clears one.
  // bp.toast(title, text?, { solid, duration }) -> the toast element.
  // bp.toast.dismiss(el?) clears one or all. One <div class="bp-toasts"> on the page (made if missing).
  var stack = { region: null, items: [] };
  function region() {
    if (stack.region) return stack.region;
    var r = document.querySelector('.bp-toasts');
    if (!r) {
      r = document.createElement('div');
      r.className = 'bp-toasts'; r.setAttribute('role', 'status'); r.setAttribute('aria-live', 'polite');
      document.body.appendChild(r);
    }
    r.addEventListener('mouseenter', function () { r.setAttribute('data-expanded', ''); pause(true); });
    r.addEventListener('mouseleave', function () { r.removeAttribute('data-expanded'); pause(false); });
    r.addEventListener('focusin', function () { r.setAttribute('data-expanded', ''); pause(true); });
    r.addEventListener('focusout', function (e) { if (!r.contains(e.relatedTarget)) { r.removeAttribute('data-expanded'); pause(false); } });
    return (stack.region = r);
  }
  function layout() {
    var gap = parseFloat(getComputedStyle(region()).getPropertyValue('--gap')) || 8;
    var offset = 0, total = 0;
    stack.items.forEach(function (t, i) {
      t.setAttribute('data-index', i);
      t.style.setProperty('--index', i);
      t.style.setProperty('--offset', offset + 'px');
      offset += t.offsetHeight + gap;
      total = offset - gap;
    });
    region().style.setProperty('--front-h', (stack.items[0] ? stack.items[0].offsetHeight : 0) + 'px');
    region().style.setProperty('--total-h', total + 'px');
  }
  function pause(on) {
    stack.items.forEach(function (t) {
      if (!t._bp) return;
      if (on && t._bp.timer) { clearTimeout(t._bp.timer); t._bp.timer = null; t._bp.left -= Date.now() - t._bp.started; }
      else if (!on && !t._bp.timer) arm(t);
    });
  }
  function arm(t) {
    if (t._bp.left <= 0) t._bp.left = 300;
    t._bp.started = Date.now();
    t._bp.timer = setTimeout(function () { remove(t, 'is-leaving'); }, t._bp.left);
  }
  function remove(t, cls) {
    var i = stack.items.indexOf(t);
    if (i === -1) return;
    if (t._bp.timer) clearTimeout(t._bp.timer);
    stack.items.splice(i, 1);
    t.classList.add(cls);
    t.addEventListener('animationend', function () { t.remove(); });
    layout();
  }
  function swipeable(t) {
    var startX, startY, dx = 0, dy = 0, dragging = false;
    t.addEventListener('pointerdown', function (e) {
      if (e.button) return;
      startX = e.clientX; startY = e.clientY; dx = dy = 0; dragging = true;
      t.setPointerCapture(e.pointerId); t.classList.add('is-swiping');
    });
    t.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      dx = e.clientX - startX; dy = e.clientY - startY;
      t.style.setProperty('--swipe-x', dx + 'px');
    });
    function end() {
      if (!dragging) return;
      dragging = false; t.classList.remove('is-swiping');
      if (Math.abs(dx) > 45) remove(t, 'is-swiped');
      else t.style.setProperty('--swipe-x', '0px');
    }
    t.addEventListener('pointerup', end);
    t.addEventListener('pointercancel', end);
  }
  bp.toast = function (title, text, opts) {
    opts = opts || {};
    var t = document.createElement('div');
    t.className = 'bp-toast' + (opts.solid ? ' bp-toast--solid' : '');
    var h = document.createElement('span'); h.className = 'bp-toast__title'; h.textContent = title; t.appendChild(h);
    if (text) { var p = document.createElement('span'); p.className = 'bp-toast__text'; p.textContent = text; t.appendChild(p); }
    t._bp = { left: opts.duration || 4000, timer: null, started: 0 };
    region().appendChild(t);
    stack.items.unshift(t);
    swipeable(t);
    layout();
    if (!region().hasAttribute('data-expanded')) arm(t);
    while (stack.items.length > 6) remove(stack.items[stack.items.length - 1], 'is-leaving');
    return t;
  };
  bp.toast.dismiss = function (t) {
    if (t) remove(t, 'is-leaving');
    else stack.items.slice().forEach(function (x) { remove(x, 'is-leaving'); });
  };

  // bp.theme('whiteprint' | 'blueprint') sets data-theme on <html> and remembers it. bp.theme() returns the current one.
  bp.theme = function (name) {
    if (!name) return document.documentElement.getAttribute('data-theme') || 'blueprint';
    if (name === 'blueprint') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', name);
    try { localStorage.setItem('bp-theme', name); } catch (e) {}
    return name;
  };

  function init() {
    try { var saved = localStorage.getItem('bp-theme'); if (saved && saved !== 'blueprint') document.documentElement.setAttribute('data-theme', saved); } catch (e) {}
    var measured = document.querySelectorAll('[data-measure]');
    for (var i = 0; i < measured.length; i++) bp.measure(measured[i]);
    // menus close when you click elsewhere
    document.addEventListener('click', function (e) {
      var open = document.querySelectorAll('.bp-menu[open]');
      for (var m = 0; m < open.length; m++) if (!open[m].contains(e.target)) open[m].removeAttribute('open');
    });
    // code blocks and table wrappers scroll sideways, so make them keyboard reachable
    var scrollers = document.querySelectorAll('pre, .bp-table-wrap');
    for (var s = 0; s < scrollers.length; s++) if (!scrollers[s].hasAttribute('tabindex')) scrollers[s].tabIndex = 0;
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  root.bp = bp;
})(window);
