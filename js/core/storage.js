/* Penyimpanan akun, sesi, dan riwayat permainan (localStorage) */
const Store=(()=>{
  const get=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v??d}catch(e){return d}};
  const set=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
  const hash=s=>{let h=5381;for(const c of s)h=((h<<5)+h+c.charCodeAt(0))|0;return String(h)};
  return{
    register(name,pass){
      const key=name.trim().toLowerCase(),u=get('ml_users',{});
      if(u[key])return{ok:false,msg:'Username sudah terdaftar.'};
      u[key]={name:name.trim(),pw:hash(pass),created:Date.now()};set('ml_users',u);
      return{ok:true};
    },
    login(name,pass){
      const key=name.trim().toLowerCase(),u=get('ml_users',{})[key];
      if(!u||u.pw!==hash(pass))return{ok:false,msg:'Username atau kata sandi salah.'};
      set('ml_session',key);return{ok:true};
    },
    logout(){localStorage.removeItem('ml_session')},
    user(){
      const k=get('ml_session',null);if(!k)return null;
      const u=get('ml_users',{})[k];return u?{key:k,name:u.name,created:u.created}:null;
    },
    addGame(r){
      const u=this.user();if(!u)return;
      const h=get('ml_games',[]);h.push({...r,user:u.key,name:u.name,date:Date.now()});
      set('ml_games',h.slice(-500));
    },
    games(all){
      const u=this.user(),h=get('ml_games',[]);
      return(all?h:h.filter(g=>u&&g.user===u.key)).sort((a,b)=>b.date-a.date);
    },
    best(){return Math.max(0,...this.games().map(g=>g.score))},
    clear(){const u=this.user();set('ml_games',get('ml_games',[]).filter(g=>!u||g.user!==u.key))}
  };
})();
