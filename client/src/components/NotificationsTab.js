import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  Bell, 
  Heart, 
  MessageCircle, 
  UserPlus, 
  Eye, 
  Star,
  MoreHorizontal,
  Check,
  X,
  Filter,
  Search,
  Settings,
  Calendar,
  TrendingUp,
  Users,
  DollarSign
} from 'lucide-react';
import { dashboardService } from '../services/dashboardService';

const NotificationsContainer = styled.div`
  padding: 20px;
  max-width: 100%;
`;

const NotificationsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const HeaderTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: white;
  display: flex;
  align-items: center;
  gap: 15px;
  margin: 0;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
`;

const SearchBar = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  background: rgba(42, 42, 42, 0.8);
  border: 1px solid #444;
  border-radius: 10px;
  padding: 12px 15px 12px 45px;
  color: white;
  font-size: 1rem;
  width: 300px;
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
  left: 15px;
  color: #888;
  z-index: 1;
`;

const FilterButton = styled.button`
  background: rgba(42, 42, 42, 0.8);
  border: 1px solid #444;
  border-radius: 10px;
  padding: 12px 15px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    border-color: #ff69b4;
    background: rgba(255, 105, 180, 0.1);
  }
`;

const SettingsButton = styled.button`
  background: rgba(42, 42, 42, 0.8);
  border: 1px solid #444;
  border-radius: 10px;
  padding: 12px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #ff69b4;
    background: rgba(255, 105, 180, 0.1);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: rgba(42, 42, 42, 0.6);
  border: 1px solid #444;
  border-radius: 15px;
  padding: 20px;
  transition: all 0.3s ease;

  &:hover {
    border-color: #ff69b4;
    transform: translateY(-2px);
  }
`;

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const StatTitle = styled.h3`
  color: #ccc;
  font-size: 0.9rem;
  font-weight: 500;
  margin: 0;
`;

const StatIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff69b4 0%, #7a288a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const StatValue = styled.div`
  color: white;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 8px;
`;

const StatChange = styled.div`
  color: ${props => props.positive ? '#22c55e' : '#ef4444'};
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const FilterTabs = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 25px;
  flex-wrap: wrap;
`;

const FilterTab = styled.button`
  background: ${props => props.active ? 'linear-gradient(135deg, #ff69b4 0%, #7a288a 100%)' : 'rgba(42, 42, 42, 0.6)'};
  border: 1px solid ${props => props.active ? '#ff69b4' : '#444'};
  border-radius: 25px;
  padding: 10px 20px;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    border-color: #ff69b4;
    background: ${props => props.active ? 'linear-gradient(135deg, #ff69b4 0%, #7a288a 100%)' : 'rgba(255, 105, 180, 0.1)'};
  }
`;

const NotificationsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const NotificationCard = styled.div`
  background: rgba(42, 42, 42, 0.6);
  border: 1px solid #444;
  border-radius: 15px;
  padding: 20px;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    border-color: #ff69b4;
    transform: translateY(-2px);
  }

  ${props => !props.read && `
    border-left: 4px solid #ff69b4;
    background: rgba(255, 105, 180, 0.05);
  `}
`;

const NotificationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
`;

