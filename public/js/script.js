// Optimized theme toggle with debouncing
let themeToggleTimeout;
function toggleTheme() {
    if (themeToggleTimeout) return;
    
    themeToggleTimeout = setTimeout(() => {
        const html = document.documentElement;
        const themeIconMobile = document.getElementById('theme-icon-mobile');
        const themeIconDesktop = document.getElementById('theme-icon-desktop');
        const currentTheme = html.getAttribute('data-bs-theme');

        if (currentTheme === 'dark') {
            html.setAttribute('data-bs-theme', 'light');
            if (themeIconMobile) themeIconMobile.className = 'bi bi-sun-fill';
            if (themeIconDesktop) themeIconDesktop.className = 'bi bi-sun-fill';
            localStorage.setItem('theme', 'light');
            updateCommentTheme('light');
        } else {
            html.setAttribute('data-bs-theme', 'dark');
            if (themeIconMobile) themeIconMobile.className = 'bi bi-moon-fill';
            if (themeIconDesktop) themeIconDesktop.className = 'bi bi-moon-fill';
            localStorage.setItem('theme', 'dark');
            updateCommentTheme('dark');
        }
        
        themeToggleTimeout = null;
    }, 50);
}

// Optimized comment theme updates
function updateCommentTheme(theme) {
    requestAnimationFrame(() => {
        const utterances = document.querySelector('.utterances-frame');
        if (utterances) {
            const message = {
                type: 'set-theme',
                theme: theme === 'dark' ? 'github-dark' : 'github-light'
            };
            utterances.contentWindow.postMessage(message, 'https://utteranc.es');
        }

        if (window.DISQUS) {
            window.DISQUS.reset({
                reload: true,
                config: function () {
                    this.page.theme = theme;
                }
            });
        }

        const giscus = document.querySelector('.giscus-frame');
        if (giscus) {
            const message = {
                setConfig: {
                    theme: theme === 'dark' ? 'dark' : 'light'
                }
            };
            giscus.contentWindow.postMessage({ giscus: message }, 'https://giscus.app');
        }
    });
}

// Initialize theme on page load
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');

    document.documentElement.setAttribute('data-bs-theme', theme);
    
    // Update both mobile and desktop theme icons
    const themeIconMobile = document.getElementById('theme-icon-mobile');
    const themeIconDesktop = document.getElementById('theme-icon-desktop');
    const iconClass = theme === 'dark' ? 'bi bi-moon-fill' : 'bi bi-sun-fill';
    
    if (themeIconMobile) themeIconMobile.className = iconClass;
    if (themeIconDesktop) themeIconDesktop.className = iconClass;
    
    // Initialize comment theme
    setTimeout(() => updateCommentTheme(theme), 1000);
}

// Optimized scroll handling with throttling
let scrollTimeout;
function initializeBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    if (!backToTopButton) return;

    const throttledScroll = () => {
        if (scrollTimeout) return;
        
        scrollTimeout = setTimeout(() => {
            const shouldShow = window.pageYOffset > 300;
            backToTopButton.classList.toggle('d-none', !shouldShow);
            backToTopButton.classList.toggle('d-block', shouldShow);
            scrollTimeout = null;
        }, 100);
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
}

// Optimized code block initialization
function initializeCodeBlocks() {
    const codeBlocks = document.querySelectorAll('.markdown-body pre');
    if (codeBlocks.length === 0) return;
    
    codeBlocks.forEach((block, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'code-block-wrapper';
        
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-btn';
        copyBtn.innerHTML = '<i class="bi bi-clipboard"></i>';
        copyBtn.setAttribute('aria-label', 'Copy code');
        
        copyBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const code = block.querySelector('code');
            const text = code ? code.textContent : block.textContent;
            
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text).then(() => {
                    copyBtn.innerHTML = '<i class="bi bi-check"></i>';
                    copyBtn.classList.add('copied');
                    
                    setTimeout(() => {
                        copyBtn.innerHTML = '<i class="bi bi-clipboard"></i>';
                        copyBtn.classList.remove('copied');
                    }, 2000);
                });
            }
        }, { passive: false });
        
        block.parentNode.insertBefore(wrapper, block);
        wrapper.appendChild(block);
        wrapper.appendChild(copyBtn);
    });
}

// Optimized smooth scrolling
function scrollToTop() {
    if ('scrollBehavior' in document.documentElement.style) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        window.scrollTo(0, 0);
    }
}

// Optimized initialization
document.addEventListener('DOMContentLoaded', function() {
    // Use requestAnimationFrame for non-critical initializations
    requestAnimationFrame(() => {
        initializeTheme();
        initializeBackToTop();
        initializeCodeBlocks();
    });

    // Critical path optimizations
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse) {
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (navbarCollapse.classList.contains('show')) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                    bsCollapse.hide();
                }
            }, { passive: true });
        });
    }

    // Optimized anchor link handling
    document.addEventListener('click', function(e) {
        const anchor = e.target.closest('a[href^="#"]');
        if (anchor) {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }, { passive: false });
});

// Optimized system theme listener
if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', function(e) {
        if (!localStorage.getItem('theme')) {
            const theme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-bs-theme', theme);
            
            const themeIconMobile = document.getElementById('theme-icon-mobile');
            const themeIconDesktop = document.getElementById('theme-icon-desktop');
            const iconClass = theme === 'dark' ? 'bi bi-moon-fill' : 'bi bi-sun-fill';
            
            if (themeIconMobile) themeIconMobile.className = iconClass;
            if (themeIconDesktop) themeIconDesktop.className = iconClass;
        }
    });
}
