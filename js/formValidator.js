// js/formValidator.js - Sistema de Validação Avançada
class FormValidator {
    constructor() {
        this.rules = {
            required: this.validateRequired,
            email: this.validateEmail,
            phone: this.validatePhone,
            minLength: this.validateMinLength,
            maxLength: this.validateMaxLength,
            password: this.validatePassword,
            confirmPassword: this.validateConfirmPassword
        };
    }

    async validateForm(form) {
        const fields = form.querySelectorAll('[data-validate]');
        let isValid = true;

        // Resetar erros anteriores
        this.clearAllErrors(form);

        for (const field of fields) {
            const rules = field.getAttribute('data-validate').split(' ');
            
            for (const rule of rules) {
                const [ruleName, ruleValue] = rule.split(':');
                
                if (this.rules[ruleName]) {
                    const result = await this.rules[ruleName](field, ruleValue);
                    if (!result.isValid) {
                        this.showFieldError(field, result.message);
                        isValid = false;
                        break; // Parar na primeira regra que falhar
                    }
                }
            }

            // Se passou em todas as validações, mostrar sucesso
            if (isValid) {
                this.showFieldSuccess(field);
            }
        }

        if (!isValid) {
            this.showFormError(form, 'Por favor, corrija os erros destacados antes de enviar.');
        }

        return isValid;
    }

    // === REGRAS DE VALIDAÇÃO ===
    validateRequired(field) {
        const value = field.value.trim();
        return {
            isValid: value !== '',
            message: 'Este campo é obrigatório.'
        };
    }

    validateEmail(field) {
        const value = field.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return {
            isValid: value === '' || emailRegex.test(value),
            message: 'Por favor, insira um e-mail válido.'
        };
    }

    validatePhone(field) {
        const value = field.value.trim();
        const phoneRegex = /^[\d\s\(\)\-]+$/;
        return {
            isValid: value === '' || phoneRegex.test(value),
            message: 'Por favor, insira um telefone válido.'
        };
    }

    validateMinLength(field, minLength) {
        const value = field.value.trim();
        return {
            isValid: value === '' || value.length >= parseInt(minLength),
            message: `Este campo deve ter no mínimo ${minLength} caracteres.`
        };
    }

    validateMaxLength(field, maxLength) {
        const value = field.value.trim();
        return {
            isValid: value === '' || value.length <= parseInt(maxLength),
            message: `Este campo deve ter no máximo ${maxLength} caracteres.`
        };
    }

    validatePassword(field) {
        const value = field.value;
        const hasMinLength = value.length >= 8;
        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        const hasNumbers = /\d/.test(value);
        
        return {
            isValid: value === '' || (hasMinLength && hasUpperCase && hasLowerCase && hasNumbers),
            message: 'A senha deve ter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas e números.'
        };
    }

    validateConfirmPassword(field, originalFieldId) {
        const originalField = document.getElementById(originalFieldId);
        return {
            isValid: field.value === originalField.value,
            message: 'As senhas não coincidem.'
        };
    }

    // === SISTEMA DE FEEDBACK VISUAL ===
    showFieldError(field, message) {
        field.classList.add('error');
        field.classList.remove('success');
        
        let errorElement = field.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        errorElement.style.display = 'block';

        // Focar no campo com erro
        field.focus();
    }

    showFieldSuccess(field) {
        field.classList.remove('error');
        field.classList.add('success');
        
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }

    clearAllErrors(form) {
        const fields = form.querySelectorAll('[data-validate]');
        fields.forEach(field => {
            field.classList.remove('error', 'success');
            const errorElement = field.parentNode.querySelector('.field-error');
            if (errorElement) {
                errorElement.style.display = 'none';
            }
        });
    }

    showFormError(form, message) {
        let formError = form.querySelector('.form-error');
        if (!formError) {
            formError = document.createElement('div');
            formError.className = 'alert alert-error form-error';
            form.prepend(formError);
        }
        
        formError.innerHTML = `<strong>Erro no formulário!</strong> ${message}`;
        formError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // === CONFIGURAÇÕES ESPECÍFICAS POR FORMULÁRIO ===
    setupVolunteerForm() {
        const form = document.querySelector('#volunteer-form');
        if (form) {
            this.setupRealTimeValidation(form);
        }
    }

    setupContactForm() {
        const form = document.querySelector('#contact-form');
        if (form) {
            this.setupRealTimeValidation(form);
        }
    }

    setupLoginForm() {
        const form = document.querySelector('#login-form');
        if (form) {
            this.setupRealTimeValidation(form);
        }
    }

    setupRealTimeValidation(form) {
        const fields = form.querySelectorAll('[data-validate]');
        
        fields.forEach(field => {
            field.addEventListener('blur', () => {
                this.validateField(field);
            });
            
            field.addEventListener('input', () => {
                // Limpar erro enquanto usuário digita
                if (field.classList.contains('error')) {
                    this.clearFieldError(field);
                }
            });
        });
    }

    async validateField(field) {
        const rules = field.getAttribute('data-validate').split(' ');
        
        for (const rule of rules) {
            const [ruleName, ruleValue] = rule.split(':');
            
            if (this.rules[ruleName]) {
                const result = await this.rules[ruleName](field, ruleValue);
                if (!result.isValid) {
                    this.showFieldError(field, result.message);
                    return false;
                }
            }
        }
        
        this.showFieldSuccess(field);
        return true;
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }
}