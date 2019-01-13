const Languages = require('../models/Languages');
const mongoose = require('mongoose');


exports.getAllLanguages = (req, res, next) => {

    Languages
        .find().sort( { count: -1 } )
        .then(languages => {
            console.log(languages)
            res.json(languages)
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
