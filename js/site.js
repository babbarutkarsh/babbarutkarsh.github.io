/* Interactions: 3D pointer tilt on cards, scroll-spy nav, mobile menu.
   Vanilla JS, no dependencies. Respects prefers-reduced-motion. */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- 3D tilt on .card (pointer-driven) --------------------------- */
  if (!reduce && window.matchMedia('(pointer: fine)').matches) {
    var MAX = 8; // deg
    document.querySelectorAll('.card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top) / r.height;
        var rx = (0.5 - py) * MAX * 2;
        var ry = (px - 0.5) * MAX * 2;
        card.style.transform =
          'perspective(900px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' +
          ry.toFixed(2) + 'deg) translateZ(6px)';
        card.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
        card.style.setProperty('--my', (py * 100).toFixed(1) + '%');
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }

  /* ---- Scroll-spy: highlight active nav link ----------------------- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.side-nav a'));
  var map = {};
  links.forEach(function (l) {
    var id = l.getAttribute('href').replace('#', '');
    if (id) map[id] = l;
  });
  var sections = Object.keys(map).map(function (id) { return document.getElementById(id); }).filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (l) { l.classList.remove('active'); });
          var active = map[en.target.id];
          if (active) active.classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(function (s) { obs.observe(s); });
  }

  /* ---- Reveal-on-scroll fade-up ------------------------------------ */
  if (!reduce && 'IntersectionObserver' in window) {
    var reveals = document.querySelectorAll('[data-reveal]');
    reveals.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(22px)';
      el.style.transition = 'opacity .6s ease, transform .6s ease';
    });
    var rObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.style.opacity = '1';
          en.target.style.transform = 'none';
          rObs.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { rObs.observe(el); });
  }

  /* ---- Mobile menu toggle ------------------------------------------ */
  var btn = document.getElementById('menuBtn');
  var sidebar = document.getElementById('sidebar');
  if (btn && sidebar) {
    btn.addEventListener('click', function () {
      sidebar.classList.toggle('open');
    });
    sidebar.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { sidebar.classList.remove('open'); });
    });
  }
})();
