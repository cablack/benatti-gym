// app.js
(function(){
  const APP_VERSION = "v25.6";
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
    document.getElementById('today').textContent=
      t.toLocaleDateString('pt-BR',{weekday:'short',day:'2-digit',month:'2-digit'}) +
      " • " + APP_VERSION;
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
    if(tab==='treinos') return window.viewTreinos(el);
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
    const list=(window.biblioteca||[]).map((ex,i)=>`
      <div class="card">
        <div class="spaced">
          <div class="title">${ex.nome}</div>
          <a href="${ex.video}" target="_blank" class="btn">▶ Ver</a>
        </div>
        <div class="small">${ex.descricao||''}</div>
      </div>`).join('');
    el.appendChild(card('Biblioteca de exercícios',list));
  }

  // === Atualizado: Medidas com envio ao Google Forms ===
  function viewMedidas(el){
    el.appendChild(card('Registrar medidas',`
      <div class="list">
        <label>Altura (cm)<input id="m_altura" type="number" class="input" required></label>
        <label>Peso (kg)<input id="m_peso" type="number" class="input" required></label>
        <label>Cintura (cm)<input id="m_cint" type="number" class="input" required></label>
        <label>Peito (cm)<input id="m_peito" type="number" class="input" required></label>
        <label>Braço (cm)<input id="m_braco" type="number" class="input" required></label>
        <label>Panturrilha (cm)<input id="m_pant" type="number" class="input" required></label>
        <label>Tempo Esteira (min)<input id="m_esteira" type="text" class="input" required></label>
        <label>Tempo Bicicleta (min)<input id="m_bike" type="text" class="input" required></label>
        <button class="btn good" id="salvarMed">Enviar</button>
      </div>`));

    byId('salvarMed').onclick=()=>{
      // pega os valores
      const dados = {
        altura: byId('m_altura').value.trim(),
        peso: byId('m_peso').value.trim(),
        cintura: byId('m_cint').value.trim(),
        peito: byId('m_peito').value.trim(),
        braco: byId('m_braco').value.trim(),
        pant: byId('m_pant').value.trim(),
        esteira: byId('m_esteira').value.trim(),
        bike: byId('m_bike').value.trim()
      };

      // Salva localmente
      state.medidas.push({data:ymd(new Date()),...dados});
      save();

      // Envia ao Google Forms
      const formUrl = "https://docs.google.com/forms/d/e/1FAIpQLSfZSiubpmKwH4Cl1vtynb5FT18rUo0b9Ke27RNThrsIoKTdEQ/formResponse?";
      const formData = new FormData();
      formData.append("entry.198550740", dados.altura);
      formData.append("entry.877850622", dados.peso);
      formData.append("entry.203779381", dados.cintura);
      formData.append("entry.8560140", dados.peito);
      formData.append("entry.1959138967", dados.braco);
      formData.append("entry.247764967", dados.pant);
      formData.append("entry.1375736721", dados.esteira);
      formData.append("entry.1782579123", dados.bike);

      fetch(formUrl, { method: "POST", mode: "no-cors", body: formData });

      alert('Medida salva localmente e enviada!');
      // validação: se faltar algum, alerta e não envia
      if (Object.values(dados).some(v => !v)) {
        alert("⚠️ Preencha todos os campos antes de enviar.");
        return;
      }

      // monta a URL (linha única)
      const url =
        "https://docs.google.com/forms/d/e/1FAIpQLSfZSiubpmKwH4Cl1vtynb5FT18rUo0b9Ke27RNThrsIoKTdEQ/formResponse" +
        "?entry.198550740=" + encodeURIComponent(dados.altura) +
        "&entry.877850622=" + encodeURIComponent(dados.peso) +
        "&entry.203779381=" + encodeURIComponent(dados.cintura) +
        "&entry.8560140=" + encodeURIComponent(dados.peito) +
        "&entry.1959138967=" + encodeURIComponent(dados.braco) +
        "&entry.247764967=" + encodeURIComponent(dados.pant) +
        "&entry.1375736721=" + encodeURIComponent(dados.esteira) +
        "&entry.1782579123=" + encodeURIComponent(dados.bike);

      // envia silenciosamente
      fetch(url, { method: "GET", mode: "no-cors" })
        .then(() => alert("✅ Medidas enviadas com sucesso!"))
        .catch(() => alert("❌ Erro ao enviar, tente novamente."));
    };
  }

  function viewLembretes(el){
    el.appendChild(card('Lembretes',`
      <p class="small">Configurações futuras de notificações aqui.</p>`));
  }

  window.viewTreinos = function(el){
    const nomesDias = ["domingo","segunda","terca","quarta","quinta","sexta","sabado"];
    const hoje = new Date();
    const dia = nomesDias[hoje.getDay()];
    const lista = window.treinos[dia];

    if (!lista) {
      el.appendChild(card(`Treino de ${dia}`, `
        <div style="text-align:center; padding: 20px;">
          <div class="title">Hoje não há treino</div>
          <p class="small">Aproveite para descansar.</p>
        </div>
      `));
      return;
    }

    el.appendChild(card(`Treino de ${dia}`, `
      <div class="list">
        ${lista.map(item=>{
          const ex = window.getExercicio(item.nome);
          if(!ex) return "";
          let detalhe = "";
          if(item.series && item.reps) detalhe = `${item.series}×${item.reps}`;
          else if(item.tempo) detalhe = item.tempo;
          return `
            <div class="spaced" style="margin:8px 0; padding:6px 0; border-bottom:1px solid var(--line);">
              <div>${ex.nome} — <span class="small">${ex.descricao}</span> <span class="small">(${detalhe})</span></div>
              <a href="${ex.video}" target="_blank" class="btn">▶</a>
            </div>
          `;
        }).join('')}
      </div>
    `));
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
})();
