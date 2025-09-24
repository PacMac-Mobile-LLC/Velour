import React from 'react';
import styled from 'styled-components';
import { Shield, FileText, Scale, Users, Lock, Globe, Clock } from 'lucide-react';

const TermsContainer = styled.div`
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
  margin: 0 0 30px 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
`;

const LastUpdated = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(42, 42, 42, 0.8);
  border: 1px solid #444;
  border-radius: 25px;
  padding: 10px 20px;
  color: #ccc;
  font-size: 0.9rem;
`;

const Content = styled.main`
  max-width: 900px;
  margin: 0 auto;
  padding: 0 20px 80px;
  position: relative;
  z-index: 1;
`;

const Section = styled.section`
  margin-bottom: 50px;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 25px 0;
  color: #ff69b4;
  display: flex;
  align-items: center;
  gap: 15px;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const SectionContent = styled.div`
  background: rgba(42, 42, 42, 0.8);
  border: 1px solid #444;
  border-radius: 15px;
  padding: 30px;
  line-height: 1.8;
  color: #e0e0e0;
`;

const Paragraph = styled.p`
  margin: 0 0 20px 0;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const List = styled.ul`
  margin: 20px 0;
  padding-left: 30px;
`;

const ListItem = styled.li`
  margin-bottom: 10px;
  color: #e0e0e0;
`;

const HighlightBox = styled.div`
  background: rgba(255, 105, 180, 0.1);
  border: 1px solid rgba(255, 105, 180, 0.3);
  border-radius: 15px;
  padding: 25px;
  margin: 25px 0;
`;

const ContactInfo = styled.div`
  background: rgba(42, 42, 42, 0.8);
  border: 1px solid #444;
  border-radius: 15px;
  padding: 30px;
  text-align: center;
  margin-top: 50px;
`;

const ContactTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 15px 0;
  color: #ff69b4;
`;

const ContactText = styled.p`
  color: #ccc;
  margin: 0 0 10px 0;
`;

const ContactEmail = styled.a`
  color: #ff69b4;
  text-decoration: none;
  font-weight: 600;
  
  &:hover {
    text-decoration: underline;
  }
`;

