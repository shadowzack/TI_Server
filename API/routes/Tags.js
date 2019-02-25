const express = require('express');
const router = express.Router();
const tagsController = require('../controllers/Tags');



// route   GET tags/:source
// desc    Get language by source with 10 random question IDs
// access  Public
router.get('/:source', tagsController.getTagsQustions);


// route   GET tags/alltags/:source
// desc    Get language by source with 10 random question IDs
// access  Public
router.get('/alltags/:source', tagsController.getLanaguageTags);

// route   GET tags/
// desc    recive 2 tags and retrun ids array intersection 
// access  Public
router.get('/:first/:second', tagsController.getIntersection);

module.exports = router;