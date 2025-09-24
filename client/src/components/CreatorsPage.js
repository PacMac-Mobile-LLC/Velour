import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  Star, 
  Shield, 
  DollarSign, 
  Users, 
  Camera, 
  Video, 
  MessageCircle, 
  TrendingUp, 
  CheckCircle, 
  Heart, 
  Lock, 
  Zap, 
  Award, 
  Globe, 
  Clock, 
  ArrowRight,
  Plus,
  Play,
  Eye,
  BarChart3,
  Gift,
  Crown,
  Sparkles,
  Target,
  Rocket,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const CreatorsContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2d1a2d 100%);
  color: white;
  position: relative;
  overflow-x: hidden;
`;

const BackgroundPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 20%, rgba(255, 105, 180, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(122, 40, 138, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 60%, rgba(255, 105, 180, 0.05) 0%, transparent 50%);
  pointer-events: none;
`;

const HeroSection = styled.section`
  padding: 120px 20px 80px;
  text-align: center;
  position: relative;
  z-index: 1;
`;

const HeroTitle = styled.h1`
  font-size: 4rem;
  font-weight: 900;
  margin: 0 0 20px 0;
  background: linear-gradient(135deg, #ff69b4 0%, #7a288a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.1;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.3rem;
  color: #ccc;
  margin: 0 0 40px 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  margin: 60px 0;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
`;

const StatCard = styled.div`
  background: rgba(42, 42, 42, 0.8);
  border: 1px solid rgba(255, 105, 180, 0.3);
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
    border-color: #ff69b4;
    box-shadow: 0 20px 40px rgba(255, 105, 180, 0.2);
  }
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 900;
  color: #ff69b4;
  margin-bottom: 10px;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: #ccc;
  font-weight: 600;
`;

const CTAButton = styled.button`
  background: linear-gradient(135deg, #ff69b4 0%, #7a288a 100%);
  border: none;
  border-radius: 50px;
  padding: 18px 40px;
  color: white;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin: 20px 10px;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 35px rgba(255, 105, 180, 0.4);
  }
`;

const Section = styled.section`
  padding: 80px 20px;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const SectionTitle = styled.h2`
  font-size: 3rem;
  font-weight: 800;
  text-align: center;
  margin: 0 0 60px 0;
  background: linear-gradient(135deg, #ff69b4 0%, #7a288a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const PerksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin: 40px 0;
`;

const PerkCard = styled.div`
  background: rgba(42, 42, 42, 0.8);
  border: 1px solid #444;
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    border-color: #ff69b4;
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(255, 105, 180, 0.2);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 105, 180, 0.05) 0%, rgba(122, 40, 138, 0.05) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover::before {
    opacity: 1;
  }
`;

const PerkIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 20px;
  color: #ff69b4;
  position: relative;
  z-index: 1;
`;

const PerkTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 15px 0;
  color: white;
  position: relative;
  z-index: 1;
`;

const PerkDescription = styled.p`
  color: #ccc;
  line-height: 1.6;
  margin: 0;
  position: relative;
  z-index: 1;
`;

const SafetyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin: 40px 0;
`;

const SafetyCard = styled.div`
  background: rgba(42, 42, 42, 0.8);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 15px;
  padding: 30px;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #22c55e;
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(34, 197, 94, 0.2);
  }
`;

const SafetyIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 15px;
  color: #22c55e;
`;

const SafetyTitle = styled.h4`
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 10px 0;
  color: white;
`;

const SafetyDescription = styled.p`
  color: #ccc;
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;
`;

const FAQContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const FAQItem = styled.div`
  background: rgba(42, 42, 42, 0.8);
  border: 1px solid #444;
  border-radius: 15px;
  margin-bottom: 20px;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #ff69b4;
  }
`;

const FAQQuestion = styled.button`
  width: 100%;
  background: none;
  border: none;
  padding: 25px;
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 105, 180, 0.1);
  }
`;

const FAQAnswer = styled.div`
  padding: 0 25px 25px;
  color: #ccc;
  line-height: 1.6;
  display: ${props => props.isOpen ? 'block' : 'none'};
`;

const ProcessSteps = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin: 40px 0;
`;

