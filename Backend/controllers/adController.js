const Ad = require('../models/Ad');
const cloudinary = require('../utils/cloudinary');

const getAds = async (req, res) => {
  try {
    const { position, type, page, category } = req.query;
    const query = { isActive: true };
    
    if (position) query.position = position;
    if (type) query.type = type;
    
    // Filter by current date
    query.startDate = { $lte: new Date() };
    query.$or = [
      { endDate: { $exists: false } },
      { endDate: null },
      { endDate: { $gte: new Date() } }
    ];

    // Filter by pages
    if (page) {
      query.$or = [
        { pages: 'all' },
        { pages: page }
      ];
    }

    // Filter by categories
    if (category) {
      query.$or = [
        ...(query.$or || []),
        { categories: category }
      ];
    }

    const ads = await Ad.find(query)
      .sort({ priority: -1, createdAt: -1 });

    res.json(ads);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createAd = async (req, res) => {
  try {
    let imageUrl = '';
    let imagePublicId = '';

    // Upload image if provided
    if (req.files && req.files.length > 0) {
      const result = await cloudinary.uploader.upload(req.files[0].path, {
        folder: 'nnc-ads'
      });
      imageUrl = result.secure_url;
      imagePublicId = result.public_id;
    }

    // Parse JSON fields
    const adData = {
      ...req.body,
      image: imageUrl,
      imagePublicId,
      createdBy: req.adminId
    };

    // Parse pages and categories if they're strings
    if (typeof adData.pages === 'string') {
      try {
        adData.pages = JSON.parse(adData.pages);
      } catch {
        adData.pages = [adData.pages];
      }
    }

    if (typeof adData.categories === 'string') {
      try {
        adData.categories = JSON.parse(adData.categories);
      } catch {
        adData.categories = adData.categories ? [adData.categories] : [];
      }
    }

    const ad = new Ad(adData);
    await ad.save();
    res.status(201).json(ad);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateAd = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' });
    }

    let updateData = { ...req.body };

    // Handle image update
    if (req.files && req.files.length > 0) {
      // Delete old image if exists
      if (ad.imagePublicId) {
        await cloudinary.uploader.destroy(ad.imagePublicId);
      }
      
      const result = await cloudinary.uploader.upload(req.files[0].path, {
        folder: 'nnc-ads'
      });
      updateData.image = result.secure_url;
      updateData.imagePublicId = result.public_id;
    }

    // Parse JSON fields
    if (typeof updateData.pages === 'string') {
      try {
        updateData.pages = JSON.parse(updateData.pages);
      } catch {
        updateData.pages = [updateData.pages];
      }
    }

    if (typeof updateData.categories === 'string') {
      try {
        updateData.categories = JSON.parse(updateData.categories);
      } catch {
        updateData.categories = updateData.categories ? [updateData.categories] : [];
      }
    }

    const updatedAd = await Ad.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updatedAd);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteAd = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' });
    }

    // Delete image from cloudinary
    if (ad.imagePublicId) {
      await cloudinary.uploader.destroy(ad.imagePublicId);
    }

    await ad.deleteOne();
    res.json({ message: 'Ad deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const trackImpression = async (req, res) => {
  try {
    await Ad.findByIdAndUpdate(req.params.id, {
      $inc: { impressions: 1 }
    });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const trackClick = async (req, res) => {
  try {
    await Ad.findByIdAndUpdate(req.params.id, {
      $inc: { clicks: 1 }
    });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAds,
  createAd,
  updateAd,
  deleteAd,
  trackImpression,
  trackClick
};