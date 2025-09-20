import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import styled from 'styled-components';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Monitor, 
  MessageSquare, 
  Phone, 
  Users,
  Send
} from 'lucide-react';

const Container = styled.div`
  min-height: 100vh;
  background: #1a1a1a;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  background: #2d2d2d;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
`;

const RoomInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const RoomId = styled.span`
  font-weight: 600;
  font-size: 1.1rem;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  position: relative;
`;

const VideoGrid = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 10px;
  padding: 20px;
  align-content: start;
`;

const VideoContainer = styled.div`
  position: relative;
  background: #333;
  border-radius: 10px;
  overflow: hidden;
  aspect-ratio: 16/9;
  min-height: 200px;
`;

const StyledVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const VideoLabel = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 0.9rem;
`;

const ChatPanel = styled.div`
  width: 350px;
  background: #2d2d2d;
  display: flex;
  flex-direction: column;
  border-left: 1px solid #444;
`;

const ChatHeader = styled.div`
  padding: 15px 20px;
  border-bottom: 1px solid #444;
  color: white;
  font-weight: 600;
`;

const ChatMessages = styled.div`
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Message = styled.div`
  background: ${props => props.isOwn ? '#667eea' : '#444'};
  color: white;
  padding: 10px 15px;
  border-radius: 10px;
  max-width: 80%;
  align-self: ${props => props.isOwn ? 'flex-end' : 'flex-start'};
  word-wrap: break-word;
`;

const MessageSender = styled.div`
  font-size: 0.8rem;
  opacity: 0.7;
  margin-bottom: 5px;
`;

const ChatInput = styled.div`
  padding: 15px;
  border-top: 1px solid #444;
  display: flex;
  gap: 10px;
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #555;
  border-radius: 20px;
  background: #333;
  color: white;
  font-size: 0.9rem;

  &:focus {
    outline: none;
    border-color: #667eea;
  }

  &::placeholder {
    color: #999;
  }
`;

const SendButton = styled.button`
  background: #667eea;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #5a6fd8;
  }
`;

const Controls = styled.div`
  background: #2d2d2d;
  padding: 20px;
  display: flex;
  justify-content: center;
  gap: 15px;
  border-top: 1px solid #444;
`;

const ControlButton = styled.button`
  background: ${props => props.active ? '#667eea' : '#444'};
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.active ? '#5a6fd8' : '#555'};
  }

  &.leave {
    background: #dc3545;
    
    &:hover {
      background: #c82333;
    }
  }
