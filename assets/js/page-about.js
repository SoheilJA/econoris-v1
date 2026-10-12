/* ═══ Econoris — رفتارهای صفحه درباره ما ═══ */
(function () {
    const E = window.Econoris = window.Econoris || {};
    const $ = (s, r) => (r || document).querySelector(s);
    const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
    if (document.body.dataset.page !== 'about') return;
    const U = E.utils || {};
    const reduced = !!U.reduced, hasGsap = !!U.hasGsap;
    const faNum = (n) => String(n).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

    /* ── صحنه آرام‌تر مولکولی (گره‌های کمتر) ── */
    const heroAPI = E.mountHeroScene ? E.mountHeroScene($('#about-canvas'), { nodes: 10 }) : null;
    window.addEventListener('pagehide', () => { if (heroAPI) heroAPI.destroy(); });

    /* ── تیتر با ماسک کلمه‌ای پس از پری‌لودر ── */
    (function headline() {
        const t = $('#ab-title');
        if (!t) return;
        const play = () => {
            if (!hasGsap || reduced) { t.style.opacity = ''; return; }
            t.style.opacity = '';
            E.anim.headline(t, { duration: .9, stagger: .07 });
        };
        t.style.opacity = '0';
        if (E.revealed) play();
        else {
            window.addEventListener('econoris:revealed', play, { once: true });
            setTimeout(() => { t.style.opacity = ''; }, 6000);
        }
    })();

    /* ── سوییچ پنل تصویری فصل‌ها ── */
    (function chapters() {
        const chapters = $$('.ab-chapter'), stages = $$('.ab-stage');
        const num = $('#ab-ch-num'), name = $('#ab-ch-name');
        if (!chapters.length || !stages.length) return;
        const io = new IntersectionObserver((entries) => {
            entries.forEach((en) => {
                if (!en.isIntersecting) return;
                const i = +en.target.dataset.ch;
                stages.forEach((s, k) => s.classList.toggle('on', k === i));
                chapters.forEach((c, k) => c.classList.toggle('is-active', k === i));
                if (num) num.textContent = '۰' + faNum(i + 1);
                if (name) name.textContent = en.target.dataset.name || '';
            });
        }, { threshold: .45 });
        chapters.forEach((c) => io.observe(c));
    })();

    /* ── ترسیم زنجیره ارزش با اسکرول + روشن شدن گره‌ها ── */
    (function chain() {
        const wrap = $('.chain-wrap'); if (!wrap) return;
        ['chain-path-h', 'chain-path-v'].forEach((id) => {
            const p = document.getElementById(id);
            if (p && p.getBoundingClientRect().width > 0) {
                E.anim.draw(p, { scrub: true, trigger: wrap, start: 'top 85%', end: 'bottom 55%', duration: 2 });
            }
        });
        const nodes = $$('.chain-node', wrap);
        if (!nodes.length) return;
        if (hasGsap && !reduced) {
            gsap.fromTo(nodes, { scale: .6, opacity: 0 }, {
                scale: 1, opacity: 1, stagger: .16, duration: .55, ease: 'back.out(1.8)',
                scrollTrigger: { trigger: wrap, start: 'top 78%' },
                onComplete: () => nodes.forEach((n) => n.classList.add('on'))
            });
        } else {
            const io = new IntersectionObserver((es) => es.forEach((e) => {
                if (e.isIntersecting) { nodes.forEach((n, i) => setTimeout(() => n.classList.add('on'), i * 160)); io.disconnect(); }
            }), { threshold: .3 });
            io.observe(wrap);
        }
    })();
})();