/**
 * lista-kok.js - Controle de interações da lista de capítulos
 * Funcionalidades:
 * - Redireciona para capítulo.html com o número do capítulo
 * - Tratamento de eventos para múltiplos elementos
 */

document.addEventListener('DOMContentLoaded', function() {
    // ========== CONFIGURAÇÕES ========== //
    const CAPITULO_PADRAO = '1'; // Capítulo padrão caso ocorra algum erro
    
    // ========== FUNÇÕES ========== //
    /**
     * Redireciona para a página do capítulo
     * @param {string} numeroCapitulo - Número do capítulo a ser carregado
     */
    function redirecionarParaCapitulo(numeroCapitulo = CAPITULO_PADRAO) {
      try {
        // Validação básica do número do capítulo
        const cap = numeroCapitulo.toString().trim();
        if (!cap || isNaN(cap)) {
          console.warn('Número de capítulo inválido, usando padrão');
          numeroCapitulo = CAPITULO_PADRAO;
        }
        
        // Redirecionamento
        window.location.href = `capitulo.html?cap=${encodeURIComponent(numeroCapitulo)}`;
        
      } catch (error) {
        console.error('Erro ao redirecionar:', error);
        window.location.href = `capitulo.html?cap=${CAPITULO_PADRAO}`;
      }
    }
  
    /**
     * Obtém o número do capítulo a partir de um elemento
     * @param {HTMLElement} elemento - Elemento DOM
     * @returns {string} - Número do capítulo
     */
    function obterNumeroCapitulo(elemento) {
      return elemento.closest('.capitulo-item')?.querySelector('.capitulo-numero')?.textContent || CAPITULO_PADRAO;
    }
  
    // ========== EVENT LISTENERS ========== //
    
    // Botão "Ler Agora" principal
    const btnLerAgora = document.querySelector('.btn-ler');
    if (btnLerAgora) {
      btnLerAgora.addEventListener('click', function(e) {
        e.preventDefault();
        redirecionarParaCapitulo(CAPITULO_PADRAO);
      });
      
      // Melhoria de UX
      btnLerAgora.style.cursor = 'pointer';
      btnLerAgora.title = 'Começar a ler desde o primeiro capítulo';
    }
  
    // Botões "Ler" dos capítulos individuais
    document.querySelectorAll('.capitulo-btn-ler').forEach(botao => {
      botao.addEventListener('click', function(e) {
        e.preventDefault();
        redirecionarParaCapitulo(obterNumeroCapitulo(this));
      });
      
      // Melhoria de UX
      botao.style.cursor = 'pointer';
      botao.title = 'Ler este capítulo';
    });
  
    // Títulos dos capítulos clicáveis (opcional)
    document.querySelectorAll('.capitulo-titulo').forEach(titulo => {
      titulo.style.cursor = 'pointer';
      titulo.addEventListener('click', function() {
        redirecionarParaCapitulo(obterNumeroCapitulo(this));
      });
      
      // Melhoria visual no hover
      titulo.addEventListener('mouseenter', () => {
        titulo.style.color = '#4a6fa5';
        titulo.style.transition = 'color 0.2s ease';
      });
      titulo.addEventListener('mouseleave', () => {
        titulo.style.color = '';
      });
    });
  
    // ========== BÔNUS: Controle de Paginação ========== //
    document.querySelectorAll('.paginacao-btn:not(:disabled)').forEach(botao => {
      botao.addEventListener('click', function() {
        // Aqui você pode adicionar lógica para carregar mais capítulos
        // antes de redirecionar, se necessário
        console.log('Lógica de paginação pode ser implementada aqui');
      });
    });
  });
  
  // ========== BÔNUS: Função para capitulo.html ========== //
  /**
   * Função para usar na página capitulo.html
   * @returns {number} - Número do capítulo atual
   */
  function obterCapituloAtual() {
    try {
      const params = new URLSearchParams(window.location.search);
      const cap = parseInt(params.get('cap')) || parseInt(CAPITULO_PADRAO);
      return Math.max(1, cap); // Garante que seja pelo menos 1
    } catch (e) {
      console.error('Erro ao obter capítulo:', e);
      return parseInt(CAPITULO_PADRAO);
    }
  }