// Form Validation and Enhancement for Iara Games Registration
// Enhanced with accessibility features and comprehensive validation

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registration-form');
    if (form) {
        initFormValidation();
        initPasswordStrength();
        initPasswordToggle();
        initFormEnhancements();
        initAccessibilityFeatures();
        
        console.log('Form validation initialized successfully!');
    }
});

// Main form validation initialization
function initFormValidation() {
    const form = document.getElementById('registration-form');
    const submitBtn = form.querySelector('.btn-submit');
    
    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            submitForm();
        } else {
            announceFormErrors();
        }
    });
    
    // Real-time validation for all form fields
    const formFields = form.querySelectorAll('input, select, textarea');
    formFields.forEach(field => {
        // Validate on blur
        field.addEventListener('blur', function() {
            validateField(this);
            updateSubmitButtonState();
        });
        
        // Clear errors on input
        field.addEventListener('input', function() {
            clearFieldError(this);
            updateSubmitButtonState();
        });
        
        // Special handling for checkboxes and radios
        if (field.type === 'checkbox' || field.type === 'radio') {
            field.addEventListener('change', function() {
                validateField(this);
                updateSubmitButtonState();
            });
        }
    });
    
    // Reset button handler
    const resetBtn = form.querySelector('.btn-reset');
    if (resetBtn) {
        resetBtn.addEventListener('click', function(e) {
            e.preventDefault();
            resetForm();
        });
    }
}

// Comprehensive form validation
function validateForm() {
    const form = document.getElementById('registration-form');
    let isValid = true;
    const errors = [];
    
    // Get all form fields
    const fields = form.querySelectorAll('input, select, textarea');
    
    fields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
            const fieldName = getFieldDisplayName(field);
            errors.push(fieldName);
        }
    });
    
    // Special validations
    if (!validatePasswordMatch()) {
        isValid = false;
        errors.push('Confirmação de senha');
    }
    
    if (!validateAge()) {
        isValid = false;
        errors.push('Idade mínima');
    }
    
    if (!validateRequiredCheckboxes()) {
        isValid = false;
        errors.push('Termos obrigatórios');
    }
    
    return isValid;
}

// Individual field validation
function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    const fieldName = field.name || field.id;
    let isValid = true;
    let errorMessage = '';
    
    // Skip validation for disabled fields
    if (field.disabled) {
        return true;
    }
    
    // Required field validation
    if (field.hasAttribute('required')) {
        if (fieldType === 'checkbox' || fieldType === 'radio') {
            if (fieldType === 'checkbox' && !field.checked) {
                isValid = false;
                errorMessage = 'Este campo é obrigatório';
            } else if (fieldType === 'radio') {
                const radioGroup = document.querySelectorAll(`input[name="${field.name}"]`);
                const isChecked = Array.from(radioGroup).some(radio => radio.checked);
                if (!isChecked) {
                    isValid = false;
                    errorMessage = 'Selecione uma opção';
                }
            }
        } else if (!value) {
            isValid = false;
            errorMessage = 'Este campo é obrigatório';
        }
    }
    
    // Skip further validation if field is empty and not required
    if (!value && !field.hasAttribute('required')) {
        clearFieldError(field);
        return true;
    }
    
    // Type-specific validation
    switch (fieldType) {
        case 'email':
            if (value && !isValidEmail(value)) {
                isValid = false;
                errorMessage = 'Digite um email válido';
            }
            break;
            
        case 'tel':
            if (value && !isValidPhone(value)) {
                isValid = false;
                errorMessage = 'Digite um telefone válido';
            }
            break;
            
        case 'text':
            if (fieldName === 'nome') {
                if (value && !isValidName(value)) {
                    isValid = false;
                    errorMessage = 'Digite um nome válido (apenas letras e espaços)';
                }
            } else if (fieldName === 'usuario') {
                if (value && !isValidUsername(value)) {
                    isValid = false;
                    errorMessage = 'Apenas letras, números e underscore';
                }
            }
            break;
            
        case 'password':
            if (fieldName === 'senha') {
                const strength = getPasswordStrength(value);
                if (value && strength.score < 2) {
                    isValid = false;
                    errorMessage = 'Senha muito fraca. Use pelo menos 8 caracteres com letras, números e símbolos';
                }
            }
            break;
            
        case 'date':
            if (fieldName === 'data-nascimento' && value) {
                const age = calculateAge(new Date(value));
                if (age < 13) {
                    isValid = false;
                    errorMessage = 'Você deve ter pelo menos 13 anos';
                }
            }
            break;
    }
    
    // Length validation
    if (value) {
        const minLength = field.getAttribute('minlength');
        const maxLength = field.getAttribute('maxlength');
        
        if (minLength && value.length < parseInt(minLength)) {
            isValid = false;
            errorMessage = `Mínimo ${minLength} caracteres`;
        }
        
        if (maxLength && value.length > parseInt(maxLength)) {
            isValid = false;
            errorMessage = `Máximo ${maxLength} caracteres`;
        }
    }
    
    // Pattern validation
    const pattern = field.getAttribute('pattern');
    if (pattern && value && !new RegExp(pattern).test(value)) {
        isValid = false;
        errorMessage = 'Formato inválido';
    }
    
    // Show/hide error
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }
    
    return isValid;
}

