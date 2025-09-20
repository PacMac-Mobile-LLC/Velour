import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Plus, ArrowRight, Users, ExternalLink, Calendar, DollarSign, Phone } from 'lucide-react';
import styled from 'styled-components';

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

  const [currentQuote, setCurrentQuote] = useState(quotes[0]);

  // Rotate quotes every 5 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }, 5000);
    return () => clearInterval(interval);
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
        <HeaderTitle>CMA Virtual Meetings</HeaderTitle>
        <HeaderSubtitle>Supporting recovery through connection</HeaderSubtitle>
        
        <ResourceLinks>
          <ResourceLink href="https://www.crystalmeth.org/" target="_blank" rel="noopener noreferrer">
            <ExternalLink size={16} />
            CMA Official Site
          </ResourceLink>
          <ResourceLink href="https://www.crystalmeth.org/cma-meeting-directory/" target="_blank" rel="noopener noreferrer">
            <Calendar size={16} />
            Meeting Directory
          </ResourceLink>
          <ResourceLink href="https://www.crystalmeth.org/to-the-public/what-is-crystal-meth-anonymous/" target="_blank" rel="noopener noreferrer">
            <Users size={16} />
            About CMA
          </ResourceLink>
        </ResourceLinks>

        <QuoteSection>
          <Quote>"{currentQuote.text}"</Quote>
          <QuoteAuthor>— {currentQuote.author}</QuoteAuthor>
        </QuoteSection>

        <DonationSection>
          <DonationText>
            "Every CMA group ought to be fully self-supporting, declining outside contributions." 
            However, we are fully self-supporting and do accept donations to help maintain this virtual meeting platform.
          </DonationText>
          <DonationButton 
            href="https://www.venmo.com/u/PackieMobile" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <DollarSign size={16} />
            Support CMA Virtual Meetings
          </DonationButton>
        </DonationSection>
      </PageHeader>

      <Card>
        <Header>
          <Icon>
            <Heart size={30} />
          </Icon>
          <Title>Join a Virtual Meeting</Title>
          <Subtitle>Connect with your CMA fellowship online</Subtitle>
        </Header>

        <Form onSubmit={handleCreateRoom}>
          <InputGroup>
            <Label>Your Name (First Name Only)</Label>
            <Input
              type="text"
              placeholder="Enter your first name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label>Meeting ID (if joining existing meeting)</Label>
            <Input
              type="text"
              placeholder="Enter meeting ID to join existing meeting"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />
          </InputGroup>

          <ButtonGroup>
            <CreateButton type="submit" disabled={isLoading}>
              <Plus size={20} />
              Start Meeting
            </CreateButton>
            <JoinButton type="button" onClick={handleJoinRoom} disabled={isLoading}>
              <ArrowRight size={20} />
              Join Meeting
            </JoinButton>
          </ButtonGroup>
        </Form>
      </Card>

      <Footer>
        <HelplineSection>
          <HelplineText>Call the CMA Helpline at:</HelplineText>
          <PhoneNumbers>
            <PhoneLink href="tel:+18556384373">
              <Phone size={16} />
              (855) METH-FREE
            </PhoneLink>
            <PhoneLink href="tel:+18556384373">
              <Phone size={16} />
              (855) 638-4373
            </PhoneLink>
          </PhoneNumbers>
        </HelplineSection>
      </Footer>
    </Container>
  );
};

export default HomePage;
