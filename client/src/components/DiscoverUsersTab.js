import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  Search, 
  Users, 
  UserPlus, 
  UserCheck, 
  Star, 
  MessageCircle,
  Phone,
  Video,
  Filter,
  MoreHorizontal,
  Heart,
  Eye,
  Calendar
} from 'lucide-react';
import { dashboardService } from '../services/dashboardService';

const DiscoverContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #000;
  color: white;
`;

const Header = styled.div`
  padding: 20px 30px;
  border-bottom: 1px solid #333;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
`;

const HeaderTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 10px 0;
  background: linear-gradient(135deg, #ff69b4 0%, #7a288a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const HeaderSubtitle = styled.p`
  color: #ccc;
  margin: 0;
  font-size: 1rem;
`;

const SearchSection = styled.div`
  padding: 20px 30px;
  background: rgba(42, 42, 42, 0.6);
  border-bottom: 1px solid #333;
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 12px 20px;
  background: rgba(20, 20, 20, 0.8);
  border: 1px solid #444;
  border-radius: 25px;
  color: white;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #ff69b4;
    box-shadow: 0 0 0 3px rgba(255, 105, 180, 0.1);
  }
  
  &::placeholder {
    color: #888;
  }
`;

const FilterButton = styled.button`
  padding: 12px 20px;
  background: rgba(255, 105, 180, 0.1);
  border: 1px solid rgba(255, 105, 180, 0.3);
  border-radius: 25px;
  color: #ff69b4;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 105, 180, 0.2);
    border-color: #ff69b4;
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
`;

const StatCard = styled.div`
  background: rgba(20, 20, 20, 0.8);
  border: 1px solid #444;
  border-radius: 15px;
  padding: 20px;
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #ff69b4;
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  color: #ccc;
  font-size: 0.9rem;
`;

const UsersGrid = styled.div`
  flex: 1;
  padding: 20px 30px;
  overflow-y: auto;
`;

const UsersList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const UserCard = styled.div`
  background: rgba(42, 42, 42, 0.6);
  border: 1px solid #444;
  border-radius: 15px;
  padding: 20px;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    border-color: #ff69b4;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 105, 180, 0.1);
  }
`;

const UserHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
`;

const UserAvatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff69b4 0%, #7a288a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  position: relative;
`;

const OnlineIndicator = styled.div`
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: ${props => props.online ? '#4ade80' : '#6b7280'};
  border: 2px solid #000;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h3`
  margin: 0 0 5px 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const UserHandle = styled.p`
  margin: 0;
  color: #888;
  font-size: 0.9rem;
`;

const UserStats = styled.div`
  display: flex;
  gap: 15px;
  margin: 10px 0;
  font-size: 0.8rem;
  color: #ccc;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const UserBio = styled.p`
  color: #ccc;
  font-size: 0.9rem;
  line-height: 1.4;
  margin: 10px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const UserActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 10px 15px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 0.9rem;
  
  &.primary {
    background: linear-gradient(135deg, #ff69b4 0%, #7a288a 100%);
    color: white;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 15px rgba(255, 105, 180, 0.3);
    }
  }
  
  &.secondary {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.2);
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
  
  &.success {
    background: rgba(34, 197, 94, 0.1);
    color: #22c55e;
    border: 1px solid rgba(34, 197, 94, 0.3);
    
    &:hover {
      background: rgba(34, 197, 94, 0.2);
    }
  }
`;

const QuickActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 10px;
`;

const QuickActionButton = styled.button`
  padding: 8px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: rgba(255, 105, 180, 0.2);
    border-color: #ff69b4;
    color: #ff69b4;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #ccc;
  font-size: 1.1rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #888;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.5;
`;

const EmptyTitle = styled.h3`
  font-size: 1.5rem;
  margin: 0 0 10px 0;
  color: #ccc;
`;

const EmptyDescription = styled.p`
  margin: 0;
  font-size: 1rem;
  line-height: 1.5;
`;

