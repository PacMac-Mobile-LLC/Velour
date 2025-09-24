import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  Archive, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Edit3,
  Trash2,
  Eye,
  Download,
  Share2,
  Lock,
  Unlock,
  Image,
  Video,
  FileText,
  Calendar,
  Settings,
  Grid,
  List,
  SortAsc,
  SortDesc,
  X,
  Check,
  Upload,
  FolderPlus,
  FolderOpen,
  Star,
  Heart,
  MessageCircle
} from 'lucide-react';
import { dashboardService } from '../services/dashboardService';
import { uploadService } from '../services/uploadService';

const VaultContainer = styled.div`
  padding: 20px;
  max-width: 100%;
`;

const VaultHeader = styled.div`
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

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const ContentCard = styled.div`
  background: rgba(42, 42, 42, 0.6);
  border: 1px solid #444;
  border-radius: 15px;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    border-color: #ff69b4;
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  }
`;

const ContentPreview = styled.div`
  height: 200px;
  background: ${props => {
    switch(props.type) {
      case 'image': return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      case 'video': return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
      case 'document': return 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
      default: return 'linear-gradient(135deg, #ff69b4 0%, #7a288a 100%)';
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  position: relative;
`;

const ContentOverlay = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 5px;
`;

const ContentBadge = styled.div`
  background: rgba(0, 0, 0, 0.7);
  border-radius: 15px;
  padding: 5px 10px;
  color: white;
  font-size: 0.8rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const ContentInfo = styled.div`
  padding: 15px;
`;

const ContentTitle = styled.h3`
  color: white;
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ContentDescription = styled.p`
  color: #ccc;
  font-size: 0.9rem;
  margin: 0 0 10px 0;
  line-height: 1.4;
`;

const ContentMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #888;
  font-size: 0.8rem;
`;

const ContentActions = styled.div`
  display: flex;
  gap: 5px;
  margin-top: 10px;
`;

const ContentActionButton = styled.button`
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

const UploadArea = styled.div`
  border: 2px dashed #666;
  border-radius: 15px;
  padding: 40px;
  text-align: center;
  color: #888;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 30px;

  &:hover {
    border-color: #ff69b4;
    color: #ff69b4;
    background: rgba(255, 105, 180, 0.05);
  }
`;

const UploadIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(42, 42, 42, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15px;
  color: #666;
`;

const UploadTitle = styled.h3`
  color: #ccc;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 10px;
`;

const UploadDescription = styled.p`
  color: #888;
  font-size: 1rem;
  line-height: 1.5;
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

const VaultTab = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMetadata, setUploadMetadata] = useState({
    title: '',
    description: '',
    isPrivate: false,
    tags: ''
  });

  useEffect(() => {
    loadVaultContent();
  }, [activeFilter]);

  const loadVaultContent = async () => {
    try {
      setLoading(true);
      const result = await uploadService.getVaultContent(1, 20, activeFilter);
      
      if (result.success) {
        setContent(result.data.data || []);
      } else {
        // Use mock data for now
        const mockContent = [
          {
            id: '1',
            title: 'Sunset Beach Photo',
            description: 'Beautiful sunset at Malibu Beach',
            type: 'image',
            size: '2.4 MB',
            uploadedAt: '2024-01-15',
            isPrivate: false,
            views: 1250,
            likes: 89,
            comments: 12
          },
          {
            id: '2',
            title: 'Morning Workout Video',
            description: '30-minute HIIT workout routine',
            type: 'video',
            size: '45.2 MB',
            uploadedAt: '2024-01-14',
            isPrivate: true,
            views: 890,
            likes: 156,
            comments: 23
          },
          {
            id: '3',
            title: 'Nutrition Guide PDF',
            description: 'Complete nutrition guide for fitness',
            type: 'document',
            size: '1.8 MB',
            uploadedAt: '2024-01-13',
            isPrivate: false,
            views: 2100,
            likes: 234,
            comments: 45
          },
          {
            id: '4',
            title: 'Gym Selfie',
            description: 'Post-workout selfie at the gym',
            type: 'image',
            size: '1.2 MB',
            uploadedAt: '2024-01-12',
            isPrivate: false,
            views: 3200,
            likes: 445,
            comments: 67
          },
          {
            id: '5',
            title: 'Cooking Tutorial',
            description: 'How to make healthy protein smoothie',
            type: 'video',
            size: '38.7 MB',
            uploadedAt: '2024-01-11',
            isPrivate: true,
            views: 1500,
            likes: 198,
            comments: 34
          },
          {
            id: '6',
            title: 'Workout Schedule',
            description: 'Weekly workout schedule template',
            type: 'document',
            size: '0.9 MB',
            uploadedAt: '2024-01-10',
            isPrivate: false,
            views: 1800,
            likes: 123,
            comments: 28
          }
        ];
        setContent(mockContent);
      }
    } catch (error) {
      console.error('Error loading vault content:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredContent = () => {
    let filtered = content;

    if (activeFilter !== 'all') {
      filtered = filtered.filter(item => item.type === activeFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setUploadMetadata(prev => ({
        ...prev,
        title: file.name.split('.')[0] // Use filename without extension as default title
      }));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      const result = await uploadService.uploadToVault(selectedFile, uploadMetadata);
      
      if (result.success) {
        setShowUploadModal(false);
        setSelectedFile(null);
        setUploadMetadata({
          title: '',
          description: '',
          isPrivate: false,
          tags: ''
        });
        loadVaultContent(); // Reload content
      } else {
        alert(result.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteContent = async (contentId) => {
    if (!window.confirm('Are you sure you want to delete this content?')) return;

    try {
      const result = await uploadService.deleteVaultContent(contentId);
      if (result.success) {
        loadVaultContent(); // Reload content
      } else {
        alert(result.message || 'Delete failed');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Delete failed');
    }
  };

  const getContentIcon = (type) => {
    switch (type) {
      case 'image': return <Image size={32} />;
      case 'video': return <Video size={32} />;
      case 'document': return <FileText size={32} />;
      default: return <Archive size={32} />;
    }
  };

  const stats = {
    totalItems: content.length,
    totalSize: content.reduce((sum, item) => sum + parseFloat(item.size), 0).toFixed(1) + ' MB',
    privateItems: content.filter(item => item.isPrivate).length,
    publicItems: content.filter(item => !item.isPrivate).length
  };

  if (loading) {
    return (
      <VaultContainer>
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
          Loading vault content...
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </VaultContainer>
    );
  }

  const filteredContent = getFilteredContent();

  return (
    <VaultContainer>
      <VaultHeader>
        <HeaderTitle>
          <Archive size={28} />
          Vault
        </HeaderTitle>
        <HeaderActions>
          <SearchBar>
            <SearchIcon>
              <Search size={18} />
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder="Search vault content..."
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
          <ActionButton primary onClick={() => setShowUploadModal(true)}>
            <Upload size={16} />
            Upload Content
          </ActionButton>
        </HeaderActions>
      </VaultHeader>

      <StatsGrid>
        <StatCard>
          <StatHeader>
            <StatTitle>Total Items</StatTitle>
            <StatIcon><Archive size={20} /></StatIcon>
          </StatHeader>
          <StatValue>{stats.totalItems}</StatValue>
          <StatChange positive>
            <Plus size={12} />
            +3 this week
          </StatChange>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatTitle>Total Size</StatTitle>
            <StatIcon><FolderOpen size={20} /></StatIcon>
          </StatHeader>
          <StatValue>{stats.totalSize}</StatValue>
          <StatChange positive>
            <Plus size={12} />
            +12.5 MB this week
          </StatChange>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatTitle>Private Items</StatTitle>
            <StatIcon><Lock size={20} /></StatIcon>
          </StatHeader>
          <StatValue>{stats.privateItems}</StatValue>
          <StatChange positive>
            <Plus size={12} />
            +1 this week
          </StatChange>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatTitle>Public Items</StatTitle>
            <StatIcon><Unlock size={20} /></StatIcon>
          </StatHeader>
          <StatValue>{stats.publicItems}</StatValue>
          <StatChange positive>
            <Plus size={12} />
            +2 this week
          </StatChange>
        </StatCard>
      </StatsGrid>

      <FilterTabs>
        <FilterTab 
          active={activeFilter === 'all'} 
          onClick={() => setActiveFilter('all')}
        >
          All ({content.length})
        </FilterTab>
        <FilterTab 
          active={activeFilter === 'image'} 
          onClick={() => setActiveFilter('image')}
        >
          <Image size={16} />
          Images ({content.filter(item => item.type === 'image').length})
        </FilterTab>
        <FilterTab 
          active={activeFilter === 'video'} 
          onClick={() => setActiveFilter('video')}
        >
          <Video size={16} />
          Videos ({content.filter(item => item.type === 'video').length})
        </FilterTab>
        <FilterTab 
          active={activeFilter === 'document'} 
          onClick={() => setActiveFilter('document')}
        >
          <FileText size={16} />
          Documents ({content.filter(item => item.type === 'document').length})
        </FilterTab>
      </FilterTabs>

      <UploadArea>
        <UploadIcon>
          <Upload size={24} />
        </UploadIcon>
        <UploadTitle>Upload New Content</UploadTitle>
        <UploadDescription>
          Drag and drop files here or click to browse. Supports images, videos, and documents.
        </UploadDescription>
      </UploadArea>

      {filteredContent.length === 0 ? (
        <EmptyState>
          <EmptyIcon>
            <Archive size={32} />
          </EmptyIcon>
          <EmptyTitle>No content found</EmptyTitle>
          <EmptyDescription>
            {searchQuery ? 'Try adjusting your search terms' : 'Upload your first piece of content to get started!'}
          </EmptyDescription>
          {!searchQuery && (
            <ActionButton primary>
              <Upload size={16} />
              Upload Content
            </ActionButton>
          )}
        </EmptyState>
      ) : (
        <ContentGrid>
          {filteredContent.map((item) => (
            <ContentCard key={item.id}>
              <ContentPreview type={item.type}>
                {getContentIcon(item.type)}
                <ContentOverlay>
                  <ContentBadge>
                    {item.isPrivate ? <Lock size={12} /> : <Unlock size={12} />}
                    {item.isPrivate ? 'Private' : 'Public'}
                  </ContentBadge>
                </ContentOverlay>
              </ContentPreview>
              
              <ContentInfo>
                <ContentTitle>
                  {getContentIcon(item.type)}
                  {item.title}
                </ContentTitle>
                <ContentDescription>{item.description}</ContentDescription>
                <ContentMeta>
                  <span>{item.size}</span>
                  <span>{new Date(item.uploadedAt).toLocaleDateString()}</span>
                </ContentMeta>
                
                <ContentActions>
                  <ContentActionButton title="View">
                    <Eye size={16} />
                  </ContentActionButton>
                  <ContentActionButton title="Download">
                    <Download size={16} />
                  </ContentActionButton>
                  <ContentActionButton title="Share">
                    <Share2 size={16} />
                  </ContentActionButton>
                  <ContentActionButton title="Edit">
                    <Edit3 size={16} />
                  </ContentActionButton>
                  <ContentActionButton title="Delete" onClick={() => handleDeleteContent(item.id)}>
                    <Trash2 size={16} />
                  </ContentActionButton>
                </ContentActions>
              </ContentInfo>
            </ContentCard>
          ))}
        </ContentGrid>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
            borderRadius: '20px',
            padding: '30px',
            width: '90%',
            maxWidth: '500px',
            color: 'white',
            border: '1px solid rgba(255, 105, 180, 0.3)'
          }}>
            <h3 style={{ margin: '0 0 20px 0', color: 'white' }}>Upload Content</h3>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px', color: '#ccc' }}>
                Select File
              </label>
              <input
                type="file"
                onChange={handleFileSelect}
                accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                style={{
                  width: '100%',
                  padding: '10px',
                  background: '#2a2a2a',
                  border: '1px solid #444',
                  borderRadius: '10px',
                  color: 'white'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px', color: '#ccc' }}>
                Title
              </label>
              <input
                type="text"
                value={uploadMetadata.title}
                onChange={(e) => setUploadMetadata(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter content title"
                style={{
                  width: '100%',
                  padding: '10px',
                  background: '#2a2a2a',
                  border: '1px solid #444',
                  borderRadius: '10px',
                  color: 'white'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px', color: '#ccc' }}>
                Description
              </label>
              <textarea
                value={uploadMetadata.description}
                onChange={(e) => setUploadMetadata(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter content description"
                rows={3}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: '#2a2a2a',
                  border: '1px solid #444',
                  borderRadius: '10px',
                  color: 'white',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px', color: '#ccc' }}>
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={uploadMetadata.tags}
                onChange={(e) => setUploadMetadata(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="Enter tags separated by commas"
                style={{
                  width: '100%',
                  padding: '10px',
                  background: '#2a2a2a',
                  border: '1px solid #444',
                  borderRadius: '10px',
                  color: 'white'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ccc' }}>
                <input
                  type="checkbox"
                  checked={uploadMetadata.isPrivate}
                  onChange={(e) => setUploadMetadata(prev => ({ ...prev, isPrivate: e.target.checked }))}
                />
                Make this content private
              </label>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowUploadModal(false)}
                style={{
                  background: 'transparent',
                  border: '1px solid #444',
                  borderRadius: '10px',
                  padding: '10px 20px',
                  color: '#ccc',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                style={{
                  background: uploading ? '#666' : 'linear-gradient(135deg, #ff69b4 0%, #7a288a 100%)',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px 20px',
                  color: 'white',
                  cursor: uploading ? 'not-allowed' : 'pointer'
                }}
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}
    </VaultContainer>
  );
};

export default VaultTab;
