const express = require('express');
const router = express.Router();
const languagesController = require('../controllers/Languages');

// route   GET languages/
// desc    Returns all the languages
// access  Public
router.get('/', languagesController.getAllLanguagess);

// route   GET languages/:id
// desc    Get language by id
// access  Public
router.get('/:id', languagesController.getLanguageById);

module.exports = router;