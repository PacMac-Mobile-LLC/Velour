import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

const Auth0Context = createContext();

export const useAuth0Context = () => {
  const context = useContext(Auth0Context);
  if (!context) {
    throw new Error('useAuth0Context must be used within an Auth0ContextProvider');
  }
  return context;
};

export const Auth0ContextProvider = ({ children }) => {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    getAccessTokenSilently,
    error 
  } = useAuth0();
  
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Configure axios with Auth0 token
  useEffect(() => {
    const configureAxios = async () => {
      if (isAuthenticated && user) {
        try {
          const token = await getAccessTokenSilently();
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Create user profile from Auth0 user
          const profile = {
            id: user.sub,
            username: user.nickname || user.name?.replace(/\s+/g, '').toLowerCase() || 'user',
            email: user.email,
            displayName: user.name || user.nickname || 'User',
            picture: user.picture,
            role: 'subscriber', // Default role
            provider: 'twitter', // Since we're using Twitter
            createdAt: new Date().toISOString()
          };
          
          setUserProfile(profile);
          
          // Store in localStorage for persistence
          localStorage.setItem('velour_user', JSON.stringify(profile));
          localStorage.setItem('velour_token', token);
          
        } catch (error) {
          console.error('Error getting access token:', error);
        }
      } else {
        // Clear auth data when not authenticated
        delete axios.defaults.headers.common['Authorization'];
        setUserProfile(null);
        localStorage.removeItem('velour_user');
        localStorage.removeItem('velour_token');
      }
      
      setLoading(false);
    };

    configureAxios();
  }, [isAuthenticated, user, getAccessTokenSilently]);

  // Load user from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('velour_user');
    const savedToken = localStorage.getItem('velour_token');
    
    if (savedUser && savedToken && !isAuthenticated) {
      try {
        const userData = JSON.parse(savedUser);
        setUserProfile(userData);
        axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
      } catch (error) {
        console.error('Error loading saved user:', error);
        localStorage.removeItem('velour_user');
        localStorage.removeItem('velour_token');
      }
    }
    
    setLoading(false);
  }, []);

  const value = {
    user: userProfile,
    isAuthenticated: isAuthenticated || !!userProfile,
    loading: isLoading || loading,
    error,
    // Auth0 specific methods
    getAccessTokenSilently,
    // User profile methods
    updateUserProfile: (updates) => {
      if (userProfile) {
        const updatedProfile = { ...userProfile, ...updates };
        setUserProfile(updatedProfile);
        localStorage.setItem('velour_user', JSON.stringify(updatedProfile));
      }
    }
  };

  return (
    <Auth0Context.Provider value={value}>
      {children}
    </Auth0Context.Provider>
  );
};
