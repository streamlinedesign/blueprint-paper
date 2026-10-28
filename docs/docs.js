// Docs search: filters sections by their text and keywords. No dependencies.
(function () {
  var q = document.getElementById('q');
  var count = document.getElementById('q-count');
  var docs = Array.prototype.slice.call(document.querySelectorAll('.doc'));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.side a'));
  var index = docs.map(function (el) {
    return { el: el, text: (el.textContent + ' ' + (el.getAttribute('data-keywords') || '')).toLowerCase() };
  });
  var empty = document.createElement('p');
  empty.className = 'no-results';
  empty.hidden = true;
  document.querySelector('.content').insertBefore(empty, document.querySelector('.foot'));

  function run() {
    var terms = q.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    var shown = 0;
    index.forEach(function (d) {
      var hit = terms.every(function (t) { return d.text.indexOf(t) !== -1; });
      d.el.hidden = !hit;
      if (hit) shown++;
    });
    navLinks.forEach(function (a) {
      var target = document.querySelector(a.getAttribute('href'));
      a.hidden = !!(terms.length && target && target.hidden);
    });
    empty.hidden = shown > 0;
    empty.textContent = 'Nothing matches "' + q.value.trim() + '". Try a class name like bp-switch, or a word like vertical.';
    count.textContent = terms.length ? shown + (shown === 1 ? ' section' : ' sections') : '';
  }
  q.addEventListener('input', run);
  document.addEventListener('keydown', function (e) {
    if (e.key === '/' && document.activeElement !== q && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { e.preventDefault(); q.focus(); }
    if (e.key === 'Escape' && document.activeElement === q) { q.value = ''; run(); q.blur(); }
  });

  // mark the section in view
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navLinks.forEach(function (a) { a.removeAttribute('aria-current'); });
        var a = document.querySelector('.side a[href="#' + en.target.id + '"]');
        if (a) a.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    docs.forEach(function (d) { if (d.id) io.observe(d); });
  }

  var ind = document.getElementById('ind');
  if (ind) ind.indeterminate = true;

  // menus: close when clicking elsewhere
  document.addEventListener('click', function (e) {
    var open = document.querySelectorAll('.bp-menu[open]');
    for (var m = 0; m < open.length; m++) if (!open[m].contains(e.target)) open[m].removeAttribute('open');
  });

  // toast demo
  function toast(title, text, solid) {
    var t = document.createElement('div');
    t.className = 'bp-toast' + (solid ? ' bp-toast--solid' : '');
    t.innerHTML = '<span class="bp-toast__title"></span><span class="bp-toast__text"></span>';
    t.children[0].textContent = title; t.children[1].textContent = text;
    document.querySelector('.bp-toasts').appendChild(t);
    setTimeout(function () { t.classList.add('is-leaving'); t.addEventListener('animationend', function () { t.remove(); }); }, 4000);
  }
  document.getElementById('toast-demo').addEventListener('click', function () { toast('Saved', 'Rev B2 issued on sheets 3 and 7.', false); });
  document.getElementById('toast-demo-solid').addEventListener('click', function () { toast('Pump B stopped', 'Stopped by operator at 22:08.', true); });

  // theme switch, remembered per browser
  var theme = document.getElementById('theme');
  var root = document.documentElement;
  function setTheme(white) {
    if (white) root.setAttribute('data-theme', 'whiteprint'); else root.removeAttribute('data-theme');
    try { localStorage.setItem('bp-theme', white ? 'whiteprint' : 'blueprint'); } catch (e) {}
  }
  var saved = null;
  try { saved = localStorage.getItem('bp-theme'); } catch (e) {}
  if (saved === 'whiteprint') { theme.checked = true; setTheme(true); }
  theme.addEventListener('change', function () { setTheme(theme.checked); });
})();
