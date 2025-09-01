// treino.js
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
  { nome: "Bicicleta", descricao: "Pedalar leve, ritmo constante" },
  { nome: "Leg press", descricao: "Joelho alinhado ao pé" },
  { nome: "Cadeira extensora", descricao: "Controle no movimento" },
  { nome: "Mesa flexora", descricao: "Não levante o quadril" },
  { nome: "Remada baixa", descricao: "Peito aberto, puxe pelo cotovelo" },
  { nome: "Prancha", descricao: "Cabeça, tronco e quadril alinhados" },
  { nome: "Eliptico", descricao: "Movimento contínuo e postura ereta" },
  { nome: "Alongamento", descricao: "Alongar membros e lombar" }
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

// A função viewTreinos agora está definida no app.js
// Esta linha garante que a biblioteca e treinos sejam globais
window.biblioteca = biblioteca;
window.treinos = treinos;
window.getExercicio = getExercicio;
