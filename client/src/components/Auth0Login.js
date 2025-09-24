import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import styled from 'styled-components';
import { Twitter, LogOut } from 'lucide-react';

const AuthContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: white;
`;

const AuthCard = styled.div`
  background: #000;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  border: 2px solid #ff69b4;
  text-align: center;
  max-width: 400px;
  width: 100%;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 10px;
  background: linear-gradient(135deg, #ff69b4 0%, #7a288a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #ccc;
  margin-bottom: 40px;
  line-height: 1.6;
`;

const TwitterButton = styled.button`
  background: linear-gradient(135deg, #1da1f2 0%, #0d8bd9 100%);
  color: white;
  border: none;
  padding: 16px 32px;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  justify-content: center;
  margin-bottom: 20px;
  box-shadow: 0 8px 25px rgba(29, 161, 242, 0.3);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px rgba(29, 161, 242, 0.4);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const LogoutButton = styled.button`
  background: transparent;
  color: #ff69b4;
  border: 2px solid #ff69b4;
  padding: 12px 24px;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  justify-content: center;

  &:hover {
    background: #ff69b4;
    color: white;
  }
`;

const UserInfo = styled.div`
  background: #1a1a1a;
  padding: 20px;
  border-radius: 15px;
  margin-bottom: 20px;
  border: 1px solid #333;
`;

const UserAvatar = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-bottom: 15px;
  border: 3px solid #ff69b4;
`;

const UserName = styled.h3`
  font-size: 1.3rem;
  color: white;
  margin-bottom: 5px;
`;

const UserEmail = styled.p`
  font-size: 0.9rem;
  color: #ccc;
  margin-bottom: 0;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  background: #ff4444;
  color: white;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 20px;
  font-size: 0.9rem;
`;

const Auth0Login = () => {
  const { 
    loginWithRedirect, 
    logout, 
    user, 
    isAuthenticated, 
    isLoading, 
    error 
  } = useAuth0();

  const handleLogin = () => {
    loginWithRedirect({
      appState: { returnTo: '/dashboard' }
    });
  };

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  };

  if (isLoading) {
    return (
      <AuthContainer>
        <AuthCard>
          <LoadingSpinner />
          <p style={{ marginTop: '20px', color: '#ccc' }}>Loading...</p>
        </AuthCard>
      </AuthContainer>
    );
  }

  if (error) {
    return (
      <AuthContainer>
        <AuthCard>
          <ErrorMessage>
            Authentication Error: {error.message}
          </ErrorMessage>
          <TwitterButton onClick={handleLogin}>
            <Twitter size={20} />
            Try Again
          </TwitterButton>
        </AuthCard>
      </AuthContainer>
    );
  }

  if (isAuthenticated && user) {
    return (
      <AuthContainer>
        <AuthCard>
          <Title>Welcome to Velour!</Title>
          <Subtitle>You're successfully logged in</Subtitle>
          
          <UserInfo>
            <UserAvatar 
              src={user.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email)}&background=ff69b4&color=fff`} 
              alt={user.name || user.email}
            />
            <UserName>{user.name || user.nickname || 'User'}</UserName>
            <UserEmail>{user.email}</UserEmail>
          </UserInfo>

          <LogoutButton onClick={handleLogout}>
            <LogOut size={16} />
            Sign Out
          </LogoutButton>
        </AuthCard>
      </AuthContainer>
    );
  }

  return (
    <AuthContainer>
      <AuthCard>
        <Title>Welcome to Velour</Title>
        <Subtitle>
          Sign in with Twitter to access exclusive content and connect with creators
        </Subtitle>

        <TwitterButton onClick={handleLogin}>
          <Twitter size={20} />
          Continue with Twitter
        </TwitterButton>

        <p style={{ 
          fontSize: '0.8rem', 
          color: '#888', 
          marginTop: '20px',
          lineHeight: '1.4'
        }}>
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </AuthCard>
    </AuthContainer>
  );
};

export default Auth0Login;
