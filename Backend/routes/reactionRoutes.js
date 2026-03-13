const express = require('express');
const router = express.Router();
const { addReaction } = require('../controllers/reactionController');

router.post('/:id', addReaction);

module.exports = router;