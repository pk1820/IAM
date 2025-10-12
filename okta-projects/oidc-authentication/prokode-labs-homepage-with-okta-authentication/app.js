// =============================================================================
// PROKODE LABS - MAIN APPLICATION LOGIC (Enhanced Version)
// Updated with client recommendations and improved functionality
// =============================================================================

// Wait for authentication before initializing app features
let appInitialized = false;
let authTimeoutId = null;

// Listen for authentication completion with enhanced handling
document.addEventListener('userAuthenticated', (event) => {
    console.log('👤 User authenticated successfully, initializing app features...');
    console.log('📊 Auth event details:', event.detail);
    initializeApp(event.detail);
});

// Enhanced check for already authenticated users on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('📱 DOM loaded, checking authentication status...');
    
    // Small delay to let auth system initialize first
    authTimeoutId = setTimeout(() => {
        if (window.ProkodeAuth && window.ProkodeAuth.isAuthenticated()) {
            console.log('👤 User already authenticated, initializing app features...');
            const sessionInfo = window.ProkodeAuth.getSessionInfo();
            initializeApp({ user: sessionInfo?.user, authTime: Date.now() });
        } else {
            console.log('🔐 User not authenticated, waiting for auth...');
        }
    }, 1000);
});

// Cleanup timeout on page unload
window.addEventListener('beforeunload', () => {
    if (authTimeoutId) {
        clearTimeout(authTimeoutId);
    }
});

// =============================================================================
// ENHANCED MAIN APP INITIALIZATION
// =============================================================================

function initializeApp(authDetails = {}) {
    if (appInitialized) {
        console.log('ℹ️ App already initialized, skipping...');
        return; // Prevent double initialization
    }

    console.log('🚀 Initializing enhanced Prokode Labs application...');
    
    try {
        // Initialize all enhanced classes with error handling
        initializeEnhancedFeatures();
        
        // Initialize role-based features with user context
        if (authDetails.user) {
            initializeRoleBasedFeatures(authDetails.user);
            initializePersonalizedContent(authDetails.user);
        }
        
        // Initialize accessibility features
        initializeAccessibilityFeatures();
        
        // Initialize performance monitoring
        initializePerformanceMonitoring();
        
        // Add loading complete class to body with enhanced animation
        document.body.classList.add('loaded');
        
        // Enhanced page load complete animation
        setTimeout(() => {
            document.body.classList.add('fully-loaded');
        }, 500);
        
        appInitialized = true;
        
        console.log('✅ Prokode Labs Internal Portal - Fully Loaded and Enhanced');
        console.log('🔐 For internal use only - Unauthorized access prohibited');
        console.log('👥 Active user session:', authDetails.user?.preferred_username || 'Unknown');
        
        // Announce completion to screen readers
        announceToScreenReader('Application loaded successfully. Welcome to Prokode Labs Portal.');
        
    } catch (error) {
        console.error('❌ Enhanced app initialization failed:', error);
        handleAppInitializationError(error);
    }
}

// =============================================================================
// ENHANCED FEATURE INITIALIZATION
// =============================================================================

function initializeEnhancedFeatures() {
    console.log('🔧 Initializing enhanced application features...');
    
    // Initialize all core classes with enhanced error handling
    const featureClasses = [
        { name: 'MobileNavigation', class: MobileNavigation },
        { name: 'SmoothScroll', class: SmoothScroll },
        { name: 'NavbarScroll', class: NavbarScroll },
        { name: 'AnimationObserver', class: AnimationObserver },
        { name: 'ProgressBarAnimation', class: ProgressBarAnimation },
        { name: 'ActiveNavLink', class: ActiveNavLink },
        { name: 'LazyImageLoader', class: LazyImageLoader },
        { name: 'EnhancedKeyboardNavigation', class: EnhancedKeyboardNavigation },
        { name: 'ThemeManager', class: ThemeManager },
        { name: 'PerformanceOptimizer', class: PerformanceOptimizer }
    ];
    
    featureClasses.forEach(({ name, class: FeatureClass }) => {
        try {
            if (FeatureClass) {
                new FeatureClass();
                console.log(`✅ ${name} initialized successfully`);
            } else {
                console.warn(`⚠️ ${name} class not found, skipping...`);
            }
        } catch (error) {
            console.error(`❌ Failed to initialize ${name}:`, error);
        }
    });
}

// =============================================================================
// ENHANCED ROLE-BASED FEATURES
// =============================================================================

function initializeRoleBasedFeatures(user) {
    if (!user || !user.groups) {
        console.log('ℹ️ No user groups found, skipping role-based features');
        return;
    }

    console.log('👥 Initializing enhanced role-based features for groups:', user.groups);

    // Enhanced admin features for IAM-Admins group
    if (window.ProkodeAuth.hasRole('IAM-Admins')) {
        enableEnhancedAdminFeatures(user);
    }

    // Enhanced team features for IAM-Team
    if (window.ProkodeAuth.hasRole('IAM-Team')) {
        enableEnhancedTeamFeatures(user);
    }
    
    // Enhanced security features for Security-Team
    if (window.ProkodeAuth.hasRole('Security-Team')) {
        enableSecurityTeamFeatures(user);
    }

    // Add comprehensive user role indicators to UI
    addEnhancedRoleIndicators(user.groups);
    
    // Initialize role-specific keyboard shortcuts
    initializeRoleBasedShortcuts(user.groups);
}

