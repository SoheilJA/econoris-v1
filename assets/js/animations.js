/* ═══ Econoris — کتابخانه انیمیشن مشترک (GSAP helpers) ═══ */
(function () {
  const E = window.Econoris = window.Econoris || {};
  const hasGsap = !!window.gsap;
  if (hasGsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  if (hasGsap && window.ScrollToPlugin) gsap.registerPlugin(ScrollToPlugin);
  const reduced = () => E.utils ? E.utils.reduced : window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  E.anim = {
    /* شکستن متن به کلمات با ماسک (بدون شکستن اتصال حروف فارسی) */
    splitWords(el) {
      if (!el || el.dataset.split === 'done') return [];
      const words = el.textContent.trim().split(/\s+/);
      el.textContent = '';
      const out = [];
      words.forEach((w, i) => {
        const mask = document.createElement('span'); mask.className = 'w-mask';
        const inner = document.createElement('span'); inner.className = 'w-in'; inner.textContent = w;
        mask.appendChild(inner); el.appendChild(mask);
        if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
        out.push(inner);
      });
      el.dataset.split = 'done';
      return out;
    },
    /* ریویل تیتر با ماسک کلمه‌ای */
    headline(el, opts = {}) {
      if (!el) return null;
      if (!hasGsap || reduced()) { el.classList.add('reveal-instant'); el.style.opacity = 1; return null; }
      const words = this.splitWords(el);
      return gsap.fromTo(words, { yPercent: 120 }, {
        yPercent: 0, duration: opts.duration || 1, ease: 'power4.out',
        stagger: opts.stagger != null ? opts.stagger : .08, delay: opts.delay || 0
      });
    },
    /* ترسیم مسیرهای SVG با اسکرول یا به‌محض دیده‌شدن */
    draw(paths, opts = {}) {
      const list = typeof paths === 'string' ? document.querySelectorAll(paths) : paths;
      if (!list || !list.length) return;
      list.forEach((p) => {
        const len = p.getTotalLength();
        p.style.strokeDasharray = len; p.style.strokeDashoffset = len;
      });
      if (!hasGsap || reduced()) { list.forEach((p) => (p.style.strokeDashoffset = 0)); return; }
      gsap.to(list, {
        strokeDashoffset: 0, duration: opts.duration || 1.6, ease: 'power2.out', stagger: opts.stagger != null ? opts.stagger : .08,
        scrollTrigger: opts.scrub ? { trigger: opts.trigger, start: opts.start || 'top 78%', end: opts.end || 'bottom 45%', scrub: .6 } :
          { trigger: opts.trigger || list[0], start: 'top 82%' }
      });
    },
    /* حلقه شمارنده SVG */
    ring(circle, pct, dur = 1.8) {
      if (!circle) return;
      const C = 2 * Math.PI * 52;
      circle.style.strokeDasharray = C;
      circle.style.strokeDashoffset = C;
      if (!hasGsap || reduced()) { circle.style.strokeDashoffset = C * (1 - pct / 100); return; }
      gsap.to(circle, { strokeDashoffset: C * (1 - pct / 100), duration: dur, ease: 'power2.out' });
    },
    /* توست کوچک */
    toast(msg) {
      document.querySelectorAll('.toast').forEach((t) => t.remove());
      const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg;
      document.body.appendChild(t);
      const kill = () => (hasGsap ? gsap.to(t, { opacity: 0, y: 12, duration: .3, onComplete: () => t.remove() }) : t.remove());
      if (hasGsap) gsap.from(t, { opacity: 0, y: 16, duration: .35 }); setTimeout(kill, 2600);
    }
  };
})();