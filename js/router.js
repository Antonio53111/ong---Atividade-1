// js/router.js - Sistema de Roteamento
class Router {
    constructor() {
        this.routes = {
            'home': 'home',
            'sobre': 'sobre', 
            'projetos': 'projetos',
            'voluntarios': 'voluntarios',
            'contato': 'contato',
            'login': 'login',
            '404': '404'
        };
    }

    resolve(route) {
        return this.routes[route] || this.routes['404'];
    }

    getCurrentRoute() {
        return window.location.hash.replace('#', '') || 'home';
    }

    navigate(route) {
        if (this.routes[route]) {
            window.location.hash = route;
            return true;
        }
        return false;
    }
}