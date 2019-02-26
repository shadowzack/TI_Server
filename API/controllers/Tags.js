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
exports.getLanaguageTags = (req, res, next) => {
  // Data_tags.find({source: req.params.source},{"year.tags.qIds":0})
  // .project({ "year.tags.qIds": 0 })
  Data_tags.aggregate([
    /*{ $match: { source: req.params.source } },
    //{$gt:{"$year.tags.hits": 100}},
    {
      $project: { "year.tags.qIds": 0 }
      
    },
    { $unwind: "$year" },
    { $unwind: "$year.tags" },
    { $sort: { "year.tags.hits": 1 } }*/

    { $match: { source: req.params.source } },

    // { $group : { _id : {month_joined:"$month_joined"} , number : { $sum : 1 } } },
    { $unwind: "$year" },
    { $unwind: "$year.tags" },
    { $sort: { "year.tags.hits": -1 } },
    {
      $project: {
        "year.tags.qIds": 0
      }
    },

    {
      $group: {
        _id: "$_id",
        source: { $first: "$source" },
        count: { $first: "$count" },
        year: { $push: "$$ROOT" }
        /* _id: "$_id",
        source: { $first: "$source" },
        count: { $first: "$count" },
        year: {
          $push: { year: "$_id.year", count: "$_id.count",tags: "$year.year.tags"}
        }
        //year: { $push: "$year" }
        */
      }
    }
  ])
    .then(tags => {
      /* tags.year.forEach(yr => {
        yr.tags.forEach((tag,index) => {
          if(tag.hits<100)
            delete yr[index];
        });
      });
*/
      res.json(tags);
    })
    .catch(err => res.status(500).json(err));
};
exports.getLanaguageTagQustions = (req, res, next) => {
  /*Data_tags.find(
    {
      $and: [{ source: req.params.source }, { "year.tags.tag": req.params.tag }]
    },
    { "year.tags.qIds": 1 }
  )*/
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
