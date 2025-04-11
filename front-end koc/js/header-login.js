document.addEventListener('DOMContentLoaded', function() {
  // Debug inicial
  console.log('Iniciando o script de header-login.js');
  console.log('Script de login iniciado');

  // Elementos principais
  const loginModal = document.getElementById('login-modal');
  const modalContent = document.querySelector('.modal-content');

  if (!loginModal || !modalContent) {
    console.error('Login modal or modal content not found in the DOM.');
    return;
  }

  // 1. Função para abrir o modal
  const openLoginModal = (e) => {
    if (e) e.preventDefault();
    loginModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    // Mostrar aba de login por padrão
    document.querySelector('.login-tab').style.display = 'block';
    document.querySelector('.register-tab').style.display = 'none';
  };

  // 2. Função para fechar o modal
  const closeLoginModal = () => {
    loginModal.style.display = 'none';
    document.body.style.overflow = 'auto';
  };

  // 3. Função para alternar entre abas
  const switchTab = (tabId) => {
    if (tabId === 'login') {
      document.querySelector('.login-tab').style.display = 'block';
      document.querySelector('.register-tab').style.display = 'none';
    } else {
      document.querySelector('.login-tab').style.display = 'none';
      document.querySelector('.register-tab').style.display = 'block';
    }
  };

  // Event Listeners

  // Abrir modal ao clicar no link de login
  document.querySelectorAll('.js-login-trigger, .login-trigger').forEach(trigger => {
    trigger.addEventListener('click', openLoginModal);
  });

  // Fechar modal ao clicar no X
  document.querySelector('.close-modal').addEventListener('click', closeLoginModal);

  // Fechar modal ao clicar fora do conteúdo
  loginModal.addEventListener('click', function(e) {
    if (!modalContent.contains(e.target)) {
      closeLoginModal();
    }
  });

  // Alternar entre abas
  document.querySelectorAll('.js-switch-tab, .switch-tab').forEach(tab => {
    tab.addEventListener('click', function(e) {
      e.preventDefault();
      const target = this.getAttribute('href').substring(1);
      switchTab(target);
    });
  });
});
