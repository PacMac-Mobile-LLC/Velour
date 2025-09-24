import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  MessageCircle, 
  Send, 
  Search, 
  MoreHorizontal,
  Star,
  Archive,
  Trash2,
  User,
  Clock,
  Check,
  CheckCheck,
  Paperclip,
  Smile,
  Settings,
  Filter,
  Plus,
  Phone,
  Video
} from 'lucide-react';
import { dashboardService } from '../services/dashboardService';

const MessagesContainer = styled.div`
  display: flex;
  height: calc(100vh - 120px);
  background: #000;
  border-radius: 15px;
  overflow: hidden;
`;

const ConversationsSidebar = styled.div`
  width: 350px;
  background: rgba(42, 42, 42, 0.6);
  border-right: 1px solid #444;
  display: flex;
  flex-direction: column;
`;

const SidebarHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #444;
`;

const SidebarTitle = styled.h2`
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 15px 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SearchBar = styled.div`
  position: relative;
  margin-bottom: 15px;
`;

const SearchInput = styled.input`
  width: 100%;
  background: rgba(42, 42, 42, 0.8);
  border: 1px solid #444;
  border-radius: 10px;
  padding: 12px 15px 12px 45px;
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

const SearchIcon = styled.div`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
`;

const SidebarActions = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button`
  background: rgba(42, 42, 42, 0.8);
  border: 1px solid #444;
  border-radius: 8px;
  padding: 8px 12px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;

  &:hover {
    border-color: #ff69b4;
    background: rgba(255, 105, 180, 0.1);
  }
`;

const ConversationsList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px 0;
`;

const ConversationItem = styled.div`
  padding: 15px 20px;
  border-bottom: 1px solid rgba(68, 68, 68, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    background: rgba(255, 105, 180, 0.05);
  }

  ${props => props.active && `
    background: rgba(255, 105, 180, 0.1);
    border-left: 3px solid #ff69b4;
  `}
`;

const ConversationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const UserAvatar = styled.div`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff69b4 0%, #7a288a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.1rem;
`;

const UserDetails = styled.div`
  flex: 1;
`;

const UserName = styled.h4`
  color: white;
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 2px 0;
`;

const UserStatus = styled.span`
  color: #888;
  font-size: 0.8rem;
`;

const MessageTime = styled.span`
  color: #888;
  font-size: 0.8rem;
`;

const MessagePreview = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MessageText = styled.p`
  color: #ccc;
  font-size: 0.9rem;
  margin: 0;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const MessageStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const UnreadBadge = styled.div`
  background: #ff69b4;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: bold;
`;

const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: rgba(42, 42, 42, 0.3);
`;

const ChatHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #444;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ChatUserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const ChatUserAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff69b4 0%, #7a288a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
`;

const ChatUserDetails = styled.div``;

const ChatUserName = styled.h3`
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 5px 0;
`;

const ChatUserStatus = styled.span`
  color: #22c55e;
  font-size: 0.9rem;
`;

const ChatActions = styled.div`
  display: flex;
  gap: 10px;
`;

const ChatActionButton = styled.button`
  background: rgba(42, 42, 42, 0.8);
  border: 1px solid #444;
  border-radius: 8px;
  padding: 10px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #ff69b4;
    background: rgba(255, 105, 180, 0.1);
  }
`;

const MessagesList = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const MessageBubble = styled.div`
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 18px;
  position: relative;
  align-self: ${props => props.sent ? 'flex-end' : 'flex-start'};
  background: ${props => props.sent 
    ? 'linear-gradient(135deg, #ff69b4 0%, #7a288a 100%)' 
    : 'rgba(42, 42, 42, 0.8)'};
  color: white;
  border: 1px solid ${props => props.sent ? '#ff69b4' : '#444'};
`;

const MessageContent = styled.p`
  margin: 0 0 5px 0;
  line-height: 1.4;
`;

const MessageMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: ${props => props.sent ? 'rgba(255, 255, 255, 0.8)' : '#888'};
`;

const MessageInput = styled.div`
  padding: 20px;
  border-top: 1px solid #444;
  display: flex;
  gap: 15px;
  align-items: flex-end;
`;

const InputContainer = styled.div`
  flex: 1;
  position: relative;
`;

const MessageTextarea = styled.textarea`
  width: 100%;
  background: rgba(42, 42, 42, 0.8);
  border: 1px solid #444;
  border-radius: 20px;
  padding: 12px 50px 12px 20px;
  color: white;
  font-size: 1rem;
  outline: none;
  resize: none;
  min-height: 45px;
  max-height: 120px;
  transition: all 0.3s ease;

  &:focus {
    border-color: #ff69b4;
    box-shadow: 0 0 0 3px rgba(255, 105, 180, 0.2);
  }

  &::placeholder {
    color: #888;
  }
`;

