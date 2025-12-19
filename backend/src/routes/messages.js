import express from 'express';
import Message from '../models/Message.js';
import Chat from '../models/Chat.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/messages/:userId
// @desc    Get chat history with a specific user
// @access  Private
router.get('/:userId', authenticate, async (req, res) => {
  try {
    const currentUserId = req.user._id.toString();
    const otherUserId = req.params.userId;

    if (currentUserId === otherUserId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot get messages with yourself'
      });
    }

    // Get or create chat
    let chat = await Chat.findOne({
      participants: { $all: [currentUserId, otherUserId] }
    });

    if (!chat) {
      return res.json({
        success: true,
        data: {
          messages: [],
          chatId: null
        }
      });
    }

    // Get messages between users
    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: currentUserId }
      ]
    })
      .populate('senderId', 'username email')
      .populate('receiverId', 'username email')
      .sort({ createdAt: 1 })
      .limit(100); // Limit to last 100 messages

    res.json({
      success: true,
      data: {
        messages: messages.map(msg => ({
          id: msg._id,
          senderId: msg.senderId._id,
          senderUsername: msg.senderId.username,
          receiverId: msg.receiverId._id,
          receiverUsername: msg.receiverId.username,
          content: msg.content,
          isRead: msg.isRead,
          readAt: msg.readAt,
          createdAt: msg.createdAt
        })),
        chatId: chat._id
      }
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

// @route   GET /api/messages/chats/list
// @desc    Get list of all chats for current user
// @access  Private
router.get('/chats/list', authenticate, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all chats where user is a participant
    const chats = await Chat.find({
      participants: userId
    })
      .populate('participants', 'username email isOnline')
      .populate('lastMessage')
      .sort({ lastMessageAt: -1 });

    // Format response
    const formattedChats = chats.map(chat => {
      const otherParticipant = chat.participants.find(
        p => p._id.toString() !== userId.toString()
      );

      return {
        chatId: chat._id,
        otherUser: {
          id: otherParticipant._id,
          username: otherParticipant.username,
          email: otherParticipant.email,
          isOnline: otherParticipant.isOnline
        },
        lastMessage: chat.lastMessage ? {
          id: chat.lastMessage._id,
          content: chat.lastMessage.content,
          senderId: chat.lastMessage.senderId,
          createdAt: chat.lastMessage.createdAt
        } : null,
        lastMessageAt: chat.lastMessageAt,
        updatedAt: chat.updatedAt
      };
    });

    res.json({
      success: true,
      data: {
        chats: formattedChats
      }
    });
  } catch (error) {
    console.error('Get chats list error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

export default router;

