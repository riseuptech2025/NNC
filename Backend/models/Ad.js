const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['banner', 'sidebar', 'in-article', 'popup', 'native'],
    required: true
  },
  provider: {
    type: String,
    enum: ['google-adsense', 'adsterra', 'direct', 'sponsored'],
    required: true
  },
  code: {
    type: String, // For AdSense/Adsterra scripts
    required: function() {
      return this.provider !== 'direct';
    }
  },
  image: {
    type: String, // For direct/sponsored ads
    required: function() {
      return this.provider === 'direct' || this.provider === 'sponsored';
    }
  },
  link: {
    type: String, // For direct/sponsored ads
    required: function() {
      return this.provider === 'direct' || this.provider === 'sponsored';
    }
  },
  position: {
    type: String,
    enum: ['top', 'bottom', 'left', 'right', 'middle', 'after-1', 'after-2', 'after-3', 'sidebar-top', 'sidebar-middle', 'sidebar-bottom'],
    required: true
  },
  pages: [{
    type: String,
    enum: ['home', 'category', 'article', 'search', 'all']
  }],
  categories: [{
    type: String
  }],
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  impressions: {
    type: Number,
    default: 0
  },
  clicks: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  priority: {
    type: Number,
    default: 1
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Ad', adSchema);