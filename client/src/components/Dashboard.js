import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  Home, 
  Bell, 
  MessageCircle, 
  Star, 
  Archive, 
  Calendar, 
  BarChart3, 
  TrendingUp, 
  User, 
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Heart,
  Eye,
  Users,
  DollarSign,
  Camera,
  Video,
  Image as ImageIcon,
  FileText,
  CreditCard,
  Shield,
  Link,
  Gift,
  Clock,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { useAuth0Context } from '../contexts/Auth0Context';
import { useStripe } from '../contexts/StripeContext';

// Main Dashboard Container
const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: #000;
  color: white;
`;

// Left Sidebar Navigation
const Sidebar = styled.div`
  width: 280px;
  background: linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%);
  border-right: 1px solid #333;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  overflow-y: auto;
  z-index: 1000;
`;

const ProfileSection = styled.div`
  padding: 20px;
  border-bottom: 1px solid #333;
  display: flex;
  align-items: center;
  gap: 15px;
`;

const ProfilePicture = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff69b4 0%, #7a288a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const ProfileName = styled.div`
  font-weight: 600;
  font-size: 1rem;
  color: white;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const ProfileHandle = styled.div`
  font-size: 0.8rem;
  color: #ccc;
  margin-top: 2px;
`;

const VerifiedBadge = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff69b4 0%, #7a288a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 10px;
`;

const Navigation = styled.nav`
  flex: 1;
  padding: 20px 0;
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 20px;
  color: ${props => props.active ? '#ff69b4' : '#ccc'};
  background: ${props => props.active ? 'rgba(255, 105, 180, 0.1)' : 'transparent'};
  border-left: ${props => props.active ? '3px solid #ff69b4' : '3px solid transparent'};
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    background: rgba(255, 105, 180, 0.05);
    color: #ff69b4;
  }
`;

const NavIcon = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NavText = styled.span`
  font-weight: 500;
  font-size: 0.9rem;
