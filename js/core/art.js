/* Logo & ilustrasi vektor, plus helper bentuk (dipakai canvas & UI) */
const MLArt={
  pts(shape,r){
    const poly=(n,rr=r,off=-Math.PI/2)=>Array.from({length:n},(_,i)=>{const a=off+i*2*Math.PI/n;return[Math.cos(a)*rr,Math.sin(a)*rr]});
    switch(shape){
      case'triangle':return poly(3,r*1.15);
      case'square':return[[-.85*r,-.85*r],[.85*r,-.85*r],[.85*r,.85*r],[-.85*r,.85*r]];
      case'diamond':return poly(4,r*1.2);
      case'pentagon':return poly(5,r*1.1);
      case'star':return Array.from({length:10},(_,i)=>{const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.5:r*1.2;return[Math.cos(a)*rr,Math.sin(a)*rr]});
      default:return null;
    }
  },
  drawShape(ctx,shape,x,y,r){
    r=Math.max(0,r);
    const p=this.pts(shape,r);ctx.beginPath();
    if(!p)ctx.arc(x,y,r,0,Math.PI*2);
    else{p.forEach(([px,py],i)=>i?ctx.lineTo(x+px,y+py):ctx.moveTo(x+px,y+py));ctx.closePath()}
  },
  shapeSVG(shape,color='#064e3b',size=22){
    const r=size/2-3,p=this.pts(shape,r),c=size/2;
    const inner=p?`<polygon points="${p.map(([x,y])=>(x+c).toFixed(1)+','+(y+c).toFixed(1)).join(' ')}"`:`<circle cx="${c}" cy="${c}" r="${r}"`;
    return`<svg class="shape-icon" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${inner} fill="#fff" stroke="${color}" stroke-width="2.5"/></svg>`;
  },
  logo(size=36,text=true){
    const svg=`<svg width="${size}" height="${size}" viewBox="0 0 48 48" aria-label="Metro Line">
      <defs><linearGradient id="lg${size}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#34d399"/><stop offset="1" stop-color="#047857"/></linearGradient></defs>
      <rect width="48" height="48" rx="14" fill="url(#lg${size})"/>
      <path d="M10 34V16l14 12 14-12v18" fill="none" stroke="#fff" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="10" cy="16" r="3.6" fill="#f97316" stroke="#fff" stroke-width="2"/>
      <circle cx="38" cy="16" r="3.6" fill="#3b82f6" stroke="#fff" stroke-width="2"/>
      <circle cx="24" cy="28" r="3.6" fill="#fbbf24" stroke="#fff" stroke-width="2"/></svg>`;
    return svg+(text?'<span>Metro <b>Line</b></span>':'');
  },
  hero(){
    return`<svg class="hero-art" viewBox="0 0 460 340" role="img" aria-label="Ilustrasi jaringan metro">
      <rect x="6" y="6" width="448" height="328" rx="32" fill="#fff" stroke="#a7f3d0" stroke-width="3"/>
      <path d="M50 250 L150 150 L260 190 L400 80" fill="none" stroke="#10b981" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M60 80 L170 120 L260 190 L390 270" fill="none" stroke="#f97316" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M120 300 L170 120 L330 60" fill="none" stroke="#3b82f6" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
      <g fill="#fff" stroke="#064e3b" stroke-width="5"><circle cx="150" cy="150" r="14"/><circle cx="260" cy="190" r="16"/><circle cx="170" cy="120" r="12"/>
      <rect x="388" y="68" width="24" height="24" rx="2"/><polygon points="50,236 64,262 36,262"/><polygon points="390,252 404,278 376,278"/></g>
      <g transform="translate(205,160) rotate(18)"><rect x="-26" y="-13" width="52" height="26" rx="9" fill="#10b981" stroke="#fff" stroke-width="4"/><circle cx="-12" cy="0" r="4" fill="#fff"/><rect x="2" y="-4" width="8" height="8" fill="#fff"/></g>
    </svg>`;
  },
  mount(){
    document.querySelectorAll('[data-logo]').forEach(el=>{el.classList.add('logo');el.innerHTML=this.logo(+el.dataset.logo||36,el.dataset.text!=='no')});
    document.querySelectorAll('[data-hero]').forEach(el=>el.innerHTML=this.hero());
  }
};
