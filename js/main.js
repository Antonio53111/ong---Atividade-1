// js/main.js - Módulo Principal (Atualizado para Entrega 3)
import { Navigation } from './components/header.js';
import { Animations } from './animations.js';
import { FeedbackSystem } from './feedback.js';

// Inicialização quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar sistemas independentes
    const navigation = new Navigation();
    const animations = new Animations();
    const feedback = new FeedbackSystem();

    // Log de inicialização
    console.log('🚀 ONG Connect - Sistema SPA carregado com sucesso!');
    
    // Verificar se é uma SPA ou página tradicional
    if (window.app) {
        console.log('📱 Modo SPA ativado');
    } else {
        console.log('🌐 Modo tradicional ativado');
        // Inicializar componentes específicos de página
        initPageSpecificFeatures();
    }
});

function initPageSpecificFeatures() {
    // Inicializar features que não dependem da SPA
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    switch (currentPage) {
        case 'index.html':
        case '':
            initHomePage();
            break;
        case 'projetos.html':
            initProjetosPage();
            break;
        case 'voluntarios.html':
            initVoluntariosPage();
            break;
        case 'contato.html':
            initContatoPage();
            break;
        case 'login.html':
            initLoginPage();
            break;
    }
}

function initHomePage() {
    // Features específicas da home
    console.log('🏠 Inicializando página home...');
}

function initProjetosPage() {
    // Features específicas de projetos
    console.log('🚀 Inicializando página projetos...');
}

function initVoluntariosPage() {
    // Features específicas de voluntários
    console.log('👥 Inicializando página voluntários...');
}

function initContatoPage() {
    // Features específicas de contato
    console.log('📞 Inicializando página contato...');
}

function initLoginPage() {
    // Features específicas de login
    console.log('🔐 Inicializando página login...');
}