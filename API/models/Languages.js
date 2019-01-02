const mongoose = require('mongoose');

var lang = new mongoose.Schema({

    Source: String,
    Count: Number,
    Years: {
        2018: Number,
        2017: Number,
        2016: Number,
        2015: Number,
        2014: Number,
        2013: Number,
        2012: Number
    }

});


module.exports = mongoose.model('Lang', lang);