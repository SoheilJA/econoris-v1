# نقشه پروژه — اکونوریس

> مرجع سریع برای پیدا کردن محل قرارگیری هر بخش. قبل از هر تغییری این فایل را بخوان تا نیازی به اسکن دوباره همه فایل‌ها نباشد.

## معرفی پروژه

وب‌سایت رسمی **اکونوریس**، شتاب‌دهنده تخصصی داروسازی و زیست‌فناوری (زیرمجموعه گروه فضل دارو). سایت فارسی و راست‌چین است.

- **متن اصلی صفحات هنوز وارد نشده** — جایگزینی متن با کامنت‌های `<!-- [PAGE: xxx] — ... -->` در صفحات خدمات مشخص شده است.
- **اطلاعات تماس و لینک‌ها**: تنها منبع حقیقت [assets/js/config.js](assets/js/config.js) است (شماره تلفن، آدرس، نقشه، شبکه‌های اجتماعی، لینک ورود). در کل سایت از همین ثابت استفاده می‌شود.
- **منوها، فوتر، جستجو**: محتوای آن‌ها در [assets/js/content.js](assets/js/content.js) (دیکشنری مرکزی `ECONORIS_CONTENT.fa`) قرار دارد و توسط [assets/js/components.js](assets/js/components.js) به صفحات تزریق می‌شود.

## پشته فناوری

| فناوری | کاربرد | نحوه استفاده |
|--------|--------|---------------|
| Tailwind CSS v4 | استایل | در همه صفحات از CDN (`cdn.tailwindcss.com`) + [assets/js/tailwind-config.js](assets/js/tailwind-config.js). خروجی ساخته‌شده نیز در [assets/css/output.css](assets/css/output.css) |
| Vanilla JS | منطق | بدون فریم‌ورک؛ همه چیز در `assets/js/` |
| GSAP + ScrollTrigger + ScrollToPlugin | انیمیشن اسکرول | از CDN |
| anime.js | انیمیشن | از CDN |
| Three.js v0.149 | صحنه‌های سه‌بعدی | از CDN، فقط در صفحاتی که `three-scenes.js`/`three-hero.js` لود می‌کنند |

**بیلد Tailwind**: `npm run dev` → `@tailwindcss/cli` از `assets/css/input.css` خروجی `assets/css/output.css` را می‌سازد.

## ساختار پوشه‌ها

```
├── index.html                    # صفحه اصلی
├── about.html                    # درباره ما
├── contact.html                  # تماس با ما + فرم مشاوره
├── blog.html                     # مجله آموزشی
├── idea-support.html             # حمایت از ایده (۴ مرحله)
├── research-projects-support.html# حمایت از طرح‌های پژوهشی
├── services/                     # ۷ صفحه خدمت
├── pages/                        # ۴ صفحه داخلی (همگی «به‌زودی»)
├── assets/
│   ├── css/                      # custom.css + services.css + input/output
│   ├── js/                       # ۱۴ فایل جاوااسکریپت
│   └── img/                      # favicon.svg, og-cover.svg
├── PROJECT-MAP.md                # همین فایل
├── package.json                  # اسکریپت dev
└── .gitignore                    # node_modules, tmp-probe.css, agent-progress.md
```

## نقشه صفحات

### ریشه (۶ صفحه)

| صفحه | بخش‌ها (section) | اسکریپت اختصاصی | صحنه ۳بعدی |
|-------|-------------------|------------------|-------------|
| [index.html](index.html) | `#hero`، نوار متحرک خدمات، `#services` (۳ کارت بزرگ)، `#journey` (سفر ایده تا بازار)، `#about-teaser`، `#projects` (ریل + مودال)، نوار مشاوره رایگان، `#testimonials`، `#magazine` | page-home.js | three-hero (`#hero-canvas`) |
| [about.html](about.html) | هیرو، فصل‌های داستان، شمارنده‌ها، زنجیره ارزش، گروه فضل دارو، CTA | page-about.js | three-hero |
| [contact.html](contact.html) | همان ساختار about + فرم مشاوره و کپی اطلاعات | page-contact.js | three-hero |
| [blog.html](blog.html) | هیرو، فیلتر دسته‌بندی، مقاله شاخص، شبکه مقالات | page-blog.js | three-hero |
| [idea-support.html](idea-support.html) | `#consulting`، `#networking`، `#business-development`، `#funding` + قیف پرتاب | page-services.js | — |
| [research-projects-support.html](research-projects-support.html) | `#budget`، `#facilities`، `#scientific-consulting`، `#publication-support`، `#industry-connection` + نقشه راه | page-services.js | graph |

### services/ (۷ صفحه)

همگی از **page-services.js** استفاده می‌کنند و استایلشان در [assets/css/services.css](assets/css/services.css) است.

| صفحه | ویژگی خاص | صحنه ۳بعدی |
|-------|------------|-------------|
| [shared-workspace.html](services/shared-workspace.html) | نقشه پردیس ایزومتریک با ۶ منطقه | — |
| [research-desk.html](services/research-desk.html) | تب‌ها، مزیت‌ها | graph |
| [private-research-room.html](services/private-research-room.html) | ۵ فصل خدماتی چسبان، کارت‌های برگردان | room |
| [laboratory.html](services/laboratory.html) | کاوشگر تجهیزات، کروماتوگرام HPLC، مدل‌های دسترسی | molecule |
| [high-speed-internet.html](services/high-speed-internet.html) | گیج سرعت، چیپ‌های پایگاه‌ها، ریل جریان داده | globe |
| [information-resources.html](services/information-resources.html) | جستجوی مداری تایپی، دیوار چالش‌ها | — |
| [legal-consulting.html](services/legal-consulting.html) | ترازوی متحرک، نوار ریسک، مهر حقوقی | — |

