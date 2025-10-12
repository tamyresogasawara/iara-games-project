// Iara Games - Main JavaScript File
// Enhanced with accessibility features and improved functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initSmoothScrolling();
    initSearchFunctionality();
    initGameCardInteractions();
    initKeyboardNavigation();
    initAccessibilityFeatures();
    initFormValidation();
    
    console.log('Iara Games v2 - Loaded successfully!');
});

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    const ctaButton = document.querySelector('.cta-primary');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update focus for accessibility
                targetElement.focus();
                
                // Update URL without jumping
                history.pushState(null, null, targetId);
            }
        });
    });
    
    // CTA button smooth scroll to games section
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            e.preventDefault();
            const gamesSection = document.querySelector('#jogos');
            if (gamesSection) {
                gamesSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Focus on the first game card for accessibility
                const firstGameCard = document.querySelector('.game-card');
                if (firstGameCard) {
                    setTimeout(() => {
                        firstGameCard.focus();
                    }, 500);
                }
            }
        });
    }
}

// Search functionality
function initSearchFunctionality() {
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            // Create search modal or redirect to search page
            showSearchModal();
        });
        
        // Keyboard shortcut for search (Ctrl/Cmd + K)
        document.addEventListener('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                showSearchModal();
            }
        });
    }
}

function showSearchModal() {
    // Simple search implementation
    const searchTerm = prompt('Buscar jogos:');
    if (searchTerm) {
        searchGames(searchTerm);
    }
}

