import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  User, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Edit3,
  Trash2,
  Download,
  Eye,
  Heart,
  MessageCircle,
  Users,
  DollarSign,
  Calendar,
  Clock,
  Settings,
  Grid,
  List,
  SortAsc,
  SortDesc,
  X,
  Check,
  Camera,
  Video,
  Image,
  FileText,
  Mic,
  Globe,
  Lock,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  Award,
  Crown,
  Flame,
  TrendingDown,
  Minus,
  Info,
  AlertCircle,
  CheckCircle,
  Link,
  Mail,
  Phone,
  MapPin,
  Birthday,
  Star,
  Shield,
  Zap,
  Target,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  TrendingUp,
  Share2,
  ThumbsUp,
  Play,
  Pause,
  Volume2
} from 'lucide-react';
import { dashboardService } from '../services/dashboardService';
import { profileService } from '../services/profileService';
import { uploadService } from '../services/uploadService';

const ProfileContainer = styled.div`
  padding: 20px;
  max-width: 100%;
`;

const ProfileHeader = styled.div`
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

const ActionButton = styled.button`
  background: ${props => props.primary ? 'linear-gradient(135deg, #ff69b4 0%, #7a288a 100%)' : 'rgba(42, 42, 42, 0.8)'};
  border: 1px solid ${props => props.primary ? '#ff69b4' : '#444'};
  border-radius: 10px;
  padding: 12px 20px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 105, 180, 0.3);
  }
`;

const ViewToggle = styled.div`
  display: flex;
  background: rgba(42, 42, 42, 0.8);
  border: 1px solid #444;
  border-radius: 10px;
  overflow: hidden;
`;

const ViewButton = styled.button`
  background: ${props => props.active ? 'linear-gradient(135deg, #ff69b4 0%, #7a288a 100%)' : 'transparent'};
  border: none;
  padding: 10px 15px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.active ? 'linear-gradient(135deg, #ff69b4 0%, #7a288a 100%)' : 'rgba(255, 105, 180, 0.1)'};
  }
`;

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 30px;
  margin-bottom: 30px;
`;

const ProfileCard = styled.div`
  background: rgba(42, 42, 42, 0.6);
  border: 1px solid #444;
  border-radius: 15px;
  padding: 30px;
  transition: all 0.3s ease;

  &:hover {
    border-color: #ff69b4;
    transform: translateY(-2px);
  }
`;

const ProfileAvatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff69b4 0%, #7a288a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  font-weight: bold;
  margin: 0 auto 20px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 10px 25px rgba(255, 105, 180, 0.4);
  }
`;

const AvatarEdit = styled.div`
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 105, 180, 0.8);
  }
`;

const ProfileName = styled.h2`
  color: white;
  font-size: 1.8rem;
  font-weight: 700;
  text-align: center;
  margin: 0 0 10px 0;
`;

const ProfileHandle = styled.p`
  color: #ff69b4;
  font-size: 1.1rem;
  text-align: center;
  margin: 0 0 20px 0;
`;

const ProfileBio = styled.p`
  color: #ccc;
  font-size: 1rem;
  line-height: 1.5;
  text-align: center;
  margin: 0 0 20px 0;
`;

const ProfileStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 20px;
`;

const ProfileStat = styled.div`
  text-align: center;
  padding: 15px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
`;

const ProfileStatValue = styled.div`
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 5px;
`;

const ProfileStatLabel = styled.div`
  color: #888;
  font-size: 0.9rem;
`;

const ProfileActions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
`;

const ProfileActionButton = styled.button`
  background: transparent;
  border: 1px solid #444;
  border-radius: 10px;
  padding: 10px 15px;
  color: #ccc;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    border-color: #ff69b4;
    color: white;
    background: rgba(255, 105, 180, 0.1);
  }
`;

const SettingsCard = styled.div`
  background: rgba(42, 42, 42, 0.6);
  border: 1px solid #444;
  border-radius: 15px;
  padding: 30px;
  transition: all 0.3s ease;

  &:hover {
    border-color: #ff69b4;
    transform: translateY(-2px);
  }
`;

const SettingsTitle = styled.h3`
  color: white;
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SettingsSection = styled.div`
  margin-bottom: 25px;
`;

const SettingsSectionTitle = styled.h4`
  color: #ccc;
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 15px 0;
`;

const SettingsGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
`;

const SettingsItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
`;

const SettingsItemLabel = styled.div`
  color: #ccc;
  font-size: 0.9rem;
`;

const SettingsItemValue = styled.div`
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
`;

const SettingsToggle = styled.button`
  background: ${props => props.active ? 'linear-gradient(135deg, #ff69b4 0%, #7a288a 100%)' : 'rgba(42, 42, 42, 0.8)'};
  border: 1px solid ${props => props.active ? '#ff69b4' : '#444'};
  border-radius: 20px;
  padding: 5px 15px;
  color: white;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const LinksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const LinkCard = styled.div`
  background: rgba(42, 42, 42, 0.6);
  border: 1px solid #444;
  border-radius: 15px;
  padding: 20px;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    border-color: #ff69b4;
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  }
`;

const LinkHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
`;

