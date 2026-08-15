const gate = document.getElementById("gate");
const openBtn = document.getElementById("openInvitation");
const site = document.getElementById("site");
const langToggle = document.getElementById("langToggle");
const faAudio = document.getElementById("faAudio");
const enAudio = document.getElementById("enAudio");

let lang = "fa"; // Persian is the default language.
let opened = false;

function applyLanguage(next) {
  lang = next;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "fa" ? "rtl" : "ltr";

  document.querySelectorAll("[data-fa][data-en]").forEach(el => {
    el.textContent = lang === "fa" ? el.dataset.fa : el.dataset.en;
  });

  langToggle.textContent = lang === "fa" ? "English" : "فارسی";
}

async function playCurrentTrack() {
  const current = lang === "fa" ? faAudio : enAudio;
  const other = lang === "fa" ? enAudio : faAudio;
  other.pause();
  other.currentTime = 0;
  try {
    await current.play();
  } catch (error) {
    // Mobile browsers may still reject playback if the file has not loaded yet.
    // The opening tap is a user gesture, so this is retried once on canplay.
    current.addEventListener("canplay", () => current.play().catch(() => {}), { once: true });
  }
}

langToggle.addEventListener("click", async () => {
  applyLanguage(lang === "fa" ? "en" : "fa");
  if (opened) await playCurrentTrack();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

openBtn.addEventListener("click", async () => {
  if (opened) return;
  opened = true;

  // This is the strongest autoplay fallback: the browser sees this as a direct user gesture.
  await playCurrentTrack();

  document.body.classList.add("gate-open");
  site.classList.remove("locked");
  gate.classList.add("split");

  // Reveal the invitation only after the seal has started opening.
  setTimeout(() => {
    gate.classList.add("opened");
    document.body.classList.remove("gate-open");
    window.scrollTo({ top: 0, behavior: "instant" });
    document.querySelector(".hero")?.classList.add("visible");
  }, 1250);
});

// Try autoplay on initial load as well. If the browser blocks it, the opening tap above takes over.
window.addEventListener("load", () => {
  faAudio.play().catch(() => {});
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -7% 0px" });

document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

// Event date/time used by the countdown. The displayed Persian and English dates are intentionally kept separate.
// The requested English date is 1 September 2026.
const target = new Date(2026, 8, 1, 19, 0, 0);

function updateCountdown() {
  const now = new Date();
  let diff = target - now;
  if (diff < 0) diff = 0;

  const days = Math.floor(diff / 86400000);
  diff %= 86400000;
  const hours = Math.floor(diff / 3600000);
  diff %= 3600000;
  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  document.getElementById("days").textContent = String(days).padStart(2, "0");
  document.getElementById("hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
  document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
}
updateCountdown();
setInterval(updateCountdown, 1000);

applyLanguage("fa");

document.querySelectorAll(".rsvp-btn").forEach(btn => {
  btn.addEventListener("click", e => e.preventDefault());
});