function enableEnhancedAdminFeatures(user) {
    console.log('🔧 Enabling enhanced administrator features...');
    
    // Add enhanced admin panel to resources section
    const resourcesGrid = document.querySelector('.resources-grid');
    if (resourcesGrid && !resourcesGrid.querySelector('.admin-dashboard-card')) {
        const adminCard = createEnhancedResourceCard(
            '⚙️',
            'Admin Dashboard',
            'System administration, user management, and advanced configuration tools',
            '#admin-dashboard',
            'admin'
        );
        adminCard.classList.add('admin-dashboard-card', 'admin-feature');
        resourcesGrid.appendChild(adminCard);
    }
    
    // Add enhanced system monitoring card
    if (resourcesGrid && !resourcesGrid.querySelector('.system-monitor-card')) {
        const monitorCard = createEnhancedResourceCard(
            '📊',
            'System Monitor',
            'Real-time system health, performance metrics, and security alerts',
            '#system-monitor',
            'admin'
        );
        monitorCard.classList.add('system-monitor-card', 'admin-feature');
        resourcesGrid.appendChild(monitorCard);
    }
    
    // Add admin navigation shortcuts
    addEnhancedAdminNavigation(user);
    
    // Initialize admin-specific event listeners
    initializeAdminEventListeners();
}

function enableEnhancedTeamFeatures(user) {
    console.log('👥 Enabling enhanced team member features...');
    
    // Add team-specific resources
    const resourcesGrid = document.querySelector('.resources-grid');
    if (resourcesGrid && !resourcesGrid.querySelector('.team-analytics-card')) {
        const teamCard = createEnhancedResourceCard(
            '📈',
            'Team Analytics',
            'IAM team performance metrics, project status, and collaboration tools',
            '#team-analytics',
            'team'
        );
        teamCard.classList.add('team-analytics-card', 'team-feature');
        resourcesGrid.appendChild(teamCard);
    }
    
    // Add collaboration tools
    if (resourcesGrid && !resourcesGrid.querySelector('.collaboration-card')) {
        const collabCard = createEnhancedResourceCard(
            '🤝',
            'Collaboration Hub',
            'Team communication, document sharing, and project coordination',
            '#collaboration',
            'team'
        );
        collabCard.classList.add('collaboration-card', 'team-feature');
        resourcesGrid.appendChild(collabCard);
    }
}

function enableSecurityTeamFeatures(user) {
    console.log('🛡️ Enabling security team features...');
    
    // Add security-specific resources
    const resourcesGrid = document.querySelector('.resources-grid');
    if (resourcesGrid && !resourcesGrid.querySelector('.security-dashboard-card')) {
        const securityCard = createEnhancedResourceCard(
            '🔒',
            'Security Dashboard',
            'Security monitoring, threat analysis, and incident response tools',
            '#security-dashboard',
            'security'
        );
        securityCard.classList.add('security-dashboard-card', 'security-feature');
        resourcesGrid.appendChild(securityCard);
    }
}

function createEnhancedResourceCard(icon, title, description, link, type = 'default') {
    const card = document.createElement('div');
    card.className = `resource-card card enhanced-card ${type}-card`;
    card.setAttribute('role', 'article');
    card.setAttribute('tabindex', '0');
    
    // Enhanced card styling based on type
    const typeColors = {
        admin: 'linear-gradient(135deg, #ef4444, #dc2626)',
        team: 'linear-gradient(135deg, #3b82f6, #2563eb)',
        security: 'linear-gradient(135deg, #f59e0b, #d97706)',
        default: 'linear-gradient(135deg, #6b7280, #4b5563)'
    };
    
    card.innerHTML = `
        <div class="card-header" style="border-left: 4px solid; border-image: ${typeColors[type]} 1;">
            <div class="resource-icon enhanced-icon" aria-hidden="true">${icon}</div>
            <div class="card-badge ${type}-badge">${type.toUpperCase()}</div>
        </div>
        <h3 class="card-title">${title}</h3>
        <p class="card-description">${description}</p>
        <div class="card-actions">
            <button class="resource-link enhanced-link" data-href="${link}" aria-label="Access ${title}">
                Access <span aria-hidden="true">→</span>
            </button>
        </div>
        <div class="card-footer">
            <span class="access-indicator">✅ Authorized Access</span>
        </div>
    `;
    
    // Enhanced interaction handling
    const linkButton = card.querySelector('.resource-link');
    linkButton.addEventListener('click', (e) => {
        e.preventDefault();
        handleResourceAccess(link, title, type);
    });
    
    // Enhanced keyboard support
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            linkButton.click();
        }
    });
    
    return card;
}

