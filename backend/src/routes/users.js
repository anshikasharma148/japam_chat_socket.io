import express from 'express';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users (for chat list)
// @access  Private
router.get('/', authenticate, async (req, res) => {
  try {
    const currentUserId = req.user._id;

    // Get all users except current user
    const users = await User.find({
      _id: { $ne: currentUserId }
    })
      .select('username email isOnline lastSeen')
      .sort({ username: 1 });

    res.json({
      success: true,
      data: {
        users: users.map(user => ({
          id: user._id,
          username: user.username,
          email: user.email,
          isOnline: user.isOnline,
          lastSeen: user.lastSeen
        }))
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

// @route   GET /api/users/online
// @desc    Get all online users
// @access  Private
router.get('/online', authenticate, async (req, res) => {
  try {
    const onlineUsers = await User.find({
      isOnline: true,
      _id: { $ne: req.user._id }
    })
      .select('username email isOnline lastSeen')
      .sort({ username: 1 });

    res.json({
      success: true,
      data: {
        users: onlineUsers.map(user => ({
          id: user._id,
          username: user.username,
          email: user.email,
          isOnline: user.isOnline,
          lastSeen: user.lastSeen
        }))
      }
    });
  } catch (error) {
    console.error('Get online users error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

// @route   GET /api/users/:userId
// @desc    Get specific user details
// @access  Private
router.get('/:userId', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('username email isOnline lastSeen');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          isOnline: user.isOnline,
          lastSeen: user.lastSeen
        }
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

export default router;

