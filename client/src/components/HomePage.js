import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Plus, ArrowRight, Users, ExternalLink, Calendar, DollarSign, Phone, Video, MessageSquare, Star, Play, Eye, Lock, Crown, Zap, Shield, Globe } from 'lucide-react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  min-height: 100vh;
  background: #000;
  color: white;
`;

const HeroSection = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
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
  font-size: 1.2rem;
  }
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-bottom: 60px;
  flex-wrap: wrap;
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

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(255, 105, 180, 0.4);
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

  &:hover {
    background: #ff69b4;
    transform: translateY(-3px);
  }
`;

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
  max-width: 800px;
  margin: 0 auto;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  color: #ff69b4;
  margin-bottom: 10px;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: #ccc;
  text-transform: uppercase;
  letter-spacing: 1px;
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

const PricingSection = styled.div`
  background: #111;
  padding: 100px 20px;
`;

const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  max-width: 1000px;
  margin: 0 auto;
`;

const PricingCard = styled.div`
  background: #1a1a1a;
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  border: 2px solid ${props => props.featured ? '#ff69b4' : '#333'};
  position: relative;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-10px);
    border-color: #ff69b4;
  }
`;

const PricingBadge = styled.div`
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #ff69b4 0%, #7a288a 100%);
  color: white;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
`;

const PricingTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: white;
`;

const PricingPrice = styled.div`
  font-size: 3rem;
  font-weight: 800;
  color: #ff69b4;
  margin-bottom: 20px;
`;

const PricingFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 30px;
`;

const PricingFeature = styled.li`
  color: #ccc;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
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

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

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

  const pricingPlans = [
    {
      title: "Creator",
      price: "Free",
      features: [
        "Upload unlimited content",
        "Set custom subscription prices",
        "Direct messaging with fans",
        "Analytics dashboard",
        "Basic support"
      ]
    },
    {
      title: "Premium Creator",
      price: "$29",
      period: "/month",
      featured: true,
      features: [
        "Everything in Creator",
        "Priority customer support",
        "Advanced analytics",
        "Custom branding",
        "Early access to new features",
        "Revenue optimization tools"
      ]
    },
    {
      title: "Enterprise",
      price: "Custom",
      features: [
        "Everything in Premium",
        "Dedicated account manager",
        "Custom integrations",
        "White-label solution",
        "24/7 phone support",
        "Custom pricing structure"
      ]
    }
  ];

  return (
    <Container>
      <HeroSection>
        <HeroBackground />
        <HeroContent>
          <HeroTitle>Velour</HeroTitle>
          <HeroSubtitle>
            The ultimate platform for creators to share exclusive content and connect with their fans. 
            Join thousands of creators earning from their passion.
          </HeroSubtitle>
          
          <CTAButtons>
            <PrimaryButton onClick={() => navigate('/auth')}>
              <Plus size={20} />
              Start Creating
            </PrimaryButton>
            <SecondaryButton onClick={() => navigate('/auth')}>
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

      <PricingSection>
        <FeaturesContainer>
          <SectionTitle>Creator Pricing</SectionTitle>
          <SectionSubtitle>
            Choose the plan that works best for your creative journey
          </SectionSubtitle>
          
          <PricingGrid>
            {pricingPlans.map((plan, index) => (
              <PricingCard key={index} featured={plan.featured}>
                {plan.featured && <PricingBadge>Most Popular</PricingBadge>}
                <PricingTitle>{plan.title}</PricingTitle>
                <PricingPrice>
                  {plan.price}
                  {plan.period && <span style={{ fontSize: '1rem', color: '#ccc' }}>{plan.period}</span>}
                </PricingPrice>
                <PricingFeatures>
                  {plan.features.map((feature, featureIndex) => (
                    <PricingFeature key={featureIndex}>
                      <Star size={16} color="#ff69b4" />
                      {feature}
                    </PricingFeature>
                  ))}
                </PricingFeatures>
                <PrimaryButton style={{ width: '100%' }}>
                  Get Started
                </PrimaryButton>
              </PricingCard>
            ))}
          </PricingGrid>
        </FeaturesContainer>
      </PricingSection>

      <Footer>
        <FooterContent>
          <FooterLinks>
            <FooterLink href="#about">About</FooterLink>
            <FooterLink href="#creators">Creators</FooterLink>
            <FooterLink href="#support">Support</FooterLink>
            <FooterLink href="#privacy">Privacy</FooterLink>
            <FooterLink href="#terms">Terms</FooterLink>
            <FooterLink href="mailto:support@velour.com">Contact</FooterLink>
          </FooterLinks>
          <FooterText>
            © 2024 Velour. All rights reserved. | support@velour.com
          </FooterText>
        </FooterContent>
      </Footer>
    </Container>
  );
};

export default HomePage;