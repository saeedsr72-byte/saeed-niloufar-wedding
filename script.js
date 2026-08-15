/* S&N Wedding Invitation — stable interaction build */
(() => {
  'use strict';
  const gate = document.getElementById('gate');
  const openButton = document.getElementById('openInvitation');
  const site = document.getElementById('site');
  const langButton = document.getElementById('langToggle');
  const faAudio = document.getElementById('faAudio');
  const enAudio = document.getElementById('enAudio');
  const rsvpModal = document.getElementById('rsvpModal');
  const rsvpForm = document.getElementById('rsvpForm');
  if (!gate || !openButton || !site || !langButton || !faAudio || !enAudio) {
    console.error('S&N: critical invitation elements are missing.');
    return;
  }

  const tracks = { fa: faAudio, en: enAudio };
  const storedLang = (() => {
    try { return sessionStorage.getItem('snWeddingLang'); } catch (_) { return null; }
  })();
  let lang = storedLang === 'en' ? 'en' : 'fa';
  let opened = false;
  let viewCount = 'Unavailable';

  function setLanguage(next) {
    lang = next === 'en' ? 'en' : 'fa';
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-fa][data-en]').forEach((el) => {
      el.innerHTML = lang === 'fa' ? el.dataset.fa : el.dataset.en;
    });
    langButton.textContent = lang === 'fa' ? 'English' : 'فارسی';
    document.title = lang === 'fa'
      ? 'سعید و نیلوفر | ۱۰ شهریور ۱۴۰۵'
      : 'Saeed & Niloufar | 1 September 2026';
    const formLanguage = document.getElementById('formLanguage');
    if (formLanguage) formLanguage.value = lang === 'fa' ? 'Persian' : 'English';
  }

  function stopAudio() {
    Object.values(tracks).forEach((audio) => {
      audio.pause();
      try { audio.currentTime = 0; } catch (_) {}
    });
  }
  function playLanguageTrack() {
    const audio = tracks[lang];
    const other = lang === 'fa' ? tracks.en : tracks.fa;
    other.pause();
    try { other.currentTime = 0; } catch (_) {}
    audio.currentTime = 0;
    const promise = audio.play();
    if (promise && typeof promise.catch === 'function') promise.catch(() => {});
  }
  function lockGate() {
    opened = false;
    stopAudio();
    document.body.classList.add('gate-open');
    site.classList.add('locked');
    gate.classList.remove('split', 'opened');
    gate.setAttribute('aria-hidden', 'false');
    window.scrollTo(0, 0);
  }
  function openInvitation() {
    if (opened) return;
    opened = true;
    playLanguageTrack();
    document.body.classList.add('gate-open');
    site.classList.remove('locked');
    gate.classList.add('split');
    window.setTimeout(() => {
      gate.classList.add('opened');
      gate.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('gate-open');
      window.scrollTo(0, 0);
      document.querySelector('.hero')?.classList.add('visible');
    }, 2250);
  }

  langButton.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    const next = lang === 'fa' ? 'en' : 'fa';
    try { sessionStorage.setItem('snWeddingLang', next); } catch (_) {}
    window.location.reload();
  });
  openButton.addEventListener('click', openInvitation, { passive: true });
  openButton.onclick = openInvitation;

  setLanguage(lang);
  lockGate();

  function resolvePersianEventDate() {
    const formatter = new Intl.DateTimeFormat('en-US-u-ca-persian', {
      timeZone: 'Asia/Tehran', year: 'numeric', month: 'numeric', day: 'numeric'
    });
    const start = Date.UTC(2026, 0, 1, 12, 0, 0);
    for (let i = 0; i < 400; i++) {
      const d = new Date(start + i * 86400000);
      const parts = formatter.formatToParts(d);
      const y = Number(parts.find(p => p.type === 'year')?.value);
      const m = Number(parts.find(p => p.type === 'month')?.value);
      const day = Number(parts.find(p => p.type === 'day')?.value);
      if (y === 1405 && m === 6 && day === 10) {
        return `${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,'0')}-${String(d.getUTCDate()).padStart(2,'0')}`;
      }
    }
    return '2026-09-01';
  }
  const eventDate = resolvePersianEventDate();
  const countdownTarget = new Date(`${eventDate}T19:00:00+03:30`).getTime();

  function updateCountdown() {
    let diff = Math.max(0, countdownTarget - Date.now());
    const days = Math.floor(diff / 86400000); diff %= 86400000;
    const hours = Math.floor(diff / 3600000); diff %= 3600000;
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    [['days',days],['hours',hours],['minutes',minutes],['seconds',seconds]].forEach(([id,value]) => {
      const el = document.getElementById(id);
      if (el) el.textContent = String(value).padStart(2,'0');
    });
  }
  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  }

  const vineDraws = Array.from(document.querySelectorAll('.vine-draw'));
  let vineLengths = [];
  function setupVines() {
    vineLengths = vineDraws.map(path => {
      if (!path || typeof path.getTotalLength !== 'function') return 0;
      const len = path.getTotalLength();
      path.style.strokeDasharray = String(len);
      path.style.strokeDashoffset = String(len);
      return len;
    });
  }
  function updateVines() {
    if (!vineDraws.length || !vineLengths.length) return;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    const p = Math.min(1, Math.max(0, (progress - 0.015) / 0.985));
    vineDraws.forEach((path, i) => {
      const len = vineLengths[i] || 0;
      path.style.strokeDashoffset = String(len * (1 - p));
    });
    document.querySelectorAll('.vine-leaf').forEach((leaf) => {
      const at = Number(leaf.dataset.vineAt || 0);
      const local = Math.max(0, Math.min(1, (p - at) / 0.055));
      leaf.style.opacity = String(local);
      leaf.style.transform = `scale(${0.72 + local * 0.28})`;
    });
    const flower = document.querySelector('.final-flower');
    if (flower) {
      const fp = Math.max(0, Math.min(1, (p - 0.965) / 0.035));
      flower.style.opacity = String(fp);
      flower.style.transform = `scale(${0.7 + fp * 0.3})`;
    }
  }
  setupVines();
  updateVines();
  window.addEventListener('resize', () => { setupVines(); updateVines(); });
  window.addEventListener('scroll', updateVines, { passive: true });

  const rsvpOpen = document.getElementById('rsvpOpen');
  const rsvpStatus = document.getElementById('rsvpStatus');
  const visitTime = document.getElementById('visitTime');
  const siteTotalViews = document.getElementById('siteTotalViews');
  const formLanguage = document.getElementById('formLanguage');

  function tehranTime() {
    return new Date().toLocaleString('en-GB', { timeZone: 'Asia/Tehran', hour12: false }) + ' (Tehran)';
  }
  function openRsvp() {
    if (!rsvpModal) return;
    rsvpModal.classList.add('open');
    rsvpModal.setAttribute('aria-hidden', 'false');
    if (rsvpStatus) rsvpStatus.textContent = '';
    if (visitTime) visitTime.value = tehranTime();
    if (siteTotalViews) siteTotalViews.value = viewCount;
    document.querySelector("#rsvpForm input[name='name']")?.focus();
  }
  function closeRsvp() {
    if (!rsvpModal) return;
    rsvpModal.classList.remove('open');
    rsvpModal.setAttribute('aria-hidden', 'true');
  }
  rsvpOpen?.addEventListener('click', openRsvp);
  document.querySelectorAll('[data-close-modal]').forEach(el => el.addEventListener('click', closeRsvp));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeRsvp(); });

  rsvpForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submit = document.getElementById('submitRsvp');
    if (submit) submit.disabled = true;
    if (rsvpStatus) rsvpStatus.textContent = lang === 'fa' ? 'در حال ارسال...' : 'Sending...';
    if (visitTime) visitTime.value = tehranTime();
    if (siteTotalViews) siteTotalViews.value = viewCount;
    if (formLanguage) formLanguage.value = lang === 'fa' ? 'Persian' : 'English';
    try {
      const response = await fetch('https://formsubmit.co/ajax/Saeed.sr72@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(rsvpForm).entries()))
      });
      const data = await response.json();
      if (!response.ok || data.success === false) throw new Error('Submission failed');
      if (rsvpStatus) rsvpStatus.textContent = lang === 'fa'
        ? 'پاسخ شما با موفقیت برای ما ارسال شد ❤️'
        : 'Your RSVP has been sent successfully ❤️';
      rsvpForm.reset();
      if (formLanguage) formLanguage.value = lang === 'fa' ? 'Persian' : 'English';
    } catch (_) {
      if (rsvpStatus) rsvpStatus.textContent = lang === 'fa'
        ? 'ارسال انجام نشد؛ لطفاً دوباره تلاش کنید.'
        : 'Something went wrong. Please try again.';
    } finally {
      if (submit) submit.disabled = false;
    }
  });

  /*
    FIX: CounterAPI is called directly.
    The previous Counter wrapper could silently leave the field as "Unavailable".
    This call increments one global counter for every page visit and puts the
    returned total into the hidden RSVP field.
  */
  async function trackVisit() {
    const endpoint = 'https://api.counterapi.dev/v1/saeed-niloufar-wedding/site-views/up';
    try {
      const response = await fetch(endpoint, { method: 'GET', cache: 'no-store' });
      if (!response.ok) throw new Error(`Counter HTTP ${response.status}`);
      const result = await response.json();
      const value = result?.value ?? result?.count ?? result?.data?.value ?? result?.data?.count;
      if (value !== undefined && value !== null) {
        viewCount = String(value);
        if (siteTotalViews) siteTotalViews.value = viewCount;
      }
    } catch (error) {
      console.warn('S&N view counter unavailable:', error);
    }
  }
  trackVisit();
})();
