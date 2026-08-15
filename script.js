(() => {
  'use strict';

  const state = { lang: 'fa', entered: false };

  // Countdown is based on the requested Persian event date:
  // 10 Shahrivar 1405, 19:00 Iran time.
  // Equivalent Gregorian instant: 31 Aug 2026, 19:00 at UTC+03:30.
  const WEDDING_TARGET = new Date('2026-08-31T19:00:00+03:30').getTime();

  const gate = document.getElementById('gate');
  const openButton = document.getElementById('openInvitation');
  const languageToggle = document.getElementById('languageToggle');
  const languageLabel = document.getElementById('languageLabel');
  const music = document.getElementById('music');
  const form = document.getElementById('rsvpForm');

  const tracks = {
    fa: 'Pol.mp3',
    en: 'Ordinary.mp3'
  };

  function applyLanguage(lang, reset = false) {
    state.lang = lang;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
    languageLabel.textContent = lang === 'fa' ? 'English' : 'فارسی';

    document.querySelectorAll('[data-fa][data-en]').forEach((el) => {
      const text = el.getAttribute(`data-${lang}`);
      if (text !== null) el.innerHTML = text;
    });

    document.querySelectorAll('[data-placeholder-fa][data-placeholder-en]').forEach((el) => {
      el.placeholder = el.getAttribute(`data-placeholder-${lang}`) || '';
    });

    document.querySelector('.date-fa').classList.toggle('hidden', lang !== 'fa');
    document.querySelector('.date-en').classList.toggle('hidden', lang !== 'en');
    document.querySelector('.fa-only').classList.toggle('hidden', lang !== 'fa');
    document.querySelector('.en-only').classList.toggle('hidden', lang !== 'en');

    // Changing language intentionally restarts the invitation gate.
    if (reset) resetInvitation();
  }

  function resetReveals() {
    document.querySelectorAll('.reveal').forEach(el => el.classList.remove('is-visible'));
    requestAnimationFrame(() => {
      requestAnimationFrame(() => observer && document.querySelectorAll('.reveal').forEach(el => observer.observe(el)));
    });
  }

  function resetInvitation() {
    state.entered = false;
    document.body.classList.add('locked');
    gate.classList.remove('is-opening', 'is-open');
    window.scrollTo(0, 0);

    music.pause();
    music.currentTime = 0;
    music.src = tracks[state.lang];
    music.load();
    resetReveals();
  }

  function startMusic() {
    music.src = tracks[state.lang];
    music.loop = true;
    music.volume = 0.78;
    music.load();
    // Important: play is called directly inside the user's pointer gesture.
    const promise = music.play();
    if (promise && typeof promise.catch === 'function') promise.catch(() => {});
  }

  function enterInvitation(event) {
    if (event) event.preventDefault();
    if (state.entered) return;
    state.entered = true;

    startMusic();

    gate.classList.add('is-opening');
    window.setTimeout(() => {
      gate.classList.add('is-open');
      document.body.classList.remove('locked');
      window.scrollTo(0, 0);
    }, 1150);
  }

  function updateCountdown() {
    let remaining = Math.max(0, WEDDING_TARGET - Date.now());
    const days = Math.floor(remaining / 86400000);
    remaining %= 86400000;
    const hours = Math.floor(remaining / 3600000);
    remaining %= 3600000;
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor(remaining / 1000) % 60;

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
  }

  function submitRSVP(event) {
    event.preventDefault();
    const selected = form.querySelector('input[name="attendance"]:checked');
    const message = document.getElementById('rsvpMessage');

    if (!selected) {
      message.textContent = state.lang === 'fa' ? 'لطفاً یکی از گزینه‌ها را انتخاب کنید.' : 'Please choose one of the options.';
      return;
    }

    message.textContent = state.lang === 'fa'
      ? 'پاسخ شما ثبت شد؛ ممنون که به ما خبر دادید. ♡'
      : 'Thank you — your RSVP has been noted. ♡';
  }

  let observer = null;
  function initRevealObserver() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
      return;
    }
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  // pointerup is reliable on mobile and is a genuine user gesture for audio playback.
  openButton.addEventListener('pointerup', enterInvitation, { passive: false });
  openButton.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') enterInvitation(event);
  });

  languageToggle.addEventListener('click', () => {
    applyLanguage(state.lang === 'fa' ? 'en' : 'fa', true);
  });

  form.addEventListener('submit', submitRSVP);

  applyLanguage('fa', false);
  updateCountdown();
  window.setInterval(updateCountdown, 1000);
  initRevealObserver();
})();
