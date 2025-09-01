// Função utilitária para gerar link de vídeo automaticamente
function videoLink(nome) {
  return "media/" + nome
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g,"") // remove acentos
    .replace(/\s+/g,"-") + ".mp4";
}

// === Biblioteca global de exercícios ===
const biblioteca = [
  { nome: "Aquecimento", descricao: "Bicicleta ou esteira leve 10 min" },
  { nome: "Leg press", descricao: "Joelho alinhado ao pé" },
  { nome: "Cadeira extensora", descricao: "Controle no movimento" },
  { nome: "Mesa flexora", descricao: "Não levante o quadril" },
  { nome: "Remada baixa", descricao: "Peito aberto, puxe pelo cotovelo" },
  { nome: "Prancha", descricao: "Cabeça, tronco e quadril alinhados" },
  { nome: "Eliptico", descricao: "Movimento contínuo e postura ereta" },
  { nome: "Alongamento", descricao: "Alongar membros e lombar" },
  { nome: "Bicicleta", descricao: "Pedalar leve 10 min" }
].map(ex => ({...ex, video: videoLink(ex.nome)}));

// === Treinos semanais ===
const treinos = {
  segunda:  ["Aquecimento","Eliptico","Leg press","Mesa flexora","Alongamento"],
  terca:    ["Aquecimento","Cadeira extensora","Remada baixa","Prancha","Alongamento"],
  quarta:   ["Aquecimento","Eliptico","Leg press","Prancha","Alongamento"],
  quinta:   ["Aquecimento","Bicicleta","Mesa flexora","Remada baixa","Alongamento"],
  sexta:    ["Aquecimento","Eliptico","Cadeira extensora","Prancha","Alongamento"],
  sabado:   null,
  domingo:  null
};

// Retorna exercício completo a partir do nome
function getExercicio(nome) {
  return biblioteca.find(ex => ex.nome === nome);
}

// Renderizar treino do dia
function viewTreinos(el) {
  const nomesDias = ["domingo","segunda","terca","quarta","quinta","sexta","sabado"];
  const hoje = new Date();
  const dia = nomesDias[hoje.getDay()];
  const lista = treinos[dia];

  if (!lista) {
    // Card especial de descanso
    el.appendChild(card(`Treino de ${dia.charAt(0).toUpperCase()+dia.slice(1)}`, `
      <div class="card" style="text-align:center">
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
          <div class="spaced">
            <div>${ex.nome} — <span class="small">${ex.descricao}</span></div>
            <a href="${ex.video}" target="_blank" class="btn">▶</a>
          </div>
        `;
      }).join('')}
    </div>
  `));
}
