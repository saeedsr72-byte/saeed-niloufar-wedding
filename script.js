/* S&N Wedding Invitation — interaction, music & Jalali countdown */

let lang = "fa"; // Persian is the default language
let currentTrack = "";
let interactionUnlocked = false;

const tracks = {
  en: "Ordinary.mp3",
  fa: "Pol.mp3"
};

const player = document.getElementById("player");
const gate = document.getElementById("gate");
const enterButton = document.getElementById("enterInvitation");

/* The countdown is defined by the Persian event date:
   10 Shahrivar 1405 at 19:00 Tehran time.
   We resolve that Jalali date with the browser's Persian calendar,
   rather than hard-coding an English/Gregorian date. */
function findPersianDateInGregorianYear(jy, jm, jd) {
  const formatter = new Intl.DateTimeFormat("en-US-u-ca-persian", {
    timeZone: "Asia/Tehran",
    year: "numeric", month: "numeric", day: "numeric"
  });

  const start = Date.UTC(2026, 0, 1, 12, 0, 0);
  for (let i = 0; i < 400; i++) {
    const date = new Date(start + i * 86400000);
    const parts = formatter.formatToParts(date);
    const year = Number(parts.find(p => p.type === "year").value);
    const month = Number(parts.find(p => p.type === "month").value);
    const day = Number(parts.find(p => p.type === "day").value);
    if (year === jy && month === jm && day === jd) {
      return `${date.getUTCFullYear()}-${String(date.getUTCMonth()+1).padStart(2,"0")}-${String(date.getUTCDate()).padStart(2,"0")}`;
    }
  }
  throw new Error("Persian event date could not be resolved.");
}

const eventGregorianDate = findPersianDateInGregorianYear(1405, 6, 10);
const target = new Date(`${eventGregorianDate}T19:00:00+03:30`).getTime();

function playCurrentTrack() {
  const p = player.play();
  if (p && p.catch) p.catch(() => {});
}

function setTrack(forcePlay = false) {
  const next = tracks[lang];
  if (currentTrack !== next) {
    currentTrack = next;
    player.src = next;
    player.load();
  }
  if (forcePlay) playCurrentTrack();
}

function apply() {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "fa" ? "rtl" : "ltr";

  document.querySelectorAll("[data-fa]").forEach(el => {
    el.innerHTML = el.dataset[lang];
  });

  document.getElementById("lang").textContent = lang === "fa" ? "English" : "فارسی";
  document.title = lang === "fa"
    ? "سعید و نیلوفر | ۱۰ شهریور ۱۴۰۵"
    : "Saeed & Niloufar | 1 September 2026";

  setTrack(interactionUnlocked);
}

function switchLanguage() {
  lang = lang === "fa" ? "en" : "fa";
  apply();
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
}

document.getElementById("lang").addEventListener("click", e => {
  e.preventDefault();
  e.stopPropagation();
  interactionUnlocked = true;
  switchLanguage();
  playCurrentTrack();
});

function unlockAndEnter() {
  if (interactionUnlocked) return;
  interactionUnlocked = true;
  setTrack(true);
  playCurrentTrack();

  document.body.classList.add("invitation-open");
  setTimeout(() => gate?.remove(), 1050);
}

enterButton?.addEventListener("click", unlockAndEnter);

/* Best effort autoplay. Mobile browsers may still block audible autoplay;
   the invitation button is the guaranteed user gesture fallback. */
window.addEventListener("DOMContentLoaded", () => {
  apply();
  setTrack(false);
  player.play().catch(() => {});
});

/* Scroll-reveal animation */
const revealItems = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });
revealItems.forEach(el => observer.observe(el));

/* Countdown — calculated from the Jalali target above, not a hard-coded English date. */
function tick() {
  let x = Math.max(0, target - Date.now());
  const d = Math.floor(x / 86400000); x %= 86400000;
  const h = Math.floor(x / 3600000); x %= 3600000;
  const m = Math.floor(x / 60000);
  const s = Math.floor(x / 1000) % 60;

  for (const [id, value] of [["d", d], ["h", h], ["m", m], ["s", s]]) {
    document.getElementById(id).textContent = String(value).padStart(2, "0");
  }
}

tick();
setInterval(tick, 1000);
