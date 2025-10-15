// =============================================================================
// PROKODE LABS - ENHANCED APPLICATION LOGIC WITH PERFORMANCE OPTIMIZATIONS
// =============================================================================

/**
 * Enhanced Main Application Class with improved architecture
 * @class ProkodeApp
 * @description Manages application initialization and features
 */

class ProkodeApp {
  constructor() {
    this.initialized = false;
    this.features = new Map();
    this.observers = new Map();
    this.eventListeners = new WeakMap();
    
    // Performance monitoring
    this.performanceMarks = {
      authStart: null,
      appStart: null,
      featuresLoaded: null
    };
    
    // Bind methods
    this.handleAuthSuccess = this.handleAuthSuccess.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    
    this.init();
  }
  
  /**
   * Initialize the application
   * @private
   */
  async init() {
    try {
      console.log('🚀 Initializing Prokode Labs Enhanced Application...');
      this.performanceMarks.appStart = performance.now();
      
      // Wait for DOM content to load
      if (document.readyState === 'loading') {
        await this.waitForDOMContent();
      }
      
      // Setup global error handling
      this.setupErrorHandling();
      
      // Setup performance monitoring
      this.setupPerformanceMonitoring();
      
      // Listen for authentication events
      this.setupAuthenticationListeners();
      
      // Check if already authenticated
      this.checkInitialAuthState();
      
    } catch (error) {
      console.error('❌ Application initialization failed:', error);
      this.handleFatalError(error);
    }
  }
  
  /**
   * Wait for DOM content to load
   * @private
   * @returns {Promise}
   */
  waitForDOMContent() {
    return new Promise(resolve => {
      document.addEventListener('DOMContentLoaded', resolve, { once: true });
    });
  }
  
