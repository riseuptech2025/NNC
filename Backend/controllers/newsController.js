const News = require('../models/News');
const Comment = require('../models/Comment');
const cloudinary = require('../utils/cloudinary');

const getNews = async (req, res) => {
  try {
    const { category, page = 1, limit = 10, trending } = req.query;
    const query = {};
    
    if (category) query.category = category;
    if (trending === 'true') query.isTrending = true;

    const news = await News.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await News.countDocuments(query);

    res.json({
      news,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }
    res.json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createNews = async (req, res) => {
  try {
    const { title, description, content, category, tags, isBreaking, isTrending } = req.body;

    // Upload image to cloudinary
    let imageUrl = '';
    let imagePublicId = '';

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'nnc-news'
      });
      imageUrl = result.secure_url;
      imagePublicId = result.public_id;
    }

    const news = new News({
      title,
      description,
      content,
      category,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      image: imageUrl,
      imagePublicId,
      author: 'NNC Admin',
      isBreaking: isBreaking === 'true',
      isTrending: isTrending === 'true'
    });

    await news.save();
    res.status(201).json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    const { title, description, content, category, tags, isBreaking, isTrending } = req.body;

    // Handle image update
    if (req.file) {
      // Delete old image from cloudinary
      if (news.imagePublicId) {
        await cloudinary.uploader.destroy(news.imagePublicId);
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'nnc-news'
      });
      news.image = result.secure_url;
      news.imagePublicId = result.public_id;
    }

    news.title = title || news.title;
    news.description = description || news.description;
    news.content = content || news.content;
    news.category = category || news.category;
    news.tags = tags ? tags.split(',').map(tag => tag.trim()) : news.tags;
    news.isBreaking = isBreaking !== undefined ? isBreaking === 'true' : news.isBreaking;
    news.isTrending = isTrending !== undefined ? isTrending === 'true' : news.isTrending;

    await news.save();
    res.json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    // Delete image from cloudinary
    if (news.imagePublicId) {
      await cloudinary.uploader.destroy(news.imagePublicId);
    }

    // Delete related comments
    await Comment.deleteMany({ newsId: req.params.id });

    await news.deleteOne();
    res.json({ message: 'News deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const totalNews = await News.countDocuments();
    const totalComments = await Comment.countDocuments();
    
    // Calculate total reactions
    const news = await News.find();
    const totalLikes = news.reduce((acc, item) => {
      return acc + Object.values(item.reactions).reduce((sum, val) => sum + val, 0);
    }, 0);

    const latestNews = await News.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      totalNews,
      totalComments,
      totalLikes,
      latestNews
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
  getDashboardStats
};