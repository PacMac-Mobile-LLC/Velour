import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  Calendar, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Edit3,
  Trash2,
  Play,
  Pause,
  Clock,
  Users,
  Eye,
  Heart,
  MessageCircle,
  Settings,
  Grid,
  List,
  SortAsc,
  SortDesc,
  X,
  Check,
  Video,
  Image,
  FileText,
  Mic,
  Camera,
  Globe,
  Lock,
  Star,
  AlertCircle,
  CheckCircle,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  User,
  DollarSign,
  BarChart3
} from 'lucide-react';
import { dashboardService } from '../services/dashboardService';

const QueueContainer = styled.div`
  padding: 20px;
  max-width: 100%;
`;

const QueueHeader = styled.div`
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

const QueueGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const QueueCard = styled.div`
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

const QueueCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
`;

const QueueInfo = styled.div`
  flex: 1;
`;

const QueueTitle = styled.h3`
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 5px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const QueueDescription = styled.p`
  color: #ccc;
  font-size: 0.9rem;
  margin: 0 0 10px 0;
  line-height: 1.4;
`;

const QueueMeta = styled.div`
  display: flex;
  gap: 15px;
  color: #888;
  font-size: 0.8rem;
  margin-bottom: 15px;
`;

const QueueActions = styled.div`
  display: flex;
  gap: 5px;
`;

const QueueActionButton = styled.button`
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

const QueueStatus = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;
  background: ${props => {
    switch(props.status) {
      case 'scheduled': return 'rgba(59, 130, 246, 0.2)';
      case 'live': return 'rgba(34, 197, 94, 0.2)';
      case 'completed': return 'rgba(107, 114, 128, 0.2)';
      case 'cancelled': return 'rgba(239, 68, 68, 0.2)';
      default: return 'rgba(107, 114, 128, 0.2)';
    }
  }};
  color: ${props => {
    switch(props.status) {
      case 'scheduled': return '#60a5fa';
      case 'live': return '#4ade80';
      case 'completed': return '#9ca3af';
      case 'cancelled': return '#f87171';
      default: return '#9ca3af';
    }
  }};
  border: 1px solid ${props => {
    switch(props.status) {
      case 'scheduled': return '#3b82f6';
      case 'live': return '#22c55e';
      case 'completed': return '#6b7280';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  }};
`;

const QueueDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-top: 15px;
`;

const QueueDetail = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ccc;
  font-size: 0.9rem;
`;

const QueueDetailIcon = styled.div`
  color: #ff69b4;
  display: flex;
  align-items: center;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  backdrop-filter: blur(10px);
`;

const ModalContent = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  border: 2px solid #ff69b4;
  border-radius: 20px;
  padding: 30px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ModalTitle = styled.h2`
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
`;

const CloseButton = styled.button`
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

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  color: white;
  font-weight: 600;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  background: rgba(42, 42, 42, 0.8);
  border: 1px solid #444;
  border-radius: 10px;
  padding: 12px 15px;
  color: white;
  font-size: 1rem;
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

const Textarea = styled.textarea`
  width: 100%;
  background: rgba(42, 42, 42, 0.8);
  border: 1px solid #444;
  border-radius: 10px;
  padding: 12px 15px;
  color: white;
  font-size: 1rem;
  outline: none;
  resize: vertical;
  min-height: 80px;
  transition: all 0.3s ease;

  &:focus {
    border-color: #ff69b4;
    box-shadow: 0 0 0 3px rgba(255, 105, 180, 0.2);
  }

  &::placeholder {
    color: #888;
  }