  /**
   * Setup global error handling
   * @private
   */
  setupErrorHandling() {
    // Global error handler
    window.addEventListener('error', this.handleGlobalError.bind(this));
    
    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection.bind(this));
  }
  
  /**
   * Setup performance monitoring
   * @private
   */
  setupPerformanceMonitoring() {
    // Monitor Core Web Vitals
    if ('web-vital' in window) {
      this.monitorWebVitals();
    }
    
    // Memory usage monitoring (development only)
    if (process.env.NODE_ENV === 'development') {
      this.monitorMemoryUsage();
    }
  }
  
  /**
   * Setup authentication event listeners
   * @private
   */
  setupAuthenticationListeners() {
    // Listen for successful authentication
    document.addEventListener('userAuthenticated', this.handleAuthSuccess);
    
    // Listen for authentication failures
    document.addEventListener('authenticationFailed', this.handleAuthFailure.bind(this));
    
    // Listen for logout events
    document.addEventListener('userLoggedOut', this.handleLogout.bind(this));
  }
  
  /**
   * Check initial authentication state
   * @private
   */
  checkInitialAuthState() {
    // Delay to allow auth system to initialize
    setTimeout(() => {
      if (window.ProkodeAuth?.isAuthenticated()) {
        console.log('👤 User already authenticated, initializing features...');
        this.initializeAppFeatures();
      }
    }, 100);
  }
  
  /**
   * Handle successful authentication
   * @private
   * @param {CustomEvent} event - Authentication event
   */
  handleAuthSuccess(event) {
    console.log('✅ Authentication successful, initializing features...');
    this.performanceMarks.authStart = performance.now();
    
    const user = event.detail?.user;
    if (user) {
      this.currentUser = user;
      this.initializeAppFeatures();
    }
  }
  
  /**
   * Initialize all application features
   * @private
   */
  async initializeAppFeatures() {
    if (this.initialized) {
      console.warn('⚠️ App already initialized, skipping...');
      return;
    }
    
    try {
      console.log('🔧 Initializing application features...');
      
      // Initialize core UI features
      await this.initializeCoreFeatures();
      
      // Initialize role-based features
      this.initializeRoleBasedFeatures();
      
      // Setup intersection observers
      this.setupIntersectionObservers();
      
      // Setup event listeners
      this.setupEventListeners();
      
      // Initialize accessibility features
      this.initializeAccessibilityFeatures();
      
      // Mark as initialized
      this.initialized = true;
      this.performanceMarks.featuresLoaded = performance.now();
      
      // Add loaded class for CSS transitions
      document.body.classList.add('app-loaded');
      
      // Log performance metrics
      this.logPerformanceMetrics();
      
      console.log('✅ Prokode Labs Application - Fully Loaded');
      
    } catch (error) {
      console.error('❌ Feature initialization failed:', error);
      this.handleInitializationError(error);
    }
  }
  
  /**
   * Initialize core UI features
   * @private
   */
  async initializeCoreFeatures() {
    const coreFeatures = [
      { name: 'MobileNavigation', class: MobileNavigation },
      { name: 'SmoothScroll', class: SmoothScroll },
      { name: 'NavbarScroll', class: NavbarScroll },
      { name: 'AnimationObserver', class: AnimationObserver },
      { name: 'ProgressBarAnimation', class: ProgressBarAnimation },
      { name: 'ActiveNavLink', class: ActiveNavLink },
      { name: 'LazyImageLoader', class: LazyImageLoader }
    ];
    
    for (const { name, class: FeatureClass } of coreFeatures) {
      try {
        const feature = new FeatureClass();
        this.features.set(name, feature);
        console.log(`✅ ${name} initialized`);
      } catch (error) {
        console.warn(`⚠️ Failed to initialize ${name}:`, error);
      }
    }
  }
  
  /**
   * Initialize role-based features based on user permissions
   * @private
   */
  initializeRoleBasedFeatures() {
    if (!this.currentUser?.groups) {
      return;
    }
    
    console.log('👥 Initializing role-based features for:', this.currentUser.groups);
    
    // Admin features
    if (window.ProkodeAuth.hasRole('IAM-Admins')) {
      this.enableAdminFeatures();
    }
    
    // Team features
    if (window.ProkodeAuth.hasRole('IAM-Team')) {
      this.enableTeamFeatures();
    }
    
    // Add role indicators to UI
    this.addRoleIndicators(this.currentUser.groups);
  }
  
  /**
   * Enable admin-specific features
   * @private
   */
  enableAdminFeatures() {
    console.log('🔧 Enabling admin features...');
    
    // Add admin resources dynamically
    this.addAdminResources();
    
    // Enable advanced debugging
    this.enableAdvancedDebugging();
    
    // Add admin shortcuts
    this.setupAdminShortcuts();
  }
  
  /**
   * Add admin resources to the UI
   * @private
   */
  addAdminResources() {
    const resourcesGrid = document.querySelector('.resources-grid');
    if (!resourcesGrid) return;
    
    const adminResources = [
      {
        icon: '⚙️',
        title: 'Admin Dashboard',
        description: 'System administration and user management',
        url: '#admin-dashboard',
        className: 'admin-feature'
      },
      {
        icon: '📊',
        title: 'Analytics Hub',
        description: 'IAM metrics and performance insights',
        url: '#analytics',
        className: 'admin-feature'
      },
      {
        icon: '🛡️',
        title: 'Security Console',
        description: 'Security policies and audit logs',
        url: '#security-console',
        className: 'admin-feature'
      }
    ];
    
    adminResources.forEach(resource => {
      const card = this.createResourceCard(resource);
      resourcesGrid.appendChild(card);
    });
  }
  
  /**
   * Create a resource card element
   * @private
   * @param {Object} resource - Resource configuration
   * @returns {HTMLElement} Resource card element
   */
  createResourceCard(resource) {
    const card = document.createElement('div');
    card.className = `resource-card ${resource.className || ''}`;
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    
    card.innerHTML = `
      <div class="resource-icon" aria-hidden="true">${resource.icon}</div>
      <h3 class="resource-title">${resource.title}</h3>
      <p class="resource-description">${resource.description}</p>
      <span class="resource-link" aria-hidden="true">Access →</span>
    `;
    
    // Add click handler
    const handleClick = () => {
      if (resource.url.startsWith('#')) {
        // Internal navigation
        const targetElement = document.querySelector(resource.url);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // External navigation
        window.open(resource.url, '_blank', 'noopener,noreferrer');
      }
    };
    
    card.addEventListener('click', handleClick);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick();
      }
    });
    
    return card;
  }
  
  /**
   * Setup intersection observers for performance
   * @private
   */
  setupIntersectionObservers() {
    // Lazy loading observer
    const lazyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.handleLazyLoad(entry.target);
          lazyObserver.unobserve(entry.target);
        }
      });
    }, { 
      rootMargin: '50px',
      threshold: 0.1 
    });
    
    // Observe lazy-loadable elements
    document.querySelectorAll('[data-lazy]').forEach(el => {
      lazyObserver.observe(el);
    });
    
    this.observers.set('lazy', lazyObserver);
  }
  
  /**
   * Setup event listeners with proper cleanup
   * @private
   */
  setupEventListeners() {
    // Page visibility change
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', this.handleKeyboardShortcuts.bind(this));
    
    // Window resize with debouncing
    const handleResize = this.debounce(() => {
      this.handleWindowResize();
    }, 250);
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
      this.cleanup();
    });
  }
  
  /**
   * Handle page visibility changes
   * @private
   */
  handleVisibilityChange() {
    if (document.visibilityState === 'visible') {
      // Page became visible - refresh auth state
      if (window.ProkodeAuth?.isAuthenticated()) {
        console.log('👁️ Page visible - validating session...');
        window.ProkodeAuth.getAuthManager()?.checkAuthState();
      }
    } else {
      // Page hidden - pause non-critical features
      this.pauseNonCriticalFeatures();
    }
  }
  
  /**
   * Handle keyboard shortcuts
   * @private
   * @param {KeyboardEvent} event - Keyboard event
   */
  handleKeyboardShortcuts(event) {
    if (!window.ProkodeAuth?.isAuthenticated()) return;
    
    // Skip if user is typing in an input
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)) {
      return;
    }
    
    // Define shortcuts
    const shortcuts = {
      'Alt+KeyH': () => this.scrollToSection('#home'),
      'Alt+KeyS': () => this.scrollToSection('#services'),
      'Alt+KeyP': () => this.scrollToSection('#projects'),
      'Alt+KeyT': () => this.scrollToSection('#team'),
      'Alt+KeyR': () => this.scrollToSection('#resources'),
      'Escape': () => this.handleEscapeKey()
    };
    
    const key = event.altKey ? `Alt+${event.code}` : event.key;
    const handler = shortcuts[key];
    
    if (handler) {
      event.preventDefault();
      handler();
    }
  }
  
  /**
   * Scroll to a specific section
   * @private
   * @param {string} selector - CSS selector for the target section
   */
  scrollToSection(selector) {
    const element = document.querySelector(selector);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
  /**
   * Handle escape key press
   * @private
   */
  handleEscapeKey() {
    // Close any open dialogs or overlays
    const activeDialog = document.querySelector('.session-warning-dialog');
    if (activeDialog) {
      activeDialog.remove();
    }
  }
  
  /**
   * Initialize accessibility features
   * @private
   */
  initializeAccessibilityFeatures() {
    // Add skip links
    this.addSkipLinks();
    
    // Announce page changes to screen readers
    this.setupAriaLiveRegions();
    
    // Enhanced keyboard navigation
    this.setupKeyboardNavigation();
    
    // Focus management
    this.setupFocusManagement();
  }
  
  /**
   * Add skip links for screen readers
   * @private
   */
  addSkipLinks() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    
    document.body.insertBefore(skipLink, document.body.firstChild);
  }
  
  /**
   * Setup ARIA live regions for dynamic content
   * @private
   */
  setupAriaLiveRegions() {
    const liveRegion = document.createElement('div');
    liveRegion.id = 'aria-live-region';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.className = 'sr-only';
    
    document.body.appendChild(liveRegion);
  }
  
  /**
   * Log performance metrics
   * @private
   */
  logPerformanceMetrics() {
    const { appStart, authStart, featuresLoaded } = this.performanceMarks;
    
    if (appStart && featuresLoaded) {
      const totalTime = featuresLoaded - appStart;
      console.log(`⚡ App initialization: ${Math.round(totalTime)}ms`);
      
      if (authStart) {
        const authTime = featuresLoaded - authStart;
        console.log(`🔐 Post-auth initialization: ${Math.round(authTime)}ms`);
      }
    }
    
    // Report to analytics if available
    if (window.gtag) {
      window.gtag('event', 'timing_complete', {
        name: 'app_initialization',
        value: Math.round(featuresLoaded - appStart)
      });
    }
  }
  
  /**
   * Handle global errors
   * @private
   * @param {ErrorEvent} event - Error event
   */
  handleGlobalError(event) {
    console.error('💥 Global error:', event.error);
    
    // Report to error tracking service
    if (window.Sentry) {
      window.Sentry.captureException(event.error);
    }
    
    // Show user-friendly error message for critical errors
    if (this.isCriticalError(event.error)) {
      this.showErrorMessage('An unexpected error occurred. Please refresh the page.');
    }
  }
  
  /**
   * Handle unhandled promise rejections
   * @private
   * @param {PromiseRejectionEvent} event - Promise rejection event
   */
  handleUnhandledRejection(event) {
    console.error('💥 Unhandled promise rejection:', event.reason);
    
    // Report to error tracking
    if (window.Sentry) {
      window.Sentry.captureException(event.reason);
    }
  }
  
  /**
   * Utility function for debouncing
   * @private
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @returns {Function} Debounced function
   */
  debounce(func, wait) {
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
  
  /**
   * Cleanup resources on page unload
   * @private
   */
  cleanup() {
    // Clear all observers
    this.observers.forEach(observer => observer.disconnect());
    
    // Clear features
    this.features.clear();
    
    // Clear performance marks
    Object.keys(this.performanceMarks).forEach(key => {
      this.performanceMarks[key] = null;
    });
  }
}

