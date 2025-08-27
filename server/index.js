const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/dist')));

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const projectRoutes = require('./routes/projects');
const documentRoutes = require('./routes/documents');

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/documents', documentRoutes);

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Socket.io connection handling
const connectedUsers = new Map();
const collaborationRooms = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle user joining a collaboration room
  socket.on('join-room', (data) => {
    const { roomId, userId, username } = data;
    
    socket.join(roomId);
    
    if (!collaborationRooms.has(roomId)) {
      collaborationRooms.set(roomId, new Set());
    }
    
    collaborationRooms.get(roomId).add(userId);
    connectedUsers.set(socket.id, { userId, username, roomId });
    
    // Notify other users in the room
    socket.to(roomId).emit('user-joined', { userId, username });
    
    // Send current room participants to the new user
    const participants = Array.from(collaborationRooms.get(roomId));
    socket.emit('room-participants', participants);
    
    console.log(`User ${username} joined room ${roomId}`);
  });

  // Handle document changes
  socket.on('document-change', (data) => {
    const { roomId, documentId, content, userId } = data;
    
    // Broadcast the change to other users in the room
    socket.to(roomId).emit('document-updated', {
      documentId,
      content,
      userId,
      timestamp: new Date()
    });
  });

  // Handle cursor movements
  socket.on('cursor-move', (data) => {
    const { roomId, position, userId, username } = data;
    
    // Broadcast cursor position to other users
    socket.to(roomId).emit('cursor-updated', {
      userId,
      username,
      position,
      timestamp: new Date()
    });
  });

  // Handle chat messages
  socket.on('chat-message', (data) => {
    const { roomId, message, userId, username } = data;
    
    // Broadcast message to all users in the room
    io.to(roomId).emit('chat-message', {
      userId,
      username,
      message,
      timestamp: new Date()
    });
  });

  // Handle user leaving room
  socket.on('leave-room', (data) => {
    const { roomId, userId, username } = data;
    
    socket.leave(roomId);
    
    if (collaborationRooms.has(roomId)) {
      collaborationRooms.get(roomId).delete(userId);
      
      if (collaborationRooms.get(roomId).size === 0) {
        collaborationRooms.delete(roomId);
      }
    }
    
    // Notify other users
    socket.to(roomId).emit('user-left', { userId, username });
    
    console.log(`User ${username} left room ${roomId}`);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const userInfo = connectedUsers.get(socket.id);
    
    if (userInfo) {
      const { roomId, userId, username } = userInfo;
      
      if (collaborationRooms.has(roomId)) {
        collaborationRooms.get(roomId).delete(userId);
        
        if (collaborationRooms.get(roomId).size === 0) {
          collaborationRooms.delete(roomId);
        }
      }
      
      // Notify other users
      socket.to(roomId).emit('user-left', { userId, username });
      
      connectedUsers.delete(socket.id);
      console.log(`User ${username} disconnected from room ${roomId}`);
    }
    
    console.log('User disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.io server initialized`);
});
