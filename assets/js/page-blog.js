/* ═══ Econoris — رفتارهای مجله آموزشی ═══ */
(function () {
    const E = window.Econoris = window.Econoris || {};
    const $ = (s, r) => (r || document).querySelector(s);
    const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
    if (document.body.dataset.page !== 'blog') return;
    const reduced = E.utils ? E.utils.reduced : false;
    const hasGsap = E.utils ? E.utils.hasGsap : !!window.gsap;

    /* ── فیلتر دسته‌بندی ── */
    const chips = $$('.fchip');
    const cards = $$('[data-cat]');
    chips.forEach((chip) => {
        chip.addEventListener('click', () => {
            chips.forEach((c) => c.classList.toggle('on', c === chip));
            const cat = chip.dataset.cat;
            cards.forEach((card) => {
                card.classList.toggle('is-hidden', cat !== 'all' && card.dataset.cat !== cat);
            });
            const visible = cards.filter((c) => !c.classList.contains('is-hidden'));
            if (hasGsap && !reduced && visible.length) {
                gsap.fromTo(visible, { y: 18, opacity: 0 },
                    { y: 0, opacity: 1, duration: .45, stagger: .05, ease: 'power2.out', overwrite: true });
            }
        });
    });

    /* ── مقالات هنوز منتشر نشده‌اند ── */
    document.addEventListener('click', (e) => {
        const s = e.target.closest('[data-soon]');
        if (!s) return;
        e.preventDefault();
        if (E.anim) E.anim.toast('متن کامل این مقاله به‌زودی در مجله اکونوریس منتشر می‌شود.');
    });
})();