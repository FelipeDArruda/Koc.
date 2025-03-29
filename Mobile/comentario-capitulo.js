// Sistema de armazenamento e exibição de comentários
document.addEventListener('DOMContentLoaded', function() {
    const commentForm = document.getElementById('comment-form');
    const commentsList = document.getElementById('comments-list');
    
    // Carrega comentários salvos
    loadComments();
    
    // Adiciona evento de submit ao formulário
    commentForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = document.getElementById('comment-name').value;
      const text = document.getElementById('comment-text').value;
      
      if (name && text) {
        addComment(name, text);
        commentForm.reset();
      }
    });
    
    // Função para adicionar comentário
    function addComment(name, text) {
      const comment = {
        name: name,
        text: text,
        date: new Date().toLocaleString()
      };
      
      // Pega comentários existentes ou cria array vazio
      let comments = JSON.parse(localStorage.getItem('comments')) || [];
      
      // Adiciona novo comentário
      comments.push(comment);
      
      // Salva no localStorage
      localStorage.setItem('comments', JSON.stringify(comments));
      
      // Recarrega a lista de comentários
      loadComments();
    }
    
    // Função para carregar comentários
    function loadComments() {
      const comments = JSON.parse(localStorage.getItem('comments')) || [];
      commentsList.innerHTML = '';
      
      if (comments.length === 0) {
        commentsList.innerHTML = '<p>Nenhum comentário ainda. Seja o primeiro a comentar!</p>';
        return;
      }
      
      // Ordena comentários do mais recente para o mais antigo
      comments.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      // Adiciona cada comentário à lista
      comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment';
        commentElement.innerHTML = `
          <div class="comment-header">
            <span class="comment-author">${comment.name}</span>
            <span class="comment-date">${comment.date}</span>
          </div>
          <div class="comment-body">${comment.text}</div>
        `;
        commentsList.appendChild(commentElement);
      });
    }
  });