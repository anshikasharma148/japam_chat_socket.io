import Message from '../models/Message.js';
import Chat from '../models/Chat.js';

export const initializeMessageHandlers = (io, socket) => {
  // Handle sending a message
  socket.on('send_message', async (data) => {
    try {
      const { receiverId, content } = data;
      const senderId = socket.userId;

      // Validation
      if (!receiverId || !content) {
        socket.emit('error', {
          message: 'Receiver ID and message content are required'
        });
        return;
      }

      if (content.trim().length === 0) {
        socket.emit('error', {
          message: 'Message content cannot be empty'
        });
        return;
      }

      if (senderId === receiverId) {
        socket.emit('error', {
          message: 'Cannot send message to yourself'
        });
        return;
      }

      // Create or get chat
      let chat = await Chat.findOne({
        participants: { $all: [senderId, receiverId] }
      });

      if (!chat) {
        chat = await Chat.create({
          participants: [senderId, receiverId]
        });
      }

      // Create message
      const message = await Message.create({
        senderId,
        receiverId,
        content: content.trim()
      });

      // Update chat's last message
      chat.lastMessage = message._id;
      chat.lastMessageAt = message.createdAt;
      await chat.save();

      // Populate message with sender info
      await message.populate('senderId', 'username email');
      await message.populate('receiverId', 'username email');

      // Emit to sender (confirmation)
      socket.emit('message_sent', {
        message: {
          id: message._id,
          senderId: message.senderId._id,
          receiverId: message.receiverId._id,
          content: message.content,
          isRead: message.isRead,
          createdAt: message.createdAt
        }
      });

      // Emit to receiver (if online)
      io.to(`user_${receiverId}`).emit('receive_message', {
        message: {
          id: message._id,
          senderId: message.senderId._id,
          senderUsername: message.senderId.username,
          receiverId: message.receiverId._id,
          content: message.content,
          isRead: message.isRead,
          createdAt: message.createdAt
        }
      });

      console.log(`Message sent from ${senderId} to ${receiverId}`);
    } catch (error) {
      console.error('Send message error:', error);
      socket.emit('error', {
        message: 'Failed to send message',
        error: error.message
      });
    }
  });

  // Handle message read receipt
  socket.on('mark_message_read', async (data) => {
    try {
      const { messageId } = data;
      const userId = socket.userId;

      if (!messageId) {
        socket.emit('error', {
          message: 'Message ID is required'
        });
        return;
      }

      const message = await Message.findById(messageId);

      if (!message) {
        socket.emit('error', {
          message: 'Message not found'
        });
        return;
      }

      // Only receiver can mark as read
      if (message.receiverId.toString() !== userId) {
        socket.emit('error', {
          message: 'Unauthorized to mark this message as read'
        });
        return;
      }

      // Update message
      message.isRead = true;
      message.readAt = new Date();
      await message.save();

      // Notify sender
      io.to(`user_${message.senderId}`).emit('message_read', {
        messageId: message._id,
        readAt: message.readAt
      });

      socket.emit('message_marked_read', {
        messageId: message._id
      });
    } catch (error) {
      console.error('Mark message read error:', error);
      socket.emit('error', {
        message: 'Failed to mark message as read',
        error: error.message
      });
    }
  });
};

