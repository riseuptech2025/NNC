const Reaction = require('../models/Reaction');
const News = require('../models/News');

const addReaction = async (req, res) => {
  try {
    const { type } = req.body;
    const newsId = req.params.id;
    const userId = req.ip; // Use IP as user identifier (simplified)

    // Check if user already reacted
    let reaction = await Reaction.findOne({ newsId, userId });

    if (reaction) {
      // Update reaction type
      const oldType = reaction.type;
      reaction.type = type;
      await reaction.save();

      // Update news reaction counts
      await News.findByIdAndUpdate(newsId, {
        $inc: {
          [`reactions.${oldType}`]: -1,
          [`reactions.${type}`]: 1
        }
      });
    } else {
      // Create new reaction
      reaction = new Reaction({
        newsId,
        userId,
        type
      });
      await reaction.save();

      // Update news reaction count
      await News.findByIdAndUpdate(newsId, {
        $inc: { [`reactions.${type}`]: 1 }
      });
    }

    // Get updated news
    const updatedNews = await News.findById(newsId);
    res.json({ reactions: updatedNews.reactions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { addReaction };