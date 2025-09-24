import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  User, 
  Camera, 
  Heart, 
  Star, 
  MessageCircle, 
  DollarSign, 
  Users, 
  Eye, 
  TrendingUp,
  CheckCircle,
  Play,
  Upload,
  Calendar,
  BarChart3,
  Settings,
  Shield,
  Zap
} from 'lucide-react';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
`;

const OnboardingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  backdrop-filter: blur(10px);
`;

const OnboardingContainer = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  border-radius: 20px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  color: white;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: ${fadeIn} 0.5s ease-out;
  border: 1px solid rgba(255, 105, 180, 0.3);
`;

const OnboardingHeader = styled.div`
  background: linear-gradient(135deg, #7a288a 0%, #ff69b4 100%);
  padding: 20px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const OnboardingTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: white;
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }
`;

const OnboardingContent = styled.div`
  padding: 40px;
  overflow-y: auto;
  max-height: calc(90vh - 120px);
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
  gap: 10px;
`;

const StepDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.active ? '#ff69b4' : '#444'};
  transition: all 0.3s ease;
`;

const StepContent = styled.div`
  text-align: center;
  animation: ${slideIn} 0.3s ease-out;
`;

const StepTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 20px 0;
  background: linear-gradient(135deg, #ff69b4 0%, #7a288a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const StepDescription = styled.p`
  font-size: 1.1rem;
  color: #ccc;
  margin: 0 0 30px 0;
  line-height: 1.6;
`;

const UserTypeGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin: 30px 0;
`;

const UserTypeCard = styled.div`
  background: ${props => props.selected ? 'linear-gradient(135deg, #7a288a 0%, #ff69b4 100%)' : 'rgba(42, 42, 42, 0.8)'};
  border: 2px solid ${props => props.selected ? '#ff69b4' : '#444'};
  border-radius: 15px;
  padding: 30px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(255, 105, 180, 0.3);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 105, 180, 0.1) 0%, rgba(122, 40, 138, 0.1) 100%);
    opacity: ${props => props.selected ? 1 : 0};
    transition: opacity 0.3s ease;
  }
`;

const UserTypeIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 15px;
  position: relative;
  z-index: 1;
`;

const UserTypeTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0 0 10px 0;
  position: relative;
  z-index: 1;
`;

const UserTypeDescription = styled.p`
  font-size: 0.9rem;
  color: #ccc;
  margin: 0;
  line-height: 1.4;
  position: relative;
  z-index: 1;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin: 30px 0;
`;

const FeatureCard = styled.div`
  background: rgba(42, 42, 42, 0.8);
  border: 1px solid #444;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #ff69b4;
    transform: translateY(-3px);
  }
`;

const FeatureIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 15px;
  color: #ff69b4;
`;

const FeatureTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 10px 0;
  color: white;
`;

const FeatureDescription = styled.p`
  font-size: 0.9rem;
  color: #ccc;
  margin: 0;
  line-height: 1.4;
`;

const OnboardingFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  background: rgba(0, 0, 0, 0.3);
  border-top: 1px solid #333;
`;

const NavigationButton = styled.button`
  background: ${props => props.primary ? 'linear-gradient(135deg, #7a288a 0%, #ff69b4 100%)' : 'rgba(42, 42, 42, 0.8)'};
  border: 1px solid ${props => props.primary ? '#ff69b4' : '#444'};
  border-radius: 10px;
  padding: 12px 24px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 105, 180, 0.3);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const SkipButton = styled.button`
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  font-size: 0.9rem;
  transition: color 0.3s ease;
  
  &:hover {
    color: #ff69b4;
  }
`;

