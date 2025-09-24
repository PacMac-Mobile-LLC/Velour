import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

// Configure axios with base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  async (config) => {
    // Get the auth token from localStorage or Auth0
    const token = localStorage.getItem('velour_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const StripeContext = createContext();

export const useStripe = () => {
  const context = useContext(StripeContext);
  if (!context) {
    throw new Error('useStripe must be used within a StripeProvider');
  }
  return context;
};

export const StripeProvider = ({ children }) => {
  const [stripePromise, setStripePromise] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        // In production, you'd get this from your backend
        const publishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_key_here';
        const stripe = await loadStripe(publishableKey);
        setStripePromise(stripe);
      } catch (error) {
        console.error('Failed to initialize Stripe:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeStripe();
  }, []);

  const createSubscription = async (creatorId, plan, interval) => {
    try {
      setLoading(true);
      const response = await api.post('/api/payments/subscribe', {
        creatorId,
        plan,
        interval
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create subscription'
      };
    } finally {
      setLoading(false);
    }
  };

  const cancelSubscription = async (subscriptionId, immediately = false) => {
    try {
      setLoading(true);
      const response = await api.post(`/api/payments/cancel-subscription/${subscriptionId}`, {
        immediately
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to cancel subscription'
      };
    } finally {
      setLoading(false);
    }
  };

  const createPaymentIntent = async (contentId, amount) => {
    try {
      setLoading(true);
      const response = await api.post('/api/payments/pay-per-view', {
        contentId,
        amount
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create payment intent'
      };
    } finally {
      setLoading(false);
    }
  };

  const setupCustomer = async () => {
    try {
      setLoading(true);
      const response = await api.post('/api/payments/setup-customer');

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to setup customer'
      };
    } finally {
      setLoading(false);
    }
  };

  const getPaymentMethods = async () => {
    try {
      const response = await api.get('/api/payments/payment-methods');

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get payment methods'
      };
    }
  };

  const getSubscriptions = async () => {
    try {
      const response = await api.get('/api/payments/subscriptions');

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get subscriptions'
      };
    }
  };

  const getAnalytics = async () => {
    try {
      const response = await api.get('/api/payments/analytics');

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get analytics'
      };
    }
  };

  const value = {
    stripePromise,
    loading,
    createSubscription,
    cancelSubscription,
    createPaymentIntent,
    setupCustomer,
    getPaymentMethods,
    getSubscriptions,
    getAnalytics
  };

  return (
    <StripeContext.Provider value={value}>
      {children}
    </StripeContext.Provider>
  );
};