function handleResourceAccess(link, title, type) {
    console.log(`🔗 Accessing ${type} resource: ${title} (${link})`);
    announceToScreenReader(`Accessing ${title}`);
    
    // Enhanced resource access with type-specific handling
    switch (type) {
        case 'admin':
            console.log('🔧 Admin resource access logged');
            break;
        case 'team':
            console.log('👥 Team resource access logged');
            break;
        case 'security':
            console.log('🛡️ Security resource access logged');
            break;
    }
    
    // Simulate navigation or modal opening
    showResourceAccessModal(title, type);
}

function showResourceAccessModal(title, type) {
    // Create enhanced access modal
    const modal = document.createElement('div');
    modal.className = 'resource-access-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-labelledby', 'modal-title');
    modal.setAttribute('aria-describedby', 'modal-description');
    
    modal.innerHTML = `
        <div class="modal-backdrop"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2 id="modal-title">Accessing ${title}</h2>
                <button class="modal-close" aria-label="Close modal">✕</button>
            </div>
            <div class="modal-body">
                <p id="modal-description">This feature is currently in development. Access will be available in a future update.</p>
                <div class="modal-info">
                    <p><strong>Resource Type:</strong> ${type.charAt(0).toUpperCase() + type.slice(1)}</p>
                    <p><strong>Access Level:</strong> Authorized</p>
                    <p><strong>Status:</strong> Coming Soon</p>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary modal-acknowledge">Acknowledge</button>
            </div>
        </div>
    `;
    
    // Enhanced modal styling
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: modalFadeIn 0.3s ease-out;
    `;
    
    document.body.appendChild(modal);
    
    // Focus management
    setTimeout(() => {
        const closeButton = modal.querySelector('.modal-close');
        if (closeButton) closeButton.focus();
    }, 100);
    
    // Event listeners
    const closeModal = () => {
        modal.style.animation = 'modalFadeOut 0.2s ease-in';
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 200);
    };
    
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-acknowledge').addEventListener('click', closeModal);
    modal.querySelector('.modal-backdrop').addEventListener('click', closeModal);
    
    // Keyboard handling
    modal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// =============================================================================
// ENHANCED UI COMPONENTS
// =============================================================================

function addEnhancedAdminNavigation(user) {
    const navLogo = document.querySelector('.nav-logo h2');
    if (navLogo && !navLogo.querySelector('.admin-badge')) {
        const adminBadge = document.createElement('span');
        adminBadge.className = 'admin-badge enhanced-badge';
        adminBadge.textContent = 'ADMIN';
        adminBadge.setAttribute('aria-label', 'Administrator access');
        adminBadge.style.cssText = `
            background: linear-gradient(45deg, #ef4444, #dc2626);
            color: white;
            font-size: 0.6rem;
            padding: 3px 8px;
            border-radius: 12px;
            margin-left: 12px;
            font-weight: 700;
            text-shadow: 0 1px 2px rgba(0,0,0,0.5);
            box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3);
            animation: badgePulse 2s infinite;
        `;
        navLogo.appendChild(adminBadge);
    }
}

function addEnhancedRoleIndicators(groups) {
    // Add enhanced role indicators throughout the interface
    const indicatorContainer = document.createElement('div');
    indicatorContainer.className = 'role-indicators-container';
    indicatorContainer.setAttribute('aria-label', 'User roles and permissions');
    
    groups.forEach(group => {
        const indicator = document.createElement('span');
        indicator.className = 'role-indicator';
        indicator.textContent = group.replace('-', ' ');
        indicator.setAttribute('title', `${group} access granted`);
        
        // Style based on role importance
        if (group.includes('Admin')) {
            indicator.style.background = 'linear-gradient(45deg, #ef4444, #dc2626)';
        } else if (group.includes('Security')) {
            indicator.style.background = 'linear-gradient(45deg, #f59e0b, #d97706)';
        } else if (group.includes('Team')) {
            indicator.style.background = 'linear-gradient(45deg, #3b82f6, #2563eb)';
        } else {
            indicator.style.background = 'linear-gradient(45deg, #6b7280, #4b5563)';
        }
        
        indicator.style.cssText += `
            color: white;
            font-size: 0.7rem;
            padding: 2px 6px;
            border-radius: 8px;
            margin: 2px;
            font-weight: 600;
            display: inline-block;
        `;
        
        indicatorContainer.appendChild(indicator);
    });
    
    // Add to footer for visibility
    const footer = document.querySelector('.footer-content');
    if (footer && !footer.querySelector('.role-indicators-container')) {
        const roleSection = document.createElement('div');
        roleSection.className = 'footer-section role-section';
        roleSection.innerHTML = '<h4>Your Access Level</h4>';
        roleSection.appendChild(indicatorContainer);
        footer.appendChild(roleSection);
    }
}

// =============================================================================
// ENHANCED ACCESSIBILITY FEATURES
// =============================================================================

function initializeAccessibilityFeatures() {
    console.log('♿ Initializing enhanced accessibility features...');
    
    // Enhanced focus management
    initializeEnhancedFocusManagement();
    
    // Enhanced keyboard navigation
    initializeEnhancedKeyboardSupport();
    
    // Enhanced screen reader support
    initializeEnhancedScreenReaderSupport();
    
    // Enhanced color contrast support
    initializeContrastSupport();
    
    console.log('✅ Enhanced accessibility features initialized');
}

function initializeEnhancedFocusManagement() {
    // Enhanced focus indicators
    const focusableElements = document.querySelectorAll(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', (e) => {
            e.target.classList.add('enhanced-focus');
        });
        
        element.addEventListener('blur', (e) => {
            e.target.classList.remove('enhanced-focus');
        });
    });
}

function initializeEnhancedKeyboardSupport() {
    // Global keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Skip if user is typing in an input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        // Enhanced keyboard shortcuts for authenticated users
        if (window.ProkodeAuth && window.ProkodeAuth.isAuthenticated()) {
            handleEnhancedKeyboardShortcuts(e);
        }
    });
}

function handleEnhancedKeyboardShortcuts(e) {
    const shortcuts = {
        // Navigation shortcuts
        'h': () => navigateToSection('#home', 'Home'),
        's': () => navigateToSection('#services', 'Services'),
        'p': () => navigateToSection('#projects', 'Projects'),
        't': () => navigateToSection('#team', 'Team'),
        'r': () => navigateToSection('#resources', 'Resources'),
        'c': () => navigateToSection('#contact', 'Contact'),
        
        // Utility shortcuts
        'Escape': () => closeFocusTrap(),
        '/': () => showKeyboardShortcuts()
    };
    
    // Alt + key combinations
    if (e.altKey && shortcuts[e.key]) {
        e.preventDefault();
        shortcuts[e.key]();
    }
    
    // Special shortcuts
    if (!e.altKey && shortcuts[e.key]) {
        // Only for non-Alt shortcuts like Escape and /
        if (['Escape', '/'].includes(e.key)) {
            e.preventDefault();
            shortcuts[e.key]();
        }
    }
}

function navigateToSection(selector, sectionName) {
    const element = document.querySelector(selector);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        announceToScreenReader(`Navigating to ${sectionName} section`);
        
        // Focus the section for screen readers
        element.setAttribute('tabindex', '-1');
        element.focus();
        setTimeout(() => {
            element.removeAttribute('tabindex');
        }, 1000);
    }
}

function showKeyboardShortcuts() {
    const modal = document.createElement('div');
    modal.className = 'keyboard-shortcuts-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-labelledby', 'shortcuts-title');
    
    modal.innerHTML = `
        <div class="modal-backdrop"></div>
        <div class="modal-content shortcuts-content">
            <div class="modal-header">
                <h2 id="shortcuts-title">Keyboard Shortcuts</h2>
                <button class="modal-close" aria-label="Close shortcuts">✕</button>
            </div>
            <div class="modal-body">
                <div class="shortcuts-grid">
                    <div class="shortcut-category">
                        <h3>Navigation</h3>
                        <div class="shortcut-item">
                            <kbd>Alt + H</kbd> <span>Home</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>Alt + S</kbd> <span>Services</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>Alt + P</kbd> <span>Projects</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>Alt + T</kbd> <span>Team</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>Alt + R</kbd> <span>Resources</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>Alt + C</kbd> <span>Contact</span>
                        </div>
                    </div>
                    <div class="shortcut-category">
                        <h3>Utility</h3>
                        <div class="shortcut-item">
                            <kbd>Escape</kbd> <span>Close dialog/modal</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>/</kbd> <span>Show this help</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>Ctrl + Shift + L</kbd> <span>Quick logout</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10001;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: modalFadeIn 0.3s ease-out;
    `;
    
    document.body.appendChild(modal);
    
    // Focus and event handling
    setTimeout(() => modal.querySelector('.modal-close').focus(), 100);
    
    const closeModal = () => {
        document.body.removeChild(modal);
    };
    
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-backdrop').addEventListener('click', closeModal);
    modal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
    
    announceToScreenReader('Keyboard shortcuts dialog opened');
}

function initializeEnhancedScreenReaderSupport() {
    // Add enhanced ARIA landmarks
    const main = document.querySelector('main');
    if (main && !main.getAttribute('role')) {
        main.setAttribute('role', 'main');
    }
    
    // Enhanced live regions
    if (!document.getElementById('status-region')) {
        const statusRegion = document.createElement('div');
        statusRegion.id = 'status-region';
        statusRegion.setAttribute('aria-live', 'polite');
        statusRegion.setAttribute('aria-atomic', 'true');
        statusRegion.style.position = 'absolute';
        statusRegion.style.left = '-10000px';
        document.body.appendChild(statusRegion);
    }
    
    // Enhanced heading structure validation
    validateHeadingStructure();
}

function validateHeadingStructure() {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let lastLevel = 0;
    
    headings.forEach(heading => {
        const level = parseInt(heading.tagName.charAt(1));
        if (level > lastLevel + 1) {
            console.warn(`⚠️ Heading level skip detected: ${heading.tagName} after h${lastLevel}`);
        }
        lastLevel = level;
    });
}

function initializeContrastSupport() {
    // Add high contrast mode support
    if (window.matchMedia && window.matchMedia('(prefers-contrast: high)').matches) {
        document.body.classList.add('high-contrast-mode');
        console.log('🎨 High contrast mode enabled');
    }
    
    // Monitor for contrast preference changes
    if (window.matchMedia) {
        const contrastMedia = window.matchMedia('(prefers-contrast: high)');
        contrastMedia.addListener((e) => {
            if (e.matches) {
                document.body.classList.add('high-contrast-mode');
                announceToScreenReader('High contrast mode enabled');
            } else {
                document.body.classList.remove('high-contrast-mode');
                announceToScreenReader('High contrast mode disabled');
            }
        });
    }
}

// =============================================================================
// ENHANCED PERFORMANCE MONITORING
// =============================================================================

function initializePerformanceMonitoring() {
    console.log('📊 Initializing performance monitoring...');
    
    // Enhanced performance metrics
    if ('performance' in window) {
        // Monitor page load metrics
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                if (perfData) {
                    const metrics = {
                        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                        loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
                        totalLoadTime: perfData.loadEventEnd - perfData.fetchStart
                    };
                    
                    console.log('📈 Performance metrics:', metrics);
                    
                    // Log performance for internal monitoring
                    if (metrics.totalLoadTime > 3000) {
                        console.warn('⚠️ Slow page load detected:', metrics.totalLoadTime, 'ms');
                    }
                }
            }, 1000);
        });
        
        // Monitor resource loading
        monitorResourceLoading();
        
        // Monitor memory usage (if available)
        monitorMemoryUsage();
    }
}

function monitorResourceLoading() {
    const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
            if (entry.duration > 1000) {
                console.log(`🐌 Slow resource loading: ${entry.name} took ${entry.duration}ms`);
            }
        });
    });
    
    observer.observe({ entryTypes: ['resource'] });
}

function monitorMemoryUsage() {
    if ('memory' in performance) {
        setInterval(() => {
            const memory = (performance as any).memory;
            const used = memory.usedJSHeapSize / 1024 / 1024;
            const total = memory.totalJSHeapSize / 1024 / 1024;
            
            if (used / total > 0.9) {
                console.warn('⚠️ High memory usage detected:', `${used.toFixed(2)}MB / ${total.toFixed(2)}MB`);
            }
        }, 60000); // Check every minute
    }
}

// =============================================================================
// ENHANCED EXISTING CLASSES (Updated Versions)
// =============================================================================

// Enhanced Mobile Navigation Toggle
class MobileNavigation {
    constructor() {
        this.mobileMenu = document.getElementById('mobile-menu');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.isOpen = false;
        this.init();
    }

    init() {
        if (!this.mobileMenu || !this.navMenu) return;

        // Enhanced toggle functionality
        this.mobileMenu.addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        // Enhanced keyboard support
        this.mobileMenu.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleMobileMenu();
            }
        });

        // Close mobile menu when clicking on nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });

        // Enhanced outside click detection
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.mobileMenu.contains(e.target) && !this.navMenu.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Enhanced window resize handling
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.isOpen) {
                this.closeMobileMenu();
            }
        });

        // Enhanced escape key support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMobileMenu();
                this.mobileMenu.focus();
            }
        });
    }

    toggleMobileMenu() {
        this.isOpen = !this.isOpen;
        
        this.mobileMenu.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        
        // Enhanced ARIA attributes
        this.mobileMenu.setAttribute('aria-expanded', this.isOpen.toString());
        
        // Enhanced body scroll prevention
        if (this.isOpen) {
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
            
            // Focus management
            setTimeout(() => {
                const firstLink = this.navMenu.querySelector('.nav-link');
                if (firstLink) firstLink.focus();
            }, 100);
            
            announceToScreenReader('Mobile navigation menu opened');
        } else {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
            
            announceToScreenReader('Mobile navigation menu closed');
        }
    }

    closeMobileMenu() {
        if (!this.isOpen) return;
        
        this.isOpen = false;
        this.mobileMenu.classList.remove('active');
        this.navMenu.classList.remove('active');
        this.mobileMenu.setAttribute('aria-expanded', 'false');
        
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
    }
}

// Enhanced Smooth Scroll with Offset for Fixed Navigation
class SmoothScroll {
    constructor() {
        this.navHeight = 70 + 40; // Navbar height + auth status bar
        this.init();
    }

    init() {
        // Enhanced smooth scroll behavior with accessibility
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = anchor.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - this.navHeight;
                    
                    // Smooth scroll with enhanced options
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Enhanced focus management for accessibility
                    setTimeout(() => {
                        targetElement.setAttribute('tabindex', '-1');
                        targetElement.focus();
                        
                        // Remove tabindex after focus
                        setTimeout(() => {
                            targetElement.removeAttribute('tabindex');
                        }, 1000);
                    }, 500);
                    
                    // Announce navigation to screen readers
                    const sectionName = targetId.replace('#', '');
                    announceToScreenReader(`Navigated to ${sectionName} section`);
                }
            });
        });
    }
}

// Enhanced Navbar Background on Scroll
class NavbarScroll {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.lastScrollY = window.scrollY;
        this.init();
    }

    init() {
        if (!this.navbar) return;

        // Enhanced scroll handler with performance optimization
        const handleScroll = throttle(() => {
            const scrolled = window.scrollY > 50;
            const scrollDirection = window.scrollY > this.lastScrollY ? 'down' : 'up';
            
            if (scrolled) {
                this.navbar.style.background = 'rgba(23, 49, 89, 0.98)';
                this.navbar.style.backdropFilter = 'blur(15px)';
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.style.background = 'rgba(23, 49, 89, 0.95)';
                this.navbar.style.backdropFilter = 'blur(10px)';
                this.navbar.classList.remove('scrolled');
            }
            
            // Enhanced scroll direction handling
            if (Math.abs(window.scrollY - this.lastScrollY) > 5) {
                this.navbar.setAttribute('data-scroll-direction', scrollDirection);
            }
            
            this.lastScrollY = window.scrollY;
        }, 10);

        window.addEventListener('scroll', handleScroll, { passive: true });
    }
}

// Enhanced Animation Observer
class AnimationObserver {
    constructor() {
        this.observerOptions = {
            threshold: [0.1, 0.5, 1],
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }

    init() {
        // Enhanced intersection observer with multiple thresholds
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Enhanced animation trigger
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    entry.target.classList.add('animated');
                    
                    // Announce to screen readers for important sections
                    if (entry.target.matches('.hero, .section-header')) {
                        const sectionName = entry.target.id || entry.target.querySelector('h1, h2')?.textContent || 'section';
                        announceToScreenReader(`${sectionName} section is now visible`);
                    }
                } else {
                    // Enhanced animation reset for elements that go out of view
                    if (entry.boundingClientRect.top > 0) {
                        entry.target.style.opacity = '0';
                        entry.target.style.transform = 'translateY(30px)';
                        entry.target.classList.remove('animated');
                    }
                }
            });
        }, this.observerOptions);

        this.observeElements();
    }

    observeElements() {
        const elementsToAnimate = [
            '.mission-card',
            '.vision-card',
            '.service-card',
            '.project-card',
            '.resource-card',
            '.team-card',
            '.contact-card',
            '.hero-content',
            '.section-header'
        ];

        elementsToAnimate.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((element, index) => {
                // Enhanced initial state
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px)';
                element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                element.style.transitionDelay = `${index * 0.1}s`;

                this.observer.observe(element);
            });
        });
    }
}

// Enhanced Progress Bar Animation
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
                    
                    // Enhanced animation with easing
                    progressBar.style.width = '0%';
                    progressBar.style.transition = 'none';
                    
                    setTimeout(() => {
                        progressBar.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
                        progressBar.style.width = targetWidth;
                        
                        // Add completion announcement for screen readers
                        setTimeout(() => {
                            const percentage = targetWidth;
                            announceToScreenReader(`Progress bar reached ${percentage}`);
                        }, 1500);
                    }, 300);
                    
                    observer.unobserve(progressBar);
                }
            });
        }, { threshold: 0.5 });

        progressBars.forEach(bar => {
            observer.observe(bar);
        });
    }
}

// Enhanced Active Navigation Link Highlighter
class ActiveNavLink {
    constructor() {
        this.sections = document.querySelectorAll('section[id]');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.offset = 140; // Account for auth bar + nav bar
        this.init();
    }

    init() {
        // Enhanced scroll handler with performance optimization
        const handleScroll = throttle(() => {
            this.highlightActiveSection();
        }, 50);

        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    highlightActiveSection() {
        const scrollY = window.pageYOffset;

        let activeSection = null;
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop - this.offset;
            const sectionHeight = section.offsetHeight;
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                activeSection = section.getAttribute('id');
            }
        });

        // Enhanced active link management
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            link.setAttribute('aria-current', 'false');
        });

        if (activeSection) {
            const activeLink = document.querySelector(`a[href="#${activeSection}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
                activeLink.setAttribute('aria-current', 'page');
            }
        }
    }
}

