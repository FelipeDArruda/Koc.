// Garante que o menu e conteúdo estejam sincronizados no carregamento
document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');
    
    // Sincroniza o estado inicial
    if (sidebar.classList.contains('expanded')) {
        mainContent.style.marginLeft = '250px';
        mainContent.style.width = 'calc(100% - 250px)';
    } else {
        mainContent.style.marginLeft = '80px';
        mainContent.style.width = 'calc(100% - 80px)';
    }

    // Carrega a página inicial
    loadInitialPage();
});

// Estado da aplicação
let books = [];
let currentBookId = null;
let bookChart = null; // Referência global para o gráfico

// Funções de Navegação
function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');
    
    sidebar.classList.toggle('expanded');
    
    // Atualiza dinamicamente o margin-left
    if (sidebar.classList.contains('expanded')) {
        mainContent.style.marginLeft = '250px';
        mainContent.style.width = 'calc(100% - 250px)';
    } else {
        mainContent.style.marginLeft = '80px';
        mainContent.style.width = 'calc(100% - 80px)';
    }
}

function loadPage(page) {
    const template = document.getElementById(`${page}-template`);
    if (!template) return;
    
    const clone = template.cloneNode(true);
    clone.style.display = 'block';
    
    const mainContent = document.getElementById('content');
    mainContent.innerHTML = '';
    mainContent.appendChild(clone);
    
    // Inicializa a página específica
    switch(page) {
        case 'home':
            initDashboard();
            break;
        case 'catalog':
            initCatalogPage();
            break;
        case 'add-book':
            initAddBookPage();
            break;
    }
}

// Dashboard
function initDashboard() {
    updateStats();
    initChart();
    setupEventListeners();
}

function updateStats() {
    document.getElementById('total-books').textContent = books.length.toLocaleString();
    const totalChapters = books.reduce((sum, book) => sum + book.chapters.length, 0);
    document.getElementById('total-chapters').textContent = totalChapters.toLocaleString();
}

function initChart() {
    const ctx = document.getElementById('monthly-chart');
    if (!ctx) return;

    // Destrói gráfico existente
    if (bookChart) {
        bookChart.destroy();
    }

    // Cria gradiente para o preenchimento
    const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, ctx.offsetHeight);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.4)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');

    bookChart = new Chart(ctx, {
        type: 'line',
        data: getChartData(),
        options: getChartOptions()
    });
}

function getChartData() {
    return {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        datasets: [{
            label: 'Visualizações',
            data: generateRandomData(1000, 5000, 12),
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 3,
            tension: 0.4,
            fill: true,
            pointBackgroundColor: 'white',
            pointBorderColor: 'rgba(59, 130, 246, 1)',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 8
        }]
    };
}