// Password strength validation
function initPasswordStrength() {
    const passwordField = document.getElementById('senha');
    const strengthBar = document.getElementById('strength-bar');
    const strengthText = document.getElementById('strength-text');
    
    if (passwordField && strengthBar && strengthText) {
        passwordField.addEventListener('input', function() {
            const password = this.value;
            const strength = getPasswordStrength(password);
            
            // Update strength bar
            strengthBar.className = `strength-bar ${strength.level}`;
            strengthText.textContent = strength.text;
            
            // Announce to screen readers
            if (window.announceToScreenReader) {
                window.announceToScreenReader(`Força da senha: ${strength.text}`);
            }
        });
    }
}

function getPasswordStrength(password) {
    if (!password) {
        return { score: 0, level: '', text: 'Digite uma senha' };
    }
    
    let score = 0;
    const checks = {
        length: password.length >= 8,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        numbers: /\d/.test(password),
        symbols: /[^A-Za-z0-9]/.test(password)
    };
    
    // Calculate score
    Object.values(checks).forEach(check => {
        if (check) score++;
    });
    
    // Determine strength level
    let level, text;
    if (score < 2) {
        level = 'weak';
        text = 'Muito fraca';
    } else if (score < 3) {
        level = 'fair';
        text = 'Fraca';
    } else if (score < 4) {
        level = 'good';
        text = 'Boa';
    } else {
        level = 'strong';
        text = 'Forte';
    }
    
    return { score, level, text };
}

// Password visibility toggle
function initPasswordToggle() {
    const passwordFields = document.querySelectorAll('input[type="password"]');
    
    passwordFields.forEach(field => {
        const container = field.closest('.password-input-container');
        const toggleBtn = container?.querySelector('.password-toggle');
        
        if (toggleBtn) {
            toggleBtn.addEventListener('click', function() {
                const isPassword = field.type === 'password';
                field.type = isPassword ? 'text' : 'password';
                
                // Update button text
                this.innerHTML = isPassword ? 
                    '<span aria-hidden="true">🙈</span>' : 
                    '<span aria-hidden="true">👁️</span>';
                
                // Update aria-label
                this.setAttribute('aria-label', 
                    isPassword ? 'Ocultar senha' : 'Mostrar senha'
                );
                
                // Announce to screen readers
                if (window.announceToScreenReader) {
                    window.announceToScreenReader(
                        isPassword ? 'Senha visível' : 'Senha oculta'
                    );
                }
            });
        }
    });
}

// Form enhancements
function initFormEnhancements() {
    // Auto-format phone number
    const phoneField = document.getElementById('telefone');
    if (phoneField) {
        phoneField.addEventListener('input', function() {
            this.value = formatPhoneNumber(this.value);
        });
    }
    
    // Username validation feedback
    const usernameField = document.getElementById('usuario');
    if (usernameField) {
        usernameField.addEventListener('input', debounce(function() {
            checkUsernameAvailability(this.value);
        }, 500));
    }
    
    // Email validation feedback
    const emailField = document.getElementById('email');
    if (emailField) {
        emailField.addEventListener('input', debounce(function() {
            if (this.value && isValidEmail(this.value)) {
                showFieldSuccess(this, 'Email válido');
            }
        }, 500));
    }
}