const OnboardingFlow = ({ isOpen, onClose, user, userType, onUserTypeSelect }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedUserType, setSelectedUserType] = useState(userType || null);

  const steps = [
    {
      title: "Welcome to Velour! 🎉",
      description: "Let's get you set up and ready to explore the ultimate platform where desire meets connection.",
      content: (
        <div>
          <UserTypeGrid>
            <UserTypeCard 
              selected={selectedUserType === 'creator'}
              onClick={() => setSelectedUserType('creator')}
            >
              <UserTypeIcon>🎨</UserTypeIcon>
              <UserTypeTitle>Content Creator</UserTypeTitle>
              <UserTypeDescription>
                Share your passion, build your community, and monetize your content with exclusive subscriptions and direct fan connections.
              </UserTypeDescription>
            </UserTypeCard>
            
            <UserTypeCard 
              selected={selectedUserType === 'member'}
              onClick={() => setSelectedUserType('member')}
            >
              <UserTypeIcon>💖</UserTypeIcon>
              <UserTypeTitle>Fan & Member</UserTypeTitle>
              <UserTypeDescription>
                Discover amazing creators, subscribe to exclusive content, and connect directly with your favorite personalities.
              </UserTypeDescription>
            </UserTypeCard>
          </UserTypeGrid>
        </div>
      )
    },
    {
      title: selectedUserType === 'creator' ? "Creator Features 🚀" : "Member Benefits 💎",
      description: selectedUserType === 'creator' 
        ? "Here's what you can do as a creator on Velour:"
        : "Here's what you can enjoy as a member:",
      content: (
        <FeatureGrid>
          {selectedUserType === 'creator' ? [
            { icon: <Camera size={32} />, title: "Content Upload", description: "Share photos, videos, and live streams with your fans" },
            { icon: <DollarSign size={32} />, title: "Monetization", description: "Set subscription prices and earn from your content" },
            { icon: <MessageCircle size={32} />, title: "Direct Messages", description: "Connect personally with your biggest fans" },
            { icon: <BarChart3 size={32} />, title: "Analytics", description: "Track your performance and grow your audience" },
            { icon: <Calendar size={32} />, title: "Live Streaming", description: "Schedule and host live sessions with your community" },
            { icon: <Users size={32} />, title: "Community Building", description: "Create collections and organize your content" }
          ] : [
            { icon: <Heart size={32} />, title: "Exclusive Content", description: "Access premium content from your favorite creators" },
            { icon: <MessageCircle size={32} />, title: "Direct Access", description: "Message creators and get personal responses" },
            { icon: <Star size={32} />, title: "Support Creators", description: "Show appreciation with likes, tips, and subscriptions" },
            { icon: <Eye size={32} />, title: "Discover", description: "Find new creators and content that matches your interests" },
            { icon: <TrendingUp size={32} />, title: "Early Access", description: "Be the first to see new content and live streams" },
            { icon: <Shield size={32} />, title: "Safe Environment", description: "Enjoy content in a secure, age-verified platform" }
          ]}
        </FeatureGrid>
      )
    },
    {
      title: "Let's Get Started! ✨",
      description: "You're all set! Here are some quick actions to help you get the most out of Velour:",
      content: (
        <FeatureGrid>
          {selectedUserType === 'creator' ? [
            { icon: <Upload size={32} />, title: "Upload Your First Content", description: "Start by adding photos or videos to your vault" },
            { icon: <Settings size={32} />, title: "Complete Your Profile", description: "Add a bio, links, and profile picture" },
            { icon: <DollarSign size={32} />, title: "Set Subscription Prices", description: "Configure your subscription tiers and pricing" },
            { icon: <Calendar size={32} />, title: "Schedule Live Sessions", description: "Plan your first live streaming session" }
          ] : [
            { icon: <Eye size={32} />, title: "Browse Creators", description: "Discover amazing creators and their content" },
            { icon: <Heart size={32} />, title: "Subscribe to Favorites", description: "Support creators you love with subscriptions" },
            { icon: <MessageCircle size={32} />, title: "Start Conversations", description: "Send messages to your favorite creators" },
            { icon: <Star size={32} />, title: "Create Collections", description: "Organize your favorite content and creators" }
          ]}
        </FeatureGrid>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      if (onUserTypeSelect && selectedUserType) {
        onUserTypeSelect(selectedUserType);
      }
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <OnboardingOverlay>
      <OnboardingContainer>
        <OnboardingHeader>
          <OnboardingTitle>
            {currentStep === 0 ? 'Welcome to Velour' : 
             currentStep === 1 ? 'Platform Features' : 'Get Started'}
          </OnboardingTitle>
          <CloseButton onClick={handleSkip}>
            <X size={20} />
          </CloseButton>
        </OnboardingHeader>

        <OnboardingContent>
          <StepIndicator>
            {steps.map((_, index) => (
              <StepDot key={index} active={index === currentStep} />
            ))}
          </StepIndicator>

          <StepContent>
            <StepTitle>{steps[currentStep].title}</StepTitle>
            <StepDescription>{steps[currentStep].description}</StepDescription>
            {steps[currentStep].content}
          </StepContent>
        </OnboardingContent>

        <OnboardingFooter>
          <div>
            {currentStep > 0 && (
              <NavigationButton onClick={handlePrevious}>
                <ArrowLeft size={16} />
                Previous
              </NavigationButton>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <SkipButton onClick={handleSkip}>
              Skip Tutorial
            </SkipButton>
            <NavigationButton 
              primary 
              onClick={handleNext}
              disabled={currentStep === 0 && !selectedUserType}
            >
              {currentStep === steps.length - 1 ? 'Complete Setup' : 'Next'}
              <ArrowRight size={16} />
            </NavigationButton>
          </div>
        </OnboardingFooter>
      </OnboardingContainer>
    </OnboardingOverlay>
  );
};

export default OnboardingFlow;