`;

const VideoRoom = () => {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [socket, setSocket] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState(new Map());
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [participants, setParticipants] = useState(1);
  const [isInitiator, setIsInitiator] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRefs = useRef(new Map());
  const peerConnections = useRef(new Map());
  const userName = searchParams.get('name') || 'Anonymous';

  // Initialize socket connection
  useEffect(() => {
    const socketUrl = process.env.NODE_ENV === 'production' 
      ? window.location.origin 
      : 'http://localhost:5001';
    const newSocket = io(socketUrl);
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  // Create peer connection
  const createPeerConnection = useCallback((userId) => {
    console.log('Creating peer connection for user:', userId);
    const peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    });

    // Add local stream tracks
    if (localStream) {
      localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
        console.log('Added track to peer connection:', track.kind);
      });
    } else {
      console.log('No local stream available when creating peer connection');
    }

    // Handle remote stream
    peerConnection.ontrack = (event) => {
      console.log('Received remote stream from:', userId);
      const [remoteStream] = event.streams;
      setRemoteStreams(prev => new Map(prev).set(userId, remoteStream));
    };

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('Sending ICE candidate to:', userId);
        socket.emit('ice-candidate', {
          candidate: event.candidate,
          roomId,
          userId
        });
      }
    };

    // Handle connection state changes
    peerConnection.onconnectionstatechange = () => {
      console.log(`Connection state with ${userId}:`, peerConnection.connectionState);
    };

    peerConnections.current.set(userId, peerConnection);
  }, [localStream, socket, roomId]);

  // Handle offer received
  const handleOfferReceived = useCallback(async (data) => {
    const { offer, userId } = data;
    console.log('Processing offer from:', userId);
    let peerConnection = peerConnections.current.get(userId);
    
    if (!peerConnection) {
      console.log('Creating new peer connection for offer from:', userId);
      createPeerConnection(userId);
      peerConnection = peerConnections.current.get(userId);
    }

    try {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      console.log('Set remote description for:', userId);
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      console.log('Created and set local answer for:', userId);
      
      socket.emit('answer', {
        answer,
        roomId,
        userId
      });
      console.log('Sent answer to:', userId);
    } catch (error) {
      console.error('Error handling offer:', error);
    }
  }, [createPeerConnection, socket, roomId]);

  // Handle answer received
  const handleAnswerReceived = useCallback(async (data) => {
    const { answer, userId } = data;
    console.log('Processing answer from:', userId);
    const peerConnection = peerConnections.current.get(userId);
    
    if (peerConnection) {
      try {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
        console.log('Set remote answer for:', userId);
      } catch (error) {
        console.error('Error handling answer:', error);
      }
    } else {
      console.error('No peer connection found for answer from:', userId);
    }
  }, []);

  // Handle ICE candidate received
  const handleIceCandidateReceived = useCallback(async (data) => {
    const { candidate, userId } = data;
    const peerConnection = peerConnections.current.get(userId);
    
    if (peerConnection) {
      try {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        console.error('Error handling ICE candidate:', error);
      }
    }
  }, []);

  // Send offer to new user
  const sendOffer = useCallback(async (userId) => {
    const peerConnection = peerConnections.current.get(userId);
    if (!peerConnection) {
      console.log('No peer connection found for user:', userId);
      return;
    }

    try {
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      
      socket.emit('offer', {
        offer,
        roomId,
        userId
      });
      console.log('Offer sent to user:', userId);
    } catch (error) {
      console.error('Error sending offer:', error);
    }
  }, [socket, roomId]);

  // Initialize local media stream
  useEffect(() => {
    const initLocalStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing media devices:', error);
        alert('Unable to access camera and microphone. Please check permissions.');
      }
    };

    initLocalStream();
  }, []);

  // Socket event handlers
  useEffect(() => {
    if (!socket) return;

    const handleUserConnected = (userId) => {
      console.log('User connected:', userId);
      // Only increment if it's not ourselves
      if (userId !== userName) {
        setParticipants(prev => prev + 1);
        createPeerConnection(userId);
        
        // Only send offer if we are the initiator (first user or designated initiator)
        if (isInitiator) {
          console.log('Sending offer as initiator to:', userId);
          setTimeout(() => {
            sendOffer(userId);
          }, 1000); // Small delay to ensure peer connection is ready
        } else {
          console.log('Waiting for offer from initiator:', userId);
        }
      } else {
        console.log('Ignoring self-connection event for:', userId);
      }
    };

    const handleUserDisconnected = (userId) => {
      console.log('User disconnected:', userId);
      setParticipants(prev => prev - 1);
      if (peerConnections.current.has(userId)) {
        peerConnections.current.get(userId).close();
        peerConnections.current.delete(userId);
      }
      setRemoteStreams(prev => {
        const newStreams = new Map(prev);
        newStreams.delete(userId);
        return newStreams;
      });
    };

    const handleOffer = async (data) => {
      console.log('Received offer from:', data.userId);
      await handleOfferReceived(data);
    };

    const handleAnswer = async (data) => {
      console.log('Received answer from:', data.userId);
      await handleAnswerReceived(data);
    };

    const handleIceCandidate = async (data) => {
      console.log('Received ICE candidate from:', data.userId);
      await handleIceCandidateReceived(data);
    };

    const handleMessage = (data) => {
      setMessages(prev => [...prev, data]);
    };

    socket.on('user-connected', handleUserConnected);
    socket.on('user-disconnected', handleUserDisconnected);
    socket.on('offer', handleOffer);
    socket.on('answer', handleAnswer);
    socket.on('ice-candidate', handleIceCandidate);
    socket.on('receive-message', handleMessage);

    return () => {
      socket.off('user-connected', handleUserConnected);
      socket.off('user-disconnected', handleUserDisconnected);
      socket.off('offer', handleOffer);
      socket.off('answer', handleAnswer);
      socket.off('ice-candidate', handleIceCandidate);
      socket.off('receive-message', handleMessage);
    };
  }, [socket, sendOffer, createPeerConnection, handleOfferReceived, handleAnswerReceived, handleIceCandidateReceived, isInitiator, userName]);

  // Join room when socket is ready
  useEffect(() => {
    if (socket && roomId) {
      socket.emit('join-room', roomId, userName);
    }
  }, [socket, roomId, userName]);

  // Listen for room-joined event to determine if we're the initiator
  useEffect(() => {
    if (!socket) return;

    const handleRoomJoined = (data) => {
      console.log('Room joined response:', data);
      if (data.isInitiator) {
        setIsInitiator(true);
        console.log('I am the initiator for this room');
      } else {
        setIsInitiator(false);
        console.log('I am not the initiator, waiting for offers');
      }
      
      // Set the correct participant count
      if (data.totalParticipants) {
        setParticipants(data.totalParticipants);
        console.log(`Total participants in room: ${data.totalParticipants}`);
      }
      
      // Create peer connections for existing participants
      if (data.existingParticipants && data.existingParticipants.length > 0) {
        console.log('Creating peer connections for existing participants:', data.existingParticipants);
        data.existingParticipants.forEach(userId => {
          if (userId !== userName) { // Don't create connection to self
            createPeerConnection(userId);
            // If we're the initiator, send offers to existing participants
            if (data.isInitiator) {
              setTimeout(() => {
                sendOffer(userId);
              }, 1000);
            }
          }
        });
      }
    };

    socket.on('room-joined', handleRoomJoined);

    return () => {
      socket.off('room-joined', handleRoomJoined);
    };
  }, [socket, createPeerConnection, sendOffer, userName]);

  // Toggle audio
  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioMuted(!audioTrack.enabled);
      }
    }
  };

  // Toggle video
  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoMuted(!videoTrack.enabled);
      }
    }
  };

  // Toggle screen sharing
  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
        
        // Replace video track in all peer connections
        const videoTrack = screenStream.getVideoTracks()[0];
        peerConnections.current.forEach(peerConnection => {
          const sender = peerConnection.getSenders().find(s => 
            s.track && s.track.kind === 'video'
          );
          if (sender) {
            sender.replaceTrack(videoTrack);
          }
        });

        // Update local video
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }

        setIsScreenSharing(true);

        // Handle screen share end
        videoTrack.onended = () => {
          toggleScreenShare();
        };
      } else {
        // Stop screen sharing and restore camera
        if (localStream) {
          const videoTrack = localStream.getVideoTracks()[0];
          peerConnections.current.forEach(peerConnection => {
            const sender = peerConnection.getSenders().find(s => 
              s.track && s.track.kind === 'video'
            );
            if (sender) {
              sender.replaceTrack(videoTrack);
            }
          });

          if (localVideoRef.current) {
            localVideoRef.current.srcObject = localStream;
          }
        }
        setIsScreenSharing(false);
      }
    } catch (error) {
      console.error('Error toggling screen share:', error);
    }
  };

  // Send message
  const sendMessage = () => {
    if (newMessage.trim() && socket) {
      const message = {
        text: newMessage.trim(),
        sender: userName,
        timestamp: new Date().toISOString()
      };
      
      socket.emit('send-message', { message, roomId });
      setNewMessage('');
    }
  };

  // Leave room
  const leaveRoom = () => {
    if (socket) {
      socket.emit('leave-room', roomId, userName);
    }
    
    // Close all peer connections
    peerConnections.current.forEach(peerConnection => {
      peerConnection.close();
    });
    
    // Stop local stream
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    
    navigate('/');
  };

  // Handle key press for message input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <Container>
      <Header>
        <RoomInfo>
          <Users size={20} />
          <RoomId>Room: {roomId}</RoomId>
          <span>({participants} participants)</span>
        </RoomInfo>
      </Header>

      <MainContent>
        <VideoGrid>
          {/* Local video */}
          <VideoContainer>
            <StyledVideo
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
            />
            <VideoLabel>{userName} (You)</VideoLabel>
          </VideoContainer>

          {/* Remote videos */}
          {Array.from(remoteStreams.entries()).map(([userId, stream]) => (
            <VideoContainer key={userId}>
              <StyledVideo
                ref={ref => {
                  if (ref) {
                    ref.srcObject = stream;
                    remoteVideoRefs.current.set(userId, ref);
                  }
                }}
                autoPlay
                playsInline
              />
              <VideoLabel>{userId}</VideoLabel>
            </VideoContainer>
          ))}
        </VideoGrid>

        {showChat && (
          <ChatPanel>
            <ChatHeader>Chat</ChatHeader>
            <ChatMessages>
              {messages.map((message, index) => (
                <Message key={index} isOwn={message.sender === userName}>
                  <MessageSender>{message.sender}</MessageSender>
                  {message.text}
                </Message>
              ))}
            </ChatMessages>
            <ChatInput>
              <MessageInput
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <SendButton onClick={sendMessage}>
                <Send size={16} />
              </SendButton>
            </ChatInput>
          </ChatPanel>
        )}
      </MainContent>

      <Controls>
        <ControlButton
          onClick={toggleAudio}
          active={!isAudioMuted}
          title={isAudioMuted ? 'Unmute' : 'Mute'}
        >
          {isAudioMuted ? <MicOff size={20} /> : <Mic size={20} />}
        </ControlButton>

        <ControlButton
          onClick={toggleVideo}
          active={!isVideoMuted}
          title={isVideoMuted ? 'Turn on camera' : 'Turn off camera'}
        >
          {isVideoMuted ? <VideoOff size={20} /> : <Video size={20} />}
        </ControlButton>

        <ControlButton
          onClick={toggleScreenShare}
          active={isScreenSharing}
          title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
        >
          <Monitor size={20} />
        </ControlButton>

        <ControlButton
          onClick={() => setShowChat(!showChat)}
          active={showChat}
          title="Toggle chat"
        >
          <MessageSquare size={20} />
        </ControlButton>

        <ControlButton
          onClick={leaveRoom}
          className="leave"
          title="Leave room"
        >
          <Phone size={20} />
        </ControlButton>
      </Controls>
    </Container>
  );
};

export default VideoRoom;
