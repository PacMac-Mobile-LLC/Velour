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
  Info,
  Menu,
  X
} from 'lucide-react';
import { useAuth0Context } from '../contexts/Auth0Context';
import { useStripe } from '../contexts/StripeContext';
import { dashboardService } from '../services/dashboardService';
import { useWelcomeMessage } from '../hooks/useWelcomeMessage';
import { useAgeVerification } from '../hooks/useAgeVerification';
import { useOnboarding } from '../hooks/useOnboarding';
import { debugApi } from '../utils/debugApi';
import WelcomeMessage from './WelcomeMessage';
import AgeVerification from './AgeVerification';
import OnboardingFlow from './OnboardingFlow';
import NotificationsTab from './NotificationsTab';
import MessagesTab from './MessagesTab';
import CollectionsTab from './CollectionsTab';
import VaultTab from './VaultTab';
import QueueTab from './QueueTab';
import StatementsTab from './StatementsTab';
import StatisticsTab from './StatisticsTab';
import ProfileTab from './ProfileTab';
import DiscoverUsersTab from './DiscoverUsersTab';
import SocialFeed from './SocialFeed';
import VideoFeed from './VideoFeed';
import VideoUpload from './VideoUpload';

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
  transition: transform 0.3s ease;
  
  @media (max-width: 768px) {
    transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(-100%)'};
    width: 100%;
    max-width: 320px;
  }
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
  
  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const ContentHeader = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  padding: 20px 30px;
  border-bottom: 1px solid #333;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  @media (max-width: 768px) {
    display: none;
  }
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
  
  @media (max-width: 768px) {
    padding: 20px 15px;
  }
`;

// Mobile-specific components
const MobileHeader = styled.div`
  display: none;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  padding: 15px 20px;
  border-bottom: 1px solid #333;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 999;
  
  @media (max-width: 768px) {
    display: flex;
  }
`;

const MobileMenuButton = styled.button`
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

const MobileTitle = styled.h1`
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
  margin: 0;
`;

