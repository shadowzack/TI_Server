const Languages = require('../models/Languages');
const mongoose = require('mongoose');


exports.getAllLanguagess = (req, res, next) => {

    Languages
        .find()
        .then((languages) => res.json(languages))
        .catch((error) => res.status(500).json(error));

};

exports.getLanguageById = (req, res, next) => {

    Languages
        .findById(req.params.id)
        .then((Language) => res.json(Language))
        .catch(err => res.status(500).json(err));
};