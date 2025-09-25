// Auth0 Configuration
export const auth0Config = {
  domain: process.env.REACT_APP_AUTH0_DOMAIN || 'vibecodes.us.auth0.com',
  clientId: process.env.REACT_APP_AUTH0_CLIENT_ID || 'OejuDvHhYdI5z7a2x6K3R5zWQxhy0gY2',
  authorizationParams: {
    redirect_uri: process.env.REACT_APP_AUTH0_REDIRECT_URI || 'https://www.vibecodes.space',
    audience: process.env.REACT_APP_AUTH0_AUDIENCE,
    scope: 'openid profile email'
  },
  useRefreshTokens: true,
  cacheLocation: 'localstorage'
};

// Twitter (X) connection configuration
export const twitterConfig = {
  connection: 'twitter', // This will be configured in Auth0 dashboard
  login_hint: 'twitter'
};
// Force redeploy - Tue Sep 23 21:35:45 CDT 2025
// Fix Auth0 redirect URI - Wed Sep 24 04:30:00 CDT 2025
