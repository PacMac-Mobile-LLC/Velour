import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  HelpCircle, 
  Mail, 
  MessageCircle, 
  Phone, 
  Clock, 
  Users, 
  Heart, 
  Shield, 
  Zap, 
  Star,
  ChevronDown,
  ChevronUp,
  Search,
  Send,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

const SupportContainer = styled.div`
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

const Header = styled.header`
  padding: 120px 20px 60px;
  text-align: center;
  position: relative;
  z-index: 1;
`;

const HeaderTitle = styled.h1`
  font-size: 3.5rem;
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

const HeaderSubtitle = styled.p`
  font-size: 1.2rem;
  color: #ccc;
  margin: 0 0 40px 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
`;

const SearchContainer = styled.div`
  max-width: 600px;
  margin: 0 auto 60px;
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 20px 60px 20px 20px;
  background: rgba(42, 42, 42, 0.8);
  border: 2px solid #444;
  border-radius: 50px;
  color: white;
  font-size: 1.1rem;
  outline: none;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: #ff69b4;
    box-shadow: 0 0 0 3px rgba(255, 105, 180, 0.2);
  }
  
  &::placeholder {
    color: #888;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
  pointer-events: none;
`;

const Content = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 80px;
  position: relative;
  z-index: 1;
`;

const Section = styled.section`
  margin-bottom: 80px;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  margin: 0 0 50px 0;
  background: linear-gradient(135deg, #ff69b4 0%, #7a288a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const AboutGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  margin: 40px 0;
`;

const AboutCard = styled.div`
  background: rgba(42, 42, 42, 0.8);
  border: 1px solid #444;
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #ff69b4;
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(255, 105, 180, 0.2);
  }
`;

const AboutIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 20px;
  color: #ff69b4;
`;

const AboutTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 15px 0;
  color: white;
`;

const AboutDescription = styled.p`
  color: #ccc;
  line-height: 1.6;
  margin: 0;
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin: 40px 0;
`;

const ContactCard = styled.div`
  background: rgba(42, 42, 42, 0.8);
  border: 1px solid #444;
  border-radius: 15px;
  padding: 30px;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #ff69b4;
    transform: translateY(-3px);
  }
`;

const ContactIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 15px;
  color: #ff69b4;
`;

const ContactTitle = styled.h4`
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 10px 0;
  color: white;
`;

const ContactInfo = styled.p`
  color: #ccc;
  margin: 0 0 15px 0;
`;

const ContactButton = styled.a`
  display: inline-block;
  background: linear-gradient(135deg, #ff69b4 0%, #7a288a 100%);
  color: white;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 25px;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 105, 180, 0.3);
  }
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

const StatusGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin: 40px 0;
`;

const StatusCard = styled.div`
  background: rgba(42, 42, 42, 0.8);
  border: 1px solid ${props => props.status === 'operational' ? '#22c55e' : props.status === 'degraded' ? '#f59e0b' : '#ef4444'};
  border-radius: 15px;
  padding: 25px;
  text-align: center;
`;

const StatusIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 10px;
  color: ${props => props.status === 'operational' ? '#22c55e' : props.status === 'degraded' ? '#f59e0b' : '#ef4444'};
`;

const StatusTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 5px 0;
  color: white;
`;

const StatusText = styled.p`
  color: #ccc;
  font-size: 0.9rem;
  margin: 0;
`;

