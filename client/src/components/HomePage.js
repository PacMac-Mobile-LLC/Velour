import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Plus, ArrowRight } from 'lucide-react';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
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

const HomePage = () => {
  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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
      <Card>
        <Header>
          <Icon>
            <Camera size={30} />
          </Icon>
          <Title>Zoom Clone</Title>
          <Subtitle>Free video conferencing for everyone</Subtitle>
        </Header>

        <Form onSubmit={handleCreateRoom}>
          <InputGroup>
            <Label>Your Name</Label>
            <Input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label>Room ID (optional)</Label>
            <Input
              type="text"
              placeholder="Enter room ID to join existing room"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />
          </InputGroup>

          <ButtonGroup>
            <CreateButton type="submit" disabled={isLoading}>
              <Plus size={20} />
              Create Room
            </CreateButton>
            <JoinButton type="button" onClick={handleJoinRoom} disabled={isLoading}>
              <ArrowRight size={20} />
              Join Room
            </JoinButton>
          </ButtonGroup>
        </Form>
      </Card>
    </Container>
  );
};

export default HomePage;
