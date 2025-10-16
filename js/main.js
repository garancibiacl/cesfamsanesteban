document.addEventListener('DOMContentLoaded', function() {
    
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const header = document.getElementById('header');

    if (mobileMenuButton && mobileMenu) {
        const openMobileMenu = () => {
            mobileMenu.classList.remove('hidden');
            mobileMenuButton.setAttribute('aria-expanded', 'true');
            document.body.classList.add('is-locked');
        };

        const closeMobileMenu = () => {
            mobileMenu.classList.add('hidden');
            mobileMenuButton.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('is-locked');
        };

        mobileMenuButton.addEventListener('click', (event) => {
            event.stopPropagation();
            const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
            if (isExpanded) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });

        const mobileLinks = mobileMenu.querySelectorAll('a[href]');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeMobileMenu();
            });
        });

        mobileMenu.addEventListener('click', (event) => {
            if (event.target === mobileMenu) {
                closeMobileMenu();
            }
        });

        document.addEventListener('click', (event) => {
            if (!mobileMenu.classList.contains('hidden') && !mobileMenu.contains(event.target) && !mobileMenuButton.contains(event.target)) {
                closeMobileMenu();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && mobileMenuButton.getAttribute('aria-expanded') === 'true') {
                closeMobileMenu();
                mobileMenuButton.focus();
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth >= 1024 && mobileMenuButton.getAttribute('aria-expanded') === 'true') {
                closeMobileMenu();
            }
        });
    }

    const allLinks = document.querySelectorAll('a[href^="#"]');
    allLinks.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') {
                e.preventDefault();
                return;
            }

            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                
                const headerHeight = header ? header.offsetHeight : 80;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    const faqCards = document.querySelectorAll('.faq-card');
    const faqSearchInput = document.getElementById('faq-search');
    const faqChips = document.querySelectorAll('[data-faq-chip]');

    function closeOtherFaqs(current) {
        faqCards.forEach(card => {
            if (card !== current) {
                const trigger = card.querySelector('.faq-card__trigger');
                const panel = card.querySelector('.faq-card__panel');
                if (trigger && panel) {
                    trigger.setAttribute('aria-expanded', 'false');
                    panel.classList.add('hidden');
                    panel.classList.remove('faq-card__panel--open');
                }
            }
        });
    }

    faqCards.forEach(card => {
        const trigger = card.querySelector('.faq-card__trigger');
        const panel = card.querySelector('.faq-card__panel');

        if (!trigger || !panel) {
            return;
        }

        trigger.addEventListener('click', () => {
            const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
            closeOtherFaqs(isExpanded ? null : card);
            trigger.setAttribute('aria-expanded', String(!isExpanded));
            if (isExpanded) {
                panel.classList.add('hidden');
                panel.classList.remove('faq-card__panel--open');
            } else {
                panel.classList.remove('hidden');
                // trigger reflow for animation
                void panel.offsetWidth;
                panel.classList.add('faq-card__panel--open');
            }
        });

        trigger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                trigger.click();
            }
        });
    });

    function filterFaqs(value) {
        const query = value.trim().toLowerCase();
        faqCards.forEach(card => {
            const keywords = card.dataset.keywords || '';
            const text = card.textContent || '';
            const matches = !query || keywords.toLowerCase().includes(query) || text.toLowerCase().includes(query);
            card.style.display = matches ? '' : 'none';
        });
    }

    if (faqSearchInput) {
        faqSearchInput.addEventListener('input', (event) => {
            filterFaqs(event.target.value);
        });
    }

    faqChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const term = chip.getAttribute('data-faq-chip') || '';
            if (faqSearchInput) {
                faqSearchInput.value = term;
                faqSearchInput.focus();
                filterFaqs(term);
            }
        });
    });

    const footerChatButton = document.querySelector('.footer-chat__button');
    const footerChatPanel = document.getElementById('footer-chat-panel');

    if (footerChatButton && footerChatPanel) {
        const showChatPanel = () => {
            footerChatPanel.classList.remove('hidden');
            requestAnimationFrame(() => {
                footerChatPanel.classList.add('footer-chat__panel--visible');
            });
            footerChatButton.setAttribute('aria-expanded', 'true');
        };

        const hideChatPanel = () => {
            footerChatPanel.classList.remove('footer-chat__panel--visible');
            footerChatButton.setAttribute('aria-expanded', 'false');
            const handleTransitionEnd = (event) => {
                if (event.propertyName === 'opacity') {
                    if (footerChatButton.getAttribute('aria-expanded') === 'false') {
                        footerChatPanel.classList.add('hidden');
                    }
                    footerChatPanel.removeEventListener('transitionend', handleTransitionEnd);
                }
            };
            footerChatPanel.addEventListener('transitionend', handleTransitionEnd);
        };

        const toggleChatPanel = () => {
            const isExpanded = footerChatButton.getAttribute('aria-expanded') === 'true';
            if (isExpanded) {
                hideChatPanel();
            } else {
                showChatPanel();
            }
        };

        footerChatButton.addEventListener('click', (event) => {
            event.stopPropagation();
            toggleChatPanel();
        });

        document.addEventListener('click', (event) => {
            if (!footerChatPanel.classList.contains('hidden') && !footerChatPanel.contains(event.target) && event.target !== footerChatButton && !footerChatButton.contains(event.target)) {
                hideChatPanel();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && footerChatButton.getAttribute('aria-expanded') === 'true') {
                hideChatPanel();
                footerChatButton.focus();
            }
        });
    }

    let lastScrollTop = 0;
    const headerElement = document.getElementById('header');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            headerElement.style.transform = 'translateY(-100%)';
        } else {
            headerElement.style.transform = 'translateY(0)';
        }
        
        if (headerElement) {
            if (scrollTop > 50) {
                headerElement.classList.add('navbar--scrolled');
            } else {
                headerElement.classList.remove('navbar--scrolled');
            }
        }
        
        lastScrollTop = scrollTop;
    });

    const navLinks = document.querySelectorAll('.nav-link');
    
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.pageYOffset + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('navbar__link--active', 'text-azul-vital');
                    link.removeAttribute('aria-current');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('navbar__link--active');
                        link.setAttribute('aria-current', 'page');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink();

    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });

    const revealItems = document.querySelectorAll('.reveal-on-scroll');
    if ('IntersectionObserver' in window && revealItems.length > 0) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -10% 0px'
        });

        revealItems.forEach(item => observer.observe(item));
    } else {
        revealItems.forEach(item => item.classList.add('reveal-visible'));
    }

    console.log('🏥 Salud Municipal de San Esteban - Sitio cargado correctamente');
});
