import { useState, useEffect } from 'react';
import { welcomeService } from '../services/welcomeService';

export const useWelcomeMessage = (user, isAuthenticated) => {
  const [showWelcome, setShowWelcome] = useState(false);
  const [hasCheckedWelcome, setHasCheckedWelcome] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState(null);

  useEffect(() => {
    const checkWelcomeStatus = async () => {
      if (!isAuthenticated || !user || hasCheckedWelcome) {
        return;
      }

      try {
        // Check if user has received welcome message
        const statusResult = await welcomeService.hasReceivedWelcome(user.sub);
        
        if (statusResult.success && !statusResult.data.hasReceived) {
          // User hasn't received welcome message yet
          setShowWelcome(true);
          
          // Send welcome message
          const sendResult = await welcomeService.sendWelcomeMessage(
            user.sub,
            user.email,
            user.name
          );
          
          if (sendResult.success) {
            setWelcomeMessage(sendResult.data);
          }
        }
      } catch (error) {
        console.error('Error checking welcome status:', error);
        // Show welcome anyway for new users
        setShowWelcome(true);
      } finally {
        setHasCheckedWelcome(true);
      }
    };

    checkWelcomeStatus();
  }, [user, isAuthenticated, hasCheckedWelcome]);

  const markWelcomeAsRead = async () => {
    if (user && welcomeMessage) {
      try {
        await welcomeService.markWelcomeAsRead(user.sub, welcomeMessage.id);
      } catch (error) {
        console.error('Error marking welcome as read:', error);
      }
    }
  };

  const closeWelcome = () => {
    setShowWelcome(false);
    markWelcomeAsRead();
  };

  return {
    showWelcome,
    closeWelcome,
    welcomeMessage
  };
};

export default useWelcomeMessage;
