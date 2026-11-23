document.addEventListener('DOMContentLoaded',()=>{
  const u=Store.user(),$=id=>document.getElementById(id);
  const g=u?Store.games():[];
  $('welcome').textContent=u?`Halo, Masinis ${u.name}!`:'Selamat datang, Masinis!';
  $('statBest').textContent=u?Store.best():'–';
  $('statGames').textContent=g.length;
  $('statTime').textContent=g.length?MLUI.fmt(Math.max(...g.map(x=>x.time))):'00:00';
  $('statPax').textContent=g.reduce((n,x)=>n+(x.delivered||0),0);
  $('btnStart').href=u?'game.html':'login.html';
  $('btnStart').textContent=u?'▶ Mulai Bermain':'Masuk untuk Bermain';
  $('history').innerHTML=!u?'<div class="empty">Masuk untuk melihat riwayat permainanmu.</div>'
    :!g.length?'<div class="empty">Belum ada sesi. Mulai perjalanan pertamamu!</div>'
    :`<table><thead><tr><th>Tanggal</th><th>Skor</th><th>Durasi</th><th>Stasiun</th></tr></thead><tbody>${
      g.slice(0,5).map(x=>`<tr><td>${MLUI.date(x.date)}</td><td><b>${x.score}</b></td><td>${MLUI.fmt(x.time)}</td><td>${x.stations}</td></tr>`).join('')}</tbody></table>`;
});