const Overlay = styled.div`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  
  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'block' : 'none'};
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.3s ease;
  margin-left: auto;
  
  &:hover {
    background: rgba(255, 105, 180, 0.1);
  }
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
  const { showWelcome, closeWelcome, welcomeMessage } = useWelcomeMessage(user, isAuthenticated);
  const { 
    showVerification, 
    closeVerification, 
    needsVerification, 
    isVerified,
    verificationStatus 
  } = useAgeVerification(user, isAuthenticated);
  const { showOnboarding, userType, completeOnboarding, skipOnboarding } = useOnboarding(user, isAuthenticated);
  const [activeTab, setActiveTab] = useState('home');
  const [subscriptions, setSubscriptions] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [collections, setCollections] = useState([]);
  const [vaultContent, setVaultContent] = useState([]);
  const [queue, setQueue] = useState([]);
  const [statements, setStatements] = useState([]);
  const [profile, setProfile] = useState({});
  const [recommendedCreators, setRecommendedCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVideoUploadOpen, setIsVideoUploadOpen] = useState(false);

  // Handle mobile menu toggle
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Handle tab change with mobile menu close
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false); // Close mobile menu when tab changes
  };

  // Close mobile menu when clicking overlay
  const handleOverlayClick = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    // Debug API configuration
    debugApi();
    
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load dashboard stats
        const statsResult = await dashboardService.getDashboardStats();
        if (statsResult.success) {
          setAnalytics(statsResult.data);
        }

        // Load subscriptions
        const subsResult = await dashboardService.getSubscriptions();
        if (subsResult.success) {
          setSubscriptions(subsResult.data || []);
        }

        // Load notifications
        const notificationsResult = await dashboardService.getNotifications();
        if (notificationsResult.success) {
          setNotifications(notificationsResult.data || []);
        }

        // Load conversations
        const conversationsResult = await dashboardService.getConversations();
        if (conversationsResult.success) {
          setConversations(conversationsResult.data || []);
        }

        // Load collections
        const collectionsResult = await dashboardService.getCollections();
        if (collectionsResult.success) {
          setCollections(collectionsResult.data || []);
        }

        // Load vault content
        const vaultResult = await dashboardService.getVaultContent();
        if (vaultResult.success) {
          setVaultContent(vaultResult.data || []);
        }

        // Load queue
        const queueResult = await dashboardService.getQueue();
        if (queueResult.success) {
          setQueue(queueResult.data || []);
        }

        // Load statements
        const statementsResult = await dashboardService.getStatements();
        if (statementsResult.success) {
          setStatements(statementsResult.data || []);
        }

        // Load profile
        const profileResult = await dashboardService.getProfile();
        if (profileResult.success) {
          setProfile(profileResult.data || {});
        }

        // Load recommended creators
        const recommendedResult = await dashboardService.getRecommendedCreators();
        if (recommendedResult.success) {
          setRecommendedCreators(recommendedResult.data || []);
        }

      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated]);

  const navigationItems = [
    { id: 'home', label: 'Home', icon: Home, badge: null },
    { id: 'videos', label: 'Videos', icon: Video, badge: null },
    { id: 'discover', label: 'Discover', icon: Users, badge: null },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: notifications.filter(n => !n.read).length || null },
    { id: 'messages', label: 'Messages', icon: MessageCircle, badge: conversations.filter(c => c.unreadCount > 0).length || null },
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
        return <SocialFeed user={user} />;
      
      case 'videos':
        return <VideoFeed />;
      
      case 'discover':
        return <DiscoverUsersTab />;
      
      case 'notifications':
        return <NotificationsTab />;
      
      case 'messages':
        return <MessagesTab />;
      
      case 'collections':
        return <CollectionsTab />;
      
      case 'vault':
        return <VaultTab />;
      
      case 'queue':
        return <QueueTab />;
      
      case 'statements':
        return <StatementsTab />;
      
      case 'statistics':
        return <StatisticsTab />;
      
      case 'profile':
        return <ProfileTab />;
      
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
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '50px', 
              height: '50px', 
              border: '3px solid rgba(255, 105, 180, 0.3)',
              borderTop: '3px solid #ff69b4',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }}></div>
            Loading your dashboard...
          </div>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </DashboardContainer>
    );
  }

  if (error) {
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
          <div style={{ textAlign: 'center' }}>
            <AlertCircle size={48} style={{ marginBottom: '20px', color: '#f87171' }} />
            <p style={{ marginBottom: '20px' }}>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              style={{
                background: 'linear-gradient(135deg, #ff69b4 0%, #7a288a 100%)',
                border: 'none',
                borderRadius: '10px',
                padding: '12px 24px',
                color: 'white',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <WelcomeMessage 
        isOpen={showWelcome} 
        onClose={closeWelcome} 
        user={user}
      />
      <AgeVerification 
        isOpen={showVerification} 
        onClose={closeVerification} 
        user={user}
        onVerificationComplete={() => {
          // Refresh dashboard data after verification
          window.location.reload();
        }}
      />
      <OnboardingFlow 
        isOpen={showOnboarding} 
        onClose={skipOnboarding} 
        user={user}
        userType={userType}
        onUserTypeSelect={completeOnboarding}
      />
      
      {/* Mobile Header */}
      <MobileHeader>
        <MobileMenuButton onClick={toggleMobileMenu}>
          <Menu size={24} />
        </MobileMenuButton>
        <MobileTitle>
          {navigationItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
        </MobileTitle>
        <div></div> {/* Spacer for centering */}
      </MobileHeader>

      {/* Overlay for mobile */}
      <Overlay isOpen={isMobileMenuOpen} onClick={handleOverlayClick} />

      <Sidebar isOpen={isMobileMenuOpen}>
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
          <CloseButton onClick={toggleMobileMenu}>
            <X size={20} />
          </CloseButton>
        </ProfileSection>

        <Navigation>
          {navigationItems.map((item) => (
            <NavItem
              key={item.id}
              active={activeTab === item.id}
              onClick={() => handleTabChange(item.id)}
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

        <NewPostButton onClick={() => handleTabChange('vault')}>
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
            
            {activeTab === 'videos' && (
              <ActionButton onClick={() => setIsVideoUploadOpen(true)}>
                <Plus size={16} />
                Upload Video
              </ActionButton>
            )}
            
            <ActionButton onClick={() => handleTabChange('profile')}>
              <Settings size={16} />
              Settings
            </ActionButton>
          </HeaderActions>
        </ContentHeader>

        <ContentArea>
          {renderContent()}
        </ContentArea>
      </MainContent>
      
      {/* Video Upload Modal */}
      <VideoUpload 
        isOpen={isVideoUploadOpen} 
        onClose={() => setIsVideoUploadOpen(false)} 
      />
    </DashboardContainer>
  );
};

export default Dashboard;
