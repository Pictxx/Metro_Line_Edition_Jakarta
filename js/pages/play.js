/* Menghubungkan engine, minigame, kontrol, dan penyimpanan hasil */
(()=>{
  if(!Store.user()){location.href='login.html';return}
  const $=id=>document.getElementById(id),cfg=MLData.CFG;
  let lastSpeed=1,saved=false;
  const eng=new MetroEngine($('game'),{
    onHud:h=>hud(h),
    onEvent:m=>MLUI.toast(m),
    onOver:r=>over(r)
  });

  const dock=$('lineDock');
  MLData.LINES.forEach((l,i)=>{
    const b=document.createElement('button');
    b.className='line-chip';b.style.setProperty('--c',l.color);
    b.innerHTML=`<i></i><span>${l.name}</span><small id="lc${i}">0 stn</small>`;
    b.onclick=()=>{eng.sel=i};dock.appendChild(b);
  });
  const chips=[...dock.children];

  function hud(h){
    $('hudScore').textContent=h.score;
    $('hudTime').textContent=MLUI.fmt(h.time);
    $('hudNext').textContent=MLUI.fmt(h.next);
    $('hudNext').parentElement.classList.toggle('warn',h.next<=10);
    $('hudSt').textContent=h.stations;
    chips.forEach((c,i)=>{c.classList.toggle('active',i===h.sel);$('lc'+i).textContent=`${h.lines[i].n} stn · ${h.lines[i].t} krt`});
    $('btnTrain').textContent=`+ Kereta (${h.trains}/${cfg.maxTrains})`;
    $('btnSignal').disabled=h.sigCd>0;
    $('btnSignal').textContent=h.sigCd>0?`Sinyal ${Math.ceil(h.sigCd)}s`:'📡 Kalibrasi Sinyal';
    const si=$('speedInd');
    si.textContent=h.speed===0?'⏸':h.speed+'x'+(h.boost>0?' ⚡':'');
    si.className='speed-ind'+(h.speed===2?' fast':h.speed===0?' paused':'');
    $('pauseBadge').classList.toggle('hidden',h.speed!==0||eng.held);
    [['btnPause',0],['btn1x',1],['btn2x',2]].forEach(([id,s])=>$(id).classList.toggle('active',h.speed===s));
  }
  function setSpeed(s){if(s>0)lastSpeed=s;eng.setSpeed(s)}
  $('btnPause').onclick=()=>setSpeed(eng.speed===0?lastSpeed:0);
  $('btn1x').onclick=()=>setSpeed(1);
  $('btn2x').onclick=()=>setSpeed(2);
  $('btnTrain').onclick=()=>{const ok=eng.addTrain(eng.sel);MLUI.toast(ok?'Kereta baru ditambahkan.':'Jalur butuh ≥2 stasiun atau batas kereta tercapai.',ok?'':'error')};
  $('btnSignal').onclick=()=>{
    eng.hold(true);
    MiniGames.signal(res=>{
      eng.hold(false);
      if(res.grade==='cancel')return;
      const r=eng.applySignal(res.grade);
      MLUI.toast(res.grade==='miss'?'Sinyal meleset. Tidak ada bonus.':`Sinyal ${res.grade==='perfect'?'sempurna':'bagus'}! +${r[0]} poin, kereta ngebut ${r[1]}s`,res.grade==='miss'?'error':'');
    });
  };
  addEventListener('keydown',e=>{
    if(document.querySelector('.modal-backdrop'))return;
    if(e.code==='Space'){e.preventDefault();$('btnPause').click()}
    if(e.key==='1')setSpeed(1);
    if(e.key==='2')setSpeed(2);
  });

  function over(r){
    if(!saved){saved=true;Store.addGame({score:r.score,time:Math.floor(r.time),stations:r.stations,delivered:r.delivered})}
    const m=document.createElement('div');m.className='modal-backdrop';
    m.innerHTML=`<div class="modal"><h2>Game Over 🚨</h2>
      <p>Stasiun <b>${MLUI.esc(r.reason)}</b> kelebihan penumpang terlalu lama.</p>
      <p>Skor <b>${r.score}</b> · Waktu <b>${MLUI.fmt(r.time)}</b> · Stasiun <b>${r.stations}</b> · Penumpang <b>${r.delivered}</b></p>
      <p class="muted">Rekor pribadi: ${Store.best()}</p>
      <div class="modal-actions"><a class="btn btn-ghost" href="index.html">Dashboard</a><a class="btn btn-ghost" href="scores.html">Skor</a><button class="btn btn-primary" onclick="location.reload()">Main Lagi</button></div></div>`;
    document.body.appendChild(m);
  }
  eng.start();
  MLUI.toast('Pilih jalur di dok bawah, lalu klik stasiun untuk memperluasnya.');
})();
