const target = new Date("2026-08-31T19:00:00+03:30").getTime();

let lang = "fa";
let currentTrack = "";
let interactionUnlocked = false;

const tracks = {
  en: "Ordinary.mp3",
  fa: "Pol.mp3"
};

const player = document.getElementById("player");
const gate = document.getElementById("gate");
const site = document.getElementById("site");
const enter = document.getElementById("enter");
const langButton = document.getElementById("lang");

player.src = tracks.en;
player.load();

function playCurrentTrack(){
  const promise = player.play();
  if (promise && promise.catch) promise.catch(() => {});
}

function setTrack(forcePlay = true){
  const next = tracks[lang];
  if(currentTrack !== next){
    currentTrack = next;
    player.src = next;
    player.load();
  }
  if(forcePlay) playCurrentTrack();
}

function applyLanguage(shouldPlay = false){
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "fa" ? "rtl" : "ltr";

  document.querySelectorAll("[data-fa]").forEach(el => {
    el.innerHTML = el.dataset[lang];
  });

  langButton.textContent = lang === "fa" ? "English" : "فارسی";
  document.title = lang === "fa"
    ? "سعید و نیلوفر | ۱۰ شهریور ۱۴۰۵"
    : "Saeed & Niloufar | 31 August 2026";

  setTrack(shouldPlay);
}

function switchLanguage(){
  lang = lang === "en" ? "fa" : "en";
  applyLanguage(interactionUnlocked);
  window.scrollTo({top:0,left:0,behavior:"instant"});
}

langButton.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  switchLanguage();
});

function enterInvitation(){
  interactionUnlocked = true;
  setTrack(true);
  document.body.classList.add("opening");

  // Reveal the lotus / yin-yang seal first, then begin the story.
  setTimeout(() => {
    site.hidden = false;
    gate.classList.add("fade-out");
  }, 650);

  setTimeout(() => {
    gate.hidden = true;
    document.body.classList.remove("opening");
    window.scrollTo({top:0,left:0,behavior:"instant"});
  }, 1450);
}

enter.addEventListener("click", enterInvitation);

window.addEventListener("DOMContentLoaded", () => {
  applyLanguage(false);
});

function unlockAudio(){
  if(interactionUnlocked) return;
  interactionUnlocked = true;
  playCurrentTrack();
}
["pointerdown","touchstart","keydown"].forEach(evt => {
  window.addEventListener(evt, unlockAudio, {capture:true, passive:true, once:true});
});

document.querySelectorAll(".rsvp-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    btn.classList.add("selected");
    setTimeout(() => btn.classList.remove("selected"), 900);
  });
});

function tick(){
  let x = Math.max(0, target - Date.now());
  let d = Math.floor(x / 86400000);
  x %= 86400000;
  let h = Math.floor(x / 3600000);
  x %= 3600000;
  let m = Math.floor(x / 60000);
  let s = Math.floor(x / 1000) % 60;

  for(const [id, value] of [["d",d],["h",h],["m",m],["s",s]]){
    document.getElementById(id).textContent = String(value).padStart(2,"0");
  }
}

tick();
setInterval(tick, 1000);
