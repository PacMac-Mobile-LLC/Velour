import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  TrendingUp, 
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
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Target,
  Zap,
  Star,
  ThumbsUp,
  Share2,
  Play,
  Pause,
  Volume2,
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
  CheckCircle
} from 'lucide-react';
import { dashboardService } from '../services/dashboardService';

const StatisticsContainer = styled.div`
  padding: 20px;
  max-width: 100%;
`;

const StatisticsHeader = styled.div`
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

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const ChartCard = styled.div`
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

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ChartTitle = styled.h3`
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ChartContent = styled.div`
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  color: #888;
  font-size: 0.9rem;
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

const PerformanceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const PerformanceCard = styled.div`
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

const PerformanceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
`;

const PerformanceInfo = styled.div`
  flex: 1;
`;

const PerformanceTitle = styled.h3`
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 5px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PerformanceDescription = styled.p`
  color: #ccc;
  font-size: 0.9rem;
  margin: 0 0 10px 0;
  line-height: 1.4;
`;

const PerformanceMeta = styled.div`
  display: flex;
  gap: 15px;
  color: #888;
  font-size: 0.8rem;
  margin-bottom: 15px;
`;

const PerformanceActions = styled.div`
  display: flex;
  gap: 5px;
`;

const PerformanceActionButton = styled.button`
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

const PerformanceStatus = styled.div`
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
      case 'trending': return 'rgba(34, 197, 94, 0.2)';
      case 'stable': return 'rgba(59, 130, 246, 0.2)';
      case 'declining': return 'rgba(239, 68, 68, 0.2)';
      default: return 'rgba(107, 114, 128, 0.2)';
    }
  }};
  color: ${props => {
    switch(props.status) {
      case 'trending': return '#4ade80';
      case 'stable': return '#60a5fa';
      case 'declining': return '#f87171';
      default: return '#9ca3af';
    }
  }};
  border: 1px solid ${props => {
    switch(props.status) {
      case 'trending': return '#22c55e';
      case 'stable': return '#3b82f6';
      case 'declining': return '#ef4444';
      default: return '#6b7280';
    }
  }};
`;

const PerformanceDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-top: 15px;
`;

const PerformanceDetail = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ccc;
  font-size: 0.9rem;
`;

const PerformanceDetailIcon = styled.div`
  color: #ff69b4;
  display: flex;
  align-items: center;
`;

const PerformanceValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.positive ? '#22c55e' : '#ef4444'};
  margin-bottom: 10px;
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