// Enhanced Lazy Loading for Background Images
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
                    
                    // Enhanced image loading with fade-in
                    img.style.opacity = '0';
                    img.style.transition = 'opacity 0.5s ease';
                    
                    // Simulate image loading delay for better UX
                    setTimeout(() => {
                        img.style.opacity = '1';
                        img.classList.add('loaded');
                    }, 100);
                    
                    imageObserver.unobserve(img);
                }
            });
        });

        imageElements.forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// New Enhanced Classes

// Enhanced Keyboard Navigation
class EnhancedKeyboardNavigation {
    constructor() {
        this.focusableSelector = 'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])';
        this.init();
    }

    init() {
        this.setupFocusTrap();
        this.setupFocusManagement();
        this.setupKeyboardShortcuts();
    }

    setupFocusTrap() {
        // Enhanced focus trapping for modals and overlays
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const modal = document.querySelector('.modal:not([style*="display: none"])');
                if (modal) {
                    this.trapFocus(e, modal);
                }
            }
        });
    }

    trapFocus(e, container) {
        const focusableElements = container.querySelectorAll(this.focusableSelector);
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }

    setupFocusManagement() {
        // Enhanced focus indicators
        document.addEventListener('focusin', (e) => {
            e.target.classList.add('keyboard-focused');
        });

        document.addEventListener('focusout', (e) => {
            e.target.classList.remove('keyboard-focused');
        });
    }

    setupKeyboardShortcuts() {
        // Already handled in main app initialization
        console.log('✅ Enhanced keyboard navigation initialized');
    }
}

