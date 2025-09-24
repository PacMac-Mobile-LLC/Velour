import { useState, useEffect } from 'react';
import { diditService } from '../services/diditService';

export const useAgeVerification = (user, isAuthenticated) => {
  const [verificationStatus, setVerificationStatus] = useState('not_started');
  const [verificationData, setVerificationData] = useState(null);
  const [showVerification, setShowVerification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkVerificationStatus = async () => {
      if (!isAuthenticated || !user) {
        return;
      }

      try {
        setLoading(true);
        const result = await diditService.getVerificationStatus(user.sub);
        
        if (result.success) {
          setVerificationStatus(result.data.status);
          setVerificationData(result.data);
          
          // Show verification modal if user is a creator and not verified
          if (user.role === 'creator' && result.data.status !== 'verified') {
            setShowVerification(true);
          }
        } else {
          setError(result.message);
        }
      } catch (error) {
        console.error('Error checking verification status:', error);
        setError('Failed to check verification status');
      } finally {
        setLoading(false);
      }
    };

    checkVerificationStatus();
  }, [user, isAuthenticated]);

  const startVerification = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await diditService.initializeVerification(
        user.sub,
        user.email,
        {
          name: user.name,
          email: user.email
        }
      );
      
      if (result.success) {
        setVerificationStatus('pending');
        setVerificationData(result.data);
        // Redirect to Didit verification page
        window.open(result.data.verificationUrl, '_blank');
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error('Error starting verification:', error);
      setError('Failed to start verification process');
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await diditService.resendVerification(user.sub);
      
      if (result.success) {
        setVerificationStatus('pending');
        setVerificationData(result.data);
        // Redirect to Didit verification page
        window.open(result.data.verificationUrl, '_blank');
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error('Error resending verification:', error);
      setError('Failed to resend verification');
    } finally {
      setLoading(false);
    }
  };

  const refreshStatus = async () => {
    try {
      setLoading(true);
      const result = await diditService.getVerificationStatus(user.sub);
      
      if (result.success) {
        setVerificationStatus(result.data.status);
        setVerificationData(result.data);
      }
    } catch (error) {
      console.error('Error refreshing verification status:', error);
    } finally {
      setLoading(false);
    }
  };

  const closeVerification = () => {
    setShowVerification(false);
  };

  const isVerified = verificationStatus === 'verified';
  const isPending = verificationStatus === 'pending';
  const isFailed = verificationStatus === 'failed';
  const needsVerification = user?.role === 'creator' && !isVerified;

  return {
    verificationStatus,
    verificationData,
    showVerification,
    loading,
    error,
    isVerified,
    isPending,
    isFailed,
    needsVerification,
    startVerification,
    resendVerification,
    refreshStatus,
    closeVerification,
    setShowVerification
  };
};

export default useAgeVerification;
