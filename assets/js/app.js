(function () {
  'use strict';

  /* ---------- small helpers ---------- */
  var root = document.documentElement;
  var DE = window.I18N_DE || {};
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) {} return null; }

  /* ---------- UI strings used by scripts (not in the markup) ---------- */
  var UI = {
    en: {
      dark: 'Dark', light: 'Light', toDark: 'Switch to dark mode', toLight: 'Switch to light mode',
      copy: 'Copy address', copied: 'Copied', copiedStatus: 'Email address copied',
      subject: 'Internship from April 2027',
      base: 'Grace Tiokam | UX/UI Portfolio',
      titles: { 'campus-guide': 'Campus Guide', netflix: 'Learning a Language with Netflix', cameroon: 'Cameroon, Africa in Miniature', 'student-guide': 'International Student Guide' }
    },
    de: {
      dark: 'Dunkel', light: 'Hell', toDark: 'Zum dunklen Modus wechseln', toLight: 'Zum hellen Modus wechseln',
      copy: 'Adresse kopieren', copied: 'Kopiert', copiedStatus: 'E-Mail-Adresse kopiert',
      subject: 'Praktikum ab April 2027',
      base: 'Grace Tiokam | UX/UI-Portfolio',
      titles: { 'campus-guide': 'Campus Guide', netflix: 'Sprachen lernen mit Netflix', cameroon: 'Kamerun, Afrika in Miniatur', 'student-guide': 'International Student Guide' }
    }
  };

  /* ---------- language ---------- */
  var lang = 'en';
  var EN = {};            // original English text, captured from the markup
  var nodes = $$('[data-i18n]'), altNodes = $$('[data-i18n-alt]'), ariaNodes = $$('[data-i18n-aria]');
  nodes.forEach(function (n) { EN[n.getAttribute('data-i18n')] = EN[n.getAttribute('data-i18n')] || n.innerHTML; });
  var ENalt = {}, ENaria = {};
  altNodes.forEach(function (n) { ENalt[n.getAttribute('data-i18n-alt')] = n.getAttribute('alt'); });
  ariaNodes.forEach(function (n) { ENaria[n.getAttribute('data-i18n-aria')] = n.getAttribute('aria-label'); });
  $$('.lang [data-lang]').forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });

  function pick(key, src, dict) { return lang === 'de' && dict[key] != null ? dict[key] : src[key]; }

  /* remember which block is at the top of the viewport, so a language switch does not move the reader */
  function anchorBefore() {
    var h = (parseInt(getComputedStyle(root).getPropertyValue('--header-h'), 10) || 64) + 8;
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i]; if (n.offsetParent === null || n.closest('header')) continue;
      var r = n.getBoundingClientRect();
      if (r.bottom > h && r.height > 0) return { el: n, top: r.top };
    }
    return null;
  }

  function setLang(next, persist) {
    var anchor = persist ? anchorBefore() : null;
    lang = next === 'de' ? 'de' : 'en';
    root.setAttribute('lang', lang);
    nodes.forEach(function (n) { var k = n.getAttribute('data-i18n'); n.innerHTML = pick(k, EN, DE); });
    altNodes.forEach(function (n) { var k = n.getAttribute('data-i18n-alt'); n.setAttribute('alt', pick(k, ENalt, DE)); });
    ariaNodes.forEach(function (n) { var k = n.getAttribute('data-i18n-aria'); n.setAttribute('aria-label', pick(k, ENaria, DE)); });
    $$('.lang [data-lang]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === lang)); });
    var mail = 'mailto:ctiokam@gmail.com?subject=' + encodeURIComponent(UI[lang].subject);
    $$('a[data-mail]').forEach(function (a) { a.setAttribute('href', mail); });
    var cb = $('#copy'); if (cb) cb.textContent = UI[lang].copy;
    updateTheme();
    updateTitle();
    if (anchor) { var d = anchor.el.getBoundingClientRect().top - anchor.top; if (Math.abs(d) > 1) window.scrollBy({ top: d, behavior: 'instant' }); }
    if (persist) store('lang', lang);
  }

  /* ---------- theme ---------- */
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  function isDark() {
    var t = root.getAttribute('data-theme');
    return t ? t === 'dark' : !!(mq && mq.matches);
  }
  function updateTheme() {
    var b = $('#theme'), l = $('#theme-label'); if (!b) return;
    var dark = isDark();
    b.setAttribute('aria-label', dark ? UI[lang].toLight : UI[lang].toDark);
    if (l) l.textContent = dark ? UI[lang].light : UI[lang].dark;
    var meta = $('meta[name="theme-color"]'); if (meta) meta.setAttribute('content', dark ? '#160d0e' : '#7a1f32');
  }
  $('#theme').addEventListener('click', function () {
    var next = isDark() ? 'light' : 'dark';
    root.setAttribute('data-theme', next); store('theme', next); updateTheme();
  });
  if (mq && mq.addEventListener) mq.addEventListener('change', updateTheme);

  /* ---------- routing: #home, #projects, #about, #contact, #<project>, #<project>/<section> ---------- */
  var VIEWS = { 'campus-guide': 1, netflix: 1, cameroon: 1, 'student-guide': 1 };
  var views = $$('.view'), current = null;

  function updateTitle() {
    document.title = current && VIEWS[current] ? UI[lang].titles[current] + ' | ' + UI[lang].base : UI[lang].base;
  }
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function scrollToEl(el, smooth) {
    var top = el.getBoundingClientRect().top + window.pageYOffset - (parseInt(getComputedStyle(root).getPropertyValue('--header-h'), 10) || 64) - 12;
    window.scrollTo({ top: Math.max(0, top), behavior: smooth && !reduce ? 'smooth' : 'auto' });
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
  }
  function route(e) {
    var raw = (location.hash || '').replace(/^#/, '');
    var parts = raw.split('/'), name = parts[0], sub = parts[1];
    var isCase = !!VIEWS[name];
    var changedView = current !== (isCase ? name : 'home');
    current = isCase ? name : 'home';
    views.forEach(function (v) { v.hidden = v.id !== 'view-' + current; });
    updateTitle();

    if (isCase) {
      var target = sub && document.getElementById(name + '-' + sub);
      if (target) { scrollToEl(target, !changedView); }
      else {
        window.scrollTo(0, 0);
        var h1 = $('#view-' + name + ' h1'); h1.setAttribute('tabindex', '-1'); h1.focus({ preventScroll: true });
      }
    } else {
      var el = name && name !== 'home' ? document.getElementById(name) : null;
      if (el) { setTimeout(function () { scrollToEl(el, !changedView); }, 0); }
      else { window.scrollTo(0, 0); }
    }
    $$('.nav a').forEach(function (a) {
      var href = a.getAttribute('href').replace('#', '');
      var on = isCase ? href === 'projects' : (name && name !== 'home' ? href === name : href === 'home');
      if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
  }
  window.addEventListener('hashchange', route);

  /* ---------- language switch (no reload, keeps scroll position) ---------- */
  $$('.lang [data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang'), true); });
  });

  /* ---------- copy email ---------- */
  var btn = $('#copy');
  btn.addEventListener('click', function () {
    var t = $('#email'), status = $('#copy-status');
    function done() {
      btn.textContent = UI[lang].copied; if (status) status.textContent = UI[lang].copiedStatus;
      setTimeout(function () { btn.textContent = UI[lang].copy; if (status) status.textContent = ''; }, 1800);
    }
    function select() { var r = document.createRange(); r.selectNodeContents(t); var s = getSelection(); s.removeAllRanges(); s.addRange(r); }
    if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(t.textContent).then(done, select); } else { select(); }
  });

  /* ---------- init ---------- */
  var saved = store('lang');
  var initial = saved || (/^de\b/i.test(navigator.language || '') ? 'de' : 'en');
  var q = /[?&]lang=(en|de)\b/.exec(location.search); if (q) initial = q[1];
  setLang(initial, false);
  route();
})();