// Theme Manager for Enhanced Customization
class ThemeManager {
    constructor() {
        this.currentTheme = 'dark'; // Default theme
        this.init();
    }

    init() {
        this.detectSystemTheme();
        this.setupThemeToggle();
        console.log('🎨 Theme manager initialized');
    }

    detectSystemTheme() {
        // Respect user's system theme preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            this.currentTheme = 'light';
        }
        
        // Apply theme
        this.applyTheme(this.currentTheme);
        
        // Listen for system theme changes
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
            mediaQuery.addListener((e) => {
                this.currentTheme = e.matches ? 'light' : 'dark';
                this.applyTheme(this.currentTheme);
                announceToScreenReader(`Theme changed to ${this.currentTheme} mode`);
            });
        }
    }

    applyTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        console.log(`🎨 Applied ${theme} theme`);
    }

    setupThemeToggle() {
        // Future enhancement: Add theme toggle button
        // This would be implemented when UI includes a theme toggle
    }
}

// Performance Optimizer
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.optimizeAnimations();
        this.optimizeImages();
        this.setupPerformanceObserver();
        console.log('⚡ Performance optimizer initialized');
    }

    optimizeAnimations() {
        // Respect reduced motion preference
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.body.classList.add('reduce-motion');
            console.log('♿ Reduced motion mode enabled');
            announceToScreenReader('Reduced motion mode enabled for accessibility');
        }
    }

    optimizeImages() {
        // Implement image optimization strategies
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            // Add loading="lazy" if not already present
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
        });
    }

    setupPerformanceObserver() {
        // Already handled in main performance monitoring
        if ('PerformanceObserver' in window) {
            console.log('📊 Performance observer available');
        }
    }
}

