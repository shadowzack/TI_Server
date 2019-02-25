const Data_tags = require("../models/Data_tags");
const mongoose = require("mongoose");

/*
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


*/

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
exports.getTagsQustions = (req, res, next) => {
  /*
  Data_tags.aggregate([
    //{ "$match": { source: req.params.source } },
    /*  {
        "$project": {
        "source": req.params.source,
        "$slice": [
          "$years.tags.qIds",
          Math.floor(Math.random() * (1000  + 1) ),
          10
        ]
      }
    }
    
    { $match: { source: req.params.source } },
    

    {
      $project: {
        tags: 
          {
           // tag: "$year.tags.tag",
           // hits: "$year.tags.hits",
           // qIds:{$slice:["$year.tags.qIds",3]}
           threeFavorites: { $slice: [ "$year.tags.qIds", 3 ] }
          }
        
      }
    }
  ])
  */
  Data_tags.find(
    { source: req.params.source },
    { "year.tags.qIds": { $slice: [10, 10] } }
  )
    .then(tags => {
      res.json(tags);
    })
    .catch(err => res.status(500).json(err));
};
