/* ═══ Econoris — رفتارهای سراسری سایت ═══ */
(function () {
  const E = window.Econoris = window.Econoris || {};
  const C = window.ECONORIS_CONFIG, L = window.ECONORIS_CONTENT && window.ECONORIS_CONTENT.fa;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const hasGsap = !!window.gsap;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  const faNum = (n) => String(n).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

  E.utils = { reduced, isTouch, faNum, hasGsap };
  E.megaOpen = false;

  /* ─── هدر: شیشه‌ای شدن، مخفی/ظاهر، نوار پیشرفت ─── */
  function initHeader() {
    const header = $('#site-header'), prog = $('#scroll-progress span');
    const bar = $('#mobile-bar'), rocket = $('#back-top');
    let lastY = window.scrollY, ticking = false;
    function onScroll() {
      ticking = false;
      const y = window.scrollY;
      if (header) {
        header.classList.toggle('is-scrolled', y > 32);
        if (y > lastY + 6 && y > 380 && !E.megaOpen) header.classList.add('is-hidden');
        else if (y < lastY - 6) header.classList.remove('is-hidden');
      }
      if (bar) bar.classList.toggle('show', y > 420);
      if (rocket) rocket.classList.toggle('show', y > 700);
      if (prog) {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        prog.style.transform = `scaleX(${h > 0 ? Math.min(1, y / h) : 0})`;
      }
      lastY = y;
    }
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
    onScroll();
  }

  /* ─── مگامنو (دسکتاپ): hover + click + کیبورد ─── */
  function initMega() {
    const btn = $('#mega-btn'), panel = $('#mega-panel'), header = $('#site-header');
    if (!btn || !panel) return;
    let openT, closeT, isOpen = false;
    function open() {
      clearTimeout(closeT); clearTimeout(openT);
      openT = setTimeout(() => {
        if (isOpen) return;
        isOpen = true; E.megaOpen = true;
        panel.hidden = false;
        void panel.offsetHeight; // reflow برای شروع ترنزیشن
        panel.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }, 70);
    }
    function close(instant) {
      clearTimeout(openT); clearTimeout(closeT);
      const doClose = () => {
        if (!isOpen) return;
        isOpen = false; E.megaOpen = false;
        panel.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        setTimeout(() => { if (!isOpen) panel.hidden = true; }, instant ? 0 : 500);
      };
      if (instant) doClose(); else closeT = setTimeout(doClose, 240);
    }
    btn.addEventListener('click', () => (isOpen ? close(true) : open()));
    btn.addEventListener('mouseenter', open);
    if (header) {
      header.addEventListener('mouseleave', () => close());
      header.addEventListener('focusout', (e) => { if (!header.contains(e.relatedTarget)) close(); });
    }
    panel.addEventListener('mouseenter', () => clearTimeout(closeT));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && isOpen) { close(true); btn.focus(); } });
    document.addEventListener('click', (e) => { if (isOpen && !header.contains(e.target)) close(true); });
    /* ورود با کیبورد به آیتم‌ها: باز ماندن منو */
    panel.addEventListener('focusin', () => clearTimeout(closeT));
  }

  /* ─── دراور موبایل ─── */
  function trapFocus(container) {
    const sel = 'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])';
    return function (e) {
      if (e.key !== 'Tab') return;
      const f = $$(sel, container).filter((el) => el.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
  }
  function initDrawer() {
    const root = $('#econoris-drawer'), openBtn = $('#drawer-open');
    if (!root || !openBtn) return;
    const panel = $('.dw-panel', root);
    let openState = false, onKey;
    function open() {
      openState = true;
      root.classList.add('open'); openBtn.classList.add('is-open');
      openBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      onKey = trapFocus(panel); document.addEventListener('keydown', onKey);
      const first = $('button, a', panel); if (first) first.focus();
    }
    function close() {
      openState = false;
      root.classList.remove('open'); openBtn.classList.remove('is-open');
      openBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      if (onKey) { document.removeEventListener('keydown', onKey); onKey = null; }
      openBtn.focus();
    }
    openBtn.addEventListener('click', open);
    $$('[data-close-drawer]', root).forEach((el) => el.addEventListener('click', close));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && openState) close(); });
    /* بستن هنگام کلیک روی لینک (برای ناوبری روان) */
    root.addEventListener('click', (e) => { if (e.target.closest('a')) close(); });
  }

  /* ─── آکاردئون عمومی [data-acc] ─── */
  function initAccordions() {
    $$('[data-acc]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const wrap = btn.nextElementSibling;
        if (!wrap) return;
        const open = btn.getAttribute('aria-expanded') === 'true';
        /* تک‌باز شدن در هر والد */
        $$('[data-acc]', btn.parentElement).forEach((b) => {
          if (b !== btn) {
            b.setAttribute('aria-expanded', 'false');
            const w = b.nextElementSibling; if (w) w.style.maxHeight = '0px';
          }
        });
        btn.setAttribute('aria-expanded', String(!open));
        wrap.style.maxHeight = open ? '0px' : wrap.scrollHeight + 'px';
      });
    });
  }

  /* ─── اورلی جستجو ─── */
  function normalizeFa(s) { return s.replace(/ي/g, 'ی').replace(/ك/g, 'ک').toLowerCase(); }
  function initSearch() {
    const root = $('#econoris-search'); if (!root || !L) return;
    const input = $('#so-input', root), results = $('#so-results', root);
    let openState = false, onKey;
    function render(list, heading) {
      results.innerHTML = (heading ? `<div class="so-hint" style="padding-inline:1.2rem">${heading}</div>` : '') +
        (list.length ? list.map((r, i) => `
          <a class="so-item" role="option" href="${r.u}">${E.icon(r.i || 'file', 'w-5 h-5 shrink-0')}
          <span class="flex-1 min-w-0"><b class="block">${r.t}</b><span class="block opacity-80">${r.d}</span></span>
          ${E.icon('arrow-left', 'w-4 h-4 opacity-50')}</a>`).join('')
          : `<div class="so-empty">${L.search.empty}</div>`);
    }
    function open() {
      openState = true; root.classList.add('open');
      document.body.style.overflow = 'hidden';
      setTimeout(() => input.focus(), 80);
      render(L.searchIndex.slice(0, 6), L.search.popular);
      onKey = trapFocus(root); document.addEventListener('keydown', onKey);
    }
    function close() {
      openState = false; root.classList.remove('open');
      document.body.style.overflow = '';
      if (onKey) { document.removeEventListener('keydown', onKey); onKey = null; }
    }
    $$('[data-open-search]').forEach((b) => b.addEventListener('click', open));
    $$('[data-close-search]', root).forEach((b) => b.addEventListener('click', close));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && openState) close(); });
    input.addEventListener('input', () => {
      const q = normalizeFa(input.value.trim());
      if (!q) { render(L.searchIndex.slice(0, 6), L.search.popular); return; }
      render(L.searchIndex.filter((r) => normalizeFa(r.t + ' ' + r.d).includes(q)));
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { const first = $('.so-item', results); if (first) { e.preventDefault(); E.go(first.href); } }
    });
  }

  /* ─── ریویل‌ها ─── */
  function initReveals() {
    /* استقرار خودکار stagger برای گروه‌ها */
    $$('[data-reveal-group]').forEach((g) => {
      $$(':scope > *', g).forEach((c, i) => {
        if (!c.hasAttribute('data-reveal')) c.setAttribute('data-reveal', 'up');
        c.style.setProperty('--rd', (i * 95) + 'ms');
      });
    });
    const els = $$('[data-reveal]');
    if (reduced) { els.forEach((el) => el.classList.add('revealed')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('revealed'); io.unobserve(en.target); }
      });
    }, { threshold: .12, rootMargin: '0px 0px -7%' });
    els.forEach((el) => io.observe(el));
  }

  /* ─── شمارنده‌ها و حلقه‌ها ─── */
  function initCounters() {
    const els = $$('[data-counter]');
    const rings = $$('[data-ring]');
    const run = (el) => {
      const target = +el.dataset.target || 0, suffix = el.dataset.suffix || '';
      if (reduced) { el.textContent = faNum(target) + suffix; return; }
      const t0 = performance.now(), dur = 1800;
      (function tick(t) {
        const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
        el.textContent = faNum(Math.round(target * e)) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        if (en.target.tagName === 'B' || en.target.hasAttribute('data-counter')) run(en.target);
        else E.anim.ring(en.target, +en.target.dataset.ring || 60);
        io.unobserve(en.target);
      });
    }, { threshold: .5 });
    els.forEach((el) => io.observe(el));
    rings.forEach((el) => io.observe(el));
  }

  /* ─── مگنتی، تیلت، اسپات‌لایت ─── */
  function initMagnetic() {
    if (isTouch || reduced || !hasGsap) return;
    $$('[data-magnetic]').forEach((el) => {
      const strength = 22;
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = ((e.clientX - r.left - r.width / 2) / r.width) * strength * 2;
        const y = ((e.clientY - r.top - r.height / 2) / r.height) * strength;
        gsap.to(el, { x, y, duration: .5, ease: 'power3.out' });
      });
      el.addEventListener('mouseleave', () => gsap.to(el, { x: 0, y: 0, duration: .75, ease: 'elastic.out(1,.4)' }));
    });
  }
  function initTilt() {
    if (isTouch || reduced) return;
    $$('[data-tilt]').forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        el.style.setProperty('--ry', ((x - .5) * 9).toFixed(2) + 'deg');
        el.style.setProperty('--rx', ((.5 - y) * 8).toFixed(2) + 'deg');
      });
      el.addEventListener('mouseleave', () => { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); });
    });
  }
  function initSpotlight() {
    if (isTouch) return;
    $$('.spot').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        el.style.setProperty('--my', (e.clientY - r.top) + 'px');
      }, { passive: true });
    });
  }

  /* ─── مارکی‌ها: دوبرابر کردن محتوا برای حلقه بی‌درز ─── */
  function initMarquees() {
    $$('.marquee-track').forEach((t) => { t.innerHTML += t.innerHTML; });
  }

  /* ─── کرسر سفارشی (فقط دسکتاپ) ─── */
  function initCursor() {
    if (isTouch || reduced) return;
    document.body.classList.add('has-cursor');
    const dot = document.createElement('span'), ring = document.createElement('span');
    dot.className = 'cur-dot'; ring.className = 'cur-ring';
    document.body.append(dot, ring);
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    window.addEventListener('pointermove', (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.setProperty('--cur-x', mx + 'px'); dot.style.setProperty('--cur-y', my + 'px');
    }, { passive: true });
    (function loop() {
      rx += (mx - rx) * .16; ry += (my - ry) * .16;
      ring.style.setProperty('--cur-x', rx + 'px'); ring.style.setProperty('--cur-y', ry + 'px');
      requestAnimationFrame(loop);
    })();
    document.addEventListener('pointerover', (e) => {
      ring.classList.toggle('is-active', !!e.target.closest('a, button, input, textarea, [data-tilt], [role="button"]'));
    });
  }

  /* ─── بازگشت به بالا ─── */
  function initBackTop() {
    const btn = $('#back-top'); if (!btn) return;
    btn.addEventListener('click', () => {
      if (hasGsap && window.ScrollToPlugin && !reduced) gsap.to(window, { scrollTo: 0, duration: 1, ease: 'power3.inOut' });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ─── اسکرول نرم برای انکرها ─── */
  function initSmoothAnchors() {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"], [data-scroll-to]');
      if (!a) return;
      const href = a.getAttribute('href');
      const target = (href && href.length > 1) ? document.querySelector(href) : (a.dataset.scrollTo ? document.getElementById(a.dataset.scrollTo) : null);
      if (!target) return;
      e.preventDefault();
      if (hasGsap && window.ScrollToPlugin && !reduced) gsap.to(window, { scrollTo: { y: target, offsetY: 88 }, duration: 1, ease: 'power3.inOut' });
      else target.scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* ─── ترنزیشن بین صفحات ─── */
  function initPageTransition() {
    const root = $('#econoris-transition');
    if (!root) return;
    const a = root.querySelector('.pt-a'), b = root.querySelector('.pt-b'), logo = root.querySelector('.pt-logo');
    /* ورود به صفحه (از صفحه دیگر): پرده بسته است → بازش کن */
    if (document.documentElement.classList.contains('pt-cover')) {
      const uncover = () => {
        if (!hasGsap || reduced) { document.documentElement.classList.remove('pt-cover'); return; }
        gsap.to(logo, { opacity: 0, scale: .6, duration: .2 });
        gsap.to(a, { yPercent: -115, duration: .6, ease: 'power4.inOut', delay: .12 });
        gsap.to(b, { yPercent: 115, duration: .6, ease: 'power4.inOut', delay: .12,
          onComplete: () => document.documentElement.classList.remove('pt-cover') });
      };
      if (document.readyState === 'complete') setTimeout(uncover, 140);
      else window.addEventListener('load', () => setTimeout(uncover, 140), { once: true });
      /* failsafe */
      setTimeout(() => document.documentElement.classList.remove('pt-cover'), 2500);
    }
    /* خروج از صفحه: پرده را ببند و بعد navigate کن */
    E.go = function (href) {
      if (!hasGsap || reduced) { window.location.href = href; return; }
      gsap.set(root, { pointerEvents: 'auto' });
      gsap.to(a, { yPercent: 0, duration: .5, ease: 'power4.inOut' });
      gsap.to(b, { yPercent: 0, duration: .5, ease: 'power4.inOut' });
      gsap.fromTo(logo, { opacity: 0, scale: .6 }, { opacity: 1, scale: 1, duration: .35, delay: .3 });
      setTimeout(() => { window.location.href = href; }, 720);
    };
    document.addEventListener('click', (e) => {
      const a2 = e.target.closest('a');
      if (!a2 || e.metaKey || e.ctrlKey || e.shiftKey || a2.target === '_blank') return;
      const href = a2.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('tel') || href.startsWith('mailto') || href.startsWith('javascript')) return;
      if (!/\.html($|[?#])/.test(href)) return;
      e.preventDefault(); E.go(href);
    });
    window.addEventListener('pageshow', (e) => { if (e.persisted) document.documentElement.classList.remove('pt-cover'); });
  }

  /* ─── boot ─── */
  initHeader(); initMega(); initDrawer(); initAccordions(); initSearch();
  initReveals(); initCounters(); initMagnetic(); initTilt(); initSpotlight();
  initMarquees(); initCursor(); initBackTop(); initSmoothAnchors(); initPageTransition();
})();