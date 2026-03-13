const SponsoredPost = require('../models/SponsoredPost');
const cloudinary = require('../utils/cloudinary');

const getSponsoredPosts = async (req, res) => {
  try {
    const { active, category, limit = 10 } = req.query;
    const query = {};
    
    if (active === 'true') {
      query.isActive = true;
      query.startDate = { $lte: new Date() };
      query.endDate = { $gte: new Date() };
    }

    if (category) {
      query.category = category;
    }

    const posts = await SponsoredPost.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createSponsoredPost = async (req, res) => {
  try {
    let imageUrl = '';
    let imagePublicId = '';
    let logoUrl = '';
    let logoPublicId = '';

    // Upload main image
    if (req.files?.image) {
      const result = await cloudinary.uploader.upload(req.files.image[0].path, {
        folder: 'nnc-sponsored'
      });
      imageUrl = result.secure_url;
      imagePublicId = result.public_id;
    }

    // Upload logo if provided
    if (req.files?.sponsorLogo) {
      const result = await cloudinary.uploader.upload(req.files.sponsorLogo[0].path, {
        folder: 'nnc-sponsors'
      });
      logoUrl = result.secure_url;
      logoPublicId = result.public_id;
    }

    // Parse tags if they're a string
    let tags = [];
    if (req.body.tags) {
      tags = typeof req.body.tags === 'string' 
        ? req.body.tags.split(',').map(tag => tag.trim())
        : req.body.tags;
    }

    const post = new SponsoredPost({
      ...req.body,
      image: imageUrl,
      imagePublicId,
      sponsorLogo: logoUrl,
      sponsorLogoPublicId: logoPublicId,
      tags
    });

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateSponsoredPost = async (req, res) => {
  try {
    const post = await SponsoredPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    let updateData = { ...req.body };

    // Handle image updates
    if (req.files?.image) {
      // Delete old image
      if (post.imagePublicId) {
        await cloudinary.uploader.destroy(post.imagePublicId);
      }
      const result = await cloudinary.uploader.upload(req.files.image[0].path, {
        folder: 'nnc-sponsored'
      });
      updateData.image = result.secure_url;
      updateData.imagePublicId = result.public_id;
    }

    if (req.files?.sponsorLogo) {
      // Delete old logo
      if (post.sponsorLogoPublicId) {
        await cloudinary.uploader.destroy(post.sponsorLogoPublicId);
      }
      const result = await cloudinary.uploader.upload(req.files.sponsorLogo[0].path, {
        folder: 'nnc-sponsors'
      });
      updateData.sponsorLogo = result.secure_url;
      updateData.sponsorLogoPublicId = result.public_id;
    }

    // Parse tags
    if (updateData.tags && typeof updateData.tags === 'string') {
      updateData.tags = updateData.tags.split(',').map(tag => tag.trim());
    }

    const updatedPost = await SponsoredPost.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteSponsoredPost = async (req, res) => {
  try {
    const post = await SponsoredPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Delete images from cloudinary
    if (post.imagePublicId) {
      await cloudinary.uploader.destroy(post.imagePublicId);
    }
    if (post.sponsorLogoPublicId) {
      await cloudinary.uploader.destroy(post.sponsorLogoPublicId);
    }

    await post.deleteOne();
    res.json({ message: 'Sponsored post deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const trackSponsoredImpression = async (req, res) => {
  try {
    await SponsoredPost.findByIdAndUpdate(req.params.id, {
      $inc: { impressions: 1 }
    });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const trackSponsoredClick = async (req, res) => {
  try {
    await SponsoredPost.findByIdAndUpdate(req.params.id, {
      $inc: { clicks: 1 }
    });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getSponsoredPosts,
  createSponsoredPost,
  updateSponsoredPost,
  deleteSponsoredPost,
  trackSponsoredImpression,
  trackSponsoredClick
};