const StatisticsTab = () => {
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const result = await dashboardService.getAnalytics();
      
      if (result.success) {
        setAnalytics(result.data || {});
      } else {
        // Use mock data for now
        const mockAnalytics = {
          overview: {
            totalViews: 125000,
            totalLikes: 8900,
            totalComments: 1200,
            totalShares: 450,
            totalSubscribers: 1250,
            totalEarnings: 12500.75,
            engagementRate: 7.2,
            growthRate: 15.8
          },
          performance: [
            {
              id: '1',
              title: 'Morning Yoga Session',
              type: 'live',
              status: 'trending',
              views: 2500,
              likes: 180,
              comments: 45,
              shares: 12,
              earnings: 125.50,
              engagementRate: 8.5,
              date: '2024-01-24'
            },
            {
              id: '2',
              title: 'Fitness Q&A Live',
              type: 'live',
              status: 'trending',
              views: 3200,
              likes: 220,
              comments: 67,
              shares: 18,
              earnings: 180.25,
              engagementRate: 9.2,
              date: '2024-01-23'
            },
            {
              id: '3',
              title: 'Exclusive Workout Video',
              type: 'video',
              status: 'stable',
              views: 1200,
              likes: 95,
              comments: 23,
              shares: 8,
              earnings: 75.00,
              engagementRate: 6.8,
              date: '2024-01-22'
            },
            {
              id: '4',
              title: 'Cooking Class Live',
              type: 'live',
              status: 'trending',
              views: 1800,
              likes: 140,
              comments: 34,
              shares: 15,
              earnings: 95.75,
              engagementRate: 7.9,
              date: '2024-01-21'
            },
            {
              id: '5',
              title: 'Photo Gallery Release',
              type: 'gallery',
              status: 'stable',
              views: 800,
              likes: 65,
              comments: 12,
              shares: 5,
              earnings: 45.00,
              engagementRate: 5.2,
              date: '2024-01-20'
            },
            {
              id: '6',
              title: 'Podcast Episode',
              type: 'audio',
              status: 'declining',
              views: 600,
              likes: 35,
              comments: 8,
              shares: 3,
              earnings: 25.50,
              engagementRate: 4.1,
              date: '2024-01-19'
            }
          ],
          charts: {
            viewsOverTime: [
              { date: '2024-01-18', views: 1200 },
              { date: '2024-01-19', views: 800 },
              { date: '2024-01-20', views: 1500 },
              { date: '2024-01-21', views: 1800 },
              { date: '2024-01-22', views: 2200 },
              { date: '2024-01-23', views: 3200 },
              { date: '2024-01-24', views: 2500 }
            ],
            earningsOverTime: [
              { date: '2024-01-18', earnings: 85.50 },
              { date: '2024-01-19', earnings: 45.25 },
              { date: '2024-01-20', earnings: 95.00 },
              { date: '2024-01-21', earnings: 125.75 },
              { date: '2024-01-22', earnings: 180.25 },
              { date: '2024-01-23', earnings: 220.50 },
              { date: '2024-01-24', earnings: 195.75 }
            ],
            contentTypes: [
              { type: 'Live Streams', count: 45, percentage: 60 },
              { type: 'Videos', count: 20, percentage: 27 },
              { type: 'Galleries', count: 8, percentage: 11 },
              { type: 'Audio', count: 2, percentage: 2 }
            ]
          }
        };
        setAnalytics(mockAnalytics);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredPerformance = () => {
    let filtered = analytics.performance || [];

    if (activeFilter !== 'all') {
      filtered = filtered.filter(item => item.status === activeFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
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
      default: return <FileText size={16} />;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'trending': return <TrendingUp size={12} />;
      case 'stable': return <Activity size={12} />;
      case 'declining': return <TrendingDown size={12} />;
      default: return <Activity size={12} />;
    }
  };

  if (loading) {
    return (
      <StatisticsContainer>
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
          Loading analytics...
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </StatisticsContainer>
    );
  }

  const filteredPerformance = getFilteredPerformance();
  const overview = analytics.overview || {};

  return (
    <StatisticsContainer>
      <StatisticsHeader>
        <HeaderTitle>
          <TrendingUp size={28} />
          Statistics
        </HeaderTitle>
        <HeaderActions>
          <SearchBar>
            <SearchIcon>
              <Search size={18} />
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder="Search performance data..."
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
          <ActionButton>
            <Download size={16} />
            Export Data
          </ActionButton>
        </HeaderActions>
      </StatisticsHeader>

      <StatsGrid>
        <StatCard>
          <StatHeader>
            <StatTitle>Total Views</StatTitle>
            <StatIcon><Eye size={20} /></StatIcon>
          </StatHeader>
          <StatValue>{overview.totalViews?.toLocaleString() || '0'}</StatValue>
          <StatChange positive>
            <TrendingUp size={12} />
            +{overview.growthRate || 0}% this month
          </StatChange>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatTitle>Total Likes</StatTitle>
            <StatIcon><Heart size={20} /></StatIcon>
          </StatHeader>
          <StatValue>{overview.totalLikes?.toLocaleString() || '0'}</StatValue>
          <StatChange positive>
            <TrendingUp size={12} />
            +12.5% this month
          </StatChange>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatTitle>Total Comments</StatTitle>
            <StatIcon><MessageCircle size={20} /></StatIcon>
          </StatHeader>
          <StatValue>{overview.totalComments?.toLocaleString() || '0'}</StatValue>
          <StatChange positive>
            <TrendingUp size={12} />
            +8.3% this month
          </StatChange>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatTitle>Total Shares</StatTitle>
            <StatIcon><Share2 size={20} /></StatIcon>
          </StatHeader>
          <StatValue>{overview.totalShares?.toLocaleString() || '0'}</StatValue>
          <StatChange positive>
            <TrendingUp size={12} />
            +15.7% this month
          </StatChange>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatTitle>Subscribers</StatTitle>
            <StatIcon><Users size={20} /></StatIcon>
          </StatHeader>
          <StatValue>{overview.totalSubscribers?.toLocaleString() || '0'}</StatValue>
          <StatChange positive>
            <TrendingUp size={12} />
            +{overview.growthRate || 0}% this month
          </StatChange>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatTitle>Total Earnings</StatTitle>
            <StatIcon><DollarSign size={20} /></StatIcon>
          </StatHeader>
          <StatValue>${overview.totalEarnings?.toLocaleString() || '0'}</StatValue>
          <StatChange positive>
            <TrendingUp size={12} />
            +18.2% this month
          </StatChange>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatTitle>Engagement Rate</StatTitle>
            <StatIcon><Target size={20} /></StatIcon>
          </StatHeader>
          <StatValue>{overview.engagementRate || 0}%</StatValue>
          <StatChange positive>
            <TrendingUp size={12} />
            +2.1% this month
          </StatChange>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatTitle>Growth Rate</StatTitle>
            <StatIcon><Zap size={20} /></StatIcon>
          </StatHeader>
          <StatValue>{overview.growthRate || 0}%</StatValue>
          <StatChange positive>
            <TrendingUp size={12} />
            +3.5% this month
          </StatChange>
        </StatCard>
      </StatsGrid>

      <ChartsGrid>
        <ChartCard>
          <ChartHeader>
            <ChartTitle>
              <LineChart size={20} />
              Views Over Time
            </ChartTitle>
          </ChartHeader>
          <ChartContent>
            <div style={{ textAlign: 'center' }}>
              <LineChart size={48} style={{ marginBottom: '10px', opacity: 0.5 }} />
              <p>Views trending upward</p>
              <p style={{ fontSize: '0.8rem', color: '#666' }}>Peak: 3,200 views on Jan 23</p>
            </div>
          </ChartContent>
        </ChartCard>

        <ChartCard>
          <ChartHeader>
            <ChartTitle>
              <BarChart3 size={20} />
              Earnings Over Time
            </ChartTitle>
          </ChartHeader>
          <ChartContent>
            <div style={{ textAlign: 'center' }}>
              <BarChart3 size={48} style={{ marginBottom: '10px', opacity: 0.5 }} />
              <p>Earnings growing steadily</p>
              <p style={{ fontSize: '0.8rem', color: '#666' }}>Peak: $220.50 on Jan 23</p>
            </div>
          </ChartContent>
        </ChartCard>

        <ChartCard>
          <ChartHeader>
            <ChartTitle>
              <PieChart size={20} />
              Content Types
            </ChartTitle>
          </ChartHeader>
          <ChartContent>
            <div style={{ textAlign: 'center' }}>
              <PieChart size={48} style={{ marginBottom: '10px', opacity: 0.5 }} />
              <p>Live streams dominate</p>
              <p style={{ fontSize: '0.8rem', color: '#666' }}>60% Live, 27% Videos, 11% Galleries, 2% Audio</p>
            </div>
          </ChartContent>
        </ChartCard>

        <ChartCard>
          <ChartHeader>
            <ChartTitle>
              <Activity size={20} />
              Engagement Metrics
            </ChartTitle>
          </ChartHeader>
          <ChartContent>
            <div style={{ textAlign: 'center' }}>
              <Activity size={48} style={{ marginBottom: '10px', opacity: 0.5 }} />
              <p>Strong engagement rates</p>
              <p style={{ fontSize: '0.8rem', color: '#666' }}>Average: 7.2% engagement rate</p>
            </div>
          </ChartContent>
        </ChartCard>
      </ChartsGrid>

      <FilterTabs>
        <FilterTab 
          active={activeFilter === 'all'} 
          onClick={() => setActiveFilter('all')}
        >
          All ({analytics.performance?.length || 0})
        </FilterTab>
        <FilterTab 
          active={activeFilter === 'trending'} 
          onClick={() => setActiveFilter('trending')}
        >
          <TrendingUp size={16} />
          Trending ({analytics.performance?.filter(p => p.status === 'trending').length || 0})
        </FilterTab>
        <FilterTab 
          active={activeFilter === 'stable'} 
          onClick={() => setActiveFilter('stable')}
        >
          <Activity size={16} />
          Stable ({analytics.performance?.filter(p => p.status === 'stable').length || 0})
        </FilterTab>
        <FilterTab 
          active={activeFilter === 'declining'} 
          onClick={() => setActiveFilter('declining')}
        >
          <TrendingDown size={16} />
          Declining ({analytics.performance?.filter(p => p.status === 'declining').length || 0})
        </FilterTab>
      </FilterTabs>

      {filteredPerformance.length === 0 ? (
        <EmptyState>
          <EmptyIcon>
            <TrendingUp size={32} />
          </EmptyIcon>
          <EmptyTitle>No performance data found</EmptyTitle>
          <EmptyDescription>
            {searchQuery ? 'Try adjusting your search terms' : 'Your performance analytics will appear here once you start creating content!'}
          </EmptyDescription>
        </EmptyState>
      ) : (
        <PerformanceGrid>
          {filteredPerformance.map((item) => (
            <PerformanceCard key={item.id}>
              <PerformanceStatus status={item.status}>
                {getStatusIcon(item.status)}
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </PerformanceStatus>
              
              <PerformanceHeader>
                <PerformanceInfo>
                  <PerformanceTitle>
                    {getTypeIcon(item.type)}
                    {item.title}
                  </PerformanceTitle>
                  <PerformanceDescription>
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)} content
                  </PerformanceDescription>
                  <PerformanceMeta>
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                    <span>{item.engagementRate}% engagement</span>
                  </PerformanceMeta>
                </PerformanceInfo>
                <PerformanceActions>
                  <PerformanceActionButton title="View Details">
                    <Eye size={16} />
                  </PerformanceActionButton>
                  <PerformanceActionButton title="Export">
                    <Download size={16} />
                  </PerformanceActionButton>
                </PerformanceActions>
              </PerformanceHeader>
              
              <PerformanceValue positive={item.earnings > 0}>
                ${item.earnings.toFixed(2)}
              </PerformanceValue>
              
              <PerformanceDetails>
                <PerformanceDetail>
                  <PerformanceDetailIcon>
                    <Eye size={16} />
                  </PerformanceDetailIcon>
                  {item.views.toLocaleString()} views
                </PerformanceDetail>
                <PerformanceDetail>
                  <PerformanceDetailIcon>
                    <Heart size={16} />
                  </PerformanceDetailIcon>
                  {item.likes.toLocaleString()} likes
                </PerformanceDetail>
                <PerformanceDetail>
                  <PerformanceDetailIcon>
                    <MessageCircle size={16} />
                  </PerformanceDetailIcon>
                  {item.comments} comments
                </PerformanceDetail>
                <PerformanceDetail>
                  <PerformanceDetailIcon>
                    <Share2 size={16} />
                  </PerformanceDetailIcon>
                  {item.shares} shares
                </PerformanceDetail>
              </PerformanceDetails>
            </PerformanceCard>
          ))}
        </PerformanceGrid>
      )}
    </StatisticsContainer>
  );
};

export default StatisticsTab;
