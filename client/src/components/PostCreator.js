import React, { useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { 
  Image, 
  Video, 
  Smile, 
  MapPin, 
  Calendar, 
  Settings, 
  X, 
  Plus,
  Filter,
  Camera,
  Mic,
  FileText,
  Hash,
  AtSign,
  Eye,
  EyeOff,
  Users,
  Globe,
  Lock,
  Heart,
  Share2,
  MessageCircle,
  ThumbsUp
} from 'lucide-react';
import { api } from '../services/api';
import PhotoFilterModal from './PhotoFilterModal';

const PostCreatorContainer = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 20px;
  border: 1px solid #333;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 15px;
  border: 2px solid #ff69b4;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  color: #f8f8f8;
  font-weight: 600;
`;

const UserHandle = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: #bbb;
`;

const PostTypeSelector = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const PostTypeButton = styled.button`
  background: ${props => props.active ? 'linear-gradient(135deg, #ff69b4 0%, #7a288a 100%)' : '#333'};
  color: white;
  border: none;
  border-radius: 10px;
  padding: 10px 20px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: ${props => props.active ? '0 4px 15px rgba(255, 105, 180, 0.3)' : 'none'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.active ? '0 6px 20px rgba(255, 105, 180, 0.4)' : '0 2px 8px rgba(0, 0, 0, 0.3)'};
    background: ${props => props.active ? 'linear-gradient(135deg, #ff7abf 0%, #8a3898 100%)' : '#444'};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  background: #222;
  border: 1px solid #444;
  border-radius: 10px;
  padding: 15px;
  color: white;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  margin-bottom: 20px;

  &:focus {
    outline: none;
    border-color: #ff69b4;
    box-shadow: 0 0 0 2px rgba(255, 105, 180, 0.3);
  }

  &::placeholder {
    color: #888;
  }
`;

const MediaPreview = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
`;

const MediaItem = styled.div`
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  background: #333;
`;

const MediaImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
`;

const MediaVideo = styled.video`
  width: 100%;
  height: 150px;
  object-fit: cover;
`;

const MediaRemoveButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 0, 0, 0.8);
    transform: scale(1.1);
  }
`;

const MediaFilterButton = styled.button`
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(255, 105, 180, 0.8);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 105, 180, 1);
    transform: scale(1.05);
  }
`;

const MediaUploadArea = styled.div`
  border: 2px dashed #555;
  border-radius: 10px;
  padding: 30px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 20px;

  &:hover {
    border-color: #ff69b4;
    background: rgba(255, 105, 180, 0.1);
  }
`;

const UploadIcon = styled.div`
  font-size: 2rem;
  color: #888;
  margin-bottom: 10px;
`;

const UploadText = styled.p`
  color: #bbb;
  margin: 0;
  font-size: 0.9rem;
`;

const ControlsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const MediaButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const MediaButton = styled.button`
  background: #333;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: #444;
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const PrivacyButton = styled.button`
  background: #333;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: #444;
  }
`;

const PrivacyDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: #222;
  border: 1px solid #444;
  border-radius: 10px;
  padding: 10px 0;
  min-width: 200px;
  z-index: 1000;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
`;

const PrivacyOption = styled.button`
  width: 100%;
  background: none;
  border: none;
  color: white;
  padding: 12px 20px;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;

  &:hover {
    background: #333;
  }
`;

const PostOptions = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const OptionGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const OptionLabel = styled.label`
  font-size: 0.9rem;
  color: #ccc;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`;

const Checkbox = styled.input`
  accent-color: #ff69b4;
`;

const LocationInput = styled.input`
  background: #333;
  border: 1px solid #555;
  border-radius: 8px;
  padding: 10px 15px;
  color: white;
  font-size: 0.9rem;
  width: 100%;

  &:focus {
    outline: none;
    border-color: #ff69b4;
  }

  &::placeholder {
    color: #888;
  }
`;

const ScheduleInput = styled.input`
  background: #333;
  border: 1px solid #555;
  border-radius: 8px;
  padding: 10px 15px;
  color: white;
  font-size: 0.9rem;
  width: 100%;

  &:focus {
    outline: none;
    border-color: #ff69b4;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CharacterCount = styled.span`
  color: ${props => props.count > 1800 ? '#ff6b6b' : props.count > 1600 ? '#ffa726' : '#888'};
  font-size: 0.9rem;
