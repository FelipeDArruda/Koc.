// Inicialização do Firebase
const auth = firebase.auth();
const db = firebase.firestore();

// Elementos da interface
const DOM = {
    loginSection: document.getElementById('admin-login'),
    adminPanel: document.getElementById('admin-panel'),
    loginBtn: document.getElementById('login-btn'),
    logoutBtn: document.getElementById('logout-btn'),
    loginMessage: document.getElementById('login-message'),
    livroForm: document.getElementById('form-livro'),
    listaLivros: document.getElementById('listaLivros'),
    chapterForm: document.querySelector('.form-container'),
    saveBtn: document.getElementById('save-btn'),
    statusMessage: document.getElementById('status-message'),
    emailInput: document.getElementById('admin-email'),
    passwordInput: document.getElementById('admin-password'),
    tituloInput: document.getElementById('titulo'),
    autorInput: document.getElementById('autor'),
    bookTitleInput: document.getElementById('book-title'),
    chapterTitleInput: document.getElementById('chapter-title'),
    chapterContentInput: document.getElementById('chapter-content')
};

// Funções auxiliares
const utils = {
    showMessage: (element, message, isError = false) => {
        element.textContent = message;
        element.style.color = isError ? 'red' : 'green';
        element.style.display = 'block';
        setTimeout(() => element.style.display = 'none', 5000);
    },
    
    resetForm: (form) => {
        if (form) form.reset();
    },
    
    toggleLoader: (button, isLoading) => {
        if (isLoading) {
            button.disabled = true;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
        } else {
            button.disabled = false;
            button.innerHTML = '<i class="fas fa-save"></i> Publicar Capítulo';
        }
    }
};

// Controle de Autenticação
const authController = {
    login: async () => {
        utils.showMessage(DOM.loginMessage, 'Autenticando...');
        
        const email = DOM.emailInput.value.trim();
        const password = DOM.passwordInput.value.trim();

        if (!email || !password) {
            utils.showMessage(DOM.loginMessage, 'Por favor, preencha todos os campos', true);
            return;
        }

        try {
            await auth.signInWithEmailAndPassword(email, password);
            utils.showMessage(DOM.loginMessage, 'Login realizado com sucesso!');
        } catch (error) {
            authController.handleLoginError(error);
        }
    },
    
    handleLoginError: (error) => {
        let errorMessage = 'Erro ao fazer login';
        
        switch (error.code) {
            case 'auth/invalid-email':
                errorMessage = 'E-mail inválido';
                break;
            case 'auth/user-disabled':
                errorMessage = 'Conta desativada';
                break;
            case 'auth/user-not-found':
                errorMessage = 'Usuário não encontrado';
                break;
            case 'auth/wrong-password':
                errorMessage = 'Senha incorreta';
                break;
            default:
                console.error('Erro no login:', error);
        }
        
        utils.showMessage(DOM.loginMessage, errorMessage, true);
        DOM.passwordInput.value = '';
    },
    
    logout: async () => {
        try {
            await auth.signOut();
            utils.showMessage(DOM.loginMessage, 'Logout realizado com sucesso!');
        } catch (error) {
            console.error('Erro no logout:', error);
            utils.showMessage(DOM.loginMessage, 'Erro ao fazer logout', true);
        }
    },
    
    initAuthListener: () => {
        auth.onAuthStateChanged(user => {
            if (user) {
                DOM.loginSection.classList.add('hidden');
                DOM.adminPanel.classList.remove('hidden');
                bookController.loadBooks();
                console.log('Usuário logado:', user.email);
            } else {
                DOM.adminPanel.classList.add('hidden');
                DOM.loginSection.classList.remove('hidden');
                console.log('Usuário não autenticado');
            }
        });
    }
};

// Gerenciamento de Capítulos
const chapterController = {
    saveChapter: async (e) => {
        e.preventDefault();
        
        const livro = DOM.bookTitleInput.value.trim();
        const capitulo = DOM.chapterTitleInput.value.trim();
        const conteudo = DOM.chapterContentInput.value.trim();

        if (!livro || !capitulo || !conteudo) {
            utils.showMessage(DOM.statusMessage, 'Preencha todos os campos', true);
            return;
        }

        try {
            utils.toggleLoader(DOM.saveBtn, true);
            
            const docRef = await db.collection('capitulos').add({
                livro,
                capitulo,
                conteudo,
                data: firebase.firestore.FieldValue.serverTimestamp(),
                publicadoPor: auth.currentUser.email,
                publicadoEm: new Date().toISOString()
            });
            
            console.log('Capítulo publicado com ID:', docRef.id);
            utils.showMessage(DOM.statusMessage, `Capítulo "${capitulo}" publicado!`);
            utils.resetForm(DOM.chapterForm);
        } catch (error) {
            console.error('Erro detalhado:', error);
            chapterController.handleSaveError(error);
        } finally {
            utils.toggleLoader(DOM.saveBtn, false);
        }
    },
    
    handleSaveError: (error) => {
        let errorMsg = 'Erro ao publicar capítulo';
        
        if (error.code) {
            errorMsg += ` (${error.code})`;
            
            switch (error.code) {
                case 'permission-denied':
                    errorMsg = 'Sem permissão. Faça login novamente.';
                    auth.signOut();
                    break;
                case 'resource-exhausted':
                    errorMsg = 'Limite de operações excedido. Tente mais tarde.';
                    break;
            }
        }
        
        utils.showMessage(DOM.statusMessage, errorMsg, true);
    }
};

// Event Listeners
DOM.loginBtn.addEventListener('click', authController.login);
DOM.logoutBtn.addEventListener('click', authController.logout);
DOM.saveBtn.addEventListener('click', chapterController.saveChapter);

// Inicialização
authController.initAuthListener();