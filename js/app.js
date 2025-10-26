// js/app.js - Single Page Application Core
class SPA {
    constructor() {
        this.currentPage = 'home';
        this.router = new Router();
        this.templates = new Templates();
        this.init();
    }

    init() {
        this.setupNavigation();
        this.loadInitialPage();
        this.setupGlobalEvents();
    }

    setupNavigation() {
        // Interceptar clicks em links
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-link]') || e.target.closest('[data-link]')) {
                e.preventDefault();
                const link = e.target.closest('[data-link]');
                const page = link.getAttribute('href').replace('#', '') || 'home';
                this.navigateTo(page);
            }
        });

        // Navegação pelo browser (back/forward)
        window.addEventListener('popstate', (e) => {
            const page = window.location.hash.replace('#', '') || 'home';
            this.loadPage(page);
        });
    }

    navigateTo(page) {
        // Atualizar URL sem recarregar a página
        window.history.pushState({}, '', `#${page}`);
        this.loadPage(page);
    }

    async loadPage(page) {
        try {
            // Mostrar loading
            this.showLoading();

            // Carregar template da página
            const template = await this.templates.getTemplate(page);
            
            // Atualizar conteúdo principal
            this.updateMainContent(template);
            
            // Atualizar estado atual
            this.currentPage = page;
            
            // Executar scripts específicos da página
            this.executePageScripts(page);
            
            // Rolar para o topo
            window.scrollTo(0, 0);
            
            // Esconder loading
            this.hideLoading();

        } catch (error) {
            console.error('Erro ao carregar página:', error);
            this.loadPage('404'); // Página de erro
        }
    }

    updateMainContent(html) {
        const main = document.querySelector('main');
        if (main) {
            main.innerHTML = html;
        }
    }

    executePageScripts(page) {
        // Executar scripts específicos de cada página
        switch (page) {
            case 'home':
                this.initHomePage();
                break;
            case 'projetos':
                this.initProjetosPage();
                break;
            case 'voluntarios':
                this.initVoluntariosPage();
                break;
            case 'contato':
                this.initContatoPage();
                break;
            case 'login':
                this.initLoginPage();
                break;
        }
    }

    initHomePage() {
        // Inicializar componentes da home
        new Animations().setupScrollAnimations();
        this.initProjectFilters();
    }

    initProjetosPage() {
        // Filtros de projetos
        this.initProjectFilters();
        new ProjectManager().loadProjects();
    }

    initVoluntariosPage() {
        // Formulário de voluntários
        new FormValidator().setupVolunteerForm();
    }

    initContatoPage() {
        // Formulário de contato
        new FormValidator().setupContactForm();
        this.initFAQ();
    }

    initLoginPage() {
        // Formulário de login
        new FormValidator().setupLoginForm();
    }

    initProjectFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                this.filterProjects(filter);
            });
        });
    }

    filterProjects(filter) {
        const projects = document.querySelectorAll('.project-card');
        projects.forEach(project => {
            if (filter === 'all' || project.dataset.category.includes(filter)) {
                project.style.display = 'block';
            } else {
                project.style.display = 'none';
            }
        });
    }

    initFAQ() {
        const faqItems = document.querySelectorAll('.faq-question');
        faqItems.forEach(item => {
            item.addEventListener('click', () => {
                const answer = item.nextElementSibling;
                answer.classList.toggle('active');
            });
        });
    }

    showLoading() {
        // Criar ou mostrar elemento de loading
        let loader = document.getElementById('global-loader');
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'global-loader';
            loader.innerHTML = `
                <div class="loading-spinner">
                    <div class="spinner"></div>
                    <p>Carregando...</p>
                </div>
            `;
            document.body.appendChild(loader);
        }
        loader.style.display = 'flex';
    }

    hideLoading() {
        const loader = document.getElementById('global-loader');
        if (loader) {
            loader.style.display = 'none';
        }
    }

    loadInitialPage() {
        const initialPage = window.location.hash.replace('#', '') || 'home';
        this.loadPage(initialPage);
    }

    setupGlobalEvents() {
        // Eventos globais da aplicação
        document.addEventListener('submit', (e) => {
            if (e.target.matches('form')) {
                e.preventDefault();
                this.handleFormSubmit(e.target);
            }
        });
    }

    async handleFormSubmit(form) {
        const validator = new FormValidator();
        if (await validator.validateForm(form)) {
            this.submitForm(form);
        }
    }

    async submitForm(form) {
        // Simular envio de formulário
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Mostrar feedback
        const feedback = new FeedbackSystem();
        feedback.showToast('Formulário enviado com sucesso!', 'success');
        
        // Limpar formulário
        form.reset();
    }
}

// Inicializar SPA quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.app = new SPA();
});