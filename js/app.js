// js/app.js

// Função utilitária para selecionar elementos por ID
function byId(id) {
  return document.getElementById(id);
}

// Referência à view principal
const view = byId('view');

// Referência a todos os botões de aba
const tabs = document.querySelectorAll('.tab');

// Evento de clique nas abas
tabs.forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;

    // Se for a aba "medidas", abre o Google Forms em nova aba
    if (tab === 'medidas') {
      window.open(
        'https://docs.google.com/forms/d/e/1FAIpQLSfZSiubpmKwH4Cl1vtynb5FT18rUo0b9Ke27RNThrsIoKTdEQ/viewform',
        '_blank'
      );

      // Não marca essa aba como ativa nem muda a view
      return;
    }

    // Marcar aba ativa
    tabs.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Atualiza o conteúdo da view de acordo com a aba
    switch (tab) {
      case 'hoje':
        view.innerHTML = '<h2>Hoje</h2><p>Conteúdo da aba Hoje.</p>';
        break;
      case 'treinos':
        view.innerHTML = '<h2>Treinos</h2><p>Conteúdo da aba Treinos.</p>';
        break;
      case 'biblioteca':
        view.innerHTML = '<h2>Biblioteca</h2><p>Conteúdo da aba Biblioteca.</p>';
        break;
      case 'lembretes':
        view.innerHTML = '<h2>Lembretes</h2><p>Conteúdo da aba Lembretes.</p>';
        break;
      default:
        view.innerHTML = '<p>Aba não reconhecida.</p>';
    }
  });
});

// Exibe a data atual no cabeçalho
const hoje = new Date();
byId('today').textContent = hoje.toLocaleDateString('pt-BR', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});
