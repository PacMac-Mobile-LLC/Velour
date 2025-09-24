import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Plus, ArrowRight, Users, ExternalLink, Calendar, DollarSign, Phone, Video, MessageSquare, Star, Play, Eye, Lock, Crown, Zap, Shield, Globe } from 'lucide-react';
import styled from 'styled-components';
import { useAuth0Context } from '../contexts/Auth0Context';
import { useAuth0 } from '@auth0/auth0-react';
import Logo from './Logo';
import PricingPlans from './PricingPlans';

const Container = styled.div`
  min-height: 100vh;
  background: #000;
  color: white;
`;

const HeroSection = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  min-height: 100vh;
  min-height: -webkit-fill-available;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 20px 15px;
    min-height: 100vh;
    min-height: -webkit-fill-available;
  }

  @media (max-width: 480px) {
    padding: 15px 10px;
  }
`;

const HeroBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><defs><radialGradient id="a" cx="50%" cy="50%"><stop offset="0%" stop-color="%23ff6b6b" stop-opacity="0.1"/><stop offset="100%" stop-color="%23ff6b6b" stop-opacity="0"/></radialGradient></defs><circle cx="200" cy="200" r="300" fill="url(%23a)"/><circle cx="800" cy="800" r="400" fill="url(%23a)"/></svg>');
  opacity: 0.3;
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
`;

const HeroTitle = styled.h1`
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #ff69b4 0%, #7a288a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 30px rgba(255, 105, 180, 0.3);
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.5rem;
  margin-bottom: 40px;
  color: #ccc;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 30px;
    padding: 0 20px;
    line-height: 1.5;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
    margin-bottom: 25px;
    padding: 0 15px;
    line-height: 1.4;
  }
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-bottom: 60px;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    gap: 15px;
    margin-bottom: 40px;
    padding: 0 20px;
  }
  
  @media (max-width: 480px) {
    gap: 12px;
    margin-bottom: 30px;
    padding: 0 15px;
    flex-direction: column;
    align-items: center;
  }
`;

const PrimaryButton = styled.button`
  background: linear-gradient(135deg, #ff69b4 0%, #7a288a 100%);
  color: white;
  border: none;
  padding: 18px 36px;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 10px 30px rgba(255, 105, 180, 0.3);
  min-height: 56px;
  min-width: 200px;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(255, 105, 180, 0.4);
  }
  
  @media (max-width: 768px) {
    padding: 16px 32px;
    font-size: 1rem;
    min-width: 180px;
  }
  
  @media (max-width: 480px) {
    padding: 14px 28px;
    font-size: 0.95rem;
    min-width: 160px;
    width: 100%;
    max-width: 280px;
  }
`;

const SecondaryButton = styled.button`
  background: transparent;
  color: white;
  border: 2px solid #ff69b4;
  padding: 16px 34px;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 56px;
  min-width: 200px;

  &:hover {
    background: #ff69b4;
    transform: translateY(-3px);
  }
  
  @media (max-width: 768px) {
    padding: 14px 30px;
    font-size: 1rem;
    min-width: 180px;
  }
  
  @media (max-width: 480px) {
    padding: 12px 26px;
    font-size: 0.95rem;
    min-width: 160px;
    width: 100%;
    max-width: 280px;
  }
`;

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
  max-width: 800px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    gap: 30px;
    padding: 0 20px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 25px;
    padding: 0 15px;
  }
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  color: #ff69b4;
  margin-bottom: 10px;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: #ccc;
  text-transform: uppercase;
  letter-spacing: 1px;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
    letter-spacing: 0.5px;
  }
`;

const FeaturesSection = styled.div`
  background: #111;
  padding: 100px 20px;
`;

const FeaturesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-size: 3rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #ff69b4 0%, #7a288a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const SectionSubtitle = styled.p`
  font-size: 1.2rem;
  text-align: center;
  color: #ccc;
  margin-bottom: 60px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  margin-bottom: 80px;
`;

const FeatureCard = styled.div`
  background: #1a1a1a;
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid #333;

  &:hover {
    transform: translateY(-10px);
    border-color: #ff69b4;
    box-shadow: 0 20px 40px rgba(255, 105, 180, 0.1);
  }
`;

const FeatureIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff69b4 0%, #7a288a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: white;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 15px;
  color: white;
`;

const FeatureDescription = styled.p`
  color: #ccc;
  line-height: 1.6;
`;

const CreatorsSection = styled.div`
  background: #000;
  padding: 100px 20px;
`;

const CreatorsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
`;

const CreatorCard = styled.div`
  background: #1a1a1a;
  border-radius: 15px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid #333;

  &:hover {
    transform: translateY(-5px);
    border-color: #ff69b4;
  }
`;

const CreatorImage = styled.div`
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, #ff69b4 0%, #7a288a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
`;

const CreatorInfo = styled.div`
  padding: 20px;
`;

const CreatorName = styled.h4`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: white;
`;

const CreatorStats = styled.div`
  display: flex;
  justify-content: space-between;
  color: #ccc;
  font-size: 0.9rem;
  margin-bottom: 15px;
`;

const SubscribeButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #ff69b4 0%, #7a288a 100%);
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(255, 105, 180, 0.3);
  }
`;


const Footer = styled.div`
  background: #000;
  padding: 60px 20px;
  text-align: center;
  border-top: 1px solid #333;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const FooterLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-bottom: 30px;
  flex-wrap: wrap;
`;

const FooterLink = styled.a`
  color: #ccc;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #ff69b4;
  }
`;

const FooterText = styled.p`
  color: #666;
  font-size: 0.9rem;
`;

// New sections styling
const InfoSection = styled.div`
  background: #111;
  padding: 100px 20px;
`;

const InfoContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const InfoTitle = styled.h2`
  font-size: 3rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #ff69b4 0%, #7a288a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const InfoSubtitle = styled.p`
  font-size: 1.2rem;
  text-align: center;
  color: #ccc;
  margin-bottom: 60px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
`;

const InfoContent = styled.div`
  color: #ccc;
  line-height: 1.8;
  font-size: 1.1rem;
  max-width: 800px;
  margin: 0 auto;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  margin-top: 40px;
`;

const InfoCard = styled.div`
  background: #1a1a1a;
  border-radius: 15px;
  padding: 30px;
  border: 1px solid #333;
  transition: all 0.3s ease;

  &:hover {
    border-color: #ff69b4;
    transform: translateY(-5px);
  }
`;

const InfoCardTitle = styled.h3`
  color: white;
  font-size: 1.3rem;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const InfoCardContent = styled.p`
  color: #ccc;
  line-height: 1.6;
`;

const CreatorBenefits = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-top: 40px;
`;

const BenefitItem = styled.div`
  background: #1a1a1a;
  border-radius: 15px;
  padding: 25px;
  border: 1px solid #333;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    border-color: #ff69b4;
    transform: translateY(-5px);
  }
`;

const BenefitIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff69b4 0%, #7a288a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: white;
  font-size: 1.5rem;
`;

const BenefitTitle = styled.h4`
  color: white;
  font-size: 1.1rem;
  margin-bottom: 10px;
`;

const BenefitDescription = styled.p`
  color: #ccc;
  font-size: 0.9rem;
  line-height: 1.5;
`;


const ContactInfo = styled.div`
  background: rgba(255, 105, 180, 0.1);
  border: 1px solid rgba(255, 105, 180, 0.3);
  border-radius: 15px;
  padding: 30px;
  margin: 40px 0;
  text-align: center;
`;

const ContactTitle = styled.h3`
  color: #ff69b4;
  font-size: 1.3rem;
  margin-bottom: 15px;
`;

const ContactText = styled.p`
  color: #ccc;
  margin-bottom: 10px;
`;

