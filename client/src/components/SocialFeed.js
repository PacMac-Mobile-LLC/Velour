import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  MoreHorizontal,
  ThumbsUp,
  Smile,
  Frown,
  Angry,
  Star,
  Flame,
  Sparkles,
  Eye,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Download,
  Flag,
  UserPlus,
  UserCheck,
  Calendar,
  MapPin,
  Hash,
  AtSign,
  ExternalLink
} from 'lucide-react';
import { api } from '../services/api';
import PostCreator from './PostCreator';
import CommentSection from './CommentSection';

const FeedContainer = styled.div`
  background: #111;
  min-height: 100vh;
  color: white;
`;

const FeedHeader = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  padding: 20px 30px;
  border-bottom: 1px solid #333;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const FeedTitle = styled.h1`
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: #ff69b4;
  display: flex;
  align-items: center;
  gap: 15px;
`;

const FeedContent = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
`;

const PostCard = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  border-radius: 15px;
  margin-bottom: 20px;
  border: 1px solid #333;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 25px rgba(0, 0, 0, 0.4);
  }
`;

const PostHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 20px 25px 15px;
  gap: 15px;
`;

const PostAvatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ff69b4;
`;

const PostUserInfo = styled.div`
  flex: 1;
`;

const PostUserName = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  color: #f8f8f8;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const VerifiedBadge = styled.span`
  color: #1da1f2;
  font-size: 1rem;
`;

const PostUserHandle = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: #bbb;
`;

const PostMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 5px;
  font-size: 0.8rem;
  color: #888;
`;

const PostMenu = styled.button`
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;

  &:hover {
    background: #333;
    color: white;
  }
`;

const PostContent = styled.div`
  padding: 0 25px 20px;
`;

const PostText = styled.p`
  margin: 0 0 15px 0;
  line-height: 1.6;
  color: #f8f8f8;
  font-size: 1rem;
`;

const PostMedia = styled.div`
  margin: 15px 0;
  border-radius: 10px;
  overflow: hidden;
  background: #222;
`;

const PostImage = styled.img`
  width: 100%;
  max-height: 500px;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

const PostVideo = styled.video`
  width: 100%;
  max-height: 500px;
  object-fit: cover;
`;

const VideoControls = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(0, 0, 0, 0.7);
  padding: 10px;
  border-radius: 8px;
  opacity: 0;
  transition: opacity 0.3s ease;
`;

const VideoContainer = styled.div`
  position: relative;

  &:hover ${VideoControls} {
    opacity: 1;
  }
`;

const ControlButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const VideoProgress = styled.div`
  flex: 1;
  height: 4px;
  background: #333;
  border-radius: 2px;
  overflow: hidden;
`;

const VideoProgressBar = styled.div`
  height: 100%;
  background: #ff69b4;
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

const PostActions = styled.div`
  display: flex;
  align-items: center;
  padding: 15px 25px;
  border-top: 1px solid #333;
  gap: 20px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.active ? '#ff69b4' : '#888'};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  font-weight: 500;

  &:hover {
    background: ${props => props.active ? 'rgba(255, 105, 180, 0.1)' : '#333'};
    color: ${props => props.active ? '#ff69b4' : 'white'};
    transform: translateY(-1px);
  }
`;

const ReactionButton = styled.button`
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    background: #333;
    color: white;
    transform: scale(1.2);
  }

  &.active {
    color: #ff69b4;
    background: rgba(255, 105, 180, 0.1);
  }
`;

const ReactionCount = styled.span`
  font-size: 0.8rem;
  color: #bbb;
  margin-left: 5px;
`;

const PostStats = styled.div`
  padding: 15px 25px;
  border-top: 1px solid #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: #bbb;
`;

const StatItem = styled.span`
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #ff69b4;
  }
`;

const HashtagLink = styled.span`
  color: #1da1f2;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #0d8bd9;
    text-decoration: underline;
  }
`;

const MentionLink = styled.span`
  color: #ff69b4;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #ff7abf;
    text-decoration: underline;
  }
`;

const LinkPreview = styled.div`
  border: 1px solid #333;
  border-radius: 10px;
  overflow: hidden;
  margin: 10px 0;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #ff69b4;
    transform: translateY(-2px);
  }
`;

const LinkImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const LinkContent = styled.div`
  padding: 15px;
`;

const LinkTitle = styled.h4`
  margin: 0 0 8px 0;
  color: #f8f8f8;
  font-size: 1rem;
`;

const LinkDescription = styled.p`
  margin: 0 0 8px 0;
  color: #bbb;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const LinkDomain = styled.span`
  color: #888;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  color: #888;