// =============================================================================
// ENHANCED UTILITY FUNCTIONS
// =============================================================================

// Enhanced personalization based on user data
function initializePersonalizedContent(user) {
    console.log('🎯 Initializing personalized content for user:', user.preferred_username);
    
    // Personalize welcome message
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle && user.name) {
        const firstName = user.name.split(' ')[0];
        const personalizedTitle = `Welcome back, ${firstName}!`;
        const subtitle = document.createElement('p');
        subtitle.className = 'personalized-welcome';
        subtitle.textContent = personalizedTitle;
        subtitle.style.cssText = `
            color: var(--accent-teal);
            font-size: 1.2rem;
            font-weight: 600;
            margin-bottom: 16px;
            text-align: center;
        `;
        heroTitle.parentNode.insertBefore(subtitle, heroTitle);
    }
    
    // Personalize based on last login time
    if (user.auth_time) {
        const lastLogin = new Date(user.auth_time * 1000);
        const loginInfo = document.createElement('div');
        loginInfo.className = 'last-login-info';
        loginInfo.innerHTML = `
            <small style="color: var(--text-muted); font-size: 0.875rem;">
                Last login: ${lastLogin.toLocaleDateString()} at ${lastLogin.toLocaleTimeString()}
            </small>
        `;
        
        const authStatus = document.getElementById('auth-status');
        if (authStatus) {
            authStatus.appendChild(loginInfo);
        }
    }
}

