import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Plus, ArrowRight, Users, ExternalLink, Calendar, DollarSign, Phone, Video, MessageSquare, Star } from 'lucide-react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
  color: white;
`;

const HeaderTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 10px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
`;

const HeaderSubtitle = styled.p`
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 30px;
`;

const ResourceLinks = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
  justify-content: center;
`;

const ResourceLink = styled.a`
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 10px 20px;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }
`;

const QuoteSection = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 30px;
  backdrop-filter: blur(10px);
  max-width: 600px;
  text-align: center;
`;

const Quote = styled.blockquote`
  font-size: 1.1rem;
  font-style: italic;
  color: white;
  margin: 0;
  line-height: 1.6;
`;

const QuoteAuthor = styled.cite`
  display: block;
  margin-top: 10px;
  font-size: 0.9rem;
  opacity: 0.8;
`;

const DonationSection = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 30px;
  backdrop-filter: blur(10px);
  max-width: 600px;
  text-align: center;
`;

const DonationText = styled.p`
  font-size: 0.95rem;
  color: white;
  margin: 0 0 15px 0;
  line-height: 1.5;
  opacity: 0.9;
`;

const DonationButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 12px 24px;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
    border-color: rgba(255, 255, 255, 0.5);
  }
`;

const Footer = styled.div`
  margin-top: 40px;
  text-align: center;
  color: white;
  opacity: 0.9;
`;

const HelplineSection = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  backdrop-filter: blur(10px);
  max-width: 600px;
  margin: 0 auto;
`;

const HelplineText = styled.p`
  font-size: 1rem;
  color: white;
  margin: 0 0 10px 0;
  font-weight: 600;
`;

const PhoneNumbers = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  
  @media (min-width: 480px) {
    flex-direction: row;
    justify-content: center;
    gap: 20px;
  }
`;

const PhoneLink = styled.a`
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
  }
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  max-width: 500px;
  width: 100%;
  text-align: center;
`;

const Header = styled.div`
  margin-bottom: 30px;
`;

const Icon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  margin-bottom: 20px;
  color: white;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
`;

const InputGroup = styled.div`
  text-align: left;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px 20px;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: #999;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 10px;
`;

const Button = styled.button`
  flex: 1;
  padding: 15px 20px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CreateButton = styled(Button)`
  background: #f8f9fa;
  color: #333;
  border: 2px solid #e1e5e9;

  &:hover:not(:disabled) {
    background: #e9ecef;
    border-color: #dee2e6;
  }
`;

const JoinButton = styled(Button)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }
`;

// Inspirational quotes for recovery
const quotes = [
  {
    text: "We are not bad people trying to get good, we are sick people trying to get well.",
    author: "CMA Literature"
  },
  {
    text: "One day at a time, one moment at a time, we can stay clean and sober.",
    author: "CMA Tradition"
  },
  {
    text: "The only requirement for membership is a desire to stop using.",
    author: "CMA Third Tradition"
  },
  {
    text: "We can't do it alone, but together we can do what we could never do alone.",
    author: "CMA Fellowship"
  },
  {
    text: "Recovery is not about perfection, it's about progress.",
    author: "CMA Wisdom"
  }
];

const HomePage = () => {
  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [currentQuote, setCurrentQuote] = useState(quotes[0]);

  // Rotate quotes every 5 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Ping server every 5 minutes to keep Render service alive
  useEffect(() => {
    const pingServer = async () => {
      try {
        const response = await fetch('/api/ping');
        if (response.ok) {
          const data = await response.json();
          console.log('Server ping successful from homepage:', data.message);
        } else {
          console.warn('Server ping failed from homepage:', response.status);
        }
      } catch (error) {
        console.error('Server ping error from homepage:', error);
      }
    };

    // Ping immediately on mount
    pingServer();

    // Set up interval to ping every 5 minutes (300,000 ms)
    const pingInterval = setInterval(pingServer, 5 * 60 * 1000);

    return () => {
      clearInterval(pingInterval);
    };
  }, []);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter your name');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();
      if (data.success) {
        navigate(`/room/${data.roomId}?name=${encodeURIComponent(name)}`);
      } else {
        alert('Failed to create room. Please try again.');
      }
    } catch (error) {
      console.error('Error creating room:', error);
      // Fallback: generate room ID locally
      const fallbackRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
      navigate(`/room/${fallbackRoomId}?name=${encodeURIComponent(name)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter your name');
      return;
    }
    if (!roomId.trim()) {
      alert('Please enter a room ID');
      return;
    }

    navigate(`/room/${roomId.trim()}?name=${encodeURIComponent(name)}`);
  };

  return (
    <Container>
      <PageHeader>
        <HeaderTitle>Velour</HeaderTitle>
        <HeaderSubtitle>Connect with creators, share exclusive content, and build meaningful relationships</HeaderSubtitle>
        
        <ResourceLinks>
          <ResourceLink href="#features" onClick={(e) => e.preventDefault()}>
            <Video size={16} />
            Features
          </ResourceLink>
          <ResourceLink href="#creators" onClick={(e) => e.preventDefault()}>
            <Users size={16} />
            Top Creators
          </ResourceLink>
          <ResourceLink href="#pricing" onClick={(e) => e.preventDefault()}>
            <DollarSign size={16} />
            Pricing
          </ResourceLink>
        </ResourceLinks>

        <QuoteSection>
          <Quote>"Join thousands of creators and subscribers building meaningful connections through exclusive content and direct messaging."</Quote>
          <QuoteAuthor>— Velour Community</QuoteAuthor>
        </QuoteSection>

        {!isAuthenticated && (
          <DonationSection>
            <DonationText>
              Ready to start your journey? Join as a creator to share your content or as a subscriber to access exclusive experiences.
            </DonationText>
            <DonationButton 
              onClick={() => navigate('/auth')}
            >
              <Heart size={16} />
              Get Started Today
            </DonationButton>
          </DonationSection>
        )}
      </PageHeader>

      {isAuthenticated ? (
        <Card>
          <Header>
            <Icon>
              <Heart size={30} />
            </Icon>
            <Title>Welcome back, {user?.profile?.displayName || user?.username}!</Title>
            <Subtitle>Ready to continue your journey?</Subtitle>
          </Header>
          
          <ButtonGroup>
            <CreateButton onClick={() => navigate('/dashboard')}>
              <ArrowRight size={20} />
              Go to Dashboard
            </CreateButton>
          </ButtonGroup>
        </Card>
      ) : (
        <Card>
          <Header>
            <Icon>
              <Heart size={30} />
            </Icon>
            <Title>Join Velour</Title>
            <Subtitle>Connect with creators and access exclusive content</Subtitle>
          </Header>

          <ButtonGroup>
            <CreateButton onClick={() => navigate('/auth')}>
              <Plus size={20} />
              Sign Up
            </CreateButton>
            <JoinButton onClick={() => navigate('/auth')}>
              <ArrowRight size={20} />
              Sign In
            </JoinButton>
          </ButtonGroup>
        </Card>
      )}

      <Footer>
          <HelplineSection>
          <HelplineText>Need help? Contact our support team:</HelplineText>
          <PhoneNumbers>
            <PhoneLink href="mailto:support@velour.com">
              <MessageSquare size={16} />
              support@velour.com
            </PhoneLink>
            <PhoneLink href="tel:+1234567890">
              <Phone size={16} />
              (123) 456-7890
            </PhoneLink>
          </PhoneNumbers>
        </HelplineSection>
      </Footer>
    </Container>
  );
};

export default HomePage;
