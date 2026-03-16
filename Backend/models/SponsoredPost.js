const mongoose = require('mongoose');

const sponsoredPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  imagePublicId: String,
  sponsorName: {
    type: String,
    required: true
  },
  sponsorLogo: String,
  sponsorWebsite: String,
  category: {
    type: String,
    enum: ['Politics', 'International','Shares', 'Technology', 'Sports', 'Business', 'Entertainment', 'Health', 'Sponsored'],
    default: 'Sponsored'
  },
  tags: [String],
  isSponsored: {
    type: Boolean,
    default: true
  },
  sponsoredLabel: {
    type: String,
    default: 'Sponsored Content'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'cancelled'],
    default: 'pending'
  },
  amount: {
    type: Number
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  targetUrl: String,
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
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SponsoredPost', sponsoredPostSchema);