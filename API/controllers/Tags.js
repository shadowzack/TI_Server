const Data_tags = require("../models/Data_tags");
const mongoose = require("mongoose");
const async = require("async");

exports.getLanaguageTags = (req, res, next) => {
  Data_tags.aggregate([
    { $match: { source: req.params.source } },
    { $unwind: "$year" },
    { $unwind: "$year.tags" },
    { $sort: { "year.tags.hits": -1 } },
    { $project: { "year.tags.qIds": 0 } },
    {
      $group: {
        _id: "$_id",
        source: { $first: "$source" },
        count: { $first: "$count" },
        year: { $push: "$$ROOT" }
      }
    }
  ])
    .then(tags => {
      res.json(tags);
    })
    .catch(err => res.status(500).json(err));
};
exports.getLanaguageTagQustions = (req, res, next) => {
  Data_tags.aggregate([
    { $match: { source: req.params.source } },
    { $unwind: "$year" },
    { $unwind: "$year.tags" },
    { $match: { "year.tags.tag": req.params.tag } }
  ])
    .then(tags => {
      res.json(tags);
    })
    .catch(err => res.status(500).json(err));
};

exports.getTagsQustions = (req, res, next) => {
  Data_tags.find(
    { source: req.params.source },
    { "year.tags.qIds": { $slice: [10, 10] } }
  )
    .then(tags => {
      res.json(tags);
    })
    .catch(err => res.status(500).json(err));
};

exports.compareLanguagesByTags = (req, res, next) => {
  const newComp = {
    first: req.body.first,
    second: req.body.second
  };
  async.parallel(
    [
      function(callback) {
        Data_tags.aggregate([
          { $match: { source: newComp.first.source } },
          { $unwind: "$year" },
          { $unwind: "$year.tags" },
          { $match: { "year.tags.tag": newComp.first.tag } }
        ]);
      },
      function(callback) {
        Data_tags.aggregate([
          { $match: { source: newComp.second.source } },
          { $unwind: "$year" },
          { $unwind: "$year.tags" },
          { $match: { "year.tags.tag": newComp.second.tag } }
        ]);
      }
    ],

    function(err, results) {
      res.json({ first: results[0], second: results[1] });
    }
  );
};

//keep it form me
exports.getIntersection = (req, res, next) => {
  /*Data_tags.aggregate([
    {
      $match: {
        source: { $in: [req.params.first, req.params.second] }
      }
    },
    {
      $group: {
        _id: 0,
        set1: { $first: "$year.tags" },
        set2: { $last: "$year.tags" }
      }
    },
    {
      $project: {
        set1: 1,
        set2: 1,
        commonToBoth: { $setIntersection: ["$set1", "$set2"] },
        _id: 0
      }
    }
  ])*/

  Data_tags.aggregate([
    { $match: { source: { $in: [req.params.first, req.params.second] } } },
    {
      $group: {
        _id: 0,
        sets: { $push: "$year.tags" },
        initialSet: { $first: "$year.tags" }
      }
    },
    {
      $project: {
        commonSets: {
          $reduce: {
            input: "$sets",
            initialValue: "$initialSet",
            in: { $setIntersection: ["$$value", "$$this"] }
          }
        }
      }
    }
  ])
    .then(tags => {
      res.json(tags);
    })
    .catch(err => res.status(500).json(err));
};
