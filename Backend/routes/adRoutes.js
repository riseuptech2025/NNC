const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getAds,
  createAd,
  updateAd,
  deleteAd,
  trackImpression,
  trackClick
} = require('../controllers/adController');

router.get('/', getAds);
router.post('/', authMiddleware, upload.array('images'), createAd);
router.put('/:id', authMiddleware, upload.array('images'), updateAd);
router.delete('/:id', authMiddleware, deleteAd);
router.post('/:id/impression', trackImpression);
router.post('/:id/click', trackClick);

module.exports = router;