// Accessibility enhancements
function initAccessibilityFeatures() {
    // Add live region for form status
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'form-status';
    document.body.appendChild(liveRegion);
    
    // Keyboard navigation for custom controls
    initCustomControlKeyboard();
    
    // Focus management
    initFocusManagement();
}

function initCustomControlKeyboard() {
    // Radio button keyboard navigation
    const radioGroups = document.querySelectorAll('.radio-group');
    radioGroups.forEach(group => {
        const radios = group.querySelectorAll('input[type="radio"]');
        
        radios.forEach((radio, index) => {
            radio.addEventListener('keydown', function(e) {
                switch(e.key) {
                    case 'ArrowDown':
                    case 'ArrowRight':
                        e.preventDefault();
                        const nextRadio = radios[index + 1] || radios[0];
                        nextRadio.checked = true;
                        nextRadio.focus();
                        validateField(nextRadio);
                        break;
                        
                    case 'ArrowUp':
                    case 'ArrowLeft':
                        e.preventDefault();
                        const prevRadio = radios[index - 1] || radios[radios.length - 1];
                        prevRadio.checked = true;
                        prevRadio.focus();
                        validateField(prevRadio);
                        break;
                }
            });
        });
    });
}

function initFocusManagement() {
    // Focus first error field on form submission
    const form = document.getElementById('registration-form');
    form.addEventListener('submit', function() {
        setTimeout(() => {
            const firstError = form.querySelector('.form-control[aria-invalid="true"]');
            if (firstError) {
                firstError.focus();
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);
    });
}

// Validation helper functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    return phoneRegex.test(phone) || phone.length === 0;
}

function isValidName(name) {
    const nameRegex = /^[a-zA-ZÀ-ÿ\s]+$/;
    return nameRegex.test(name);
}

function isValidUsername(username) {
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    return usernameRegex.test(username);
}

function calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    
    return age;
}

function validatePasswordMatch() {
    const password = document.getElementById('senha').value;
    const confirmPassword = document.getElementById('confirmar-senha').value;
    const confirmField = document.getElementById('confirmar-senha');
    
    if (confirmPassword && password !== confirmPassword) {
        showFieldError(confirmField, 'As senhas não coincidem');
        return false;
    } else if (confirmPassword) {
        clearFieldError(confirmField);
    }
    
    return true;
}

function validateAge() {
    const dateField = document.getElementById('data-nascimento');
    const birthDate = dateField.value;
    
    if (birthDate) {
        const age = calculateAge(new Date(birthDate));
        if (age < 13) {
            showFieldError(dateField, 'Você deve ter pelo menos 13 anos');
            return false;
        }
    }
    
    return true;
}

function validateRequiredCheckboxes() {
    const requiredCheckboxes = document.querySelectorAll('input[type="checkbox"][required]');
    let allValid = true;
    
    requiredCheckboxes.forEach(checkbox => {
        if (!checkbox.checked) {
            showFieldError(checkbox, 'Este campo é obrigatório');
            allValid = false;
        }
    });
    
    return allValid;
}

// Error handling functions
function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.id = field.id + '-error';
    
    // Insert error after field or its container
    const container = field.closest('.form-group') || field.parentNode;
    container.appendChild(errorElement);
    
    // Update ARIA attributes
    field.setAttribute('aria-invalid', 'true');
    field.setAttribute('aria-describedby', errorElement.id);
    
    // Add error styling
    field.classList.add('error');
}

function clearFieldError(field) {
    const container = field.closest('.form-group') || field.parentNode;
    const errorElement = container.querySelector('.field-error');
    
    if (errorElement) {
        errorElement.remove();
    }
    
    // Remove ARIA attributes
    field.removeAttribute('aria-invalid');
    field.removeAttribute('aria-describedby');
    
    // Remove error styling
    field.classList.remove('error');
}

function showFieldSuccess(field, message) {
    // Remove existing success message
    const container = field.closest('.form-group') || field.parentNode;
    const existingSuccess = container.querySelector('.field-success');
    if (existingSuccess) {
        existingSuccess.remove();
    }
    
    const successElement = document.createElement('div');
    successElement.className = 'field-success';
    successElement.textContent = message;
    successElement.style.cssText = `
        color: var(--accent-green);
        font-size: var(--font-size-sm);
        margin-top: var(--spacing-xs);
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
    `;
    successElement.innerHTML = `✓ ${message}`;
    
    container.appendChild(successElement);
    
    // Remove after 3 seconds
    setTimeout(() => {
        if (successElement.parentNode) {
            successElement.remove();
        }
    }, 3000);
}

