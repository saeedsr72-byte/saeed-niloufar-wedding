const state = {
  lang: 'fa',
  entered: false
};

// Wedding date: 10 Shahrivar 1405 = 31 August 2026, 19:00 Iran local time.
// The countdown is intentionally based on this single Persian-calendar event date.
// The browser receives the equivalent Gregorian timestamp only for calculation.
const target = new Date('2026-08-31T19:00:00+03:30').getTime();

const gate = document.getElementById('gate');
const lotusGate = document.getElementById('lotusGate');
const langToggle = document.getElementById('langToggle');
const player = document.getElementById('player');

const tracks = {
  fa: 'Pol.mp3',
  en: 'Ordinary.mp3'
};

function tick(){
  let x = Math.max(0, target - Date.now());
  const d = Math.floor(x / 86400000);
  x %= 86400000;
  const h = Math.floor(x / 3600000);
  x %= 3600000;
  const m = Math.floor(x / 60000);
  const s = Math.floor(x / 1000) % 60;

  for (const [id,v] of [['d',d],['h',h],['m',m],['s',s]]) {
    document.getElementById(id).textContent = String(v).padStart(2,'0');
  }
}

function setLanguage(lang, reset = true){
  state.lang = lang;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';

  document.querySelectorAll('[data-fa]').forEach(el => {
    const value = el.getAttribute(`data-${lang}`);
    if (value !== null) el.innerHTML = value;
  });

  document.querySelectorAll('[data-placeholder-fa]').forEach(el => {
    el.placeholder = el.getAttribute(`data-placeholder-${lang}`);
  });

  document.querySelector('.date-fa').classList.toggle('hidden', lang !== 'fa');
  document.querySelector('.date-en').classList.toggle('hidden', lang !== 'en');
  document.querySelector('.venue-fa').classList.toggle('hidden', lang !== 'fa');
  document.querySelector('.venue-en').classList.toggle('hidden', lang !== 'en');

  document.getElementById('langFa').style.opacity = lang === 'fa' ? '1' : '.45';
  document.getElementById('langEn').style.opacity = lang === 'en' ? '1' : '.45';

  if (reset) resetInvitation();
}

function resetInvitation(){
  window.scrollTo({top:0, behavior:'instant'});
  state.entered = false;
  document.body.classList.add('locked');
  gate.classList.remove('open','leaving');
  // Keep the current language, but load the correct track for the next entrance.
  player.pause();
  player.currentTime = 0;
  player.src = tracks[state.lang];
  player.load();
}

async function enterInvitation(){
  if (state.entered) return;
  state.entered = true;

  // This is the reliable music-start gesture on mobile browsers.
  player.src = tracks[state.lang];
  player.loop = true;
  player.volume = 0.78;

  try { await player.play(); }
  catch(e) {
    // Some browsers can still block playback; the invitation itself opens normally.
    // A second tap/gesture elsewhere will retry it.
    const retry = () => {
      player.play().catch(()=>{});
      document.removeEventListener('touchstart', retry);
      document.removeEventListener('click', retry);
    };
    document.addEventListener('touchstart', retry, {once:true, passive:true});
    document.addEventListener('click', retry, {once:true});
  }

  gate.classList.add('leaving');
  setTimeout(() => {
    gate.classList.add('open');
    document.body.classList.remove('locked');
  }, 900);
}

function observeReveals(){
  const items = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, {threshold:.12, rootMargin:'0px 0px -8% 0px'});
  items.forEach(el => io.observe(el));
}

lotusGate.addEventListener('click', enterInvitation);

langToggle.addEventListener('click', () => {
  setLanguage(state.lang === 'fa' ? 'en' : 'fa', true);
});

document.getElementById('rsvpForm').addEventListener('submit', e => {
  e.preventDefault();
  const selected = document.querySelector('input[name="attendance"]:checked');
  const message = document.getElementById('rsvpMessage');

  if (!selected) {
    message.textContent = state.lang === 'fa'
      ? 'لطفاً یکی از گزینه‌ها را انتخاب کنید.'
      : 'Please choose one of the options.';
    return;
  }

  message.textContent = state.lang === 'fa'
    ? 'پاسخ شما ثبت شد؛ از اینکه به ما خبر دادید ممنونیم. ♡'
    : 'Thank you — your RSVP has been noted. ♡';
});

tick();
setInterval(tick, 1000);
setLanguage('fa', false);
observeReveals();
document.body.classList.add('locked');
