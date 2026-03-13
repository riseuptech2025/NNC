const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getSponsoredPosts,
  createSponsoredPost,
  updateSponsoredPost,
  deleteSponsoredPost,
  trackSponsoredImpression,
  trackSponsoredClick
} = require('../controllers/sponsoredPostController');

router.get('/', getSponsoredPosts);
router.post('/', authMiddleware, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'sponsorLogo', maxCount: 1 }
]), createSponsoredPost);
router.put('/:id', authMiddleware, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'sponsorLogo', maxCount: 1 }
]), updateSponsoredPost);
router.delete('/:id', authMiddleware, deleteSponsoredPost);
router.post('/:id/impression', trackSponsoredImpression);
router.post('/:id/click', trackSponsoredClick);

module.exports = router;