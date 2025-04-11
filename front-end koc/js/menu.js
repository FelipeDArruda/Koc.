document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.getElementById('hamburger');
  const menuItems = document.getElementById('menu-items');
  
  // Menu hamburger mobile
  hamburger.addEventListener('click', function() {
    menuItems.classList.toggle('active');
    hamburger.classList.toggle('active');
  });
  
  // Fechar menu ao clicar em um item (para mobile)
  const menuLinks = document.querySelectorAll('.menu-items a');
  menuLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (window.innerWidth <= 768) {
        menuItems.classList.remove('active');
        hamburger.classList.remove('active');
      }
    });
  });
});