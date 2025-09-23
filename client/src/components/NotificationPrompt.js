import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Bell, X, Check } from 'lucide-react';
import { requestNotificationPermission, showNotification } from '../utils/pwa';
import toast from 'react-hot-toast';

const NotificationBanner = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background: linear-gradient(135deg, #ff69b4 0%, #7a288a 100%);
  color: white;
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(255, 105, 180, 0.3);
  z-index: 1000;
  max-width: 320px;
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    top: 10px;
    right: 10px;
    left: 10px;
    max-width: none;
  }
`;

const BannerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const BannerTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const BannerText = styled.p`
  margin: 0 0 16px 0;
  font-size: 0.9rem;
  line-height: 1.4;
  opacity: 0.9;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const BannerButton = styled.button`
  flex: 1;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &.primary {
    background: white;
    color: #ff69b4;

    &:hover {
      background: rgba(255, 255, 255, 0.9);
    }
  }

  &.secondary {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.2);

    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
`;

const NotificationPrompt = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    // Check if notifications are supported and permission is not granted
    if ('Notification' in window && Notification.permission === 'default') {
      // Show banner after a short delay
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleEnableNotifications = async () => {
    setIsRequesting(true);
    try {
      const granted = await requestNotificationPermission();
      if (granted) {
        toast.success('Notifications enabled! You\'ll receive updates about new content.');
        setShowBanner(false);
        
        // Show a test notification
        setTimeout(() => {
          showNotification('Welcome to Velour!', {
            body: 'You\'re now subscribed to notifications. Stay updated with exclusive content!',
            icon: '/icon.svg'
          });
        }, 1000);
      } else {
        toast.error('Notification permission denied. You can enable it later in your browser settings.');
        setShowBanner(false);
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast.error('Failed to enable notifications. Please try again.');
    } finally {
      setIsRequesting(false);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <NotificationBanner>
      <BannerHeader>
        <BannerTitle>
          <Bell size={18} />
          Enable Notifications
        </BannerTitle>
        <CloseButton onClick={handleDismiss}>
          <X size={16} />
        </CloseButton>
      </BannerHeader>
      
      <BannerText>
        Get notified about new content, messages, and exclusive updates from your favorite creators.
      </BannerText>
      
      <ButtonGroup>
        <BannerButton 
          className="secondary" 
          onClick={handleDismiss}
        >
          Maybe Later
        </BannerButton>
        <BannerButton 
          className="primary" 
          onClick={handleEnableNotifications}
          disabled={isRequesting}
        >
          {isRequesting ? 'Enabling...' : 'Enable'}
        </BannerButton>
      </ButtonGroup>
    </NotificationBanner>
  );
};

export default NotificationPrompt;
