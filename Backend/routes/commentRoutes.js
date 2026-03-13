const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
  getComments,
  createComment,
  deleteComment,
  moderateComment,
  getPendingComments
} = require('../controllers/commentController');

router.get('/pending', authMiddleware, getPendingComments);
router.get('/:newsId', getComments);
router.post('/:newsId', createComment);
router.put('/:id/moderate', authMiddleware, moderateComment);
router.delete('/:id', authMiddleware, deleteComment);

module.exports = router;