import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { 
  Send, 
  Heart, 
  MoreHorizontal, 
  Smile, 
  Image as ImageIcon,
  X,
  Reply,
  ThumbsUp
} from 'lucide-react';
import { api } from '../services/api';

const CommentSectionContainer = styled.div`
  border-top: 1px solid #333;
  background: #1a1a1a;
`;

const CommentInput = styled.div`
  padding: 20px 25px;
  border-bottom: 1px solid #333;
`;

const CommentForm = styled.form`
  display: flex;
  gap: 15px;
  align-items: flex-start;
`;

const CommentAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ff69b4;
`;

const CommentInputArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CommentTextArea = styled.textarea`
  width: 100%;
  min-height: 40px;
  max-height: 120px;
  background: #222;
  border: 1px solid #444;
  border-radius: 20px;
  padding: 12px 20px;
  color: white;
  font-size: 0.9rem;
  font-family: inherit;
  resize: none;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: #ff69b4;
    box-shadow: 0 0 0 2px rgba(255, 105, 180, 0.3);
  }

  &::placeholder {
    color: #888;
  }
`;

const CommentActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CommentMediaButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const CommentMediaButton = styled.button`
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;

  &:hover {
    background: #333;
    color: #ff69b4;
  }
`;

const CommentSubmitButton = styled.button`
  background: linear-gradient(135deg, #ff69b4 0%, #7a288a 100%);
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 3px 10px rgba(255, 105, 180, 0.3);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 5px 15px rgba(255, 105, 180, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const CommentsList = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const CommentItem = styled.div`
  padding: 15px 25px;
  border-bottom: 1px solid #333;
  display: flex;
  gap: 15px;

  &:last-child {
    border-bottom: none;
  }
`;

const CommentAvatarSmall = styled.img`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ff69b4;
`;

const CommentContent = styled.div`
  flex: 1;
`;

const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
`;

const CommentAuthor = styled.span`
  font-weight: 600;
  color: #f8f8f8;
  font-size: 0.9rem;
`;

const CommentTime = styled.span`
  color: #888;
  font-size: 0.8rem;
`;

const CommentMenu = styled.button`
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.3s ease;

  &:hover {
    background: #333;
    color: white;
  }
`;

const CommentText = styled.p`
  margin: 0 0 10px 0;
  color: #f8f8f8;
  line-height: 1.5;
  font-size: 0.9rem;
`;

const CommentMedia = styled.div`
  margin: 10px 0;
  border-radius: 8px;
  overflow: hidden;
`;

const CommentImage = styled.img`
  width: 100%;
  max-width: 200px;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

const CommentActionsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 8px;
`;

const CommentActionButton = styled.button`
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.8rem;
  transition: all 0.3s ease;

  &:hover {
    color: #ff69b4;
  }

  &.active {
    color: #ff69b4;
  }
`;

const ReplySection = styled.div`
  margin-left: 50px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #333;
`;

const ReplyInput = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-start;
  margin-bottom: 10px;
`;

const ReplyTextArea = styled.textarea`
  flex: 1;
  min-height: 35px;
  max-height: 80px;
  background: #222;
  border: 1px solid #444;
  border-radius: 15px;
  padding: 8px 15px;
  color: white;
  font-size: 0.8rem;
  font-family: inherit;
  resize: none;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: #ff69b4;
  }

  &::placeholder {
    color: #888;
  }
`;

const ReplySubmitButton = styled.button`
  background: linear-gradient(135deg, #ff69b4 0%, #7a288a 100%);
  color: white;
  border: none;
  border-radius: 15px;
  padding: 8px 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.8rem;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  color: #888;
`;

const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid #ef4444;
  color: #ef4444;
  padding: 10px 15px;
  margin: 10px 25px;
  border-radius: 8px;
  font-size: 0.9rem;
`;

const CommentSection = ({ postId, user }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showReplies, setShowReplies] = useState({});
  
  const textareaRef = useRef(null);
  const replyTextareaRef = useRef(null);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/comments/post/${postId}`);
      if (response.data.success) {
        setComments(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('postId', postId);
      formData.append('text', commentText);

      const response = await api.post('/comments', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setCommentText('');
        fetchComments(); // Refresh comments
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      setError('Failed to submit comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReply = async (parentCommentId) => {
    if (!replyText.trim()) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('postId', postId);
      formData.append('text', replyText);
      formData.append('parentCommentId', parentCommentId);

      const response = await api.post('/comments', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setReplyText('');
        setReplyingTo(null);
        fetchComments(); // Refresh comments
      }
    } catch (error) {
      console.error('Error submitting reply:', error);
      setError('Failed to submit reply');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      const response = await api.post(`/comments/${commentId}/like`);
      if (response.data.success) {
        setComments(prev => prev.map(comment => 
          comment._id === commentId 
            ? {
                ...comment,
                userEngagement: {
                  ...comment.userEngagement,
                  isLiked: response.data.data.isLiked,
                  userReaction: response.data.data.reaction
                },
                engagement: {
                  ...comment.engagement,
                  likes: response.data.data.isLiked 
                    ? [...comment.engagement.likes, { user: user.id, reaction: 'like' }]
                    : comment.engagement.likes.filter(like => like.user !== user.id)
                }
              }
            : comment
        ));
      }
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const handleToggleReplies = (commentId) => {
    setShowReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const commentDate = new Date(date);
    const diffInSeconds = Math.floor((now - commentDate) / 1000);
    
    if (diffInSeconds < 60) return 'now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d`;
    return commentDate.toLocaleDateString();
  };

  const handleTextareaResize = (textarea) => {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

  const handleReplyTextareaResize = (textarea) => {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 80) + 'px';
  };

  if (loading) {
    return (
      <CommentSectionContainer>
        <LoadingSpinner>Loading comments...</LoadingSpinner>
      </CommentSectionContainer>
    );
  }

  return (
    <CommentSectionContainer>
      <CommentInput>
        <CommentForm onSubmit={handleSubmitComment}>
          <CommentAvatar src={user?.avatar || '/default-avatar.png'} alt={user?.name} />
          <CommentInputArea>
            <CommentTextArea
              ref={textareaRef}
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => {
                setCommentText(e.target.value);
                handleTextareaResize(e.target);
              }}
              onInput={(e) => handleTextareaResize(e.target)}
            />
            <CommentActions>
              <CommentMediaButtons>
                <CommentMediaButton type="button">
                  <Smile size={18} />
                </CommentMediaButton>
                <CommentMediaButton type="button">
                  <ImageIcon size={18} />
                </CommentMediaButton>
              </CommentMediaButtons>
              <CommentSubmitButton type="submit" disabled={submitting || !commentText.trim()}>
                <Send size={16} />
                {submitting ? 'Posting...' : 'Post'}
              </CommentSubmitButton>
            </CommentActions>
          </CommentInputArea>
        </CommentForm>
      </CommentInput>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <CommentsList>
        {comments.map(comment => (
          <div key={comment._id}>
            <CommentItem>
              <CommentAvatarSmall src={comment.author.avatar || '/default-avatar.png'} alt={comment.author.name} />
              <CommentContent>
                <CommentHeader>
                  <CommentAuthor>{comment.author.name}</CommentAuthor>
                  <CommentTime>{formatTimeAgo(comment.createdAt)}</CommentTime>
                  <CommentMenu>
                    <MoreHorizontal size={16} />
                  </CommentMenu>
                </CommentHeader>
                
                <CommentText>{comment.content.text}</CommentText>
                
                {comment.content.media && comment.content.media.length > 0 && (
                  <CommentMedia>
                    {comment.content.media.map((media, index) => (
                      <CommentImage key={index} src={media.url} alt="Comment media" />
                    ))}
                  </CommentMedia>
                )}

                <CommentActionsRow>
                  <CommentActionButton
                    className={comment.userEngagement?.isLiked ? 'active' : ''}
                    onClick={() => handleLikeComment(comment._id)}
                  >
                    <Heart size={14} fill={comment.userEngagement?.isLiked ? 'currentColor' : 'none'} />
                    {comment.engagement.likes.length}
                  </CommentActionButton>
                  
                  <CommentActionButton onClick={() => setReplyingTo(comment._id)}>
                    <Reply size={14} />
                    Reply
                  </CommentActionButton>
                  
                  {comment.engagement.replies.length > 0 && (
                    <CommentActionButton onClick={() => handleToggleReplies(comment._id)}>
                      {showReplies[comment._id] ? 'Hide' : 'Show'} {comment.engagement.replies.length} replies
                    </CommentActionButton>
                  )}
                </CommentActionsRow>

                {replyingTo === comment._id && (
                  <ReplySection>
                    <ReplyInput>
                      <CommentAvatarSmall src={user?.avatar || '/default-avatar.png'} alt={user?.name} />
                      <ReplyTextArea
                        ref={replyTextareaRef}
                        placeholder={`Reply to ${comment.author.name}...`}
                        value={replyText}
                        onChange={(e) => {
                          setReplyText(e.target.value);
                          handleReplyTextareaResize(e.target);
                        }}
                        onInput={(e) => handleReplyTextareaResize(e.target)}
                      />
                      <ReplySubmitButton
                        onClick={() => handleSubmitReply(comment._id)}
                        disabled={submitting || !replyText.trim()}
                      >
                        <Send size={14} />
                        {submitting ? 'Posting...' : 'Reply'}
                      </ReplySubmitButton>
                    </ReplyInput>
                  </ReplySection>
                )}

                {showReplies[comment._id] && comment.engagement.replies.length > 0 && (
                  <ReplySection>
                    {comment.engagement.replies.map(reply => (
                      <CommentItem key={reply._id} style={{ padding: '10px 0' }}>
                        <CommentAvatarSmall src={reply.author.avatar || '/default-avatar.png'} alt={reply.author.name} />
                        <CommentContent>
                          <CommentHeader>
                            <CommentAuthor>{reply.author.name}</CommentAuthor>
                            <CommentTime>{formatTimeAgo(reply.createdAt)}</CommentTime>
                          </CommentHeader>
                          <CommentText>{reply.content.text}</CommentText>
                          <CommentActionsRow>
                            <CommentActionButton
                              className={reply.userEngagement?.isLiked ? 'active' : ''}
                              onClick={() => handleLikeComment(reply._id)}
                            >
                              <Heart size={14} fill={reply.userEngagement?.isLiked ? 'currentColor' : 'none'} />
                              {reply.engagement.likes.length}
                            </CommentActionButton>
                          </CommentActionsRow>
                        </CommentContent>
                      </CommentItem>
                    ))}
                  </ReplySection>
                )}
              </CommentContent>
            </CommentItem>
          </div>
        ))}
      </CommentsList>
    </CommentSectionContainer>
  );
};

export default CommentSection;
