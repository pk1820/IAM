// =============================================================================
// PROKODE LABS - OKTA AUTHENTICATION MODULE
// =============================================================================

/**
 * Okta Configuration
 * Replace these values with your actual Okta settings
 */
const oktaConfig = {
    baseUrl: 'https://dev-10248048.okta.com', // Replace with your Okta domain (e.g., 'https://dev-123456.okta.com')
    clientId: '0oaqyocca6eCDMjYk5d7', // Replace with your Client ID from Okta app integration
    redirectUri: 'https://pk1820.github.io/IAM/okta-projects/oidc-authentication/prokode-labs-homepage-with-okta-authentication/',
    authParams: {
        issuer: 'https://dev-10248048.okta.com/oauth2/default', // Replace with your issuer URL
        scopes: ['openid', 'profile', 'email', 'groups'],
        pkce: true // Enable PKCE for security
    },
    features: {
        registration: false, // Disable self-service registration for internal portal
        rememberMe: true,
        multiOptionalFactorEnroll: true
    },
    // Customize the widget appearance
    colors: {
        brand: '#4AC7F4' // Prokode Labs accent color
    },
    // Help links for internal users
    helpLinks: {
        help: 'mailto:internal@prokodelabs.com',
        forgotPassword: 'mailto:internal@prokodelabs.com',
        factorPage: {
            text: 'Need help with authentication?',
            href: 'mailto:internal@prokodelabs.com'
        }
    }
};

// =============================================================================
// DOM ELEMENTS AND STATE MANAGEMENT
// =============================================================================

class ProkodeAuthManager {
    constructor() {
        // DOM Elements
        this.loginOverlay = document.getElementById('login-overlay');
        this.protectedContent = document.getElementById('protected-content');
        this.authStatus = document.getElementById('auth-status');
        this.userName = document.getElementById('user-name');
        this.logoutBtn = document.getElementById('logout-btn');
        this.signinContainer = document.getElementById('okta-signin-container');
        this.authLoading = document.getElementById('auth-loading');

        // Initialize Okta Sign-In Widget
        this.oktaSignIn = null;
        this.currentUser = null;
        this.authState = 'loading'; // loading, authenticated, unauthenticated

        // Bind methods
        this.handleLogout = this.handleLogout.bind(this);
        this.checkAuthState = this.checkAuthState.bind(this);
        
        // Initialize authentication
        this.init();
    }

    /**
     * Initialize the authentication system
     */
    async init() {
        try {
            console.log('🔐 Prokode Labs - Initializing authentication...');
            
            // Show loading state
            this.showLoadingState();
            
            // Initialize Okta Sign-In Widget
            this.initializeOktaWidget();
            
            // Check current authentication state
            await this.checkAuthState();
            
            // Set up logout handler
            if (this.logoutBtn) {
                this.logoutBtn.addEventListener('click', this.handleLogout);
            }
            
        } catch (error) {
            console.error('❌ Authentication initialization failed:', error);
            this.showLoginForm();
        }
    }

    /**
     * Initialize the Okta Sign-In Widget
     */
    initializeOktaWidget() {
        this.oktaSignIn = new OktaSignIn(oktaConfig);
    }

    /**
     * Check the current authentication state
     */
    async checkAuthState() {
        try {
            // First check if user has existing tokens
            const userInfo = await this.oktaSignIn.authClient.token.getUserInfo()
                .then(user => user)
                .catch(() => null);

            if (userInfo) {
                // User is already authenticated
                this.currentUser = userInfo;
                this.showProtectedContent();
            } else {
                // User needs to authenticate
                this.showLoginForm();
            }
        } catch (error) {
            console.error('❌ Auth state check failed:', error);
            this.showLoginForm();
        }
    }

    /**
     * Show loading state during authentication process
     */
    showLoadingState() {
        if (this.authLoading) {
            this.authLoading.style.display = 'flex';
        }
        if (this.signinContainer) {
            this.signinContainer.style.display = 'none';
        }
    }

    /**
     * Hide loading state
     */
    hideLoadingState() {
        if (this.authLoading) {
            this.authLoading.style.display = 'none';
        }
    }

    /**
     * Show the login form with Okta Sign-In Widget
     */
    showLoginForm() {
        console.log('📝 Showing login form...');
        
        this.authState = 'unauthenticated';
        this.hideLoadingState();
        
        // Show login overlay, hide protected content
        if (this.loginOverlay) this.loginOverlay.style.display = 'flex';
        if (this.protectedContent) this.protectedContent.style.display = 'none';
        if (this.authStatus) this.authStatus.style.display = 'none';

        // Render the Okta Sign-In Widget
        this.renderOktaWidget();
    }

    /**
     * Render the Okta Sign-In Widget
     */
    renderOktaWidget() {
        if (this.signinContainer) {
            this.signinContainer.style.display = 'block';
            
            // Remove any existing widget
            this.oktaSignIn.remove();
            
            // Render the widget
            this.oktaSignIn.showSignInToGetTokens({
                el: '#okta-signin-container'
            }).then((tokens) => {
                console.log('✅ Authentication successful');
                
                // Store tokens
                this.oktaSignIn.authClient.tokenManager.setTokens(tokens);
                
                // Remove the widget from DOM
                this.oktaSignIn.remove();
                
                // Get user information from the tokens
                const user = tokens.idToken.claims;
                this.currentUser = user;
                
                // Show the protected content
                this.showProtectedContent();
                
            }).catch((error) => {
                console.error('❌ Authentication failed:', error);
                this.handleAuthError(error);
            });
        }
    }

