# Complete Okta Integration Setup Guide for Prokode Labs

## Step 1: Okta App Integration Setup

### 1.1 Create App Integration in Okta Admin Console

1. **Log into Okta Admin Console**
   - Go to your Okta organization URL (e.g., `https://dev-123456-admin.okta.com`)
   - Sign in with admin credentials

2. **Create New Application**
   - Navigate to **Applications** → **Applications**
   - Click **Create App Integration**
   - Select **OIDC - OpenID Connect** as Sign-in method
   - Select **Single-Page Application** as Application type
   - Click **Next**

3. **Configure Application Settings**
   ```
   App integration name: Prokode Labs Internal Portal
   
   Grant types:
   ✓ Authorization Code
   ✓ Refresh Token
   ✓ Interaction Code (click Advanced to see this)
   
   Sign-in redirect URIs:
   - Development: http://localhost:3000/
   - Production: https://your-domain.com/
   
   Sign-out redirect URIs:
   - Development: http://localhost:3000/
   - Production: https://your-domain.com/
   
   Assignments: Allow everyone in your organization to access
   ```

4. **Save and Copy Credentials**
   - Click **Save**
   - Copy the **Client ID** (e.g., `0oa1b2c3d4e5f6g7h8i9`)
   - Note your **Okta Domain** (e.g., `dev-123456.okta.com`)

### 1.2 Configure Trusted Origins (Important!)

1. **Go to Security Settings**
   - Navigate to **Security** → **API** → **Trusted Origins**
   - Click **Add Origin**

2. **Add Development Origin**
   ```
   Name: Prokode Labs Development
   Origin URL: http://localhost:3000
   Type: ✓ CORS, ✓ Redirect
   ```

3. **Add Production Origin** (when ready)
   ```
   Name: Prokode Labs Production
   Origin URL: https://your-domain.com
   Type: ✓ CORS, ✓ Redirect
   ```

### 1.3 Enable Interaction Code Grant Type

1. **Navigate to Settings**
   - Go to **Settings** → **Account** → **Embedded widget sign-in support**
   - Ensure **Interaction Code** is enabled

2. **Verify Authorization Server**
   - Go to **Security** → **API** → **Authorization Servers**
   - Select **default** server
   - Click **Access Policies** → **Default Policy Rule** → **Edit**
   - In **IF Grant type is** section, click **Advanced**
   - Ensure **Interaction Code** is checked

## Step 2: File Structure and Code Implementation

### 2.1 Update Your Project Structure

```
prokode-labs-portal/
├── index.html          (replace with updated version)
├── auth.js             (new file)
├── app.js              (replace with updated version)  
├── style.css           (add auth styles to existing file)
└── assets/
    └── (your existing images)
```

### 2.2 Update Configuration in auth.js

Replace the placeholders in your `auth.js` file:

```javascript
const oktaConfig = {
    baseUrl: 'https://dev-123456.okta.com',           // Replace with your domain
    clientId: '0oa1b2c3d4e5f6g7h8i9',                // Replace with your Client ID
    redirectUri: window.location.origin,
    authParams: {
        issuer: 'https://dev-123456.okta.com/oauth2/default',  // Replace with your issuer
        scopes: ['openid', 'profile', 'email', 'groups'],
        pkce: true
    },
    // ... rest of config remains the same
};
```

## Step 3: Local Testing Setup

### 3.1 Serve Files Locally

Choose one of these methods to serve your files:

**Option A: Python (if installed)**
```bash
cd prokode-labs-portal
python -m http.server 3000
```

**Option B: Node.js http-server**
```bash
cd prokode-labs-portal
npx http-server . -p 3000
```

**Option C: PHP (if installed)**
```bash
cd prokode-labs-portal
php -S localhost:3000
```

### 3.2 Test Authentication Flow

1. **Open Browser**
   - Navigate to `http://localhost:3000`
   - You should see the Prokode Labs login overlay

2. **Sign In**
   - Use your Okta credentials to sign in
   - You should be redirected back to the internal portal
   - Your name should appear in the top auth status bar

3. **Test Logout**
   - Click the logout button in the top-right
   - You should return to the login screen

## Step 4: User Groups and Role-Based Access (Optional)

### 4.1 Create User Groups in Okta

1. **Navigate to Groups**
   - Go to **Directory** → **Groups**
   - Click **Add Group**