const ContactEmail = styled.a`
  color: #ff69b4;
  text-decoration: none;
  font-weight: 600;

  &:hover {
    color: #7a288a;
  }
`;

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth0Context();
  const { loginWithRedirect } = useAuth0();

  const features = [
    {
      icon: <Video size={40} />,
      title: "Exclusive Content",
      description: "Access premium videos, photos, and live streams from your favorite creators"
    },
    {
      icon: <MessageSquare size={40} />,
      title: "Direct Messaging",
      description: "Chat privately with creators and build personal connections"
    },
    {
      icon: <DollarSign size={40} />,
      title: "Flexible Pricing",
      description: "Set your own subscription rates and offer pay-per-view content"
    },
    {
      icon: <Shield size={40} />,
      title: "Secure Payments",
      description: "Safe and secure transactions powered by Stripe"
    },
    {
      icon: <Globe size={40} />,
      title: "Global Reach",
      description: "Connect with creators and fans from around the world"
    },
    {
      icon: <Zap size={40} />,
      title: "Real-time Updates",
      description: "Get instant notifications for new content and messages"
    }
  ];

  const creators = [
    { name: "Emma Rose", subscribers: "12.5K", price: "$9.99", avatar: "👩‍🎨" },
    { name: "Alex Chen", subscribers: "8.2K", price: "$14.99", avatar: "👨‍💻" },
    { name: "Maya Johnson", subscribers: "25.1K", price: "$19.99", avatar: "👩‍🎭" },
    { name: "Ryan Smith", subscribers: "6.8K", price: "$7.99", avatar: "👨‍🎤" },
    { name: "Luna Star", subscribers: "18.3K", price: "$12.99", avatar: "👩‍🎪" },
    { name: "Jordan Lee", subscribers: "9.7K", price: "$11.99", avatar: "👨‍🎨" }
  ];


  return (
    <Container>
      <HeroSection>
        <HeroBackground />
        <HeroContent>
          <Logo size="large" showTagline={true} />
          <HeroSubtitle>
            The ultimate platform for creators to share exclusive content and connect with their fans. 
            Join thousands of creators earning from their passion.
          </HeroSubtitle>
          
          <CTAButtons>
            <PrimaryButton onClick={() => {
              console.log('Start Creating button clicked');
              console.log('loginWithRedirect function:', loginWithRedirect);
              try {
                loginWithRedirect({
                  appState: { returnTo: '/dashboard' }
                });
              } catch (error) {
                console.error('Error calling loginWithRedirect:', error);
              }
            }}>
              <Plus size={20} />
              Start Creating
            </PrimaryButton>
            <SecondaryButton onClick={() => {
              console.log('Browse Creators button clicked');
              console.log('loginWithRedirect function:', loginWithRedirect);
              try {
                loginWithRedirect({
                  appState: { returnTo: '/dashboard' }
                });
              } catch (error) {
                console.error('Error calling loginWithRedirect:', error);
              }
            }}>
              <Heart size={20} />
              Browse Creators
            </SecondaryButton>
          </CTAButtons>

          <StatsSection>
            <StatItem>
              <StatNumber>50K+</StatNumber>
              <StatLabel>Active Creators</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber>2M+</StatNumber>
              <StatLabel>Subscribers</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber>$10M+</StatNumber>
              <StatLabel>Paid to Creators</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber>99.9%</StatNumber>
              <StatLabel>Uptime</StatLabel>
            </StatItem>
          </StatsSection>
        </HeroContent>
      </HeroSection>

      <FeaturesSection>
        <FeaturesContainer>
          <SectionTitle>Why Choose Velour?</SectionTitle>
          <SectionSubtitle>
            Everything you need to build a successful creator business and connect with your audience
          </SectionSubtitle>
          
          <FeaturesGrid>
            {features.map((feature, index) => (
              <FeatureCard key={index}>
                <FeatureIcon>{feature.icon}</FeatureIcon>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </FeaturesContainer>
      </FeaturesSection>

      <CreatorsSection>
        <FeaturesContainer>
          <SectionTitle>Featured Creators</SectionTitle>
          <SectionSubtitle>
            Discover amazing creators and exclusive content
          </SectionSubtitle>
          
          <CreatorsGrid>
            {creators.map((creator, index) => (
              <CreatorCard key={index}>
                <CreatorImage>{creator.avatar}</CreatorImage>
                <CreatorInfo>
                  <CreatorName>{creator.name}</CreatorName>
                  <CreatorStats>
                    <span>{creator.subscribers} subscribers</span>
                    <span>{creator.price}/month</span>
                  </CreatorStats>
                  <SubscribeButton>
                    Subscribe Now
                  </SubscribeButton>
                </CreatorInfo>
              </CreatorCard>
            ))}
          </CreatorsGrid>
        </FeaturesContainer>
      </CreatorsSection>

      <PricingPlans />

      {/* About Section */}
      <InfoSection id="about">
        <InfoContainer>
          <InfoTitle>About Velour</InfoTitle>
          <InfoSubtitle>
            The ultimate platform connecting creators with their most passionate fans
          </InfoSubtitle>
          <InfoContent>
            <p>
              Velour is more than just a subscription platform – it's a community where creators can build meaningful relationships with their audience while monetizing their content. We believe that creators deserve to be compensated fairly for their work, and fans deserve exclusive access to the content they love.
            </p>
            <p>
              Founded in 2024, Velour has quickly become the go-to platform for creators across various industries. From artists and musicians to educators and entertainers, our platform provides the tools and support needed to build a sustainable creative business.
            </p>
          </InfoContent>
          
          <InfoGrid>
            <InfoCard>
              <InfoCardTitle>
                <span>🎯</span>
                Our Mission
              </InfoCardTitle>
              <InfoCardContent>
                To empower creators to build sustainable businesses while providing fans with exclusive access to the content they love most.
              </InfoCardContent>
            </InfoCard>
            
            <InfoCard>
              <InfoCardTitle>
                <span>💡</span>
                Our Vision
              </InfoCardTitle>
              <InfoCardContent>
                A world where creativity is valued, creators are fairly compensated, and fans have direct access to the content that inspires them.
              </InfoCardContent>
            </InfoCard>
            
            <InfoCard>
              <InfoCardTitle>
                <span>🤝</span>
                Our Values
              </InfoCardTitle>
              <InfoCardContent>
                Transparency, fairness, creativity, and community. We're committed to building a platform that benefits everyone.
              </InfoCardContent>
            </InfoCard>
          </InfoGrid>
        </InfoContainer>
      </InfoSection>

      {/* Creators Section */}
      <InfoSection id="creators">
        <InfoContainer>
          <InfoTitle>For Creators</InfoTitle>
          <InfoSubtitle>
            Everything you need to build a successful creator business and connect with your audience
          </InfoSubtitle>
          <InfoContent>
            <p>
              Whether you're just starting out or you're an established creator looking for a new platform, Velour provides all the tools you need to succeed. Our platform is designed to help you build a sustainable business while maintaining creative control over your content.
            </p>
          </InfoContent>
          
          <CreatorBenefits>
            <BenefitItem>
              <BenefitIcon>💰</BenefitIcon>
              <BenefitTitle>Flexible Pricing</BenefitTitle>
              <BenefitDescription>
                Set your own subscription prices and offer different tiers to maximize your revenue potential.
              </BenefitDescription>
            </BenefitItem>
            
            <BenefitItem>
              <BenefitIcon>📊</BenefitIcon>
              <BenefitTitle>Analytics Dashboard</BenefitTitle>
              <BenefitDescription>
                Track your performance with detailed analytics and insights about your audience and revenue.
              </BenefitDescription>
            </BenefitItem>
            
            <BenefitItem>
              <BenefitIcon>💬</BenefitIcon>
              <BenefitTitle>Direct Messaging</BenefitTitle>
              <BenefitDescription>
                Build personal connections with your subscribers through our integrated messaging system.
              </BenefitDescription>
            </BenefitItem>
            
            <BenefitItem>
              <BenefitIcon>🎨</BenefitIcon>
              <BenefitTitle>Content Freedom</BenefitTitle>
              <BenefitDescription>
                Share photos, videos, live streams, and written content without restrictions or censorship.
              </BenefitDescription>
            </BenefitItem>
            
            <BenefitItem>
              <BenefitIcon>🔒</BenefitIcon>
              <BenefitTitle>Secure Payments</BenefitTitle>
              <BenefitDescription>
                Get paid securely and on time with our reliable payment processing system powered by Stripe.
              </BenefitDescription>
            </BenefitItem>
            
            <BenefitItem>
              <BenefitIcon>🚀</BenefitIcon>
              <BenefitTitle>Growth Tools</BenefitTitle>
              <BenefitDescription>
                Access marketing tools, promotional features, and growth strategies to expand your audience.
              </BenefitDescription>
            </BenefitItem>
          </CreatorBenefits>
          
          <ContactInfo>
            <ContactTitle>Ready to Start Creating?</ContactTitle>
            <ContactText>
              Join thousands of creators who are already building their businesses on Velour.
            </ContactText>
            <ContactText>
              Have questions? Contact our creator support team at{' '}
              <ContactEmail href="mailto:creators@vibecodes.space">
                creators@vibecodes.space
              </ContactEmail>
            </ContactText>
          </ContactInfo>
        </InfoContainer>
      </InfoSection>


      <Footer>
        <FooterContent>
          <FooterLinks>
            <FooterLink href="#about">About</FooterLink>
            <FooterLink href="#creators">Creators</FooterLink>
            <FooterLink href="/support">Support</FooterLink>
            <FooterLink href="/privacy">Privacy</FooterLink>
            <FooterLink href="/terms">Terms</FooterLink>
            <FooterLink href="mailto:support@vibecodes.space">Contact</FooterLink>
          </FooterLinks>
          <FooterText>
            © 2024 Velour. All rights reserved. | support@vibecodes.space
          </FooterText>
        </FooterContent>
      </Footer>
    </Container>
  );
};

export default HomePage;