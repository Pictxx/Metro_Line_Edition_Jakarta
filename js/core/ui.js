/* Helper UI: navbar, toast, format waktu */
const MLUI={
  fmt(s){s=Math.max(0,Math.floor(s));return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')},
  esc(t){return String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))},
  date(ts){return new Date(ts).toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'})},
  toast(msg,type=''){
    let box=document.getElementById('toasts');
    if(!box){box=document.createElement('div');box.id='toasts';document.body.appendChild(box)}
    const t=document.createElement('div');t.className='toast '+type;t.textContent=msg;box.appendChild(t);
    setTimeout(()=>t.remove(),3500);
  },
  nav(){
    const el=document.getElementById('nav');if(!el)return;
    const page=location.pathname.split('/').pop()||'index.html',u=Store.user();
    const L=[['index.html','Dashboard'],['game.html','Main'],['how-to-play.html','Panduan'],['scores.html','Skor']];
    el.className='navbar';
    el.innerHTML=`<a href="index.html" data-logo="34"></a>
      <nav class="nav-links">${L.map(([h,t])=>`<a href="${h}" class="${h===page?'active':''}">${t}</a>`).join('')}</nav>
      <div class="nav-user">${u?`<span class="badge">🚆 ${this.esc(u.name)}</span><button class="btn btn-ghost btn-sm" id="btnLogout">Keluar</button>`
        :`<a class="btn btn-ghost btn-sm" href="login.html">Masuk</a><a class="btn btn-primary btn-sm" href="Register.html">Daftar</a>`}</div>`;
    const lo=document.getElementById('btnLogout');
    if(lo)lo.onclick=()=>{Store.logout();location.href='login.html'};
  },
  init(){this.nav();MLArt.mount()}
};
document.addEventListener('DOMContentLoaded',()=>MLUI.init());
