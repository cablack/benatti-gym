// app.js
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
      biblioteca:[],
      treinos:[],
      medidas:[],
      lembretes:{}
    }
  }

  function id(){return Math.random().toString(36).slice(2,9)}
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
    if(tab==='treinos') return viewTreinos(el); // Esta função está em treino.js
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
    // Esta função precisa ser atualizada para usar a biblioteca global
    const list=(biblioteca||[]).map((ex,i)=>`
      <div class="card">
        <div class="spaced">
          <div class="title">${ex.nome}</div>
          <button class="btn" data-video="${ex.video}">▶ Ver</button>
        </div>
        <div class="small">${ex.descricao||''}</div>
      </div>`).join('');
    el.appendChild(card('Biblioteca de exercícios',list));
    
    // Adicionar event listeners para os botões de vídeo
    document.querySelectorAll('button[data-video]').forEach(btn => {
      btn.addEventListener('click', () => {
        const videoUrl = btn.getAttribute('data-video');
        openVideoModal(videoUrl);
      });
    });
  }

  function viewMedidas(el){
    el.appendChild(card('Registrar medidas',`
      <div class="row"><label>Peso (kg)<input id="m_peso" type="number" class="input"></label>
      <label>Cintura (cm)<input id="m_cint" type="number" class="input"></label>
      <button class="btn good" id="salvarMed">Salvar</button></div>`));
    byId('salvarMed').onclick=()=>{
      state.medidas.push({data:ymd(new Date()),peso:+byId('m_peso').value||null,cintura:+byId('m_cint').value||null});
      save();alert('Medida salva!');
    };
  }

  function viewLembretes(el){
    el.appendChild(card('Lembretes',`
      <p class="small">Configurações futuras de notificações aqui.</p>`));
  }

  function openVideoModal(videoUrl) {
    byId('modalTitle').textContent = "Demonstração do Exercício";
    
    // Mostra spinner inicial
    byId('modalContent').innerHTML = `
      <div class="loading"></div>
      <p class="small" style="text-align: center; margin-top: 10px;">Carregando vídeo...</p>
    `;
    
    byId('modal').classList.add('open');
    
    // Cria elemento de vídeo
    const video = document.createElement('video');
    video.controls = true;
    video.playsInline = true;
    video.muted = true;
    video.style.width = '100%';
    video.style.maxHeight = '70vh';
    
    const source = document.createElement('source');
    source.src = videoUrl;
    source.type = 'video/mp4';
    video.appendChild(source);
    
    // Quando o vídeo puder começar a tocar
    video.addEventListener('canplay', function() {
      byId('modalContent').innerHTML = '';
      byId('modalContent').appendChild(video);
      
      // tenta autoplay
      video.play().catch(() => {
        console.log('Autoplay bloqueado, mostrando controles');
      });
    });
    
    // Timeout de fallback (5s)
    const timeoutId = setTimeout(() => {
      if (byId('modalContent').querySelector('.loading')) {
        byId('modalContent').innerHTML = '';
        byId('modalContent').appendChild(video);
      }
    }, 5000);
    
    // Tratamento de erro
    video.addEventListener('error', function() {
      clearTimeout(timeoutId);
      byId('modalContent').innerHTML = `
        <div class="error-msg">
          <p>Erro ao carregar o vídeo.</p>
          <p>Verifique sua conexão ou tente novamente.</p>
          <button class="retry-btn" onclick="window.open('${videoUrl}', '_blank')">Abrir em nova janela</button>
        </div>
      `;
    });
    
    // dispara carregamento
    video.load();
  }
  
  byId('closeModal').onclick = function() {
    byId('modal').classList.remove('open');
    // Parar qualquer vídeo que esteja tocando
    const video = byId('modalContent').querySelector('video');
    if (video) {
      video.pause();
    }
  };

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

  // Função global para ser acessada por treino.js
  window.viewTreinos = function(el) {
    const nomesDias = ["domingo","segunda","terca","quarta","quinta","sexta","sabado"];
    const hoje = new Date();
    const dia = nomesDias[hoje.getDay()];
    const lista = treinos[dia];

    if (!lista) {
      // Card especial de descanso
      el.appendChild(card(`Treino de ${dia.charAt(0).toUpperCase()+dia.slice(1)}`, `
        <div style="text-align:center; padding: 20px;">
          <div class="title">Hoje é descanso 😴</div>
          <p class="small">Aproveite para relaxar e recuperar energia.</p>
        </div>
      `));
      return;
    }

    el.appendChild(card(`Treino de ${dia.charAt(0).toUpperCase()+dia.slice(1)}`, `
      <div class="list">
        ${lista.map(nome => {
          const ex = getExercicio(nome);
          return `
            <div class="spaced" style="margin: 8px 0; padding: 8px; border-bottom: 1px solid var(--line);">
              <div>${ex.nome} — <span class="small">${ex.descricao}</span></div>
              <button class="btn" data-video="${ex.video}">▶</button>
            </div>
          `;
        }).join('')}
      </div>
    `));
    
    // Adicionar event listeners para os botões de vídeo
    document.querySelectorAll('button[data-video]').forEach(btn => {
      btn.addEventListener('click', () => {
        const videoUrl = btn.getAttribute('data-video');
        openVideoModal(videoUrl);
      });
    });
  };
})();
