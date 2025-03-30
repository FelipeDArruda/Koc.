// auth.js - Sistema completo de autenticação

/**
 * Verifica se o usuário está autenticado
 */
function checkAuth() {
    const authData = localStorage.getItem('kocarr_auth');
    if (!authData && !window.location.pathname.endsWith('login.html')) {
        redirectToLogin();
    }
    return authData ? JSON.parse(authData) : null;
}

/**
 * Manipula o envio do formulário de login
 */
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    
    // Validação (em produção, substitua por chamada a API)
    if (authenticateUser(username, password)) {
        // Salva os dados de autenticação
        const authData = {
            isAuthenticated: true,
            username: username,
            lastLogin: new Date().toISOString(),
            token: generateToken()
        };
        
        localStorage.setItem('kocarr_auth', JSON.stringify(authData));
        
        // Redireciona para a página principal
        window.location.href = 'index.html';
    } else {
        showLoginError();
    }
}

/**
 * Autenticação do usuário (simulada)
 */
function authenticateUser(username, password) {
    // Em produção, substitua por uma chamada AJAX/API real
    const validUsers = {
        'admin': 'admin123',
        'editor': 'editor123'
    };
    
    return validUsers[username] === password;
}

/**
 * Gera um token simples (em produção use JWT)
 */
function generateToken() {
    return 'tok_' + Math.random().toString(36).substr(2, 16);
}

/**
 * Mostra erro de login
 */
function showLoginError() {
    const errorElement = document.getElementById('loginError');
    if (errorElement) {
        errorElement.textContent = 'Credenciais inválidas!';
        errorElement.style.display = 'block';
    }
    
    document.getElementById('password').value = '';
    document.getElementById('password').focus();
}

/**
 * Redireciona para a página de login
 */
function redirectToLogin() {
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage !== 'login.html') {
        window.location.href = 'login.html';
    }
}

/**
 * Realiza logout
 */
function handleLogout() {
    localStorage.removeItem('kocarr_auth');
    redirectToLogin();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Configura o formulário de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Configura o botão de logout (se existir)
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
});

// Exporta funções para uso em outros arquivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { checkAuth, handleLogout };
}

