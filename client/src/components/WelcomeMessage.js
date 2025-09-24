import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  MessageCircle, 
  Heart, 
  Star, 
  Users, 
  Camera, 
  Calendar, 
  BarChart3, 
  TrendingUp,
  Send,
  X,
  CheckCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { welcomeService } from '../services/welcomeService';

const WelcomeContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  backdrop-filter: blur(10px);
`;

const WelcomeModal = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  border: 2px solid #ff69b4;
  border-radius: 20px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  position: relative;
`;

const WelcomeHeader = styled.div`
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

const WelcomeTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const WelcomeSubtitle = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  margin: 0;
`;

const WelcomeContent = styled.div`
  padding: 30px;
  color: white;
`;

const MessageContent = styled.div`
  line-height: 1.8;
  font-size: 1rem;
  margin-bottom: 30px;
  white-space: pre-line;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin: 30px 0;
`;

const FeatureCard = styled.div`
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

const FeatureIcon = styled.div`
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

const FeatureTitle = styled.h3`
  color: white;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 8px;
`;

const FeatureDescription = styled.p`
  color: #ccc;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const QuickReplies = styled.div`
  margin-top: 30px;
`;

const QuickRepliesTitle = styled.h3`
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const QuickReplyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 10px;
`;

const QuickReplyButton = styled.button`
  background: rgba(42, 42, 42, 0.6);
  border: 1px solid #444;
  border-radius: 10px;
  padding: 15px;
  color: white;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 10px;

  &:hover {
    background: rgba(255, 105, 180, 0.1);
    border-color: #ff69b4;
    transform: translateY(-2px);
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 30px;
  justify-content: center;
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

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(255, 105, 180, 0.3);
  }
`;

const MattySignature = styled.div`
  background: rgba(255, 105, 180, 0.1);
  border: 1px solid rgba(255, 105, 180, 0.3);
  border-radius: 15px;
  padding: 20px;
  margin-top: 30px;
  text-align: center;
`;

const MattyAvatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff69b4 0%, #7a288a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15px;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
`;

const MattyName = styled.div`
  color: #ff69b4;
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 5px;
`;

const MattyTitle = styled.div`
  color: #ccc;
  font-size: 0.9rem;
  margin-bottom: 10px;
`;

const MattyFollow = styled.div`
  color: #888;
  font-size: 0.8rem;
`;

const WelcomeMessage = ({ isOpen, onClose, user }) => {
  const [welcomeData, setWelcomeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && user) {
      loadWelcomeMessage();
    }
  }, [isOpen, user]);

  const loadWelcomeMessage = async () => {
    try {
      setLoading(true);
      // For now, we'll use the default template
      // In production, this would fetch from the API
      setWelcomeData({
        subject: "Welcome to Velour! 🎉",
        content: `Hi ${user.name || 'there'}! 👋

Welcome to Velour - Where Desire Meets Luxury! I'm Matty, the founder of this platform, and I'm thrilled to have you join our community of creators and fans.

🎯 **What you can do on Velour:**
• Subscribe to your favorite creators for exclusive content
• Discover amazing creators through our recommendation system
• Send direct messages to creators you're subscribed to
• Organize creators into custom collections
• Access private content in creator vaults
• Schedule live sessions with creators
• Track your subscription analytics and statements

💬 **Need Help?**
I'm here to help! You can always DM me directly for:
• Platform questions and support
• Feature requests and feedback
• Technical issues
• Creator account setup
• Payment or subscription help

🚀 **Getting Started:**
1. Browse our featured creators on the homepage
2. Subscribe to creators you love
3. Start building your collections
4. Explore the vault for exclusive content
5. Don't hesitate to reach out if you need anything!

Thank you for choosing Velour. I'm excited to see what amazing connections you'll make here!

Best regards,
Matty
Founder & CEO, Velour

P.S. - Follow me @matty for platform updates and behind-the-scenes content! ✨`,
        quickReplies: [
          "Thanks! How do I find creators?",
          "I need help with my account",
          "How do subscriptions work?",
          "I want to become a creator"
        ]
      });
    } catch (error) {
      console.error('Error loading welcome message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickReply = (reply) => {
    // In a real implementation, this would send a message to Matty
    console.log('Quick reply:', reply);
    // For now, just close the modal
    onClose();
  };

  const handleStartExploring = () => {
    onClose();
    // Could navigate to creators page or dashboard
  };

  const handleMessageMatty = () => {
    onClose();
    // Could open messaging interface with Matty
  };

  if (!isOpen || loading) {
    return null;
  }

  return (
    <WelcomeContainer>
      <WelcomeModal>
        <WelcomeHeader>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
          <WelcomeTitle>
            <Sparkles size={24} />
            Welcome to Velour!
          </WelcomeTitle>
          <WelcomeSubtitle>
            A message from Matty, your platform guide
          </WelcomeSubtitle>
        </WelcomeHeader>

        <WelcomeContent>
          <MessageContent>
            {welcomeData?.content}
          </MessageContent>

          <FeaturesGrid>
            <FeatureCard>
              <FeatureIcon><Heart size={20} /></FeatureIcon>
              <FeatureTitle>Subscribe to Creators</FeatureTitle>
              <FeatureDescription>Get exclusive content from your favorite creators</FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon><MessageCircle size={20} /></FeatureIcon>
              <FeatureTitle>Direct Messages</FeatureTitle>
              <FeatureDescription>Chat directly with creators you're subscribed to</FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon><Star size={20} /></FeatureIcon>
              <FeatureTitle>Collections</FeatureTitle>
              <FeatureDescription>Organize creators into custom categories</FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon><Camera size={20} /></FeatureIcon>
              <FeatureTitle>Vault Access</FeatureTitle>
              <FeatureDescription>View private photos and videos from creators</FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon><Calendar size={20} /></FeatureIcon>
              <FeatureTitle>Live Sessions</FeatureTitle>
              <FeatureDescription>Schedule and join live streaming sessions</FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon><TrendingUp size={20} /></FeatureIcon>
              <FeatureTitle>Analytics</FeatureTitle>
              <FeatureDescription>Track your subscription activity and spending</FeatureDescription>
            </FeatureCard>
          </FeaturesGrid>

          <QuickReplies>
            <QuickRepliesTitle>
              <MessageCircle size={20} />
              Quick Questions?
            </QuickRepliesTitle>
            <QuickReplyGrid>
              {welcomeData?.quickReplies.map((reply, index) => (
                <QuickReplyButton key={index} onClick={() => handleQuickReply(reply)}>
                  <Send size={16} />
                  {reply}
                </QuickReplyButton>
              ))}
            </QuickReplyGrid>
          </QuickReplies>

          <MattySignature>
            <MattyAvatar>M</MattyAvatar>
            <MattyName>Matty</MattyName>
            <MattyTitle>Founder & CEO, Velour</MattyTitle>
            <MattyFollow>Follow @matty for updates and support</MattyFollow>
          </MattySignature>

          <ActionButtons>
            <ActionButton onClick={handleMessageMatty}>
              <MessageCircle size={16} />
              Message Matty
            </ActionButton>
            <ActionButton primary onClick={handleStartExploring}>
              <ArrowRight size={16} />
              Start Exploring
            </ActionButton>
          </ActionButtons>
        </WelcomeContent>
      </WelcomeModal>
    </WelcomeContainer>
  );
};

export default WelcomeMessage;
