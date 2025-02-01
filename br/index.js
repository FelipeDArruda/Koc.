// Aguarda o carregamento completo da página
document.addEventListener('DOMContentLoaded', () => {
  // Seleciona o ícone do hambúrguer e o menu
  const hamburger = document.getElementById('hamburger');
  const menuItems = document.getElementById('menu-items');

  // Adiciona um evento de clique ao ícone do hambúrguer
  hamburger.addEventListener('click', () => {
    // Alterna a classe 'active' no menu e no ícone do hambúrguer
    menuItems.classList.toggle('active');
    hamburger.classList.toggle('active');
  });
});


