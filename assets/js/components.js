/* ═══ Econoris — کامپوننت‌های مشترک (هدر، مگامنو، دراور موبایل، جستجو، فوتر، ...)
   به صورت template-literal تزریق می‌شوند تا سایت بدون سرور و با file:// هم کار کند ═══ */
(function () {
  const C = window.ECONORIS_CONFIG, L = window.ECONORIS_CONTENT && window.ECONORIS_CONTENT.fa;
  const E = window.Econoris = window.Econoris || {};
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  if (!L) { console.warn('[Econoris] content.js load nashod'); return; }

  /* ─── آیکون‌های خطی (SVG) ─── */
  const ICONS = {
    search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/>',
    close: '<path d="M18 6L6 18M6 6l12 12"/>',
    'chevron-down': '<path d="M6 9l6 6 6-6"/>',
    'arrow-left': '<path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>',
    'arrow-right': '<path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>',
    'arrow-up': '<path d="M12 19V5"/><path d="M5 12l7-7 7 7"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.4 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.9 2.2z"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="3"/><path d="M22 7l-10 7L2 7"/>',
    'map-pin': '<path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="3"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
    newspaper: '<path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0V9"/><path d="M18 14h-8M15 18h-5M10 6h8v4h-8z"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    award: '<circle cx="12" cy="8" r="6"/><path d="M8.2 13.9L7 22l5-3 5 3-1.2-8.1"/>',
    grad: '<path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5"/>',
    users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    chat: '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z"/>',
    network: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/>',
    briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
    coins: '<circle cx="8.5" cy="8.5" r="5.5"/><path d="M18.6 10.4A6 6 0 1 1 10.4 18.6"/><path d="M8.5 6v5M6 8.5h5"/>',
    flask: '<path d="M9 3h6M10 3v5l-5.5 9.5A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-3.5L14 8V3"/><path d="M7.5 15h9"/>',
    wifi: '<path d="M5 12.5a10 10 0 0 1 14 0"/><path d="M8.5 15.5a5 5 0 0 1 7 0"/><circle cx="12" cy="18.5" r="1" fill="currentColor" stroke="none"/>',
    scale: '<path d="M12 3v18M8 21h8"/><path d="M12 6L4 9m8-3l8 3"/><path d="M4 9l-2.5 5a3.8 3.8 0 0 0 5 0zM20 9l-2.5 5a3.8 3.8 0 0 0 5 0z"/>',
    desk: '<rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    bulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1.1 2l.1.6h4.6l.1-.6c.1-.8.5-1.5 1.1-2A6 6 0 0 0 12 3z"/>',
    check: '<path d="M20 6L9 17l-5-5"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    rocket: '<path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4z"/>'
  };
  E.icon = (n, cls) => `<svg class="${cls || 'w-5 h-5'}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n] || ''}</svg>`;

  /* ─── لوگوی برند (کپسول گرادیانی) ─── */
  let uid = 0;
  E.brandLogo = (cls) => {
    const id = 'ecogr' + (++uid);
    return `<svg class="${cls || 'w-10 h-10'}" viewBox="0 0 48 48" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2F6BFF"/><stop offset=".55" stop-color="#7C4DFF"/><stop offset="1" stop-color="#00D4C2"/></linearGradient></defs><g transform="rotate(45 24 24)"><rect x="17" y="6" width="14" height="36" rx="7" fill="url(#${id})"/><path d="M17 24h14" stroke="rgba(255,255,255,.5)" stroke-width="1.5" stroke-dasharray="3 3"/><circle cx="24" cy="15" r="2.4" fill="#fff" opacity=".92"/></g></svg>`;
  };

  const active = (p) => document.body.dataset.page === p ? ' is-active' : '';

  /* ─── هدر + مگامنو ─── */
  function megaItem(it) {
    return `<a href="${it.href}" class="mega-item" style="--cat:${it.color || '#2F6BFF'}">
      ${E.icon(it.icon, 'w-5 h-5 mega-item-icon')}
      <span class="flex-1 min-w-0"><span class="block font-bold text-[15px] text-white">${it.t}</span>
      <span class="block text-[12.5px] leading-5 mt-0.5" style="color:var(--lav);opacity:.75">${it.d}</span></span>
      <span class="mega-arrow">${E.icon('arrow-left', 'w-4 h-4')}</span></a>`;
  }
  function megaHTML() {
    const cols = L.mega.cats.map(cat => `
      <div class="mega-cat">
        <a href="${cat.href}" class="mega-cat-head" style="--cat:${cat.color}">${E.icon(cat.icon, 'w-5 h-5')}<span>${cat.title}</span><em class="cat-en" dir="ltr">${cat.en}</em></a>
        <div class="mega-list">${cat.items.map(megaItem).join('')}</div>
      </div>`).join('');
    const cat0 = L.mega.cats[0];
    return `<div class="mega-inner"><div class="mega-grid">
      ${cols}
      <aside class="mega-featured">
        <div class="mf-visual" aria-hidden="true">
          <svg class="mf-capsule" width="26" height="44" viewBox="0 0 26 44"><rect x="1.5" y="1.5" width="23" height="41" rx="11.5" fill="none" stroke="#00D4C2" stroke-width="2"/><path d="M1.5 22h23" stroke="rgba(255,255,255,.4)" stroke-width="1.4" stroke-dasharray="3 3"/></svg>
          <span class="mf-orbit"></span>
          <svg width="70" height="34" viewBox="0 0 70 34" style="position:absolute;top:10px;inset-inline-start:56px"><circle cx="12" cy="26" r="3" fill="#FF4FA3"/><circle cx="40" cy="8" r="3" fill="#FFB938"/><circle cx="62" cy="24" r="3" fill="#B6F23A"/></svg>
        </div>
        <h4>${L.mega.featuredTitle}</h4>
        <p>${L.mega.featuredDesc}</p>
        <a href="${C.consultUrl}" class="btn btn-gradient btn-sm" style="margin-top:auto">${L.mega.featuredCta}</a>
      </aside>
    </div></div>`;
  }
  function headerHTML() {
    return `
    <div id="scroll-progress" aria-hidden="true"><span></span></div>
    <div class="header-bar">
      <div class="hcontainer">
        <a href="index.html" class="logo" aria-label="اکونوریس — صفحه اصلی">
          ${E.brandLogo('w-9 h-9 lg:w-10 lg:h-10')}
          <span class="logo-text">اکونوریس<small>${C.siteTagline}</small></span>
        </a>
        <nav class="hidden lg:flex items-center gap-1" aria-label="منوی اصلی">
          <button id="mega-btn" class="nav-link" aria-expanded="false" aria-controls="mega-panel">${L.nav.services}${E.icon('chevron-down', 'w-4 h-4 chev')}</button>
          <a href="about.html" class="nav-link${active('about')}">${L.nav.about}</a>
          <a href="contact.html" class="nav-link${active('contact')}">${L.nav.contact}</a>
        </nav>
        <div class="hidden lg:flex items-center gap-2">
          <button class="icon-btn" data-open-search aria-label="${L.nav.search}">${E.icon('search')}</button>
          <a href="${C.loginUrl}" class="ghost-btn">${L.nav.login}</a>
          <a href="${C.consultUrl}" class="btn btn-gradient btn-sm" data-magnetic>${L.nav.cta}</a>
        </div>
        <div class="flex lg:hidden items-center gap-1">
          <button class="icon-btn" data-open-search aria-label="${L.nav.search}">${E.icon('search')}</button>
          <button class="icon-btn burger" id="drawer-open" aria-label="${L.nav.menu}" aria-expanded="false"><span class="burger-box"><span></span><span></span><span></span></span></button>
        </div>
      </div>
    </div>
    <div id="mega-panel" class="mega-panel" hidden>${megaHTML()}</div>`;
  }

  /* ─── دراور موبایل ─── */
  function drawerHTML() {
    const groups = L.mega.cats.map(cat => `
      <div>
        <button class="dw-group-btn" data-acc style="--cat:${cat.color}"><span class="dw-dot"></span>${cat.title}${E.icon('chevron-down', 'w-5 h-5 acc-chev ms-auto')}</button>
        <div class="dw-panel-inner">
          <div style="padding:.2rem 0 .4rem 1rem;display:flex;flex-direction:column;gap:.15rem">
            <a class="dw-all" href="${cat.href}">صفحه دسته ${E.icon('arrow-left', 'w-4 h-4 inline-block align-middle')}</a>
            ${cat.items.map(it => `<a class="dw-link" style="min-height:44px;font-size:.88rem" href="${it.href}">${E.icon(it.icon, 'w-4 h-4 shrink-0')}<span>${it.t}</span></a>`).join('')}
          </div>
        </div>
      </div>`).join('');
    return `
    <div class="dw-backdrop" data-close-drawer></div>
    <div class="dw-panel" role="dialog" aria-modal="true" aria-label="منوی موبایل">
      <div class="dw-head">
        <a href="index.html" class="logo">${E.brandLogo('w-8 h-8')}<span class="logo-text" style="font-size:1rem">اکونوریس</span></a>
        <button class="icon-btn" data-close-drawer aria-label="${L.nav.close}">${E.icon('close')}</button>
      </div>
      <nav class="dw-nav" aria-label="منوی موبایل">
        <a class="dw-link big" href="index.html">${E.icon('home', 'w-5 h-5')}<span>${L.drawer.home}</span></a>
        <button class="dw-services-btn" data-acc>${L.drawer.servicesLabel}${E.icon('chevron-down', 'w-5 h-5 acc-chev')}</button>
        <div class="dw-panel-inner">${groups}</div>
        <a class="dw-link big" href="about.html">${E.icon('users', 'w-5 h-5')}<span>${L.nav.about}</span></a>
        <a class="dw-link big" href="contact.html">${E.icon('phone', 'w-5 h-5')}<span>${L.nav.contact}</span></a>
        <a class="dw-link big" href="blog.html">${E.icon('newspaper', 'w-5 h-5')}<span>مجله آموزشی</span></a>
      </nav>
      <div class="dw-actions">
        <a href="${C.phoneHref}" class="btn btn-ghost w-full justify-center">${E.icon('phone', 'w-5 h-5')} ${C.phoneDisplay}</a>
        <a href="${C.consultUrl}" class="btn btn-gradient w-full justify-center">${L.nav.cta}</a>
      </div>
    </div>`;
  }

  /* ─── اورلی جستجو ─── */
  function searchHTML() {
    return `
    <div class="so-backdrop" data-close-search></div>
    <div class="so-panel" role="dialog" aria-modal="true" aria-label="جستجو در سایت">
      <div class="so-box">
        ${E.icon('search', 'w-6 h-6 so-ico')}
        <input id="so-input" type="search" placeholder="${L.nav.searchPlaceholder}" autocomplete="off" aria-label="${L.nav.search}">
        <button class="icon-btn" data-close-search aria-label="${L.nav.close}">${E.icon('close')}</button>
      </div>
      <div class="so-hint">${L.search.hint}</div>
      <div id="so-results" class="so-results" role="listbox"></div>
    </div>`;
  }

  /* ─── فوتر ─── */
  const WAVE_D = 'M0,46 C240,78 480,14 720,38 C960,62 1200,22 1440,46 C1680,78 1920,14 2160,38 C2400,62 2640,22 2880,46 L2880,100 L0,100 Z';
  function footerHTML() {
    const wave = (dur) => `<svg class="fw" viewBox="0 0 2880 100" preserveAspectRatio="none" style="animation-duration:${dur}s" aria-hidden="true"><path d="${WAVE_D}"/></svg>`;
    return `
    <div class="footer-waves" aria-hidden="true">${wave(11)}${wave(17)}${wave(26)}</div>
    <div class="footer-body">
      <div class="hcontainer">
        <div class="fgrid">
          <div class="fbrand">
            <a href="index.html" class="logo">${E.brandLogo('w-11 h-11')}<span class="logo-text">اکونوریس<small>${C.siteTagline}</small></span></a>
            <p class="ftext">${L.footer.brand}</p>
            <div class="fsocial">${C.socials.map(s => `<a href="${s.url}" aria-label="${s.name}" title="${s.name}">${s.name.slice(0, 2)}</a>`).join('')}</div>
          </div>
          <nav aria-label="${L.footer.servicesTitle}">
            <h4>${L.footer.servicesTitle}</h4>
            <ul class="flist">${L.footer.servicesLinks.map(l => `<li><a href="${l.href}">${l.t}</a></li>`).join('')}</ul>
          </nav>
          <nav aria-label="${L.footer.accessTitle}">
            <h4>${L.footer.accessTitle}</h4>
            <ul class="flist">${L.footer.accessLinks.map(l => `<li><a href="${l.href}">${E.icon(l.icon, 'w-4 h-4')}${l.t}</a></li>`).join('')}</ul>
          </nav>
          <div>
            <h4>${L.footer.whereTitle}</h4>
            <address class="faddr">${E.icon('map-pin', 'w-4 h-4 inline align-middle mb-1')} ${C.address}</address>
            <div class="fcontact">
              <a href="${C.phoneHref}">${E.icon('phone', 'w-5 h-5')}<span dir="ltr">${C.phoneDisplay}</span></a>
              <a class="fmaps" href="${C.mapsUrl}" target="_blank" rel="noopener">${E.icon('rocket', 'w-4 h-4')} ${C.mapsLabel}</a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>${L.footer.rights}</p>
          <a href="${C.holdingUrl}" target="_blank" rel="noopener" class="fd-badge" title="${C.holdingName}">
            <b>${E.brandLogo('w-4 h-4')}${C.holdingBadgeFa}</b>
            <span class="en" dir="ltr">${C.holdingBadgeEn}</span>
          </a>
        </div>
      </div>
    </div>
    <button id="back-top" aria-label="${L.footer.backTop}">${E.icon('arrow-up', 'w-5 h-5')}</button>`;
  }

  /* ─── نوار اکشن موبایل + پرده انتقال ─── */
  function mobileBarHTML() {
    return `
    <a href="${C.phoneHref}" class="mb-btn">${E.icon('phone', 'w-5 h-5')}<span>${L.drawer.call}</span></a>
    <a href="${C.consultUrl}" class="mb-btn primary">${E.icon('chat', 'w-5 h-5')}<span>${L.drawer.consult}</span></a>`;
  }
  function transitionHTML() {
    /* اگر html کلاس pt-cover دارد (ورود از صفحه دیگر) پرده‌ها از ابتدا بسته‌شده صفحه را می‌پوشانند */
    const covered = document.documentElement.classList.contains('pt-cover');
    const pos = covered ? 'transform:skewY(-3deg) translateY(0)' : '';
    return `
    <div class="pt-a" style="${pos}"></div>
    <div class="pt-b" style="${pos}"></div>
    <div class="pt-logo">${E.brandLogo('w-14 h-14')}</div>`;
  }

  /* ─── تزریق به صفحه ─── */
  function inject() {
    const set = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };
    set('econoris-header', `<header id="site-header">${headerHTML()}</header>`);
    set('econoris-footer', `<footer id="site-footer">${footerHTML()}</footer>`);
    set('econoris-drawer', drawerHTML());
    set('econoris-search', searchHTML());
    set('econoris-transition', transitionHTML());
    set('econoris-mobilebar', mobileBarHTML());
  }
  inject();
})();