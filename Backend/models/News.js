const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Politics', 'International','Shares', 'Technology', 'Sports', 'Business', 'Entertainment', 'Health', 'Breaking']
  },
  image: {
    type: String,
    required: true
  },
  imagePublicId: String,
  author: {
    type: String,
    default: 'NNC Admin'
  },
  tags: [String],
  reactions: {
    like: { type: Number, default: 0 },
    love: { type: Number, default: 0 },
    wow: { type: Number, default: 0 },
    sad: { type: Number, default: 0 },
    angry: { type: Number, default: 0 }
  },
  shares: {
    type: Number,
    default: 0
  },
  isTrending: {
    type: Boolean,
    default: false
  },
  isBreaking: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('News', newsSchema);