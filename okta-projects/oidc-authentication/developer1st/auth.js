// =============================================================================
// PROKODE LABS - ENHANCED OKTA AUTHENTICATION MODULE
// =============================================================================

/**
 * Enhanced Okta Authentication Manager with improved security and performance
 * @class ProkodeAuthManager
 * @description Manages authentication flow with Okta OIDC integration
 */

// Environment configuration - Move to server-side in production
const AUTH_CONFIG = {
  // These should come from server-side endpoint in production
  endpoints: {
    config: '/api/auth/config', // Server endpoint for auth config
    validate: '/api/auth/validate' // Server endpoint for token validation
  },
  
  // Client-side safe configuration
  features: {
    registration: false,
    rememberMe: true,
    multiOptionalFactorEnroll: true,
    sessionTimeout: 1800000, // 30 minutes
    refreshThreshold: 300000  // 5 minutes before expiry
  },
  
  ui: {
    colors: {
      brand: '#4AC7F4'
    },
    
    helpLinks: {
      help: 'mailto:internal@prokodelabs.com',
      forgotPassword: 'mailto:internal@prokodelabs.com',
      factorPage: {
        text: 'Need help with authentication?',
        href: 'mailto:internal@prokodelabs.com'
      }
    }
  }
};

// =============================================================================
// ENHANCED AUTHENTICATION MANAGER CLASS
// =============================================================================

class ProkodeAuthManager {
  /**
   * Initialize the authentication manager
   * @constructor
   */
  constructor() {
    // Cache DOM elements for performance
    this.elements = this.cacheElements();
    
    // Initialize state
    this.state = {
      oktaSignIn: null,
      currentUser: null,
      authState: 'loading',
      sessionTimer: null,
      refreshTimer: null
    };
    
    // Bind methods to preserve context
    this.bindMethods();
    
    // Initialize authentication system
    this.init().catch(this.handleFatalError.bind(this));
  }
  
  /**
   * Cache DOM elements for performance optimization
   * @private
   * @returns {Object} Cached DOM elements
   */
  cacheElements() {
    return {
      loginOverlay: document.getElementById('login-overlay'),
      protectedContent: document.getElementById('protected-content'),
      authStatus: document.getElementById('auth-status'),
      userName: document.getElementById('user-name'),
      logoutBtn: document.getElementById('logout-btn'),
      signinContainer: document.getElementById('okta-signin-container'),
      authLoading: document.getElementById('auth-loading')
    };
  }
  
  /**
   * Bind methods to preserve 'this' context
   * @private
   */
  bindMethods() {
    this.handleLogout = this.handleLogout.bind(this);
    this.checkAuthState = this.checkAuthState.bind(this);
    this.handleTokenRefresh = this.handleTokenRefresh.bind(this);
  }
  
  /**
   * Initialize the authentication system
   * @async
   * @private
   */
  async init() {
    try {
      console.log('🔐 Prokode Labs - Initializing enhanced authentication...');
      
      // Show loading state
      this.showLoadingState();
      
      // Fetch secure configuration from server
      const config = await this.fetchAuthConfig();
      
      // Initialize Okta Sign-In Widget with fetched config
      this.initializeOktaWidget(config);
      
      // Check current authentication state
      await this.checkAuthState();
      
      // Set up event listeners
      this.setupEventListeners();
      
      // Initialize session management
      this.initializeSessionManagement();
      
    } catch (error) {
      console.error('❌ Authentication initialization failed:', error);
      this.handleAuthError(error);
    }
  }
  
