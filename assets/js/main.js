/* جمعية التنمية الزراعية بالعماير — سلوك الموقع */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  /* ---------- سنة حقوق النشر ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- شريط التنقل ---------- */
  var nav = document.querySelector('.nav');
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  var burger = document.querySelector('.nav__burger');
  var links = document.querySelector('.nav__links');
  if (burger && links) {
    burger.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
    document.addEventListener('click', function (e) {
      if (!links.contains(e.target) && !burger.contains(e.target)) {
        links.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- تمييز الرابط النشط ---------- */
  var current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === current) a.classList.add('is-active');
  });

  /* ---------- حركات الظهور ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-visible');
          ro.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { ro.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- العدادات ---------- */
  function animateCounter(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var decimals = (el.getAttribute('data-count').split('.')[1] || '').length;
    var dur = 1600;
    var start = null;
    function frame(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals);
      if (p < 1) requestAnimationFrame(frame);
      else el.textContent = target.toFixed(decimals);
    }
    requestAnimationFrame(frame);
  }
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          animateCounter(en.target);
          co.unobserve(en.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { co.observe(el); });
  } else {
    counters.forEach(function (el) { el.textContent = el.getAttribute('data-count'); });
  }

  /* ---------- فلترة المستندات ---------- */
  var tabs = document.querySelectorAll('.filter-tab');
  var docs = document.querySelectorAll('.doc-card');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) { t.classList.remove('is-active'); });
      tab.classList.add('is-active');
      var cat = tab.getAttribute('data-filter');
      docs.forEach(function (card) {
        var show = cat === 'all' || card.getAttribute('data-category') === cat;
        card.classList.toggle('is-hidden', !show);
      });
    });
  });

  /* ---------- عارض PDF المنبثق ---------- */
  var modal = document.getElementById('pdf-modal');
  if (modal) {
    var frame = modal.querySelector('.pdf-modal__frame');
    var title = modal.querySelector('.pdf-modal__title');
    var dlBtn = modal.querySelector('[data-modal-download]');
    var ntBtn = modal.querySelector('[data-modal-newtab]');
    var lastFocus = null;

    function openModal(src, name) {
      lastFocus = document.activeElement;
      title.textContent = name;
      frame.src = src + '#view=FitH';
      if (dlBtn) { dlBtn.href = src; dlBtn.setAttribute('download', ''); }
      if (ntBtn) { ntBtn.href = src; }
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      modal.querySelector('.pdf-modal__close').focus();
    }
    function closeModal() {
      modal.classList.remove('is-open');
      frame.src = 'about:blank';
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    }

    document.querySelectorAll('[data-pdf]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        openModal(btn.getAttribute('data-pdf'), btn.getAttribute('data-pdf-title') || 'استعراض المستند');
      });
    });
    modal.querySelector('.pdf-modal__backdrop').addEventListener('click', closeModal);
    modal.querySelector('.pdf-modal__close').addEventListener('click', closeModal);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });
  }

  /* ---------- نسخ الآيبان ---------- */
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      var feedback = document.querySelector('.copy-feedback');
      function done() {
        if (feedback) {
          feedback.classList.add('is-visible');
          setTimeout(function () { feedback.classList.remove('is-visible'); }, 2200);
        }
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done);
      } else {
        var ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (e) { /* ignore */ }
        document.body.removeChild(ta);
        done();
      }
    });
  });

  /* ---------- نموذج التواصل عبر البريد ---------- */
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.querySelector('#cf-name').value.trim();
      var email = form.querySelector('#cf-email').value.trim();
      var subject = form.querySelector('#cf-subject').value.trim();
      var msg = form.querySelector('#cf-message').value.trim();
      var body = 'الاسم: ' + name + '\nالبريد الإلكتروني: ' + email + '\n\n' + msg;
      location.href = 'mailto:info@tz-amair.org' +
        '?subject=' + encodeURIComponent(subject || 'رسالة من موقع الجمعية') +
        '&body=' + encodeURIComponent(body);
    });
  }
})();
