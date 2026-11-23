/* Mini-game: Kalibrasi Sinyal -> bonus poin + kereta ngebut */
const MiniGames={
  signal(done){
    const zone={w:.22,x:.12+Math.random()*.6},center=zone.x+zone.w/2;
    const ov=document.createElement('div');ov.className='modal-backdrop';
    ov.innerHTML=`<div class="modal"><h3>📡 Kalibrasi Sinyal</h3>
      <p>Tekan <b>Kunci</b> (atau Spasi) saat jarum oranye berada di zona hijau. Tepat di tengah = bonus sempurna!</p>
      <div class="sig-bar"><div class="sig-zone" style="left:${zone.x*100}%;width:${zone.w*100}%"></div><div class="sig-needle"></div></div>
      <div class="modal-actions"><button class="btn btn-ghost btn-sm" id="sigCancel">Batal</button><button class="btn btn-primary" id="sigGo">Kunci Sinyal</button></div></div>`;
    document.body.appendChild(ov);
    const needle=ov.querySelector('.sig-needle'),t0=performance.now();
    let raf,pos=0;
    const loop=()=>{pos=.5+.5*Math.sin((performance.now()-t0)/1000*3.4);needle.style.left=pos*100+'%';raf=requestAnimationFrame(loop)};
    loop();
    const finish=grade=>{cancelAnimationFrame(raf);removeEventListener('keydown',key);ov.remove();done({grade})};
    const lock=()=>{const d=Math.abs(pos-center);finish(d<zone.w*.18?'perfect':d<zone.w/2?'good':'miss')};
    const key=e=>{if(e.code==='Space'){e.preventDefault();lock()}};
    addEventListener('keydown',key);
    ov.querySelector('#sigGo').onclick=lock;
    ov.querySelector('#sigCancel').onclick=()=>finish('cancel');
  }
};