// Enhanced role-based keyboard shortcuts
function initializeRoleBasedShortcuts(groups) {
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        // Admin shortcuts
        if (groups.includes('IAM-Admins')) {
            if (e.altKey && e.shiftKey && e.key === 'A') {
                e.preventDefault();
                console.log('🔧 Admin panel shortcut activated');
                announceToScreenReader('Admin panel access - Coming soon');
            }
        }
        
        // Team shortcuts
        if (groups.includes('IAM-Team')) {
            if (e.altKey && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                console.log('👥 Team dashboard shortcut activated');
                announceToScreenReader('Team dashboard access - Coming soon');
            }
        }
        
        // Security team shortcuts
        if (groups.includes('Security-Team')) {
            if (e.altKey && e.shiftKey && e.key === 'S') {
                e.preventDefault();
                console.log('🛡️ Security dashboard shortcut activated');
                announceToScreenReader('Security dashboard access - Coming soon');
            }
        }
    });
}

// Enhanced admin event listeners
function initializeAdminEventListeners() {
    // Enhanced logging for admin actions
    const adminElements = document.querySelectorAll('.admin-feature');
    adminElements.forEach(element => {
        element.addEventListener('click', (e) => {
            console.log('🔧 Admin feature accessed:', e.target.textContent || e.target.getAttribute('aria-label'));
        });
    });
}

