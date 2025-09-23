const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? ["https://www.cmameet.site", "https://cmameet.site", "https://cmameet.onrender.com"] : "http://localhost:3000",
    methods: ["GET", "POST"]
  },
  transports: ['polling', 'websocket'],
  allowEIO3: true,
  pingTimeout: 60000,
  pingInterval: 25000
});

const PORT = process.env.PORT || 5001;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/subscription-platform', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Global error handlers to prevent crashes
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Don't exit the process, just log the error
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit the process, just log the error
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for development
  crossOriginEmbedderPolicy: false
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ["https://www.cmameet.site", "https://cmameet.site", "https://cmameet.onrender.com"] 
    : "http://localhost:3000",
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Store active rooms
const rooms = new Map();

// Import routes
const authRoutes = require('./routes/auth');
const paymentRoutes = require('./routes/payments');
const contentRoutes = require('./routes/content');
const messageRoutes = require('./routes/messages');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/messages', messageRoutes);

// Stripe webhook endpoint (must be before other routes)
app.post('/api/webhooks/stripe', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const { verifyWebhookSignature } = require('./config/stripe');
  
  try {
    const event = verifyWebhookSignature(req.body, sig);
    
    // Handle the event
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionCancellation(event.data.object);
        break;
      case 'invoice.payment_succeeded':
        await handlePaymentSuccess(event.data.object);
        break;
      case 'invoice.payment_failed':
        await handlePaymentFailure(event.data.object);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    
    res.json({received: true});
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

// Webhook handlers
async function handleSubscriptionUpdate(subscription) {
  const Subscription = require('./models/Subscription');
  const User = require('./models/User');
  
  try {
    const dbSubscription = await Subscription.findOne({
      stripeSubscriptionId: subscription.id
    });
    
    if (dbSubscription) {
      dbSubscription.status = subscription.status;
      dbSubscription.periods.current = {
        start: new Date(subscription.current_period_start * 1000),
        end: new Date(subscription.current_period_end * 1000)
      };
      await dbSubscription.save();
    }
  } catch (error) {
    console.error('Error handling subscription update:', error);
  }
}

async function handleSubscriptionCancellation(subscription) {
  const Subscription = require('./models/Subscription');
  
  try {
    const dbSubscription = await Subscription.findOne({
      stripeSubscriptionId: subscription.id
    });
    
    if (dbSubscription) {
      dbSubscription.status = 'cancelled';
      dbSubscription.cancellation = {
        cancelledAt: new Date(),
        cancelAtPeriodEnd: false,
        cancellationReason: 'Cancelled via Stripe'
      };
      await dbSubscription.save();
    }
  } catch (error) {
    console.error('Error handling subscription cancellation:', error);
  }
}

async function handlePaymentSuccess(invoice) {
  const Subscription = require('./models/Subscription');
  const User = require('./models/User');
  
  try {
    const subscription = await Subscription.findOne({
      stripeSubscriptionId: invoice.subscription
    }).populate('creator');
    
    if (subscription && subscription.creator) {
      // Update creator earnings
      subscription.creator.creatorSettings.earnings.total += invoice.amount_paid / 100;
      subscription.creator.creatorSettings.earnings.thisMonth += invoice.amount_paid / 100;
      await subscription.creator.save();
      
      // Add payment to subscription history
      subscription.paymentHistory.push({
        stripePaymentIntentId: invoice.payment_intent,
        amount: invoice.amount_paid / 100,
        currency: invoice.currency,
        status: 'succeeded',
        paidAt: new Date(invoice.status_transitions.paid_at * 1000),
        description: `Subscription payment for ${subscription.creator.profile.displayName}`
      });
      await subscription.save();
    }
  } catch (error) {
    console.error('Error handling payment success:', error);
  }
}

async function handlePaymentFailure(invoice) {
  const Subscription = require('./models/Subscription');
  
  try {
    const subscription = await Subscription.findOne({
      stripeSubscriptionId: invoice.subscription
    });
    
    if (subscription) {
      subscription.status = 'past_due';
      await subscription.save();
    }
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}
app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'API is working!' });
});

app.get('/api/socket-test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Socket.IO server is running!',
    socketPath: '/socket.io/',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint for monitoring
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    rooms: rooms.size,
    activeConnections: io.engine.clientsCount
  });
});

