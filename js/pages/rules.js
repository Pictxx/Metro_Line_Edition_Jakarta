document.addEventListener('DOMContentLoaded',()=>{
  document.getElementById('shapeLegend').innerHTML=MLData.SHAPES.map(s=>`<span>${MLArt.shapeSVG(s,'#064e3b',28)}${MLData.SHAPE_LABEL[s]}</span>`).join('');
  document.getElementById('lineLegend').innerHTML=MLData.LINES.map(l=>`<span><i style="width:16px;height:16px;border-radius:50%;background:${l.color};display:inline-block"></i>Jalur ${l.name}</span>`).join('');
  const tabs=document.querySelectorAll('.tab-btn'),panels=document.querySelectorAll('[data-panel]');
  tabs.forEach(b=>b.onclick=()=>{
    tabs.forEach(x=>x.classList.toggle('active',x===b));
    panels.forEach(p=>p.classList.toggle('hidden',p.dataset.panel!==b.dataset.tab));
  });
});
