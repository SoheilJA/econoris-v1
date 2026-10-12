/* ═══ Econoris — دیکشنری مرکزی محتوای سراسری (fa)
   ساختار طوری است که بعداً locale «en» به همین شکل اضافه می‌شود.
   متن صفحات (برای SEO و کار بدون JS) داخل خود HTML صفحات است. ═══ */
window.ECONORIS_CONTENT = {
  fa: {
    nav: {
      services: 'خدمات ما', about: 'درباره ما', contact: 'تماس با ما',
      search: 'جستجو', login: 'ورود یا ثبت نام', cta: 'درخواست مشاوره رایگان',
      menu: 'باز کردن منو', close: 'بستن',
      searchPlaceholder: 'چه چیزی را جستجو می‌کنید؟ مثلاً «آزمایشگاه» یا «مشاوره»'
    },
    mega: {
      featuredTitle: 'مشاوره رایگان از متخصصین ما',
      featuredDesc: 'مسیر رشد ایده یا طرح پژوهشی خود را با یک جلسه مشاوره تخصصی شروع کنید.',
      featuredCta: 'درخواست مشاوره',
      cats: [
        {
          title: 'فضای کار اشتراکی', en: 'SHARED WORKSPACE',
          href: 'services/shared-workspace.html', color: '#2F6BFF', icon: 'desk',
          items: [
            { t: 'میز پژوهشی', d: 'ایستگاه کاری اختصاصی برای مطالعه و پژوهش علمی', href: 'services/research-desk.html', icon: 'desk' },
            { t: 'اتاق اختصاصی پژوهشی', d: 'فضایی خصوصی برای تمرکز کامل تیم‌های پژوهشی', href: 'services/private-research-room.html', icon: 'lock' },
            { t: 'آزمایشگاه', d: 'تجهیزات تخصصی برای طرح‌های دارویی و زیست‌فناوری', href: 'services/laboratory.html', icon: 'flask' },
            { t: 'اینترنت پرسرعت', d: 'دسترسی سریع و پایدار به منابع علمی جهان', href: 'services/high-speed-internet.html', icon: 'wifi' },
            { t: 'مشاوره حقوقی', d: 'از پتنت و مالکیت فکری تا قراردادهای همکاری', href: 'services/legal-consulting.html', icon: 'scale' },
            { t: 'دسترسی به منابع اطلاعاتی', d: 'پایگاه‌ها و ژورنال‌های معتبر علمی', href: 'services/information-resources.html', icon: 'book' }
          ]
        },
        {
          title: 'حمایت از ایده', en: 'IDEA SUPPORT',
          href: 'idea-support.html', color: '#FF4FA3', icon: 'bulb',
          items: [
            { t: 'مشاوره تخصصی', d: 'اعتبارسنجی و پرورش ایده با متخصصین حوزه', href: 'idea-support.html#consulting', icon: 'chat' },
            { t: 'شبکه‌سازی', d: 'اتصال به شبکه متخصصین، منتورها و سرمایه‌گذاران', href: 'idea-support.html#networking', icon: 'network' },
            { t: 'توسعه تجاری', d: 'از مدل درآمدی و طرح کسب‌وکار تا ورود به بازار', href: 'idea-support.html#business-development', icon: 'briefcase' },
            { t: 'منابع مالی', d: 'معرفی به منابع مالی و سرمایه‌گذاران حوزه سلامت', href: 'idea-support.html#funding', icon: 'coins' }
          ]
        },
        {
          title: 'حمایت از طرح‌های پژوهشی', en: 'RESEARCH SUPPORT',
          href: 'research-projects-support.html', color: '#00D4C2', icon: 'file',
          items: [
            { t: 'تخصیص بودجه پژوهشی', d: 'تأمین منابع مالی برای طرح‌های تحقیقاتی مصوب', href: 'research-projects-support.html#budget', icon: 'coins' },
            { t: 'امکانات آزمایشگاهی', d: 'استفاده از زیرساخت و تجهیزات آزمایشگاهی', href: 'research-projects-support.html#facilities', icon: 'flask' },
            { t: 'مشاوره علمی تخصصی', d: 'هدایت علمی طرح‌های پژوهشی توسط متخصصین', href: 'research-projects-support.html#scientific-consulting', icon: 'chat' },
            { t: 'حمایت از انتشار مقالات', d: 'پشتیبانی از نگارش و انتشار مقالات علمی', href: 'research-projects-support.html#publication-support', icon: 'book' },
            { t: 'ارتباط با صنعت', d: 'پل ارتباطی میان تیم‌های پژوهشی و صنعت داروسازی', href: 'research-projects-support.html#industry-connection', icon: 'network' }
          ]
        }
      ]
    },
    drawer: { servicesLabel: 'خدمات ما', call: 'تماس تلفنی', consult: 'مشاوره رایگان', home: 'صفحه اصلی' },
    search: { hint: 'برای بستن، کلید ESC را بزنید یا خارج از کادر کلیک کنید', empty: 'نتیجه‌ای یافت نشد؛ عبارت دیگری را امتحان کنید.', popular: 'دسترسی سریع' },
    footer: {
      brand: 'اکونوریس، شتاب‌دهنده‌ای نوآور در حوزه نوآوری‌های دارویی و زیست‌فناوری، با هدف حمایت از تیم‌های علمی و استارت‌آپ‌های خلاق، در مسیر خلق آینده‌ای بهتر در حوزه سلامت گام برمی‌دارد. ما با ارائه خدمات جامع از جمله حمایت مالی، مشاوره تخصصی، دسترسی به شبکه ارتباطی گسترده و حضور در رویدادهای مهم، به تیم‌ها و استارت‌آپ‌ها کمک می‌کنیم تا به پتانسیل خود دست یابند و به موفقیت‌های چشمگیری برسند.',
      servicesTitle: 'خدمات', accessTitle: 'دسترسی‌ها', whereTitle: 'ما کجا هستیم',
      rights: 'تمامی حقوق وبسایت اکونوریس برای شرکت محفوظ است.',
      backTop: 'بازگشت به بالا',
      servicesLinks: [
        { t: 'فضای کار اشتراکی', href: 'services/shared-workspace.html' },
        { t: 'مشاوره حقوقی', href: 'services/legal-consulting.html' },
        { t: 'مشاوره علمی', href: 'research-projects-support.html#scientific-consulting' },
        { t: 'خدمات آزمایشگاهی', href: 'services/laboratory.html' },
        { t: 'بازاریابی', href: '#' },
        { t: 'ارتباط با صنایع', href: 'research-projects-support.html#industry-connection' },
        { t: 'کنترل کیفی', href: '#' },
        { t: 'شبکه‌سازی', href: 'idea-support.html#networking' }
      ],
      accessLinks: [
        { t: 'صفحه اصلی', href: 'index.html', icon: 'home' },
        { t: 'مجله آموزشی', href: 'blog.html', icon: 'newspaper' },
        { t: 'مقالات علمی', href: 'pages/scientific-articles.html', icon: 'book' },
        { t: 'رویدادها', href: 'pages/events.html', icon: 'calendar' },
        { t: 'آموزش‌ها', href: 'pages/trainings.html', icon: 'grad' },
        { t: 'دستاوردها', href: 'pages/achievements.html', icon: 'award' },
        { t: 'تماس با ما', href: 'contact.html', icon: 'phone' },
        { t: 'درباره ما', href: 'about.html', icon: 'users' }
      ]
    },
    /* ایندکس جستجوی سایت (برای اورلی جستجو) */
    searchIndex: [
      { t: 'صفحه اصلی', d: 'شتاب‌دهنده اکونوریس — از ایده تا بازار', u: 'index.html', i: 'home' },
      { t: 'درباره اکونوریس', d: 'نخستین شتاب‌دهنده تخصصی زنجیره ارزش گیاهان دارویی در شمال شرق کشور', u: 'about.html', i: 'users' },
      { t: 'تماس با ما و درخواست مشاوره رایگان', d: 'فرم درخواست مشاوره، آدرس و شماره تماس', u: 'contact.html', i: 'phone' },
      { t: 'مجله آموزشی', d: 'مقالات آموزشی حوزه داروسازی و زیست‌فناوری', u: 'blog.html', i: 'newspaper' },
      { t: 'فضای کار اشتراکی', d: 'میز پژوهشی، اتاق اختصاصی، آزمایشگاه و...', u: 'services/shared-workspace.html', i: 'desk' },
      { t: 'میز پژوهشی', d: 'ایستگاه کاری اختصاصی برای پژوهش علمی', u: 'services/research-desk.html', i: 'desk' },
      { t: 'اتاق اختصاصی پژوهشی', d: 'فضای خصوصی تیم‌های پژوهشی و R&D', u: 'services/private-research-room.html', i: 'lock' },
      { t: 'آزمایشگاه', d: 'تجهیزات آنالیزی، فرمولاسیون و کنترل کیفی', u: 'services/laboratory.html', i: 'flask' },
      { t: 'اینترنت پرسرعت', d: 'دسترسی به پایگاه‌های علمی جهان', u: 'services/high-speed-internet.html', i: 'wifi' },
      { t: 'مشاوره حقوقی', d: 'مالکیت فکری، پتنت، قراردادها و رگولاتوری', u: 'services/legal-consulting.html', i: 'scale' },
      { t: 'دسترسی به منابع اطلاعاتی', d: 'PubMed، Scopus، SciFinder و ژورنال‌های تخصصی', u: 'services/information-resources.html', i: 'book' },
      { t: 'حمایت از ایده', d: 'مشاوره، شبکه‌سازی، توسعه تجاری و منابع مالی', u: 'idea-support.html', i: 'bulb' },
      { t: 'حمایت از طرح‌های پژوهشی', d: 'بودجه، امکانات، انتشار مقاله و ارتباط با صنعت', u: 'research-projects-support.html', i: 'file' },
      { t: 'رویدادها', d: 'رویدادهای اکونوریس', u: 'pages/events.html', i: 'calendar' },
      { t: 'آموزش‌ها', d: 'دوره‌ها و کارگاه‌های آموزشی', u: 'pages/trainings.html', i: 'grad' },
      { t: 'دستاوردها', d: 'دستاوردها و طرح‌های اجراشده', u: 'pages/achievements.html', i: 'award' },
      { t: 'مقالات علمی', d: 'مقالات علمی تیم‌ها و متخصصین', u: 'pages/scientific-articles.html', i: 'book' }
    ]
  }
  /* en: { ... } — نسخه انگلیسی بعداً دقیقاً با همین ساختار اضافه می‌شود */
};