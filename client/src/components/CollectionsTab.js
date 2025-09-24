import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  Star, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Edit3,
  Trash2,
  Users,
  Eye,
  Heart,
  MessageCircle,
  Calendar,
  Settings,
  Grid,
  List,
  SortAsc,
  SortDesc,
  X,
  Check,
  FolderPlus,
  FolderOpen,
  UserPlus,
  UserMinus
} from 'lucide-react';
import { dashboardService } from '../services/dashboardService';

const CollectionsContainer = styled.div`
  padding: 20px;
  max-width: 100%;
`;

const CollectionsHeader = styled.div`
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

const CollectionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const CollectionCard = styled.div`
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

const CollectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
`;

const CollectionInfo = styled.div`
  flex: 1;
`;

const CollectionTitle = styled.h3`
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 5px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CollectionDescription = styled.p`
  color: #ccc;
  font-size: 0.9rem;
  margin: 0 0 10px 0;
  line-height: 1.4;
`;

const CollectionMeta = styled.div`
  display: flex;
  gap: 15px;
  color: #888;
  font-size: 0.8rem;
`;

const CollectionActions = styled.div`
  display: flex;
  gap: 5px;
`;

const CollectionActionButton = styled.button`
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

const CreatorsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
  gap: 10px;
  margin-top: 15px;
`;

const CreatorAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff69b4 0%, #7a288a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 5px 15px rgba(255, 105, 180, 0.4);
  }
