// Auth0 Configuration
export const auth0Config = {
  domain: process.env.REACT_APP_AUTH0_DOMAIN || 'vibecodes.us.auth0.com',
  clientId: process.env.REACT_APP_AUTH0_CLIENT_ID || 'xAb1duCX2SFx4LbIFy6mt5qDt8ZX1Ex9',
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