    /**
     * Show protected content after successful authentication
     */
    showProtectedContent() {
        console.log('🏠 Loading protected content...');
        
        this.authState = 'authenticated';
        this.hideLoadingState();
        
        // Hide login overlay, show protected content
        if (this.loginOverlay) this.loginOverlay.style.display = 'none';
        if (this.protectedContent) this.protectedContent.style.display = 'block';
        if (this.authStatus) this.authStatus.style.display = 'flex';
        
        // Display user information
        this.displayUserInfo();
        
        // Initialize the existing app functionality
        this.initializeAppFeatures();
        
        // Add animation class for smooth transition
        setTimeout(() => {
            if (this.protectedContent) {
                this.protectedContent.classList.add('loaded');
            }
        }, 100);
    }

    /**
     * Display user information in the auth status bar
     */
    displayUserInfo() {
        if (this.userName && this.currentUser) {
            // Get the best available name
            const displayName = this.currentUser.name || 
                              this.currentUser.preferred_username || 
                              this.currentUser.email || 
                              'User';
            
            this.userName.textContent = displayName;
            
            // Add user role if available in groups claim
            if (this.currentUser.groups && this.currentUser.groups.length > 0) {
                const userRole = this.getUserRole(this.currentUser.groups);
                if (userRole) {
                    this.userName.textContent = `${displayName} (${userRole})`;
                }
            }
        }
    }

    /**
     * Get user role from groups
     */
    getUserRole(groups) {
        const roleMapping = {
            'IAM-Admins': 'IAM Admin',
            'IAM-Team': 'IAM Team',
            'Security-Team': 'Security',
            'Engineering-Team': 'Engineering',
            'Governance-Team': 'Governance'
        };

        for (const group of groups) {
            if (roleMapping[group]) {
                return roleMapping[group];
            }
        }
        return null;
    }

    /**
     * Initialize existing app features after authentication
     */
    initializeAppFeatures() {
        // This will trigger the existing app.js functionality
        // Make sure app.js is loaded after auth.js
        console.log('🚀 Initializing app features...');
        
        // Dispatch a custom event to let app.js know user is authenticated
        document.dispatchEvent(new CustomEvent('userAuthenticated', {
            detail: { user: this.currentUser }
        }));
    }

    /**
     * Handle logout
     */
    async handleLogout() {
        try {
            console.log('👋 Logging out...');
            
            // Show loading state
            this.showLoadingState();
            
            // Sign out from Okta
            await this.oktaSignIn.authClient.signOut();
            
            // Clear user data
            this.currentUser = null;
            this.authState = 'unauthenticated';
            
            // Show login form
            this.showLoginForm();
            
        } catch (error) {
            console.error('❌ Logout failed:', error);
            // Force refresh on logout error
            window.location.reload();
        }
    }

    /**
     * Handle authentication errors
     */
    handleAuthError(error) {
        console.error('Authentication Error:', error);
        
        // Show user-friendly error message
        this.showErrorMessage('Authentication failed. Please try again or contact IT support.');
        
        // Hide loading state
        this.hideLoadingState();
    }

    /**
     * Show error message to user
     */
    showErrorMessage(message) {
        // Create error element if it doesn't exist
        let errorElement = document.getElementById('auth-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.id = 'auth-error';
            errorElement.className = 'auth-error-message';
            
            if (this.signinContainer && this.signinContainer.parentNode) {
                this.signinContainer.parentNode.insertBefore(errorElement, this.signinContainer);
            }
        }
        
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        
        // Auto-hide error after 5 seconds
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 5000);
    }

    /**
     * Get current user information
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return this.authState === 'authenticated' && this.currentUser !== null;
    }

    /**
     * Check if user has specific role/group
     */
    hasRole(roleName) {
        if (!this.currentUser || !this.currentUser.groups) {
            return false;
        }
        return this.currentUser.groups.includes(roleName);
    }
}

// =============================================================================
// GLOBAL AUTHENTICATION MANAGER
// =============================================================================

// Global instance
let authManager;

// Initialize authentication when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    authManager = new ProkodeAuthManager();
});

// Export for use in other scripts
window.ProkodeAuth = {
    getAuthManager: () => authManager,
    isAuthenticated: () => authManager ? authManager.isAuthenticated() : false,
    getCurrentUser: () => authManager ? authManager.getCurrentUser() : null,
    hasRole: (role) => authManager ? authManager.hasRole(role) : false
};

// =============================================================================
// SESSION MANAGEMENT AND SECURITY
// =============================================================================

// Check authentication status periodically (every 5 minutes)
setInterval(() => {
    if (authManager && authManager.isAuthenticated()) {
        authManager.oktaSignIn.authClient.token.getUserInfo()
            .then(() => {
                console.log('✅ Session still valid');
            })
            .catch(() => {
                console.log('⚠️ Session expired, redirecting to login');
                authManager.showLoginForm();
            });
    }
}, 300000); // 5 minutes

// Handle page visibility change (security feature)
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && authManager && authManager.isAuthenticated()) {
        // Re-validate session when page becomes visible
        authManager.checkAuthState();
    }
});

// Security: Prevent unauthorized access through console
if (typeof window !== 'undefined') {
    Object.defineProperty(window, 'ProkodeAuth', {
        writable: false,
        configurable: false
    });
}

console.log('🔐 Prokode Labs Authentication Module Loaded');