function getChartOptions() {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(30, 30, 30, 0.95)',
                titleColor: 'white',
                bodyColor: 'white',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
                displayColors: false,
                callbacks: {
                    label: function(context) {
                        return `Visualizações: ${context.raw.toLocaleString()}`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: false,
                grid: { 
                    color: 'rgba(255, 255, 255, 0.1)',
                    drawBorder: false
                },
                ticks: { 
                    color: 'rgba(255, 255, 255, 0.7)',
                    callback: function(value) {
                        return value.toLocaleString();
                    }
                }
            },
            x: {
                grid: { 
                    color: 'rgba(255, 255, 255, 0.1)',
                    drawBorder: false
                },
                ticks: { 
                    color: 'rgba(255, 255, 255, 0.7)',
                    maxRotation: 0
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index'
        }
    };
}

function generateRandomData(min, max, count) {
    return Array.from({length: count}, () => 
        Math.floor(Math.random() * (max - min + 1)) + min
    );
}

// Catálogo
function initCatalogPage() {
    renderBooks();
    setupEventListeners();
}

function renderBooks() {
    const container = document.getElementById('books-container');
    if (!container) return;

    if (books.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>Nenhum livro cadastrado ainda.</p>
                <button class="btn btn-primary" onclick="showAddBookForm()">
                    Adicionar Primeiro Livro
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = books.map(book => `
        <div class="book-card" data-id="${book.id}">
            <div class="book-cover">
                <img src="${book.cover}" alt="Capa de ${book.title}" onerror="this.src='https://via.placeholder.com/150x200?text=Capa+Não+Disponível'">
            </div>
            <div class="book-details">
                <h3>${book.title}</h3>
                <p class="author">${book.author}</p>
                <p class="synopsis">${book.synopsis}</p>
                <div class="book-footer">
                    <span class="chapters-count">${book.chapters.length} capítulos</span>
                    <button class="btn btn-secondary" onclick="editBook(${book.id})">
                        Editar
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Formulário de Livro
function initAddBookPage() {
    if (!currentBookId) {
        initializeNewBookForm();
    }
    setupFormListeners();
    setupValidation();
}

function initializeNewBookForm() {
    const chaptersList = document.getElementById('chapters-list');
    if (chaptersList && chaptersList.children.length === 0) {
        for (let i = 0; i < 5; i++) {
            addChapterField();
        }
    }
}

function setupFormListeners() {
    const form = document.getElementById('book-form');
    const coverInput = document.getElementById('book-cover');
    const coverPreview = document.getElementById('cover-preview');

    if (coverInput && coverPreview) {
        coverInput.addEventListener('input', () => {
            updateCoverPreview(coverInput.value, coverPreview);
        });
    }

    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
}

function updateCoverPreview(url, previewElement) {
    if (url) {
        previewElement.innerHTML = `
            <img src="${url}" alt="Preview da capa" 
                 onerror="this.parentElement.innerHTML='<span>Imagem inválida</span>'">
        `;
    } else {
        previewElement.innerHTML = '<span>Preview da capa</span>';
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    saveBook();
}

function setupValidation() {
    const synopsisField = document.getElementById('book-synopsis');
    if (synopsisField) {
        synopsisField.addEventListener('input', updateSynopsisCounter);
    }

    const coverField = document.getElementById('book-cover');
    if (coverField) {
        coverField.addEventListener('blur', validateCoverUrl);
    }
}

function updateSynopsisCounter() {
    const counter = document.getElementById('synopsis-counter');
    if (counter) {
        counter.textContent = this.value.length;
    }
}

function validateCoverUrl() {
    if (this.value && !this.value.match(/\.(jpg|jpeg|png|webp|gif)$/i)) {
        this.classList.add('invalid');
    } else {
        this.classList.remove('invalid');
    }
}

// Funções auxiliares
function loadInitialPage() {
    loadSampleData();
    loadPage('catalog');
}

function loadSampleData() {
    if (books.length === 0) {
        books = [
            {
                id: 1,
                title: "Knight of Cydonia",
                author: "Glauber",
                cover: "https://illusia.com.br/wp-content/uploads/2019/03/Koc-Illusia-webp.webp",
                synopsis: "Uma jornada épica através de mundos desconhecidos e perigosos.",
                chapters: [
                    { title: "O Começo", content: "..." },
                    { title: "O Desafio", content: "..." },
                    { title: "A Jornada", content: "..." },
                    { title: "O Confronto", content: "..." },
                    { title: "O Destino", content: "..." }
                ]
            }
        ];
    }
}

// Funções de CRUD
function showAddBookForm() {
    currentBookId = null;
    loadPage('add-book');
}

function editBook(bookId) {
    currentBookId = bookId;
    loadPage('add-book');
    const book = books.find(b => b.id === bookId);
    if (book) {
        populateBookForm(book);
    }
}

function populateBookForm(book) {
    document.getElementById('book-title').value = book.title;
    document.getElementById('book-author').value = book.author;
    document.getElementById('book-cover').value = book.cover;
    document.getElementById('book-synopsis').value = book.synopsis;

    updateCoverPreview(book.cover, document.getElementById('cover-preview'));
    renderChapters(book.chapters);
}

function renderChapters(chapters) {
    const container = document.getElementById('chapters-list');
    if (!container) return;

    container.innerHTML = chapters.map((chapter, index) => `
        <div class="chapter-item">
            <div class="chapter-header">
                <h3>Capítulo ${index + 1}</h3>
                <button type="button" class="btn btn-danger btn-sm" onclick="removeChapter(this)">
                    Remover
                </button>
            </div>
            <input type="text" class="chapter-title" 
                   placeholder="Título do capítulo" 
                   value="${chapter.title}" required>
            <textarea class="chapter-content" 
                      placeholder="Conteúdo do capítulo..." 
                      rows="3" required>${chapter.content}</textarea>
        </div>
    `).join('');
}

function addChapterField() {
    const container = document.getElementById('chapters-list');
    if (!container) return;

    const chapterCount = container.children.length + 1;
    const chapterItem = document.createElement('div');
    chapterItem.className = 'chapter-item';
    chapterItem.innerHTML = `
        <div class="chapter-header">
            <h3>Capítulo ${chapterCount}</h3>
            <button type="button" class="btn btn-danger btn-sm" onclick="removeChapter(this)">
                Remover
            </button>
        </div>
        <input type="text" class="chapter-title" placeholder="Título do capítulo" required>
        <textarea class="chapter-content" placeholder="Conteúdo do capítulo..." rows="3" required></textarea>
    `;
    container.appendChild(chapterItem);
}

function removeChapter(button) {
    const container = document.getElementById('chapters-list');
    if (!container || container.children.length <= 5) {
        alert('O livro deve ter no mínimo 5 capítulos!');
        return;
    }

    button.closest('.chapter-item').remove();
    updateChapterNumbers();
}

function updateChapterNumbers() {
    const container = document.getElementById('chapters-list');
    if (!container) return;

    Array.from(container.children).forEach((item, index) => {
        item.querySelector('h3').textContent = `Capítulo ${index + 1}`;
    });
}

function saveBook() {
    const formData = getFormData();
    
    if (!validateForm(formData)) {
        return;
    }

    if (currentBookId) {
        updateBook(formData);
    } else {
        createBook(formData);
    }

    loadPage('catalog');
}

function getFormData() {
    return {
        title: document.getElementById('book-title').value.trim(),
        author: document.getElementById('book-author').value.trim(),
        cover: document.getElementById('book-cover').value.trim(),
        synopsis: document.getElementById('book-synopsis').value.trim(),
        chapters: getChaptersData()
    };
}

function getChaptersData() {
    return Array.from(document.querySelectorAll('.chapter-item')).map(item => ({
        title: item.querySelector('.chapter-title').value.trim(),
        content: item.querySelector('.chapter-content').value.trim()
    }));
}

function validateForm(data) {
    if (!data.title || !data.author || !data.cover || !data.synopsis || data.chapters.length < 5) {
        alert('Preencha todos os campos obrigatórios e adicione pelo menos 5 capítulos!');
        return false;
    }
    return true;
}

function createBook(data) {
    books.push({
        id: Date.now(),
        ...data
    });
}

function updateBook(data) {
    const index = books.findIndex(b => b.id === currentBookId);
    if (index !== -1) {
        books[index] = { ...books[index], ...data };
    }
}

// Inicialização
function setupEventListeners() {
    // Contador de caracteres para sinopse
    const synopsisField = document.getElementById('book-synopsis');
    if (synopsisField) {
        synopsisField.addEventListener('input', function() {
            const counter = document.getElementById('synopsis-counter');
            if (counter) {
                counter.textContent = this.value.length;
                counter.classList.toggle('warning', this.value.length > 450);
            }
        });
    }
}

function initChart() {
    const canvas = document.getElementById('monthly-chart');
    
    if (!canvas || !canvas.getContext) {
        console.error("Elemento canvas não encontrado ou inválido");
        return;
    }

    // Destrói gráfico existente
    if (window.bookChart) {
        window.bookChart.destroy();
    }

    const ctx = canvas.getContext('2d');
    
    // Cria gradiente
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.4)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');

    window.bookChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            datasets: [{
                label: 'Visualizações',
                data: [1200, 1900, 1500, 2000, 2200, 2500, 2800, 2600, 3000, 3500, 4000, 4200],
                backgroundColor: gradient,
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: 'white'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            }
        }
    });
}

// script.js - Sistema principal da aplicação

/**
 * Inicialização da aplicação
 */
document.addEventListener('DOMContentLoaded', function() {
    // Verifica autenticação
    const auth = checkAuth();
    if (!auth) {
        window.location.href = 'login.html';
        return;
    }
    
    // Configura o sistema
    initApplication();
});

/**
 * Verifica a autenticação do usuário
 */
function checkAuth() {
    try {
        const authData = localStorage.getItem('kocarr_auth');
        if (!authData) return null;
        
        const auth = JSON.parse(authData);
        return auth.isAuthenticated ? auth : null;
    } catch (e) {
        console.error('Erro ao verificar autenticação:', e);
        return null;
    }
}

/**
 * Inicializa a aplicação
 */
function initApplication() {
    // Carrega os dados iniciais
    loadInitialData();
    
    // Configura o menu lateral
    setupSidebar();
    
    // Carrega a página inicial
    loadPage('home');
    
    // Mostra o nome do usuário (opcional)
    displayUserInfo();
}

/**
 * Carrega dados iniciais
 */
function loadInitialData() {
    // Verifica se já existem livros cadastrados
    if (!localStorage.getItem('kocarr_books')) {
        // Dados iniciais de exemplo
        const sampleBooks = [
            {
                id: 1,
                title: "Knight of Cydonia",
                author: "Glauber",
                cover: "https://example.com/capa.jpg",
                synopsis: "Uma jornada épica através do universo",
                chapters: [
                    { id: 1, title: "O Começo", content: "..." },
                    { id: 2, title: "O Desafio", content: "..." }
                ]
            }
        ];
        
        localStorage.setItem('kocarr_books', JSON.stringify(sampleBooks));
    }
}

/**
 * Configura o menu lateral
 */
function setupSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.querySelector('.menu-toggle');
    
    // Toggle do menu
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            sidebar.classList.toggle('expanded');
            updateMainContentMargin();
        });
    }
    
    // Adiciona botão de logout
    addLogoutButton();
}

/**
 * Atualiza a margem do conteúdo principal
 */
function updateMainContentMargin() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (sidebar.classList.contains('expanded')) {
        mainContent.style.marginLeft = '250px';
    } else {
        mainContent.style.marginLeft = '80px';
    }
}

/**
 * Adiciona botão de logout no menu
 */
function addLogoutButton() {
    const menuList = document.querySelector('.sidebar ul');
    
    if (menuList && !document.getElementById('logoutMenuItem')) {
        const logoutItem = document.createElement('li');
        logoutItem.id = 'logoutMenuItem';
        logoutItem.innerHTML = `
            <span class="icon">🚪</span>
            <span class="text">Sair</span>
        `;
        logoutItem.addEventListener('click', function() {
            if (confirm('Deseja realmente sair?')) {
                localStorage.removeItem('kocarr_auth');
                window.location.href = 'login.html';
            }
        });
        
        menuList.appendChild(logoutItem);
    }
}

/**
 * Mostra informações do usuário
 */
function displayUserInfo() {
    const auth = checkAuth();
    if (auth) {
        console.log(`Usuário autenticado: ${auth.username}`);
        // Pode adicionar exibição no UI se desejar
    }
}

/**
 * Carrega uma página específica
 */
function loadPage(page) {
    const template = document.getElementById(`${page}-template`);
    if (!template) return;
    
    const mainContent = document.getElementById('content');
    if (!mainContent) return;
    
    const clone = template.cloneNode(true);
    clone.style.display = 'block';
    mainContent.innerHTML = '';
    mainContent.appendChild(clone);
    
    // Inicializa a página específica
    switch(page) {
        case 'home':
            initDashboard();
            break;
        case 'catalog':
            initCatalogPage();
            break;
        case 'add-book':
            initAddBookPage();
            break;
    }
}

// ... (continue com todas as suas funções existentes de CRUD de livros e capítulos)

// Inicializa a aplicação
if (document.readyState !== 'loading') {
    initApplication();
} else {
    document.addEventListener('DOMContentLoaded', initApplication);
}