// Ping endpoint to keep service alive
app.get('/api/ping', (req, res) => {
  res.json({
    success: true,
    message: 'Pong! Service is alive',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get('/api/rooms', (req, res) => {
  const roomsList = Array.from(rooms.values()).map(room => ({
    id: room.id,
    participantCount: room.participants.size,
    createdAt: room.createdAt
  }));
  res.json(roomsList);
});

app.post('/api/rooms', (req, res) => {
  try {
    console.log('POST /api/rooms called with body:', req.body);
    const { roomId } = req.body;
    const id = roomId || uuidv4().substring(0, 6).toUpperCase();
    
    if (!rooms.has(id)) {
      rooms.set(id, {
        id,
        participants: new Set(),
        createdAt: new Date()
      });
      console.log(`Created new room: ${id}`);
    } else {
      console.log(`Room ${id} already exists`);
    }
    
    res.json({ success: true, roomId: id });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ success: false, error: 'Failed to create room' });
  }
});

app.get('/api/rooms/:roomId', (req, res) => {
  const { roomId } = req.params;
  const room = rooms.get(roomId);
  
  if (room) {
    res.json({ success: true, room: { ...room, participants: Array.from(room.participants) } });
  } else {
    res.json({ success: false, message: 'Room not found' });
  }
});


// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('New socket connection:', socket.id);
  console.log('Socket transport:', socket.conn.transport.name);
  console.log('Socket ready state:', socket.conn.readyState);
  
  // Add error handling for individual socket errors
  socket.on('error', (error) => {
    console.error('Socket error for', socket.id, ':', error);
  });

  socket.on('join-room', (roomId, userId) => {
    console.log(`Socket ${socket.id} joining room ${roomId} as user ${userId}`);
    socket.join(roomId);
    
    // Check if this is the first user in the room (initiator)
    const isInitiator = !rooms.has(roomId) || rooms.get(roomId).participants.size === 0;
    
    // Add user to room
    if (!rooms.has(roomId)) {
      console.log(`Creating new room: ${roomId}`);
      rooms.set(roomId, {
        id: roomId,
        participants: new Set(),
        createdAt: new Date()
      });
    }
    
    // Get existing participants before adding the new user
    const existingParticipants = Array.from(rooms.get(roomId).participants);
    rooms.get(roomId).participants.add(userId);
    
    console.log(`Room ${roomId} state:`, {
      existingParticipants,
      newUser: userId,
      totalParticipants: rooms.get(roomId).participants.size,
      isInitiator
    });
    
    // Notify the joining user if they are the initiator and send existing participants
    socket.emit('room-joined', { 
      isInitiator, 
      existingParticipants,
      totalParticipants: rooms.get(roomId).participants.size
    });
    
    console.log(`User ${userId} joined room ${roomId} (initiator: ${isInitiator})`);
    console.log(`Room ${roomId} now has ${rooms.get(roomId).participants.size} participants`);
    console.log(`Existing participants: ${existingParticipants.join(', ')}`);
    
    // Notify other users in the room about the new user
    socket.to(roomId).emit('user-connected', userId);
    console.log(`Notified other users in room ${roomId} about new user ${userId}`);
  });

  socket.on('disconnect', (reason) => {
    console.log('User disconnected:', socket.id, 'Reason:', reason);
  });

  socket.on('error', (error) => {
    console.error('Socket error:', socket.id, error);
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', socket.id, error);
  });

  socket.on('offer', (data) => {
    console.log(`Forwarding offer from ${socket.id} to room ${data.roomId} for user ${data.userId}`);
    socket.to(data.roomId).emit('offer', data);
  });

  socket.on('answer', (data) => {
    console.log(`Forwarding answer from ${socket.id} to room ${data.roomId} for user ${data.userId}`);
    socket.to(data.roomId).emit('answer', data);
  });

  socket.on('ice-candidate', (data) => {
    console.log(`Forwarding ICE candidate from ${socket.id} to room ${data.roomId} for user ${data.userId}`);
    socket.to(data.roomId).emit('ice-candidate', data);
  });

  socket.on('leave-room', (roomId, userId) => {
    socket.leave(roomId);
    socket.to(roomId).emit('user-disconnected', userId);
    
    // Remove user from room
    if (rooms.has(roomId)) {
      rooms.get(roomId).participants.delete(userId);
    }
  });

  socket.on('get-existing-users', (roomId) => {
    if (rooms.has(roomId)) {
      const existingUsers = Array.from(rooms.get(roomId).participants);
      socket.emit('existing-users', existingUsers);
    }
  });

  // Handle chat messages
  socket.on('send-message', (data) => {
    console.log(`Message from ${data.message.sender} in room ${data.roomId}: ${data.message.text}`);
    
    // Broadcast the message to all users in the room
    socket.to(data.roomId).emit('receive-message', data.message);
    
    // Also send back to sender to confirm (optional)
    socket.emit('receive-message', data.message);
  });
});

