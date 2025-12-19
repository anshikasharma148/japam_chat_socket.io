import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import authRoutes from './routes/auth.js';
import messageRoutes from './routes/messages.js';
import userRoutes from './routes/users.js';
import { initializeSocketHandlers } from './socket/socketHandlers.js';
import { startKeepAlive } from './services/keepAlive.js';

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);

// Get allowed origins from environment or use defaults
const allowedOrigins = process.env.CLIENT_URL 
  ? process.env.CLIENT_URL.split(',').map(url => url.trim())
  : ["http://localhost:3000", "https://japam-chat-socket-io.vercel.app"];

// Initialize Socket.IO with CORS configuration
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint (also used for keep-alive)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Japam Chat API Server',
    status: 'running',
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);

// Connect to MongoDB
connectDB();

// Initialize Socket.IO handlers
initializeSocketHandlers(io);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
  
  // Start keep-alive service to prevent Render from sleeping
  if (process.env.RENDER || process.env.KEEP_ALIVE_ENABLED === 'true') {
    const serverUrl = process.env.SERVER_URL || `https://japam-chat-socket-io.onrender.com`;
    startKeepAlive(serverUrl);
  }
});

export { io };

