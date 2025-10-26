// js/templates.js - Sistema de Templates
class Templates {
    constructor() {
        this.templates = {};
        this.loadTemplates();
    }

    loadTemplates() {
        // Templates inline para demonstração
        // Em produção, esses templates viriam de arquivos separados ou API
        this.templates = {
            'home': this.getHomeTemplate(),
            'sobre': this.getSobreTemplate(),
            'projetos': this.getProjetosTemplate(),
            'voluntarios': this.getVoluntariosTemplate(),
            'contato': this.getContatoTemplate(),
            'login': this.getLoginTemplate(),
            '404': this.get404Template()
        };
    }

    async getTemplate(name) {
        if (this.templates[name]) {
            return this.templates[name];
        }
        
        // Tentar carregar template externo
        try {
            const response = await fetch(`templates/${name}.html`);
            if (response.ok) {
                return await response.text();
            }
        } catch (error) {
            console.warn(`Template ${name} não encontrado, usando fallback`);
        }
        
        return this.get404Template();
    }

    getHomeTemplate() {
        return `
            <section class="hero">
                <div class="container">
                    <div class="hero-content">
                        <h1 class="hero-title">Conectando ONGs a Recursos e Voluntários</h1>
                        <p class="hero-subtitle">Uma plataforma completa para organizações não governamentais</p>
                        <div class="hero-buttons">
                            <a href="#login" class="btn btn-primary btn-lg" data-link>🚀 Acessar Plataforma</a>
                            <a href="#sobre" class="btn btn-outline btn-lg" data-link>📖 Saiba Mais</a>
                        </div>
                    </div>
                </div>
            </section>

            <section class="features">
                <div class="container">
                    <div class="section-header">
                        <h2 class="section-title">Como Nossa Plataforma Ajuda Sua ONG</h2>
                    </div>
                    <div class="features-grid grid" id="features-container">
                        <!-- Features serão carregadas via JavaScript -->
                    </div>
                </div>
            </section>
        `;
    }

    getSobreTemplate() {
        return `
            <section class="page-header">
                <div class="container">
                    <h1>Sobre a ONG Connect</h1>
                    <p>Conheça nossa missão, visão e valores</p>
                </div>
            </section>

            <section class="about-content">
                <div class="container">
                    <div class="about-grid">
                        <div class="about-text">
                            <h2>Nossa Missão</h2>
                            <p>Facilitar a gestão de organizações não governamentais...</p>
                        </div>
                        <div class="about-image">
                            <img src="https://via.placeholder.com/500x400/2E8B57/FFFFFF?text=Equipe+ONG+Connect" alt="Nossa equipe">
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    // ... outros templates (projetos, voluntarios, contato, login)

    get404Template() {
        return `
            <section class="error-page">
                <div class="container">
                    <div class="error-content text-center">
                        <h1>404</h1>
                        <h2>Página Não Encontrada</h2>
                        <p>A página que você está procurando não existe.</p>
                        <a href="#home" class="btn btn-primary" data-link>Voltar para Home</a>
                    </div>
                </div>
            </section>
        `;
    }
}