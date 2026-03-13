const SEOSettings = require('../models/SEOSettings');
const News = require('../models/News');
const { createSitemap } = require('../utils/sitemapGenerator');

const getSEOSettings = async (req, res) => {
  try {
    let settings = await SEOSettings.findOne();
    if (!settings) {
      settings = await SEOSettings.create({});
    }
    res.json(settings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateSEOSettings = async (req, res) => {
  try {
    let settings = await SEOSettings.findOne();
    if (!settings) {
      settings = new SEOSettings(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    await settings.save();
    res.json(settings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const generateSitemap = async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 }).limit(500); // Limit to 500 for performance
    const sitemap = await createSitemap(news);
    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const generateRobotsTxt = async (req, res) => {
  try {
    const settings = await SEOSettings.findOne();
    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    const robotsTxt = settings?.robotsTxt || `User-agent: *
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getSEOSettings,
  updateSEOSettings,
  generateSitemap,
  generateRobotsTxt
};