  /**
   * Fetch authentication configuration from server
   * @async
   * @private
   * @returns {Object} Authentication configuration
   */
  async fetchAuthConfig() {
    try {
      const response = await fetch(AUTH_CONFIG.endpoints.config, {
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Config fetch failed: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.warn('⚠️ Using fallback configuration due to fetch error:', error);
      
      // Fallback configuration (remove in production)
      return {
        baseUrl: 'https://dev-10248048.okta.com',
        clientId: '0oaqyocca6eCDMjYk5d7',
        redirectUri: window.location.origin + window.location.pathname,
        authParams: {
          issuer: 'https://dev-10248048.okta.com/oauth2/default',
          scopes: ['openid', 'profile', 'email'],
          pkce: true
        },
        ...AUTH_CONFIG.features,
        ...AUTH_CONFIG.ui
      };
    }
  }
  
  /**
   * Initialize the Okta Sign-In Widget with enhanced error handling
   * @private
   * @param {Object} config - Authentication configuration
   */
  initializeOktaWidget(config) {
    try {
      this.state.oktaSignIn = new OktaSignIn(config);
    } catch (error) {
      console.error('❌ Failed to initialize Okta widget:', error);
      throw new Error('Widget initialization failed');
    }
  }
  
  /**
   * Enhanced authentication state checking with retry logic
   * @async
   * @private
   */
  async checkAuthState() {
    const MAX_RETRIES = 3;
    let retries = 0;
    
    while (retries < MAX_RETRIES) {
      try {
        // Check for existing tokens
        const userInfo = await this.validateUserToken();
        
        if (userInfo) {
          this.state.currentUser = userInfo;
          this.showProtectedContent();
          return;
        }
        
        // User needs to authenticate
        this.showLoginForm();
        return;
        
      } catch (error) {
        retries++;
        console.warn(`⚠️ Auth state check failed (attempt ${retries}):`, error);
        
        if (retries === MAX_RETRIES) {
          console.error('❌ Max retries reached for auth state check');
          this.showLoginForm();
          return;
        }
        
        // Exponential backoff
        await this.delay(Math.pow(2, retries) * 1000);
      }
    }
  }
  
  /**
   * Validate user token with server-side verification
   * @async
   * @private
   * @returns {Object|null} User information or null
   */
  async validateUserToken() {
    try {
      // First check client-side tokens
      const userInfo = await this.state.oktaSignIn.authClient.token.getUserInfo();
      
      // Server-side token validation for enhanced security
      const validationResponse = await fetch(AUTH_CONFIG.endpoints.validate, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: userInfo.sub })
      });
      
      if (validationResponse.ok) {
        return userInfo;
      }
      
      throw new Error('Server-side token validation failed');
    } catch (error) {
      console.warn('Token validation failed:', error);
      return null;
    }
  }
  
  /**
   * Setup event listeners with improved error handling
   * @private
   */
  setupEventListeners() {
    // Logout button
    if (this.elements.logoutBtn) {
      this.elements.logoutBtn.addEventListener('click', this.handleLogout);
    }
    
    // Page visibility change for security
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && this.isAuthenticated()) {
        this.checkAuthState();
      }
    });
    
    // Unload event cleanup
    window.addEventListener('beforeunload', () => {
      this.cleanup();
    });
  }
  
  /**
   * Initialize enhanced session management
   * @private
   */
  initializeSessionManagement() {
    // Clear any existing timers
    this.clearTimers();
    
    // Session timeout warning (25 minutes)
    this.state.sessionTimer = setTimeout(() => {
      this.showSessionWarning();
    }, AUTH_CONFIG.features.sessionTimeout - 300000);
    
    // Auto token refresh (25 minutes)
    this.state.refreshTimer = setTimeout(() => {
      this.handleTokenRefresh();
    }, AUTH_CONFIG.features.refreshThreshold);
  }
  
  /**
   * Handle automatic token refresh
   * @async
   * @private
   */
  async handleTokenRefresh() {
    try {
      console.log('🔄 Refreshing authentication tokens...');
      
      const tokenManager = this.state.oktaSignIn.authClient.tokenManager;
      await tokenManager.renew('accessToken');
      
      console.log('✅ Tokens refreshed successfully');
      
      // Reset timers
      this.initializeSessionManagement();
      
    } catch (error) {
      console.warn('⚠️ Token refresh failed:', error);
      this.showSessionExpiredWarning();
    }
  }
  
  /**
   * Show session warning dialog
   * @private
   */
  showSessionWarning() {
    const warningDialog = document.createElement('div');
    warningDialog.className = 'session-warning-dialog';
    warningDialog.innerHTML = `
      <div class="session-warning-content">
        <h3>Session Expiring Soon</h3>
        <p>Your session will expire in 5 minutes. Would you like to continue?</p>
        <div class="session-warning-actions">
          <button id="extend-session" class="btn-primary">Continue Session</button>
          <button id="logout-now" class="btn-secondary">Logout</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(warningDialog);
    
    // Handle user choice
    document.getElementById('extend-session').addEventListener('click', () => {
      this.handleTokenRefresh();
      document.body.removeChild(warningDialog);
    });
    
    document.getElementById('logout-now').addEventListener('click', () => {
      this.handleLogout();
      document.body.removeChild(warningDialog);
    });
  }
  
  /**
   * Enhanced logout with cleanup
   * @async
   */
  async handleLogout() {
    try {
      console.log('👋 Enhanced logout process initiated...');
      
      this.showLoadingState();
      
      // Clear timers and state
      this.cleanup();
      
      // Sign out from Okta
      if (this.state.oktaSignIn && this.state.oktaSignIn.authClient) {
        await this.state.oktaSignIn.authClient.signOut();
      }
      
      // Clear user data
      this.state.currentUser = null;
      this.state.authState = 'unauthenticated';
      
      // Clear any cached data
      this.clearCachedData();
      
      // Show login form
      this.showLoginForm();
      
    } catch (error) {
      console.error('❌ Logout failed:', error);
      // Force page reload as fallback
      window.location.reload();
    }
  }
  
  /**
   * Clear timers and cleanup resources
   * @private
   */
  cleanup() {
    this.clearTimers();
    
    if (this.state.oktaSignIn) {
      this.state.oktaSignIn.remove();
    }
  }
  
  /**
   * Clear session timers
   * @private
   */
  clearTimers() {
    if (this.state.sessionTimer) {
      clearTimeout(this.state.sessionTimer);
      this.state.sessionTimer = null;
    }
    
    if (this.state.refreshTimer) {
      clearTimeout(this.state.refreshTimer);
      this.state.refreshTimer = null;
    }
  }
  
  /**
   * Clear cached authentication data
   * @private
   */
  clearCachedData() {
    // Clear localStorage if used
    localStorage.removeItem('okta-token-storage');
    sessionStorage.clear();
  }
  
  /**
   * Enhanced error handling with user-friendly messages
   * @private
   * @param {Error} error - The error to handle
   */
  handleFatalError(error) {
    console.error('💥 Fatal authentication error:', error);
    
    const errorOverlay = document.createElement('div');
    errorOverlay.className = 'fatal-error-overlay';
    errorOverlay.innerHTML = `
      <div class="fatal-error-content">
        <h2>Authentication Service Unavailable</h2>
        <p>We're experiencing technical difficulties. Please try again or contact IT support.</p>
        <button onclick="location.reload()" class="btn-primary">Retry</button>
      </div>
    `;
    
    document.body.appendChild(errorOverlay);
  }
  
  /**
   * Utility function for delays
   * @private
   * @param {number} ms - Milliseconds to delay
   * @returns {Promise}
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  // ... (Previous methods for UI state management remain the same)
  // showLoadingState, hideLoadingState, showLoginForm, showProtectedContent, etc.
  
  /**
   * Public API methods
   */
  isAuthenticated() {
    return this.state.authState === 'authenticated' && this.state.currentUser !== null;
  }
  
  getCurrentUser() {
    return this.state.currentUser;
  }
  
  hasRole(roleName) {
    return this.state.currentUser?.groups?.includes(roleName) || false;
  }
}

// =============================================================================
// ENHANCED GLOBAL INITIALIZATION
// =============================================================================

let authManager;

// Enhanced initialization with error boundary
document.addEventListener('DOMContentLoaded', () => {
  try {
    authManager = new ProkodeAuthManager();
  } catch (error) {
    console.error('❌ Failed to initialize authentication manager:', error);
    
    // Fallback error display
    const fallbackError = document.createElement('div');
    fallbackError.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; 
                  background: #0f1824; color: #fff; display: flex; 
                  align-items: center; justify-content: center; z-index: 9999;">
        <div style="text-align: center; padding: 20px;">
          <h2>Service Temporarily Unavailable</h2>
          <p>Authentication service is currently unavailable. Please contact IT support.</p>
        </div>
      </div>
    `;
    document.body.appendChild(fallbackError);
  }
});

// Enhanced global API with error handling
window.ProkodeAuth = {
  getAuthManager: () => authManager,
  isAuthenticated: () => authManager?.isAuthenticated() || false,
  getCurrentUser: () => authManager?.getCurrentUser() || null,
  hasRole: (role) => authManager?.hasRole(role) || false
};

// Prevent tampering with global auth object
Object.freeze(window.ProkodeAuth);

console.log('🔐 Enhanced Prokode Labs Authentication Module Loaded');