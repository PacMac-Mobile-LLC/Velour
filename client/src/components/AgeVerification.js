import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  User, 
  Mail, 
  Calendar,
  Camera,
  Upload,
  X,
  RefreshCw,
  ExternalLink,
  Info
} from 'lucide-react';
import { diditService } from '../services/diditService';

const VerificationContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  backdrop-filter: blur(10px);
`;

const VerificationModal = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  border: 2px solid #ff69b4;
  border-radius: 20px;
  max-width: 700px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  position: relative;
`;

const VerificationHeader = styled.div`
  background: linear-gradient(135deg, #ff69b4 0%, #7a288a 100%);
  padding: 30px;
  border-radius: 18px 18px 0 0;
  text-align: center;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
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

const VerificationTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const VerificationSubtitle = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  margin: 0;
`;

const VerificationContent = styled.div`
  padding: 30px;
  color: white;
`;

const StatusCard = styled.div`
  background: ${props => {
    switch(props.status) {
      case 'verified': return 'rgba(34, 197, 94, 0.1)';
      case 'pending': return 'rgba(251, 191, 36, 0.1)';
      case 'failed': return 'rgba(239, 68, 68, 0.1)';
      default: return 'rgba(42, 42, 42, 0.6)';
    }
  }};
  border: 2px solid ${props => {
    switch(props.status) {
      case 'verified': return '#22c55e';
      case 'pending': return '#fbbf24';
      case 'failed': return '#ef4444';
      default: return '#444';
    }
  }};
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 30px;
  text-align: center;
`;

const StatusIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${props => {
    switch(props.status) {
      case 'verified': return 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';
      case 'pending': return 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)';
      case 'failed': return 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
      default: return 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)';
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: white;
  font-size: 1.5rem;
`;

const StatusTitle = styled.h2`
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 10px;
`;

const StatusDescription = styled.p`
  color: #ccc;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 20px;
`;

const ActionButton = styled.button`
  background: ${props => props.primary ? 'linear-gradient(135deg, #ff69b4 0%, #7a288a 100%)' : 'rgba(42, 42, 42, 0.6)'};
  border: 1px solid ${props => props.primary ? '#ff69b4' : '#444'};
  border-radius: 10px;
  padding: 15px 30px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 auto;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(255, 105, 180, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const InfoSection = styled.div`
  background: rgba(42, 42, 42, 0.6);
  border: 1px solid #444;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 30px;
`;

const InfoTitle = styled.h3`
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const InfoList = styled.ul`
  color: #ccc;
  line-height: 1.8;
  padding-left: 20px;
  margin: 0;
`;

const InfoListItem = styled.li`
  margin-bottom: 8px;
`;

const VerificationSteps = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin: 30px 0;
`;

const StepCard = styled.div`
  background: rgba(42, 42, 42, 0.6);
  border: 1px solid #444;
  border-radius: 15px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    border-color: #ff69b4;
    transform: translateY(-5px);
  }
`;

const StepIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff69b4 0%, #7a288a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15px;
  color: white;
  font-size: 1.2rem;
`;

const StepTitle = styled.h4`
  color: white;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 8px;
`;

const StepDescription = styled.p`
  color: #ccc;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const AgeVerification = ({ isOpen, onClose, user, onVerificationComplete }) => {
  const [verificationStatus, setVerificationStatus] = useState('not_started');
  const [verificationData, setVerificationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && user) {
      checkVerificationStatus();
    }
  }, [isOpen, user]);

  const checkVerificationStatus = async () => {
    try {
      setLoading(true);
      const result = await diditService.getVerificationStatus(user.sub);
      
      if (result.success) {
        setVerificationStatus(result.data.status);
        setVerificationData(result.data);
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

  const handleVerificationComplete = () => {
    if (onVerificationComplete) {
      onVerificationComplete();
    }
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  const renderStatusContent = () => {
    switch (verificationStatus) {
      case 'verified':
        return (
          <StatusCard status="verified">
            <StatusIcon status="verified">
              <CheckCircle size={30} />
            </StatusIcon>
            <StatusTitle>Age Verification Complete! ✅</StatusTitle>
            <StatusDescription>
              Congratulations! Your age has been successfully verified. You can now access all creator features on Velour.
            </StatusDescription>
            <ActionButton primary onClick={handleVerificationComplete}>
              <CheckCircle size={16} />
              Continue to Dashboard
            </ActionButton>
          </StatusCard>
        );

      case 'pending':
        return (
          <StatusCard status="pending">
            <StatusIcon status="pending">
              <Clock size={30} />
            </StatusIcon>
            <StatusTitle>Verification in Progress ⏳</StatusTitle>
            <StatusDescription>
              Your age verification is being processed. This usually takes a few minutes. You'll receive an email notification once it's complete.
            </StatusDescription>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <ActionButton onClick={checkVerificationStatus}>
                <RefreshCw size={16} />
                Check Status
              </ActionButton>
              <ActionButton onClick={resendVerification} disabled={loading}>
                <RefreshCw size={16} />
                Resend Verification
              </ActionButton>
            </div>
          </StatusCard>
        );

      case 'failed':
        return (
          <StatusCard status="failed">
            <StatusIcon status="failed">
              <AlertCircle size={30} />
            </StatusIcon>
            <StatusTitle>Verification Failed ❌</StatusTitle>
            <StatusDescription>
              Unfortunately, we couldn't verify your age. Please try again with clear, high-quality photos of your ID.
            </StatusDescription>
            <ActionButton primary onClick={resendVerification} disabled={loading}>
              <RefreshCw size={16} />
              Try Again
            </ActionButton>
          </StatusCard>
        );

      default:
        return (
          <StatusCard status="not_started">
            <StatusIcon status="not_started">
              <Shield size={30} />
            </StatusIcon>
            <StatusTitle>Age Verification Required 🔞</StatusTitle>
            <StatusDescription>
              To become a creator on Velour, you must verify that you are 21 years or older. This is required by law for adult content platforms.
            </StatusDescription>
            <ActionButton primary onClick={startVerification} disabled={loading}>
              <Shield size={16} />
              {loading ? 'Starting...' : 'Start Verification'}
            </ActionButton>
          </StatusCard>
        );
    }
  };

  return (
    <VerificationContainer>
      <VerificationModal>
        <VerificationHeader>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
          <VerificationTitle>
            <Shield size={24} />
            Age Verification
          </VerificationTitle>
          <VerificationSubtitle>
            Required for all creators on Velour
          </VerificationSubtitle>
        </VerificationHeader>

        <VerificationContent>
          {error && (
            <div style={{ 
              background: 'rgba(239, 68, 68, 0.1)', 
              border: '1px solid #ef4444', 
              borderRadius: '10px', 
              padding: '15px', 
              marginBottom: '20px',
              color: '#fca5a5',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          {renderStatusContent()}

          <InfoSection>
            <InfoTitle>
              <Info size={20} />
              Why is age verification required?
            </InfoTitle>
            <InfoList>
              <InfoListItem>Velour is an 18+ platform for adult content creators</InfoListItem>
              <InfoListItem>Legal compliance requires age verification for all creators</InfoListItem>
              <InfoListItem>Protects both creators and the platform from legal issues</InfoListItem>
              <InfoListItem>Ensures all content creators are of legal age</InfoListItem>
            </InfoList>
          </InfoSection>

          <VerificationSteps>
            <StepCard>
              <StepIcon><User size={20} /></StepIcon>
              <StepTitle>1. Provide ID</StepTitle>
              <StepDescription>Upload a clear photo of your government-issued ID</StepDescription>
            </StepCard>

            <StepCard>
              <StepIcon><Camera size={20} /></StepIcon>
              <StepTitle>2. Take Selfie</StepTitle>
              <StepDescription>Take a selfie to match with your ID photo</StepDescription>
            </StepCard>

            <StepCard>
              <StepIcon><CheckCircle size={20} /></StepIcon>
              <StepTitle>3. Get Verified</StepTitle>
              <StepDescription>Our system verifies your age and identity</StepDescription>
            </StepCard>
          </VerificationSteps>

          <InfoSection>
            <InfoTitle>
              <Shield size={20} />
              Privacy & Security
            </InfoTitle>
            <InfoList>
              <InfoListItem>Your personal information is encrypted and secure</InfoListItem>
              <InfoListItem>We only store verification status, not your ID photos</InfoListItem>
              <InfoListItem>Verification is processed by our trusted partner Didit.me</InfoListItem>
              <InfoListItem>Your data is never shared with third parties</InfoListItem>
            </InfoList>
          </InfoSection>
        </VerificationContent>
      </VerificationModal>
    </VerificationContainer>
  );
};

export default AgeVerification;
