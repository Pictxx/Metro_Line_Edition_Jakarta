document.addEventListener('DOMContentLoaded',()=>{
  const $=id=>document.getElementById(id),u=Store.user();
  function render(){
    let g=Store.games($('scope').value==='all');
    if($('sort').value==='score')g=g.sort((a,b)=>b.score-a.score);
    $('btnReset').classList.toggle('hidden',!u);
    $('board').innerHTML=!g.length?'<tr><td colspan="6" class="empty">Belum ada data permainan.</td></tr>'
      :g.slice(0,50).map((x,i)=>`<tr><td>${i+1}</td><td>${MLUI.esc(x.name)}</td><td><b>${x.score}</b></td><td>${MLUI.fmt(x.time)}</td><td>${x.stations}</td><td>${MLUI.date(x.date)}</td></tr>`).join('');
  }
  $('scope').onchange=$('sort').onchange=render;
  $('btnReset').onclick=()=>{
    if(confirm('Hapus semua riwayat permainanmu? Tindakan ini tidak bisa dibatalkan.')){Store.clear();render();MLUI.toast('Riwayat direset.')}
  };
  render();
});
