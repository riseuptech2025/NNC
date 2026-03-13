const mongoose = require('mongoose');

const seoSettingsSchema = new mongoose.Schema({
  siteTitle: {
    type: String,
    required: true,
    default: 'NNC - Nepali News Center'
  },
  siteDescription: {
    type: String,
    required: true,
    default: 'Latest news from Nepal including politics, technology, sports, business, entertainment and health.'
  },
  siteKeywords: {
    type: String,
    default: 'Nepali news, Nepal news, politics Nepal, technology Nepal, sports Nepal'
  },
  authorName: {
    type: String,
    default: 'NNC Team'
  },
  twitterHandle: {
    type: String,
    default: '@nncnews'
  },
  facebookPage: {
    type: String
  },
  googleAnalyticsId: {
    type: String
  },
  googleAdSenseId: {
    type: String
  },
  adsterraId: {
    type: String
  },
  googleSiteVerification: {
    type: String
  },
  bingSiteVerification: {
    type: String
  },
  facebookAppId: {
    type: String
  },
  robotsTxt: {
    type: String,
    default: `User-agent: *
Allow: /
Sitemap: https://yourdomain.com/sitemap.xml`
  },
  customHeadScripts: {
    type: String
  },
  customBodyScripts: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SEOSettings', seoSettingsSchema);