import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  BarChart3, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Edit3,
  Trash2,
  Download,
  Eye,
  DollarSign,
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  Settings,
  Grid,
  List,
  SortAsc,
  SortDesc,
  X,
  Check,
  CreditCard,
  Banknote,
  Wallet,
  Receipt,
  FileText,
  AlertCircle,
  CheckCircle,
  Info,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  Target,
  Zap
} from 'lucide-react';
import { dashboardService } from '../services/dashboardService';

const StatementsContainer = styled.div`
  padding: 20px;
  max-width: 100%;
`;

const StatementsHeader = styled.div`
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

const StatementsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatementCard = styled.div`
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

const StatementHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
`;

const StatementInfo = styled.div`
  flex: 1;
`;

const StatementTitle = styled.h3`
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 5px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatementDescription = styled.p`
  color: #ccc;
  font-size: 0.9rem;
  margin: 0 0 10px 0;
  line-height: 1.4;
`;

const StatementMeta = styled.div`
  display: flex;
  gap: 15px;
  color: #888;
  font-size: 0.8rem;
  margin-bottom: 15px;
`;

const StatementActions = styled.div`
  display: flex;
  gap: 5px;
`;

const StatementActionButton = styled.button`
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

const StatementStatus = styled.div`
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
      case 'pending': return 'rgba(59, 130, 246, 0.2)';
      case 'processing': return 'rgba(245, 158, 11, 0.2)';
      case 'completed': return 'rgba(34, 197, 94, 0.2)';
      case 'failed': return 'rgba(239, 68, 68, 0.2)';
      default: return 'rgba(107, 114, 128, 0.2)';
    }
  }};
  color: ${props => {
    switch(props.status) {
      case 'pending': return '#60a5fa';
      case 'processing': return '#f59e0b';
      case 'completed': return '#4ade80';
      case 'failed': return '#f87171';
      default: return '#9ca3af';
    }
  }};
  border: 1px solid ${props => {
    switch(props.status) {
      case 'pending': return '#3b82f6';
      case 'processing': return '#f59e0b';
      case 'completed': return '#22c55e';
      case 'failed': return '#ef4444';
      default: return '#6b7280';
    }
  }};
`;

const StatementDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-top: 15px;
`;

const StatementDetail = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ccc;
  font-size: 0.9rem;
`;

const StatementDetailIcon = styled.div`
  color: #ff69b4;
  display: flex;
  align-items: center;
`;

const StatementAmount = styled.div`
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