const DiscoverUsersTab = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(new Set());
  const [stats, setStats] = useState({
    totalUsers: 0,
    onlineUsers: 0,
    newUsers: 0
  });

  // Mock users for testing - replace with real API calls
  const mockUsers = [
    {
      id: 'user1',
      name: 'Sarah Johnson',
      handle: '@sarahj',
      bio: 'Content creator and fitness enthusiast. Love sharing my journey with amazing people! 💪✨',
      avatar: 'S',
      online: true,
      followers: 1250,
      following: 340,
      posts: 89,
      verified: true,
      joinedDate: '2024-01-15'
    },
    {
      id: 'user2',
      name: 'Mike Chen',
      handle: '@mikechen',
      bio: 'Photographer and travel blogger. Capturing moments that matter 📸🌍',
      avatar: 'M',
      online: false,
      followers: 890,
      following: 156,
      posts: 45,
      verified: false,
      joinedDate: '2024-02-20'
    },
    {
      id: 'user3',
      name: 'Emma Wilson',
      handle: '@emmaw',
      bio: 'Artist and creative soul. Expressing life through colors and emotions 🎨💫',
      avatar: 'E',
      online: true,
      followers: 2100,
      following: 420,
      posts: 156,
      verified: true,
      joinedDate: '2023-11-08'
    },
    {
      id: 'user4',
      name: 'Alex Rodriguez',
      handle: '@alexr',
      bio: 'Tech enthusiast and developer. Building the future one line of code at a time 💻🚀',
      avatar: 'A',
      online: false,
      followers: 670,
      following: 89,
      posts: 23,
      verified: false,
      joinedDate: '2024-03-10'
    },
    {
      id: 'user5',
      name: 'Luna Martinez',
      handle: '@lunam',
      bio: 'Yoga instructor and wellness coach. Helping others find their inner peace 🧘‍♀️🌸',
      avatar: 'L',
      online: true,
      followers: 1800,
      following: 290,
      posts: 78,
      verified: true,
      joinedDate: '2023-09-22'
    },
    {
      id: 'user6',
      name: 'David Kim',
      handle: '@davidk',
      bio: 'Musician and producer. Creating beats that move your soul 🎵🎶',
      avatar: 'D',
      online: false,
      followers: 1450,
      following: 180,
      posts: 67,
      verified: false,
      joinedDate: '2024-01-05'
    }
  ];

  useEffect(() => {
    loadUsers();
    loadStats();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For now, use mock data
      setUsers(mockUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      // Mock stats - replace with real API call
      setStats({
        totalUsers: 1247,
        onlineUsers: 89,
        newUsers: 23
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleFollow = async (userId) => {
    try {
      // Toggle follow status
      const newFollowing = new Set(following);
      if (newFollowing.has(userId)) {
        newFollowing.delete(userId);
      } else {
        newFollowing.add(userId);
      }
      setFollowing(newFollowing);
      
      // Here you would make an API call to follow/unfollow
      // await dashboardService.followUser(userId);
      
      console.log(`Toggled follow for user ${userId}`);
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleMessage = (userId) => {
    // Navigate to messages with this user
    console.log(`Starting conversation with user ${userId}`);
    // You could dispatch an action to open messages with this user
  };

  const handleVideoCall = (userId) => {
    // Start video call with this user
    console.log(`Starting video call with user ${userId}`);
    // Create a room and navigate to it
    const roomId = `video-${userId}-${Date.now()}`;
    window.open(`/room/${roomId}`, '_blank');
  };

  const handleVoiceCall = (userId) => {
    // Start voice call with this user
    console.log(`Starting voice call with user ${userId}`);
    // Create a room and navigate to it
    const roomId = `voice-${userId}-${Date.now()}`;
    window.open(`/room/${roomId}?mode=voice`, '_blank');
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.bio.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <DiscoverContainer>
        <Header>
          <HeaderTitle>Discover Users</HeaderTitle>
          <HeaderSubtitle>Find and connect with amazing creators</HeaderSubtitle>
        </Header>
        <LoadingContainer>
          <div>Loading users...</div>
        </LoadingContainer>
      </DiscoverContainer>
    );
  }

  return (
    <DiscoverContainer>
      <Header>
        <HeaderTitle>Discover Users</HeaderTitle>
        <HeaderSubtitle>Find and connect with amazing creators</HeaderSubtitle>
      </Header>

      <SearchSection>
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Search users by name, handle, or bio..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FilterButton>
            <Filter size={16} />
            Filter
          </FilterButton>
        </SearchContainer>

        <StatsContainer>
          <StatCard>
            <StatNumber>{stats.totalUsers.toLocaleString()}</StatNumber>
            <StatLabel>Total Users</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{stats.onlineUsers}</StatNumber>
            <StatLabel>Online Now</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{stats.newUsers}</StatNumber>
            <StatLabel>New This Week</StatLabel>
          </StatCard>
        </StatsContainer>
      </SearchSection>

      <UsersGrid>
        {filteredUsers.length === 0 ? (
          <EmptyState>
            <EmptyIcon>👥</EmptyIcon>
            <EmptyTitle>No users found</EmptyTitle>
            <EmptyDescription>
              Try adjusting your search terms or check back later for new users.
            </EmptyDescription>
          </EmptyState>
        ) : (
          <UsersList>
            {filteredUsers.map((user) => (
              <UserCard key={user.id}>
                <UserHeader>
                  <UserAvatar>
                    {user.avatar}
                    <OnlineIndicator online={user.online} />
                  </UserAvatar>
                  <UserInfo>
                    <UserName>
                      {user.name}
                      {user.verified && <span style={{ color: '#ff69b4' }}>✓</span>}
                    </UserName>
                    <UserHandle>{user.handle}</UserHandle>
                  </UserInfo>
                </UserHeader>

                <UserStats>
                  <StatItem>
                    <Heart size={12} />
                    {user.followers.toLocaleString()}
                  </StatItem>
                  <StatItem>
                    <Users size={12} />
                    {user.following}
                  </StatItem>
                  <StatItem>
                    <Eye size={12} />
                    {user.posts}
                  </StatItem>
                </UserStats>

                <UserBio>{user.bio}</UserBio>

                <UserActions>
                  <ActionButton
                    className={following.has(user.id) ? 'success' : 'primary'}
                    onClick={() => handleFollow(user.id)}
                  >
                    {following.has(user.id) ? (
                      <>
                        <UserCheck size={16} />
                        Following
                      </>
                    ) : (
                      <>
                        <UserPlus size={16} />
                        Follow
                      </>
                    )}
                  </ActionButton>
                  <ActionButton
                    className="secondary"
                    onClick={() => handleMessage(user.id)}
                  >
                    <MessageCircle size={16} />
                    Message
                  </ActionButton>
                </UserActions>

                <QuickActions>
                  <QuickActionButton
                    onClick={() => handleVoiceCall(user.id)}
                    title="Voice Call"
                  >
                    <Phone size={16} />
                  </QuickActionButton>
                  <QuickActionButton
                    onClick={() => handleVideoCall(user.id)}
                    title="Video Call"
                  >
                    <Video size={16} />
                  </QuickActionButton>
                  <QuickActionButton title="More Options">
                    <MoreHorizontal size={16} />
                  </QuickActionButton>
                </QuickActions>
              </UserCard>
            ))}
          </UsersList>
        )}
      </UsersGrid>
    </DiscoverContainer>
  );
};

export default DiscoverUsersTab;