`;

const NotificationBadge = styled.div`
  background: linear-gradient(135deg, #ff69b4 0%, #7a288a 100%);
  color: white;
  border-radius: 10px;
  padding: 2px 8px;
  font-size: 0.7rem;
  font-weight: 600;
  margin-left: auto;
`;

const NewPostButton = styled.button`
  margin: 20px;
  padding: 15px;
  background: linear-gradient(135deg, #ff69b4 0%, #7a288a 100%);
  border: none;
  border-radius: 10px;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(255, 105, 180, 0.3);
  }
`;

// Main Content Area
const MainContent = styled.div`
  flex: 1;
  margin-left: 280px;
  background: #111;
  min-height: 100vh;
`;

const ContentHeader = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  padding: 20px 30px;
  border-bottom: 1px solid #333;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  color: white;
  display: flex;
  align-items: center;
  gap: 15px;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const SearchBar = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  background: rgba(42, 42, 42, 0.8);
  border: 1px solid #444;
  border-radius: 25px;
  padding: 10px 20px 10px 45px;
  color: white;
  font-size: 0.9rem;
  width: 300px;
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
  left: 15px;
  color: #888;
`;

const ActionButton = styled.button`
  background: rgba(42, 42, 42, 0.8);
  border: 1px solid #444;
  border-radius: 8px;
  padding: 10px 15px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: rgba(255, 105, 180, 0.1);
    border-color: #ff69b4;
  }
`;

const ContentArea = styled.div`
  padding: 30px;
`;

// Dashboard Stats Cards
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  border: 1px solid #333;
  border-radius: 15px;
  padding: 25px;
  transition: all 0.3s ease;

  &:hover {
    border-color: #ff69b4;
    transform: translateY(-5px);
  }
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
`;

const StatTitle = styled.h3`
  color: #ccc;
  font-size: 0.9rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #ff69b4 0%, #7a288a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin-bottom: 5px;
`;

const StatChange = styled.div`
  font-size: 0.8rem;
  color: ${props => props.positive ? '#4ade80' : '#f87171'};
  display: flex;
  align-items: center;
  gap: 5px;
`;

// Quick Actions
const QuickActions = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  border: 1px solid #333;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 30px;
`;

const QuickActionsTitle = styled.h3`
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
`;

const ActionCard = styled.div`
  background: rgba(42, 42, 42, 0.6);
  border: 1px solid #444;
  border-radius: 10px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;

  &:hover {
    background: rgba(255, 105, 180, 0.1);
    border-color: #ff69b4;
    transform: translateY(-2px);
  }
`;

const ActionIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff69b4 0%, #7a288a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15px;
  color: white;
  font-size: 1.2rem;
`;

const ActionTitle = styled.div`
  color: white;
  font-weight: 600;
  margin-bottom: 5px;
`;

const ActionDescription = styled.div`
  color: #ccc;
  font-size: 0.8rem;
  line-height: 1.4;
`;

// Content Sections
const ContentSection = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  border: 1px solid #333;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 30px;
`;

const SectionTitle = styled.h3`
  color: white;
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SectionContent = styled.div`
  color: #ccc;
  line-height: 1.6;
`;

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth0Context();
  const { getSubscriptions, getAnalytics } = useStripe();
  const [activeTab, setActiveTab] = useState('home');
  const [subscriptions, setSubscriptions] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // Load subscriptions
        const subsResult = await getSubscriptions();
        if (subsResult.success) {
          setSubscriptions(subsResult.data || []);
        }

        // Load analytics
        const analyticsResult = await getAnalytics();
        if (analyticsResult.success) {
          setAnalytics(analyticsResult.data || {});
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated, getSubscriptions, getAnalytics]);

  const navigationItems = [
    { id: 'home', label: 'Home', icon: Home, badge: null },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: 2 },
    { id: 'messages', label: 'Messages', icon: MessageCircle, badge: 2 },
    { id: 'collections', label: 'Collections', icon: Star, badge: null },
    { id: 'vault', label: 'Vault', icon: Archive, badge: null },
    { id: 'queue', label: 'Queue', icon: Calendar, badge: null },
    { id: 'statements', label: 'Statements', icon: BarChart3, badge: null },
    { id: 'statistics', label: 'Statistics', icon: TrendingUp, badge: null },
    { id: 'profile', label: 'My Profile', icon: User, badge: null },
    { id: 'more', label: 'More', icon: MoreHorizontal, badge: null }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div>
            <StatsGrid>
              <StatCard>
                <StatHeader>
                  <StatTitle>Active Subscriptions</StatTitle>
                  <StatIcon><Heart size={20} /></StatIcon>
                </StatHeader>
                <StatValue>{subscriptions.length}</StatValue>
                <StatChange positive>
                  <TrendingUp size={12} />
                  +12% this month
                </StatChange>
              </StatCard>
              
              <StatCard>
                <StatHeader>
                  <StatTitle>Total Views</StatTitle>
                  <StatIcon><Eye size={20} /></StatIcon>
                </StatHeader>
                <StatValue>{analytics.totalViews || 0}</StatValue>
                <StatChange positive>
                  <TrendingUp size={12} />
                  +8% this week
                </StatChange>
              </StatCard>
              
              <StatCard>
                <StatHeader>
                  <StatTitle>Messages Sent</StatTitle>
                  <StatIcon><MessageCircle size={20} /></StatIcon>
                </StatHeader>
                <StatValue>{analytics.messagesSent || 0}</StatValue>
                <StatChange positive>
                  <TrendingUp size={12} />
                  +15% today
                </StatChange>
              </StatCard>
              
              <StatCard>
                <StatHeader>
                  <StatTitle>Monthly Revenue</StatTitle>
                  <StatIcon><DollarSign size={20} /></StatIcon>
                </StatHeader>
                <StatValue>${analytics.monthlyRevenue || 0}</StatValue>
                <StatChange positive>
                  <TrendingUp size={12} />
                  +23% this month
                </StatChange>
              </StatCard>
            </StatsGrid>

            <QuickActions>
              <QuickActionsTitle>
                <Plus size={20} />
                Quick Actions
              </QuickActionsTitle>
              <ActionsGrid>
                <ActionCard onClick={() => setActiveTab('vault')}>
                  <ActionIcon><Camera size={20} /></ActionIcon>
                  <ActionTitle>Upload Content</ActionTitle>
                  <ActionDescription>Add photos, videos, or live streams to your vault</ActionDescription>
                </ActionCard>
                
                <ActionCard onClick={() => setActiveTab('queue')}>
                  <ActionIcon><Calendar size={20} /></ActionIcon>
                  <ActionTitle>Schedule Live</ActionTitle>
                  <ActionDescription>Plan your next live streaming session</ActionDescription>
                </ActionCard>
                
                <ActionCard onClick={() => setActiveTab('messages')}>
                  <ActionIcon><MessageCircle size={20} /></ActionIcon>
                  <ActionTitle>Send Message</ActionTitle>
                  <ActionDescription>Connect with your subscribers</ActionDescription>
                </ActionCard>
                
                <ActionCard onClick={() => setActiveTab('statistics')}>
                  <ActionIcon><TrendingUp size={20} /></ActionIcon>
                  <ActionTitle>View Analytics</ActionTitle>
                  <ActionDescription>Check your performance metrics</ActionDescription>
                </ActionCard>
              </ActionsGrid>
            </QuickActions>

            <ContentSection>
              <SectionTitle>
                <Users size={20} />
                Recent Activity
              </SectionTitle>
              <SectionContent>
                <p>Welcome back, {user?.name || 'Creator'}! Here's what's happening with your content:</p>
                <ul style={{ marginTop: '15px', paddingLeft: '20px' }}>
                  <li>3 new subscribers joined today</li>
                  <li>12 messages received in the last hour</li>
                  <li>Your latest post has 45 likes</li>
                  <li>2 scheduled live sessions coming up</li>
                </ul>
              </SectionContent>
            </ContentSection>
          </div>
        );
      
      case 'notifications':
        return (
          <ContentSection>
            <SectionTitle>
              <Bell size={20} />
              Notifications
            </SectionTitle>
            <SectionContent>
              <p>Track your likes, comments, follows, and subscriber activity here.</p>
              <div style={{ marginTop: '20px', textAlign: 'center', padding: '40px', color: '#888' }}>
                <Bell size={48} style={{ marginBottom: '20px', opacity: 0.5 }} />
                <p>Notifications system coming soon!</p>
              </div>
            </SectionContent>
          </ContentSection>
        );
      
      case 'messages':
        return (
          <ContentSection>
            <SectionTitle>
              <MessageCircle size={20} />
              Messages
            </SectionTitle>
            <SectionContent>
              <p>Connect with your paid subscribers through direct messaging.</p>
              <div style={{ marginTop: '20px', textAlign: 'center', padding: '40px', color: '#888' }}>
                <MessageCircle size={48} style={{ marginBottom: '20px', opacity: 0.5 }} />
                <p>Messaging system coming soon!</p>
              </div>
            </SectionContent>
          </ContentSection>
        );
      
      case 'collections':
        return (
          <ContentSection>
            <SectionTitle>
              <Star size={20} />
              Collections
            </SectionTitle>
            <SectionContent>
              <p>Create categories and organize your favorite creators.</p>
              <div style={{ marginTop: '20px', textAlign: 'center', padding: '40px', color: '#888' }}>
                <Star size={48} style={{ marginBottom: '20px', opacity: 0.5 }} />
                <p>Collections system coming soon!</p>
              </div>
            </SectionContent>
          </ContentSection>
        );
      
      case 'vault':
        return (
          <ContentSection>
            <SectionTitle>
              <Archive size={20} />
              Vault
            </SectionTitle>
            <SectionContent>
              <p>Store and manage your private photos, videos, and content.</p>
              <div style={{ marginTop: '20px', textAlign: 'center', padding: '40px', color: '#888' }}>
                <Archive size={48} style={{ marginBottom: '20px', opacity: 0.5 }} />
                <p>Vault system coming soon!</p>
              </div>
            </SectionContent>
          </ContentSection>
        );
      
      case 'queue':
        return (
          <ContentSection>
            <SectionTitle>
              <Calendar size={20} />
              Queue
            </SectionTitle>
            <SectionContent>
              <p>Schedule your live streaming sessions and content releases.</p>
              <div style={{ marginTop: '20px', textAlign: 'center', padding: '40px', color: '#888' }}>
                <Calendar size={48} style={{ marginBottom: '20px', opacity: 0.5 }} />
                <p>Queue system coming soon!</p>
              </div>
            </SectionContent>
          </ContentSection>
        );
      
      case 'statements':
        return (
          <ContentSection>
            <SectionTitle>
              <BarChart3 size={20} />
              Statements
            </SectionTitle>
            <SectionContent>
              <p>View your payout history and earnings statements.</p>
              <div style={{ marginTop: '20px', textAlign: 'center', padding: '40px', color: '#888' }}>
                <BarChart3 size={48} style={{ marginBottom: '20px', opacity: 0.5 }} />
                <p>Statements system coming soon!</p>
              </div>
            </SectionContent>
          </ContentSection>
        );
      
      case 'statistics':
        return (
          <ContentSection>
            <SectionTitle>
              <TrendingUp size={20} />
              Statistics
            </SectionTitle>
            <SectionContent>
              <p>Track your performance metrics and audience engagement over time.</p>
              <div style={{ marginTop: '20px', textAlign: 'center', padding: '40px', color: '#888' }}>
                <TrendingUp size={48} style={{ marginBottom: '20px', opacity: 0.5 }} />
                <p>Advanced statistics coming soon!</p>
              </div>
            </SectionContent>
          </ContentSection>
        );
      
      case 'profile':
        return (
          <ContentSection>
            <SectionTitle>
              <User size={20} />
              My Profile
            </SectionTitle>
            <SectionContent>
              <p>Manage your profile, customize your feed, and add personal links.</p>
              <div style={{ marginTop: '20px', textAlign: 'center', padding: '40px', color: '#888' }}>
                <User size={48} style={{ marginBottom: '20px', opacity: 0.5 }} />
                <p>Profile management coming soon!</p>
              </div>
            </SectionContent>
          </ContentSection>
        );
      
      default:
        return (
          <ContentSection>
            <SectionTitle>
              <Info size={20} />
              Coming Soon
            </SectionTitle>
            <SectionContent>
              <p>This feature is under development and will be available soon!</p>
            </SectionContent>
          </ContentSection>
        );
    }
  };

  if (loading) {
    return (
      <DashboardContainer>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          width: '100%',
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          color: 'white',
          fontSize: '1.2rem'
        }}>
          Loading your dashboard...
        </div>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <Sidebar>
        <ProfileSection>
          <ProfilePicture>
            {user?.name?.charAt(0) || 'U'}
          </ProfilePicture>
          <ProfileInfo>
            <ProfileName>
              {user?.name || 'User'}
              <VerifiedBadge>✓</VerifiedBadge>
            </ProfileName>
            <ProfileHandle>@{user?.nickname || 'user'}</ProfileHandle>
          </ProfileInfo>
        </ProfileSection>

        <Navigation>
          {navigationItems.map((item) => (
            <NavItem
              key={item.id}
              active={activeTab === item.id}
              onClick={() => setActiveTab(item.id)}
            >
              <NavIcon>
                <item.icon size={18} />
              </NavIcon>
              <NavText>{item.label}</NavText>
              {item.badge && (
                <NotificationBadge>{item.badge}</NotificationBadge>
              )}
            </NavItem>
          ))}
        </Navigation>

        <NewPostButton>
          <Plus size={16} />
          NEW POST
        </NewPostButton>
      </Sidebar>

      <MainContent>
        <ContentHeader>
          <HeaderTitle>
            {navigationItems.find(item => item.id === activeTab)?.icon && 
              React.createElement(navigationItems.find(item => item.id === activeTab).icon, { size: 24 })
            }
            {navigationItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
          </HeaderTitle>
          
          <HeaderActions>
            <SearchBar>
              <SearchIcon>
                <Search size={16} />
              </SearchIcon>
              <SearchInput placeholder="Search..." />
            </SearchBar>
            
            <ActionButton>
              <Settings size={16} />
              Settings
            </ActionButton>
          </HeaderActions>
        </ContentHeader>

        <ContentArea>
          {renderContent()}
        </ContentArea>
      </MainContent>
    </DashboardContainer>
  );
};

export default Dashboard;