const TermsPage = () => {
  return (
    <TermsContainer>
      <BackgroundPattern />
      
      <Header>
        <HeaderTitle>Terms of Service</HeaderTitle>
        <HeaderSubtitle>
          Please read these terms carefully before using Velour. 
          By using our platform, you agree to be bound by these terms.
        </HeaderSubtitle>
        <LastUpdated>
          <Clock size={16} />
          Last updated: September 24, 2024
        </LastUpdated>
      </Header>

      <Content>
        <Section>
          <SectionTitle>
            <FileText size={28} />
            Acceptance of Terms
          </SectionTitle>
          <SectionContent>
            <Paragraph>
              Welcome to Velour ("we," "our," or "us"). These Terms of Service ("Terms") govern your use of our platform, 
              including our website, mobile applications, and related services (collectively, the "Service").
            </Paragraph>
            <Paragraph>
              By accessing or using our Service, you agree to be bound by these Terms and our Privacy Policy. 
              If you disagree with any part of these terms, then you may not access the Service.
            </Paragraph>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>
            <Users size={28} />
            User Accounts
          </SectionTitle>
          <SectionContent>
            <Paragraph>
              To access certain features of our Service, you must register for an account. You agree to:
            </Paragraph>
            <List>
              <ListItem>Provide accurate, current, and complete information during registration</ListItem>
              <ListItem>Maintain and update your account information to keep it accurate</ListItem>
              <ListItem>Maintain the security of your password and account</ListItem>
              <ListItem>Accept responsibility for all activities under your account</ListItem>
              <ListItem>Notify us immediately of any unauthorized use of your account</ListItem>
            </List>
            <HighlightBox>
              <Paragraph>
                <strong>Age Requirement:</strong> You must be at least 18 years old to use our Service. 
                We verify age through our secure verification process.
              </Paragraph>
            </HighlightBox>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>
            <Shield size={28} />
            Content and Conduct
          </SectionTitle>
          <SectionContent>
            <Paragraph>
              As a user of our Service, you agree to comply with all applicable laws and regulations. 
              You are responsible for all content you post, upload, or share on our platform.
            </Paragraph>
            <Paragraph>
              <strong>Prohibited Content:</strong> You may not post, upload, or share content that:
            </Paragraph>
            <List>
              <ListItem>Violates any applicable law or regulation</ListItem>
              <ListItem>Infringes on intellectual property rights of others</ListItem>
              <ListItem>Contains harmful, threatening, or abusive material</ListItem>
              <ListItem>Promotes illegal activities or violence</ListItem>
              <ListItem>Contains spam, malware, or malicious code</ListItem>
              <ListItem>Violates our Community Guidelines</ListItem>
            </List>
            <Paragraph>
              We reserve the right to remove any content that violates these Terms and to suspend or 
              terminate accounts that repeatedly violate our policies.
            </Paragraph>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>
            <Lock size={28} />
            Privacy and Data Protection
          </SectionTitle>
          <SectionContent>
            <Paragraph>
              Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect 
              your information when you use our Service. By using our Service, you agree to the collection 
              and use of information in accordance with our Privacy Policy.
            </Paragraph>
            <Paragraph>
              We implement industry-standard security measures to protect your personal information and content. 
              However, no method of transmission over the internet is 100% secure, and we cannot guarantee 
              absolute security.
            </Paragraph>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>
            <Scale size={28} />
            Intellectual Property
          </SectionTitle>
          <SectionContent>
            <Paragraph>
              The Service and its original content, features, and functionality are owned by Velour and are 
              protected by international copyright, trademark, patent, trade secret, and other intellectual 
              property laws.
            </Paragraph>
            <Paragraph>
              You retain ownership of the content you create and share on our platform. By posting content, 
              you grant us a non-exclusive, royalty-free license to use, display, and distribute your content 
              on our Service.
            </Paragraph>
            <Paragraph>
              We respect intellectual property rights and will respond to valid copyright infringement claims 
              in accordance with applicable law.
            </Paragraph>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>
            <Globe size={28} />
            Payment and Billing
          </SectionTitle>
          <SectionContent>
            <Paragraph>
              Our Service may include paid features and subscriptions. All payments are processed securely 
              through our payment partners. You agree to pay all fees and charges associated with your use 
              of paid features.
            </Paragraph>
            <Paragraph>
              <strong>Creator Earnings:</strong> Creators receive 80% of their earnings, with 20% retained 
              by Velour for platform maintenance, payment processing, and service provision.
            </Paragraph>
            <Paragraph>
              <strong>Refunds:</strong> All sales are final. We do not provide refunds for digital content 
              or subscriptions, except as required by law.
            </Paragraph>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>
            <Shield size={28} />
            Disclaimers and Limitation of Liability
          </SectionTitle>
          <SectionContent>
            <Paragraph>
              The Service is provided on an "as is" and "as available" basis. We make no warranties, 
              express or implied, regarding the Service's availability, accuracy, or reliability.
            </Paragraph>
            <Paragraph>
              To the maximum extent permitted by law, Velour shall not be liable for any indirect, 
              incidental, special, consequential, or punitive damages resulting from your use of the Service.
            </Paragraph>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>
            <FileText size={28} />
            Changes to Terms
          </SectionTitle>
          <SectionContent>
            <Paragraph>
              We reserve the right to modify these Terms at any time. We will notify users of any 
              material changes by posting the new Terms on our website and updating the "Last updated" date.
            </Paragraph>
            <Paragraph>
              Your continued use of the Service after any modifications constitutes acceptance of the 
              updated Terms. If you do not agree to the modified Terms, you must stop using the Service.
            </Paragraph>
          </SectionContent>
        </Section>

        <ContactInfo>
          <ContactTitle>Questions About These Terms?</ContactTitle>
          <ContactText>
            If you have any questions about these Terms of Service, please contact us:
          </ContactText>
          <ContactEmail href="mailto:legal@vibecodes.space">
            legal@vibecodes.space
          </ContactEmail>
        </ContactInfo>
      </Content>
    </TermsContainer>
  );
};

export default TermsPage;
