// Iara Games - Main JavaScript File

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Game card hover effects and interactions
    const gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach(card => {
        // Add keyboard navigation support
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const primaryButton = card.querySelector('.btn-primary');
                if (primaryButton) {
                    primaryButton.click();
                }
            }
        });

        // Enhanced hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Button click handlers
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);

            // Handle different button types
            if (this.classList.contains('btn-primary')) {
                handleViewMore(this);
            } else if (this.classList.contains('btn-secondary')) {
                handlePurchase(this);
            } else if (this.classList.contains('cta-primary')) {
                scrollToGames();
            } else if (this.classList.contains('search-btn')) {
                handleSearch();
            } else if (this.classList.contains('user-btn')) {
                handleUserMenu();
            }
        });
    });

    // Search functionality
    function handleSearch() {
        alert('Funcionalidade de busca será implementada em breve!');
    }

    // User menu functionality
    function handleUserMenu() {
        alert('Menu do usuário será implementado em breve!');
    }

    // View more game details
    function handleViewMore(button) {
        const gameCard = button.closest('.game-card');
        const gameTitle = gameCard.querySelector('.game-title').textContent;
        alert(`Visualizando detalhes de: ${gameTitle}\n\nEsta funcionalidade será implementada em breve!`);
    }

    // Purchase game
    function handlePurchase(button) {
        const gameCard = button.closest('.game-card');
        const gameTitle = gameCard.querySelector('.game-title').textContent;
        const gamePrice = gameCard.querySelector('.price').textContent;
        
        if (confirm(`Deseja comprar ${gameTitle} por ${gamePrice}?`)) {
            alert('Redirecionando para o checkout...\n\nFuncionalidade de compra será implementada em breve!');
        }
    }

    // Scroll to games section
    function scrollToGames() {
        const gamesSection = document.getElementById('jogos');
        if (gamesSection) {
            gamesSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    // Add loading animation for images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        img.addEventListener('error', function() {
            this.alt = 'Imagem não disponível';
            this.style.backgroundColor = '#374151';
            this.style.color = '#9CA3AF';
            this.style.display = 'flex';
            this.style.alignItems = 'center';
            this.style.justifyContent = 'center';
            this.style.fontSize = '0.875rem';
        });
    });

    // Accessibility: Focus management
    document.addEventListener('keydown', function(e) {
        // Skip to main content with Tab key
        if (e.key === 'Tab' && !e.shiftKey && document.activeElement === document.body) {
            const skipLink = document.querySelector('.skip-link');
            if (skipLink) {
                skipLink.focus();
            }
        }
    });

    // Add intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe game cards for scroll animations
    gameCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Console message for developers
    console.log('🎮 Iara Games - Apoiando o desenvolvimento de jogos brasileiros!');
    console.log('Desenvolvido por: Tamyes Ogasawara');
    console.log('GitHub: https://github.com/tamyes-ogasawara/iara-games');
});

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

// Performance optimization: Lazy loading for images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        imageObserver.observe(img);
    });
}

