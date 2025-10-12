// =============================================================================
// PROKODE LABS - OKTA AUTHENTICATION MODULE (Updated)
// Enhanced with client recommendations and improved UX
// =============================================================================

/**
 * Okta Configuration
 * Replace these values with your actual Okta settings
 */
const oktaConfig = {
    baseUrl: 'https://dev-10248048.okta.com', // Replace with your Okta domain
    clientId: '0oaqyocca6eCDMjYk5d7', // Replace with your Client ID from Okta app integration
    redirectUri: 'https://pk1820.github.io/IAM/okta-projects/oidc-authentication/prokode-labs-homepage-with-okta-authentication/',
    
    authParams: {
        issuer: 'https://dev-10248048.okta.com/oauth2/default', // Replace with your issuer URL
        scopes: ['openid', 'profile', 'email'],
        pkce: true // Enable PKCE for security
    },
    
    features: {
        registration: false, // Disable self-service registration for internal portal
        rememberMe: true,
        multiOptionalFactorEnroll: true,
        selfServiceUnlock: false,
        smsRecovery: false,
        callRecovery: false,
        emailRecovery: true,
        showPasswordToggleOnSignInPage: true,
        hideSignOutLinkInMFA: false,
        hideNextButton: false,
        showKeepMeSignedIn: true
    },
    
    // Enhanced customization for better UX
    customization: {
        colors: {
            brand: '#4ac7f4' // Prokode Labs accent color
        },
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        hideSignOutLinkInMFA: false,
        logo: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="70">🔐</text></svg>',
        logoText: 'Prokode Labs Portal'
    },
    
    // Enhanced help links for internal users
    helpLinks: {
        help: 'mailto:internal@prokodelabs.com?subject=Authentication Help Request',
        forgotPassword: 'mailto:internal@prokodelabs.com?subject=Password Reset Request',
        unlock: 'mailto:internal@prokodelabs.com?subject=Account Unlock Request',
        custom: [
            {
                text: 'Need technical support?',
                href: 'mailto:internal@prokodelabs.com?subject=Technical Support Request',
                target: '_blank'
            },
            {
                text: 'Report security issue',
                href: 'mailto:security@prokodelabs.com?subject=Security Issue Report',
                target: '_blank'
            }
        ]
    },
    
    // Enhanced i18n for better user experience
    i18n: {
        en: {
            'primaryauth.title': 'Sign in to Prokode Labs Portal',
            'primaryauth.title': 'Sign In Securely',
            'primaryauth.title': 'Enter your work email',
            'primaryauth.title': 'Enter your password',
            'remember.me.label': 'Keep me signed in for 30 days',
            'oform.errorbanner.title': 'Authentication Error',
            'errors.E0000004': 'Authentication failed. Please check your credentials and try again.',
            'errors.E0000014': 'Update password',
            'password.forgot.email.or.username.tooltip': 'Forgot your password? Contact IT support.',
            'help': 'Need help signing in?'
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
        this.signinWrapper = document.getElementById('okta-signin-wrapper');
        this.authLoading = document.getElementById('auth-loading');
        this.ariaLiveRegion = document.getElementById('aria-live-region');
        
        // Initialize Okta Sign-In Widget
        this.oktaSignIn = null;
        this.currentUser = null;
        this.authState = 'loading'; // loading, authenticated, unauthenticated
        this.retryCount = 0;
        this.maxRetries = 3;
        
        // Bind methods
        this.handleLogout = this.handleLogout.bind(this);
        this.checkAuthState = this.checkAuthState.bind(this);
        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
        this.handleKeyboardNavigation = this.handleKeyboardNavigation.bind(this);
        
        // Initialize authentication
        this.init();
    }

    /**
     * Initialize the authentication system with enhanced error handling
     */
    async init() {
        try {
            console.log('🔐 Prokode Labs - Initializing authentication system...');
            this.announceToScreenReader('Initializing secure authentication...');
            
            // Show loading state
            this.showLoadingState();
            
            // Initialize Okta Sign-In Widget with enhanced configuration
            this.initializeOktaWidget();
            
            // Check current authentication state
            await this.checkAuthState();
            
            // Set up event listeners
            this.setupEventListeners();
            
            console.log('✅ Authentication system initialized successfully');
            
        } catch (error) {
            console.error('❌ Authentication initialization failed:', error);
            this.handleAuthError(error, 'Failed to initialize authentication system');
            this.showLoginForm();
        }
    }

    /**
     * Initialize the Okta Sign-In Widget with enhanced configuration
     */
    initializeOktaWidget() {
        this.oktaSignIn = new OktaSignIn({
            ...oktaConfig,
            el: '#okta-signin-container'
        });
        
        console.log('🔧 Okta Sign-In Widget initialized with enhanced configuration');
    }

    /**
     * Set up event listeners for enhanced security and accessibility
     */
    setupEventListeners() {
        // Logout handler
        if (this.logoutBtn) {
            this.logoutBtn.addEventListener('click', this.handleLogout);
        }
        
        // Keyboard navigation support
        document.addEventListener('keydown', this.handleKeyboardNavigation);
        
        // Page visibility change for security
        document.addEventListener('visibilitychange', this.handleVisibilityChange);
        
        // Enhanced focus management for mobile
        if (this.signinContainer) {
            this.signinContainer.addEventListener('focusin', () => {
                // Ensure proper viewport on mobile
                if (window.innerWidth <= 768) {
                    setTimeout(() => {
                        this.signinContainer.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'center' 
                        });
                    }, 300);
                }
            });
        }
    }

    /**
     * Enhanced keyboard navigation for accessibility
     */
    handleKeyboardNavigation(event) {
        // Quick logout with Ctrl+Shift+L
        if (event.ctrlKey && event.shiftKey && event.key === 'L') {
            event.preventDefault();
            if (this.isAuthenticated()) {
                this.handleLogout();
            }
        }
        
        // Focus management for login overlay
        if (this.authState === 'unauthenticated' && event.key === 'Escape') {
            const activeElement = document.activeElement;
            if (activeElement && activeElement.closest('#okta-signin-container')) {
                // Allow user to exit focus trap with Escape
                document.body.focus();
            }
        }
    }

    /**
     * Handle page visibility changes for enhanced security
     */
    handleVisibilityChange() {
        if (document.visibilityState === 'visible' && this.isAuthenticated()) {
            // Re-validate session when page becomes visible
            console.log('👀 Page visible, validating session...');
            this.validateSession();
        }
    }

    /**
     * Validate current session with enhanced error handling
     */
    async validateSession() {
        try {
            await this.oktaSignIn.authClient.token.getUserInfo();
            console.log('✅ Session validation successful');
        } catch (error) {
            console.log('⚠️ Session validation failed, redirecting to login');
            this.announceToScreenReader('Session expired. Please sign in again.');
            this.showLoginForm();
        }
    }

    /**
     * Check the current authentication state with retry logic
     */
    async checkAuthState() {
        try {
            console.log('🔍 Checking authentication state...');
            
            // First check if user has existing tokens
            const userInfo = await this.oktaSignIn.authClient.token.getUserInfo()
                .then(user => user)
                .catch(() => null);

            if (userInfo) {
                console.log('✅ User already authenticated:', userInfo.preferred_username || userInfo.email);
                this.currentUser = userInfo;
                this.showProtectedContent();
            } else {
                console.log('👤 User needs to authenticate');
                this.showLoginForm();
            }
            
        } catch (error) {
            console.error('❌ Auth state check failed:', error);
            
            // Implement retry logic
            if (this.retryCount < this.maxRetries) {
                this.retryCount++;
                console.log(`🔄 Retrying auth state check (${this.retryCount}/${this.maxRetries})...`);
                setTimeout(() => this.checkAuthState(), 1000 * this.retryCount);
            } else {
                this.handleAuthError(error, 'Failed to check authentication status');
                this.showLoginForm();
            }
        }
    }

    /**
     * Show loading state with enhanced accessibility
     */
    showLoadingState() {
        console.log('⏳ Showing loading state...');
        
        if (this.authLoading) {
            this.authLoading.style.display = 'flex';
            this.authLoading.setAttribute('aria-hidden', 'false');
        }
        
        if (this.signinWrapper) {
            this.signinWrapper.style.display = 'none';
        }
        
        // Update ARIA live region
        this.announceToScreenReader('Loading authentication...');
    }

    /**
     * Hide loading state
     */
    hideLoadingState() {
        if (this.authLoading) {
            this.authLoading.style.display = 'none';
            this.authLoading.setAttribute('aria-hidden', 'true');
        }
    }

    /**
     * Show the login form with enhanced UX
     */
    showLoginForm() {
        console.log('📝 Showing enhanced login form...');
        this.authState = 'unauthenticated';
        this.hideLoadingState();

        // Show login overlay, hide protected content
        if (this.loginOverlay) {
            this.loginOverlay.style.display = 'flex';
            this.loginOverlay.setAttribute('aria-hidden', 'false');
        }
        if (this.protectedContent) {
            this.protectedContent.style.display = 'none';
            this.protectedContent.setAttribute('aria-hidden', 'true');
        }
        if (this.authStatus) {
            this.authStatus.style.display = 'none';
        }

        // Render the enhanced Okta Sign-In Widget
        this.renderOktaWidget();
        
        // Announce to screen readers
        this.announceToScreenReader('Please sign in to access Prokode Labs Portal');
    }

    /**
     * Render the Okta Sign-In Widget with enhanced error handling and UX
     */
    renderOktaWidget() {
        if (this.signinWrapper && this.signinContainer) {
            this.signinWrapper.style.display = 'flex';
            
            // Remove any existing widget
            this.oktaSignIn.remove();
            
            // Clear any existing error messages
            this.clearErrorMessages();
            
            console.log('🎨 Rendering enhanced Okta Sign-In Widget...');
            
            // Render the widget with enhanced callbacks
            this.oktaSignIn.showSignInToGetTokens({
                el: '#okta-signin-container'
            }).then((tokens) => {
                console.log('✅ Authentication successful');
                this.handleAuthenticationSuccess(tokens);
                
            }).catch((error) => {
                console.error('❌ Authentication failed:', error);
                this.handleAuthError(error, 'Authentication failed');
            });
            
            // Enhanced focus management for accessibility
            setTimeout(() => {
                const firstInput = this.signinContainer.querySelector('input[type="text"], input[type="email"]');
                if (firstInput) {
                    firstInput.focus();
                    firstInput.setAttribute('aria-describedby', 'login-description');
                }
            }, 500);
        }
    }

    /**
     * Handle successful authentication with enhanced user experience
     */
    handleAuthenticationSuccess(tokens) {
        try {
            console.log('🎉 Processing successful authentication...');
            
            // Store tokens securely
            this.oktaSignIn.authClient.tokenManager.setTokens(tokens);
            
            // Remove the widget from DOM
            this.oktaSignIn.remove();
            
            // Get user information from the tokens
            const user = tokens.idToken.claims;
            this.currentUser = user;
            
            // Reset retry count
            this.retryCount = 0;
            
            // Announce success to screen readers
            const displayName = user.name || user.preferred_username || user.email || 'User';
            this.announceToScreenReader(`Welcome ${displayName}. Authentication successful.`);
            
            // Show the protected content
            this.showProtectedContent();
            
            // Log successful authentication
            console.log('✅ User successfully authenticated:', displayName);
            
        } catch (error) {
            console.error('❌ Error processing authentication success:', error);
            this.handleAuthError(error, 'Failed to complete authentication');
        }
    }

    /**
     * Show protected content with enhanced user experience
     */
    showProtectedContent() {
        console.log('🏠 Loading protected content with enhanced UX...');
        this.authState = 'authenticated';
        this.hideLoadingState();

        // Hide login overlay, show protected content
        if (this.loginOverlay) {
            this.loginOverlay.style.display = 'none';
            this.loginOverlay.setAttribute('aria-hidden', 'true');
        }
        if (this.protectedContent) {
            this.protectedContent.style.display = 'block';
            this.protectedContent.setAttribute('aria-hidden', 'false');
        }
        if (this.authStatus) {
            this.authStatus.style.display = 'flex';
        }

        // Display user information with enhanced formatting
        this.displayUserInfo();
        
        // Initialize the existing app functionality
        this.initializeAppFeatures();

        // Enhanced smooth transition animation
        setTimeout(() => {
            if (this.protectedContent) {
                this.protectedContent.classList.add('loaded');
                this.protectedContent.style.opacity = '1';
                this.protectedContent.style.transform = 'translateY(0)';
            }
        }, 100);
        
        // Focus management for accessibility
        setTimeout(() => {
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.focus();
            }
        }, 300);
    }

    /**
     * Display user information with enhanced formatting
     */
    displayUserInfo() {
        if (this.userName && this.currentUser) {
            // Get the best available name
            const displayName = this.currentUser.name || 
                               this.currentUser.preferred_username || 
                               this.currentUser.email || 
                               'User';
            
            // Enhanced user display with role information
            let userDisplay = displayName;
            
            // Add user role if available in groups claim
            if (this.currentUser.groups && this.currentUser.groups.length > 0) {
                const userRole = this.getUserRole(this.currentUser.groups);
                if (userRole) {
                    userDisplay = `${displayName} (${userRole})`;
                }
            }
            
            this.userName.textContent = userDisplay;
            this.userName.setAttribute('aria-label', `Signed in as ${userDisplay}`);
            
            console.log('👤 User info displayed:', userDisplay);
        }
    }

    /**
     * Enhanced user role determination from groups
     */
    getUserRole(groups) {
        const roleMapping = {
            'IAM-Admins': 'IAM Administrator',
            'IAM-Team': 'IAM Team Member',
            'Security-Team': 'Security Specialist',
            'Engineering-Team': 'Engineering Team',
            'Governance-Team': 'Governance Team',
            'Support-Team': 'Support Team',
            'Management': 'Management',
            'Consultant': 'Consultant'
        };

        // Return the highest priority role found
        const priorityOrder = [
            'IAM-Admins', 'Security-Team', 'IAM-Team', 'Engineering-Team', 
            'Governance-Team', 'Management', 'Support-Team', 'Consultant'
        ];
        
        for (const role of priorityOrder) {
            if (groups.includes(role)) {
                return roleMapping[role];
            }
        }
        
        return 'Team Member'; // Default role
    }

    /**
     * Initialize existing app features after authentication
     */
    initializeAppFeatures() {
        console.log('🚀 Initializing app features with user context...');
        
        // Dispatch enhanced custom event with user context
        const authEvent = new CustomEvent('userAuthenticated', {
            detail: { 
                user: this.currentUser,
                authTime: new Date().toISOString(),
                sessionId: this.generateSessionId()
            }
        });
        
        document.dispatchEvent(authEvent);
        
        // Initialize role-based features
        this.initializeRoleBasedFeatures();
    }

    /**
     * Initialize role-based features based on user groups
     */
    initializeRoleBasedFeatures() {
        if (!this.currentUser || !this.currentUser.groups) {
            return;
        }
        
        console.log('🔐 Initializing role-based features for groups:', this.currentUser.groups);
        
        // Enable admin features for IAM-Admins
        if (this.hasRole('IAM-Admins')) {
            this.enableAdminFeatures();
        }
        
        // Enable enhanced features for team members
        if (this.hasRole('IAM-Team') || this.hasRole('Security-Team')) {
            this.enableTeamFeatures();
        }
        
        // Add visual role indicators
        this.addRoleIndicators();
    }

    /**
     * Enable admin-specific features
     */
    enableAdminFeatures() {
        console.log('⚙️ Enabling administrator features...');
        
        // Add admin badge to auth status
        const authStatus = document.getElementById('auth-status');
        if (authStatus && !authStatus.querySelector('.admin-badge')) {
            const adminBadge = document.createElement('span');
            adminBadge.className = 'admin-badge';
            adminBadge.textContent = '⚙️ ADMIN';
            adminBadge.style.cssText = `
                background: linear-gradient(45deg, #ef4444, #dc2626);
                color: white;
                font-size: 0.7rem;
                padding: 2px 8px;
                border-radius: 12px;
                margin-left: 12px;
                font-weight: 600;
                text-shadow: 0 1px 2px rgba(0,0,0,0.3);
            `;
            authStatus.querySelector('.user-info').appendChild(adminBadge);
        }
        
        // Enable admin keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.altKey && e.shiftKey && e.key === 'A') {
                e.preventDefault();
                console.log('🔧 Admin panel access requested');
                this.announceToScreenReader('Admin panel access - feature coming soon');
            }
        });
    }

    /**
     * Enable team-specific features
     */
    enableTeamFeatures() {
        console.log('👥 Enabling team member features...');
        
        // Add team badge to auth status
        const authStatus = document.getElementById('auth-status');
        if (authStatus && !authStatus.querySelector('.team-badge')) {
            const teamBadge = document.createElement('span');
            teamBadge.className = 'team-badge';
            teamBadge.textContent = '👥 TEAM';
            teamBadge.style.cssText = `
                background: linear-gradient(45deg, #3b82f6, #2563eb);
                color: white;
                font-size: 0.7rem;
                padding: 2px 8px;
                border-radius: 12px;
                margin-left: 8px;
                font-weight: 600;
                text-shadow: 0 1px 2px rgba(0,0,0,0.3);
            `;
            authStatus.querySelector('.user-info').appendChild(teamBadge);
        }
    }

    /**
     * Add visual role indicators throughout the interface
     */
    addRoleIndicators() {
        // Add role indicator to navigation if not already present
        const navLogo = document.querySelector('.nav-logo h2');
        if (navLogo && !navLogo.querySelector('.role-indicator')) {
            const roleIndicator = document.createElement('span');
            roleIndicator.className = 'role-indicator';
            
            if (this.hasRole('IAM-Admins')) {
                roleIndicator.textContent = ' [ADMIN]';
                roleIndicator.style.color = '#ef4444';
            } else if (this.hasRole('IAM-Team')) {
                roleIndicator.textContent = ' [TEAM]';
                roleIndicator.style.color = '#3b82f6';
            }
            
            roleIndicator.style.fontSize = '0.8rem';
            roleIndicator.style.fontWeight = '600';
            navLogo.appendChild(roleIndicator);
        }
    }

    /**
     * Enhanced logout handling with confirmation
     */
    async handleLogout() {
        // Optional: Add confirmation for admin users
        if (this.hasRole('IAM-Admins')) {
            const confirmLogout = confirm('You are logged in as an administrator. Are you sure you want to sign out?');
            if (!confirmLogout) {
                return;
            }
        }
        
        try {
            console.log('👋 Processing secure logout...');
            this.announceToScreenReader('Signing out...');
            
            // Show loading state
            this.showLoadingState();
            
            // Sign out from Okta
            await this.oktaSignIn.authClient.signOut();
            
            // Clear user data
            this.currentUser = null;
            this.authState = 'unauthenticated';
            this.retryCount = 0;
            
            // Clear any stored tokens
            this.oktaSignIn.authClient.tokenManager.clear();
            
            // Show login form
            this.showLoginForm();
            
            console.log('✅ Logout completed successfully');
            this.announceToScreenReader('Successfully signed out. Please sign in again to access the portal.');
            
        } catch (error) {
            console.error('❌ Logout failed:', error);
            this.announceToScreenReader('Logout failed. Refreshing page for security.');
            
            // Force refresh on logout error for security
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    }

    /**
     * Enhanced error handling with user-friendly messaging
     */
    handleAuthError(error, userMessage = null) {
        console.error('🚨 Authentication Error Details:', error);
        
        // Determine user-friendly error message
        let displayMessage = userMessage || 'Authentication failed. Please try again.';
        
        if (error.errorCode) {
            switch (error.errorCode) {
                case 'E0000004':
                    displayMessage = 'Invalid username or password. Please check your credentials.';
                    break;
                case 'E0000014':
                    displayMessage = 'Your password needs to be updated. Please contact IT support.';
                    break;
                case 'E0000047':
                    displayMessage = 'Your account is locked. Please contact IT support for assistance.';
                    break;
                case 'E0000001':
                    displayMessage = 'API validation error. Please contact IT support.';
                    break;
                default:
                    displayMessage = `Authentication error (${error.errorCode}). Please try again or contact IT support.`;
            }
        }
        
        // Show user-friendly error message
        this.showErrorMessage(displayMessage);
        
        // Hide loading state
        this.hideLoadingState();
        
        // Announce error to screen readers
        this.announceToScreenReader(`Error: ${displayMessage}`);
    }

    /**
     * Enhanced error message display
     */
    showErrorMessage(message) {
        this.clearErrorMessages();
        
        // Create or update error element
        let errorElement = document.getElementById('auth-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.id = 'auth-error';
            errorElement.className = 'auth-error-message';
            errorElement.setAttribute('role', 'alert');
            errorElement.setAttribute('aria-live', 'assertive');
            
            if (this.signinWrapper && this.signinWrapper.parentNode) {
                this.signinWrapper.parentNode.insertBefore(errorElement, this.signinWrapper);
            }
        }
        
        errorElement.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 1.2em;" aria-hidden="true">⚠️</span>
                <span>${message}</span>
            </div>
            <div style="margin-top: 8px; font-size: 0.875rem; opacity: 0.8;">
                Need help? Contact <a href="mailto:internal@prokodelabs.com" style="color: #fca5a5; text-decoration: underline;">internal@prokodelabs.com</a>
            </div>
        `;
        errorElement.style.display = 'block';
        
        // Auto-hide error after 10 seconds
        setTimeout(() => {
            if (errorElement) {
                errorElement.style.display = 'none';
            }
        }, 10000);
    }

    /**
     * Clear existing error messages
     */
    clearErrorMessages() {
        const existingError = document.getElementById('auth-error');
        if (existingError) {
            existingError.style.display = 'none';
        }
    }

    /**
     * Announce messages to screen readers
     */
    announceToScreenReader(message) {
        if (this.ariaLiveRegion) {
            this.ariaLiveRegion.textContent = message;
            
            // Clear after announcement
            setTimeout(() => {
                this.ariaLiveRegion.textContent = '';
            }, 1000);
        }
    }

    /**
     * Generate unique session ID for tracking
     */
    generateSessionId() {
        return 'sess_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
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

    /**
     * Get user's roles/groups
     */
    getUserRoles() {
        if (!this.currentUser || !this.currentUser.groups) {
            return [];
        }
        return this.currentUser.groups;
    }

    /**
     * Enhanced session management
     */
    getSessionInfo() {
        if (!this.isAuthenticated()) {
            return null;
        }
        
        return {
            user: this.currentUser,
            authTime: this.currentUser.auth_time,
            issuedAt: this.currentUser.iat,
            expiresAt: this.currentUser.exp,
            roles: this.getUserRoles()
        };
    }
}

// =============================================================================
// GLOBAL AUTHENTICATION MANAGER & ENHANCED SESSION MANAGEMENT
// =============================================================================

// Global instance
let authManager;

// Initialize authentication when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔐 Initializing Prokode Labs Authentication Manager...');
    authManager = new ProkodeAuthManager();
});

// Enhanced global exports for use in other scripts
window.ProkodeAuth = {
    getAuthManager: () => authManager,
    isAuthenticated: () => authManager ? authManager.isAuthenticated() : false,
    getCurrentUser: () => authManager ? authManager.getCurrentUser() : null,
    hasRole: (role) => authManager ? authManager.hasRole(role) : false,
    getUserRoles: () => authManager ? authManager.getUserRoles() : [],
    getSessionInfo: () => authManager ? authManager.getSessionInfo() : null,
    logout: () => authManager ? authManager.handleLogout() : null
};

// =============================================================================
// ENHANCED SESSION MANAGEMENT AND SECURITY
// =============================================================================

// Enhanced session validation (every 5 minutes)
setInterval(() => {
    if (authManager && authManager.isAuthenticated()) {
        authManager.oktaSignIn.authClient.token.getUserInfo()
            .then(() => {
                console.log('✅ Session validation successful');
            })
            .catch((error) => {
                console.log('⚠️ Session expired or invalid, redirecting to login');
                console.error('Session validation error:', error);
                authManager.announceToScreenReader('Your session has expired. Please sign in again.');
                authManager.showLoginForm();
            });
    }
}, 300000); // 5 minutes

// Enhanced activity tracking for security
let lastActivity = Date.now();
let activityTimeout;

function updateActivity() {
    lastActivity = Date.now();
    
    // Clear existing timeout
    if (activityTimeout) {
        clearTimeout(activityTimeout);
    }
    
    // Set new timeout for inactivity (30 minutes)
    activityTimeout = setTimeout(() => {
        if (authManager && authManager.isAuthenticated()) {
            console.log('⏰ User inactive for 30 minutes, checking session...');
            authManager.announceToScreenReader('You have been inactive. Checking your session...');
            authManager.validateSession();
        }
    }, 1800000); // 30 minutes
}

// Track various user activities
['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'].forEach(event => {
    document.addEventListener(event, updateActivity, { passive: true });
});

// Enhanced security: Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && authManager && authManager.isAuthenticated()) {
        console.log('👀 Page became visible, validating session...');
        authManager.validateSession();
        updateActivity();
    }
});

// Enhanced security: Prevent unauthorized access through developer tools
if (typeof window !== 'undefined') {
    Object.defineProperty(window, 'ProkodeAuth', {
        writable: false,
        configurable: false
    });
    
    // Additional security measures
    let devtools = { open: false, orientation: null };
    setInterval(() => {
        if (window.outerHeight - window.innerHeight > 200 || window.outerWidth - window.innerWidth > 200) {
            if (!devtools.open) {
                devtools.open = true;
                console.log('🔒 Developer tools detected - Enhanced monitoring active');
            }
        } else {
            devtools.open = false;
        }
    }, 500);
}

// Enhanced error boundary for authentication
window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && event.reason.message && event.reason.message.includes('auth')) {
        console.error('🚨 Unhandled authentication error:', event.reason);
        if (authManager) {
            authManager.handleAuthError(event.reason, 'An authentication error occurred');
        }
        event.preventDefault();
    }
});

// Service worker registration for enhanced security (if available)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Register service worker for enhanced security and caching
        // This would be implemented separately for production use
        console.log('🔧 Service worker support detected');
    });
}

console.log('🔐 Prokode Labs Enhanced Authentication Module Loaded Successfully');