// Serve static files from React build directory (after all API routes)
const buildPaths = [
  // Check root directory first (where build files are copied)
  path.join(__dirname, '..'),
  path.join(process.cwd()),
  // Then check client/build directories
  path.join(__dirname, '../client/build'),
  path.join(__dirname, '../../client/build'),
  path.join(process.cwd(), 'client/build'),
  path.join(process.cwd(), '../client/build'),
  path.join('/opt/render/project/client/build'),
  path.join('/opt/render/project/src/client/build'),
  path.join('/opt/render/project/src/Zoom2/client/build'),
  path.join('/opt/render/project/Zoom2/client/build'),
  path.join(process.cwd(), 'Zoom2/client/build'),
  path.join(process.cwd(), '../Zoom2/client/build'),
  // Additional Render paths
  path.join('/opt/render/project/build'),
  path.join('/opt/render/project/src/build'),
  path.join(process.cwd(), 'build'),
  path.join(process.cwd(), '../build'),
  // Render Web Service specific paths
  path.join('/opt/render/project/src'),
  path.join('/opt/render/project')
];

let buildPath = null;
for (const bp of buildPaths) {
  if (require('fs').existsSync(bp)) {
    // Check if this is a React build directory (contains index.html and static folder)
    const indexPath = path.join(bp, 'index.html');
    const staticPath = path.join(bp, 'static');
    if (require('fs').existsSync(indexPath) && require('fs').existsSync(staticPath)) {
      buildPath = bp;
      break;
    }
  }
}

if (buildPath) {
  console.log(`✅ Serving static files from React build directory: ${buildPath}`);
  app.use(express.static(buildPath));
} else {
  console.log('⚠️  React build directory not found, serving from public directory');
  console.log('Available directories:');
  console.log('Current working directory:', process.cwd());
  console.log('Server directory:', __dirname);
  try {
    require('fs').readdirSync(process.cwd()).forEach(dir => {
      console.log('-', dir);
    });
  } catch (error) {
    console.log('Error reading directory:', error.message);
  }
  app.use(express.static(path.join(__dirname, '../public')));
}

// Catch all handler: send back React's index.html file for any non-API routes
app.get('*', (req, res) => {
  // Skip API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
    // Try multiple possible index.html locations
    const indexPaths = [
      // Check root directory first (where build files are copied)
      path.join(__dirname, '../index.html'),
      path.join(process.cwd(), 'index.html'),
      // Then check client/build directories
      path.join(__dirname, '../client/build/index.html'),
      path.join(__dirname, '../../client/build/index.html'),
      path.join(__dirname, '../build/index.html'),
      path.join(__dirname, '../../build/index.html'),
      path.join(process.cwd(), 'client/build/index.html'),
      path.join(process.cwd(), 'build/index.html'),
      path.join(process.cwd(), 'src/client/build/index.html'),
      path.join(process.cwd(), '../client/build/index.html'),
      path.join(process.cwd(), '../../client/build/index.html'),
      path.join('/opt/render/project/src/client/build/index.html'),
      path.join('/opt/render/project/client/build/index.html'),
      path.join('/opt/render/project/src/Zoom2/client/build/index.html'),
      path.join('/opt/render/project/Zoom2/client/build/index.html'),
      path.join(process.cwd(), 'Zoom2/client/build/index.html'),
      path.join(process.cwd(), '../Zoom2/client/build/index.html'),
      // Additional Render paths
      path.join('/opt/render/project/build/index.html'),
      path.join('/opt/render/project/src/build/index.html'),
      path.join(process.cwd(), 'build/index.html'),
      path.join(process.cwd(), '../build/index.html')
    ];
    
    for (const indexPath of indexPaths) {
      if (require('fs').existsSync(indexPath)) {
        console.log(`✅ Serving index.html from: ${indexPath}`);
        return res.sendFile(indexPath);
      }
    }
    
    console.log('❌ React build not found. Tried paths:');
    indexPaths.forEach(p => console.log('-', p));
    
    // Fallback to public/index.html
    const fallbackPath = path.join(__dirname, '../public/index.html');
    if (require('fs').existsSync(fallbackPath)) {
      console.log('✅ Serving fallback index.html from public directory');
      return res.sendFile(fallbackPath);
    }
    
    res.status(404).send('Frontend not available. Check server logs for details.');
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Socket.IO server initialized`);
  console.log(`🌐 CORS configured for:`, process.env.NODE_ENV === 'production' ? ["https://www.cmameet.site", "https://cmameet.site"] : "http://localhost:3000");
});
