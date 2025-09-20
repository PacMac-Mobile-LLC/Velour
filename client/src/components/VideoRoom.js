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
  Send,
  Share2,
  Copy,
  Check
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
  border: ${props => props.isActiveSpeaker ? '3px solid #667eea' : '3px solid transparent'};
  transition: border-color 0.3s ease;
  box-shadow: ${props => props.isActiveSpeaker ? '0 0 20px rgba(102, 126, 234, 0.5)' : 'none'};
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
  
  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    width: 100vw;
    z-index: 1000;
    border-left: none;
  }
`;

const ChatHeader = styled.div`
  padding: 15px 20px;
  border-bottom: 1px solid #444;
  color: white;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 5px;
  display: none;
  
  @media (max-width: 768px) {
    display: block;
  }
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

const ShareModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const ShareModalContent = styled.div`
  background: #2d2d2d;
  border-radius: 15px;
  padding: 30px;
  max-width: 500px;
  width: 90%;
  color: white;
`;

const ShareModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ShareModalTitle = styled.h3`
  margin: 0;
  font-size: 1.3rem;
  color: white;
`;

const CloseModalButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 5px;
  
  &:hover {
    opacity: 0.7;
  }
`;

const ShareSection = styled.div`
  margin-bottom: 20px;
`;

const ShareLabel = styled.label`
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
  color: #ccc;
`;

const ShareInputContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const ShareInput = styled.input`
  flex: 1;
  padding: 12px 15px;
  border: 1px solid #555;
  border-radius: 8px;
  background: #333;
  color: white;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const CopyButton = styled.button`
  background: #667eea;
  border: none;
  color: white;
  padding: 12px 15px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background: #5a6fd8;
  }
  
  &:disabled {
    background: #28a745;
    cursor: not-allowed;
  }
`;

const ShareInstructions = styled.div`
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 8px;
  padding: 15px;
  margin-top: 15px;
`;

const ShareInstructionsText = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: #ccc;
  line-height: 1.4;
`;

// Name Entry Modal Components
const NameModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const NameModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 32px;
  max-width: 400px;
  width: 90%;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
`;

const NameModalHeader = styled.div`
  margin-bottom: 24px;
`;

const NameModalTitle = styled.h2`
  margin: 0 0 8px 0;
  color: #333;
  font-size: 24px;
  font-weight: 600;
`;

const NameModalSubtitle = styled.p`
  margin: 0;
  color: #666;
  font-size: 16px;
`;

const NameInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  margin-bottom: 20px;
  box-sizing: border-box;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const NameModalButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 100%;

  &:hover {
    background: #0056b3;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const VideoRoom = () => {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  console.log('VideoRoom component rendering, roomId:', roomId);
  
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
  const [showShareModal, setShowShareModal] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [tempUserName, setTempUserName] = useState('');
  const [activeSpeaker, setActiveSpeaker] = useState(null);

  const localVideoRef = useRef(null);
  const remoteVideoRefs = useRef(new Map());
  const peerConnections = useRef(new Map());
  const audioAnalyzers = useRef(new Map());
  const animationFrameRef = useRef(null);
  const userName = searchParams.get('name') || 'Anonymous';
  
  // Check if we need to show the name entry modal
  useEffect(() => {
    const nameParam = searchParams.get('name');
    if (!nameParam || nameParam.trim() === '') {
      setShowNameModal(true);
    }
  }, [searchParams]);

  // Audio level analysis for active speaker detection
  const createAudioAnalyzer = useCallback((stream, userId) => {
    try {
      if (!stream) return null;
      
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      microphone.connect(analyser);
      
      audioAnalyzers.current.set(userId, { analyser, dataArray, audioContext });
      return { analyser, dataArray, audioContext };
    } catch (error) {
      console.error('Error creating audio analyzer:', error);
      return null;
    }
  }, []);

  const analyzeAudioLevels = useCallback(() => {
    try {
      let maxLevel = 0;
      let currentActiveSpeaker = null;
      
      audioAnalyzers.current.forEach(({ analyser, dataArray }, userId) => {
        if (analyser && dataArray) {
          analyser.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
          const level = average / 255; // Normalize to 0-1
          
          if (level > maxLevel && level > 0.1) { // Threshold to avoid noise
            maxLevel = level;
            currentActiveSpeaker = userId;
          }
        }
      });
      
      setActiveSpeaker(currentActiveSpeaker);
      
      animationFrameRef.current = requestAnimationFrame(analyzeAudioLevels);
    } catch (error) {
      console.error('Error in audio analysis:', error);
    }
  }, []);

  const startAudioAnalysis = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    analyzeAudioLevels();
  }, [analyzeAudioLevels]);

  const stopAudioAnalysis = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  // Browser notification functionality
  const requestNotificationPermission = useCallback(async () => {
    try {
      if ('Notification' in window && Notification.permission === 'default') {
        await Notification.requestPermission();
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  }, []);

  const showNotification = useCallback((message) => {
    try {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('New CMA Meeting Message', {
          body: `${message.sender}: ${message.text}`,
          icon: '/favicon.ico',
          tag: 'cma-chat',
          requireInteraction: false
        });
      }
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }, []);

  // Initialize socket connection
  useEffect(() => {
    const socketUrl = process.env.NODE_ENV === 'production' 
      ? window.location.origin 
      : 'http://localhost:5001';
    console.log('Connecting to socket:', socketUrl);
    
    const newSocket = io(socketUrl, {
      transports: ['polling', 'websocket'],
      timeout: 20000,
      forceNew: true,
      upgrade: false,
      rememberUpgrade: false
    });
    
    newSocket.on('connect', () => {
      console.log('Socket connected with ID:', newSocket.id);
      console.log('Socket transport:', newSocket.io.engine.transport.name);
    });
    
    newSocket.on('disconnect', (reason) => {
      console.log('Socket disconnected, reason:', reason);
    });
    
    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      console.error('Error details:', error.message, error.description, error.context);
      
      // If WebSocket fails, try polling only
      if (error.message && error.message.includes('websocket')) {
        console.log('WebSocket failed, attempting polling-only connection...');
        newSocket.io.opts.transports = ['polling'];
        newSocket.io.opts.upgrade = false;
        newSocket.connect();
      }
    });
    
    newSocket.on('reconnect', (attemptNumber) => {
      console.log('Socket reconnected after', attemptNumber, 'attempts');
    });
    
    newSocket.on('reconnect_error', (error) => {
      console.error('Socket reconnection error:', error);
    });
    
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
      console.log('Remote stream tracks:', event.streams[0]?.getTracks());
      const [remoteStream] = event.streams;
      setRemoteStreams(prev => {
        const newMap = new Map(prev).set(userId, remoteStream);
        console.log('Updated remote streams map:', Array.from(newMap.keys()));
        return newMap;
      });
      // Create audio analyzer for remote stream (with error handling)
      try {
        createAudioAnalyzer(remoteStream, userId);
      } catch (error) {
        console.error('Error creating audio analyzer in peer connection:', error);
      }
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
  }, [localStream, socket, roomId, createAudioAnalyzer]);

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
  }, [createPeerConnection, socket, roomId, createAudioAnalyzer]);

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
        // Create audio analyzer for local stream (with error handling)
        try {
          createAudioAnalyzer(stream, userName);
        } catch (error) {
          console.error('Error creating audio analyzer for local stream:', error);
        }
      } catch (error) {
        console.error('Error accessing media devices:', error);
        alert('Unable to access camera and microphone. Please check permissions.');
      }
    };

    initLocalStream();
  }, [createAudioAnalyzer, userName]);

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
      // Clean up audio analyzer
      if (audioAnalyzers.current.has(userId)) {
        const { audioContext } = audioAnalyzers.current.get(userId);
        audioContext.close();
        audioAnalyzers.current.delete(userId);
      }
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
      // Show notification if chat is not visible or message is from someone else
      if (!showChat || data.sender !== userName) {
        showNotification(data);
      }
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
  }, [socket, sendOffer, createPeerConnection, handleOfferReceived, handleAnswerReceived, handleIceCandidateReceived, isInitiator, userName, showChat, showNotification]);

  // Join room when socket is ready
  useEffect(() => {
    if (socket && roomId) {
      console.log('Joining room:', roomId, 'with user:', userName);
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


  // Share room functionality
  const getShareLink = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/room/${roomId}?name=`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getShareLink());
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = getShareLink();
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  const openShareModal = () => {
    setShowShareModal(true);
    setLinkCopied(false);
  };

  const closeShareModal = () => {
    setShowShareModal(false);
    setLinkCopied(false);
  };

  // Name modal functions
  const handleNameSubmit = () => {
    if (tempUserName.trim()) {
      // Update the URL with the entered name
      const newUrl = `${window.location.pathname}?name=${encodeURIComponent(tempUserName.trim())}`;
      window.history.replaceState({}, '', newUrl);
      setShowNameModal(false);
      // Reload the page to pick up the new name parameter
      window.location.reload();
    }
  };

  const handleNameKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleNameSubmit();
    }
  };

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

  // Start audio analysis when we have streams
  useEffect(() => {
    if (localStream || remoteStreams.size > 0) {
      startAudioAnalysis();
    } else {
      stopAudioAnalysis();
    }
    
    return () => {
      stopAudioAnalysis();
      // Clean up all audio analyzers
      const currentAnalyzers = audioAnalyzers.current;
      currentAnalyzers.forEach(({ audioContext }) => {
        audioContext.close();
      });
      currentAnalyzers.clear();
    };
  }, [localStream, remoteStreams, startAudioAnalysis, stopAudioAnalysis]);

  // Request notification permission on component mount
  useEffect(() => {
    requestNotificationPermission();
  }, [requestNotificationPermission]);

  // Ping server every 5 minutes to keep Render service alive
  useEffect(() => {
    const pingServer = async () => {
      try {
        const response = await fetch('/api/ping');
        if (response.ok) {
          const data = await response.json();
          console.log('Server ping successful:', data.message);
        } else {
          console.warn('Server ping failed:', response.status);
        }
      } catch (error) {
        console.error('Server ping error:', error);
      }
    };

    // Ping immediately on mount
    pingServer();

    // Set up interval to ping every 5 minutes (300,000 ms)
    const pingInterval = setInterval(pingServer, 5 * 60 * 1000);

    return () => {
      clearInterval(pingInterval);
    };
  }, []);

  // Add error boundary fallback
  if (!roomId) {
    return (
      <Container>
        <Header>
          <RoomInfo>
            <Users size={20} />
            <RoomId>CMA Meeting: Loading...</RoomId>
          </RoomInfo>
        </Header>
        <MainContent>
          <div style={{ color: 'white', padding: '20px', textAlign: 'center' }}>
            Loading meeting room...
          </div>
        </MainContent>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <RoomInfo>
          <Users size={20} />
          <RoomId>CMA Meeting: {roomId}</RoomId>
          <span>({participants} members)</span>
        </RoomInfo>
      </Header>

      <MainContent>
        <VideoGrid>
          {/* Local video */}
          <VideoContainer isActiveSpeaker={activeSpeaker === userName}>
            <StyledVideo
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
            />
            <VideoLabel>{userName} (You)</VideoLabel>
          </VideoContainer>

          {/* Remote videos */}
          {Array.from(remoteStreams.entries()).map(([userId, stream]) => {
            console.log('Rendering remote video for user:', userId, 'stream:', stream);
            return (
              <VideoContainer key={userId} isActiveSpeaker={activeSpeaker === userId}>
                <StyledVideo
                  ref={ref => {
                    if (ref) {
                      ref.srcObject = stream;
                      remoteVideoRefs.current.set(userId, ref);
                      console.log('Set remote video srcObject for user:', userId);
                    }
                  }}
                  autoPlay
                  playsInline
              />
              <VideoLabel>{userId}</VideoLabel>
            </VideoContainer>
            );
          })}
        </VideoGrid>

        {showChat && (
          <ChatPanel>
            <ChatHeader>
              <span>CMA Fellowship Chat</span>
              <CloseButton onClick={() => setShowChat(false)}>×</CloseButton>
            </ChatHeader>
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
                placeholder="Share your experience, strength, and hope..."
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
          onClick={openShareModal}
          title="Share room link"
        >
          <Share2 size={20} />
        </ControlButton>

        <ControlButton
          onClick={leaveRoom}
          className="leave"
          title="Leave room"
        >
          <Phone size={20} />
        </ControlButton>
      </Controls>

      {showShareModal && (
        <ShareModal onClick={closeShareModal}>
          <ShareModalContent onClick={(e) => e.stopPropagation()}>
            <ShareModalHeader>
              <ShareModalTitle>Share Meeting</ShareModalTitle>
              <CloseModalButton onClick={closeShareModal}>×</CloseModalButton>
            </ShareModalHeader>
            
            <ShareSection>
              <ShareLabel>Meeting Link</ShareLabel>
              <ShareInputContainer>
                <ShareInput
                  type="text"
                  value={getShareLink()}
                  readOnly
                />
                <CopyButton
                  onClick={copyToClipboard}
                  disabled={linkCopied}
                >
                  {linkCopied ? (
                    <>
                      <Check size={16} />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      Copy
                    </>
                  )}
                </CopyButton>
              </ShareInputContainer>
            </ShareSection>

            <ShareInstructions>
              <ShareInstructionsText>
                <strong>How to invite others:</strong><br />
                1. Copy the meeting link above<br />
                2. Share it via text, email, or any messaging app<br />
                3. Recipients can click the link to join the meeting<br />
                4. They'll be prompted to enter their name before joining
              </ShareInstructionsText>
            </ShareInstructions>
          </ShareModalContent>
        </ShareModal>
      )}

      {/* Name Entry Modal */}
      {showNameModal && (
        <NameModal>
          <NameModalContent>
            <NameModalHeader>
              <NameModalTitle>Join CMA Meeting</NameModalTitle>
              <NameModalSubtitle>
                Please enter your name to join the meeting
              </NameModalSubtitle>
            </NameModalHeader>
            
            <NameInput
              type="text"
              placeholder="Enter your name"
              value={tempUserName}
              onChange={(e) => setTempUserName(e.target.value)}
              onKeyPress={handleNameKeyPress}
              autoFocus
            />
            
            <NameModalButton
              onClick={handleNameSubmit}
              disabled={!tempUserName.trim()}
            >
              Join Meeting
            </NameModalButton>
          </NameModalContent>
        </NameModal>
      )}
    </Container>
  );
};

export default VideoRoom;
