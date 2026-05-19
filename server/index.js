require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const donorRoutes = require('./routes/donor');
const urgentRoutes = require('./routes/urgent');
const chatRoutes = require('./routes/chat');
const articleRoutes = require('./routes/articles');
const aiRoutes = require('./routes/ai');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/donors', donorRoutes);
app.use('/api/urgent', urgentRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/ai', aiRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'BloodCare API Running' }));

// Socket.io for real-time chat
const connectedUsers = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (userId) => {
    connectedUsers[userId] = socket.id;
    socket.userId = userId;
  });

  socket.on('sendMessage', async ({ to, from, message, conversationId }) => {
    if (!to || !from || to === 'undefined' || from === 'undefined') return;
    const Message = require('./models/Message');
    try {
    const newMsg = await Message.create({
      sender: from,
      receiver: to,
      content: message,
      conversationId,
    });

    const populated = await newMsg.populate('sender', 'name avatar');
    
    // Send to receiver
    if (connectedUsers[to]) {
      io.to(connectedUsers[to]).emit('receiveMessage', populated);
    }
    // Send back to sender
    socket.emit('receiveMessage', populated);
    } catch (err) {
      console.error('sendMessage error:', err.message);
    }
  });

  socket.on('typing', ({ to, from }) => {
    if (connectedUsers[to]) {
      io.to(connectedUsers[to]).emit('typing', { from });
    }
  });

  socket.on('stopTyping', ({ to }) => {
    if (connectedUsers[to]) {
      io.to(connectedUsers[to]).emit('stopTyping');
    }
  });

  socket.on('disconnect', () => {
    if (socket.userId) {
      delete connectedUsers[socket.userId];
    }
  });
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bloodcare')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 BloodCare server running on port ${PORT}`));