// Enhanced error handling for app initialization
function handleAppInitializationError(error) {
    console.error('🚨 App initialization failed:', error);
    
    // Show user-friendly error message
    const errorContainer = document.createElement('div');
    errorContainer.className = 'app-error-container';
    errorContainer.innerHTML = `
        <div class="app-error-card">
            <div class="error-icon">⚠️</div>
            <h2>Application Loading Error</h2>
            <p>There was an issue loading the application. Please try refreshing the page.</p>
            <div class="error-actions">
                <button onclick="window.location.reload()" class="btn btn-primary">
                    Refresh Page
                </button>
                <a href="mailto:internal@prokodelabs.com?subject=App Loading Error" class="btn btn-secondary">
                    Report Issue
                </a>
            </div>
        </div>
    `;
    
    errorContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    document.body.appendChild(errorContainer);
    
    // Announce error to screen readers
    announceToScreenReader('Application loading error. Please refresh the page or contact support.');
}

// Global utility functions
function closeFocusTrap() {
    // Close any open modals or focus traps
    const openModals = document.querySelectorAll('.modal:not([style*="display: none"])');
    openModals.forEach(modal => {
        const closeButton = modal.querySelector('.modal-close');
        if (closeButton) {
            closeButton.click();
        }
    });
}

function announceToScreenReader(message) {
    const statusRegion = document.getElementById('status-region') || document.getElementById('aria-live-region');
    if (statusRegion) {
        statusRegion.textContent = message;
        setTimeout(() => {
            statusRegion.textContent = '';
        }, 1000);
    }
}

// Enhanced throttle function for performance
function throttle(func, wait) {
    let timeout;
    let previous = 0;
    
    return function executedFunction(...args) {
        const now = Date.now();
        const remaining = wait - (now - previous);
        
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            func.apply(this, args);
        } else if (!timeout) {
            timeout = setTimeout(() => {
                previous = Date.now();
                timeout = null;
                func.apply(this, args);
            }, remaining);
        }
    };
}

// Enhanced debounce function for performance
function debounce(func, wait, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func.apply(this, args);
        };
        
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        
        if (callNow) func.apply(this, args);
    };
}

// =============================================================================
// ENHANCED SECURITY AND SESSION MANAGEMENT
// =============================================================================

// Enhanced error handling with authentication context
window.addEventListener('error', (e) => {
    console.error('🚨 Application Error:', e.error);
    
    // Enhanced auth-related error handling
    if (e.error && e.error.message && e.error.message.toLowerCase().includes('auth')) {
        console.log('🔒 Authentication-related error detected, validating session...');
        if (window.ProkodeAuth && window.ProkodeAuth.getAuthManager()) {
            window.ProkodeAuth.getAuthManager().validateSession();
        }
    }
    
    // Log error for monitoring (in production, this would go to a logging service)
    const errorLog = {
        message: e.error?.message || 'Unknown error',
        stack: e.error?.stack,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        user: window.ProkodeAuth?.getCurrentUser()?.preferred_username || 'Anonymous'
    };
    
    console.log('📝 Error logged:', errorLog);
});

// Enhanced right-click prevention with role-based access
document.addEventListener('contextmenu', (e) => {
    // Allow for development environment
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return true;
    }
    
    if (!window.ProkodeAuth || !window.ProkodeAuth.isAuthenticated()) {
        e.preventDefault();
        return false;
    }

    // Enhanced role-based right-click access
    if (window.ProkodeAuth.hasRole('IAM-Admins') || window.ProkodeAuth.hasRole('Security-Team')) {
        console.log('🔧 Right-click allowed for authorized user');
        return true;
    }
    
    e.preventDefault();
    return false;
});

// Enhanced comprehensive error boundary
window.addEventListener('unhandledrejection', (event) => {
    console.error('🚨 Unhandled Promise Rejection:', event.reason);
    
    // Prevent default browser behavior
    event.preventDefault();
    
    // Enhanced error reporting
    const errorDetails = {
        type: 'unhandledrejection',
        reason: event.reason?.toString() || 'Unknown reason',
        stack: event.reason?.stack,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        user: window.ProkodeAuth?.getCurrentUser()?.preferred_username || 'Anonymous'
    };
    
    console.log('📝 Promise rejection logged:', errorDetails);
    
    // If it's an authentication-related error, handle it gracefully
    if (event.reason && event.reason.toString().toLowerCase().includes('auth')) {
        if (window.ProkodeAuth && window.ProkodeAuth.getAuthManager()) {
            window.ProkodeAuth.getAuthManager().handleAuthError(event.reason, 'Session error occurred');
        }
    }
});

console.log('🏢 Enhanced Prokode Labs Main Application Module Loaded Successfully');
console.log('📊 Performance monitoring active');
console.log('♿ Accessibility features enabled');
console.log('🔐 Enhanced security features active');
