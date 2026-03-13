const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

// Import routes
const authRoutes = require('../routes/authRoutes');
const newsRoutes = require('../routes/newsRoutes');
const commentRoutes = require('../routes/commentRoutes');
const reactionRoutes = require('../routes/reactionRoutes');
const searchRoutes = require('../routes/searchRoutes');
const adRoutes = require('../routes/adRoutes');
const sponsoredRoutes = require('../routes/sponsoredRoutes');
const seoRoutes = require('../routes/seoRoutes');

// Import controllers
const { createInitialAdmin } = require('../controllers/authController');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    // Create initial admin
    createInitialAdmin();
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/reactions', reactionRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/ads', adRoutes);
app.use('/api/sponsored', sponsoredRoutes);
app.use('/api/seo', seoRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'NNC API is running',
    timestamp: new Date().toISOString()
  });
});

// Serve sitemap.xml
app.get('/sitemap.xml', async (req, res) => {
  try {
    const News = require('../models/News');
    const { createSitemap } = require('../utils/sitemapGenerator');
    const news = await News.find().sort({ createdAt: -1 }).limit(500);
    const sitemap = await createSitemap(news);
    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).send('Error generating sitemap');
  }
});

// Serve robots.txt
app.get('/robots.txt', (req, res) => {
  const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /login/
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml

# Crawl delay for heavy bots
User-agent: *
Crawl-delay: 10

# Specific rules for different bots
User-agent: Googlebot
Allow: /
Crawl-delay: 5

User-agent: Bingbot
Allow: /
Crawl-delay: 5

User-agent: Twitterbot
Allow: /

User-agent: FacebookExternalHit
Allow: /
`;
  
  res.header('Content-Type', 'text/plain');
  res.send(robotsTxt);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// For Vercel serverless
module.exports = app;

// For local development
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}