### pages/ (۴ صفحه — همگی «به‌زودی»)

- [achievements.html](pages/achievements.html) — دستاوردها
- [events.html](pages/events.html) — رویدادها
- [scientific-articles.html](pages/scientific-articles.html) — مقالات علمی
- [trainings.html](pages/trainings.html) — آموزش‌ها

این صفحات فقط config/content/components/preloader/animations/main لود می‌کنند و صفحه جایگزین محتوا دارند.

## فایل‌های جاوااسکریپت

### مشترک (در همه صفحات)

| فایل | نقش |
|------|-----|
| [config.js](assets/js/config.js) | `ECONORIS_CONFIG`: اطلاعات تماس، آدرس، شبکه‌های اجتماعی، لینک‌ها |
| [content.js](assets/js/content.js) | `ECONORIS_CONTENT.fa`: ناوبری، مگامنو (۳ دسته)، دراور، فوتر، **ایندکس جستجوی سایت** |
| [components.js](assets/js/components.js) | تزریق هدر، مگامنو، دراور موبایل، اورلی جستجو، فوتر، نوار موبایل، ترنزیشن صفحه (`E.go()`) |
| [preloader.js](assets/js/preloader.js) | پری‌لودر «کپسول و مولکول» (با `sessionStorage`) |
| [animations.js](assets/js/animations.js) | `E.anim`: هلپرهای GSAP مشترک |
| [main.js](assets/js/main.js) | رفتارهای سراسری: هدر شیشه‌ای، مگامنو، دراور، آکاردئون، جستجو، ریویل‌ها، شمارنده‌ها، کرسر، مارکی، بازگشت به بالا |

### اختصاصی صفحات

| فایل | رفتارها |
|------|---------|
| [page-home.js](assets/js/page-home.js) | ورود هیرو، پارالاکس چیپ‌ها، اسکرول هیرو، انیمیشن پشته خدمات (`servicesStack`)، مراحل سفر (`journey`)، ریل پروژه‌ها (قابل درگ + مودال)، نظرات (اسلایدر خودکار) |
| [page-about.js](assets/js/page-about.js) | تیتر، فصل‌های داستان، زنجیره ارزش |
| [page-contact.js](assets/js/page-contact.js) | اعتبارسنجی فرم (`validateField`)، ارسال درخواست مشاوره، کپی متن، کانفتی موفقیت |
| [page-blog.js](assets/js/page-blog.js) | فیلتر مقالات |
| [page-services.js](assets/js/page-services.js) | رفتارهای مشترک خدمات: تب‌ها، چک‌لیست‌ها، فصل‌های چسبان، جستجوی تایپی، گیج‌ها، نقشه پردیس، نقشه راه، ناوبری لنگری |
| [three-hero.js](assets/js/three-hero.js) | صحنه هیرو: شبکه مولکولی + کپسول (`E.mountHeroScene`) |
| [three-scenes.js](assets/js/three-scenes.js) | صحنه‌های خدمات: `E.scenes.graph`، `.room`، `.molecule`، `.globe` |
| [tailwind-config.js](assets/js/tailwind-config.js) | تنظیمات Tailwind Play CDN (رنگ‌ها و فونت) |

## فایل‌های CSS

| فایل | محتوا |
|------|-------|
| [input.css](assets/css/input.css) | فقط `@import "tailwindcss"` — منبع بیلد |
| [output.css](assets/css/output.css) | خروجی Tailwind v4 (تولیدشده) |
| [custom.css](assets/css/custom.css) | سیستم طراحی + صفحات داخلی: متغیرها، helpers، اتمسفر (aurora/blobs/dots/grain)، تایپوگرافی، دکمه‌ها، هدر، مگامنو، دراور، جستجو، کرسر، ریویل، اسپات‌لایت، مارکی، هیرو، خدمات، سفر، شمارنده‌ها، ریل پروژه‌ها، CTA، نظرات، مجله، فوتر، بازگشت به بالا، نوار موبایل، پری‌لودر، ترنزیشن، مودال، Toast، reduced-motion، ABOUT (زنجیره ارزش + فضل دارو)، CONTACT، BLOG، صفحات «به‌زودی» |
| [services.css](assets/css/services.css) | استایل صفحات خدمات: رنگ لهجه هر صفحه، هیرو، ریویل، چک‌لیست، تب‌ها، کاشی‌ها، فصل‌های چسبان، کارت‌های برگردان، مهر و ترازو، نوار ریسک، گیج، چیپ پایگاه‌ها، جریان داده، کروماتوگرام HPLC، تجهیزات، مدل دسترسی، ۷ آزمایش، جستجوی مداری، نقشه پردیس، قیف ایده، نقشه راه، ناوبری لنگری |

## یادداشت‌های مهم

- **`contact.html` عنوانش هنوز «درباره اکونوریس» است** (کپی از `about.html` و اصلاح نشده). اگر روی صفحه تماس کار کردی، این را هم درست کن.
- **ایندکس جستجو** در `content.js` (`searchIndex`) و منطق آن در `main.js` (`initSearch`) است. صفحه جدیدی اضافه کردی؟ اینجا هم ثبت کن.
- **صحنه‌های سه‌بعدی** با ویژگی `data-scene="..."` روی `<canvas>` مشخص می‌شوند و توسط `three-scenes.js` سوار می‌شوند.
- **رفتار بدون JS**: محتوای متنی داخل خود HTML است (برای SEO) و `components.js` فقط chrome (هدر/فوتر/...) را تزریق می‌کند.
- **فایل‌های نادیده‌گرفته‌شده در گیت**: `node_modules/`، `tmp-probe.css`، `agent-progress.md`.
