/* Mesin game Metro Line: loop canvas, kereta, penumpang, stasiun baru, overload */
class MetroEngine{
  constructor(canvas,cb={}){
    this.c=canvas;this.g=canvas.getContext('2d');this.cb=cb;this.cfg=MLData.CFG;
    this.speed=1;this.held=false;this.anim=0;
    this.resize();addEventListener('resize',()=>this.resize());
    canvas.addEventListener('pointerdown',e=>this.click(e));
    this.reset();
  }
  rand(a,b){return a+Math.random()*(b-a)}
  resize(){
    const d=devicePixelRatio||1;
    this.w=this.c.clientWidth;this.h=this.c.clientHeight;
    this.c.width=this.w*d;this.c.height=this.h*d;this.g.setTransform(d,0,0,d,0,0);
  }
  P(s){return{x:s.nx*this.w,y:s.ny*this.h}}
  reset(){
    const C=this.cfg;
    this.stations=[];this.fx=[];this.over=false;
    this.lines=MLData.LINES.map((l,i)=>({...l,id:i,st:[],trains:[]}));
    this.sel=0;this.time=0;this.score=0;this.delivered=0;this.boost=0;this.sigCd=0;
    this.nextSt=this.rand(C.spawnMin,C.spawnMax);this.paxT=2;
    for(let i=0;i<C.initialStations;i++)this.addStation(true);
    this.lines[0].st=[0,1,2];this.addTrain(0,true);
  }
  addStation(first){
    const S=MLData.SHAPES;let shape;
    if(first){const free=S.filter(x=>!this.stations.some(s=>s.shape===x));shape=free[Math.floor(Math.random()*free.length)]}
    else shape=S[Math.floor(Math.random()*S.length)];
    let best=null,bd=-1;
    for(let k=0;k<50;k++){
      const nx=this.rand(.08,.92),ny=this.rand(.2,.74),p={x:nx*this.w,y:ny*this.h};
      const d=Math.min(999,...this.stations.map(s=>{const q=this.P(s);return Math.hypot(q.x-p.x,q.y-p.y)}));
      if(d>bd){bd=d;best={nx,ny}}
      if(d>=this.cfg.minDist)break;
    }
    const s={id:this.stations.length,...best,shape,name:MLData.NAMES[this.stations.length%MLData.NAMES.length],q:[],over:0,born:this.anim};
    this.stations.push(s);return s;
  }
  addTrain(li,free){
    const l=this.lines[li];
    const total=this.lines.reduce((n,x)=>n+x.trains.length,0);
    if(!l||l.st.length<2||(!free&&total>=this.cfg.maxTrains))return false;
    const t={i:0,dir:1,t:0,go:false,dwell:.5,pax:[],ang:0};
    l.trains.push(t);this.arrive(l,t);return true;
  }
  connect(li,sid){
    const l=this.lines[li];if(!l)return;
    const s=this.stations[sid];
    if(l.st.includes(sid))return this.cb.onEvent&&this.cb.onEvent(`${s.name} sudah ada di jalur ${l.name}.`);
    l.st.push(sid);
    if(l.st.length===2&&!l.trains.length)this.addTrain(li,true);
    this.cb.onEvent&&this.cb.onEvent(`Jalur ${l.name} diperluas ke ${s.name}.`);
  }
  click(e){
    const r=this.c.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;
    const s=this.stations.find(s=>{const p=this.P(s);return Math.hypot(p.x-x,p.y-y)<28});
    if(s&&!this.over)this.connect(this.sel,s.id);
  }
  setSpeed(n){this.speed=n}
  hold(b){this.held=b}
  applySignal(grade){
    const m={perfect:[10,this.cfg.boostSeconds],good:[5,8],miss:[0,0]}[grade]||[0,0];
    this.score+=m[0];this.boost=Math.max(this.boost,m[1]);this.sigCd=this.cfg.signalCooldown;return m;
  }
  /* ---- simulasi (dt sudah dikali kecepatan) ---- */
  update(dt){
    const C=this.cfg;
    this.time+=dt;this.nextSt-=dt;
    this.sigCd=Math.max(0,this.sigCd-dt);this.boost=Math.max(0,this.boost-dt);
    if(this.nextSt<=0){
      if(this.stations.length<14){const s=this.addStation();this.cb.onEvent&&this.cb.onEvent('Stasiun baru dibuka: '+s.name)}
      this.nextSt=this.rand(C.spawnMin,C.spawnMax);
    }
    this.paxT-=dt;
    if(this.paxT<=0){this.spawnPax();this.paxT=this.rand(C.paxMin,C.paxMax)*Math.max(.45,1-this.time/1000)}
    this.lines.forEach(l=>l.trains.forEach(t=>this.moveTrain(l,t,dt)));
    for(const s of this.stations){
      s.over=s.q.length>=C.queueLimit?Math.min(C.overloadSeconds,s.over+dt):Math.max(0,s.over-dt*.5);
      if(s.over>=C.overloadSeconds){this.gameOver(s);return}
    }
    this.fx.forEach(f=>f.life-=dt);this.fx=this.fx.filter(f=>f.life>0);
  }
  spawnPax(){
    const s=this.stations[Math.floor(Math.random()*this.stations.length)];
    const opts=[...new Set(this.stations.map(x=>x.shape))].filter(x=>x!==s.shape);
    if(opts.length)s.q.push(opts[Math.floor(Math.random()*opts.length)]);
  }
  moveTrain(l,t,dt){
    if(l.st.length<2)return;
    if(t.dwell>0){t.dwell-=dt;return}
    if(!t.go){
      if(t.i+t.dir<0||t.i+t.dir>=l.st.length)t.dir*=-1;
      t.go=true;t.t=0;
    }
    const A=this.P(this.stations[l.st[t.i]]),B=this.P(this.stations[l.st[t.i+t.dir]]);
    const L=Math.hypot(B.x-A.x,B.y-A.y)||1;
    t.t+=this.cfg.trainSpeed*(this.boost>0?1.5:1)*dt/L;
    if(t.t>=1){t.i+=t.dir;t.t=0;t.go=false;this.arrive(l,t)}
  }
  arrive(l,t){
    const s=this.stations[l.st[t.i]],p=this.P(s);
    const out=t.pax.filter(x=>x===s.shape).length;
    if(out){
      t.pax=t.pax.filter(x=>x!==s.shape);this.score+=out;this.delivered+=out;
      this.fx.push({x:p.x,y:p.y-32,txt:'+'+out,life:1.3});
    }
    if(t.i+t.dir<0||t.i+t.dir>=l.st.length)t.dir*=-1;
    const ahead=new Set();
    for(let k=t.i+t.dir;k>=0&&k<l.st.length;k+=t.dir)ahead.add(this.stations[l.st[k]].shape);
    s.q=s.q.filter(x=>{
      if(t.pax.length<this.cfg.capacity&&ahead.has(x)){t.pax.push(x);return false}
      return true;
    });
    t.dwell=this.cfg.dwell;
  }
  gameOver(s){
    this.over=true;
    this.cb.onOver&&this.cb.onOver({score:this.score,time:this.time,stations:this.stations.length,delivered:this.delivered,reason:s.name});
  }
  hud(){
    return{score:this.score,time:this.time,next:this.nextSt,speed:this.held?0:this.speed,stations:this.stations.length,
      lines:this.lines.map(l=>({n:l.st.length,t:l.trains.length})),sel:this.sel,sigCd:this.sigCd,boost:this.boost,
      trains:this.lines.reduce((n,l)=>n+l.trains.length,0)};
  }
  /* ---- loop: delta time nyata, simulasi dikali kecepatan ---- */
  start(){
    this.last=performance.now();
    const frame=now=>{
      const rd=Math.max(0,Math.min(.1,(now-this.last)/1000));this.last=now;this.anim+=rd;
      this.raf=requestAnimationFrame(frame);
      try{
        if(!this.over&&!this.held&&this.speed>0)this.update(rd*this.speed);
        this.draw();
        this.cb.onHud&&this.cb.onHud(this.hud());
      }catch(err){console.error('Metro Line frame error:',err)}
    };
    this.raf=requestAnimationFrame(frame);
  }
  /* ---- render ---- */
  trainPos(l,t){
    const a=this.P(this.stations[l.st[t.i]]);
    let b=a;
    if(t.go&&l.st[t.i+t.dir]!==undefined)b=this.P(this.stations[l.st[t.i+t.dir]]);
    const k=t.go?t.t:0,ang=b===a?t.ang:Math.atan2(b.y-a.y,b.x-a.x),off=(l.id-1)*6;
    t.ang=ang;
    return{x:a.x+(b.x-a.x)*k-Math.sin(ang)*off,y:a.y+(b.y-a.y)*k+Math.cos(ang)*off,ang};
  }
  draw(){
    const g=this.g,{w,h}=this;g.clearRect(0,0,w,h);
    g.strokeStyle='rgba(16,185,129,.08)';g.lineWidth=1;
    for(let x=0;x<w;x+=48){g.beginPath();g.moveTo(x,0);g.lineTo(x,h);g.stroke()}
    for(let y=0;y<h;y+=48){g.beginPath();g.moveTo(0,y);g.lineTo(w,y);g.stroke()}
    g.lineCap='round';
    for(const l of this.lines){
      const off=(l.id-1)*6;
      g.strokeStyle=l.color;g.lineWidth=l.id===this.sel?11:9;g.globalAlpha=l.id===this.sel?1:.85;
      for(let k=0;k<l.st.length-1;k++){
        const A=this.P(this.stations[l.st[k]]),B=this.P(this.stations[l.st[k+1]]);
        const a=Math.atan2(B.y-A.y,B.x-A.x),ox=-Math.sin(a)*off,oy=Math.cos(a)*off;
        g.beginPath();g.moveTo(A.x+ox,A.y+oy);g.lineTo(B.x+ox,B.y+oy);g.stroke();
      }
    }
    g.globalAlpha=1;
    for(const s of this.stations){
      const p=this.P(s),sc=Math.max(0,Math.min(1,(this.anim-s.born)/.6)),r=15*sc,danger=s.q.length>=this.cfg.queueLimit;
      if(s.over>0){
        g.strokeStyle='#f43f5e';g.lineWidth=5;g.beginPath();
        g.arc(p.x,p.y,r+11,-Math.PI/2,-Math.PI/2+Math.PI*2*s.over/this.cfg.overloadSeconds);g.stroke();
      }
      MLArt.drawShape(g,s.shape,p.x,p.y,r);
      g.fillStyle=danger&&Math.sin(this.anim*8)>0?'#ffe4e6':'#fff';g.fill();
      g.strokeStyle='#064e3b';g.lineWidth=4;g.stroke();
      g.fillStyle='#5b7a6e';g.font='600 11px system-ui';g.textAlign='center';g.fillText(s.name,p.x,p.y+r+17);
      s.q.forEach((d,k)=>{
        MLArt.drawShape(g,d,p.x+r+14+(k%5)*13,p.y-6+Math.floor(k/5)*13,4.5);
        g.fillStyle='#0f2a22';g.fill();
      });
    }
    for(const l of this.lines)for(const t of l.trains){
      if(l.st.length<2)continue;
      const q=this.trainPos(l,t);
      g.save();g.translate(q.x,q.y);g.rotate(q.ang);
      if(this.boost>0){g.shadowColor='#fbbf24';g.shadowBlur=14}
      g.beginPath();g.roundRect(-17,-9,34,18,6);g.fillStyle=l.color;g.fill();
      g.shadowBlur=0;g.strokeStyle='#fff';g.lineWidth=2.5;g.stroke();
      t.pax.forEach((d,k)=>{MLArt.drawShape(g,d,-12+k*4.8,0,2.5);g.fillStyle='#fff';g.fill()});
      g.restore();
    }
    g.font='800 16px system-ui';g.textAlign='center';
    for(const f of this.fx){g.globalAlpha=Math.min(1,f.life);g.fillStyle='#047857';g.fillText(f.txt,f.x,f.y-(1.3-f.life)*24)}
    g.globalAlpha=1;
  }
}