const StatementsTab = () => {
  const [statements, setStatements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    loadStatements();
  }, []);

  const loadStatements = async () => {
    try {
      setLoading(true);
      const result = await dashboardService.getStatements();
      
      if (result.success) {
        setStatements(result.data || []);
      } else {
        // Use mock data for now
        const mockStatements = [
          {
            id: '1',
            title: 'January 2024 Payout',
            description: 'Monthly earnings from subscriptions and tips',
            type: 'payout',
            status: 'completed',
            amount: 2450.75,
            date: '2024-01-31',
            period: '2024-01-01 to 2024-01-31',
            transactions: 156,
            fees: 122.54,
            netAmount: 2328.21,
            method: 'bank_transfer'
          },
          {
            id: '2',
            title: 'December 2023 Payout',
            description: 'Monthly earnings from subscriptions and tips',
            type: 'payout',
            status: 'completed',
            amount: 1890.50,
            date: '2023-12-31',
            period: '2023-12-01 to 2023-12-31',
            transactions: 124,
            fees: 94.53,
            netAmount: 1795.97,
            method: 'bank_transfer'
          },
          {
            id: '3',
            title: 'November 2023 Payout',
            description: 'Monthly earnings from subscriptions and tips',
            type: 'payout',
            status: 'completed',
            amount: 2100.25,
            date: '2023-11-30',
            period: '2023-11-01 to 2023-11-30',
            transactions: 142,
            fees: 105.01,
            netAmount: 1995.24,
            method: 'bank_transfer'
          },
          {
            id: '4',
            title: 'February 2024 Payout',
            description: 'Monthly earnings from subscriptions and tips',
            type: 'payout',
            status: 'processing',
            amount: 3200.00,
            date: '2024-02-29',
            period: '2024-02-01 to 2024-02-29',
            transactions: 198,
            fees: 160.00,
            netAmount: 3040.00,
            method: 'bank_transfer'
          },
          {
            id: '5',
            title: 'Bonus Payment',
            description: 'Performance bonus for top creator',
            type: 'bonus',
            status: 'completed',
            amount: 500.00,
            date: '2024-01-15',
            period: '2024-01-01 to 2024-01-31',
            transactions: 1,
            fees: 0.00,
            netAmount: 500.00,
            method: 'bank_transfer'
          },
          {
            id: '6',
            title: 'Refund Processing',
            description: 'Refund for cancelled subscription',
            type: 'refund',
            status: 'pending',
            amount: -25.00,
            date: '2024-02-01',
            period: '2024-02-01',
            transactions: 1,
            fees: 0.00,
            netAmount: -25.00,
            method: 'credit_card'
          }
        ];
        setStatements(mockStatements);
      }
    } catch (error) {
      console.error('Error loading statements:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredStatements = () => {
    let filtered = statements;

    if (activeFilter !== 'all') {
      filtered = filtered.filter(statement => statement.status === activeFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(statement =>
        statement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        statement.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'payout': return <Banknote size={16} />;
      case 'bonus': return <Zap size={16} />;
      case 'refund': return <ArrowDownRight size={16} />;
      default: return <Receipt size={16} />;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock size={12} />;
      case 'processing': return <TrendingUp size={12} />;
      case 'completed': return <CheckCircle size={12} />;
      case 'failed': return <AlertCircle size={12} />;
      default: return <Clock size={12} />;
    }
  };

  const stats = {
    totalEarnings: statements.reduce((sum, s) => sum + (s.amount > 0 ? s.amount : 0), 0),
    totalPayouts: statements.filter(s => s.status === 'completed').reduce((sum, s) => sum + s.netAmount, 0),
    pendingAmount: statements.filter(s => s.status === 'pending' || s.status === 'processing').reduce((sum, s) => sum + s.amount, 0),
    totalTransactions: statements.reduce((sum, s) => sum + s.transactions, 0)
  };

  if (loading) {
    return (
      <StatementsContainer>
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
          Loading statements...
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </StatementsContainer>
    );
  }

  const filteredStatements = getFilteredStatements();

  return (
    <StatementsContainer>
      <StatementsHeader>
        <HeaderTitle>
          <BarChart3 size={28} />
          Statements
        </HeaderTitle>
        <HeaderActions>
          <SearchBar>
            <SearchIcon>
              <Search size={18} />
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder="Search statements..."
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
            Export
          </ActionButton>
        </HeaderActions>
      </StatementsHeader>

      <StatsGrid>
        <StatCard>
          <StatHeader>
            <StatTitle>Total Earnings</StatTitle>
            <StatIcon><DollarSign size={20} /></StatIcon>
          </StatHeader>
          <StatValue>${stats.totalEarnings.toLocaleString()}</StatValue>
          <StatChange positive>
            <TrendingUp size={12} />
            +15.2% this month
          </StatChange>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatTitle>Total Payouts</StatTitle>
            <StatIcon><Banknote size={20} /></StatIcon>
          </StatHeader>
          <StatValue>${stats.totalPayouts.toLocaleString()}</StatValue>
          <StatChange positive>
            <TrendingUp size={12} />
            +12.8% this month
          </StatChange>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatTitle>Pending Amount</StatTitle>
            <StatIcon><Clock size={20} /></StatIcon>
          </StatHeader>
          <StatValue>${stats.pendingAmount.toLocaleString()}</StatValue>
          <StatChange positive>
            <TrendingUp size={12} />
            +8.5% this month
          </StatChange>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatTitle>Total Transactions</StatTitle>
            <StatIcon><Receipt size={20} /></StatIcon>
          </StatHeader>
          <StatValue>{stats.totalTransactions}</StatValue>
          <StatChange positive>
            <TrendingUp size={12} />
            +22.3% this month
          </StatChange>
        </StatCard>
      </StatsGrid>

      <FilterTabs>
        <FilterTab 
          active={activeFilter === 'all'} 
          onClick={() => setActiveFilter('all')}
        >
          All ({statements.length})
        </FilterTab>
        <FilterTab 
          active={activeFilter === 'completed'} 
          onClick={() => setActiveFilter('completed')}
        >
          <CheckCircle size={16} />
          Completed ({statements.filter(s => s.status === 'completed').length})
        </FilterTab>
        <FilterTab 
          active={activeFilter === 'processing'} 
          onClick={() => setActiveFilter('processing')}
        >
          <TrendingUp size={16} />
          Processing ({statements.filter(s => s.status === 'processing').length})
        </FilterTab>
        <FilterTab 
          active={activeFilter === 'pending'} 
          onClick={() => setActiveFilter('pending')}
        >
          <Clock size={16} />
          Pending ({statements.filter(s => s.status === 'pending').length})
        </FilterTab>
      </FilterTabs>

      {filteredStatements.length === 0 ? (
        <EmptyState>
          <EmptyIcon>
            <BarChart3 size={32} />
          </EmptyIcon>
          <EmptyTitle>No statements found</EmptyTitle>
          <EmptyDescription>
            {searchQuery ? 'Try adjusting your search terms' : 'Your earnings statements will appear here once you start earning!'}
          </EmptyDescription>
        </EmptyState>
      ) : (
        <StatementsGrid>
          {filteredStatements.map((statement) => (
            <StatementCard key={statement.id}>
              <StatementStatus status={statement.status}>
                {getStatusIcon(statement.status)}
                {statement.status.charAt(0).toUpperCase() + statement.status.slice(1)}
              </StatementStatus>
              
              <StatementHeader>
                <StatementInfo>
                  <StatementTitle>
                    {getTypeIcon(statement.type)}
                    {statement.title}
                  </StatementTitle>
                  <StatementDescription>{statement.description}</StatementDescription>
                  <StatementMeta>
                    <span>{new Date(statement.date).toLocaleDateString()}</span>
                    <span>{statement.period}</span>
                  </StatementMeta>
                </StatementInfo>
                <StatementActions>
                  <StatementActionButton title="View Details">
                    <Eye size={16} />
                  </StatementActionButton>
                  <StatementActionButton title="Download">
                    <Download size={16} />
                  </StatementActionButton>
                </StatementActions>
              </StatementHeader>
              
              <StatementAmount positive={statement.amount > 0}>
                {statement.amount > 0 ? '+' : ''}${Math.abs(statement.amount).toLocaleString()}
              </StatementAmount>
              
              <StatementDetails>
                <StatementDetail>
                  <StatementDetailIcon>
                    <Receipt size={16} />
                  </StatementDetailIcon>
                  {statement.transactions} transactions
                </StatementDetail>
                <StatementDetail>
                  <StatementDetailIcon>
                    <Percent size={16} />
                  </StatementDetailIcon>
                  ${statement.fees} fees
                </StatementDetail>
                <StatementDetail>
                  <StatementDetailIcon>
                    <Wallet size={16} />
                  </StatementDetailIcon>
                  Net: ${statement.netAmount.toLocaleString()}
                </StatementDetail>
                <StatementDetail>
                  <StatementDetailIcon>
                    <CreditCard size={16} />
                  </StatementDetailIcon>
                  {statement.method.replace('_', ' ')}
                </StatementDetail>
              </StatementDetails>
            </StatementCard>
          ))}
        </StatementsGrid>
      )}
    </StatementsContainer>
  );
};

export default StatementsTab;
