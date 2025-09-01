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
  segunda:  ["Alongamento","Bicicleta","Leg press","Mesa flexora"],
  terca:    ["Alongamento","Esteira","Cadeira extensora","Remada baixa","Prancha"],
  quarta:   ["Alongamento","Bicicleta","Leg press","Prancha"],
  quinta:   ["Alongamento","Esteira","Mesa flexora","Remada baixa"],
  sexta:    ["Alongamento","Bicicleta","Cadeira extensora","Prancha"],
  sabado:   null,
  domingo:  null
};

function getExercicio(nome) {
  return biblioteca.find(ex => ex.nome === nome);
}

window.biblioteca = biblioteca;
window.treinos = treinos;
window.getExercicio = getExercicio;