const SupportPage = () => {
  const [openFAQ, setOpenFAQ] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I create an account?",
      answer: "Click the 'Sign Up' button on our homepage, enter your email address, create a password, and complete the age verification process. You'll receive a confirmation email to activate your account."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and cryptocurrency payments including Bitcoin and Ethereum. All payments are processed securely through our payment partners."
    },
    {
      question: "How do I become a creator?",
      answer: "After creating your account, go to your profile settings and select 'Become a Creator'. Complete the creator verification process, set up your subscription tiers, and start uploading content to begin earning."
    },
    {
      question: "How much do creators earn?",
      answer: "Creators keep 80% of all earnings. Top creators earn $10,000+ monthly, while average creators earn $500-2,000 monthly. Earnings depend on your content quality, audience engagement, and marketing efforts."
    },
    {
      question: "Is my content protected?",
      answer: "Yes! We use advanced DRM protection, watermarking, and AI-powered monitoring to prevent unauthorized sharing. We also provide legal support for copyright violations and content theft."
    },
    {
      question: "How do I contact customer support?",
      answer: "You can reach us 24/7 through our live chat, email at support@vibecodes.space, or by submitting a ticket through your account dashboard. We typically respond within 2 hours."
    },
    {
      question: "Can I remain anonymous?",
      answer: "Absolutely! You can use a stage name, control your privacy settings, and choose what information to share publicly. We never share your real identity without your explicit consent."
    },
    {
      question: "What if I have technical issues?",
      answer: "Our technical support team is available 24/7 to help with any issues. Contact us through live chat for immediate assistance, or email us for more complex problems that require investigation."
    },
    {
      question: "How do I delete my account?",
      answer: "Go to your account settings, scroll to the bottom, and click 'Delete Account'. You'll be asked to confirm your decision. Note that account deletion is permanent and cannot be undone."
    },
    {
      question: "Do you offer refunds?",
      answer: "We offer refunds on a case-by-case basis for technical issues or billing errors. Digital content purchases are generally non-refundable, but we'll work with you to resolve any legitimate concerns."
    }
  ];

  const filteredFAQs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SupportContainer>
      <BackgroundPattern />
      
      <Header>
        <HeaderTitle>Support Center</HeaderTitle>
        <HeaderSubtitle>
          We're here to help! Find answers to common questions or get in touch with our support team.
        </HeaderSubtitle>
        
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <SearchIcon>
            <Search size={24} />
          </SearchIcon>
        </SearchContainer>
      </Header>

      <Content>
        <Section>
          <SectionTitle>Who We Are</SectionTitle>
          <AboutGrid>
            <AboutCard>
              <AboutIcon><Heart size={48} /></AboutIcon>
              <AboutTitle>Our Mission</AboutTitle>
              <AboutDescription>
                We're building a platform where creators can share their passion and connect with fans 
                in a safe, supportive environment. Our mission is to empower creators to build sustainable 
                businesses while providing fans with exclusive access to amazing content.
              </AboutDescription>
            </AboutCard>
            
            <AboutCard>
              <AboutIcon><Shield size={48} /></AboutIcon>
              <AboutTitle>Safety First</AboutTitle>
              <AboutDescription>
                Your safety and privacy are our top priorities. We use advanced security measures, 
                age verification, and content monitoring to ensure a safe environment for everyone. 
                Our team works 24/7 to maintain platform security.
              </AboutDescription>
            </AboutCard>
            
            <AboutCard>
              <AboutIcon><Zap size={48} /></AboutIcon>
              <AboutTitle>Innovation</AboutTitle>
              <AboutDescription>
                We're constantly innovating to provide the best experience for creators and fans. 
                From cutting-edge content protection to seamless payment processing, we're always 
                working to improve our platform.
              </AboutDescription>
            </AboutCard>
          </AboutGrid>
        </Section>

        <Section>
          <SectionTitle>System Status</SectionTitle>
          <StatusGrid>
            <StatusCard status="operational">
              <StatusIcon status="operational"><CheckCircle size={32} /></StatusIcon>
              <StatusTitle>Platform</StatusTitle>
              <StatusText>All systems operational</StatusText>
            </StatusCard>
            
            <StatusCard status="operational">
              <StatusIcon status="operational"><CheckCircle size={32} /></StatusIcon>
              <StatusTitle>Payments</StatusTitle>
              <StatusText>Processing normally</StatusText>
            </StatusCard>
            
            <StatusCard status="operational">
              <StatusIcon status="operational"><CheckCircle size={32} /></StatusIcon>
              <StatusTitle>Video Streaming</StatusTitle>
              <StatusText>All services running</StatusText>
            </StatusCard>
            
            <StatusCard status="operational">
              <StatusIcon status="operational"><CheckCircle size={32} /></StatusIcon>
              <StatusTitle>Support</StatusTitle>
              <StatusText>24/7 availability</StatusText>
            </StatusCard>
          </StatusGrid>
        </Section>

        <Section>
          <SectionTitle>Contact Us</SectionTitle>
          <ContactGrid>
            <ContactCard>
              <ContactIcon><MessageCircle size={40} /></ContactIcon>
              <ContactTitle>Live Chat</ContactTitle>
              <ContactInfo>Available 24/7</ContactInfo>
              <ContactButton href="#">Start Chat</ContactButton>
            </ContactCard>
            
            <ContactCard>
              <ContactIcon><Mail size={40} /></ContactIcon>
              <ContactTitle>Email Support</ContactTitle>
              <ContactInfo>support@vibecodes.space</ContactInfo>
              <ContactButton href="mailto:support@vibecodes.space">Send Email</ContactButton>
            </ContactCard>
            
            <ContactCard>
              <ContactIcon><HelpCircle size={40} /></ContactIcon>
              <ContactTitle>Help Center</ContactTitle>
              <ContactInfo>Browse our guides</ContactInfo>
              <ContactButton href="#">View Guides</ContactButton>
            </ContactCard>
            
            <ContactCard>
              <ContactIcon><Users size={40} /></ContactIcon>
              <ContactTitle>Community</ContactTitle>
              <ContactInfo>Join our Discord</ContactInfo>
              <ContactButton href="#">Join Discord</ContactButton>
            </ContactCard>
          </ContactGrid>
        </Section>

        <Section>
          <SectionTitle>Frequently Asked Questions</SectionTitle>
          <FAQContainer>
            {filteredFAQs.map((faq, index) => (
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
            <SectionTitle>Still Need Help?</SectionTitle>
            <HeaderSubtitle>
              Can't find what you're looking for? Our support team is here to help you 24/7.
            </HeaderSubtitle>
            <ContactButton href="mailto:support@vibecodes.space" style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '10px',
              padding: '15px 30px',
              fontSize: '1.1rem'
            }}>
              <Send size={20} />
              Contact Support
            </ContactButton>
          </div>
        </Section>
      </Content>
    </SupportContainer>
  );
};

export default SupportPage;