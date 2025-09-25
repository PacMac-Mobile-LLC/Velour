import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  Check, 
  X,
  Eye,
  EyeOff
} from 'lucide-react';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

const ModalContent = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  border-radius: 20px;
  padding: 40px;
  width: 90%;
  max-width: 500px;
  color: white;
  position: relative;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 105, 180, 0.3);
`;

const ModalHeader = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const ModalTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0 0 10px 0;
  background: linear-gradient(135deg, #ff69b4 0%, #7a288a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const ModalSubtitle = styled.p`
  color: #ccc;
  margin: 0;
  font-size: 1rem;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.3s ease;
  
  &:hover {
    background: rgba(255, 105, 180, 0.1);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 600;
  color: #ccc;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Input = styled.input`
  padding: 12px 16px;
  background: rgba(20, 20, 20, 0.8);
  border: 1px solid #444;
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #ff69b4;
    box-shadow: 0 0 0 3px rgba(255, 105, 180, 0.1);
  }
  
  &::placeholder {
    color: #888;
  }
`;

const PasswordContainer = styled.div`
  position: relative;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: color 0.3s ease;
  
  &:hover {
    color: #ff69b4;
  }
`;

const Button = styled.button`
  padding: 14px 24px;
  background: linear-gradient(135deg, #ff69b4 0%, #7a288a 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 105, 180, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const InfoBox = styled.div`
  background: rgba(255, 105, 180, 0.1);
  border: 1px solid rgba(255, 105, 180, 0.3);
  border-radius: 12px;
  padding: 16px;
  margin-top: 20px;
`;

const InfoText = styled.p`
  margin: 0;
  color: #ccc;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const CreateTestAccount = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }
    
    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }
    
    if (!formData.password) {
      setError('Password is required');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      
      // For now, just simulate account creation
      // In a real app, you'd call your API here
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Store the test account info
      const testAccount = {
        name: formData.name,
        email: formData.email,
        id: `test-${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      
      // Store in localStorage for testing
      const existingAccounts = JSON.parse(localStorage.getItem('testAccounts') || '[]');
      existingAccounts.push(testAccount);
      localStorage.setItem('testAccounts', JSON.stringify(existingAccounts));
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      
      // Close modal
      onClose();
      
      // Show success message
      alert(`Test account created successfully!\n\nName: ${testAccount.name}\nEmail: ${testAccount.email}\nID: ${testAccount.id}\n\nYou can now use this account to test messaging and video calling.`);
      
    } catch (error) {
      console.error('Error creating test account:', error);
      setError('Failed to create test account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <X size={20} />
        </CloseButton>
        
        <ModalHeader>
          <ModalTitle>Create Test Account</ModalTitle>
          <ModalSubtitle>Create a test account to test messaging and video calling features</ModalSubtitle>
        </ModalHeader>
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>
              <User size={16} />
              Full Name
            </Label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label>
              <Mail size={16} />
              Email Address
            </Label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email address"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label>
              <Lock size={16} />
              Password
            </Label>
            <PasswordContainer>
              <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </PasswordToggle>
            </PasswordContainer>
          </FormGroup>
          
          <FormGroup>
            <Label>
              <Lock size={16} />
              Confirm Password
            </Label>
            <PasswordContainer>
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                required
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </PasswordToggle>
            </PasswordContainer>
          </FormGroup>
          
          {error && (
            <div style={{ color: '#ff6b6b', fontSize: '0.9rem', textAlign: 'center' }}>
              {error}
            </div>
          )}
          
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <div style={{ 
                  width: '16px', 
                  height: '16px', 
                  border: '2px solid transparent',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                Creating Account...
              </>
            ) : (
              <>
                <UserPlus size={16} />
                Create Test Account
              </>
            )}
          </Button>
        </Form>
        
        <InfoBox>
          <InfoText>
            <strong>Note:</strong> This creates a test account for development purposes. 
            The account will be stored locally and can be used to test messaging and video calling features.
          </InfoText>
        </InfoBox>
      </ModalContent>
    </ModalOverlay>
  );
};

export default CreateTestAccount;
