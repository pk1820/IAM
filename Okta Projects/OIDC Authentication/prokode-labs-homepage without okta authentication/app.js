// Mobile Navigation Toggle
class MobileNavigation {
    constructor() {
        this.mobileMenu = document.getElementById('mobile-menu');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.init();
    }

    init() {
        // Toggle mobile menu
        this.mobileMenu.addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        // Close mobile menu when clicking on nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.mobileMenu.contains(e.target) && !this.navMenu.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        this.mobileMenu.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (this.navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    closeMobileMenu() {
        this.mobileMenu.classList.remove('active');
        this.navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Smooth Scroll with Offset for Fixed Navigation
class SmoothScroll {
    constructor() {
        this.navHeight = 80;
        this.init();
    }

    init() {
        // Add smooth scroll behavior to navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - this.navHeight;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Navbar Background on Scroll
class NavbarScroll {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });
    }

    handleScroll() {
        const scrolled = window.scrollY > 50;
        
        if (scrolled) {
            this.navbar.style.background = 'rgba(23, 49, 89, 0.98)';
            this.navbar.style.backdropFilter = 'blur(15px)';
        } else {
            this.navbar.style.background = 'rgba(23, 49, 89, 0.95)';
            this.navbar.style.backdropFilter = 'blur(10px)';
        }
    }
}

// Intersection Observer for Animations
class AnimationObserver {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.init();
    }

    init() {
        // Create intersection observer
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, this.observerOptions);

        // Observe elements for animation
        this.observeElements();
    }

    observeElements() {
        // Elements to animate on scroll
        const elementsToAnimate = [
            '.mission-card',
            '.vision-card',
            '.service-card',
            '.project-card',
            '.resource-card',
            '.team-card'
        ];

        elementsToAnimate.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((element, index) => {
                // Set initial state
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px)';
                element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                element.style.transitionDelay = `${index * 0.1}s`;
                
                // Observe element
                this.observer.observe(element);
            });
        });
    }
}

// Progress Bar Animation
class ProgressBarAnimation {
    constructor() {
        this.init();
    }

    init() {
        const progressBars = document.querySelectorAll('.progress-fill');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target;
                    const targetWidth = progressBar.style.width;
                    
                    // Reset and animate
                    progressBar.style.width = '0%';
                    
                    setTimeout(() => {
                        progressBar.style.transition = 'width 1.5s ease-out';
                        progressBar.style.width = targetWidth;
                    }, 300);
                    
                    observer.unobserve(progressBar);
                }
            });
        }, {
            threshold: 0.5
        });

        progressBars.forEach(bar => {
            observer.observe(bar);
        });
    }
}

// Active Navigation Link Highlighter
class ActiveNavLink {
    constructor() {
        this.sections = document.querySelectorAll('section[id]');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            this.highlightActiveSection();
        });
    }

    highlightActiveSection() {
        const scrollY = window.pageYOffset;
        
        this.sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                // Remove active class from all links
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                });
                
                // Add active class to current section link
                const activeLink = document.querySelector(`a[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }
}

// Performance Optimization - Throttle Scroll Events
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Lazy Loading for Background Images
class LazyImageLoader {
    constructor() {
        this.init();
    }

    init() {
        const imageElements = document.querySelectorAll('.hero-bg-image, .projects-bg-image, .team-bg-image');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.style.opacity = '1';
                    imageObserver.unobserve(img);
                }
            });
        });

        imageElements.forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all classes
    new MobileNavigation();
    new SmoothScroll();
    new NavbarScroll();
    new AnimationObserver();
    new ProgressBarAnimation();
    new ActiveNavLink();
    new LazyImageLoader();

    // Add loading complete class to body
    document.body.classList.add('loaded');
    
    // Console message for internal use
    console.log('🔐 Prokode Labs Internal Portal - Loaded Successfully');
    console.log('For internal use only - Unauthorized access prohibited');
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('Application Error:', e.error);
});

// Prevent right-click context menu (security measure for internal portal)
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
});

// Keyboard shortcuts for quick navigation
document.addEventListener('keydown', (e) => {
    // Alt + H = Home
    if (e.altKey && e.key === 'h') {
        e.preventDefault();
        document.querySelector('#home').scrollIntoView({ behavior: 'smooth' });
    }
    
    // Alt + S = Services
    if (e.altKey && e.key === 's') {
        e.preventDefault();
        document.querySelector('#services').scrollIntoView({ behavior: 'smooth' });
    }
    
    // Alt + P = Projects
    if (e.altKey && e.key === 'p') {
        e.preventDefault();
        document.querySelector('#projects').scrollIntoView({ behavior: 'smooth' });
    }
    
    // Alt + T = Team
    if (e.altKey && e.key === 't') {
        e.preventDefault();
        document.querySelector('#team').scrollIntoView({ behavior: 'smooth' });
    }
    
    // Alt + R = Resources
    if (e.altKey && e.key === 'r') {
        e.preventDefault();
        document.querySelector('#resources').scrollIntoView({ behavior: 'smooth' });
    }
});