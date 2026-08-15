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

    // This click is the user gesture that authorizes audio on mobile browsers.
    playLanguageTrack();

    document.body.classList.add('gate-open');
    site.classList.remove('locked');
    gate.classList.add('split');

    // Keep the proven split timing; only after the animation finishes do we hide the gate.
    window.setTimeout(() => {
      gate.classList.add('opened');
      gate.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('gate-open');
      window.scrollTo(0, 0);
      document.querySelector('.hero')?.classList.add('visible');
    }, 2300);
  }

  // Language change deliberately reloads the invitation so the gate appears again.
  langButton.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    const next = lang === 'fa' ? 'en' : 'fa';
    try { sessionStorage.setItem('snWeddingLang', next); } catch (_) {}
    window.location.reload();
  });

  openButton.addEventListener('click', openInvitation, { passive: true });
  // Fallback for touch/click implementations that behave differently on older mobile browsers.
  openButton.onclick = openInvitation;

  // Initial state: gate is always present on a fresh load.
  setLanguage(lang);
  lockGate();

  // Countdown is anchored to 10 Shahrivar 1405, 19:00 Tehran.
  // The Persian date is the source of truth; the English date is display-only.
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
    // Known conversion fallback for environments without the Persian calendar implementation.
    return '2026-09-01';
  }

  const eventDate = resolvePersianEventDate();
  const countdownTarget = new Date(`${eventDate}T19:00:00+03:30`).getTime();

  function updateCountdown() {
    let diff = Math.max(0, countdownTarget - Date.now());
    const days = Math.floor(diff / 86400000); diff %= 86400000;
    const hours = Math.floor(diff / 3600000); diff %= 3600000;
    const minutes = Math.floor(diff / 60000); const seconds = Math.floor((diff % 60000) / 1000);
    const values = { days, hours, minutes, seconds };
    Object.entries(values).forEach(([id, value]) => {
      const el = document.getElementById(id);
      if (el) el.textContent = String(value).padStart(2, '0');
    });
  }
  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  // Scroll reveal.
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

  // Botanical vine artwork reveals from both edges as the page scrolls.
  const vineScene = document.querySelector('.story-vines');
  const vineAssets = Array.from(document.querySelectorAll('.vine-asset'));

  function updateVines() {
    if (!vineScene || !vineAssets.length) return;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    const p = Math.min(1, Math.max(0, (progress - 0.015) / 0.985));
    const bottomHidden = (1 - p) * 100;
    vineAssets.forEach((asset, index) => {
      // Slightly stagger the two creepers so the meeting feels organic rather than mechanical.
      const local = Math.min(1, Math.max(0, p * 1.04 - index * 0.012));
      asset.style.clipPath = `inset(0 0 ${((1 - local) * 100).toFixed(2)}% 0)`;
    });
    if (p > 0.965) vineScene.classList.add('vines-finished');
    else vineScene.classList.remove('vines-finished');
  }
  updateVines();
  window.addEventListener('resize', updateVines);
  window.addEventListener('scroll', updateVines, { passive: true });

  // RSVP modal.
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

  // Global site view counter. RSVP receives the current total when opened/submitted.
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
