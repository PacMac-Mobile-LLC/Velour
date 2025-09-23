import React from 'react';
import styled from 'styled-components';

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: ${props => props.size === 'large' ? '16px' : props.size === 'medium' ? '12px' : '8px'};
  
  @media (max-width: 768px) {
    gap: ${props => props.size === 'large' ? '12px' : props.size === 'medium' ? '10px' : '6px'};
  }
  
  @media (max-width: 480px) {
    gap: ${props => props.size === 'large' ? '10px' : props.size === 'medium' ? '8px' : '6px'};
  }
`;

const LogoIcon = styled.div`
  width: ${props => props.size === 'large' ? '80px' : props.size === 'medium' ? '60px' : '40px'};
  height: ${props => props.size === 'large' ? '80px' : props.size === 'medium' ? '60px' : '40px'};
  background: linear-gradient(135deg, #ff69b4 0%, #7a288a 100%);
  border-radius: ${props => props.size === 'large' ? '20px' : props.size === 'medium' ? '15px' : '10px'};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    width: ${props => props.size === 'large' ? '60px' : props.size === 'medium' ? '50px' : '35px'};
    height: ${props => props.size === 'large' ? '60px' : props.size === 'medium' ? '50px' : '35px'};
    border-radius: ${props => props.size === 'large' ? '15px' : props.size === 'medium' ? '12px' : '8px'};
  }
  
  @media (max-width: 480px) {
    width: ${props => props.size === 'large' ? '50px' : props.size === 'medium' ? '45px' : '30px'};
    height: ${props => props.size === 'large' ? '50px' : props.size === 'medium' ? '45px' : '30px'};
    border-radius: ${props => props.size === 'large' ? '12px' : props.size === 'medium' ? '10px' : '6px'};
  }
`;

const VLetter = styled.svg`
  width: ${props => props.size === 'large' ? '50px' : props.size === 'medium' ? '38px' : '25px'};
  height: ${props => props.size === 'large' ? '50px' : props.size === 'medium' ? '38px' : '25px'};
  
  @media (max-width: 768px) {
    width: ${props => props.size === 'large' ? '38px' : props.size === 'medium' ? '30px' : '20px'};
    height: ${props => props.size === 'large' ? '38px' : props.size === 'medium' ? '30px' : '20px'};
  }
  
  @media (max-width: 480px) {
    width: ${props => props.size === 'large' ? '30px' : props.size === 'medium' ? '25px' : '18px'};
    height: ${props => props.size === 'large' ? '30px' : props.size === 'medium' ? '25px' : '18px'};
  }
`;

const LogoText = styled.h1`
  font-size: ${props => props.size === 'large' ? '2.5rem' : props.size === 'medium' ? '2rem' : '1.5rem'};
  font-weight: 700;
  color: #7a288a;
  margin: 0;
  letter-spacing: 2px;
  font-family: 'Georgia', 'Times New Roman', serif;
  
  @media (max-width: 768px) {
    font-size: ${props => props.size === 'large' ? '2rem' : props.size === 'medium' ? '1.5rem' : '1.2rem'};
    letter-spacing: 1px;
  }
  
  @media (max-width: 480px) {
    font-size: ${props => props.size === 'large' ? '1.5rem' : props.size === 'medium' ? '1.2rem' : '1rem'};
    letter-spacing: 1px;
  }
`;

const Tagline = styled.p`
  font-size: ${props => props.size === 'large' ? '1rem' : props.size === 'medium' ? '0.9rem' : '0.8rem'};
  color: #7a288a;
  margin: 0;
  font-weight: 400;
  letter-spacing: 1px;
  opacity: 0.8;
  line-height: 1.3;
  
  @media (max-width: 768px) {
    font-size: ${props => props.size === 'large' ? '0.9rem' : props.size === 'medium' ? '0.8rem' : '0.7rem'};
    letter-spacing: 0.5px;
    line-height: 1.2;
  }
  
  @media (max-width: 480px) {
    font-size: ${props => props.size === 'large' ? '0.8rem' : props.size === 'medium' ? '0.7rem' : '0.6rem'};
    letter-spacing: 0.5px;
    line-height: 1.2;
    padding: 0 10px;
  }
`;

const Logo = ({ size = 'medium', showTagline = true, className }) => {
  const iconSize = size === 'large' ? '50' : size === 'medium' ? '38' : '25';
  
  return (
    <LogoContainer size={size} className={className}>
      <LogoIcon size={size}>
        <VLetter size={size} viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Elegant V with flowing curves */}
          <path 
            d="M12 8C12 6 13 5 14.5 5C16 5 17 6 17 8V15C17 17 16 18.5 14.5 19C13 19.5 11.5 19 10.5 18C9.5 17 9 15.5 9 14V8C9 6 10 5 11.5 5C13 5 14 6 14 8V15C14 16 14.5 16.5 15 16.5C15.5 16.5 16 16 16 15V8C16 6 17 5 18.5 5C20 5 21 6 21 8V15C21 17 20 18.5 18.5 19C17 19.5 15.5 19 14.5 18C13.5 17 13 15.5 13 14V8Z" 
            fill="white"
          />
          <path 
            d="M21 5C22 4 23.5 4 24.5 5C25.5 6 26 7 26 8V20C26 22 25 23.5 23.5 24C22 24.5 20.5 24 19.5 23C18.5 22 18 20.5 18 19V8C18 7 18.5 6 19.5 5C20.5 4 21.5 4 21 5Z" 
            fill="white"
          />
        </VLetter>
      </LogoIcon>
      
      <LogoText size={size}>VELOUR</LogoText>
      
      {showTagline && (
        <Tagline size={size}>WHERE DESIRE MEETS LUXURY</Tagline>
      )}
    </LogoContainer>
  );
};

export default Logo;
