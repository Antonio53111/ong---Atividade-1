class Accessibility {
    constructor() {
        this.init();
    }

    init() {
        this.setupSkipLinks();
        this.setupKeyboardNavigation();
        this.setupAriaLiveRegions();
        this.setupFocusTrapping();
        this.setupHighContrastToggle();
        this.setupFontSizeControls();
    }

    setupSkipLinks() {
        // Adicionar skip link se não existir
        if (!document.querySelector('.skip-link')) {
            const skipLink = document.createElement('a');
            skipLink.href = '#main-content';
            skipLink.className = 'skip-link';
            skipLink.textContent = 'Pular para conteúdo principal';
            document.body.prepend(skipLink);
        }

        // Adicionar ID ao main se não existir
        const main = document.querySelector('main');
        if (main && !main.id) {
            main.id = 'main-content';
        }
    }

    setupKeyboardNavigation() {
        // Navegação por teclado em dropdowns
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllDropdowns();
            }

            if (e.key === 'Tab') {
                this.handleTabNavigation(e);
            }
        });

        // Navegação em menus com arrow keys
        this.setupMenuKeyboardNavigation();
    }

    setupMenuKeyboardNavigation() {
        const menuItems = document.querySelectorAll('.nav-item');
        
        menuItems.forEach((item, index) => {
            item.addEventListener('keydown', (e) => {
                switch(e.key) {
                    case 'ArrowDown':
                    case 'ArrowRight':
                        e.preventDefault();
                        const nextItem = menuItems[index + 1] || menuItems[0];
                        nextItem.querySelector('a').focus();
                        break;
                    case 'ArrowUp':
                    case 'ArrowLeft':
                        e.preventDefault();
                        const prevItem = menuItems[index - 1] || menuItems[menuItems.length - 1];
                        prevItem.querySelector('a').focus();
                        break;
                    case 'Enter':
                    case ' ':
                        e.preventDefault();
                        item.querySelector('a').click();
                        break;
                }
            });
        });
    }

    closeAllDropdowns() {
        document.querySelectorAll('.dropdown-menu').forEach(dropdown => {
            dropdown.style.display = 'none';
        });
    }

    handleTabNavigation(e) {
        const focusableElements = this.getFocusableElements();
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }

    getFocusableElements() {
        return document.querySelectorAll(`
            a[href], 
            button:not([disabled]), 
            input:not([disabled]), 
            select:not([disabled]), 
            textarea:not([disabled]), 
            [tabindex]:not([tabindex="-1"])
        `);
    }

    setupAriaLiveRegions() {
        // Criar regiões ARIA live para feedback dinâmico
        if (!document.getElementById('aria-live-region')) {
            const liveRegion = document.createElement('div');
            liveRegion.id = 'aria-live-region';
            liveRegion.className = 'aria-live';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            document.body.appendChild(liveRegion);
        }
    }

    announceToScreenReader(message) {
        const liveRegion = document.getElementById('aria-live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
            
            // Limpar após anunciar
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }

    setupFocusTrapping() {
        // Trap focus em modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && document.querySelector('.modal.show')) {
                this.trapFocusInModal(e);
            }
        });
    }

    trapFocusInModal(e) {
        const modal = document.querySelector('.modal.show');
        if (!modal) return;

        const focusableElements = modal.querySelectorAll(this.getFocusableElements());
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }

    setupHighContrastToggle() {
        // Criar botão de alto contraste se não existir
        if (!document.getElementById('contrast-toggle')) {
            const contrastToggle = document.createElement('button');
            contrastToggle.id = 'contrast-toggle';
            contrastToggle.className = 'btn btn-ghost btn-sm';
            contrastToggle.innerHTML = '🌗 Alto Contraste';
            contrastToggle.setAttribute('aria-pressed', 'false');
            
            contrastToggle.addEventListener('click', () => {
                const isPressed = contrastToggle.getAttribute('aria-pressed') === 'true';
                this.toggleHighContrast(!isPressed);
                contrastToggle.setAttribute('aria-pressed', (!isPressed).toString());
            });

            // Adicionar ao header
            const header = document.querySelector('header');
            if (header) {
                header.appendChild(contrastToggle);
            }
        }
    }

    toggleHighContrast(enable) {
        if (enable) {
            document.documentElement.classList.add('contrast-enhanced');
            this.announceToScreenReader('Modo de alto contraste ativado');
        } else {
            document.documentElement.classList.remove('contrast-enhanced');
            this.announceToScreenReader('Modo de alto contraste desativado');
        }
    }

    setupFontSizeControls() {
        // Criar controles de tamanho de fonte
        const fontSizeControls = document.createElement('div');
        fontSizeControls.className = 'font-size-controls';
        fontSizeControls.innerHTML = `
            <button class="btn btn-ghost btn-sm" id="font-decrease" aria-label="Diminuir tamanho da fonte">A-</button>
            <button class="btn btn-ghost btn-sm" id="font-reset" aria-label="Tamanho normal da fonte">A</button>
            <button class="btn btn-ghost btn-sm" id="font-increase" aria-label="Aumentar tamanho da fonte">A+</button>
        `;

        // Adicionar eventos
        document.getElementById('font-decrease')?.addEventListener('click', () => this.adjustFontSize(-1));
        document.getElementById('font-reset')?.addEventListener('click', () => this.resetFontSize());
        document.getElementById('font-increase')?.addEventListener('click', () => this.adjustFontSize(1));

        // Adicionar ao header
        const header = document.querySelector('header');
        if (header) {
            header.appendChild(fontSizeControls);
        }
    }

    adjustFontSize(direction) {
        const html = document.documentElement;
        const currentSize = parseFloat(getComputedStyle(html).fontSize);
        const newSize = currentSize + (direction * 2);
        
        html.style.fontSize = `${newSize}px`;
        
        const message = direction > 0 ? 'Tamanho da fonte aumentado' : 'Tamanho da fonte diminuído';
        this.announceToScreenReader(message);
    }

    resetFontSize() {
        document.documentElement.style.fontSize = '';
        this.announceToScreenReader('Tamanho da fonte resetado para padrão');
    }
}

// Inicializar acessibilidade
document.addEventListener('DOMContentLoaded', () => {
    window.accessibility = new Accessibility();
});