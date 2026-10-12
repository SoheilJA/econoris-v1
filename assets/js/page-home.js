/* ═══ Econoris — رفتارهای اختصاصی صفحه اصلی ═══ */
(function () {
    const E = window.Econoris = window.Econoris || {};
    const $ = (s, r) => (r || document).querySelector(s);
    const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
    if (document.body.dataset.page !== 'home') return;
    const U = E.utils || {};
    const reduced = !!U.reduced, hasGsap = !!U.hasGsap, isTouch = !!U.isTouch;

    /* ── داده پروژه‌ها — توضیحات خنثی؛ هیچ نتیجه/دستاوردی اختراع نشده ── */
    const PROJECTS = [
        {
            title: 'سیستم دارورسانی هوشمند', team: 'تیم ۳ نفر', dur: 'مدت ۱۲ ماه', year: 'سال اجرا ۱۴۰۱',
            desc: 'این طرح در حوزه سیستم‌های دارورسانی هوشمند تعریف شده و با تیمی ۳ نفره و در بازه‌ی ۱۲ ماهه اجرا شده است. برای آگاهی از جزئیات فنی و نتایج این پروژه با کارشناسان اکونوریس در تماس باشید.'
        },
        {
            title: 'اعتبارسنجی یک پلتفرم بیوانفورماتیکی', team: 'تیم ۴ نفر', dur: 'مدت ۱۲ ماه', year: 'سال اجرا ۱۴۰۲',
            desc: 'طرح اعتبارسنجی یک پلتفرم بیوانفورماتیکی با تیمی ۴ نفره و در بازه‌ی ۱۲ ماهه اجرا شده است. اطلاعات تکمیلی این پروژه از طریق تماس با کارشناسان ما قابل پیگیری است.'
        },
        {
            title: 'توسعه‌ی مکمل‌های سین‌بیوتیک', team: 'تیم ۵ نفر', dur: 'مدت ۸ ماه', year: 'سال اجرا ۱۴۰۳',
            desc: 'طرح توسعه‌ی مکمل‌های سین‌بیوتیک با تیمی ۵ نفره و در بازه‌ی ۸ ماهه اجرا شده است. برای جزئیات بیشتر با کارشناسان اکونوریس در ارتباط باشید.'
        },
        {
            title: 'توسعه آنتی‌بادی مونوکلونال', team: 'تیم ۲ نفر', dur: 'مدت ۸ ماه', year: 'سال اجرا ۱۴۰۳',
            desc: 'طرح توسعه‌ی آنتی‌بادی مونوکلونال با تیمی ۲ نفره و در بازه‌ی ۸ ماهه اجرا شده است. جهت دریافت اطلاعات تکمیلی با ما در تماس باشید.'
        }
    ];

    /* ── اجرا پس از کنار رفتن پری‌لودر ── */
    function afterReveal(fn, fallbackDelay) {
        if (E.revealed) { fn(); return; }
        let done = false;
        const run = () => { if (!done) { done = true; fn(); } };
        window.addEventListener('econoris:revealed', run, { once: true });
        setTimeout(run, fallbackDelay || 6000);
    }

    /* ── صحنه سه‌بعدی هیرو + آزادسازی منابع هنگام ترک صفحه ── */
    const heroAPI = E.mountHeroScene ? E.mountHeroScene($('#hero-canvas'), {}) : null;
    window.addEventListener('pagehide', () => { if (heroAPI) heroAPI.destroy(); });

    /* ── تایم‌لاین ورود هیرو ── */
    (function heroEntrance() {
        /* جلوگیری از تداخل سیستم ریویل عمومی با تایم‌لاین اختصاصی هیرو */
        $$('.hero-anim').forEach((el) => el.removeAttribute('data-reveal'));
        const play = () => {
            if (!hasGsap || reduced) { $$('.hero-anim').forEach((el) => el.classList.add('reveal-instant')); return; }
            const w1 = E.anim.splitWords($('#hero-l1'));
            const w2 = E.anim.splitWords($('#hero-l2'));
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
            tl.fromTo('#hero-canvas', { opacity: 0 }, { opacity: 1, duration: 1.4 }, 0)
                .fromTo('.hero .eyebrow', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: .55 }, .1)
                .fromTo(w1, { yPercent: 120 }, { yPercent: 0, duration: .95, stagger: .07, ease: 'power4.out' }, '-=.3')
                .fromTo(w2, { yPercent: 120 }, { yPercent: 0, duration: .95, stagger: .08, ease: 'power4.out' }, '-=.7')
                .fromTo('.hero-sub', { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: .6 }, '-=.55')
                .fromTo('.hero-ctas > *', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: .5, stagger: .1 }, '-=.4')
                .fromTo('.hero-phone', { scale: .8, opacity: 0 }, { scale: 1, opacity: 1, duration: .5, ease: 'back.out(1.8)' }, '-=.35')
                .fromTo('.hero-chip', { scale: .5, opacity: 0 }, { scale: 1, opacity: 1, duration: .55, stagger: .12, ease: 'back.out(1.9)' }, '-=.5')
                .fromTo('#scroll-cue', { opacity: 0 }, { opacity: 1, duration: .6 }, '-=.3');
        };
        afterReveal(play);
    })();

    /* ── پارالاکس چیپ‌های شناور هیرو ── */
    (function chipsParallax() {
        if (isTouch || reduced || !hasGsap) return;
        const chips = $$('.hero-chip'), hero = $('#hero');
        if (!chips.length || !hero) return;
        hero.addEventListener('mousemove', (e) => {
            const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
            chips.forEach((c) => {
                const d = +c.dataset.depth || 30;
                gsap.to(c, { x: -x * d, y: -y * d, duration: 1.1, ease: 'power2.out' });
            });
        }, { passive: true });
    })();

    /* ── عمق اسکرول هیرو (کانواس و محتوای هیرو با سرعت‌های متفاوت) ── */
    (function heroScroll() {
        if (!hasGsap || !window.ScrollTrigger || reduced) return;
        gsap.to('#hero-canvas', {
            yPercent: 16, ease: 'none',
            scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
        });
        gsap.to('#hero .hcontainer', {
            y: -70, opacity: .2, ease: 'none',
            scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
        });
        gsap.to('#scroll-cue', {
            opacity: 0, ease: 'none',
            scrollTrigger: { trigger: '#hero', start: 'top top', end: '18% top', scrub: true }
        });
    })();

    /* ── کارت‌های پشته‌ای خدمات (دسکتاپ) ── */
    (function servicesStack() {
        const list = $('.stack-list');
        if (!list || !hasGsap || !window.ScrollTrigger || reduced) return;
        const mm = gsap.matchMedia();
        mm.add('(min-width: 1024px)', () => {
            /* تبدیل grid به ستون چسبان برای افکت روی‌هم‌افتادن کارت‌ها */
            list.style.display = 'flex';
            list.style.flexDirection = 'column';
            const cards = $$('.stack-card', list);
            const tweens = [];
            cards.forEach((c, i) => {
                c.style.top = 'calc(var(--header-h) + ' + (96 + i * 26) + 'px)';
                if (i === cards.length - 1) return;
                tweens.push(gsap.to(c, {
                    scale: .92, opacity: .55, ease: 'none',
                    scrollTrigger: { trigger: cards[i + 1], start: 'top bottom', end: 'top top+=180', scrub: true }
                }));
            });
            return () => {
                tweens.forEach((t) => t.kill());
                cards.forEach((c) => { c.style.top = ''; });
                list.style.display = '';
                list.style.flexDirection = '';
            };
        });
    })();

    /* ── سفر «از ایده تا بازار» ── */
    (function journey() {
        const steps = $$('.j-step'), groups = $$('#journey-svg .stage');
        const fill = $('.j-fill'), dot = $('.j-dot');
        if (!steps.length || !groups.length) return;
        let current = -1;
        function setStage(i) {
            if (i === current) return;
            current = i;
            steps.forEach((s, k) => s.classList.toggle('on', k === i));
            groups.forEach((g, k) => g.classList.toggle('on', k === i));
            const paths = groups[i].querySelectorAll('.dr');
            if (hasGsap && !reduced && paths.length) {
                paths.forEach((p) => {
                    const len = p.getTotalLength();
                    p.style.strokeDasharray = len; p.style.strokeDashoffset = len;
                });
                gsap.to(paths, { strokeDashoffset: 0, duration: .8, ease: 'power2.out', stagger: .05 });
            }
            const p = i / (steps.length - 1);
            if (fill) fill.style.width = (p * 100) + '%';
            if (dot) dot.style.setProperty('--jp', (p * 100));
        }
        setStage(0);
        if (hasGsap && window.ScrollTrigger && !reduced) {
            ScrollTrigger.create({
                trigger: '.j-steps', start: 'top 62%', end: 'bottom 62%',
                onUpdate: (self) => setStage(Math.min(steps.length - 1, Math.floor(self.progress * steps.length)))
            });
        } else {
            const io = new IntersectionObserver((es) => es.forEach((e) => {
                if (e.isIntersecting) setStage(steps.indexOf(e.target));
            }), { threshold: .55 });
            steps.forEach((s) => io.observe(s));
        }
    })();

    /* ── درگ ماوس برای ریل‌های افقی (فرمول جهت‌آگنوستیک؛ در RTL هم درست است) ── */
    function makeDraggable(el, onSettle) {
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
        window.addEventListener('pointerup', () => {
            if (!down) return;
            down = false;
            el.classList.remove('dragging');
            if (moved > 6 && onSettle) onSettle();
        });
        el.addEventListener('click', (e) => {
            if (moved > 6) { e.preventDefault(); e.stopPropagation(); }
        }, true);
        return () => moved;
    }

    /* ── ریل طرح‌ها: درگ + دکمه‌ها + کیبورد ── */
    (function projectsRail() {
        const rail = $('#proj-rail'); if (!rail) return;
        const cards = $$('.proj-card', rail);
        if (!cards.length) return;
        function nearestIndex() {
            const vr = rail.getBoundingClientRect();
            const c = vr.left + vr.width / 2;
            let bi = 0, bd = Infinity;
            cards.forEach((card, i) => {
                const r = card.getBoundingClientRect();
                const d = Math.abs(r.left + r.width / 2 - c);
                if (d < bd) { bd = d; bi = i; }
            });
            return bi;
        }
        let idx = 0;
        function go(i) {
            idx = (i + cards.length) % cards.length;
            cards[idx].scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', inline: 'center', block: 'nearest' });
        }
        makeDraggable(rail, () => { idx = nearestIndex(); go(idx); });
        rail.tabIndex = 0;
        rail.setAttribute('aria-label', 'فهرست طرح‌ها و ایده‌ها');
        rail.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') { e.preventDefault(); go(idx + 1); }
            if (e.key === 'ArrowRight') { e.preventDefault(); go(idx - 1); }
        });
        rail.addEventListener('scroll', () => { idx = nearestIndex(); }, { passive: true });
        const prev = $('#proj-prev'), next = $('#proj-next');
        if (prev) prev.addEventListener('click', () => go(idx - 1));
        if (next) next.addEventListener('click', () => go(idx + 1));
    })();

    /* ── مودال پروژه‌ها ── */
    (function projectModal() {
        const modal = $('#project-modal'); if (!modal) return;
        /* نکته: کنترل نمایش با style (چون .modal{display:flex} روی attr(hidden} غلبه می‌کند) */
        modal.hidden = false;
        modal.style.display = 'none';
        const card = $('.modal-card', modal);
        let lastFocus = null;
        function trap(e) {
            if (e.key !== 'Tab') return;
            const f = $$('a[href], button', card).filter((x) => x.offsetParent !== null);
            if (!f.length) return;
            const first = f[0], last = f[f.length - 1];
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
        function open(i) {
            const p = PROJECTS[i]; if (!p) return;
            $('#pm-title').textContent = p.title;
            $('#pm-desc').textContent = p.desc;
            $('#pm-meta').innerHTML = [p.team, p.dur, p.year]
                .map((t) => `<span class="mini-chip">${t}</span>`).join('');
            const src = document.querySelector(`[data-project="${i}"] .proj-art`);
            $('#pm-art').innerHTML = src ? src.innerHTML : '';
            lastFocus = document.activeElement;
            modal.style.display = '';
            document.body.style.overflow = 'hidden';
            document.addEventListener('keydown', trap);
            const x = $('[data-close-modal]', modal); if (x) x.focus();
            if (hasGsap && !reduced) {
                gsap.fromTo('.modal-backdrop', { opacity: 0 }, { opacity: 1, duration: .3 });
                gsap.fromTo(card, { y: 44, scale: .94, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: .5, ease: 'power3.out' });
            }
        }
        function close() {
            const done = () => {
                modal.style.display = 'none';
                document.body.style.overflow = '';
                document.removeEventListener('keydown', trap);
                if (lastFocus) lastFocus.focus();
            };
            if (hasGsap && !reduced) {
                gsap.to(card, { y: 30, opacity: 0, duration: .28, ease: 'power2.in' });
                gsap.to('.modal-backdrop', { opacity: 0, duration: .28, onComplete: done });
            } else done();
        }
        $$('[data-open-project]').forEach((b) => b.addEventListener('click', () => open(+b.dataset.openProject)));
        $$('[data-close-modal]', modal).forEach((b) => b.addEventListener('click', close));
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display !== 'none') close();
        });
    })();

    /* ── اسلایدر نظرات متخصصین: درگ + نقاط + پخش خودکار با نوار پیشرفت ── */
    (function testimonials() {
        const vp = $('#ts-vp'); if (!vp) return;
        const slides = $$('.ts-slide', vp);
        const dotsBox = $('#ts-dots'), bar = $('#ts-prog i');
        if (!slides.length) return;
        let idx = 0;
        slides.forEach((_, i) => {
            const d = document.createElement('button');
            d.className = 'ts-dot' + (i ? '' : ' on');
            d.setAttribute('aria-label', 'نظر ' + U.faNum(i + 1));
            d.addEventListener('click', () => go(i));
            dotsBox.appendChild(d);
        });
        const dots = $$('.ts-dot', dotsBox);
        function setDots() { dots.forEach((d, i) => d.classList.toggle('on', i === idx)); }
        function go(i) {
            idx = (i + slides.length) % slides.length;
            slides[idx].scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', inline: 'center', block: 'nearest' });
            setDots(); elapsed = 0;
        }
        /* همگام‌سازی با اسکرول/سوایپ بومی */
        vp.addEventListener('scroll', () => {
            const vr = vp.getBoundingClientRect();
            const c = vr.left + vr.width / 2;
            let bi = 0, bd = Infinity;
            slides.forEach((s, i) => {
                const r = s.getBoundingClientRect();
                const d = Math.abs(r.left + r.width / 2 - c);
                if (d < bd) { bd = d; bi = i; }
            });
            if (bi !== idx) { idx = bi; setDots(); }
        }, { passive: true });
        makeDraggable(vp, null);
        const prev = $('#ts-prev'), next = $('#ts-next');
        if (prev) prev.addEventListener('click', () => go(idx - 1));
        if (next) next.addEventListener('click', () => go(idx + 1));
        /* پخش خودکار (با توقف روی هاور/فوکوس/تب مخفی/خروج از دید) */
        let elapsed = 0, last = performance.now(), paused = false;
        let visible = true;
        /* وقتی اسلایدر از دید کاربر خارج شد، پخش خودکار متوقف می‌شود تا
           صفحه خودبه‌خود اسکرول نشود و به بخش نظرات برنگردد */
        if ('IntersectionObserver' in window) {
            new IntersectionObserver((entries) => {
                visible = entries[0].isIntersecting;
                if (!visible) elapsed = 0;
            }, { threshold: 0.2 }).observe(vp);
        }
        const DUR = 6000;
        if (!reduced) {
            (function loop(now) {
                requestAnimationFrame(loop);
                if (!paused && !document.hidden && visible) elapsed += now - last;
                last = now;
                if (bar) bar.style.width = (Math.min(1, elapsed / DUR) * 100) + '%';
                if (elapsed >= DUR) { elapsed = 0; go(idx + 1); }
            })(performance.now());
            const wrap = $('.ts-wrap');
            if (wrap) {
                wrap.addEventListener('pointerenter', () => { paused = true; });
                wrap.addEventListener('pointerleave', () => { paused = false; });
                wrap.addEventListener('focusin', () => { paused = true; });
                wrap.addEventListener('focusout', () => { paused = false; });
            }
        }
    })();
})();