`;

const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid #ef4444;
  color: #ef4444;
  padding: 15px;
  border-radius: 10px;
  margin: 20px 0;
  text-align: center;
`;

const SocialFeed = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showComments, setShowComments] = useState({});
  const [playingVideo, setPlayingVideo] = useState(null);

  const reactions = [
    { id: 'like', icon: ThumbsUp, color: '#1da1f2' },
    { id: 'love', icon: Heart, color: '#e91e63' },
    { id: 'laugh', icon: Smile, color: '#ff9800' },
    { id: 'wow', icon: Star, color: '#ff5722' },
    { id: 'sad', icon: Frown, color: '#2196f3' },
    { id: 'angry', icon: Angry, color: '#f44336' },
    { id: 'fire', icon: Flame, color: '#ff6b35' },
    { id: 'heart_eyes', icon: Sparkles, color: '#e91e63' }
  ];

  const fetchPosts = useCallback(async (pageNum = 1, reset = false) => {
    try {
      setLoading(true);
      const response = await api.get('/posts', {
        params: { page: pageNum, limit: 10 }
      });

      if (response.data.success) {
        const newPosts = response.data.data;
        setPosts(prev => reset ? newPosts : [...prev, ...newPosts]);
        setHasMore(newPosts.length === 10);
        setPage(pageNum);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(1, true);
  }, [fetchPosts]);

  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
  };

  const handleLike = async (postId, reaction = 'like') => {
    try {
      const response = await api.post(`/posts/${postId}/like`, { reaction });
      if (response.data.success) {
        setPosts(prev => prev.map(post => 
          post._id === postId 
            ? {
                ...post,
                userEngagement: {
                  ...post.userEngagement,
                  isLiked: response.data.data.isLiked,
                  userReaction: response.data.data.reaction
                },
                engagement: {
                  ...post.engagement,
                  likes: response.data.data.isLiked 
                    ? [...post.engagement.likes, { user: user.id, reaction }]
                    : post.engagement.likes.filter(like => like.user !== user.id)
                }
              }
            : post
        ));
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleShare = async (postId, shareType = 'share', shareText = '') => {
    try {
      const response = await api.post(`/posts/${postId}/share`, { shareType, shareText });
      if (response.data.success) {
        setPosts(prev => prev.map(post => 
          post._id === postId 
            ? {
                ...post,
                engagement: {
                  ...post.engagement,
                  shares: [...post.engagement.shares, { user: user.id, shareType, shareText }]
                }
              }
            : post
        ));
      }
    } catch (error) {
      console.error('Error sharing post:', error);
    }
  };

  const handleSave = async (postId) => {
    try {
      const response = await api.post(`/posts/${postId}/save`);
      if (response.data.success) {
        setPosts(prev => prev.map(post => 
          post._id === postId 
            ? {
                ...post,
                userEngagement: {
                  ...post.userEngagement,
                  isSaved: response.data.data.isSaved
                },
                engagement: {
                  ...post.engagement,
                  saves: response.data.data.isSaved 
                    ? [...post.engagement.saves, { user: user.id }]
                    : post.engagement.saves.filter(save => save.user !== user.id)
                }
              }
            : post
        ));
      }
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  const handleToggleComments = (postId) => {
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleVideoPlay = (postId) => {
    setPlayingVideo(playingVideo === postId ? null : postId);
  };

  const formatText = (text) => {
    if (!text) return '';
    
    // Replace hashtags
    let formattedText = text.replace(/#(\w+)/g, '<span class="hashtag">#$1</span>');
    
    // Replace mentions
    formattedText = formattedText.replace(/@(\w+)/g, '<span class="mention">@$1</span>');
    
    // Replace URLs
    formattedText = formattedText.replace(/(https?:\/\/[^\s]+)/g, '<span class="link">$1</span>');
    
    return formattedText;
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInSeconds = Math.floor((now - postDate) / 1000);
    
    if (diffInSeconds < 60) return 'now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d`;
    return postDate.toLocaleDateString();
  };

  const loadMorePosts = () => {
    if (!loading && hasMore) {
      fetchPosts(page + 1, false);
    }
  };

  if (error) {
    return (
      <FeedContainer>
        <FeedHeader>
          <FeedTitle>Social Feed</FeedTitle>
        </FeedHeader>
        <FeedContent>
          <ErrorMessage>{error}</ErrorMessage>
        </FeedContent>
      </FeedContainer>
    );
  }

  return (
    <FeedContainer>
      <FeedHeader>
        <FeedTitle>Social Feed</FeedTitle>
      </FeedHeader>
      
      <FeedContent>
        <PostCreator user={user} onPostCreated={handlePostCreated} />
        
        {posts.map(post => (
          <PostCard key={post._id}>
            <PostHeader>
              <PostAvatar src={post.author.avatar || '/default-avatar.png'} alt={post.author.name} />
              <PostUserInfo>
                <PostUserName>
                  {post.author.name}
                  {post.author.verified && <VerifiedBadge>✓</VerifiedBadge>}
                </PostUserName>
                <PostUserHandle>@{post.author.handle}</PostUserHandle>
                <PostMeta>
                  <span>{formatTimeAgo(post.createdAt)}</span>
                  {post.location && (
                    <>
                      <span>•</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={12} />
                        {post.location.name}
                      </span>
                    </>
                  )}
                </PostMeta>
              </PostUserInfo>
              <PostMenu>
                <MoreHorizontal size={20} />
              </PostMenu>
            </PostHeader>

            <PostContent>
              {post.content.text && (
                <PostText 
                  dangerouslySetInnerHTML={{ __html: formatText(post.content.text) }}
                />
              )}

              {post.content.media && post.content.media.length > 0 && (
                <PostMedia>
                  {post.content.media.map((media, index) => (
                    <div key={index}>
                      {media.type === 'image' ? (
                        <PostImage src={media.url} alt="Post media" />
                      ) : media.type === 'video' ? (
                        <VideoContainer>
                          <PostVideo
                            src={media.url}
                            controls={playingVideo === post._id}
                            onPlay={() => setPlayingVideo(post._id)}
                            onPause={() => setPlayingVideo(null)}
                          />
                          {!playingVideo && (
                            <VideoControls>
                              <ControlButton onClick={() => handleVideoPlay(post._id)}>
                                <Play size={20} />
                              </ControlButton>
                              <VideoProgress>
                                <VideoProgressBar progress={0} />
                              </VideoProgress>
                            </VideoControls>
                          )}
                        </VideoContainer>
                      ) : (
                        <div style={{ padding: '20px', textAlign: 'center' }}>
                          <audio src={media.url} controls style={{ width: '100%' }} />
                        </div>
                      )}
                    </div>
                  ))}
                </PostMedia>
              )}

              {post.content.links && post.content.links.length > 0 && (
                <div>
                  {post.content.links.map((link, index) => (
                    <LinkPreview key={index}>
                      {link.image && <LinkImage src={link.image} alt={link.title} />}
                      <LinkContent>
                        <LinkTitle>{link.title}</LinkTitle>
                        <LinkDescription>{link.description}</LinkDescription>
                        <LinkDomain>
                          <ExternalLink size={12} />
                          {link.domain}
                        </LinkDomain>
                      </LinkContent>
                    </LinkPreview>
                  ))}
                </div>
              )}
            </PostContent>

            <PostStats>
              <StatItem>
                {post.engagement.likes.length} {post.engagement.likes.length === 1 ? 'like' : 'likes'}
              </StatItem>
              <StatItem onClick={() => handleToggleComments(post._id)}>
                {post.engagement.comments.length} {post.engagement.comments.length === 1 ? 'comment' : 'comments'}
              </StatItem>
              <StatItem>
                {post.engagement.shares.length} {post.engagement.shares.length === 1 ? 'share' : 'shares'}
              </StatItem>
            </PostStats>

            <PostActions>
              <ActionButton
                active={post.userEngagement.isLiked}
                onClick={() => handleLike(post._id, post.userEngagement.userReaction || 'like')}
              >
                <Heart size={20} fill={post.userEngagement.isLiked ? 'currentColor' : 'none'} />
                Like
              </ActionButton>
              
              <ActionButton onClick={() => handleToggleComments(post._id)}>
                <MessageCircle size={20} />
                Comment
              </ActionButton>
              
              <ActionButton onClick={() => handleShare(post._id)}>
                <Share2 size={20} />
                Share
              </ActionButton>
              
              <ActionButton
                active={post.userEngagement.isSaved}
                onClick={() => handleSave(post._id)}
              >
                <Bookmark size={20} fill={post.userEngagement.isSaved ? 'currentColor' : 'none'} />
                Save
              </ActionButton>
            </PostActions>

            {showComments[post._id] && (
              <CommentSection postId={post._id} user={user} />
            )}
          </PostCard>
        ))}

        {loading && (
          <LoadingSpinner>Loading more posts...</LoadingSpinner>
        )}

        {!loading && hasMore && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <button 
              onClick={loadMorePosts}
              style={{
                background: 'linear-gradient(135deg, #ff69b4 0%, #7a288a 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '12px 25px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600'
              }}
            >
              Load More Posts
            </button>
          </div>
        )}
      </FeedContent>
    </FeedContainer>
  );
};

export default SocialFeed;