// =============================================================================
// ENHANCED FEATURE CLASSES WITH BETTER ERROR HANDLING
// =============================================================================

/**
 * Enhanced Mobile Navigation with accessibility improvements
 */
class MobileNavigation {
  constructor() {
    this.elements = {
      mobileMenu: document.getElementById('mobile-menu'),
      navMenu: document.getElementById('nav-menu'),
      navLinks: document.querySelectorAll('.nav-link')
    };
    
    this.isOpen = false;
    this.init();
  }
  
  init() {
    if (!this.elements.mobileMenu || !this.elements.navMenu) {
      console.warn('⚠️ Mobile navigation elements not found');
      return;
    }
    
    this.setupEventListeners();
    this.setupAccessibility();
  }
  
  setupEventListeners() {
    // Toggle mobile menu
    this.elements.mobileMenu.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleMenu();
    });
    
    // Close menu when clicking nav links
    this.elements.navLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.closeMenu();
      });
    });
    
    // Close menu on outside click
    document.addEventListener('click', (e) => {
      if (this.isOpen && !this.elements.navMenu.contains(e.target)) {
        this.closeMenu();
      }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && this.isOpen) {
        this.closeMenu();
      }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeMenu();
        this.elements.mobileMenu.focus();
      }
    });
  }
  
  setupAccessibility() {
    // Set ARIA attributes
    this.elements.mobileMenu.setAttribute('aria-expanded', 'false');
    this.elements.mobileMenu.setAttribute('aria-controls', 'nav-menu');
    this.elements.navMenu.setAttribute('aria-labelledby', 'mobile-menu');
  }
  
  toggleMenu() {
    this.isOpen ? this.closeMenu() : this.openMenu();
  }
  
  openMenu() {
    this.isOpen = true;
    this.elements.mobileMenu.classList.add('active');
    this.elements.navMenu.classList.add('active');
    this.elements.mobileMenu.setAttribute('aria-expanded', 'true');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Focus first nav link for accessibility
    const firstLink = this.elements.navMenu.querySelector('.nav-link');
    if (firstLink) {
      setTimeout(() => firstLink.focus(), 100);
    }
  }
  
  closeMenu() {
    this.isOpen = false;
    this.elements.mobileMenu.classList.remove('active');
    this.elements.navMenu.classList.remove('active');
    this.elements.mobileMenu.setAttribute('aria-expanded', 'false');
    
    // Restore body scroll
    document.body.style.overflow = '';
  }
}