const LinkInfo = styled.div`
  flex: 1;
`;

const LinkTitle = styled.h3`
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 5px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LinkDescription = styled.p`
  color: #ccc;
  font-size: 0.9rem;
  margin: 0 0 10px 0;
  line-height: 1.4;
`;

const LinkUrl = styled.p`
  color: #ff69b4;
  font-size: 0.9rem;
  margin: 0 0 10px 0;
  word-break: break-all;
`;

const LinkActions = styled.div`
  display: flex;
  gap: 5px;
`;

const LinkActionButton = styled.button`
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
  margin-bottom: 20px;
`;

const ProfileTab = () => {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const result = await dashboardService.getProfile();
      
      if (result.success) {
        setProfile(result.data || {});
      } else {
        // Use mock data for now
        const mockProfile = {
          id: '1',
          name: 'Sarah Johnson',
          handle: '@sarahfitness',
          email: 'sarah@example.com',
          bio: 'Fitness enthusiast and wellness coach. Helping people achieve their health goals through sustainable lifestyle changes.',
          avatar: 'SJ',
          location: 'Los Angeles, CA',
          birthday: '1990-05-15',
          phone: '+1 (555) 123-4567',
          website: 'https://sarahfitness.com',
          joinDate: '2023-01-15',
          stats: {
            followers: 12500,
            following: 850,
            posts: 245
          },
          settings: {
            profileVisibility: 'public',
            emailNotifications: true,
            pushNotifications: true,
            twoFactorAuth: false,
            dataSharing: false,
            marketingEmails: false
          },
          links: [
            {
              id: '1',
              title: 'Instagram',
              description: 'Follow me for daily fitness tips',
              url: 'https://instagram.com/sarahfitness',
              type: 'social'
            },
            {
              id: '2',
              title: 'YouTube',
              description: 'Workout videos and tutorials',
              url: 'https://youtube.com/sarahfitness',
              type: 'social'
            },
            {
              id: '3',
              title: 'Personal Website',
              description: 'My official website and blog',
              url: 'https://sarahfitness.com',
              type: 'website'
            },
            {
              id: '4',
              title: 'Patreon',
              description: 'Support my content creation',
              url: 'https://patreon.com/sarahfitness',
              type: 'support'
            }
          ]
        };
        setProfile(mockProfile);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLinkIcon = (type) => {
    switch (type) {
      case 'social': return <Users size={16} />;
      case 'website': return <Globe size={16} />;
      case 'support': return <Heart size={16} />;
      default: return <Link size={16} />;
    }
  };

  if (loading) {
    return (
      <ProfileContainer>
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
          Loading profile...
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer>
      <ProfileHeader>
        <HeaderTitle>
          <User size={28} />
          My Profile
        </HeaderTitle>
        <HeaderActions>
          <SearchBar>
            <SearchIcon>
              <Search size={18} />
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder="Search profile settings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchBar>
          <ViewToggle>
            <ViewButton 
              active={viewMode === 'grid'} 
              onClick={() => setViewMode('grid')}
            >
              <Grid size={16} />
            </ViewButton>
            <ViewButton 
              active={viewMode === 'list'} 
              onClick={() => setViewMode('list')}
            >
              <List size={16} />
            </ViewButton>
          </ViewToggle>
          <ActionButton primary onClick={() => setShowEditModal(true)}>
            <Edit3 size={16} />
            Edit Profile
          </ActionButton>
        </HeaderActions>
      </ProfileHeader>

      <ProfileGrid>
        <ProfileCard>
          <ProfileAvatar>
            {profile.avatar || 'U'}
            <AvatarEdit>
              <Camera size={16} />
            </AvatarEdit>
          </ProfileAvatar>
          
          <ProfileName>{profile.name || 'User'}</ProfileName>
          <ProfileHandle>{profile.handle || '@user'}</ProfileHandle>
          <ProfileBio>{profile.bio || 'No bio available'}</ProfileBio>
          
          <ProfileStats>
            <ProfileStat>
              <ProfileStatValue>{profile.stats?.followers?.toLocaleString() || '0'}</ProfileStatValue>
              <ProfileStatLabel>Followers</ProfileStatLabel>
            </ProfileStat>
            <ProfileStat>
              <ProfileStatValue>{profile.stats?.following?.toLocaleString() || '0'}</ProfileStatValue>
              <ProfileStatLabel>Following</ProfileStatLabel>
            </ProfileStat>
            <ProfileStat>
              <ProfileStatValue>{profile.stats?.posts?.toLocaleString() || '0'}</ProfileStatValue>
              <ProfileStatLabel>Posts</ProfileStatLabel>
            </ProfileStat>
          </ProfileStats>
          
          <ProfileActions>
            <ProfileActionButton>
              <Edit3 size={16} />
              Edit
            </ProfileActionButton>
            <ProfileActionButton>
              <Share2 size={16} />
              Share
            </ProfileActionButton>
          </ProfileActions>
        </ProfileCard>

        <SettingsCard>
          <SettingsTitle>
            <Settings size={20} />
            Profile Settings
          </SettingsTitle>
          
          <SettingsSection>
            <SettingsSectionTitle>Privacy & Security</SettingsSectionTitle>
            <SettingsGroup>
              <SettingsItem>
                <SettingsItemLabel>Profile Visibility</SettingsItemLabel>
                <SettingsToggle active={profile.settings?.profileVisibility === 'public'}>
                  {profile.settings?.profileVisibility || 'private'}
                </SettingsToggle>
              </SettingsItem>
              <SettingsItem>
                <SettingsItemLabel>Two-Factor Authentication</SettingsItemLabel>
                <SettingsToggle active={profile.settings?.twoFactorAuth}>
                  {profile.settings?.twoFactorAuth ? 'Enabled' : 'Disabled'}
                </SettingsToggle>
              </SettingsItem>
              <SettingsItem>
                <SettingsItemLabel>Data Sharing</SettingsItemLabel>
                <SettingsToggle active={profile.settings?.dataSharing}>
                  {profile.settings?.dataSharing ? 'Enabled' : 'Disabled'}
                </SettingsToggle>
              </SettingsItem>
            </SettingsGroup>
          </SettingsSection>

          <SettingsSection>
            <SettingsSectionTitle>Notifications</SettingsSectionTitle>
            <SettingsGroup>
              <SettingsItem>
                <SettingsItemLabel>Email Notifications</SettingsItemLabel>
                <SettingsToggle active={profile.settings?.emailNotifications}>
                  {profile.settings?.emailNotifications ? 'Enabled' : 'Disabled'}
                </SettingsToggle>
              </SettingsItem>
              <SettingsItem>
                <SettingsItemLabel>Push Notifications</SettingsItemLabel>
                <SettingsToggle active={profile.settings?.pushNotifications}>
                  {profile.settings?.pushNotifications ? 'Enabled' : 'Disabled'}
                </SettingsToggle>
              </SettingsItem>
              <SettingsItem>
                <SettingsItemLabel>Marketing Emails</SettingsItemLabel>
                <SettingsToggle active={profile.settings?.marketingEmails}>
                  {profile.settings?.marketingEmails ? 'Enabled' : 'Disabled'}
                </SettingsToggle>
              </SettingsItem>
            </SettingsGroup>
          </SettingsSection>

          <SettingsSection>
            <SettingsSectionTitle>Account Information</SettingsSectionTitle>
            <SettingsGroup>
              <SettingsItem>
                <SettingsItemLabel>Email</SettingsItemLabel>
                <SettingsItemValue>{profile.email || 'Not provided'}</SettingsItemValue>
              </SettingsItem>
              <SettingsItem>
                <SettingsItemLabel>Phone</SettingsItemLabel>
                <SettingsItemValue>{profile.phone || 'Not provided'}</SettingsItemValue>
              </SettingsItem>
              <SettingsItem>
                <SettingsItemLabel>Location</SettingsItemLabel>
                <SettingsItemValue>{profile.location || 'Not provided'}</SettingsItemValue>
              </SettingsItem>
              <SettingsItem>
                <SettingsItemLabel>Website</SettingsItemLabel>
                <SettingsItemValue>{profile.website || 'Not provided'}</SettingsItemValue>
              </SettingsItem>
              <SettingsItem>
                <SettingsItemLabel>Member Since</SettingsItemLabel>
                <SettingsItemValue>{profile.joinDate ? new Date(profile.joinDate).toLocaleDateString() : 'Unknown'}</SettingsItemValue>
              </SettingsItem>
            </SettingsGroup>
          </SettingsSection>
        </SettingsCard>
      </ProfileGrid>

      <SettingsTitle>
        <Link size={20} />
        External Links
      </SettingsTitle>

      {profile.links && profile.links.length > 0 ? (
        <LinksGrid>
          {profile.links.map((link) => (
            <LinkCard key={link.id}>
              <LinkHeader>
                <LinkInfo>
                  <LinkTitle>
                    {getLinkIcon(link.type)}
                    {link.title}
                  </LinkTitle>
                  <LinkDescription>{link.description}</LinkDescription>
                  <LinkUrl>{link.url}</LinkUrl>
                </LinkInfo>
                <LinkActions>
                  <LinkActionButton title="Edit Link">
                    <Edit3 size={16} />
                  </LinkActionButton>
                  <LinkActionButton title="Delete Link">
                    <Trash2 size={16} />
                  </LinkActionButton>
                </LinkActions>
              </LinkHeader>
            </LinkCard>
          ))}
        </LinksGrid>
      ) : (
        <EmptyState>
          <EmptyIcon>
            <Link size={32} />
          </EmptyIcon>
          <EmptyTitle>No external links</EmptyTitle>
          <EmptyDescription>
            Add links to your social media profiles, website, and other platforms to help your audience find you elsewhere.
          </EmptyDescription>
          <ActionButton primary>
            <Plus size={16} />
            Add Link
          </ActionButton>
        </EmptyState>
      )}
    </ProfileContainer>
  );
};

export default ProfileTab;
