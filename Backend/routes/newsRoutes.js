const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
  getDashboardStats
} = require('../controllers/newsController');

router.get('/', getNews);
router.get('/stats', getDashboardStats);
router.get('/:id', getNewsById);
router.post('/', authMiddleware, upload.single('image'), createNews);
router.put('/:id', authMiddleware, upload.single('image'), updateNews);
router.delete('/:id', authMiddleware, deleteNews);

module.exports = router;