`;

const PostButton = styled.button`
  background: linear-gradient(135deg, #ff69b4 0%, #7a288a 100%);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 12px 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(255, 105, 180, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(255, 105, 180, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const PostCreator = ({ onPostCreated, user }) => {
  const [postType, setPostType] = useState('text');
  const [text, setText] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [privacy, setPrivacy] = useState('public');
  const [showPrivacyDropdown, setShowPrivacyDropdown] = useState(false);
  const [allowComments, setAllowComments] = useState(true);
  const [allowShares, setAllowShares] = useState(true);
  const [allowReactions, setAllowReactions] = useState(true);
  const [ageRestricted, setAgeRestricted] = useState(false);
  const [location, setLocation] = useState('');
  const [scheduledFor, setScheduledFor] = useState('');
  const [loading, setLoading] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(null);
  
  const fileInputRef = useRef(null);
  const privacyButtonRef = useRef(null);

  const postTypes = [
    { id: 'text', label: 'Text', icon: FileText },
    { id: 'image', label: 'Photo', icon: Image },
    { id: 'video', label: 'Video', icon: Video },
    { id: 'mixed', label: 'Mixed', icon: Plus }
  ];

  const privacyOptions = [
    { id: 'public', label: 'Public', icon: Globe, description: 'Anyone can see this' },
    { id: 'followers', label: 'Followers', icon: Users, description: 'Only your followers' },
    { id: 'friends', label: 'Friends', icon: Heart, description: 'Only your friends' },
    { id: 'private', label: 'Private', icon: Lock, description: 'Only you' }
  ];

  const handleFileSelect = useCallback((event) => {
    const files = Array.from(event.target.files);
    const newMediaFiles = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      type: file.type.startsWith('image/') ? 'image' : 
            file.type.startsWith('video/') ? 'video' : 'audio',
      name: file.name,
      size: file.size
    }));
    
    setMediaFiles(prev => [...prev, ...newMediaFiles]);
    setPostType(mediaFiles.length + newMediaFiles.length > 1 ? 'mixed' : 
                newMediaFiles[0]?.type === 'image' ? 'image' : 'video');
  }, [mediaFiles.length]);

  const handleRemoveMedia = (index) => {
    setMediaFiles(prev => {
      const newFiles = prev.filter((_, i) => i !== index);
      URL.revokeObjectURL(prev[index].url);
      return newFiles;
    });
  };

  const handleApplyFilter = async (filterType, filterOptions) => {
    if (selectedMediaIndex === null) return;
    
    try {
      const formData = new FormData();
      formData.append('mediaIndex', selectedMediaIndex);
      formData.append('filterType', filterType);
      formData.append('filterOptions', JSON.stringify(filterOptions));
      
      // In a real implementation, you'd apply the filter here
      // For now, we'll just show a success message
      console.log('Filter applied:', filterType, filterOptions);
      setShowFilterModal(false);
    } catch (error) {
      console.error('Error applying filter:', error);
    }
  };

  const handleSubmit = async () => {
    if (!text.trim() && mediaFiles.length === 0) {
      alert('Please add some content to your post');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('text', text);
      formData.append('type', postType);
      formData.append('privacy', privacy);
      formData.append('allowComments', allowComments);
      formData.append('allowShares', allowShares);
      formData.append('allowReactions', allowReactions);
      formData.append('ageRestricted', ageRestricted);
      
      if (location) formData.append('location', JSON.stringify({ name: location }));
      if (scheduledFor) formData.append('scheduledFor', scheduledFor);
      
      mediaFiles.forEach((mediaFile, index) => {
        formData.append('media', mediaFile.file);
      });

      const response = await api.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        // Reset form
        setText('');
        setMediaFiles([]);
        setLocation('');
        setScheduledFor('');
        setPostType('text');
        
        if (onPostCreated) {
          onPostCreated(response.data.data);
        }
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClickOutside = (event) => {
    if (privacyButtonRef.current && !privacyButtonRef.current.contains(event.target)) {
      setShowPrivacyDropdown(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentPrivacy = privacyOptions.find(option => option.id === privacy);

  return (
    <PostCreatorContainer>
      <Header>
        <Avatar src={user?.avatar || '/default-avatar.png'} alt={user?.name} />
        <UserInfo>
          <UserName>{user?.name || 'User'}</UserName>
          <UserHandle>@{user?.handle || 'user'}</UserHandle>
        </UserInfo>
      </Header>

      <PostTypeSelector>
        {postTypes.map(type => (
          <PostTypeButton
            key={type.id}
            active={postType === type.id}
            onClick={() => setPostType(type.id)}
          >
            <type.icon size={18} />
            {type.label}
          </PostTypeButton>
        ))}
      </PostTypeSelector>

      <TextArea
        placeholder="What's on your mind?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={2000}
      />

      {mediaFiles.length > 0 && (
        <MediaPreview>
          {mediaFiles.map((media, index) => (
            <MediaItem key={index}>
              {media.type === 'image' ? (
                <MediaImage src={media.url} alt={media.name} />
              ) : (
                <MediaVideo src={media.url} controls />
              )}
              <MediaRemoveButton onClick={() => handleRemoveMedia(index)}>
                <X size={16} />
              </MediaRemoveButton>
              {media.type === 'image' && (
                <MediaFilterButton onClick={() => {
                  setSelectedMediaIndex(index);
                  setShowFilterModal(true);
                }}>
                  <Filter size={14} />
                  Filter
                </MediaFilterButton>
              )}
            </MediaItem>
          ))}
        </MediaPreview>
      )}

      <MediaUploadArea onClick={() => fileInputRef.current?.click()}>
        <UploadIcon>
          <Plus size={32} />
        </UploadIcon>
        <UploadText>Click to add photos, videos, or audio</UploadText>
      </MediaUploadArea>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*,audio/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      <ControlsRow>
        <MediaButtons>
          <MediaButton onClick={() => fileInputRef.current?.click()}>
            <Image size={18} />
            Photo
          </MediaButton>
          <MediaButton onClick={() => fileInputRef.current?.click()}>
            <Video size={18} />
            Video
          </MediaButton>
          <MediaButton onClick={() => fileInputRef.current?.click()}>
            <Mic size={18} />
            Audio
          </MediaButton>
        </MediaButtons>

        <div style={{ position: 'relative' }} ref={privacyButtonRef}>
          <PrivacyButton onClick={() => setShowPrivacyDropdown(!showPrivacyDropdown)}>
            <currentPrivacy.icon size={18} />
            {currentPrivacy.label}
          </PrivacyButton>
          
          {showPrivacyDropdown && (
            <PrivacyDropdown>
              {privacyOptions.map(option => (
                <PrivacyOption
                  key={option.id}
                  onClick={() => {
                    setPrivacy(option.id);
                    setShowPrivacyDropdown(false);
                  }}
                >
                  <option.icon size={18} />
                  <div>
                    <div>{option.label}</div>
                    <div style={{ fontSize: '0.8rem', color: '#888' }}>
                      {option.description}
                    </div>
                  </div>
                </PrivacyOption>
              ))}
            </PrivacyDropdown>
          )}
        </div>
      </ControlsRow>

      <PostOptions>
        <OptionGroup>
          <OptionLabel>
            <Checkbox
              type="checkbox"
              checked={allowComments}
              onChange={(e) => setAllowComments(e.target.checked)}
            />
            Allow comments
          </OptionLabel>
          <OptionLabel>
            <Checkbox
              type="checkbox"
              checked={allowShares}
              onChange={(e) => setAllowShares(e.target.checked)}
            />
            Allow shares
          </OptionLabel>
        </OptionGroup>
        
        <OptionGroup>
          <OptionLabel>
            <Checkbox
              type="checkbox"
              checked={allowReactions}
              onChange={(e) => setAllowReactions(e.target.checked)}
            />
            Allow reactions
          </OptionLabel>
          <OptionLabel>
            <Checkbox
              type="checkbox"
              checked={ageRestricted}
              onChange={(e) => setAgeRestricted(e.target.checked)}
            />
            Age restricted
          </OptionLabel>
        </OptionGroup>
      </PostOptions>

      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
        <div style={{ flex: 1 }}>
          <LocationInput
            type="text"
            placeholder="Add location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div style={{ flex: 1 }}>
          <ScheduleInput
            type="datetime-local"
            value={scheduledFor}
            onChange={(e) => setScheduledFor(e.target.value)}
          />
        </div>
      </div>

      <ActionButtons>
        <CharacterCount count={text.length}>
          {text.length}/2000
        </CharacterCount>
        
        <PostButton onClick={handleSubmit} disabled={loading}>
          {loading ? 'Posting...' : 'Post'}
        </PostButton>
      </ActionButtons>

      {showFilterModal && (
        <PhotoFilterModal
          isOpen={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          onApplyFilter={handleApplyFilter}
          mediaUrl={mediaFiles[selectedMediaIndex]?.url}
        />
      )}
    </PostCreatorContainer>
  );
};

export default PostCreator;
