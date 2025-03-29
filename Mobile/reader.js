document.addEventListener('DOMContentLoaded', function() {
    // Elementos
    const bookContent = document.getElementById('book-content');
    const fontSizeDisplay = document.getElementById('font-size');
    const decreaseBtn = document.getElementById('font-decrease');
    const increaseBtn = document.getElementById('font-increase');
    const themeButtons = document.querySelectorAll('.theme-btn');
    const widthButtons = document.querySelectorAll('.width-btn');
    const prevChapterBtn = document.getElementById('prev-chapter');
    const nextChapterBtn = document.getElementById('next-chapter');
    
    // Tamanho da fonte
    let currentFontSize = 16;
    
    decreaseBtn.addEventListener('click', function() {
      if (currentFontSize > 14) {
        currentFontSize -= 1;
        updateFontSize();
      }
    });
    
    increaseBtn.addEventListener('click', function() {
      if (currentFontSize < 22) {
        currentFontSize += 1;
        updateFontSize();
      }
    });
    
    function updateFontSize() {
      bookContent.style.fontSize = `${currentFontSize}px`;
      fontSizeDisplay.textContent = `${currentFontSize}px`;
    }
    
    // Temas
    themeButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Remove todas as classes de tema
        document.body.classList.remove('dark-mode', 'sepia-mode');
        bookContent.style.color = ''; // Reseta a cor do texto
        
        // Adiciona a classe correspondente
        if (this.id === 'dark-mode') {
          document.body.classList.add('dark-mode');
          bookContent.style.color = '#ffffff'; // Texto branco no modo escuro
        } else if (this.id === 'sepia-mode') {
          document.body.classList.add('sepia-mode');
          bookContent.style.color = '#000000'; // Texto preto no modo sépia
        }
        
        // Atualiza botões ativos
        themeButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
      });
    });
    
    // Largura
    widthButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Remove todas as classes de largura
        document.body.classList.remove('narrow-width', 'wide-width');
        
        // Adiciona a classe correspondente
        if (this.id === 'narrow') {
          document.body.classList.add('narrow-width');
        } else if (this.id === 'wide') {
          document.body.classList.add('wide-width');
        }
        
        // Atualiza botões ativos
        widthButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
      });
    });
    
    // Navegação (simplificado)
    prevChapterBtn.addEventListener('click', function() {
      console.log('Carregar capítulo anterior');
      // Implemente a lógica de carregamento aqui
    });
    
    nextChapterBtn.addEventListener('click', function() {
      console.log('Carregar próximo capítulo');
      // Implemente a lógica de carregamento aqui
    });
});