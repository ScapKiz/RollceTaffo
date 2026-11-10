/* Il lusso ha due lingue: interazioni del sito */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Comparsa elementi all'ingresso ---------- */
  var reveals = $$('.rv');
  // Ritardo a scalare fra gli elementi dello stesso gruppo
  var groups = new Map();
  reveals.forEach(function (el) {
    var p = el.parentElement;
    var n = groups.get(p) || 0;
    el.style.setProperty('--d', Math.min(n, 6) * 80 + 'ms');
    groups.set(p, n + 1);
    // rotazioni a riposo per la sezione Taffo
    if (!el.style.getPropertyValue('--t')) {
      var t = getComputedStyle(el).getPropertyValue('--t');
      if (t) el.style.setProperty('--t', t.trim());
    }
  });
  if ('IntersectionObserver' in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.04 });
    reveals.forEach(function (el) { io.observe(el); });
    // Rete di sicurezza: nulla resta nascosto se l'osservatore non scatta
    window.addEventListener('load', function () {
      setTimeout(function () {
        reveals.forEach(function (el) {
          var r = el.getBoundingClientRect();
          if (r.top < innerHeight && r.bottom > 0) el.classList.add('in');
        });
      }, 1500);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Il confine trascinabile della home ---------- */
  var hero = $('#hero'), seam = $('#seam');
  function setSeam(v, announce) {
    v = Math.max(12, Math.min(88, v));
    hero.style.setProperty('--seam', v + '%');
    if (announce !== false) {
      seam.setAttribute('aria-valuenow', Math.round(v));
      seam.setAttribute('aria-valuetext', Math.round(v) + '% Rolls-Royce, ' + Math.round(100 - v) + '% Taffo');
    }
  }
  var dragging = false;
  function pointerSeam(e) { var r = hero.getBoundingClientRect(); setSeam((e.clientX - r.left) / r.width * 100); }
  seam.addEventListener('pointerdown', function (e) {
    dragging = true; seam.setPointerCapture(e.pointerId); cancelIntro(); e.preventDefault();
  });
  seam.addEventListener('pointermove', function (e) { if (dragging) pointerSeam(e); });
  seam.addEventListener('pointerup', function () { dragging = false; });
  seam.addEventListener('pointercancel', function () { dragging = false; });
  seam.addEventListener('keydown', function (e) {
    var now = parseFloat(seam.getAttribute('aria-valuenow'));
    var step = e.shiftKey ? 10 : 3;
    if (e.key === 'ArrowLeft') { setSeam(now - step); e.preventDefault(); e.stopPropagation(); }
    if (e.key === 'ArrowRight') { setSeam(now + step); e.preventDefault(); e.stopPropagation(); }
    if (e.key === 'Home') { setSeam(12); e.preventDefault(); e.stopPropagation(); }
    if (e.key === 'End') { setSeam(88); e.preventDefault(); e.stopPropagation(); }
  });
  // Apertura: il confine si muove da solo, una volta, per farsi notare
  var introRaf = 0;
  function cancelIntro() { if (introRaf) { cancelAnimationFrame(introRaf); introRaf = 0; } }
  if (!reduced) {
    var t0 = 0, DUR = 2400;
    var step = function (t) {
      if (!t0) t0 = t;
      var k = Math.min(1, (t - t0) / DUR);
      var e = 1 - Math.pow(1 - k, 4);
      setSeam(74 + (50 - 74) * e, k === 1);
      introRaf = k < 1 ? requestAnimationFrame(step) : 0;
    };
    introRaf = requestAnimationFrame(step);
  }

  /* ---------- Quadrato di Floch ---------- */
  var defs = $$('.def'), corners = $$('.sq-corner');
  function highlight(name, sticky) {
    defs.forEach(function (d) { d.classList.toggle('on', d.dataset.corner === name); d.setAttribute('aria-pressed', d.dataset.corner === name ? 'true' : 'false'); });
    corners.forEach(function (c) { c.classList.toggle('on', c.dataset.corner === name); });
  }
  defs.forEach(function (d) {
    d.setAttribute('aria-pressed', 'false');
    d.addEventListener('click', function () { highlight(d.classList.contains('on') ? null : d.dataset.corner); });
    d.addEventListener('mouseenter', function () { corners.forEach(function (c) { c.classList.toggle('on', c.dataset.corner === d.dataset.corner); }); });
    d.addEventListener('mouseleave', function () { var on = $('.def.on'); corners.forEach(function (c) { c.classList.toggle('on', !!on && c.dataset.corner === on.dataset.corner); }); });
  });

  /* ---------- Video: si carica solo al clic ---------- */
  $$('.film[data-embed]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (e.ctrlKey || e.metaKey || e.shiftKey) return;
      e.preventDefault();
      var f = document.createElement('iframe');
      f.src = a.dataset.embed;
      f.title = a.dataset.embedTitle || 'Video';
      f.allow = 'autoplay; fullscreen; picture-in-picture';
      f.setAttribute('allowfullscreen', '');
      var box = document.createElement('div');
      box.className = a.className;
      box.classList.add('in');
      box.appendChild(f);
      a.replaceWith(box);
    });
  });

  /* ---------- Copia le voci della tabella comparativa nelle celle ---------- */
  $$('.vs-table tbody tr').forEach(function (tr) {
    var k = $('th', tr).textContent;
    $$('td', tr).forEach(function (td) { td.setAttribute('data-k', k); });
  });

  /* ---------- Menu e avanzamento ---------- */
  var nav = $('#nav'), links = $('#navLinks'), toggle = $('#navToggle'), bar = $('#navProgress');
  var chapters = $$('.chapter');
  toggle.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.textContent = open ? 'Chiudi' : 'Menu';
  });
  $$('a', links).forEach(function (a) {
    a.addEventListener('click', function () {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.textContent = 'Menu';
    });
  });
  var currentId = '';
  function onScroll() {
    var max = document.documentElement.scrollHeight - innerHeight;
    bar.style.setProperty('--p', max > 0 ? (scrollY / max).toFixed(4) : 0);
    var probe = nav.offsetHeight + 4;
    var cur = chapters[0];
    chapters.forEach(function (c) { if (c.getBoundingClientRect().top <= probe) cur = c; });
    if (cur.id !== currentId) {
      currentId = cur.id;
      nav.dataset.theme = cur.dataset.theme;
      $$('a', links).forEach(function (a) { a.setAttribute('aria-current', a.getAttribute('href') === '#' + cur.id ? 'true' : 'false'); });
    }
  }
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { onScroll(); ticking = false; });
  }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---------- Ingrandimento immagini ---------- */
  var lb = $('#lb'), lbCap = $('#lbCap'), lbStage = $('#lbStage');
  var lbImg = lbStage.appendChild(document.createElement('img'));
  var zooms = $$('.zoom'), lbIndex = 0;
  function lbShow(i) {
    lbIndex = (i + zooms.length) % zooms.length;
    var a = zooms[lbIndex], img = $('img', a);
    var fig = a.closest('figure, .fig');
    var cap = fig ? fig.querySelector('figcaption') : null;
    lbImg.src = a.getAttribute('href');
    lbImg.alt = img.alt;
    lbCap.textContent = (cap && cap.textContent.trim()) || img.alt;
    lbStage.classList.remove('is-zoom');
    lbImg.style.transformOrigin = '50% 50%';
  }
  zooms.forEach(function (a, i) {
    a.setAttribute('aria-label', 'Ingrandisci: ' + $('img', a).alt);
    a.addEventListener('click', function (e) {
      if (e.ctrlKey || e.metaKey || e.shiftKey) return;
      e.preventDefault();
      lbShow(i);
      lb.showModal();
    });
  });
  $('#lbClose').addEventListener('click', function () { lb.close(); });
  $('#lbPrev').addEventListener('click', function () { lbShow(lbIndex - 1); });
  $('#lbNext').addEventListener('click', function () { lbShow(lbIndex + 1); });
  lbStage.addEventListener('click', function (e) {
    if (e.target !== lbImg) { lb.close(); return; }
    var r = lbImg.getBoundingClientRect();
    if (!lbStage.classList.contains('is-zoom')) {
      lbImg.style.transformOrigin = ((e.clientX - r.left) / r.width * 100) + '% ' + ((e.clientY - r.top) / r.height * 100) + '%';
    }
    lbStage.classList.toggle('is-zoom');
  });
  lb.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { lbShow(lbIndex - 1); e.stopPropagation(); }
    if (e.key === 'ArrowRight') { lbShow(lbIndex + 1); e.stopPropagation(); }
  });

  /* ---------- Modalità presentazione ---------- */
  var panels = $$('.panel'), pbar = $('#pbar'), pCount = $('#pCount');
  var presenting = false, slide = 0;

  function fit(panel) {
    if (panel.classList.contains('hero')) return;
    panel.style.zoom = '';
    var z = 1.3;
    panel.style.zoom = z;
    while (z > 0.42 && (panel.scrollHeight > panel.clientHeight + 2 || panel.scrollWidth > panel.clientWidth + 2)) {
      z = Math.round((z - 0.04) * 100) / 100;
      panel.style.zoom = z;
    }
  }
  function show(i) {
    slide = Math.max(0, Math.min(panels.length - 1, i));
    panels.forEach(function (p, n) { p.classList.toggle('is-active', n === slide); });
    var p = panels[slide];
    fit(p);
    pCount.textContent = (slide + 1) + ' / ' + panels.length + ' · ' + (p.dataset.slideTitle || '');
  }
  function nearestPanel() {
    var best = 0, bestD = Infinity;
    panels.forEach(function (p, i) {
      var d = Math.abs(p.getBoundingClientRect().top - nav.offsetHeight);
      if (d < bestD) { bestD = d; best = i; }
    });
    return best;
  }
  function enter() {
    if (presenting) return;
    slide = nearestPanel();
    presenting = true;
    document.documentElement.style.scrollBehavior = 'auto';
    document.body.classList.add('is-present');
    pbar.hidden = false;
    show(slide);
    var de = document.documentElement;
    if (de.requestFullscreen) de.requestFullscreen().catch(function () {}).then(function () { if (presenting) fit(panels[slide]); });
  }
  function leave() {
    if (!presenting) return;
    presenting = false;
    document.body.classList.remove('is-present');
    pbar.hidden = true;
    panels.forEach(function (p) { p.classList.remove('is-active'); p.style.zoom = ''; });
    if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(function () {});
    var target = panels[slide];
    requestAnimationFrame(function () {
      window.scrollTo(0, target.getBoundingClientRect().top + scrollY - nav.offsetHeight);
      document.documentElement.style.scrollBehavior = '';
      onScroll();
    });
  }
  $('#presentBtn').addEventListener('click', enter);
  $('#pPrev').addEventListener('click', function () { show(slide - 1); });
  $('#pNext').addEventListener('click', function () { show(slide + 1); });
  $('#pExit').addEventListener('click', leave);
  document.addEventListener('fullscreenchange', function () { if (!document.fullscreenElement && presenting) leave(); });
  window.addEventListener('resize', function () { if (presenting) fit(panels[slide]); });

  document.addEventListener('keydown', function (e) {
    if (lb.open) return;
    var tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea') return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (!presenting) {
      if (e.key === 'p' || e.key === 'P') { enter(); e.preventDefault(); }
      return;
    }
    var k = e.key;
    if (k === 'ArrowRight' || k === 'ArrowDown' || k === 'PageDown' || (k === ' ' && tag !== 'button' && tag !== 'a')) { show(slide + 1); e.preventDefault(); }
    else if (k === 'ArrowLeft' || k === 'ArrowUp' || k === 'PageUp') { show(slide - 1); e.preventDefault(); }
    else if (k === 'Home') { show(0); e.preventDefault(); }
    else if (k === 'End') { show(panels.length - 1); e.preventDefault(); }
    else if (k === 'Escape' || k === 'p' || k === 'P') { leave(); e.preventDefault(); }
  });
})();
