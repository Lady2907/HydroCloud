/* ===================== DATOS DEL SISTEMA ===================== */
const points = [
  {id:'P-01', name:'Pozo Principal', zone:'Zona Jicamarca', x:150, y:150, status:'ok', ph:{v:7.6,status:'ok'}, turb:{v:2.1,unit:'NTU',status:'ok'}, temp:{v:19.8,status:'ok'}, cond:{v:410,status:'ok'}},
  {id:'P-02', name:'Reservorio Norte', zone:'Manchay Alto', x:330, y:95, status:'warn', ph:{v:7.8,status:'ok'}, turb:{v:4.2,unit:'NTU',status:'warn'}, temp:{v:18.5,status:'ok'}, cond:{v:523,status:'warn'}},
  {id:'P-03', name:'Captación Sur', zone:'Zona Huaycan', x:560, y:170, status:'bad', ph:{v:5.9,status:'bad'}, turb:{v:9.4,unit:'NTU',status:'bad'}, temp:{v:22.1,status:'warn'}, cond:{v:780,status:'bad'}},
];

const alertsLog = [
  {fecha:'26/06/2026', hora:'14:32', punto:'P-03 Captación Sur', param:'Conductividad', riesgo:'alto'},
  {fecha:'26/06/2026', hora:'11:15', punto:'P-02 Reservorio Norte', param:'Turbidez', riesgo:'medio'},
];

const incidents = [
  {id:'INC-041', zona:'Zona Manchay', fecha:'26/06/2026', tecnico:'Carlos Ríos', estado:'atencion'},
  {id:'INC-040', zona:'Zona Huaycan', fecha:'25/06/2026', tecnico:'María Díaz', estado:'pendiente'},
];

const zoneCriticality = [{name:'Jicamarca', val:10}, {name:'Manchay', val:8}, {name:'Huaycan', val:5}];

const statusColor = {ok:'var(--ok)', warn:'var(--warn)', bad:'var(--bad)'};
const statusLabel = {ok:'Normal', warn:'En Observación', bad:'Alerta'};
const statusBg = {ok:'var(--ok-bg)', warn:'var(--warn-bg)', bad:'var(--bad-bg)'};

/* ===================== CONTROLADORES DE VISTA ===================== */
const switchBtns = document.querySelectorAll('.view-switch button');
let chartBuilt = false;

switchBtns.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    switchBtns.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
    
    const key = btn.dataset.view === 'tiempo-real' ? 'view-tiempo-real' : 'view-institucional';
    document.getElementById(key).classList.add('active');
    
    if(btn.dataset.view === 'tiempo-real'){
      document.getElementById('topTitle').textContent = 'Dashboard — Monitoreo en Tiempo Real';
    } else {
      document.getElementById('topTitle').textContent = 'Panel Institucional de Reportes y Gestión';
      if(!chartBuilt) buildChart();
    }
  });
});

/* ===================== RENDERIZADO MAPA SVG ===================== */
const svgNS = 'http://www.w3.org/2000/svg';
const mapSvg = document.getElementById('mapSvg');
let selectedId = 'P-02';

function renderMap(){
  if(!mapSvg) return;
  mapSvg.innerHTML = '';
  
  points.forEach(p=>{
    const g = document.createElementNS(svgNS,'g');
    g.setAttribute('transform', `translate(${p.x},${p.y})`);
    g.style.cursor = 'pointer';
    g.addEventListener('click', ()=> selectPoint(p.id));

    const c = document.createElementNS(svgNS,'circle');
    c.setAttribute('r', p.id === selectedId ? 12 : 9);
    c.setAttribute('fill', p.status==='ok' ? '#16a34a' : p.status==='warn' ? '#d97706' : '#dc2626');
    c.setAttribute('stroke','#fff');
    c.setAttribute('stroke-width', '2');
    g.appendChild(c);

    const t = document.createElementNS(svgNS,'text');
    t.setAttribute('y', -16);
    t.setAttribute('text-anchor','middle');
    t.style.fontSize = '10px';
    t.style.fontWeight = 'bold';
    t.textContent = p.id;
    g.appendChild(t);

    mapSvg.appendChild(g);
  });
}

function selectPoint(id){
  selectedId = id;
  renderMap();
  const p = points.find(pt=>pt.id===id);
  document.getElementById('pointTitle').textContent = `${p.id} — ${p.name}`;
  document.getElementById('pointZone').textContent = `Zona: ${p.zone}`;
  
  document.getElementById('metricsGrid').innerHTML = `
    <div class="metric"><div><strong>pH:</strong> ${p.ph.v}</div></div>
    <div class="metric"><div><strong>Turbidez:</strong> ${p.turb.v} ${p.turb.unit}</div></div>
    <div class="metric"><div><strong>Temperatura:</strong> ${p.temp.v} °C</div></div>
    <div class="metric"><div><strong>TDS:</strong> ${p.cond.v} µS/cm</div></div>
  `;
}

/* ===================== RENDER DE TABLAS Y GRÁFICO ===================== */
function buildChart(){
  chartBuilt = true;
  const ctx = document.getElementById('trendChart');
  if(!ctx) return;
  new Chart(ctx, {
    type:'line',
    data:{
      labels:['12/6', '15/6', '18/6', '21/6', '24/6'],
      datasets:[{label:'Turbidez', data:[2.5, 3.1, 4.2, 5.0, 6.1], borderColor:'#06b6d4', tension:.3}]
    },
    options:{ responsive:true }
  });
}

// Inicialización de la Interfaz
document.addEventListener('DOMContentLoaded', ()=>{
  renderMap();
  selectPoint('P-02');
  
  // Rellenar Alertas
  document.getElementById('alertsBody').innerHTML = alertsLog.map(a=>`
    <tr><td>${a.fecha}</td><td>${a.hora}</td><td>${a.punto}</td><td>${a.param}</td><td>${a.riesgo}</td></tr>
  `).join('');
});
