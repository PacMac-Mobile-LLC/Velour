import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { Auth0Provider } from '@auth0/auth0-react';
import { Auth0ContextProvider, useAuth0Context } from './contexts/Auth0Context';
import { StripeProvider } from './contexts/StripeContext';
import { initializePWA } from './utils/pwa';
import { auth0Config } from './auth0-config';
import Auth0Login from './components/Auth0Login';
import Dashboard from './components/Dashboard';
import HomePage from './components/HomePage';
import VideoRoom from './components/VideoRoom';
import NotificationPrompt from './components/NotificationPrompt';
import './App.css';

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth0Context();
  
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontSize: '1.2rem'
      }}>
        Loading...
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

// Public Route Component (redirect to dashboard if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth0Context();
  
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontSize: '1.2rem'
      }}>
        Loading...
      </div>
    );
  }
  
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

function App() {
  useEffect(() => {
    // Initialize PWA functionality
    initializePWA();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Auth0Provider
        domain={auth0Config.domain}
        clientId={auth0Config.clientId}
        authorizationParams={auth0Config.authorizationParams}
      >
        <Auth0ContextProvider>
          <StripeProvider>
            <Router>
            <div className="App">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/room/:roomId" element={<VideoRoom />} />
                
                {/* Auth routes */}
                <Route 
                  path="/auth" 
                  element={
                    <PublicRoute>
                      <Auth0Login />
                    </PublicRoute>
                  } 
                />
                
                {/* Protected routes */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
              
              {/* Toast notifications */}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: '#4ade80',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    duration: 5000,
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
              
              {/* PWA Notification Prompt */}
              <NotificationPrompt />
            </div>
          </Router>
        </StripeProvider>
      </Auth0ContextProvider>
      </Auth0Provider>
    </QueryClientProvider>
  );
}

export default App;
// Cache bust - Tue Sep 23 22:42:21 CDT 2025
