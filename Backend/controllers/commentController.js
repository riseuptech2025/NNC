const Comment = require('../models/Comment');
const News = require('../models/News');

const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ 
      newsId: req.params.newsId,
      isApproved: true 
    }).sort({ createdAt: -1 });
    
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createComment = async (req, res) => {
  try {
    const { userName, comment } = req.body;
    
    const newComment = new Comment({
      newsId: req.params.newsId,
      userName: userName || 'Anonymous',
      comment,
      isApproved: false // Comments need moderation
    });

    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    await comment.deleteOne();
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const moderateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    comment.isApproved = req.body.approve;
    await comment.save();

    res.json({ message: 'Comment moderated successfully', comment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getPendingComments = async (req, res) => {
  try {
    const comments = await Comment.find({ isApproved: false })
      .populate('newsId', 'title')
      .sort({ createdAt: -1 })
      .limit(20);
    
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getComments,
  createComment,
  deleteComment,
  moderateComment,
  getPendingComments
};