/* Konfigurasi game */
const MLData={
  LINES:[{name:'Zamrud',color:'#10b981'},{name:'Jingga',color:'#f97316'},{name:'Samudra',color:'#3b82f6'}],
  SHAPES:['circle','triangle','square','diamond','pentagon','star'],
  SHAPE_LABEL:{circle:'Lingkaran',triangle:'Segitiga',square:'Persegi',diamond:'Belah ketupat',pentagon:'Segi lima',star:'Bintang'},
  NAMES:['Merdeka','Cikini','Sudirman','Kemayoran','Senayan','Gambir','Blok M','Tebet','Manggarai','Kota Tua','Dukuh Atas','Pasar Baru','Cawang','Harmoni'],
  CFG:{
    initialStations:3,
    spawnMin:120,spawnMax:180,   // detik game antar stasiun baru
    capacity:6,queueLimit:8,overloadSeconds:25,
    paxMin:2.5,paxMax:5,         // interval spawn penumpang (detik)
    trainSpeed:90,dwell:1.2,maxTrains:6,minDist:120,
    signalCooldown:45,boostSeconds:15
  }
};
