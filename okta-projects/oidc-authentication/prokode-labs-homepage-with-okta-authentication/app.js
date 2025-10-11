// =============================================================================
// PROKODE LABS - MAIN APPLICATION LOGIC (Updated for Authentication)
// =============================================================================

// Wait for authentication before initializing app features
let appInitialized = false;

// Listen for authentication completion
document.addEventListener('userAuthenticated', (event) => {
    console.log('👤 User authenticated, initializing app features...');
    initializeApp();
});

// Also check if already authenticated on page load
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to let auth system initialize first
    setTimeout(() => {
        if (window.ProkodeAuth && window.ProkodeAuth.isAuthenticated()) {
            console.log('👤 User already authenticated, initializing app features...');
            initializeApp();
        }
    }, 1000);
});

// =============================================================================
// MAIN APP INITIALIZATION
// =============================================================================

function initializeApp() {
    if (appInitialized) {
        return; // Prevent double initialization
    }
    
    console.log('🚀 Initializing Prokode Labs application...');
    
    try {
        // Initialize all existing classes
        new MobileNavigation();
        new SmoothScroll();
        new NavbarScroll();
        new AnimationObserver();
        new ProgressBarAnimation();
        new ActiveNavLink();
        new LazyImageLoader();

        // Add role-based features if user has groups
        initializeRoleBasedFeatures();

        // Add loading complete class to body
        document.body.classList.add('loaded');
        
        appInitialized = true;
        
        console.log('✅ Prokode Labs Internal Portal - Loaded Successfully');
        console.log('🔐 For internal use only - Unauthorized access prohibited');
        
    } catch (error) {
        console.error('❌ App initialization failed:', error);
    }
}

// =============================================================================
// ROLE-BASED FEATURES
// =============================================================================

function initializeRoleBasedFeatures() {
    const currentUser = window.ProkodeAuth.getCurrentUser();
    
    if (!currentUser || !currentUser.groups) {
        return;
    }
    
    console.log('👥 Initializing role-based features for user groups:', currentUser.groups);
    
    // Admin features for IAM-Admins group
    if (window.ProkodeAuth.hasRole('IAM-Admins')) {
        enableAdminFeatures();
    }
    
    // Enhanced features for IAM-Team
    if (window.ProkodeAuth.hasRole('IAM-Team')) {
        enableTeamFeatures();
    }
    
    // Add user role indicators to UI
    addRoleIndicators(currentUser.groups);
}

function enableAdminFeatures() {
    console.log('🔧 Enabling admin features...');
    
    // Add admin panel to resources section (example)
    const resourcesGrid = document.querySelector('.resources-grid');
    if (resourcesGrid) {
        const adminCard = createResourceCard(
            '⚙️',
            'Admin Dashboard',
            'System administration and user management',
            '#admin-dashboard'
        );
        adminCard.classList.add('admin-feature');
        resourcesGrid.appendChild(adminCard);
    }
    
    // Add admin shortcuts to navigation (example)
    addAdminNavigation();
}

function enableTeamFeatures() {
    console.log('👥 Enabling team features...');
    
    // Add team-specific resources
    const resourcesGrid = document.querySelector('.resources-grid');
    if (resourcesGrid) {
        const teamCard = createResourceCard(
            '📊',
            'Team Analytics',
            'IAM team performance and metrics',
            '#team-analytics'
        );
        teamCard.classList.add('team-feature');
        resourcesGrid.appendChild(teamCard);
    }
}

function createResourceCard(icon, title, description, link) {
    const card = document.createElement('div');
    card.className = 'resource-card';
    card.innerHTML = `
        <div class="resource-icon">${icon}</div>
        <h3>${title}</h3>
        <p>${description}</p>
        <a href="${link}" class="resource-link">Access</a>
    `;
    return card;
}

function addAdminNavigation() {
    // Add admin indicator to navigation
    const navLogo = document.querySelector('.nav-logo h2');
    if (navLogo) {
        const adminBadge = document.createElement('span');
        adminBadge.className = 'admin-badge';
        adminBadge.textContent = 'ADMIN';
        adminBadge.style.cssText = `
            background: var(--prokode-accent-teal);
            color: var(--prokode-primary-dark);
            font-size: 0.6rem;
            padding: 2px 6px;
            border-radius: 3px;
            margin-left: 8px;
            font-weight: bold;
        `;
        navLogo.appendChild(adminBadge);
    }
}