// Utility functions
function formatPhoneNumber(value) {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format as (XX) XXXXX-XXXX or (XX) XXXX-XXXX
    if (digits.length <= 10) {
        return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else {
        return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
}

function checkUsernameAvailability(username) {
    if (username.length < 3) return;
    
    // Simulate API call
    setTimeout(() => {
        const isAvailable = !['admin', 'user', 'test', 'iara'].includes(username.toLowerCase());
        const field = document.getElementById('usuario');
        
        if (isAvailable) {
            showFieldSuccess(field, 'Nome de usuário disponível');
        } else {
            showFieldError(field, 'Nome de usuário não disponível');
        }
    }, 500);
}

function updateSubmitButtonState() {
    const form = document.getElementById('registration-form');
    const submitBtn = form.querySelector('.btn-submit');
    const requiredFields = form.querySelectorAll('[required]');
    
    let allValid = true;
    requiredFields.forEach(field => {
        if (field.type === 'checkbox' || field.type === 'radio') {
            if (field.type === 'checkbox' && !field.checked) {
                allValid = false;
            } else if (field.type === 'radio') {
                const radioGroup = form.querySelectorAll(`input[name="${field.name}"]`);
                const isChecked = Array.from(radioGroup).some(radio => radio.checked);
                if (!isChecked) allValid = false;
            }
        } else if (!field.value.trim()) {
            allValid = false;
        }
    });
    
    submitBtn.disabled = !allValid;
    submitBtn.setAttribute('aria-disabled', !allValid);
}

function announceFormErrors() {
    const errors = document.querySelectorAll('.field-error');
    if (errors.length > 0 && window.announceToScreenReader) {
        window.announceToScreenReader(
            `Formulário contém ${errors.length} erro(s). Corrija os campos destacados.`
        );
    }
}

function getFieldDisplayName(field) {
    const label = document.querySelector(`label[for="${field.id}"]`);
    return label ? label.textContent.replace('*', '').trim() : field.name;
}

function resetForm() {
    const form = document.getElementById('registration-form');
    
    // Clear all errors
    const errors = form.querySelectorAll('.field-error');
    errors.forEach(error => error.remove());
    
    // Clear all success messages
    const successes = form.querySelectorAll('.field-success');
    successes.forEach(success => success.remove());
    
    // Reset ARIA attributes
    const fields = form.querySelectorAll('input, select, textarea');
    fields.forEach(field => {
        field.removeAttribute('aria-invalid');
        field.removeAttribute('aria-describedby');
        field.classList.remove('error');
    });
    
    // Reset form
    form.reset();
    
    // Reset password strength
    const strengthBar = document.getElementById('strength-bar');
    const strengthText = document.getElementById('strength-text');
    if (strengthBar && strengthText) {
        strengthBar.className = 'strength-bar';
        strengthText.textContent = 'Digite uma senha';
    }
    
    // Focus first field
    const firstField = form.querySelector('input, select, textarea');
    if (firstField) {
        firstField.focus();
    }
    
    // Announce reset
    if (window.announceToScreenReader) {
        window.announceToScreenReader('Formulário limpo');
    }
}

function submitForm() {
    const form = document.getElementById('registration-form');
    const submitBtn = form.querySelector('.btn-submit');
    const successMessage = document.getElementById('success-message');
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="btn-text">Criando conta...</span><span class="btn-icon">⏳</span>';
    
    // Simulate form submission
    setTimeout(() => {
        // Hide form and show success message
        form.style.display = 'none';
        successMessage.style.display = 'block';
        successMessage.focus();
        
        // Announce success
        if (window.announceToScreenReader) {
            window.announceToScreenReader('Conta criada com sucesso! Verifique seu email.');
        }
        
        // Scroll to success message
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
    }, 2000);
}

// Debounce utility
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export functions for global access
window.FormValidation = {
    validateForm,
    validateField,
    resetForm,
    submitForm
};

