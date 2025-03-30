// admin.js
function loadPage(page) {
    const contentDiv = document.getElementById('dynamic-content');
    const titleDiv = document.getElementById('page-title');

    switch (page) {
        case 'home':
            titleDiv.textContent = "📊 Dashboard";
            contentDiv.innerHTML = `
                <h3>Estatísticas</h3>
                <p>Livros cadastrados: <strong>25</strong></p>
                <p>Capítulos adicionados (este mês): <strong>12</strong></p>
            `;
            break;

        case 'catalog':
            titleDiv.textContent = "📚 Catálogo de Livros";
            contentDiv.innerHTML = `
                <div id="book-list">
                    <!-- Lista de livros será carregada aqui -->
                    <p>Carregando livros...</p>
                </div>
            `;
            loadBooks(); // Função para carregar livros via AJAX/Fetch
            break;

        case 'add-book':
            titleDiv.textContent = "➕ Adicionar Livro";
            contentDiv.innerHTML = `
                <form id="add-book-form">
                    <label for="title">Título:</label>
                    <input type="text" id="title" required><br><br>
                    
                    <label for="synopsis">Sinopse:</label><br>
                    <textarea id="synopsis" rows="5" required></textarea><br><br>
                    
                    <button type="submit" class="btn">Salvar Livro</button>
                </form>
            `;
            document.getElementById('add-book-form').addEventListener('submit', saveBook);
            break;
    }
}

// Exemplo de função para carregar livros (simulada)
function loadBooks() {
    setTimeout(() => {
        document.getElementById('book-list').innerHTML = `
            <div class="book-card">
                <h3>O Senhor dos Anéis</h3>
                <p>Uma jornada épica pela Terra-Média...</p>
                <button class="btn" onclick="viewBook(1)">Gerenciar Capítulos</button>
            </div>
        `;
    }, 500);
}

// Função para visualizar/adicionar capítulos
function viewBook(bookId) {
    loadPage('view-book'); // Página fictícia (poderia abrir um modal)
}

// Função para salvar livro (simulada)
function saveBook(e) {
    e.preventDefault();
    alert("Livro salvo com sucesso!");
    loadPage('catalog');
}

function viewBook(bookId) {
    document.getElementById('dynamic-content').innerHTML = `
        <h3>Capítulos de "O Senhor dos Anéis"</h3>
        <ul id="chapter-list">
            <li>Capítulo 1: Um Inesperado Festa</li>
            <li>Capítulo 2: O Anel Vai para o Sul</li>
        </ul>
        
        <button class="btn" onclick="addChapterForm()">➕ Novo Capítulo</button>
    `;
}

function addChapterForm() {
    document.getElementById('dynamic-content').innerHTML += `
        <form id="add-chapter-form" style="margin-top: 20px;">
            <label for="chapter-title">Título do Capítulo:</label>
            <input type="text" id="chapter-title" required><br><br>
            
            <label for="chapter-content">Conteúdo:</label><br>
            <textarea id="chapter-content" rows="10" required></textarea><br><br>
            
            <button type="submit" class="btn">Salvar Capítulo</button>
        </form>
    `;
    document.getElementById('add-chapter-form').addEventListener('submit', saveChapter);
}