/* Econoris — Tailwind Play CDN config (رنگ‌ها و فونت سراسری) */
tailwind.config = {
  theme: {
    extend: {
      colors: {
        night: '#070B1F', night2: '#0C1233', ink: '#0C1233',
        mist: '#F3F6FF', mint: '#EEF9F6', cream: '#FFF6F0',
        electric: '#2F6BFF', vio: '#7C4DFF', aqua: '#00D4C2',
        citr: '#B6F23A', coral: '#FF6B6B', gold: '#FFB938', mag: '#FF4FA3',
        lav: '#C7D0F5'
      },
      fontFamily: { vazir: ['Vazirmatn', 'Tahoma', 'sans-serif'] },
      boxShadow: {
        glowBlue: '0 12px 40px -10px rgba(47,107,255,.55)',
        glowVio: '0 12px 40px -10px rgba(124,77,255,.5)',
        glowAqua: '0 12px 40px -10px rgba(0,212,194,.45)'
      }
    }
  }
};