const target=new Date("2026-08-31T19:00:00+03:30").getTime();

let lang="en";
let currentTrack="";
let interactionUnlocked=false;

const tracks={
  en:"Ordinary.mp3",
  fa:"Pol.mp3"
};

const player=document.getElementById("player");

/* Prepare the default English track immediately. */
player.src=tracks.en;
player.load();

function playCurrentTrack(){
  const p=player.play();
  if(p && p.catch) p.catch(()=>{});
}

function setTrack(forcePlay=true){
  const next=tracks[lang];
  if(currentTrack!==next){
    currentTrack=next;
    player.src=next;
    player.load();
  }
  if(forcePlay) playCurrentTrack();
}

function apply(shouldPlay=true){
  document.documentElement.lang=lang;
  document.documentElement.dir=lang==="fa"?"rtl":"ltr";

  document.querySelectorAll("[data-fa]").forEach(e=>{
    e.innerHTML=e.dataset[lang];
  });

  document.getElementById("lang").textContent=lang==="fa"?"English":"فارسی";
  document.title=lang==="fa"
    ?"سعید و نیلوفر | ۱۰ شهریور ۱۴۰۵"
    :"Saeed & Niloufar | 31 August 2026";

  setTrack(shouldPlay);
}

document.getElementById("lang").onclick=(e)=>{
  e.preventDefault();
  e.stopPropagation();

  lang=lang==="en"?"fa":"en";

  /* The click itself is a valid user gesture for audio. */
  interactionUnlocked=true;
  apply(true);

  /* Always return to the very beginning after switching language. */
  window.scrollTo({top:0,left:0,behavior:"instant"});
};

function unlockAudio(){
  if(interactionUnlocked) return;
  interactionUnlocked=true;
  playCurrentTrack();
}

/*
  Browsers such as Chrome/Samsung Internet may block audible autoplay.
  We attempt autoplay on page load. If blocked, these are the earliest
  practical user-gesture hooks and start the already-selected song.
*/
["pointerdown","touchstart","click","keydown"].forEach(evt=>{
  window.addEventListener(evt,unlockAudio,{capture:true,passive:true,once:true});
});

/* Best-effort autoplay on entry. */
window.addEventListener("DOMContentLoaded",()=>{
  apply(true);
  playCurrentTrack();
});

/* Countdown */
function tick(){
  let x=Math.max(0,target-Date.now());
  let d=Math.floor(x/86400000);
  x%=86400000;
  let h=Math.floor(x/3600000);
  x%=3600000;
  let m=Math.floor(x/60000);
  let s=Math.floor(x/1000)%60;

  for(const[a,v] of [["d",d],["h",h],["m",m],["s",s]])
    document.getElementById(a).textContent=String(v).padStart(2,"0");
}

tick();
setInterval(tick,1000);
