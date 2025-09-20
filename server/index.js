const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? ["https://www.cmameet.site", "https://cmameet.site"] : "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Store active rooms
const rooms = new Map();

// API Routes
app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'API is working!' });
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
  console.log('User connected:', socket.id);

  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', userId);
    
    // Add user to room
    if (rooms.has(roomId)) {
      rooms.get(roomId).participants.add(userId);
    }
    
    console.log(`User ${userId} joined room ${roomId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });

  socket.on('offer', (data) => {
    socket.to(data.roomId).emit('offer', data);
  });

  socket.on('answer', (data) => {
    socket.to(data.roomId).emit('answer', data);
  });

  socket.on('ice-candidate', (data) => {
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
  path.join(process.cwd(), '../build')
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
  console.log(`Server running on port ${PORT}`);
});
