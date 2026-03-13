const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
  getSEOSettings,
  updateSEOSettings,
  generateSitemap,
  generateRobotsTxt
} = require('../controllers/seoController');

router.get('/settings', getSEOSettings);
router.put('/settings', authMiddleware, updateSEOSettings);
router.get('/sitemap.xml', generateSitemap);
router.get('/robots.txt', generateRobotsTxt);

module.exports = router;