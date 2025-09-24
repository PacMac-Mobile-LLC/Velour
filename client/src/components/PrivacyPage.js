import React from 'react';
import styled from 'styled-components';
import { Shield, Lock, Eye, Database, Globe, Users, Mail, Settings } from 'lucide-react';

const PrivacyContainer = styled.div`
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
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 15px;
  padding: 25px;
  margin: 25px 0;
`;

const WarningBox = styled.div`
  background: rgba(255, 193, 7, 0.1);
  border: 1px solid rgba(255, 193, 7, 0.3);
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

const PrivacyPage = () => {
  return (
    <PrivacyContainer>
      <BackgroundPattern />
      
      <Header>
        <HeaderTitle>Privacy Policy</HeaderTitle>
        <HeaderSubtitle>
          Your privacy is our priority. Learn how we collect, use, and protect your personal information.
        </HeaderSubtitle>
        <LastUpdated>
          <Shield size={16} />
          Last updated: September 24, 2024
        </LastUpdated>
      </Header>

      <Content>
        <Section>
          <SectionTitle>
            <Eye size={28} />
            Information We Collect
          </SectionTitle>
          <SectionContent>
            <Paragraph>
              We collect information you provide directly to us, such as when you create an account, 
              use our services, or contact us for support.
            </Paragraph>
            <Paragraph>
              <strong>Personal Information:</strong>
            </Paragraph>
            <List>
              <ListItem>Name, email address, and contact information</ListItem>
              <ListItem>Age verification documents (securely processed and deleted)</ListItem>
              <ListItem>Payment information (processed securely by third-party providers)</ListItem>
              <ListItem>Profile information and content you choose to share</ListItem>
              <ListItem>Communications with us and other users</ListItem>
            </List>
            <Paragraph>
              <strong>Usage Information:</strong>
            </Paragraph>
            <List>
              <ListItem>Device information and IP address</ListItem>
              <ListItem>Browser type and operating system</ListItem>
              <ListItem>Pages visited and features used</ListItem>
              <ListItem>Time spent on our platform</ListItem>
              <ListItem>Referral sources and search terms</ListItem>
            </List>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>
            <Database size={28} />
            How We Use Your Information
          </SectionTitle>
          <SectionContent>
            <Paragraph>
              We use the information we collect to provide, maintain, and improve our services:
            </Paragraph>
            <List>
              <ListItem>Process transactions and manage your account</ListItem>
              <ListItem>Provide customer support and respond to inquiries</ListItem>
              <ListItem>Send important updates about our services</ListItem>
              <ListItem>Improve our platform and develop new features</ListItem>
              <ListItem>Ensure platform security and prevent fraud</ListItem>
              <ListItem>Comply with legal obligations and enforce our terms</ListItem>
            </List>
            <HighlightBox>
              <Paragraph>
                <strong>We never sell your personal information to third parties.</strong> 
                Your data is used solely to provide and improve our services.
              </Paragraph>
            </HighlightBox>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>
            <Lock size={28} />
            Data Security
          </SectionTitle>
          <SectionContent>
            <Paragraph>
              We implement industry-standard security measures to protect your information:
            </Paragraph>
            <List>
              <ListItem>End-to-end encryption for sensitive data</ListItem>
              <ListItem>Secure servers with regular security updates</ListItem>
              <ListItem>Multi-factor authentication for account access</ListItem>
              <ListItem>Regular security audits and penetration testing</ListItem>
              <ListItem>Limited access to personal information by authorized personnel only</ListItem>
            </List>
            <WarningBox>
              <Paragraph>
                <strong>Important:</strong> While we implement strong security measures, 
                no method of transmission over the internet is 100% secure. We cannot 
                guarantee absolute security of your information.
              </Paragraph>
            </WarningBox>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>
            <Globe size={28} />
            Information Sharing
          </SectionTitle>
          <SectionContent>
            <Paragraph>
              We do not sell, trade, or rent your personal information to third parties. 
              We may share your information only in the following limited circumstances:
            </Paragraph>
            <List>
              <ListItem><strong>Service Providers:</strong> Trusted third parties who help us operate our platform</ListItem>
              <ListItem><strong>Legal Requirements:</strong> When required by law or to protect our rights</ListItem>
              <ListItem><strong>Business Transfers:</strong> In connection with a merger or acquisition</ListItem>
              <ListItem><strong>Consent:</strong> When you explicitly consent to sharing</ListItem>
            </List>
            <Paragraph>
              All third parties with access to your information are bound by strict 
              confidentiality agreements and data protection requirements.
            </Paragraph>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>
            <Users size={28} />
            Your Rights and Choices
          </SectionTitle>
          <SectionContent>
            <Paragraph>
              You have the following rights regarding your personal information:
            </Paragraph>
            <List>
              <ListItem><strong>Access:</strong> Request a copy of your personal information</ListItem>
              <ListItem><strong>Correction:</strong> Update or correct inaccurate information</ListItem>
              <ListItem><strong>Deletion:</strong> Request deletion of your personal information</ListItem>
              <ListItem><strong>Portability:</strong> Receive your data in a structured format</ListItem>
              <ListItem><strong>Objection:</strong> Object to certain uses of your information</ListItem>
              <ListItem><strong>Restriction:</strong> Request limitation of processing</ListItem>
            </List>
            <Paragraph>
              To exercise these rights, please contact us at privacy@vibecodes.space. 
              We will respond to your request within 30 days.
            </Paragraph>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>
            <Settings size={28} />
            Cookies and Tracking
          </SectionTitle>
          <SectionContent>
            <Paragraph>
              We use cookies and similar technologies to enhance your experience:
            </Paragraph>
            <List>
              <ListItem><strong>Essential Cookies:</strong> Required for basic platform functionality</ListItem>
              <ListItem><strong>Analytics Cookies:</strong> Help us understand how you use our platform</ListItem>
              <ListItem><strong>Preference Cookies:</strong> Remember your settings and preferences</ListItem>
              <ListItem><strong>Security Cookies:</strong> Protect against fraud and unauthorized access</ListItem>
            </List>
            <Paragraph>
              You can control cookie settings through your browser preferences. 
              Note that disabling certain cookies may affect platform functionality.
            </Paragraph>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>
            <Mail size={28} />
            Communications
          </SectionTitle>
          <SectionContent>
            <Paragraph>
              We may send you communications related to your account and our services:
            </Paragraph>
            <List>
              <ListItem>Account notifications and security alerts</ListItem>
              <ListItem>Service updates and new feature announcements</ListItem>
              <ListItem>Payment confirmations and billing information</ListItem>
              <ListItem>Customer support responses</ListItem>
              <ListItem>Marketing communications (with your consent)</ListItem>
            </List>
            <Paragraph>
              You can opt out of marketing communications at any time by clicking 
              the unsubscribe link in our emails or updating your preferences in your account settings.
            </Paragraph>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>
            <Shield size={28} />
            Data Retention
          </SectionTitle>
          <SectionContent>
            <Paragraph>
              We retain your personal information only as long as necessary to provide our services 
              and comply with legal obligations:
            </Paragraph>
            <List>
              <ListItem>Account information: Until you delete your account</ListItem>
              <ListItem>Transaction records: 7 years for tax and legal compliance</ListItem>
              <ListItem>Age verification documents: Deleted immediately after verification</ListItem>
              <ListItem>Support communications: 3 years for service improvement</ListItem>
              <ListItem>Analytics data: Anonymized after 2 years</ListItem>
            </List>
            <Paragraph>
              When you delete your account, we will delete or anonymize your personal information 
              within 30 days, except where retention is required by law.
            </Paragraph>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>
            <Globe size={28} />
            International Transfers
          </SectionTitle>
          <SectionContent>
            <Paragraph>
              Your information may be transferred to and processed in countries other than your own. 
              We ensure appropriate safeguards are in place for international transfers, including:
            </Paragraph>
            <List>
              <ListItem>Standard contractual clauses approved by relevant authorities</ListItem>
              <ListItem>Adequacy decisions by data protection authorities</ListItem>
              <ListItem>Certification schemes and codes of conduct</ListItem>
            </List>
            <Paragraph>
              By using our services, you consent to the transfer of your information to countries 
              that may have different data protection laws than your country of residence.
            </Paragraph>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>
            <Shield size={28} />
            Changes to This Policy
          </SectionTitle>
          <SectionContent>
            <Paragraph>
              We may update this Privacy Policy from time to time. We will notify you of any 
              material changes by:
            </Paragraph>
            <List>
              <ListItem>Posting the updated policy on our website</ListItem>
              <ListItem>Sending an email notification to your registered email address</ListItem>
              <ListItem>Displaying a notice on our platform</ListItem>
            </List>
            <Paragraph>
              Your continued use of our services after any changes constitutes acceptance of the 
              updated Privacy Policy.
            </Paragraph>
          </SectionContent>
        </Section>

        <ContactInfo>
          <ContactTitle>Questions About Your Privacy?</ContactTitle>
          <ContactText>
            If you have any questions about this Privacy Policy or our data practices, please contact us:
          </ContactText>
          <ContactEmail href="mailto:privacy@vibecodes.space">
            privacy@vibecodes.space
          </ContactEmail>
        </ContactInfo>
      </Content>
    </PrivacyContainer>
  );
};

export default PrivacyPage;
