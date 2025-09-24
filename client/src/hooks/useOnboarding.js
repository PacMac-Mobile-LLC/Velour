import { useState, useEffect, useCallback } from 'react';

export const useOnboarding = (user, isAuthenticated) => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userType, setUserType] = useState(null);

  const checkOnboardingStatus = useCallback(async () => {
    if (isAuthenticated && user?.sub) {
      // Check if user has completed onboarding
      const hasCompletedOnboarding = localStorage.getItem(`velour_onboarding_${user.sub}`);
      const savedUserType = localStorage.getItem(`velour_user_type_${user.sub}`);
      
      if (!hasCompletedOnboarding) {
        setShowOnboarding(true);
      } else if (savedUserType) {
        setUserType(savedUserType);
      }
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    checkOnboardingStatus();
  }, [checkOnboardingStatus]);

  const completeOnboarding = useCallback((selectedUserType) => {
    if (user?.sub) {
      // Save onboarding completion and user type
      localStorage.setItem(`velour_onboarding_${user.sub}`, 'completed');
      localStorage.setItem(`velour_user_type_${user.sub}`, selectedUserType);
      
      setUserType(selectedUserType);
      setShowOnboarding(false);
      
      // You could also send this to your backend API here
      // await api.post('/user/onboarding', { userType: selectedUserType });
    }
  }, [user]);

  const skipOnboarding = useCallback(() => {
    setShowOnboarding(false);
  }, []);

  const resetOnboarding = useCallback(() => {
    if (user?.sub) {
      localStorage.removeItem(`velour_onboarding_${user.sub}`);
      localStorage.removeItem(`velour_user_type_${user.sub}`);
      setUserType(null);
      setShowOnboarding(true);
    }
  }, [user]);

  return {
    showOnboarding,
    userType,
    completeOnboarding,
    skipOnboarding,
    resetOnboarding
  };
};
