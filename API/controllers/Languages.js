const Languages = require('../models/Languages');
const mongoose = require('mongoose');


exports.getAllLanguages = (req, res, next) => {
    let responseJson;
    Languages
        .find().sort({
            count: -1
        })
        .then(languages => {

            let sum = {
                "2013": 0,
                "2014": 0,
                "2015": 0,
                "2016": 0,
                "2017": 0,
                "2018": 0,
                "2019": 0,
                "none": 0
            }

            languages.forEach((lang) => {
                Object.keys(lang.years).forEach((key) => {
                    sum[key] += lang.years[key];
                });
            });

            responseJson = {
                "languages": languages,
                "sum": sum
            }
            res.json(responseJson)
        })
        .catch((error) => res.status(500).json(error));

};

exports.getLanguageById = (req, res, next) => {

    Languages
        .findById(req.params.id)
        .then((Language) => res.json(Language))
        .catch(err => res.status(500).json(err));
};


exports.getLanguagesByYears = (req, res, next) => {

    Languages
        .find({}, {
            'source': 1,
            'count': 1,
            'years.2018': 1
        })
        .then((Language) => {
            res.json(Language)
        })
        .catch(err => res.status(500).json(err));
};