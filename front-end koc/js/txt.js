document.querySelector('.ler-mais-btn').addEventListener('click', function() {
    const textoCompleto = document.querySelector('.texto-completo');
    const botao = this;
    
    if (textoCompleto.style.display === 'none' || !textoCompleto.style.display) {
      textoCompleto.style.display = 'inline';
      botao.textContent = 'Ler menos';
    } else {
      textoCompleto.style.display = 'none';
      botao.textContent = 'Ler mais';
    }
  });
  
  