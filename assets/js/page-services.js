/* ═══ Econoris — رفتارهای مشترک صفحات خدمات و دسته‌ها ═══ */
(function () {
    const E = window.Econoris = window.Econoris || {};
    const C = window.ECONORIS_CONFIG;
    const $ = (s, r) => (r || document).querySelector(s);
    const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
    const page = document.body.dataset.page;
    const U = E.utils || {};
    const reduced = !!U.reduced, hasGsap = !!U.hasGsap, isTouch = !!U.isTouch;
    if (!C) return;
    const faNum = U.faNum || ((n) => String(n).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]));

    /* ─── رجیستری: خدمات مرتبط هر صفحه ─── */
    const REG = {
        'research-desk': {
            related: [
                { t: 'اتاق اختصاصی پژوهشی', d: 'فضایی خصوصی برای تمرکز کامل تیم‌های پژوهشی', href: 'services/private-research-room.html', icon: 'lock' },
                { t: 'دسترسی به منابع اطلاعاتی', d: 'پایگاه‌ها و ژورنال‌های معتبر علمی', href: 'services/information-resources.html', icon: 'book' },
                { t: 'اینترنت پرسرعت', d: 'دسترسی سریع و پایدار به منابع علمی جهان', href: 'services/high-speed-internet.html', icon: 'wifi' }
            ]
        },
        'private-research-room': {
            related: [
                { t: 'میز پژوهشی', d: 'ایستگاه کاری اختصاصی برای مطالعه و پژوهش', href: 'services/research-desk.html', icon: 'desk' },
                { t: 'آزمایشگاه', d: 'تجهیزات تخصصی داروسازی و زیست‌فناوری', href: 'services/laboratory.html', icon: 'flask' },
                { t: 'دسترسی به منابع اطلاعاتی', d: 'دسترسی ممتاز به پایگاه‌های تخصصی', href: 'services/information-resources.html', icon: 'book' }
            ]
        },
        'laboratory': {
            related: [
                { t: 'میز پژوهشی', d: 'ایستگاه کاری اختصاصی برای پژوهش علمی', href: 'services/research-desk.html', icon: 'desk' },
                { t: 'حمایت از طرح‌های پژوهشی', d: 'بودجه، امکانات و ارتباط با صنعت', href: 'research-projects-support.html', icon: 'file' },
                { t: 'مشاوره حقوقی', d: 'از پتنت و مالکیت فکری تا قراردادها', href: 'services/legal-consulting.html', icon: 'scale' }
            ]
        },
        'high-speed-internet': {
            related: [
                { t: 'دسترسی به منابع اطلاعاتی', d: 'پایگاه‌های معتبر علمی در دسترس شما', href: 'services/information-resources.html', icon: 'book' },
                { t: 'میز پژوهشی', d: 'ایستگاه کاری اختصاصی برای پژوهش', href: 'services/research-desk.html', icon: 'desk' },
                { t: 'اتاق اختصاصی پژوهشی', d: 'فضای خصوصی تیم‌های R&D', href: 'services/private-research-room.html', icon: 'lock' }
            ]
        },
        'legal-consulting': {
            related: [
                { t: 'حمایت از ایده', d: 'اعتبارسنجی و پرورش ایده‌های نوآورانه', href: 'idea-support.html', icon: 'bulb' },
                { t: 'فضای کار اشتراکی', d: 'پردیس کامل خدمات زیرساختی', href: 'services/shared-workspace.html', icon: 'desk' },
                { t: 'حمایت از طرح‌های پژوهشی', d: 'تأمین منابع و هدایت علمی طرح‌ها', href: 'research-projects-support.html', icon: 'file' }
            ]
        },
        'information-resources': {
            related: [
                { t: 'میز پژوهشی', d: 'ایستگاه کاری اختصاصی برای پژوهش', href: 'services/research-desk.html', icon: 'desk' },
                { t: 'اینترنت پرسرعت', d: 'اتصال سریع برای کار با منابع سنگین', href: 'services/high-speed-internet.html', icon: 'wifi' },
                { t: 'اتاق اختصاصی پژوهشی', d: 'فضای خصوصی تیم‌های R&D', href: 'services/private-research-room.html', icon: 'lock' }
            ]
        },
        'shared-workspace': null, 'idea-support': null, 'research-projects-support': null
    };

    /* ─── ۱) تزریق نوار CTA + خدمات مرتبط ─── */
    (function injectChrome() {
        const main = $('#main'); if (!main) return;
        const cta = document.createElement('section');
        cta.className = 'cta-band grain relative overflow-hidden';
        cta.setAttribute('aria-label', 'مشاوره رایگان');
        cta.innerHTML = `
      <div class="cta-mol cm-1" aria-hidden="true"></div>
      <div class="cta-mol cm-2" aria-hidden="true"></div>
      <div class="cta-mol cm-3" aria-hidden="true"></div>
      <div class="hcontainer relative py-16 text-center sm:py-20">
        <span class="cta-phone-ico" aria-hidden="true">${E.icon('phone', 'h-8 w-8')}</span>
        <h2 class="h2 mt-5">از متخصصین ما مشاوره رایگان دریافت کنید</h2>
        <a href="${C.phoneHref}" class="cta-phone block">${C.phoneDisplay}</a>
        <div class="mt-8 flex flex-wrap justify-center gap-3">
          <a href="${C.phoneHref}" class="btn btn-white">تماس با پشتیبانی</a>
          <a href="${C.consultUrl}" class="btn btn-outline-white">ثبت درخواست مشاوره</a>
        </div>
      </div>`;
        main.appendChild(cta);

        const reg = REG[page];
        if (reg && reg.related && reg.related.length) {
            const strip = document.createElement('section');
            strip.className = 'sec-sec sec-night2 dots';
            strip.setAttribute('aria-label', 'خدمات مرتبط');
            strip.innerHTML = `
        <div class="hcontainer">
          <div class="mx-auto max-w-2xl text-center">
            <span class="eyebrow svc-eb" data-io>ادامه مسیر</span>
            <h2 class="h2 mt-4" data-io>خدمات مرتبط</h2>
          </div>
          <div class="rel-grid mt-10">
            ${reg.related.map((r) => `
              <a href="${r.href}" class="rel-card spot" data-io>
                <span class="rel-ico">${E.icon(r.icon, 'w-5 h-5')}</span>
                <span><b>${r.t}</b><span>${r.d}</span></span>
              </a>`).join('')}
          </div>
        </div>`;
            main.appendChild(strip);
        }
    })();

    /* ─── ۲) ورود هیرو پس از پری‌لودر ─── */
    (function heroEntrance() {
        const els = $$('[data-hero-in]');
        if (!els.length || !hasGsap || reduced) return;
        let done = false;
        const play = () => {
            if (done) return; done = true;
            gsap.fromTo(els, { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: .75, stagger: .09, ease: 'power3.out' });
        };
        if (E.revealed) play();
        else { window.addEventListener('econoris:revealed', play, { once: true }); setTimeout(play, 6000); }
    })();

    /* ─── ۳) سوار کردن صحنه‌های سه‌بعدی ─── */
    const sceneApis = {};
    (function mountScenes() {
        if (!window.THREE || !E.scenes) return;
        $$('canvas[data-scene]').forEach((cv) => {
            const fn = E.scenes[cv.dataset.scene];
            if (!fn) return;
            try { sceneApis[cv.id || cv.dataset.scene] = fn(cv); }
            catch (err) { console.warn('[Econoris scene]', cv.dataset.scene, err); }
        });
        window.addEventListener('pagehide', () => {
            Object.values(sceneApis).forEach((a) => a && a.destroy && a.destroy());
        });
    })();

    /* ─── ۴) ریویل عمومی [data-io] ─── */
    (function initIO() {
        const els = $$('[data-io]');
        if (!els.length) return;
        if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('on')); return; }
        els.forEach((e) => e.classList.add('io-init'));
        const io = new IntersectionObserver((es) => es.forEach((e) => {
            if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); }
        }), { threshold: .15, rootMargin: '0px 0px -6%' });
        els.forEach((e) => io.observe(e));
    })();

    /* ─── ۵) تب‌های قابل دسترس ─── */
    (function initTabs() {
        $$('[data-tabs]').forEach((wrap) => {
            const btns = $$('[data-tab]', wrap), panels = $$('[data-panel]', wrap);
            if (!btns.length || !panels.length) return;
            function go(i, focus) {
                btns.forEach((b, k) => { b.setAttribute('aria-selected', String(k === i)); b.tabIndex = k === i ? 0 : -1; });
                panels.forEach((p, k) => { p.hidden = k !== i; p.classList.remove('panel-in'); if (k === i) { void p.offsetWidth; p.classList.add('panel-in'); } });
                if (focus) btns[i].focus();
            }
            btns.forEach((b, i) => b.addEventListener('click', () => go(i)));
            wrap.addEventListener('keydown', (e) => {
                if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
                e.preventDefault();
                const dir = e.key === 'ArrowLeft' ? 1 : -1; /* در RTL، چپ یعنی بعدی */
                let i = btns.findIndex((b) => b.getAttribute('aria-selected') === 'true');
                if (i < 0) i = 0;
                go((i + dir + btns.length) % btns.length, true);
            });
            go(0);
        });
    })();

    /* ─── ۶) چک‌لیست‌های متحرک ─── */
    (function initChecklists() {
        $$('.chk-list').forEach((list) => {
            const items = $$('.chk-item', list);
            const io = new IntersectionObserver((es) => es.forEach((e) => {
                if (!e.isIntersecting) return;
                items.forEach((it, i) => setTimeout(() => it.classList.add('on'), i * 170));
                io.disconnect();
            }), { threshold: .2 });
            io.observe(list);
        });
    })();

    /* ─── ۷) مهر حقوقی ─── */
    $$('.stamp-card').forEach((card) => {
        const io = new IntersectionObserver((es) => es.forEach((e) => {
            if (e.isIntersecting) { setTimeout(() => card.classList.add('stamped'), 380); io.disconnect(); }
        }), { threshold: .35 });
        io.observe(card);
    });

    /* ─── ۸) کارت‌های برگردان (لمس) ─── */
    if (isTouch) $$('.flip').forEach((f) => f.addEventListener('click', () => f.classList.toggle('flipped')));

    /* ─── ۹) فصل‌های چسبان اتاق اختصاصی ─── */
    (function roomChapters() {
        const chapters = $$('.pr-chapter'); if (!chapters.length) return;
        const badge = $('#pr-stage-num');
        let cur = -1;
        function set(i) {
            if (i === cur) return; cur = i;
            chapters.forEach((c, k) => c.classList.toggle('on', k === i));
            if (badge) badge.textContent = faNum(i + 1);
            const api = sceneApis['room-canvas'];
            if (api && api.setStage) api.setStage(i);
        }
        const io = new IntersectionObserver((es) => es.forEach((e) => {
            if (e.isIntersecting) set(chapters.indexOf(e.target));
        }), { threshold: .5, rootMargin: '-8% 0px' });
        chapters.forEach((c) => io.observe(c));
        set(0);
        const pin = $('#pr-pin');
        function onScroll() {
            if (!pin) return;
            const r = pin.getBoundingClientRect();
            const total = r.height - innerHeight * .5;
            const p = total > 0 ? Math.min(1, Math.max(0, (-r.top + innerHeight * .35) / total)) : 0;
            const api = sceneApis['room-canvas'];
            if (api && api.setProgress) api.setProgress(p);
        }
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    })();

    /* ─── ۱۰) جستجوی تایپی مداری ─── */
    (function typingSearch() {
        const box = $('#orbit-search'); if (!box) return;
        const input = $('#os-text'), chips = $('#os-chips');
        if (!input || !chips) return;
        const queries = ['monoclonal antibody', 'synbiotic', 'drug delivery', 'pharmacokinetics', 'gene therapy'];
        let qi = 0;
        function spawnChips(q) {
            const colors = ['#10B981', '#2F6BFF', '#7C4DFF', '#00D4C2', '#FFB938'];
            const words = q.split(' ');
            const tags = ['[Article]', '[Review]', '[PDF]', '[Data]'];
            const made = [];
            for (let k = 0; k < 4; k++) {
                const c = document.createElement('span');
                c.className = 'os-chip';
                c.style.setProperty('--sc', colors[k % colors.length]);
                c.textContent = words[k % words.length] + ' ' + tags[k % tags.length];
                chips.appendChild(c); made.push(c);
                if (hasGsap && !reduced) gsap.from(c, { y: 14, opacity: 0, scale: .85, duration: .4, delay: k * .09, ease: 'back.out(2)' });
            }
            setTimeout(() => made.forEach((c, idx) => {
                if (hasGsap && !reduced) gsap.to(c, { opacity: 0, y: -10, duration: .3, delay: idx * .05, onComplete: () => c.remove() });
                else c.remove();
            }), 2800);
        }
        function type(q) {
            let i = 0;
            (function step() {
                input.textContent = q.slice(0, ++i);
                if (i < q.length) setTimeout(step, 65 + Math.random() * 55);
                else setTimeout(() => { spawnChips(q); setTimeout(erase, 1500); }, 380);
            })();
        }
        function erase() {
            const t = input.textContent; let i = t.length;
            (function step() {
                input.textContent = t.slice(0, --i);
                if (i > 0) setTimeout(step, 26); else next();
            })();
        }
        function next() { qi = (qi + 1) % queries.length; type(queries[qi]); }
        if (!reduced) setTimeout(() => type(queries[0]), 900);
    })();

    /* ─── ۱۱) گیج و نوارهای دانلود ─── */
    (function initGauges() {
        $$('.gauge').forEach((g) => {
            const io = new IntersectionObserver((es) => es.forEach((e) => {
                if (e.isIntersecting) { g.classList.add('on'); io.disconnect(); }
            }), { threshold: .5 });
            io.observe(g);
        });
        $$('.race-bar').forEach((b) => {
            const io = new IntersectionObserver((es) => es.forEach((e) => {
                if (!e.isIntersecting) return;
                const fill = b.querySelector('.rb-track i');
                if (fill) setTimeout(() => {
                    fill.style.transitionDuration = (b.dataset.dur || 1.3) + 's';
                    fill.style.width = b.dataset.w + '%';
                }, +b.dataset.delay || 0);
                io.disconnect();
            }), { threshold: .5 });
            io.observe(b);
        });
    })();

    /* ─── ۱۲) نقشه پردیس ─── */
    (function campus() {
        const svg = $('#campus-svg'); if (!svg) return;
        const zones = $$('.zone', svg), info = $('#zone-info');
        if (!zones.length) return;
        function set(z) {
            zones.forEach((x) => x.classList.toggle('on', x === z));
            if (info) info.innerHTML = `
        <b>${z.dataset.title}</b>
        <p>${z.dataset.desc}</p>
        <a href="${z.dataset.href}" class="btn btn-dark btn-sm">مشاهده صفحه خدمت</a>`;
        }
        zones.forEach((z) => {
            z.addEventListener('mouseenter', () => set(z));
            z.addEventListener('focus', () => set(z));
            z.addEventListener('click', () => { if (E.go) E.go(z.dataset.href); else window.location.href = z.dataset.href; });
            z.addEventListener('keydown', (e) => { if (e.key === 'Enter') window.location.href = z.dataset.href; });
        });
        set(zones[0]);
    })();

    /* ─── ۱۳) نقشه راه پژوهش ─── */
    (function roadmap() {
        const rm = $('#roadmap'); if (!rm) return;
        const fill = $('.rm-line i', rm), items = $$('.rm-item', rm);
        function onScroll() {
            const r = rm.getBoundingClientRect();
            const p = Math.min(1, Math.max(0, (innerHeight * .6 - r.top) / r.height));
            if (fill) fill.style.height = (p * 100) + '%';
        }
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        const io = new IntersectionObserver((es) => es.forEach((e) => {
            if (e.isIntersecting) e.target.classList.add('on');
        }), { threshold: .4 });
        items.forEach((i) => io.observe(i));
    })();

    /* ─── ۱۴) ناوبری لنگری فعال ─── */
    (function anchorNav() {
        const nav = $('.anchor-nav'); if (!nav) return;
        const links = $$('.an-link', nav);
        const targets = links.map((l) => document.querySelector(l.getAttribute('href'))).filter(Boolean);
        if (!targets.length) return;
        const io = new IntersectionObserver((es) => es.forEach((e) => {
            if (!e.isIntersecting) return;
            const i = targets.indexOf(e.target);
            links.forEach((l, k) => l.classList.toggle('on', k === i));
        }), { rootMargin: '-38% 0px -52% 0px' });
        targets.forEach((t) => io.observe(t));
    })();

    /* ─── ۱۵) درگ ماوس برای ریل‌ها ─── */
    function makeDraggable(el) {
        let down = false, sx = 0, sl = 0, moved = 0;
        el.addEventListener('pointerdown', (e) => {
            if (e.pointerType !== 'mouse') return;
            down = true; moved = 0; sx = e.clientX; sl = el.scrollLeft;
            el.classList.add('dragging');
        });
        window.addEventListener('pointermove', (e) => {
            if (!down) return;
            const dx = sx - e.clientX;
            moved = Math.max(moved, Math.abs(dx));
            el.scrollLeft = sl + dx;
        });
        window.addEventListener('pointerup', () => { if (down) { down = false; el.classList.remove('dragging'); } });
        el.addEventListener('click', (e) => { if (moved > 6) { e.preventDefault(); e.stopPropagation(); } }, true);
    }
    $$('.rail-vp').forEach((r) => makeDraggable(r));

    /* ─── ۱۶) ترسیم کروماتوگرام ─── */
    if (E.anim) {
        E.anim.draw('.chrom-curve', { scrub: true, trigger: '.chromato-card', start: 'top 85%', end: 'bottom 45%', duration: 2 });
        const dots = $$('.peak-dot');
        if (dots.length) {
            const io = new IntersectionObserver((es) => es.forEach((e) => {
                if (!e.isIntersecting) return;
                dots.forEach((d, i) => setTimeout(() => d.classList.add('on'), 900 + i * 260));
                io.disconnect();
            }), { threshold: .3 });
            io.observe($('.chromato-card') || document.body);
        }
    }
})();