function addRoleIndicators(groups) {
    // Add role indicators to team section
    const teamCards = document.querySelectorAll('.team-card');
    teamCards.forEach(card => {
        const roleIndicator = document.createElement('div');
        roleIndicator.className = 'user-role-indicator';
        roleIndicator.style.cssText = `
            background: linear-gradient(45deg, var(--prokode-accent-teal), var(--prokode-primary-blue));
            color: white;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 0.7rem;
            font-weight: bold;
            text-align: center;
            margin-top: 8px;
        `;
        
        // Show user's highest role
        if (groups.includes('IAM-Admins')) {
            roleIndicator.textContent = '🔧 ADMIN ACCESS';
        } else if (groups.includes('IAM-Team')) {
            roleIndicator.textContent = '👥 TEAM MEMBER';
        } else {
            roleIndicator.textContent = '👤 AUTHORIZED USER';
        }
        
        card.appendChild(roleIndicator);
    });
}

// =============================================================================
// EXISTING CLASSES (Updated for Authentication Context)
// =============================================================================

// Mobile Navigation Toggle
class MobileNavigation {
    constructor() {
        this.mobileMenu = document.getElementById('mobile-menu');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.init();
    }

    init() {
        if (!this.mobileMenu || !this.navMenu) return;
        
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

// Smooth Scroll with Offset for Fixed Navigation (Updated for auth bar)
class SmoothScroll {
    constructor() {
        this.navHeight = 80 + 60; // Original nav height + auth status bar
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

// Navbar Background on Scroll (Updated for auth integration)
class NavbarScroll {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.init();
    }

    init() {
        if (!this.navbar) return;
        
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

// Active Navigation Link Highlighter (Updated for auth bar offset)
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
        const offset = 140; // Account for auth bar + nav bar
        
        this.sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - offset;
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

// =============================================================================
// ENHANCED SECURITY AND SESSION MANAGEMENT
// =============================================================================

// Enhanced error handling with authentication context
window.addEventListener('error', (e) => {
    console.error('Application Error:', e.error);
    
    // If it's an auth-related error, show appropriate message
    if (e.error.message && e.error.message.includes('authentication')) {
        console.log('🔒 Authentication error detected, checking session...');
        if (window.ProkodeAuth && window.ProkodeAuth.getAuthManager()) {
            window.ProkodeAuth.getAuthManager().checkAuthState();
        }
    }
});

// Enhanced right-click prevention for internal portal
document.addEventListener('contextmenu', (e) => {
    if (!window.ProkodeAuth || !window.ProkodeAuth.isAuthenticated()) {
        e.preventDefault();
        return false;
    }
    
    // Allow right-click for authenticated admin users
    if (window.ProkodeAuth.hasRole('IAM-Admins')) {
        return true;
    }
    
    e.preventDefault();
    return false;
});

// Enhanced keyboard shortcuts (only for authenticated users)
document.addEventListener('keydown', (e) => {
    if (!window.ProkodeAuth || !window.ProkodeAuth.isAuthenticated()) {
        return;
    }
    
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
    
    // Admin shortcut: Alt + A = Admin (for admin users)
    if (e.altKey && e.key === 'a' && window.ProkodeAuth.hasRole('IAM-Admins')) {
        e.preventDefault();
        console.log('🔧 Admin shortcut activated');
        // Could open admin panel or perform admin action
    }
});

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

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

// Session activity tracking for security
let lastActivity = Date.now();

document.addEventListener('mousemove', () => {
    lastActivity = Date.now();
});

document.addEventListener('keypress', () => {
    lastActivity = Date.now();
});

// Check for inactivity (30 minutes)
setInterval(() => {
    const inactiveTime = Date.now() - lastActivity;
    const thirtyMinutes = 30 * 60 * 1000;
    
    if (inactiveTime > thirtyMinutes && window.ProkodeAuth && window.ProkodeAuth.isAuthenticated()) {
        console.log('⏰ User inactive for 30 minutes, checking session...');
        if (window.ProkodeAuth.getAuthManager()) {
            window.ProkodeAuth.getAuthManager().checkAuthState();
        }
    }
}, 60000); // Check every minute

console.log('🏢 Prokode Labs Main Application Module Loaded');
