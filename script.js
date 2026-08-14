const target=new Date("2026-08-31T19:00:00+03:30").getTime();

let lang="en";
let currentTrack="";

const tracks={
  en:"Ordinary.mp3",
  fa:"Pol.mp3"
};

const player=document.getElementById("player");

function setTrack(forcePlay=true){
  const next=tracks[lang];
  if(currentTrack===next && !forcePlay) return;
  currentTrack=next;
  player.src=next;
  player.load();
  if(forcePlay) player.play().catch(()=>{});
}

function apply(shouldPlay=true){
  document.documentElement.lang=lang;
  document.documentElement.dir=lang==="fa"?"rtl":"ltr";

  document.querySelectorAll("[data-fa]").forEach(e=>{
    e.innerHTML=e.dataset[lang];
  });

  document.getElementById("lang").textContent=lang==="fa"?"EN":"FA";
  document.title=lang==="fa"
    ?"سعید و نیلوفر | ۱۰ شهریور ۱۴۰۵"
    :"Saeed & Niloufar | 31 August 2026";

  setTrack(shouldPlay);
}

document.getElementById("lang").onclick=()=>{
  lang=lang==="en"?"fa":"en";
  apply(true);
};

function startMusicFromFirstInteraction(){
  if(player.paused) player.play().catch(()=>{});
  window.removeEventListener("pointerdown",startMusicFromFirstInteraction);
  window.removeEventListener("touchstart",startMusicFromFirstInteraction);
  window.removeEventListener("click",startMusicFromFirstInteraction);
  window.removeEventListener("scroll",startMusicFromFirstInteraction);
}

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

apply(true);
tick();
setInterval(tick,1000);

/*
  Modern mobile browsers may block audible autoplay.
  We attempt autoplay immediately; if the browser blocks it,
  the first tap/scroll on the page starts the selected song.
*/
["pointerdown","touchstart","click","scroll"].forEach(evt=>{
  window.addEventListener(evt,startMusicFromFirstInteraction,{passive:true});
});
