import React, { useState, useEffect } from 'react';
import { useAuth0Context } from '../contexts/Auth0Context';
import { useStripe } from '../contexts/StripeContext';
import styled from 'styled-components';
import { 
  User, 
  Video, 
  MessageSquare, 
  DollarSign, 
  Users, 
  TrendingUp,
  Settings,
  Plus,
  Heart,
  Eye,
  Share2
} from 'lucide-react';
import axios from 'axios';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
`;

const Header = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
`;

const WelcomeText = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 20px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  gap: 20px;
`;

const StatIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const ContentCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const ContentThumbnail = styled.div`
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
`;

const ContentInfo = styled.div`
  padding: 20px;
`;

const ContentTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
`;

const ContentMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const ContentStats = styled.div`
  display: flex;
  gap: 15px;
  color: #666;
  font-size: 0.9rem;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const ActionButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
  }
`;

const QuickActions = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
`;

const QuickActionsTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
`;

const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
`;

const QuickActionButton = styled.button`
  background: rgba(102, 126, 234, 0.1);
  border: 2px solid rgba(102, 126, 234, 0.2);
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: #333;

  &:hover {
    background: rgba(102, 126, 234, 0.2);
    border-color: rgba(102, 126, 234, 0.4);
    transform: translateY(-2px);
  }
`;

const ActionIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const ActionText = styled.span`
  font-weight: 600;
  font-size: 0.9rem;
