/* ═══ Econoris — پری‌لودر «کپسول و مولکول»
   فقط در اولین بازدید هر نشست نمایش داده می‌شود (sessionStorage).
   پیشرفت واقعی: fonts + window.load + تصاویر، با حداقل ۱.۶ و حداکثر ۳ ثانیه. ═══ */
(function () {
  const E = window.Econoris = window.Econoris || {};
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const faNum = (n) => String(n).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);
  const root = document.getElementById('econoris-preloader');
  if (!root) { E.revealed = true; return; }

  let visited = false;
  try { visited = sessionStorage.getItem('econoris-visited') === '1'; } catch (e) {}

  function reveal() {
    E.revealed = true;
    window.dispatchEvent(new CustomEvent('econoris:revealed'));
  }
  function markVisited() { try { sessionStorage.setItem('econoris-visited', '1'); } catch (e) {} }
  function finishInstant() { root.remove(); markVisited(); reveal(); }

  if (visited || !window.gsap) { finishInstant(); return; }

  /* ── ساخت مارک‌آپ ── */
  root.innerHTML = `
  <div class="pl-bg"></div>
  <span class="pl-hex" style="top:18%;inset-inline-start:12%"></span>
  <span class="pl-hex" style="bottom:22%;inset-inline-end:14%;animation-delay:-4s"></span>
  <span class="pl-hex" style="top:64%;inset-inline-start:20%;width:36px;height:42px;animation-delay:-7s"></span>
  <div class="pl-stage">
    <svg class="pl-capsule" viewBox="0 0 140 220" aria-hidden="true">
      <defs>
        <linearGradient id="plq" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#00D4C2"/><stop offset="1" stop-color="#2F6BFF"/></linearGradient>
        <clipPath id="plc"><rect x="42" y="14" width="56" height="192" rx="28"/></clipPath>
      </defs>
      <g clip-path="url(#plc)">
        <rect class="pl-liquid" x="42" y="206" width="56" height="0" fill="url(#plq)" opacity=".9"/>
        <g class="pl-bubbles" fill="#B6F23A">
          <circle cx="60" cy="196" r="3.5"/><circle cx="80" cy="200" r="2.5"/><circle cx="70" cy="188" r="2"/>
          <circle cx="55" cy="184" r="2.8"/><circle cx="86" cy="190" r="2.2"/>
        </g>
      </g>
      <g fill="none" stroke="rgba(199,208,245,.85)" stroke-width="3">
        <path class="pl-top" d="M42 110V42a28 28 0 0 1 56 0v68"/>
        <path class="pl-bottom" d="M98 110v68a28 28 0 0 1-56 0v-68"/>
      </g>
      <path d="M36 110h68" stroke="rgba(199,208,245,.35)" stroke-width="2" stroke-dasharray="4 6"/>
    </svg>
    <div class="pl-num"><span id="pl-count">۰</span><span class="pl-pct">٪</span></div>
    <div class="pl-word"><span class="pl-word-main">اکونوریس</span><span class="pl-word-sub">شتاب‌دهنده داروسازی</span></div>
  </div>
  <div class="pl-particles"></div>
  <div class="pl-curtain pl-c-a"></div>
  <div class="pl-curtain pl-c-b"></div>`;

  const liquid = root.querySelector('.pl-liquid');
  const count = root.querySelector('#pl-count');

  if (reduced) {
    /* حالت کاهش حرکت: فقط یک محو ساده */
    gsap.to(root, { opacity: 0, duration: .5, delay: .3, onComplete: finishInstant });
    return;
  }

  /* ── محاسبه پیشرفت واقعی ── */
  let ready = false;
  const loadP = new Promise((res) => {
    if (document.readyState === 'complete') res();
    else window.addEventListener('load', res, { once: true });
  });
  const fontsP = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
  Promise.all([loadP, fontsP]).then(() => { ready = true; });

  let p = 0, target = 0, finished = false;
  const t0 = performance.now(), MIN = 1600, MAX = 3000;

  function frame(now) {
    if (finished) return;
    const el = now - t0;
    target = Math.min(92, 18 + (el / MIN) * 74);          // رشد زمان‌محور تا ۹۲٪
    if (ready && el >= MIN) target = 100;                  // پس از لود کامل
    if (el >= MAX) target = 100;                           // سقف ۳ ثانیه
    p += (target - p) * 0.085 + (target === 100 ? 0.9 : 0.15);
    p = Math.min(100, p);
    count.textContent = faNum(Math.floor(p));
    const h = 192 * p / 100;
    liquid.setAttribute('height', h.toFixed(1));
    liquid.setAttribute('y', (206 - h).toFixed(1));
    if (p >= 99.5 && target === 100) { finishSequence(); return; }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  setTimeout(() => { if (!finished) { p = 100; target = 100; finishSequence(); } }, 4200); // failsafe

  function burst() {
    const box = root.querySelector('.pl-particles');
    const colors = ['#2F6BFF', '#7C4DFF', '#00D4C2', '#B6F23A', '#FF6B6B', '#FFB938', '#FF4FA3'];
    for (let i = 0; i < 28; i++) {
      const s = document.createElement('i');
      s.style.background = colors[i % colors.length];
      if (i % 4 === 0) s.style.borderRadius = '50%';
      box.appendChild(s);
    }
    if (window.anime) {
      anime({ targets: box.children, translateX: () => anime.random(-190, 190), translateY: () => anime.random(-160, 160),
        scale: [1, 0], rotate: () => anime.random(-200, 200), opacity: [1, 0], easing: 'easeOutExpo', duration: 950 });
    }
  }

  function finishSequence() {
    if (finished) return; finished = true;
    const tl = gsap.timeline();
    tl.to('.pl-num', { opacity: 0, y: -12, duration: .25 })
      .to('.pl-liquid', { opacity: 0, duration: .18 }, '<')
      .to('.pl-top', { x: -48, y: -60, rotation: -20, opacity: 0, duration: .6, ease: 'power3.out' })
      .to('.pl-bottom', { x: 48, y: 60, rotation: 20, opacity: 0, duration: .6, ease: 'power3.out' }, '<')
      .add(burst, '<')
      .fromTo('.pl-word', { opacity: 0, y: 26, scale: .94 }, { opacity: 1, y: 0, scale: 1, duration: .55, ease: 'power3.out' }, '-=.25')
      .to('.pl-word', { opacity: 0, y: -20, duration: .35, delay: .4 })
      .to('.pl-capsule,.pl-num,.pl-hex,.pl-particles', { opacity: 0, duration: .25 }, '<')
      .to('.pl-c-a', { yPercent: -105, duration: .85, ease: 'power4.inOut' })
      .to('.pl-c-b', { yPercent: 105, duration: .85, ease: 'power4.inOut' }, '<')
      .add(() => { root.remove(); markVisited(); reveal(); }, '-=.2');
  }
})();