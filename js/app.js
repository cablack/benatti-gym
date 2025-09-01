(function(){
  const LS='benatti.gym.v1';
  const state = load() || seed();
  ensureToday();
  render('hoje');
  initSW();

  function seed(){
    return {
      hoje:{date:ymd(new Date()),aguaMl:0,treino:[],notas:''},
      settings:{aguaMetaMl:2000,copoMl:250},
      medidas:[],
      lembretes:{}
    }
  }

  function ymd(d){return d.toISOString().slice(0,10)}
  function load(){try{return JSON.parse(localStorage.getItem(LS))}catch(e){return null}}
  function save(){localStorage.setItem(LS,JSON.stringify(state))}
  function ensureToday(){
    const t=new Date();
    document.getElementById('today').textContent=t.toLocaleDateString('pt-BR',{weekday:'short',day:'2-digit',month:'2-digit'});
    if(!state.hoje||state.hoje.date!==ymd(t)) state.hoje={date:ymd(t),aguaMl:0,treino:[],notas:''};
    save();
  }

  document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{
    document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));
    b.classList.add('active'); render(b.dataset.tab);
  });

  function render(tab){
    const el=document.getElementById('view'); el.innerHTML='';
    if(tab==='hoje') return viewHoje(el);
    if(tab==='treinos') return viewTreinos(el);
    if(tab==='biblioteca') return viewBiblioteca(el);
    if(tab==='medidas') return viewMedidas(el);
    if(tab==='lembretes') return viewLembretes(el);
  }

  function viewHoje(el){
    const pct=Math.min(100,Math.round(100*state.hoje.aguaMl/state.settings.aguaMetaMl));
    el.appendChild(card('Resumo do dia',`
      <div>
        <div class="small">Água</div>
        <div class="title"><span>${state.hoje.aguaMl}</span> / ${state.settings.aguaMetaMl} ml</div>
        <div class="progress"><div style="width:${pct}%"></div></div>
        <div class="row" style="margin-top:8px">
          <button class="btn primary" id="maisCopo">+1 copo (${state.settings.copoMl}ml)</button>
          <button class="btn" id="menosCopo">-1 copo</button>
          <button class="btn" id="zerarAgua">Zerar</button>
        </div>
      </div>`));
    byId('maisCopo').onclick=()=>{state.hoje.aguaMl+=state.settings.copoMl;save();render('hoje')};
    byId('menosCopo').onclick=()=>{state.hoje.aguaMl=Math.max(0,state.hoje.aguaMl-state.settings.copoMl);save();render('hoje')};
    byId('zerarAgua').onclick=()=>{state.hoje.aguaMl=0;save();render('hoje')};
  }

  function viewBiblioteca(el){
    const list = biblioteca.map(ex=>`
      <div class="card">
        <div class="spaced">
          <div class="title">${ex.nome}</div>
          <a href="${ex.video}" target="_blank" class="btn">▶</a>
        </div>
        <div class="small">${ex.descricao}</div>
      </div>`).join('');
    el.appendChild(card('Biblioteca de exercícios',list));
  }

  function viewMedidas(el){
    el.appendChild(card('Registrar medidas',`
      <div class="list">
        <label>Peso (kg)<br><input id="m_peso" type="number" class="input"></label>
        <label>Altura (cm)<br><input id="m_altura" type="number" class="input"></label>
        <label>Cintura (cm)<br><input id="m_cint" type="number" class="input"></label>
        <label>Peito (cm)<br><input id="m_peito" type="number" class="input"></label>
        <label>Braço dir. (cm)<br><input id="m_braco_dir" type="number" class="input"></label>
        <label>Braço esq. (cm)<br><input id="m_braco_esq" type="number" class="input"></label>
        <label>Coxa dir. (cm)<br><input id="m_coxa_dir" type="number" class="input"></label>
        <label>Coxa esq. (cm)<br><input id="m_coxa_esq" type="number" class="input"></label>
        <label>Panturrilha dir. (cm)<br><input id="m_pantu_dir" type="number" class="input"></label>
        <label>Panturrilha esq. (cm)<br><input id="m_pantu_esq" type="number" class="input"></label>
        <button class="btn good" id="salvarMed">Salvar medidas</button>
      </div>`));

    byId('salvarMed').onclick=()=>{
      state.medidas.push({
        data: ymd(new Date()),
        peso: +byId('m_peso').value || null,
        altura: +byId('m_altura').value || null,
        cintura: +byId('m_cint').value || null,
        peito: +byId('m_peito').value || null,
        braco_dir: +byId('m_braco_dir').value || null,
        braco_esq: +byId('m_braco_esq').value || null,
        coxa_dir: +byId('m_coxa_dir').value || null,
        coxa_esq: +byId('m_coxa_esq').value || null,
        pantu_dir: +byId('m_pantu_dir').value || null,
        pantu_esq: +byId('m_pantu_esq').value || null
      });
      save();
      alert('Medidas salvas!');
    };
  }

  function viewLembretes(el){
    el.appendChild(card('Lembretes',`
      <p class="small">Configurações futuras de notificações aqui.</p>`));
  }

  function card(title,inner){
    const d=document.createElement('section');
    d.className='card';
    d.innerHTML='<div class="spaced"><div class="title">'+title+'</div></div>'+inner;
    return d;
  }
  function byId(id){return document.getElementById(id)}

  async function initSW(){
    if('serviceWorker' in navigator){
      try{await navigator.serviceWorker.register('sw.js')}catch(e){}
    }
  }
})();