function searchGames(term) {
    const gameCards = document.querySelectorAll('.game-card');
    const searchTerm = term.toLowerCase();
    let foundGames = 0;
    
    gameCards.forEach(card => {
        const title = card.querySelector('.game-title').textContent.toLowerCase();
        const developer = card.querySelector('.game-developer').textContent.toLowerCase();
        const description = card.querySelector('.game-description').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || developer.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = 'block';
            card.style.order = '0';
            foundGames++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Show search results message
    showSearchResults(foundGames, term);
}

function showSearchResults(count, term) {
    // Remove existing search message
    const existingMessage = document.querySelector('.search-results-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new search message
    const gamesSection = document.querySelector('.games-section');
    const message = document.createElement('div');
    message.className = 'search-results-message';
    message.style.cssText = `
        background: rgba(99, 102, 241, 0.1);
        border: 1px solid rgba(99, 102, 241, 0.3);
        border-radius: 8px;
        padding: 1rem;
        margin-bottom: 2rem;
        text-align: center;
        color: var(--text-primary);
    `;
    
    if (count > 0) {
        message.innerHTML = `
            <p>Encontrados <strong>${count}</strong> jogo(s) para "<strong>${term}</strong>"</p>
            <button onclick="clearSearch()" style="
                background: var(--primary-gradient);
                color: white;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 6px;
                margin-top: 0.5rem;
                cursor: pointer;
            ">Limpar busca</button>
        `;
    } else {
        message.innerHTML = `
            <p>Nenhum jogo encontrado para "<strong>${term}</strong>"</p>
            <button onclick="clearSearch()" style="
                background: var(--primary-gradient);
                color: white;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 6px;
                margin-top: 0.5rem;
                cursor: pointer;
            ">Mostrar todos os jogos</button>
        `;
    }
    
    const gamesGrid = document.querySelector('.games-grid');
    gamesSection.insertBefore(message, gamesGrid);
}

function clearSearch() {
    const gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach(card => {
        card.style.display = 'block';
        card.style.order = '';
    });
    
    const message = document.querySelector('.search-results-message');
    if (message) {
        message.remove();
    }
}

// Game card interactions
function initGameCardInteractions() {
    const gameCards = document.querySelectorAll('.game-card');
    
    gameCards.forEach(card => {
        // Add click handlers for buttons
        const viewMoreBtn = card.querySelector('.btn-primary');
        const buyBtn = card.querySelector('.btn-secondary');
        
        if (viewMoreBtn) {
            viewMoreBtn.addEventListener('click', function() {
                const gameTitle = card.querySelector('.game-title').textContent;
                showGameDetails(gameTitle);
            });
        }
        
        if (buyBtn) {
            buyBtn.addEventListener('click', function() {
                const gameTitle = card.querySelector('.game-title').textContent;
                const gamePrice = card.querySelector('.price').textContent;
                showPurchaseModal(gameTitle, gamePrice);
            });
        }
        
        // Add hover effects for better UX
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

function showGameDetails(gameTitle) {
    alert(`Detalhes do jogo: ${gameTitle}\n\nEsta funcionalidade será implementada em breve!`);
}

function showPurchaseModal(gameTitle, price) {
    const confirmed = confirm(`Deseja comprar "${gameTitle}" por ${price}?\n\nVocê será redirecionado para a página de pagamento.`);
    if (confirmed) {
        // Redirect to purchase page or show purchase form
        alert('Redirecionando para a página de pagamento...');
    }
}

// Enhanced keyboard navigation
function initKeyboardNavigation() {
    // Add keyboard support for game cards
    const gameCards = document.querySelectorAll('.game-card');
    
    gameCards.forEach((card, index) => {
        card.addEventListener('keydown', function(e) {
            switch(e.key) {
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    const viewMoreBtn = card.querySelector('.btn-primary');
                    if (viewMoreBtn) {
                        viewMoreBtn.click();
                    }
                    break;
                    
                case 'ArrowRight':
                case 'ArrowDown':
                    e.preventDefault();
                    const nextCard = gameCards[index + 1];
                    if (nextCard) {
                        nextCard.focus();
                    }
                    break;
                    
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    const prevCard = gameCards[index - 1];
                    if (prevCard) {
                        prevCard.focus();
                    }
                    break;
                    
                case 'Home':
                    e.preventDefault();
                    gameCards[0].focus();
                    break;
                    
                case 'End':
                    e.preventDefault();
                    gameCards[gameCards.length - 1].focus();
                    break;
            }
        });
    });
    
    // Add escape key handler
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close any open modals or clear search
            clearSearch();
        }
    });
}

// Accessibility features
function initAccessibilityFeatures() {
    // Add live region for dynamic content announcements
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.style.cssText = `
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    `;
    document.body.appendChild(liveRegion);
    
    // Store reference for announcements
    window.announceToScreenReader = function(message) {
        liveRegion.textContent = message;
        setTimeout(() => {
            liveRegion.textContent = '';
        }, 1000);
    };
    
    // Add focus indicators for better visibility
    const style = document.createElement('style');
    style.textContent = `
        .focus-visible {
            outline: 2px solid #6366f1;
            outline-offset: 2px;
        }
    `;
    document.head.appendChild(style);
    
    // Handle focus-visible polyfill
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('using-keyboard');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('using-keyboard');
    });
    
    // Add skip links functionality
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.focus();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

// Form validation (for future forms)
function initFormValidation() {
    // This will be used for the registration form
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
            }
        });
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    });
}

function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.getAttribute('name') || field.getAttribute('id');
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = `${fieldName} é obrigatório`;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Email inválido';
        }
    }
    
    // Password validation
    if (field.type === 'password' && value) {
        if (value.length < 6) {
            isValid = false;
            errorMessage = 'Senha deve ter pelo menos 6 caracteres';
        }
    }
    
    // Show/hide error message
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.cssText = `
        color: #ef4444;
        font-size: 0.875rem;
        margin-top: 0.25rem;
    `;
    
    field.parentNode.appendChild(errorElement);
    field.setAttribute('aria-invalid', 'true');
    field.setAttribute('aria-describedby', field.id + '-error');
    errorElement.id = field.id + '-error';
}

function clearFieldError(field) {
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
    field.removeAttribute('aria-invalid');
    field.removeAttribute('aria-describedby');
}

// Utility functions
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

// Performance optimization
function initPerformanceOptimizations() {
    // Lazy loading for images (if not natively supported)
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// Initialize performance optimizations
initPerformanceOptimizations();

// Export functions for global access
window.IaraGames = {
    clearSearch,
    showGameDetails,
    showPurchaseModal,
    announceToScreenReader: window.announceToScreenReader
};

