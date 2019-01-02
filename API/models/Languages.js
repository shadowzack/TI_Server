const mongoose = require('mongoose');

const LanguagesSchema = new mongoose.Schema({

    Source: {
        type: String,
        required: true
    },
    Count: {
        type: Number,
        required: true
    },
    Years: {
        2018: Number,
        2017: Number,
        2016: Number,
        2015: Number,
        2014: Number,
        2013: Number,
        none: Number
    }

});

module.exports = mongoose.model('Languages', LanguagesSchema);