2. **Create IAM Groups**
   ```
   Group Name: IAM-Admins
   Description: IAM Administrator access
   
   Group Name: IAM-Team  
   Description: IAM Team member access
   
   Group Name: Security-Team
   Description: Security team access
   ```

3. **Assign Users to Groups**
   - Click on each group
   - Click **Assign People**
   - Add relevant users

### 4.2 Add Groups Claim to Tokens

1. **Configure Custom Claim**
   - Go to **Security** → **API** → **Authorization Servers**
   - Select **default** → **Claims** → **Add Claim**

2. **Create Groups Claim**
   ```
   Name: groups
   Include in token type: ID Token, Always
   Value type: Groups
   Filter: Matches regex: .*
   Include in: Any scope
   ```

## Step 5: Advanced Configuration (Production)

### 5.1 Custom Domain Setup (Recommended)

1. **Configure Custom Okta Domain**
   - Go to **Customizations** → **Domain & Email**
   - Set up custom domain (e.g., `auth.prokodelabs.com`)

2. **Update Configuration**
   ```javascript
   const oktaConfig = {
       baseUrl: 'https://auth.prokodelabs.com',
       // ... rest of config
   };
   ```

### 5.2 Multi-Factor Authentication (MFA)

1. **Configure MFA Policy**
   - Go to **Security** → **Authentication Policies**
   - Create policy for Prokode Labs app
   - Require MFA for all users or specific groups

### 5.3 Session Management

1. **Configure Session Policies**
   - Go to **Security** → **Global Session Policy**
   - Set appropriate session timeouts
   - Configure "Keep me signed in" settings

## Step 6: Production Deployment

### 6.1 Update Okta Configuration

1. **Add Production URLs**
   - Update redirect URIs in your Okta app
   - Add production domain to Trusted Origins

2. **Update Code Configuration**
   ```javascript
   const oktaConfig = {
       baseUrl: 'https://your-okta-domain.okta.com',
       clientId: 'your-production-client-id',
       redirectUri: 'https://portal.prokodelabs.com',
       // ... rest of config
   };
   ```

### 6.2 Deploy Files

1. **Upload to Your Web Server**
   - Deploy all files (index.html, auth.js, app.js, style.css)
   - Ensure HTTPS is configured
   - Test the authentication flow

## Step 7: Troubleshooting Common Issues

### Issue 1: "Invalid Client" Error
**Solution:**
- Verify Client ID is correct in auth.js
- Ensure the app is Active in Okta Admin Console
- Check that grant types are properly configured

### Issue 2: CORS Errors in Browser
**Solution:**
- Add your domain to Trusted Origins in Okta
- Ensure both CORS and Redirect are checked
- Clear browser cache and cookies

### Issue 3: "Redirect URI Mismatch" Error
**Solution:**
- Ensure redirect URIs in Okta exactly match your URLs
- Check for trailing slashes (include them in both places)
- Verify protocol (http vs https)

### Issue 4: Widget Not Loading
**Solution:**
- Check browser console for JavaScript errors
- Ensure Okta CDN resources are accessible
- Verify container element exists before widget initialization

### Issue 5: Session/Token Issues
**Solution:**
- Clear browser localStorage and sessionStorage
- Check token expiration settings in Okta
- Verify issuer URL matches authorization server

## Step 8: Security Best Practices

### 8.1 Production Security Checklist

- [ ] Use HTTPS everywhere
- [ ] Configure appropriate session timeouts
- [ ] Enable MFA for all users
- [ ] Set up monitoring and logging
- [ ] Implement proper error handling
- [ ] Configure CORS properly
- [ ] Use strong password policies
- [ ] Regular security audits

### 8.2 User Training

1. **Provide Internal Documentation**
   - How to access the portal
   - What to do if locked out
   - MFA setup instructions

2. **Contact Information**
   - IT support email: internal@prokodelabs.com
   - Emergency access procedures

## Expected User Experience

**Before Authentication:**
- User sees professional Prokode Labs login overlay
- Okta Sign-In Widget appears with company branding
- Supports MFA if configured

**After Authentication:**
- Smooth transition to internal homepage
- User name appears in top status bar
- All existing animations and features work
- Role-based features appear based on user groups
- Professional enterprise experience throughout

The integration maintains your existing dark theme and animations while adding enterprise-grade security through Okta's authentication platform.