/**
 * Enhanced Smooth Scroll with better performance
 */
class SmoothScroll {
  constructor() {
    this.navHeight = this.calculateNavHeight();
    this.init();
  }
  
  calculateNavHeight() {
    const navbar = document.getElementById('navbar');
    const authStatus = document.getElementById('auth-status');
    
    let height = 0;
    if (navbar) height += navbar.offsetHeight;
    if (authStatus) height += authStatus.offsetHeight;
    
    return height + 20; // Add some padding
  }
  
  init() {
    // Use event delegation for better performance
    document.addEventListener('click', (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (anchor) {
        this.handleSmoothScroll(e, anchor);
      }
    });
  }
  
  handleSmoothScroll(event, anchor) {
    event.preventDefault();
    
    const targetId = anchor.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      const offsetTop = targetElement.offsetTop - this.navHeight;
      
      window.scrollTo({
        top: Math.max(0, offsetTop),
        behavior: 'smooth'
      });
      
      // Update URL without triggering scroll
      history.pushState(null, null, targetId);
      
      // Announce navigation to screen readers
      this.announceNavigation(targetElement);
    }
  }
  
  announceNavigation(element) {
    const announcement = `Navigated to ${element.getAttribute('aria-label') || element.textContent.trim()}`;
    const liveRegion = document.getElementById('aria-live-region');
    
    if (liveRegion) {
      liveRegion.textContent = announcement;
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 1000);
    }
  }
}

// Initialize the enhanced application
let prokodeApp;

// Enhanced initialization with error boundary
document.addEventListener('DOMContentLoaded', () => {
  try {
    prokodeApp = new ProkodeApp();
  } catch (error) {
    console.error('❌ Failed to initialize Prokode Labs application:', error);
    
    // Fallback initialization
    document.body.innerHTML = `
      <div class="fallback-error">
        <h1>Service Temporarily Unavailable</h1>
        <p>We're experiencing technical difficulties. Please refresh the page or contact IT support.</p>
        <button onclick="location.reload()" class="retry-button">Retry</button>
      </div>
    `;
  }
});

// Export for testing and debugging
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ProkodeApp, MobileNavigation, SmoothScroll };
}

console.log('🏢 Enhanced Prokode Labs Application Module Loaded');