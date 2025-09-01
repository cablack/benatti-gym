// treino.js
function videoLink(nome) {
  return "media/" + nome
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
    .replace(/\s+/g,"-") + ".mp4";
}

const biblioteca = [
  { nome: "Alongamento", descricao: "Alongar membros e lombar" },
  { nome: "Bicicleta", descricao: "Pedalar leve, ritmo constante" },
  { nome: "Esteira", descricao: "Caminhada leve 10 min" },
  { nome: "Leg press", descricao: "Joelho alinhado ao pé" },
  { nome: "Cadeira extensora", descricao: "Controle no movimento" },
  { nome: "Mesa flexora", descricao: "Não levante o quadril" },
  { nome: "Remada baixa", descricao: "Peito aberto, puxe pelo cotovelo" },
  { nome: "Prancha", descricao: "Cabeça, tronco e quadril alinhados" },
  { nome: "Eliptico", descricao: "Movimento contínuo e postura ereta" }
].map(ex => ({...ex, video: videoLink(ex.nome)}));

const treinos = {
  segunda: [
    { nome:"Alongamento", tempo:"5 min" },
    { nome:"Bicicleta", tempo:"10 min" },
    { nome:"Leg press", series:2, reps:"12-15" },
    { nome:"Mesa flexora", series:2, reps:"12-15" }
  ],
  terca: [
    { nome:"Alongamento", tempo:"5 min" },
    { nome:"Esteira", tempo:"10 min" },
    { nome:"Cadeira extensora", series:2, reps:"12-15" },
    { nome:"Remada baixa", series:2, reps:"12-15" },
    { nome:"Prancha", tempo:"30s" }
  ],
  quarta: [
    { nome:"Alongamento", tempo:"5 min" },
    { nome:"Bicicleta", tempo:"10 min" },
    { nome:"Leg press", series:2, reps:"12-15" },
    { nome:"Prancha", tempo:"30s" }
  ],
  quinta: [
    { nome:"Alongamento", tempo:"5 min" },
    { nome:"Esteira", tempo:"10 min" },
    { nome:"Mesa flexora", series:2, reps:"12-15" },
    { nome:"Remada baixa", series:2, reps:"12-15" }
  ],
  sexta: [
    { nome:"Alongamento", tempo:"5 min" },
    { nome:"Bicicleta", tempo:"10 min" },
    { nome:"Cadeira extensora", series:2, reps:"12-15" },
    { nome:"Prancha", tempo:"30s" }
  ],
  sabado: null,
  domingo: null
};

function getExercicio(nome) {
  return biblioteca.find(ex => ex.nome === nome);
}

window.biblioteca = biblioteca;
window.treinos = treinos;
window.getExercicio = getExercicio;
