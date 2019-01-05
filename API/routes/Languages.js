const express = require('express');
const router = express.Router();
const languagesController = require('../controllers/Languages');

// route   GET languages/
// desc    Returns all the languages
// access  Public
router.get('/', languagesController.getAllLanguages);

// route   GET languages/:id
// desc    Get language by id
// access  Public
router.get('/:id', languagesController.getLanguageById);

// route   GET languages/:year
// desc    Get languages by year
// access  Public
router.get('/year/:year', languagesController.getLanguagesByYears);

module.exports = router;