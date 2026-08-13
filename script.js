const target=new Date('2026-08-31T19:00:00+03:30').getTime();
function tick(){let x=Math.max(0,target-Date.now()),d=Math.floor(x/86400000);x%=86400000;let h=Math.floor(x/3600000);x%=3600000;let m=Math.floor(x/60000),s=Math.floor(x/1000)%60;
for(const [id,v] of [['d',d],['h',h],['m',m],['s',s]])document.getElementById(id).textContent=String(v).padStart(2,'0')}
function playTrack(path){const p=document.getElementById('player');p.src=path;p.play().catch(()=>{p.controls=true})}tick();setInterval(tick,1000);