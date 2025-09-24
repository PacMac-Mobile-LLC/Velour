// Auth0 Configuration
export const auth0Config = {
  domain: process.env.REACT_APP_AUTH0_DOMAIN || 'vibecodes.space',
  clientId: process.env.REACT_APP_AUTH0_CLIENT_ID || 'ed0G8cJCBxwo0pgYuvFHIJ7tRn51w0kj',
  authorizationParams: {
    redirect_uri: process.env.REACT_APP_AUTH0_REDIRECT_URI || window.location.origin,
    audience: process.env.REACT_APP_AUTH0_AUDIENCE,
    scope: 'openid profile email'
  }
};

// Twitter (X) connection configuration
export const twitterConfig = {
  connection: 'twitter', // This will be configured in Auth0 dashboard
  login_hint: 'twitter'
};
// Force redeploy - Tue Sep 23 21:35:45 CDT 2025