`;

const Select = styled.select`
  width: 100%;
  background: rgba(42, 42, 42, 0.8);
  border: 1px solid #444;
  border-radius: 10px;
  padding: 12px 15px;
  color: white;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: #ff69b4;
    box-shadow: 0 0 0 3px rgba(255, 105, 180, 0.2);
  }

  option {
    background: #2a2a2a;
    color: white;
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 30px;
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

const QueueTab = () => {
  const [queueItems, setQueueItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    type: 'live',
    scheduledDate: '',
    scheduledTime: '',
    duration: 60,
    isPrivate: false,
    price: 0
  });

  useEffect(() => {
    loadQueueItems();
  }, []);

  const loadQueueItems = async () => {
    try {
      setLoading(true);
      const result = await dashboardService.getQueue();
      
      if (result.success) {
        setQueueItems(result.data || []);
      } else {
        // Use mock data for now
        const mockQueueItems = [
          {
            id: '1',
            title: 'Morning Yoga Session',
            description: 'Start your day with a relaxing 30-minute yoga flow',
            type: 'live',
            status: 'scheduled',
            scheduledDate: '2024-01-25',
            scheduledTime: '08:00',
            duration: 30,
            isPrivate: false,
            price: 0,
            expectedViewers: 45,
            createdAt: '2024-01-20'
          },
          {
            id: '2',
            title: 'Fitness Q&A Live',
            description: 'Ask me anything about fitness and nutrition',
            type: 'live',
            status: 'scheduled',
            scheduledDate: '2024-01-26',
            scheduledTime: '19:00',
            duration: 60,
            isPrivate: false,
            price: 0,
            expectedViewers: 120,
            createdAt: '2024-01-21'
          },
          {
            id: '3',
            title: 'Exclusive Workout Video',
            description: 'Premium workout routine for subscribers only',
            type: 'video',
            status: 'scheduled',
            scheduledDate: '2024-01-27',
            scheduledTime: '10:00',
            duration: 45,
            isPrivate: true,
            price: 15,
            expectedViewers: 25,
            createdAt: '2024-01-22'
          },
          {
            id: '4',
            title: 'Cooking Class Live',
            description: 'Learn to make healthy protein smoothies',
            type: 'live',
            status: 'live',
            scheduledDate: '2024-01-24',
            scheduledTime: '18:00',
            duration: 90,
            isPrivate: false,
            price: 0,
            expectedViewers: 85,
            createdAt: '2024-01-23'
          },
          {
            id: '5',
            title: 'Photo Gallery Release',
            description: 'New beach photos from my recent vacation',
            type: 'gallery',
            status: 'completed',
            scheduledDate: '2024-01-23',
            scheduledTime: '14:00',
            duration: 0,
            isPrivate: true,
            price: 10,
            expectedViewers: 35,
            createdAt: '2024-01-22'
          },
          {
            id: '6',
            title: 'Podcast Episode',
            description: 'Weekly podcast about fitness motivation',
            type: 'audio',
            status: 'scheduled',
            scheduledDate: '2024-01-28',
            scheduledTime: '12:00',
            duration: 30,
            isPrivate: false,
            price: 0,
            expectedViewers: 60,
            createdAt: '2024-01-23'
          }
        ];
        setQueueItems(mockQueueItems);
      }
    } catch (error) {
      console.error('Error loading queue items:', error);
    } finally {
      setLoading(false);
    }
  };

  const createQueueItem = async () => {
    try {
      const result = await dashboardService.createQueueItem(newItem);

      if (result.success) {
        const item = {
          id: Date.now().toString(),
          ...newItem,
          status: 'scheduled',
          expectedViewers: 0,
          createdAt: new Date().toISOString().split('T')[0]
        };
        setQueueItems(prev => [item, ...prev]);
        setNewItem({
          title: '',
          description: '',
          type: 'live',
          scheduledDate: '',
          scheduledTime: '',
          duration: 60,
          isPrivate: false,
          price: 0
        });
        setShowCreateModal(false);
      } else {
        // Add optimistically for demo
        const item = {
          id: Date.now().toString(),
          ...newItem,
          status: 'scheduled',
          expectedViewers: 0,
          createdAt: new Date().toISOString().split('T')[0]
        };
        setQueueItems(prev => [item, ...prev]);
        setNewItem({
          title: '',
          description: '',
          type: 'live',
          scheduledDate: '',
          scheduledTime: '',
          duration: 60,
          isPrivate: false,
          price: 0
        });
        setShowCreateModal(false);
      }
    } catch (error) {
      console.error('Error creating queue item:', error);
    }
  };

  const deleteQueueItem = async (itemId) => {
    try {
      // In a real app, call API to delete
      setQueueItems(prev => prev.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error deleting queue item:', error);
    }
  };

  const getFilteredQueueItems = () => {
    let filtered = queueItems;

    if (activeFilter !== 'all') {
      filtered = filtered.filter(item => item.status === activeFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'live': return <Video size={16} />;
      case 'video': return <Video size={16} />;
      case 'gallery': return <Image size={16} />;
      case 'audio': return <Mic size={16} />;
      default: return <Calendar size={16} />;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'scheduled': return <Clock size={12} />;
      case 'live': return <Play size={12} />;
      case 'completed': return <CheckCircle size={12} />;
      case 'cancelled': return <X size={12} />;
      default: return <Clock size={12} />;
    }
  };

  const stats = {
    totalItems: queueItems.length,
    scheduledItems: queueItems.filter(item => item.status === 'scheduled').length,
    liveItems: queueItems.filter(item => item.status === 'live').length,
    completedItems: queueItems.filter(item => item.status === 'completed').length
  };

  if (loading) {
    return (
      <QueueContainer>
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
          Loading queue items...
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </QueueContainer>
    );
  }

  const filteredItems = getFilteredQueueItems();

  return (
    <QueueContainer>
      <QueueHeader>
        <HeaderTitle>
          <Calendar size={28} />
          Queue
        </HeaderTitle>
        <HeaderActions>
          <SearchBar>
            <SearchIcon>
              <Search size={18} />
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder="Search queue items..."
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
          <ActionButton primary onClick={() => setShowCreateModal(true)}>
            <Plus size={16} />
            Schedule Content
          </ActionButton>
        </HeaderActions>
      </QueueHeader>

      <StatsGrid>
        <StatCard>
          <StatHeader>
            <StatTitle>Total Scheduled</StatTitle>
            <StatIcon><Calendar size={20} /></StatIcon>
          </StatHeader>
          <StatValue>{stats.totalItems}</StatValue>
          <StatChange positive>
            <Plus size={12} />
            +3 this week
          </StatChange>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatTitle>Upcoming</StatTitle>
            <StatIcon><Clock size={20} /></StatIcon>
          </StatHeader>
          <StatValue>{stats.scheduledItems}</StatValue>
          <StatChange positive>
            <Plus size={12} />
            +2 this week
          </StatChange>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatTitle>Live Now</StatTitle>
            <StatIcon><Play size={20} /></StatIcon>
          </StatHeader>
          <StatValue>{stats.liveItems}</StatValue>
          <StatChange positive>
            <Plus size={12} />
            +1 today
          </StatChange>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatTitle>Completed</StatTitle>
            <StatIcon><CheckCircle size={20} /></StatIcon>
          </StatHeader>
          <StatValue>{stats.completedItems}</StatValue>
          <StatChange positive>
            <Plus size={12} />
            +5 this week
          </StatChange>
        </StatCard>
      </StatsGrid>

      <FilterTabs>
        <FilterTab 
          active={activeFilter === 'all'} 
          onClick={() => setActiveFilter('all')}
        >
          All ({queueItems.length})
        </FilterTab>
        <FilterTab 
          active={activeFilter === 'scheduled'} 
          onClick={() => setActiveFilter('scheduled')}
        >
          <Clock size={16} />
          Scheduled ({stats.scheduledItems})
        </FilterTab>
        <FilterTab 
          active={activeFilter === 'live'} 
          onClick={() => setActiveFilter('live')}
        >
          <Play size={16} />
          Live ({stats.liveItems})
        </FilterTab>
        <FilterTab 
          active={activeFilter === 'completed'} 
          onClick={() => setActiveFilter('completed')}
        >
          <CheckCircle size={16} />
          Completed ({stats.completedItems})
        </FilterTab>
      </FilterTabs>

      {filteredItems.length === 0 ? (
        <EmptyState>
          <EmptyIcon>
            <Calendar size={32} />
          </EmptyIcon>
          <EmptyTitle>No queue items found</EmptyTitle>
          <EmptyDescription>
            {searchQuery ? 'Try adjusting your search terms' : 'Schedule your first live session or content release!'}
          </EmptyDescription>
          {!searchQuery && (
            <ActionButton primary onClick={() => setShowCreateModal(true)}>
              <Plus size={16} />
              Schedule Content
            </ActionButton>
          )}
        </EmptyState>
      ) : (
        <QueueGrid>
          {filteredItems.map((item) => (
            <QueueCard key={item.id}>
              <QueueStatus status={item.status}>
                {getStatusIcon(item.status)}
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </QueueStatus>
              
              <QueueCardHeader>
                <QueueInfo>
                  <QueueTitle>
                    {getTypeIcon(item.type)}
                    {item.title}
                  </QueueTitle>
                  <QueueDescription>{item.description}</QueueDescription>
                  <QueueMeta>
                    <span>{new Date(item.scheduledDate).toLocaleDateString()}</span>
                    <span>{item.scheduledTime}</span>
                    <span>{item.duration}min</span>
                  </QueueMeta>
                </QueueInfo>
                <QueueActions>
                  <QueueActionButton onClick={() => setEditingItem(item)}>
                    <Edit3 size={16} />
                  </QueueActionButton>
                  <QueueActionButton onClick={() => deleteQueueItem(item.id)}>
                    <Trash2 size={16} />
                  </QueueActionButton>
                </QueueActions>
              </QueueCardHeader>
              
              <QueueDetails>
                <QueueDetail>
                  <QueueDetailIcon>
                    <Users size={16} />
                  </QueueDetailIcon>
                  {item.expectedViewers} expected viewers
                </QueueDetail>
                <QueueDetail>
                  <QueueDetailIcon>
                    {item.isPrivate ? <Lock size={16} /> : <Globe size={16} />}
                  </QueueDetailIcon>
                  {item.isPrivate ? 'Private' : 'Public'}
                </QueueDetail>
                <QueueDetail>
                  <QueueDetailIcon>
                    <DollarSign size={16} />
                  </QueueDetailIcon>
                  ${item.price} {item.price > 0 ? 'per view' : 'free'}
                </QueueDetail>
                <QueueDetail>
                  <QueueDetailIcon>
                    <BarChart3 size={16} />
                  </QueueDetailIcon>
                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                </QueueDetail>
              </QueueDetails>
            </QueueCard>
          ))}
        </QueueGrid>
      )}

      {showCreateModal && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Schedule New Content</ModalTitle>
              <CloseButton onClick={() => setShowCreateModal(false)}>
                <X size={20} />
              </CloseButton>
            </ModalHeader>

            <FormGroup>
              <Label>Content Title</Label>
              <Input
                type="text"
                placeholder="Enter content title..."
                value={newItem.title}
                onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
              />
            </FormGroup>

            <FormGroup>
              <Label>Description</Label>
              <Textarea
                placeholder="Describe your content..."
                value={newItem.description}
                onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
              />
            </FormGroup>

            <FormGroup>
              <Label>Content Type</Label>
              <Select
                value={newItem.type}
                onChange={(e) => setNewItem(prev => ({ ...prev, type: e.target.value }))}
              >
                <option value="live">Live Stream</option>
                <option value="video">Video</option>
                <option value="gallery">Photo Gallery</option>
                <option value="audio">Audio/Podcast</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Scheduled Date</Label>
              <Input
                type="date"
                value={newItem.scheduledDate}
                onChange={(e) => setNewItem(prev => ({ ...prev, scheduledDate: e.target.value }))}
              />
            </FormGroup>

            <FormGroup>
              <Label>Scheduled Time</Label>
              <Input
                type="time"
                value={newItem.scheduledTime}
                onChange={(e) => setNewItem(prev => ({ ...prev, scheduledTime: e.target.value }))}
              />
            </FormGroup>

            <FormGroup>
              <Label>Duration (minutes)</Label>
              <Input
                type="number"
                placeholder="60"
                value={newItem.duration}
                onChange={(e) => setNewItem(prev => ({ ...prev, duration: parseInt(e.target.value) || 60 }))}
              />
            </FormGroup>

            <FormGroup>
              <Label>Price (USD)</Label>
              <Input
                type="number"
                placeholder="0"
                value={newItem.price}
                onChange={(e) => setNewItem(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
              />
            </FormGroup>

            <ModalActions>
              <ActionButton onClick={() => setShowCreateModal(false)}>
                Cancel
              </ActionButton>
              <ActionButton primary onClick={createQueueItem}>
                <Check size={16} />
                Schedule Content
              </ActionButton>
            </ModalActions>
          </ModalContent>
        </Modal>
      )}
    </QueueContainer>
  );
};

export default QueueTab;