const NotificationContent = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 15px;
`;

const NotificationIcon = styled.div`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: ${props => {
    switch(props.type) {
      case 'like': return 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
      case 'comment': return 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
      case 'follow': return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
      case 'subscription': return 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
      case 'view': return 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)';
      default: return 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)';
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
`;

const NotificationText = styled.div`
  flex: 1;
`;

const NotificationTitle = styled.h4`
  color: white;
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 5px 0;
`;

const NotificationDescription = styled.p`
  color: #ccc;
  font-size: 0.9rem;
  margin: 0 0 8px 0;
  line-height: 1.4;
`;

const NotificationTime = styled.span`
  color: #888;
  font-size: 0.8rem;
`;

const NotificationActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
`;

const ActionButton = styled.button`
  background: ${props => props.primary ? 'linear-gradient(135deg, #ff69b4 0%, #7a288a 100%)' : 'rgba(42, 42, 42, 0.6)'};
  border: 1px solid ${props => props.primary ? '#ff69b4' : '#444'};
  border-radius: 8px;
  padding: 8px 16px;
  color: white;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 5px;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(255, 105, 180, 0.3);
  }
`;

const MoreButton = styled.button`
  background: transparent;
  border: none;
  color: #888;
  cursor: pointer;
  padding: 5px;
  border-radius: 5px;
  transition: all 0.3s ease;

  &:hover {
    color: white;
    background: rgba(255, 255, 255, 0.1);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #888;
`;

const EmptyIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(42, 42, 42, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: #666;
`;

const EmptyTitle = styled.h3`
  color: #ccc;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 10px;
`;

const EmptyDescription = styled.p`
  color: #888;
  font-size: 1rem;
  line-height: 1.5;
`;

const NotificationsTab = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    likes: 0,
    comments: 0,
    follows: 0,
    subscriptions: 0
  });

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const result = await dashboardService.getNotifications();
      
      if (result.success) {
        setNotifications(result.data || []);
        calculateStats(result.data || []);
      } else {
        // Use mock data for now
        const mockNotifications = [
          {
            id: '1',
            type: 'like',
            title: 'New Like',
            description: 'Sarah liked your latest post "Sunset Vibes"',
            time: '2 minutes ago',
            read: false,
            user: { name: 'Sarah', avatar: 'S' }
          },
          {
            id: '2',
            type: 'comment',
            title: 'New Comment',
            description: 'Mike commented: "Amazing content! Keep it up!"',
            time: '15 minutes ago',
            read: false,
            user: { name: 'Mike', avatar: 'M' }
          },
          {
            id: '3',
            type: 'follow',
            title: 'New Follower',
            description: 'Emma started following you',
            time: '1 hour ago',
            read: true,
            user: { name: 'Emma', avatar: 'E' }
          },
          {
            id: '4',
            type: 'subscription',
            title: 'New Subscription',
            description: 'Alex subscribed to your premium content',
            time: '2 hours ago',
            read: true,
            user: { name: 'Alex', avatar: 'A' }
          },
          {
            id: '5',
            type: 'view',
            title: 'High Engagement',
            description: 'Your post "Morning Routine" reached 1,000 views',
            time: '3 hours ago',
            read: true,
            user: null
          }
        ];
        setNotifications(mockNotifications);
        calculateStats(mockNotifications);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (notifications) => {
    const stats = {
      total: notifications.length,
      unread: notifications.filter(n => !n.read).length,
      likes: notifications.filter(n => n.type === 'like').length,
      comments: notifications.filter(n => n.type === 'comment').length,
      follows: notifications.filter(n => n.type === 'follow').length,
      subscriptions: notifications.filter(n => n.type === 'subscription').length
    };
    setStats(stats);
  };

  const markAsRead = async (notificationId) => {
    try {
      await dashboardService.markNotificationAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      calculateStats(notifications.map(n => n.id === notificationId ? { ...n, read: true } : n));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getFilteredNotifications = () => {
    let filtered = notifications;

    if (activeFilter !== 'all') {
      filtered = filtered.filter(n => n.type === activeFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const getIcon = (type) => {
    switch (type) {
      case 'like': return <Heart size={20} />;
      case 'comment': return <MessageCircle size={20} />;
      case 'follow': return <UserPlus size={20} />;
      case 'subscription': return <Star size={20} />;
      case 'view': return <Eye size={20} />;
      default: return <Bell size={20} />;
    }
  };

  const formatTime = (time) => {
    return time;
  };

  if (loading) {
    return (
      <NotificationsContainer>
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888' }}>
          <div style={{ 
            width: '50px', 
            height: '50px', 
            border: '3px solid rgba(255, 105, 180, 0.3)',
            borderTop: '3px solid #ff69b4',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          Loading notifications...
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </NotificationsContainer>
    );
  }

  const filteredNotifications = getFilteredNotifications();

  return (
    <NotificationsContainer>
      <NotificationsHeader>
        <HeaderTitle>
          <Bell size={28} />
          Notifications
        </HeaderTitle>
        <HeaderActions>
          <SearchBar>
            <SearchIcon>
              <Search size={18} />
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchBar>
          <FilterButton>
            <Filter size={18} />
            Filter
          </FilterButton>
          <SettingsButton>
            <Settings size={18} />
          </SettingsButton>
        </HeaderActions>
      </NotificationsHeader>

      <StatsGrid>
        <StatCard>
          <StatHeader>
            <StatTitle>Total Notifications</StatTitle>
            <StatIcon><Bell size={20} /></StatIcon>
          </StatHeader>
          <StatValue>{stats.total}</StatValue>
          <StatChange positive>
            <TrendingUp size={12} />
            +12% this week
          </StatChange>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatTitle>Unread</StatTitle>
            <StatIcon><Bell size={20} /></StatIcon>
          </StatHeader>
          <StatValue>{stats.unread}</StatValue>
          <StatChange positive={stats.unread > 0}>
            <TrendingUp size={12} />
            {stats.unread > 0 ? 'New activity' : 'All caught up'}
          </StatChange>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatTitle>Likes</StatTitle>
            <StatIcon><Heart size={20} /></StatIcon>
          </StatHeader>
          <StatValue>{stats.likes}</StatValue>
          <StatChange positive>
            <TrendingUp size={12} />
            +8% today
          </StatChange>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatTitle>Comments</StatTitle>
            <StatIcon><MessageCircle size={20} /></StatIcon>
          </StatHeader>
          <StatValue>{stats.comments}</StatValue>
          <StatChange positive>
            <TrendingUp size={12} />
            +15% today
          </StatChange>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatTitle>New Followers</StatTitle>
            <StatIcon><UserPlus size={20} /></StatIcon>
          </StatHeader>
          <StatValue>{stats.follows}</StatValue>
          <StatChange positive>
            <TrendingUp size={12} />
            +23% this week
          </StatChange>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatTitle>Subscriptions</StatTitle>
            <StatIcon><Star size={20} /></StatIcon>
          </StatHeader>
          <StatValue>{stats.subscriptions}</StatValue>
          <StatChange positive>
            <TrendingUp size={12} />
            +5% today
          </StatChange>
        </StatCard>
      </StatsGrid>

      <FilterTabs>
        <FilterTab 
          active={activeFilter === 'all'} 
          onClick={() => setActiveFilter('all')}
        >
          All ({stats.total})
        </FilterTab>
        <FilterTab 
          active={activeFilter === 'like'} 
          onClick={() => setActiveFilter('like')}
        >
          <Heart size={16} />
          Likes ({stats.likes})
        </FilterTab>
        <FilterTab 
          active={activeFilter === 'comment'} 
          onClick={() => setActiveFilter('comment')}
        >
          <MessageCircle size={16} />
          Comments ({stats.comments})
        </FilterTab>
        <FilterTab 
          active={activeFilter === 'follow'} 
          onClick={() => setActiveFilter('follow')}
        >
          <UserPlus size={16} />
          Follows ({stats.follows})
        </FilterTab>
        <FilterTab 
          active={activeFilter === 'subscription'} 
          onClick={() => setActiveFilter('subscription')}
        >
          <Star size={16} />
          Subscriptions ({stats.subscriptions})
        </FilterTab>
      </FilterTabs>

      {filteredNotifications.length === 0 ? (
        <EmptyState>
          <EmptyIcon>
            <Bell size={32} />
          </EmptyIcon>
          <EmptyTitle>No notifications found</EmptyTitle>
          <EmptyDescription>
            {searchQuery ? 'Try adjusting your search terms' : 'You\'re all caught up! New notifications will appear here.'}
          </EmptyDescription>
        </EmptyState>
      ) : (
        <NotificationsList>
          {filteredNotifications.map((notification) => (
            <NotificationCard key={notification.id} read={notification.read}>
              <NotificationHeader>
                <NotificationContent>
                  <NotificationIcon type={notification.type}>
                    {getIcon(notification.type)}
                  </NotificationIcon>
                  <NotificationText>
                    <NotificationTitle>{notification.title}</NotificationTitle>
                    <NotificationDescription>{notification.description}</NotificationDescription>
                    <NotificationTime>{formatTime(notification.time)}</NotificationTime>
                  </NotificationText>
                </NotificationContent>
                <MoreButton>
                  <MoreHorizontal size={18} />
                </MoreButton>
              </NotificationHeader>
              
              {!notification.read && (
                <NotificationActions>
                  <ActionButton primary onClick={() => markAsRead(notification.id)}>
                    <Check size={14} />
                    Mark as Read
                  </ActionButton>
                  <ActionButton>
                    <X size={14} />
                    Dismiss
                  </ActionButton>
                </NotificationActions>
              )}
            </NotificationCard>
          ))}
        </NotificationsList>
      )}
    </NotificationsContainer>
  );
};

export default NotificationsTab;
