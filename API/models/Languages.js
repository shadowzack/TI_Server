const mongoose = require('mongoose');

var lang = new mongoose.Schema({

    source: String,
    count: Number,
    years: {
        2019: Number,
        2018: Number,
        2017: Number,
        2016: Number,
        2015: Number,
        2014: Number,
        2013: Number,
        none: Number
    }

});


module.exports = mongoose.model('Lang', lang);