/* ═══ Econoris — رفتارهای صفحه تماس با ما ═══ */
(function () {
    const E = window.Econoris = window.Econoris || {};
    const C = window.ECONORIS_CONFIG;
    const $ = (s, r) => (r || document).querySelector(s);
    const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
    if (document.body.dataset.page !== 'contact' || !C) return;
    const U = E.utils || {};
    const reduced = !!U.reduced, hasGsap = !!U.hasGsap;

    /* ── صحنه پس‌زمینه (سبک و آرام) ── */
    const heroAPI = E.mountHeroScene ? E.mountHeroScene($('#contact-canvas'), { nodes: 8 }) : null;
    window.addEventListener('pagehide', () => { if (heroAPI) heroAPI.destroy(); });

    /* ── ترسیم جاده‌های نقشه هنگام دیده‌شدن ── */
    if (E.anim) E.anim.draw('.map-road', { trigger: '.map-card', start: 'top 80%', stagger: .1 });

    /* ── چیپ‌های چندانتخابی ── */
    $$('.chip-btn').forEach((chip) => {
        chip.addEventListener('click', () => {
            const on = chip.getAttribute('aria-pressed') === 'true';
            chip.setAttribute('aria-pressed', String(!on));
        });
    });

    /* ── اعتبارسنجی و ارسال ── */
    const toEn = (s) => String(s).replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
    const form = $('#consult-form');
    const F = {
        name: {
            el: $('#f-name'), err: $('#e-name'), wrap: null,
            test: (v) => v.trim().length >= 3, msg: 'لطفاً نام و نام خانوادگی خود را وارد کنید.'
        },
        phone: {
            el: $('#f-phone'), err: $('#e-phone'), wrap: null,
            test: (v) => /^09\d{9}$/.test(toEn(v).replace(/[\s-]/g, '')),
            msg: 'شماره موبایل معتبر وارد کنید (مثلاً ۰۹۱۲۳۴۵۶۷۸۹).'
        },
        email: {
            el: $('#f-email'), err: $('#e-email'), wrap: null, optional: true,
            test: (v) => !v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
            msg: 'ایمیل معتبر وارد کنید یا این فیلد را خالی بگذارید.'
        },
        msg: {
            el: $('#f-msg'), err: $('#e-msg'), wrap: null,
            test: (v) => v.trim().length >= 10, msg: 'توضیح کوتاهی درباره درخواست خود بنویسید (حداقل ۱۰ نویسه).'
        }
    };
    Object.values(F).forEach((f) => { f.wrap = f.el.closest('.field'); });

    function validateField(f) {
        const ok = f.test(f.el.value);
        f.err.textContent = ok ? '' : f.msg;
        f.wrap.classList.toggle('is-error', !ok);
        f.el.setAttribute('aria-invalid', String(!ok));
        return ok;
    }
    Object.values(F).forEach((f) => {
        f.el.addEventListener('blur', () => validateField(f));
        f.el.addEventListener('input', () => { if (f.wrap.classList.contains('is-error')) validateField(f); });
    });

    function shake(f) {
        f.wrap.classList.remove('shake'); void f.wrap.offsetWidth; f.wrap.classList.add('shake');
    }

    /* ═══ STUB — این تابع را با فراخوانی API واقعی خود جایگزین کنید ═══
       خروجی Promise؛ resolve یعنی ثبت موفق. */
    function submitConsultationRequest(data) {
        return new Promise((resolve) => {
            setTimeout(() => resolve({ ok: true, received: data }), 1400);
        });
    }

    const submitBtn = $('#f-submit');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        /* honeypot: اگر پر شده باشد، بی‌صدا «موفق» جلوه داده می‌شود */
        if ($('#hp-web').value) { showSuccess(); return; }
        let firstBad = null;
        Object.values(F).forEach((f) => { if (!validateField(f) && !firstBad) firstBad = f; });
        if (firstBad) { firstBad.el.focus(); shake(firstBad); return; }

        const data = {
            name: F.name.el.value.trim(),
            phone: toEn(F.phone.el.value).replace(/[\s-]/g, ''),
            email: F.email.el.value.trim(),
            message: F.msg.el.value.trim(),
            topics: $$('.chip-btn[aria-pressed="true"]').map((c) => c.dataset.chip),
            page: 'contact',
            ts: new Date().toISOString()
        };
        submitBtn.classList.add('is-loading');
        submitBtn.disabled = true;
        try {
            await submitConsultationRequest(data);
            showSuccess();
        } finally {
            submitBtn.classList.remove('is-loading');
            submitBtn.disabled = false;
        }
    });

    /* ── پنل موفقیت + کانفتی شش‌ضلعی ── */
    function drawNow(paths, dur) {
        paths.forEach((p) => { const L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = L; });
        if (hasGsap && !reduced) gsap.to(paths, { strokeDashoffset: 0, duration: dur || .7, stagger: .15, ease: 'power2.out' });
        else paths.forEach((p) => (p.style.strokeDashoffset = 0));
    }
    function hexConfetti(wrap) {
        const colors = ['#2F6BFF', '#7C4DFF', '#00D4C2', '#B6F23A', '#FF6B6B', '#FFB938', '#FF4FA3'];
        const bits = [];
        for (let i = 0; i < 16; i++) {
            const s = document.createElement('span');
            s.className = 'cnf';
            s.style.background = colors[i % colors.length];
            wrap.appendChild(s); bits.push(s);
        }
        if (hasGsap && !reduced) {
            gsap.fromTo(bits,
                { x: 0, y: 0, scale: 1, opacity: 1, rotate: 0 },
                {
                    x: () => gsap.utils.random(-170, 170), y: () => gsap.utils.random(-150, 130),
                    scale: 0, rotate: () => gsap.utils.random(-220, 220), opacity: 0,
                    duration: 1.05, ease: 'power2.out', stagger: .02, onComplete: () => bits.forEach((b) => b.remove())
                });
        } else setTimeout(() => bits.forEach((b) => b.remove()), 900);
    }
    function showSuccess() {
        const fs = $('#form-success');
        form.hidden = true;
        fs.hidden = false;
        drawNow([$('#fs-circle'), $('#fs-tick')], .8);
        hexConfetti($('.fs-wrap'));
        if (E.anim) E.anim.toast('درخواست شما با موفقیت ثبت شد ✓');
    }
    const again = $('#fs-again');
    if (again) again.addEventListener('click', () => {
        $('#form-success').hidden = true;
        form.hidden = false; form.reset();
        $$('.chip-btn').forEach((c) => c.setAttribute('aria-pressed', 'false'));
        Object.values(F).forEach((f) => { f.err.textContent = ''; f.wrap.classList.remove('is-error'); });
        F.name.el.focus();
    });

    /* ── دکمه‌های کپی ── */
    function copyText(text, msg) {
        const done = () => E.anim && E.anim.toast(msg);
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
        } else fallbackCopy(text, done);
    }
    function fallbackCopy(text, done) {
        const ta = document.createElement('textarea');
        ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); done(); } catch (e) { /* بی‌صدا */ }
        ta.remove();
    }
    $$('[data-copy]').forEach((b) => b.addEventListener('click', () => {
        copyText(b.dataset.copy === 'phone' ? C.phone : C.address, b.dataset.msg || 'کپی شد');
    }));

    /* ── بارگذاری تنبل نقشه ── */
    const loadBtn = $('#load-map');
    if (loadBtn) loadBtn.addEventListener('click', () => {
        const box = $('#map-embed');
        /* نقشه بر اساس متن آدرس (بدون اختراع مختصات) */
        const url = 'https://maps.google.com/maps?q=' + encodeURIComponent(C.address) + '&z=16&output=embed&hl=fa';
        box.innerHTML = '<iframe src="' + url + '" title="نقشه موقعیت اکونوریس" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>';
        box.hidden = false;
        loadBtn.hidden = true;
        if (hasGsap && !reduced) gsap.from(box, { opacity: 0, duration: .7 });
    });
})();