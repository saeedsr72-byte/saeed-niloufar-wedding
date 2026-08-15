const gate = document.getElementById("gate");
const openBtn = document.getElementById("openInvitation");
const site = document.getElementById("site");
const langToggle = document.getElementById("langToggle");
const faAudio = document.getElementById("faAudio");
const enAudio = document.getElementById("enAudio");
const rsvpModal = document.getElementById("rsvpModal");
const rsvpForm = document.getElementById("rsvpForm");
const rsvpStatus = document.getElementById("rsvpStatus");
const visitTime = document.getElementById("visitTime");
const siteTotalViews = document.getElementById("siteTotalViews");
const formLanguage = document.getElementById("formLanguage");

let lang = "fa";
let opened = false;
let viewCount = "Unavailable";
let visitStartedAt = new Date();

function applyLanguage(next){
  lang = next;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "fa" ? "rtl" : "ltr";
  document.querySelectorAll("[data-fa][data-en]").forEach(el=>{
    el.innerHTML = lang === "fa" ? el.dataset.fa : el.dataset.en;
  });
  langToggle.textContent = lang === "fa" ? "English" : "فارسی";
  formLanguage.value = lang === "fa" ? "Persian" : "English";
  document.title = lang === "fa" ? "سعید و نیلوفر | ۱۰ شهریور ۱۴۰۵" : "Saeed & Niloufar | 1 September 2026";
}

function stopAudio(){
  [faAudio,enAudio].forEach(a=>{a.pause();a.currentTime=0;});
}
async function playCurrentTrack(){
  const current = lang === "fa" ? faAudio : enAudio;
  const other = lang === "fa" ? enAudio : faAudio;
  other.pause(); other.currentTime=0;
  try{await current.play();}
  catch(e){current.addEventListener("canplay",()=>current.play().catch(()=>{}),{once:true});}
}

function resetToGate(){
  opened=false;
  rsvpModal.classList.remove("open");
  rsvpModal.setAttribute("aria-hidden","true");
  stopAudio();
  document.body.classList.add("gate-open");
  site.classList.add("locked");
  gate.classList.remove("split","opened");
  window.scrollTo({top:0,left:0,behavior:"instant"});
  document.querySelectorAll(".reveal.visible").forEach(el=>el.classList.remove("visible"));
  setTimeout(()=>document.querySelector(".hero")?.classList.add("visible"),250);
}

langToggle.addEventListener("click",()=>{
  applyLanguage(lang === "fa" ? "en" : "fa");
  resetToGate();
});

openBtn.addEventListener("click",async()=>{
  if(opened) return;
  opened=true;
  await playCurrentTrack();
  document.body.classList.add("gate-open");
  site.classList.remove("locked");
  gate.classList.add("split");
  setTimeout(()=>{
    gate.classList.add("opened");
    document.body.classList.remove("gate-open");
    window.scrollTo({top:0,left:0,behavior:"instant"});
    document.querySelector(".hero")?.classList.add("visible");
  },1250);
});

// Countdown is anchored to the Persian event date: 10 Shahrivar 1405 at 19:00 Tehran.
// 10 Shahrivar 1405 = 1 September 2026, but the English date is never used to define the countdown.
const target = new Date("2026-09-01T19:00:00+03:30").getTime();
function updateCountdown(){
  let diff=Math.max(0,target-Date.now());
  const days=Math.floor(diff/86400000); diff%=86400000;
  const hours=Math.floor(diff/3600000); diff%=3600000;
  const minutes=Math.floor(diff/60000); const seconds=Math.floor((diff%60000)/1000);
  document.getElementById("days").textContent=String(days).padStart(2,"0");
  document.getElementById("hours").textContent=String(hours).padStart(2,"0");
  document.getElementById("minutes").textContent=String(minutes).padStart(2,"0");
  document.getElementById("seconds").textContent=String(seconds).padStart(2,"0");
}
updateCountdown(); setInterval(updateCountdown,1000);

// Scroll reveals.
const revealObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");revealObserver.unobserve(entry.target);}});
},{threshold:.12,rootMargin:"0px 0px -7% 0px"});
document.querySelectorAll(".reveal").forEach(el=>revealObserver.observe(el));

