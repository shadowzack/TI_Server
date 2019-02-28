const Data_tags = require('../models/Data_tags');
const mongoose = require('mongoose');
const async = require('async');
const { intersection } = require('underscore');
const http = require('http');
const request = require('request');
// const await =require("await");
const cheerio = require('cheerio');

const scrape = async (qIds, callback) => {
	resArray = await [];
	if (qIds.length < 10) max = qIds.length;
	else max = 10;
	for (let index = 0; index < max; index++) {
		request(
			{
				method: 'GET',
				url: `https://stackoverflow.com/questions/${qIds[index]}`
			},
			function(err, response, body, callback) {
				if (err) return console.error(err);

				// get the HTML body from WordThink.com
				$ = cheerio.load(body);

				var question = $('#question-header h1 a').text();
				console.log(question);
				resArray.push({ question: question, id: qIds[index] });
			}
		);
	}

	//callback(resArray)
	return resArray;
	//return resArray;
};

exports.getLanaguageTags = (req, res, next) => {
	Data_tags.find({ source: req.params.source }, { 'year.tags.qIds': 0 })
		/*Data_tags.aggregate([
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
  ])*/
		.then((tags) => {
			res.json(tags);
		})
		.catch((err) => res.status(500).json(err));
};
exports.getLanaguageTagQustions = (req, res, next) => {
	Data_tags.aggregate([
		{ $match: { source: req.params.source } },
		{ $unwind: '$year' },
		{ $unwind: '$year.tags' },
		{ $match: { 'year.tags.tag': req.params.tag } }
	])
		.then((tags) => {
			res.json(tags);
		})
		.catch((err) => res.status(500).json(err));
};

exports.getTagsQustions = (req, res, next) => {
	Data_tags.find({ source: req.params.source }, { 'year.tags.qIds': { $slice: [ 10, 10 ] } })
		.then((tags) => {
			res.json(tags);
		})
		.catch((err) => res.status(500).json(err));
};

exports.compareLanguagesByTags = (req, res, next) => {
	const newComp = {
		first: req.body.first,
		second: req.body.second
	};

	async.parallel(
		[
			function(callback) {
				Data_tags.aggregate(
					[
						{ $match: { source: newComp.first.source } },
						{ $unwind: '$year' },
						{ $unwind: '$year.tags' },
						{ $match: { 'year.tags.tag': newComp.first.tag } }
					],
					callback
				);
			},
			function(callback) {
				Data_tags.aggregate(
					[
						{ $match: { source: newComp.second.source } },
						{ $unwind: '$year' },
						{ $unwind: '$year.tags' },
						{ $match: { 'year.tags.tag': newComp.second.tag } }
					],
					callback
				);
			}
		],
		(err, results) => {
			const first = results[0];
			const second = results[1];

			//intersection=_.intersection(firstArray,secondArray);

			try {
				firstArray = first[0].year.tags.qIds;
				secondArray = second[0].year.tags.qIds;
				//intersection:_.intersection(firstArray,secondArray)

				intersectionArray = [];
				j = 0;
				for (var i = 0; i < firstArray.length; ++i)
					if (secondArray.indexOf(firstArray[i]) != -1) intersectionArray[j++] = firstArray[i];

				if (err) {
					throw err;
				}

				questionArray = scrape(intersectionArray);

				//JSON.parse(questionArray)

				res.json({
					questionArray: questionArray,
					intersectionArray: intersectionArray,
					firstTag: {
						source: first[0].source,
						tag: first[0].year.tags.tag,
						hits: first[0].year.tags.hits
					},
					secondTag: {
						source: second[0].source,
						tag: second[0].year.tags.tag,
						hits: second[0].year.tags.hits
					}
				});
				// res.json({first:first,second,second});
				// res.json({ firstArray:firstArray,secondArray:secondArray });
			} catch (err) {
				res.status(500).json(err);
			}
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
		{ $match: { source: { $in: [ req.params.first, req.params.second ] } } },
		{
			$group: {
				_id: 0,
				sets: { $push: '$year.tags' },
				initialSet: { $first: '$year.tags' }
			}
		},
		{
			$project: {
				commonSets: {
					$reduce: {
						input: '$sets',
						initialValue: '$initialSet',
						in: { $setIntersection: [ '$$value', '$$this' ] }
					}
				}
			}
		}
	])
		.then((tags) => {
			res.json(tags);
		})
		.catch((err) => res.status(500).json(err));
};

// exports.compareLanguages = (req, res) => {
// 	var arraycounter = [];
// 	Data_tags.findOne({ 'year[0].tags': 'html' }).then((elem) => {
// 		console.log(elem);
// 		// console.log([ elem['year'] ]);
// 		elem.year[0].tags.forEach((tag) => {
// 			// console.log(tag.tag);
// 			Data_tags.aggregate([
// 				{ $unwind: '$source' },
// 				{ $unwind: '$year' },
// 				{ $unwind: '$year.tags' },
// 				{ $match: { 'year[0].tags.tag': tag.tag } }
// 			]).then((tags) => {
// 				console.log(tags);
// 			});
// 			// Data_tags.find({ 'year[0].tags': { $in: tag.tag } }).then((objects) => {
// 			// 	console.log(objects);
// 			// if (objects.length > 0) {
// 			// 	console.log('found');
// 			// 	objects.forEach((lang) => {
// 			// 		arraycounter[lang.source]++;
// 			// 		console.log(arraycounter);
// 			// 	});
// 			// }
// 			// });
// 		});
// 	});
// };

exports.compareLanguages = (req, res) => {
	Data_tags.findOne({ source: req.params.source }).then((elem) => {
		if (elem) {
			elem.year[0].tags.forEach((tag) => {
				Data_tags.find({ 'year[0].tags.tag': tag.tag }).then((okay) => console.log(okay));
			});
		}
	});
};
