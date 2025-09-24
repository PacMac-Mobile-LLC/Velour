import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Mail, 
  MessageCircle, 
  Phone, 
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  ExternalLink
} from 'lucide-react';
import Logo from './Logo';

const SupportContainer = styled.div`
  min-height: 100vh;
  background: #000;
  color: white;
  padding: 20px;
`;

const Header = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 40px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  border: 2px solid #ff69b4;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #ff69b4 0%, #7a288a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #ccc;
  margin-bottom: 30px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const SearchContainer = styled.div`
  max-width: 500px;
  margin: 0 auto;
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 15px 50px 15px 20px;
  background: rgba(42, 42, 42, 0.8);
  border: 1px solid #444;
  border-radius: 50px;
  color: white;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: #ff69b4;
    box-shadow: 0 0 0 2px rgba(255, 105, 180, 0.2);
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
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
`;

const MainContent = styled.div`
  background: rgba(0, 0, 0, 0.8);
  border-radius: 20px;
  padding: 40px;
  border: 1px solid #333;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SidebarCard = styled.div`
  background: rgba(0, 0, 0, 0.8);
  border-radius: 15px;
  padding: 25px;
  border: 1px solid #333;
`;

const SidebarTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 15px;
  color: white;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: rgba(42, 42, 42, 0.6);
  border-radius: 10px;
  margin-bottom: 10px;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: rgba(255, 105, 180, 0.1);
    border-color: #ff69b4;
  }
`;

const ContactIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff69b4 0%, #7a288a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const ContactInfo = styled.div`
  flex: 1;
`;

const ContactLabel = styled.div`
  font-weight: 600;
  color: white;
  margin-bottom: 5px;
`;

const ContactValue = styled.div`
  color: #ccc;
  font-size: 0.9rem;
`;

const FAQSection = styled.div`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 30px;
  color: white;
  display: flex;
  align-items: center;
  gap: 15px;
`;

const FAQItem = styled.div`
  background: rgba(42, 42, 42, 0.6);
  border: 1px solid #444;
  border-radius: 15px;
  margin-bottom: 15px;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    border-color: #ff69b4;
  }
`;

const FAQQuestion = styled.div`
  padding: 20px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  color: white;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 105, 180, 0.1);
  }
`;

const FAQAnswer = styled.div`
  padding: 0 20px 20px;
  color: #ccc;
  line-height: 1.6;
  display: ${props => props.isOpen ? 'block' : 'none'};
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 20px;
`;

const StatusOnline = styled(StatusBadge)`
  background: rgba(40, 167, 69, 0.2);
  color: #28a745;
  border: 1px solid rgba(40, 167, 69, 0.3);
`;

const QuickLinks = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 20px;
`;

const QuickLink = styled.a`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  background: rgba(42, 42, 42, 0.6);
  border: 1px solid #444;
  border-radius: 10px;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 105, 180, 0.1);
    border-color: #ff69b4;
    transform: translateY(-2px);
  }
`;

const SupportPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "How do I create an account on Velour?",
      answer: "Creating an account is easy! Click the 'Start Creating' or 'Browse Creators' button on our homepage, then sign in with your Twitter account. You'll be redirected to your dashboard where you can start exploring or creating content."
    },
    {
      id: 2,
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express) and debit cards through our secure Stripe payment system. All payments are processed securely and your payment information is encrypted."
    },
    {
      id: 3,
      question: "How do I subscribe to a creator?",
      answer: "Browse our featured creators on the homepage or search for specific creators. Click on a creator's profile, choose your subscription plan (monthly or yearly), and complete the secure payment process. You'll have instant access to their exclusive content."
    },
    {
      id: 4,
      question: "Can I cancel my subscription anytime?",
      answer: "Yes! You can cancel your subscription at any time from your dashboard. Go to 'My Subscriptions', find the creator you want to unsubscribe from, and click 'Cancel Subscription'. You'll continue to have access until the end of your current billing period."
    },
    {
      id: 5,
      question: "How do I become a creator on Velour?",
      answer: "Anyone can become a creator! After signing up, go to your dashboard and click 'Start Creating'. You can upload content, set your subscription prices, and start building your subscriber base. We provide all the tools you need to succeed."
    },
    {
      id: 6,
      question: "What types of content can I share?",
      answer: "You can share photos, videos, live streams, and written posts. We support most common file formats including JPEG, PNG, MP4, and more. Content must comply with our community guidelines and terms of service."
    },
    {
      id: 7,
      question: "How do I contact a creator directly?",
      answer: "Once you're subscribed to a creator, you can send them direct messages through the messaging system. Go to your dashboard, find the creator in your subscriptions, and click the message icon to start a conversation."
    },
    {
      id: 8,
      question: "Is my personal information secure?",
      answer: "Absolutely! We use industry-standard encryption to protect your data. Your payment information is processed securely through Stripe, and we never store your credit card details on our servers. We're committed to protecting your privacy."
    },
    {
      id: 9,
      question: "How do I reset my password?",
      answer: "If you need to reset your password, click 'Forgot Password' on the login page. Enter your email address and we'll send you a secure link to reset your password. The link will expire after 24 hours for security."
    },
    {
      id: 10,
      question: "What are the subscription fees?",
      answer: "Velour is free to join! Creators set their own subscription prices, typically ranging from $5-50 per month. We take a small platform fee to cover payment processing and platform maintenance. You'll see the exact price before subscribing."
    },
    {
      id: 11,
      question: "Can I get a refund?",
      answer: "Refunds are handled on a case-by-case basis. If you're not satisfied with a creator's content, please contact our support team within 7 days of your subscription. We'll review your request and work to resolve any issues."
    },
    {
      id: 12,
      question: "How do I report inappropriate content?",
      answer: "If you encounter content that violates our community guidelines, click the 'Report' button on the content or contact our support team immediately. We take all reports seriously and will investigate promptly."
    }
  ];

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <SupportContainer>
      <Header>
        <Logo size="large" showTagline={false} />
        <Title>Support Center</Title>
        <Subtitle>
          Find answers to common questions, get help with your account, or contact our support team
        </Subtitle>
        
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Search for help..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SearchIcon>
            <Search size={20} />
          </SearchIcon>
        </SearchContainer>
      </Header>

      <ContentGrid>
        <MainContent>
          <FAQSection>
            <SectionTitle>
              <HelpCircle size={32} />
              Frequently Asked Questions
            </SectionTitle>
            
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq) => (
                <FAQItem key={faq.id}>
                  <FAQQuestion onClick={() => toggleFAQ(faq.id)}>
                    {faq.question}
                    {openFAQ === faq.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </FAQQuestion>
                  <FAQAnswer isOpen={openFAQ === faq.id}>
                    {faq.answer}
                  </FAQAnswer>
                </FAQItem>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#ccc' }}>
                <Search size={48} style={{ marginBottom: '20px', opacity: 0.5 }} />
                <p>No results found for "{searchTerm}"</p>
                <p>Try searching with different keywords or browse our FAQ categories</p>
              </div>
            )}
          </FAQSection>
        </MainContent>

        <Sidebar>
          <SidebarCard>
            <SidebarTitle>
              <CheckCircle size={20} />
              System Status
            </SidebarTitle>
            <StatusOnline>
              <CheckCircle size={16} />
              All systems operational
            </StatusOnline>
            <p style={{ color: '#ccc', fontSize: '0.9rem' }}>
              Our platform is running smoothly. All services are available.
            </p>
          </SidebarCard>

          <SidebarCard>
            <SidebarTitle>
              <MessageCircle size={20} />
              Contact Support
            </SidebarTitle>
            
            <ContactItem>
              <ContactIcon>
                <Mail size={20} />
              </ContactIcon>
              <ContactInfo>
                <ContactLabel>Email Support</ContactLabel>
                <ContactValue>support@vibecodes.space</ContactValue>
              </ContactInfo>
            </ContactItem>

            <ContactItem>
              <ContactIcon>
                <MessageCircle size={20} />
              </ContactIcon>
              <ContactInfo>
                <ContactLabel>Live Chat</ContactLabel>
                <ContactValue>Available 24/7</ContactValue>
              </ContactInfo>
            </ContactItem>

            <ContactItem>
              <ContactIcon>
                <Phone size={20} />
              </ContactIcon>
              <ContactInfo>
                <ContactLabel>Phone Support</ContactLabel>
                <ContactValue>Premium users only</ContactValue>
              </ContactInfo>
            </ContactItem>
          </SidebarCard>

          <SidebarCard>
            <SidebarTitle>
              <Clock size={20} />
              Support Hours
            </SidebarTitle>
            <div style={{ color: '#ccc', fontSize: '0.9rem' }}>
              <p><strong>Email Support:</strong> 24/7</p>
              <p><strong>Live Chat:</strong> 24/7</p>
              <p><strong>Phone Support:</strong> Mon-Fri 9AM-6PM EST</p>
              <p><strong>Response Time:</strong> Within 2 hours</p>
            </div>
          </SidebarCard>

          <SidebarCard>
            <SidebarTitle>
              <ExternalLink size={20} />
              Quick Links
            </SidebarTitle>
            <QuickLinks>
              <QuickLink href="/#about">
                <Info size={16} />
                About Velour
              </QuickLink>
              <QuickLink href="/#terms">
                <AlertCircle size={16} />
                Terms of Service
              </QuickLink>
              <QuickLink href="/#privacy">
                <CheckCircle size={16} />
                Privacy Policy
              </QuickLink>
              <QuickLink href="/#creators">
                <MessageCircle size={16} />
                For Creators
              </QuickLink>
            </QuickLinks>
          </SidebarCard>
        </Sidebar>
      </ContentGrid>
    </SupportContainer>
  );
};

export default SupportPage;