const ProcessStep = styled.div`
  background: rgba(42, 42, 42, 0.8);
  border: 1px solid #444;
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  position: relative;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #ff69b4;
    transform: translateY(-5px);
  }
`;

const StepNumber = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #ff69b4 0%, #7a288a 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 900;
  color: white;
  margin: 0 auto 20px;
`;

const StepTitle = styled.h4`
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0 0 15px 0;
  color: white;
`;

const StepDescription = styled.p`
  color: #ccc;
  line-height: 1.5;
  margin: 0;
`;

const CreatorsPage = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqs = [
    {
      question: "How much can I earn as a creator on Velour?",
      answer: "Earnings vary based on your content and audience engagement. Top creators earn $10,000+ monthly, with average creators earning $500-2,000 monthly. You set your own subscription prices and keep 80% of all earnings."
    },
    {
      question: "What type of content can I share?",
      answer: "You can share photos, videos, live streams, and exclusive content. We support various content types including fitness, lifestyle, art, music, and more. All content must comply with our community guidelines."
    },
    {
      question: "How do I get paid?",
      answer: "We offer multiple payout options including direct bank transfer, PayPal, and cryptocurrency. Payouts are processed weekly with a minimum threshold of $50. All transactions are secure and encrypted."
    },
    {
      question: "Is my content protected?",
      answer: "Yes! We use advanced DRM protection, watermarking, and AI-powered content monitoring to prevent unauthorized sharing. We also provide legal support for copyright violations."
    },
    {
      question: "Can I remain anonymous?",
      answer: "Absolutely! You can use a stage name and control your privacy settings. We never share your real identity without your explicit consent."
    },
    {
      question: "What support do you provide?",
      answer: "We offer 24/7 creator support, marketing tools, analytics dashboard, and dedicated account managers for top creators. Plus, our community forum connects you with other successful creators."
    }
  ];

  return (
    <CreatorsContainer>
      <BackgroundPattern />
      
      <HeroSection>
        <HeroTitle>Become a Creator</HeroTitle>
        <HeroSubtitle>
          Join thousands of successful creators earning from their passion. 
          Build your community, share exclusive content, and turn your creativity into income.
        </HeroSubtitle>
        
        <StatsGrid>
          <StatCard>
            <StatNumber>$10M+</StatNumber>
            <StatLabel>Paid to Creators</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>50K+</StatNumber>
            <StatLabel>Active Creators</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>99.9%</StatNumber>
            <StatLabel>Uptime</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>24/7</StatNumber>
            <StatLabel>Support</StatLabel>
          </StatCard>
        </StatsGrid>
        
        <CTAButton>
          <Rocket size={20} />
          Start Creating Today
        </CTAButton>
      </HeroSection>

      <Section>
        <SectionTitle>Why Choose Velour?</SectionTitle>
        <PerksGrid>
          <PerkCard>
            <PerkIcon><DollarSign size={48} /></PerkIcon>
            <PerkTitle>High Earnings</PerkTitle>
            <PerkDescription>
              Keep 80% of all your earnings with flexible pricing options. 
              Set your own subscription rates and earn from tips, PPV content, and live streams.
            </PerkDescription>
          </PerkCard>
          
          <PerkCard>
            <PerkIcon><Shield size={48} /></PerkIcon>
            <PerkTitle>Complete Privacy</PerkTitle>
            <PerkDescription>
              Advanced privacy controls, anonymous payments, and secure content protection. 
              Your identity and content are always safe with us.
            </PerkDescription>
          </PerkCard>
          
          <PerkCard>
            <PerkIcon><Users size={48} /></PerkIcon>
            <PerkTitle>Global Audience</PerkTitle>
            <PerkDescription>
              Reach millions of fans worldwide with our international platform. 
              Built-in translation tools help you connect with global audiences.
            </PerkDescription>
          </PerkCard>
          
          <PerkCard>
            <PerkIcon><BarChart3 size={48} /></PerkIcon>
            <PerkTitle>Analytics & Insights</PerkTitle>
            <PerkDescription>
              Detailed analytics help you understand your audience and optimize your content. 
              Track earnings, engagement, and growth metrics in real-time.
            </PerkDescription>
          </PerkCard>
          
          <PerkCard>
            <PerkIcon><Zap size={48} /></PerkIcon>
            <PerkTitle>Fast Payouts</PerkTitle>
            <PerkDescription>
              Get paid weekly with multiple payout options. Direct bank transfer, 
              PayPal, or cryptocurrency - choose what works best for you.
            </PerkDescription>
          </PerkCard>
          
          <PerkCard>
            <PerkIcon><Crown size={48} /></PerkIcon>
            <PerkTitle>Premium Support</PerkTitle>
            <PerkDescription>
              Dedicated account managers for top creators, 24/7 support, 
              and exclusive access to new features and marketing tools.
            </PerkDescription>
          </PerkCard>
        </PerksGrid>
      </Section>

      <Section>
        <SectionTitle>Safety & Security</SectionTitle>
        <SafetyGrid>
          <SafetyCard>
            <SafetyIcon><Lock size={40} /></SafetyIcon>
            <SafetyTitle>Content Protection</SafetyTitle>
            <SafetyDescription>
              Advanced DRM and watermarking technology protects your content from unauthorized sharing.
            </SafetyDescription>
          </SafetyCard>
          
          <SafetyCard>
            <SafetyIcon><Shield size={40} /></SafetyIcon>
            <SafetyTitle>Age Verification</SafetyTitle>
            <SafetyDescription>
              All users must verify their age and identity, ensuring a safe environment for everyone.
            </SafetyDescription>
          </SafetyCard>
          
          <SafetyCard>
            <SafetyIcon><Eye size={40} /></SafetyIcon>
            <SafetyTitle>Content Monitoring</SafetyTitle>
            <SafetyDescription>
              AI-powered monitoring detects and prevents inappropriate content automatically.
            </SafetyDescription>
          </SafetyCard>
          
          <SafetyCard>
            <SafetyIcon><CheckCircle size={40} /></SafetyIcon>
            <SafetyTitle>Secure Payments</SafetyTitle>
            <SafetyDescription>
              Bank-level encryption and secure payment processing protect all transactions.
            </SafetyDescription>
          </SafetyCard>
        </SafetyGrid>
      </Section>

      <Section>
        <SectionTitle>How It Works</SectionTitle>
        <ProcessSteps>
          <ProcessStep>
            <StepNumber>1</StepNumber>
            <StepTitle>Sign Up</StepTitle>
            <StepDescription>
              Create your account and complete age verification. 
              Set up your profile with photos and bio.
            </StepDescription>
          </ProcessStep>
          
          <ProcessStep>
            <StepNumber>2</StepNumber>
            <StepTitle>Set Your Prices</StepTitle>
            <StepDescription>
              Choose your subscription tiers and pricing. 
              Set up pay-per-view content rates.
            </StepDescription>
          </ProcessStep>
          
          <ProcessStep>
            <StepNumber>3</StepNumber>
            <StepTitle>Start Creating</StepTitle>
            <StepDescription>
              Upload your first content, go live, and start building your fanbase. 
              Use our tools to promote your content.
            </StepDescription>
          </ProcessStep>
          
          <ProcessStep>
            <StepNumber>4</StepNumber>
            <StepTitle>Earn & Grow</StepTitle>
            <StepDescription>
              Watch your earnings grow as you build your community. 
              Get paid weekly and access premium features.
            </StepDescription>
          </ProcessStep>
        </ProcessSteps>
      </Section>

      <Section>
        <SectionTitle>Frequently Asked Questions</SectionTitle>
        <FAQContainer>
          {faqs.map((faq, index) => (
            <FAQItem key={index}>
              <FAQQuestion onClick={() => toggleFAQ(index)}>
                {faq.question}
                {openFAQ === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </FAQQuestion>
              <FAQAnswer isOpen={openFAQ === index}>
                {faq.answer}
              </FAQAnswer>
            </FAQItem>
          ))}
        </FAQContainer>
      </Section>

      <Section>
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <SectionTitle>Ready to Start?</SectionTitle>
          <HeroSubtitle>
            Join thousands of creators who are already earning from their passion. 
            Your creative journey starts here.
          </HeroSubtitle>
          <CTAButton>
            <Plus size={20} />
            Become a Creator
          </CTAButton>
        </div>
      </Section>
    </CreatorsContainer>
  );
};

export default CreatorsPage;