`;

const AddCreatorButton = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(42, 42, 42, 0.8);
  border: 2px dashed #666;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #ff69b4;
    color: #ff69b4;
    background: rgba(255, 105, 180, 0.1);
  }
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
  max-width: 500px;
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

const CollectionsTab = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);
  const [newCollection, setNewCollection] = useState({
    name: '',
    description: '',
    isPrivate: false
  });

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    try {
      setLoading(true);
      const result = await dashboardService.getCollections();
      
      if (result.success) {
        setCollections(result.data || []);
      } else {
        // Use mock data for now
        const mockCollections = [
          {
            id: '1',
            name: 'Fitness Models',
            description: 'My favorite fitness and wellness creators',
            isPrivate: false,
            creatorCount: 8,
            createdAt: '2024-01-15',
            creators: [
              { id: '1', name: 'Sarah', avatar: 'S', isOnline: true },
              { id: '2', name: 'Mike', avatar: 'M', isOnline: false },
              { id: '3', name: 'Emma', avatar: 'E', isOnline: true },
              { id: '4', name: 'Alex', avatar: 'A', isOnline: false },
              { id: '5', name: 'Lisa', avatar: 'L', isOnline: true }
            ]
          },
          {
            id: '2',
            name: 'Art & Photography',
            description: 'Creative artists and photographers I follow',
            isPrivate: true,
            creatorCount: 12,
            createdAt: '2024-01-10',
            creators: [
              { id: '6', name: 'David', avatar: 'D', isOnline: true },
              { id: '7', name: 'Anna', avatar: 'A', isOnline: false },
              { id: '8', name: 'Chris', avatar: 'C', isOnline: true },
              { id: '9', name: 'Maya', avatar: 'M', isOnline: true }
            ]
          },
          {
            id: '3',
            name: 'Music & Dance',
            description: 'Musicians, dancers, and performers',
            isPrivate: false,
            creatorCount: 6,
            createdAt: '2024-01-05',
            creators: [
              { id: '10', name: 'Jake', avatar: 'J', isOnline: false },
              { id: '11', name: 'Sophie', avatar: 'S', isOnline: true },
              { id: '12', name: 'Ryan', avatar: 'R', isOnline: true }
            ]
          },
          {
            id: '4',
            name: 'Lifestyle & Fashion',
            description: 'Fashion, beauty, and lifestyle content creators',
            isPrivate: false,
            creatorCount: 15,
            createdAt: '2024-01-01',
            creators: [
              { id: '13', name: 'Zoe', avatar: 'Z', isOnline: true },
              { id: '14', name: 'Ben', avatar: 'B', isOnline: false },
              { id: '15', name: 'Kate', avatar: 'K', isOnline: true },
              { id: '16', name: 'Tom', avatar: 'T', isOnline: false },
              { id: '17', name: 'Nina', avatar: 'N', isOnline: true }
            ]
          }
        ];
        setCollections(mockCollections);
      }
    } catch (error) {
      console.error('Error loading collections:', error);
    } finally {
      setLoading(false);
    }
  };

  const createCollection = async () => {
    try {
      const result = await dashboardService.createCollection(
        newCollection.name,
        newCollection.description
      );

      if (result.success) {
        const collection = {
          id: Date.now().toString(),
          ...newCollection,
          creatorCount: 0,
          createdAt: new Date().toISOString().split('T')[0],
          creators: []
        };
        setCollections(prev => [collection, ...prev]);
        setNewCollection({ name: '', description: '', isPrivate: false });
        setShowCreateModal(false);
      } else {
        // Add optimistically for demo
        const collection = {
          id: Date.now().toString(),
          ...newCollection,
          creatorCount: 0,
          createdAt: new Date().toISOString().split('T')[0],
          creators: []
        };
        setCollections(prev => [collection, ...prev]);
        setNewCollection({ name: '', description: '', isPrivate: false });
        setShowCreateModal(false);
      }
    } catch (error) {
      console.error('Error creating collection:', error);
    }
  };

  const deleteCollection = async (collectionId) => {
    try {
      // In a real app, call API to delete
      setCollections(prev => prev.filter(c => c.id !== collectionId));
    } catch (error) {
      console.error('Error deleting collection:', error);
    }
  };

  const getFilteredCollections = () => {
    if (!searchQuery) return collections;
    return collections.filter(collection =>
      collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collection.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const stats = {
    totalCollections: collections.length,
    totalCreators: collections.reduce((sum, c) => sum + c.creatorCount, 0),
    privateCollections: collections.filter(c => c.isPrivate).length,
    publicCollections: collections.filter(c => !c.isPrivate).length
  };

  if (loading) {
    return (
      <CollectionsContainer>
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
          Loading collections...
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </CollectionsContainer>
    );
  }

  return (
    <CollectionsContainer>
      <CollectionsHeader>
        <HeaderTitle>
          <Star size={28} />
          Collections
        </HeaderTitle>
        <HeaderActions>
          <SearchBar>
            <SearchIcon>
              <Search size={18} />
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder="Search collections..."
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
            New Collection
          </ActionButton>
        </HeaderActions>
      </CollectionsHeader>

      <StatsGrid>
        <StatCard>
          <StatHeader>
            <StatTitle>Total Collections</StatTitle>
            <StatIcon><FolderOpen size={20} /></StatIcon>
          </StatHeader>
          <StatValue>{stats.totalCollections}</StatValue>
          <StatChange positive>
            <Plus size={12} />
            +2 this week
          </StatChange>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatTitle>Total Creators</StatTitle>
            <StatIcon><Users size={20} /></StatIcon>
          </StatHeader>
          <StatValue>{stats.totalCreators}</StatValue>
          <StatChange positive>
            <Plus size={12} />
            +8 this week
          </StatChange>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatTitle>Private Collections</StatTitle>
            <StatIcon><Eye size={20} /></StatIcon>
          </StatHeader>
          <StatValue>{stats.privateCollections}</StatValue>
          <StatChange positive>
            <Plus size={12} />
            +1 this week
          </StatChange>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatTitle>Public Collections</StatTitle>
            <StatIcon><Users size={20} /></StatIcon>
          </StatHeader>
          <StatValue>{stats.publicCollections}</StatValue>
          <StatChange positive>
            <Plus size={12} />
            +1 this week
          </StatChange>
        </StatCard>
      </StatsGrid>

      {getFilteredCollections().length === 0 ? (
        <EmptyState>
          <EmptyIcon>
            <Star size={32} />
          </EmptyIcon>
          <EmptyTitle>No collections found</EmptyTitle>
          <EmptyDescription>
            {searchQuery ? 'Try adjusting your search terms' : 'Create your first collection to organize your favorite creators!'}
          </EmptyDescription>
          {!searchQuery && (
            <ActionButton primary onClick={() => setShowCreateModal(true)}>
              <Plus size={16} />
              Create Collection
            </ActionButton>
          )}
        </EmptyState>
      ) : (
        <CollectionsGrid>
          {getFilteredCollections().map((collection) => (
            <CollectionCard key={collection.id}>
              <CollectionHeader>
                <CollectionInfo>
                  <CollectionTitle>
                    <Star size={16} />
                    {collection.name}
                    {collection.isPrivate && <Eye size={14} style={{ color: '#888' }} />}
                  </CollectionTitle>
                  <CollectionDescription>{collection.description}</CollectionDescription>
                  <CollectionMeta>
                    <span>{collection.creatorCount} creators</span>
                    <span>Created {new Date(collection.createdAt).toLocaleDateString()}</span>
                  </CollectionMeta>
                </CollectionInfo>
                <CollectionActions>
                  <CollectionActionButton onClick={() => setEditingCollection(collection)}>
                    <Edit3 size={16} />
                  </CollectionActionButton>
                  <CollectionActionButton onClick={() => deleteCollection(collection.id)}>
                    <Trash2 size={16} />
                  </CollectionActionButton>
                </CollectionActions>
              </CollectionHeader>
              
              <CreatorsGrid>
                {collection.creators.slice(0, 6).map((creator) => (
                  <CreatorAvatar key={creator.id} title={creator.name}>
                    {creator.avatar}
                  </CreatorAvatar>
                ))}
                {collection.creators.length > 6 && (
                  <CreatorAvatar title={`+${collection.creators.length - 6} more`}>
                    +{collection.creators.length - 6}
                  </CreatorAvatar>
                )}
                <AddCreatorButton title="Add creator to collection">
                  <UserPlus size={16} />
                </AddCreatorButton>
              </CreatorsGrid>
            </CollectionCard>
          ))}
        </CollectionsGrid>
      )}

      {showCreateModal && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Create New Collection</ModalTitle>
              <CloseButton onClick={() => setShowCreateModal(false)}>
                <X size={20} />
              </CloseButton>
            </ModalHeader>

            <FormGroup>
              <Label>Collection Name</Label>
              <Input
                type="text"
                placeholder="Enter collection name..."
                value={newCollection.name}
                onChange={(e) => setNewCollection(prev => ({ ...prev, name: e.target.value }))}
              />
            </FormGroup>

            <FormGroup>
              <Label>Description</Label>
              <Textarea
                placeholder="Describe your collection..."
                value={newCollection.description}
                onChange={(e) => setNewCollection(prev => ({ ...prev, description: e.target.value }))}
              />
            </FormGroup>

            <ModalActions>
              <ActionButton onClick={() => setShowCreateModal(false)}>
                Cancel
              </ActionButton>
              <ActionButton primary onClick={createCollection}>
                <Check size={16} />
                Create Collection
              </ActionButton>
            </ModalActions>
          </ModalContent>
        </Modal>
      )}
    </CollectionsContainer>
  );
};

export default CollectionsTab;
