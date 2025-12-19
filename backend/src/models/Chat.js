import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Ensure participants array has exactly 2 users
chatSchema.pre('save', function(next) {
  if (this.participants.length !== 2) {
    return next(new Error('Chat must have exactly 2 participants'));
  }
  // Sort participants to ensure uniqueness
  this.participants.sort();
  next();
});

// Compound index to ensure unique chat between two users
chatSchema.index({ participants: 1 }, { unique: true });

// Method to get the other participant
chatSchema.methods.getOtherParticipant = function(userId) {
  return this.participants.find(
    participant => participant.toString() !== userId.toString()
  );
};

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;

