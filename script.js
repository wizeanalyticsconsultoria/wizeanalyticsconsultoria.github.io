// Função para adicionar animações e interações aos links
document.addEventListener('DOMContentLoaded', function() {
    
    // Analytics de cliques (você pode integrar com Google Analytics ou outra ferramenta)
    const links = document.querySelectorAll('.link-card');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const linkTitle = this.querySelector('h3').textContent;
            console.log(`Link clicado: ${linkTitle}`);
            
            // Adiciona feedback visual ao clicar
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 100);
            
            // Aqui você pode adicionar código para tracking analytics
            // Exemplo: gtag('event', 'click', { 'event_category': 'Link', 'event_label': linkTitle });
        });
    });

    // Efeito parallax suave no background
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX / window.innerWidth - 0.5;
        mouseY = e.clientY / window.innerHeight - 0.5;
    });

    function updateParallax() {
        currentX += (mouseX - currentX) * 0.05;
        currentY += (mouseY - currentY) * 0.05;
        
        const parallaxElements = document.querySelectorAll('body::before');
        document.body.style.setProperty('--mouse-x', currentX);
        document.body.style.setProperty('--mouse-y', currentY);
        
        requestAnimationFrame(updateParallax);
    }
    
    updateParallax();

    // Adiciona efeito de reveal ao scroll (útil se a página crescer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Animação de digitação no título (opcional)
    const title = document.querySelector('.title');
    if (title) {
        const text = title.textContent;
        title.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                title.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }
        
        // Descomente a linha abaixo se quiser o efeito de digitação
        // typeWriter();
    }

    // Copia texto do email ao clicar (funcionalidade extra)
    const emailLink = document.querySelector('a[href^="mailto"]');
    if (emailLink) {
        emailLink.addEventListener('click', function(e) {
            const email = this.querySelector('.link-content p').textContent;
            
            // Tenta copiar para área de transferência
            if (navigator.clipboard) {
                navigator.clipboard.writeText(email).then(() => {
                    showNotification('E-mail copiado!');
                }).catch(err => {
                    console.log('Não foi possível copiar o e-mail', err);
                });
            }
        });
    }

    // Função para mostrar notificação
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            z-index: 1000;
            animation: slideInUp 0.3s ease-out;
            backdrop-filter: blur(10px);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutDown 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 2000);
    }

    // Adiciona animações CSS para as notificações
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes slideOutDown {
                from {
                    opacity: 1;
                    transform: translateY(0);
                }
                to {
                    opacity: 0;
                    transform: translateY(20px);
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Previne comportamento padrão em alguns cliques para melhor UX
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
        link.addEventListener('click', function(e) {
            // Aqui você pode adicionar tracking adicional antes de abrir o link
            const href = this.getAttribute('href');
            console.log(`Abrindo link externo: ${href}`);
        });
    });

    // Detecta tema escuro/claro do sistema (para futuras implementações)
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    function handleThemeChange(e) {
        // Você pode adicionar lógica aqui para ajustar o tema se necessário
        console.log(`Tema do sistema: ${e.matches ? 'escuro' : 'claro'}`);
    }
    
    prefersDarkScheme.addEventListener('change', handleThemeChange);

    // Adiciona suporte para PWA (Progressive Web App) - opcional
    if ('serviceWorker' in navigator) {
        // Descomente para ativar service worker
        // navigator.serviceWorker.register('/sw.js').then(registration => {
        //     console.log('Service Worker registrado:', registration);
        // }).catch(error => {
        //     console.log('Erro ao registrar Service Worker:', error);
        // });
    }

    // Contador de visitas (usando localStorage)
    let visitCount = localStorage.getItem('visitCount') || 0;
    visitCount++;
    localStorage.setItem('visitCount', visitCount);
    console.log(`Esta é sua visita número ${visitCount}`);

    // Easter egg: Konami code
    let konamiCode = [];
    const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    
    document.addEventListener('keydown', function(e) {
        konamiCode.push(e.key);
        konamiCode = konamiCode.slice(-10);
        
        if (konamiCode.join(',') === konamiPattern.join(',')) {
            showNotification('🎉 Easter Egg Ativado! Wize Analytics!');
            document.body.style.animation = 'rainbow 2s ease-in-out';
            
            // Remove a animação após 2 segundos
            setTimeout(() => {
                document.body.style.animation = '';
            }, 2000);
        }
    });

    // Animação rainbow para o easter egg
    const rainbowStyle = document.createElement('style');
    rainbowStyle.textContent = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(rainbowStyle);

    console.log('%c🚀 Wize Analytics', 'font-size: 20px; color: #667eea; font-weight: bold;');
    console.log('%cInteligência de Negócios e Transformação Digital', 'font-size: 12px; color: #764ba2;');
});

// Função para criar efeito de partículas no fundo (opcional)
function createParticles() {
    const particleCount = 50;
    const container = document.createElement('div');
    container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
        overflow: hidden;
    `;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(102, 126, 234, 0.3);
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: float ${5 + Math.random() * 10}s infinite ease-in-out;
            animation-delay: ${Math.random() * 5}s;
        `;
        container.appendChild(particle);
    }
    
    // Descomente para ativar o efeito de partículas
    // document.body.insertBefore(container, document.body.firstChild);
}

// Descomente para criar partículas no carregamento
// createParticles();

// Função para smooth scroll (útil se adicionar âncoras)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});