const InputActions = styled.div`
  position: absolute;
  right: 10px;
  bottom: 10px;
  display: flex;
  gap: 5px;
`;

const InputActionButton = styled.button`
  background: transparent;
  border: none;
  color: #888;
  cursor: pointer;
  padding: 5px;
  border-radius: 5px;
  transition: all 0.3s ease;

  &:hover {
    color: #ff69b4;
    background: rgba(255, 105, 180, 0.1);
  }
`;

const SendButton = styled.button`
  background: linear-gradient(135deg, #ff69b4 0%, #7a288a 100%);
  border: none;
  border-radius: 50%;
  width: 45px;
  height: 45px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 5px 15px rgba(255, 105, 180, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const EmptyState = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #888;
  text-align: center;
  padding: 40px;
`;

const EmptyIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(42, 42, 42, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
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
  max-width: 300px;
`;

const MessagesTab = () => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (activeConversation) {
      loadMessages(activeConversation.id);
    }
  }, [activeConversation]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const result = await dashboardService.getConversations();
      
      if (result.success) {
        setConversations(result.data || []);
      } else {
        // Use mock data for now
        const mockConversations = [
          {
            id: '1',
            user: { name: 'Sarah Johnson', avatar: 'S', status: 'online' },
            lastMessage: 'Thanks for the amazing content!',
            time: '2 min ago',
            unreadCount: 2,
            isOnline: true
          },
          {
            id: '2',
            user: { name: 'Mike Chen', avatar: 'M', status: 'offline' },
            lastMessage: 'When is your next live session?',
            time: '1 hour ago',
            unreadCount: 0,
            isOnline: false
          },
          {
            id: '3',
            user: { name: 'Emma Wilson', avatar: 'E', status: 'online' },
            lastMessage: 'Love your new photos! 🔥',
            time: '3 hours ago',
            unreadCount: 1,
            isOnline: true
          },
          {
            id: '4',
            user: { name: 'Alex Rodriguez', avatar: 'A', status: 'away' },
            lastMessage: 'Can you send me the link?',
            time: '1 day ago',
            unreadCount: 0,
            isOnline: false
          }
        ];
        setConversations(mockConversations);
        if (mockConversations.length > 0) {
          setActiveConversation(mockConversations[0]);
        }
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const result = await dashboardService.getMessages(conversationId);
      
      if (result.success) {
        setMessages(result.data || []);
      } else {
        // Use mock data for now
        const mockMessages = [
          {
            id: '1',
            content: 'Hey! How are you doing today?',
            sent: false,
            time: '2:30 PM',
            status: 'read'
          },
          {
            id: '2',
            content: 'I\'m doing great! Just finished editing some new content. How about you?',
            sent: true,
            time: '2:32 PM',
            status: 'read'
          },
          {
            id: '3',
            content: 'That\'s awesome! I can\'t wait to see it. I\'m doing well too, just working on some projects.',
            sent: false,
            time: '2:35 PM',
            status: 'read'
          },
          {
            id: '4',
            content: 'Thanks for the amazing content!',
            sent: false,
            time: '2:40 PM',
            status: 'delivered'
          },
          {
            id: '5',
            content: 'You\'re so welcome! I really appreciate your support 💕',
            sent: true,
            time: '2:42 PM',
            status: 'sent'
          }
        ];
        setMessages(mockMessages);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeConversation) return;

    try {
      const result = await dashboardService.sendMessage(
        activeConversation.id,
        newMessage.trim()
      );

      if (result.success) {
        const newMsg = {
          id: Date.now().toString(),
          content: newMessage.trim(),
          sent: true,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'sent'
        };
        setMessages(prev => [...prev, newMsg]);
        setNewMessage('');
      } else {
        // Add message optimistically for demo
        const newMsg = {
          id: Date.now().toString(),
          content: newMessage.trim(),
          sent: true,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'sent'
        };
        setMessages(prev => [...prev, newMsg]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent': return <Check size={12} />;
      case 'delivered': return <CheckCheck size={12} />;
      case 'read': return <CheckCheck size={12} style={{ color: '#22c55e' }} />;
      default: return null;
    }
  };

  const getFilteredConversations = () => {
    if (!searchQuery) return conversations;
    return conversations.filter(conv => 
      conv.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleVoiceCall = async (conversationId) => {
    try {
      // Create a room for voice call
      const roomId = `voice-${conversationId}-${Date.now()}`;
      
      // Navigate to video room with voice-only mode
      window.open(`/room/${roomId}?mode=voice`, '_blank');
      
      // Send call notification to the other user
      await dashboardService.sendMessage(conversationId, {
        type: 'call_notification',
        callType: 'voice',
        roomId: roomId,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Error starting voice call:', error);
      alert('Failed to start voice call. Please try again.');
    }
  };

  const handleVideoCall = async (conversationId) => {
    try {
      // Create a room for video call
      const roomId = `video-${conversationId}-${Date.now()}`;
      
      // Navigate to video room
      window.open(`/room/${roomId}`, '_blank');
      
      // Send call notification to the other user
      await dashboardService.sendMessage(conversationId, {
        type: 'call_notification',
        callType: 'video',
        roomId: roomId,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Error starting video call:', error);
      alert('Failed to start video call. Please try again.');
    }
  };

  if (loading) {
    return (
      <MessagesContainer>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100%', 
          color: '#888' 
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '50px', 
              height: '50px', 
              border: '3px solid rgba(255, 105, 180, 0.3)',
              borderTop: '3px solid #ff69b4',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }}></div>
            Loading messages...
          </div>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </MessagesContainer>
    );
  }

  return (
    <MessagesContainer>
      <ConversationsSidebar>
        <SidebarHeader>
          <SidebarTitle>
            <MessageCircle size={24} />
            Messages
          </SidebarTitle>
          <SearchBar>
            <SearchIcon>
              <Search size={18} />
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchBar>
          <SidebarActions>
            <ActionButton>
              <Plus size={16} />
              New Chat
            </ActionButton>
            <ActionButton>
              <Filter size={16} />
              Filter
            </ActionButton>
            <ActionButton>
              <Settings size={16} />
            </ActionButton>
          </SidebarActions>
        </SidebarHeader>

        <ConversationsList>
          {getFilteredConversations().map((conversation) => (
            <ConversationItem
              key={conversation.id}
              active={activeConversation?.id === conversation.id}
              onClick={() => setActiveConversation(conversation)}
            >
              <ConversationHeader>
                <UserInfo>
                  <UserAvatar>{conversation.user.avatar}</UserAvatar>
                  <UserDetails>
                    <UserName>{conversation.user.name}</UserName>
                    <UserStatus>
                      {conversation.isOnline ? 'Online' : 'Offline'}
                    </UserStatus>
                  </UserDetails>
                </UserInfo>
                <MessageTime>{conversation.time}</MessageTime>
              </ConversationHeader>
              <MessagePreview>
                <MessageText>{conversation.lastMessage}</MessageText>
                <MessageStatus>
                  {conversation.unreadCount > 0 && (
                    <UnreadBadge>{conversation.unreadCount}</UnreadBadge>
                  )}
                </MessageStatus>
              </MessagePreview>
            </ConversationItem>
          ))}
        </ConversationsList>
      </ConversationsSidebar>

      <ChatArea>
        {activeConversation ? (
          <>
            <ChatHeader>
              <ChatUserInfo>
                <ChatUserAvatar>{activeConversation.user.avatar}</ChatUserAvatar>
                <ChatUserDetails>
                  <ChatUserName>{activeConversation.user.name}</ChatUserName>
                  <ChatUserStatus>
                    {activeConversation.isOnline ? 'Online' : 'Offline'}
                  </ChatUserStatus>
                </ChatUserDetails>
              </ChatUserInfo>
              <ChatActions>
                <ChatActionButton onClick={() => handleVoiceCall(activeConversation.id)}>
                  <Phone size={18} />
                </ChatActionButton>
                <ChatActionButton onClick={() => handleVideoCall(activeConversation.id)}>
                  <Video size={18} />
                </ChatActionButton>
                <ChatActionButton>
                  <MoreHorizontal size={18} />
                </ChatActionButton>
              </ChatActions>
            </ChatHeader>

            <MessagesList>
              {messages.map((message) => (
                <MessageBubble key={message.id} sent={message.sent}>
                  <MessageContent>{message.content}</MessageContent>
                  <MessageMeta sent={message.sent}>
                    <span>{message.time}</span>
                    {message.sent && getStatusIcon(message.status)}
                  </MessageMeta>
                </MessageBubble>
              ))}
            </MessagesList>

            <MessageInput>
              <InputContainer>
                <MessageTextarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  rows={1}
                />
                <InputActions>
                  <InputActionButton>
                    <Paperclip size={18} />
                  </InputActionButton>
                  <InputActionButton>
                    <Smile size={18} />
                  </InputActionButton>
                </InputActions>
              </InputContainer>
              <SendButton onClick={sendMessage} disabled={!newMessage.trim()}>
                <Send size={20} />
              </SendButton>
            </MessageInput>
          </>
        ) : (
          <EmptyState>
            <EmptyIcon>
              <MessageCircle size={32} />
            </EmptyIcon>
            <EmptyTitle>Select a conversation</EmptyTitle>
            <EmptyDescription>
              Choose a conversation from the sidebar to start messaging
            </EmptyDescription>
          </EmptyState>
        )}
      </ChatArea>
    </MessagesContainer>
  );
};

export default MessagesTab;
