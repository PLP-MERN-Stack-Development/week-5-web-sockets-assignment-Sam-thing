const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // For public messages
  },
  content: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['public', 'private'],
    default: 'public'
  },
  roomId: {
    type: String,
    default: 'general'
  }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
