import User from '../models/User.js';

// Store active socket connections
const activeUsers = new Map(); // userId -> socketId

export const initializeSocketHandlers = (io) => {
  // Socket authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];

      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const { verifyToken } = await import('../config/jwt.js');
      const decoded = verifyToken(token);
      
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (error) {
      console.error('Socket authentication error:', error);
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', async (socket) => {
    const userId = socket.userId;
    const user = socket.user;

    console.log(`User connected: ${user.username} (${userId})`);

    // Store socket connection
    activeUsers.set(userId, socket.id);

    // Update user online status
    user.isOnline = true;
    user.lastSeen = new Date();
    await user.save();

    // Join user's personal room
    socket.join(`user_${userId}`);

    // Broadcast user online status to all connected clients
    io.emit('user_online', {
      userId: userId,
      username: user.username,
      isOnline: true
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      console.log(`User disconnected: ${user.username} (${userId})`);

      // Remove from active users
      activeUsers.delete(userId);

      // Update user offline status
      user.isOnline = false;
      user.lastSeen = new Date();
      await user.save();

      // Broadcast user offline status
      io.emit('user_offline', {
        userId: userId,
        username: user.username,
        isOnline: false,
        lastSeen: user.lastSeen
      });
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  return { activeUsers };
};

