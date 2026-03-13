const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema({
  newsId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'News',
    required: true
  },
  type: {
    type: String,
    enum: ['like', 'love', 'wow', 'sad', 'angry'],
    required: true
  },
  userId: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Ensure one reaction per user per news
reactionSchema.index({ newsId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Reaction', reactionSchema);