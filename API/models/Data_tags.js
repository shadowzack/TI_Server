const mongoose = require('mongoose');

var data_tags = new mongoose.Schema({

    source: String,
    count: Number,
    years: [{
        year:String,
        count:Number,
        tags:[{
            tag:String,
            hits:Number,
            qIds:[Number]
        }]
    }]
},{collection:'data_tags'});


module.exports = mongoose.model('Data_tags', data_tags);