const gate = document.getElementById("gate");
const openBtn = document.getElementById("openInvitation");
const site = document.getElementById("site");
const langToggle = document.getElementById("langToggle");
const faAudio = document.getElementById("faAudio");
const enAudio = document.getElementById("enAudio");

let lang = "fa";
let opened = false;

function setLanguage(next, shouldScroll = true) {
  lang = next;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "fa" ? "rtl" : "ltr";

  document.querySelectorAll("[data-fa][data-en]").forEach(el => {
    el.textContent = el.dataset[lang];
  });

  langToggle.textContent = lang === "fa" ? "English" : "فارسی";

  if (opened) {
    const current = lang === "fa" ? faAudio : enAudio;
    const other = lang === "fa" ? enAudio : faAudio;
    other.pause();
    other.currentTime = 0;
    current.play().catch(() => {});
  }

  if (shouldScroll) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

langToggle.addEventListener("click", () => {
  setLanguage(lang === "fa" ? "en" : "fa", true);
});

async function startAudio() {
  const current = lang === "fa" ? faAudio : enAudio;
  const other = lang === "fa" ? enAudio : faAudio;
  other.pause();
  other.currentTime = 0;
  try {
    await current.play();
  } catch (e) {
    // The opening click itself is still the user gesture; some browsers
    // may require the audio file to be fully reachable before playback.
  }
}

openBtn.addEventListener("click", async () => {
  if (opened) return;
  opened = true;

  // The first user gesture starts the selected language track.
  startAudio();

  gate.classList.add("split");
  site.classList.remove("locked");

  // Give the split animation time to breathe before removing the gate.
  setTimeout(() => gate.classList.add("opened"), 1050);
  setTimeout(() => {
    window.scrollTo(0, 0);
    document.querySelector(".hero")?.classList.add("visible");
  }, 1100);
});

// Reveal sections as the guest scrolls.
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -7% 0px" });

document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

// Countdown: 31 August 2026, 19:00 local time.
const target = new Date(2026, 7, 31, 19, 0, 0);

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

// Default is Persian.
setLanguage("fa", false);

// Prevent dead RSVP placeholder links from jumping to the top.
document.querySelectorAll(".rsvp-btn").forEach(btn => {
  btn.addEventListener("click", e => e.preventDefault());
});