`;

const Dashboard = () => {
  const { user } = useAuth0Context();
  const isCreator = user?.role === 'creator';
  const { getAnalytics, getSubscriptions } = useStripe();
  const [analytics, setAnalytics] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [recentContent, setRecentContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        if (isCreator) {
          // Load creator analytics
          const analyticsResponse = await getAnalytics();
          if (analyticsResponse.success) {
            setAnalytics(analyticsResponse.data.analytics);
          }
          
          // Load recent content
          const contentResponse = await axios.get('/api/content/my-content?limit=6');
          if (contentResponse.data.success) {
            setRecentContent(contentResponse.data.content);
          }
        } else {
          // Load subscriber subscriptions
          const subscriptionsResponse = await getSubscriptions();
          if (subscriptionsResponse.success) {
            setSubscriptions(subscriptionsResponse.data.subscriptions);
          }
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadDashboardData();
    }
  }, [user, isCreator, getAnalytics, getSubscriptions]);

  if (loading) {
    return (
      <DashboardContainer>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '50vh',
          color: 'white',
          fontSize: '1.2rem'
        }}>
          Loading dashboard...
        </div>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <Header>
        <WelcomeText>
          Welcome back, {user?.profile?.displayName || user?.username}!
        </WelcomeText>
        <Subtitle>
          {isCreator 
            ? "Manage your content and grow your subscriber base" 
            : "Discover amazing creators and exclusive content"
          }
        </Subtitle>
      </Header>

      {isCreator ? (
        <>
          <StatsGrid>
            <StatCard>
              <StatIcon>
                <Users size={24} />
              </StatIcon>
              <StatContent>
                <StatValue>{analytics?.totalSubscribers || 0}</StatValue>
                <StatLabel>Total Subscribers</StatLabel>
              </StatContent>
            </StatCard>
            
            <StatCard>
              <StatIcon>
                <DollarSign size={24} />
              </StatIcon>
              <StatContent>
                <StatValue>${analytics?.monthlyRevenue?.toFixed(2) || '0.00'}</StatValue>
                <StatLabel>Monthly Revenue</StatLabel>
              </StatContent>
            </StatCard>
            
            <StatCard>
              <StatIcon>
                <TrendingUp size={24} />
              </StatIcon>
              <StatContent>
                <StatValue>${analytics?.yearlyRevenue?.toFixed(2) || '0.00'}</StatValue>
                <StatLabel>Yearly Revenue</StatLabel>
              </StatContent>
            </StatCard>
          </StatsGrid>

          <ContentGrid>
            {recentContent.map((content) => (
              <ContentCard key={content._id}>
                <ContentThumbnail>
                  {content.type === 'video' ? <Video size={48} /> : 
                   content.type === 'image' ? <User size={48} /> : 
                   <MessageSquare size={48} />}
                </ContentThumbnail>
                <ContentInfo>
                  <ContentTitle>{content.title}</ContentTitle>
                  <ContentMeta>
                    <span style={{ color: '#666', fontSize: '0.9rem' }}>
                      {new Date(content.createdAt).toLocaleDateString()}
                    </span>
                    <span style={{ 
                      background: content.access.type === 'free' ? '#28a745' : '#667eea',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.8rem'
                    }}>
                      {content.access.type}
                    </span>
                  </ContentMeta>
                  <ContentStats>
                    <StatItem>
                      <Eye size={14} />
                      {content.stats.views}
                    </StatItem>
                    <StatItem>
                      <Heart size={14} />
                      {content.stats.likes}
                    </StatItem>
                    <StatItem>
                      <Share2 size={14} />
                      {content.stats.shares}
                    </StatItem>
                  </ContentStats>
                </ContentInfo>
              </ContentCard>
            ))}
          </ContentGrid>
        </>
      ) : (
        <StatsGrid>
          <StatCard>
            <StatIcon>
              <Heart size={24} />
            </StatIcon>
            <StatContent>
              <StatValue>{subscriptions.length}</StatValue>
              <StatLabel>Active Subscriptions</StatLabel>
            </StatContent>
          </StatCard>
          
          <StatCard>
            <StatIcon>
              <Video size={24} />
            </StatIcon>
            <StatContent>
              <StatValue>0</StatValue>
              <StatLabel>Videos Watched</StatLabel>
            </StatContent>
          </StatCard>
          
          <StatCard>
            <StatIcon>
              <MessageSquare size={24} />
            </StatIcon>
            <StatContent>
              <StatValue>0</StatValue>
              <StatLabel>Messages Sent</StatLabel>
            </StatContent>
          </StatCard>
        </StatsGrid>
      )}

      <QuickActions>
        <QuickActionsTitle>Quick Actions</QuickActionsTitle>
        <ActionsGrid>
          {isCreator ? (
            <>
              <QuickActionButton>
                <ActionIcon>
                  <Plus size={20} />
                </ActionIcon>
                <ActionText>Upload Content</ActionText>
              </QuickActionButton>
              
              <QuickActionButton>
                <ActionIcon>
                  <MessageSquare size={20} />
                </ActionIcon>
                <ActionText>View Messages</ActionText>
              </QuickActionButton>
              
              <QuickActionButton>
                <ActionIcon>
                  <DollarSign size={20} />
                </ActionIcon>
                <ActionText>Earnings</ActionText>
              </QuickActionButton>
              
              <QuickActionButton>
                <ActionIcon>
                  <Settings size={20} />
                </ActionIcon>
                <ActionText>Settings</ActionText>
              </QuickActionButton>
            </>
          ) : (
            <>
              <QuickActionButton>
                <ActionIcon>
                  <User size={20} />
                </ActionIcon>
                <ActionText>Browse Creators</ActionText>
              </QuickActionButton>
              
              <QuickActionButton>
                <ActionIcon>
                  <MessageSquare size={20} />
                </ActionIcon>
                <ActionText>Messages</ActionText>
              </QuickActionButton>
              
              <QuickActionButton>
                <ActionIcon>
                  <Heart size={20} />
                </ActionIcon>
                <ActionText>My Subscriptions</ActionText>
              </QuickActionButton>
              
              <QuickActionButton>
                <ActionIcon>
                  <Settings size={20} />
                </ActionIcon>
                <ActionText>Settings</ActionText>
              </QuickActionButton>
            </>
          )}
        </ActionsGrid>
      </QuickActions>
    </DashboardContainer>
  );
};

export default Dashboard;
