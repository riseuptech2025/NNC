const express = require('express');
const router = express.Router();
const { searchNews } = require('../controllers/searchController');

router.get('/', searchNews);

module.exports = router;