// S and N vines: draw progressively as the guest scrolls toward the end of the story.
const vineS=document.getElementById("vineS"), vineN=document.getElementById("vineN");
function setupVines(){
  [vineS,vineN].forEach(p=>{const len=p.getTotalLength();p.style.strokeDasharray=len;p.style.strokeDashoffset=len;});
}
function updateVines(){
  if(!vineS||!vineN) return;
  const max=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);
  const progress=Math.min(1,Math.max(0,window.scrollY/max));
  const start=.04, end=.94;
  const p=Math.min(1,Math.max(0,(progress-start)/(end-start)));
  [vineS,vineN].forEach(path=>{const len=path.getTotalLength();path.style.strokeDashoffset=String(len*(1-p));});
}
window.addEventListener("resize",()=>{setupVines();updateVines();});
window.addEventListener("scroll",updateVines,{passive:true});
setupVines();updateVines();

// CounterAPI: total site views. It is intentionally public because this is a static GitHub Pages site.
function trackVisit(){
  const started=new Date();
  visitStartedAt=started;
  visitTime.value=started.toLocaleString("en-GB",{timeZone:"Asia/Tehran",hour12:false})+" (Tehran)";
  if(window.Counter){
    try{
      const counter=new Counter({version:"v1",namespace:"saeed-niloufar-wedding"});
      counter.up("site-views").then(result=>{
        viewCount=String(result.value ?? result.data ?? "Unavailable");
        siteTotalViews.value=viewCount;
      }).catch(()=>{siteTotalViews.value=viewCount;});
    }catch(e){siteTotalViews.value=viewCount;}
  } else {
    setTimeout(trackVisit,800);
  }
}
trackVisit();

function openModal(){
  rsvpModal.classList.add("open");
  rsvpModal.setAttribute("aria-hidden","false");
  rsvpStatus.textContent="";
  visitTime.value=new Date().toLocaleString("en-GB",{timeZone:"Asia/Tehran",hour12:false})+" (Tehran)";
  siteTotalViews.value=viewCount;
  document.querySelector("#rsvpForm input[name='name']")?.focus();
}
function closeModal(){rsvpModal.classList.remove("open");rsvpModal.setAttribute("aria-hidden","true");}
document.getElementById("rsvpOpen").addEventListener("click",openModal);
document.querySelectorAll("[data-close-modal]").forEach(el=>el.addEventListener("click",closeModal));
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal();});

rsvpForm.addEventListener("submit",async e=>{
  e.preventDefault();
  const submit=document.getElementById("submitRsvp");
  submit.disabled=true;
  rsvpStatus.textContent=lang === "fa" ? "در حال ارسال..." : "Sending...";
  visitTime.value=new Date().toLocaleString("en-GB",{timeZone:"Asia/Tehran",hour12:false})+" (Tehran)";
  siteTotalViews.value=viewCount;
  const payload=Object.fromEntries(new FormData(rsvpForm).entries());
  try{
    const response=await fetch("https://formsubmit.co/ajax/Saeed.sr72@gmail.com",{
      method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify(payload)
    });
    const data=await response.json();
    if(!response.ok || data.success===false) throw new Error("Submission failed");
    rsvpStatus.textContent=lang === "fa" ? "پاسخ شما با موفقیت برای ما ارسال شد ❤️" : "Your RSVP has been sent successfully ❤️";
    rsvpForm.reset();
    formLanguage.value=lang === "fa" ? "Persian" : "English";
    visitTime.value=new Date().toLocaleString("en-GB",{timeZone:"Asia/Tehran",hour12:false})+" (Tehran)";
    siteTotalViews.value=viewCount;
  }catch(err){
    rsvpStatus.textContent=lang === "fa" ? "ارسال انجام نشد؛ لطفاً دوباره تلاش کنید." : "Something went wrong. Please try again.";
  }finally{submit.disabled=false;}
});

applyLanguage("fa");
window.addEventListener("load",()=>{setupVines();updateVines();});
