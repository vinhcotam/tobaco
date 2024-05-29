'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    Comment = mongoose.model('Comment'),
    Newsdaily = mongoose.model('Newsdaily'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    _ = require('lodash');
const SSE = require('express-sse');
const sse = new SSE();
/**
 * Create a comment
 */

function sendSSE(res, data) {
    res.write('data: ' + JSON.stringify(data) + '\n\n');
}

exports.create = function (req, res) {
    var comment = new Comment(req.body);
    // comment.user = req.user;
    // console.log("a", comment)
    comment.save()
        .then((comment) => {
            res.jsonp(comment);
        })
        .catch((err) => {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            }
        });

};

/**
 * Show the current comment
 */
exports.read = function (req, res) {
    // convert mongoose document to JSON
    var comment = req.comment ? req.comment.toJSON() : {};

    // Add a custom field to the Article, for determining if the current User is the "owner".
    // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
    comment.isCurrentUserOwner = req.user && comment.user && comment.user._id.toString() === req.user._id.toString();

    res.jsonp(comment);
};

/**
 * Update a comment
 */

exports.update = function (req, res) {
    var comment = req.comment;
    var sse = req.app.locals.sse;

    comment = _.extend(comment, req.body);
    comment.save()
        .then((comment) => {
            sse.send(comment);
            console.log('Event "update" has been emitted.');
            res.jsonp(comment);
        })
        .catch((err) => {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            }
        });
};





/**
 * Delete an comment
 */
exports.delete = function (req, res) {
    var comment = req.comment;

    comment.deleteOne()
        .then((comment) => {
            res.jsonp(comment);
        })
        .catch((err) => {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            }
        });

};

/**
 * GET number rows of comment
 */
// exports.count = function (req, res) {
//     console.log('zooo count');
//     var condition = {};
//     var newsId = req.query.newsId;
//     if (newsId !== undefined) {
//         condition.news_id = newsId;
//     }
//     var roles = req.user.roles;
//     var isRole = -1;
//     roles.forEach(function (element, index) {
//         if (element == 'admin') {
//             isRole = 0;
//         } else if (element == 'manager' && isRole == -1) {
//             isRole = 1;
//         } else if (element == 'user' && isRole == -1) {
//             isRole = 2;
//         }
//     });

//     //create search by or operator in mongodb
//     var orcondition = [];
//     if (req.query.search != undefined) {
//         orcondition.push({ "name": { $regex: new RegExp(req.query.search) } });
//         condition.$or = orcondition;
//     }

//     Comment.countDocuments(condition)
//         .then((number) => {
//             console.log("nbasd", number)
//             res.jsonp([number]);
//         })
//         .catch((err) => {
//             if (err) {
//                 return res.status(400).send({
//                     message: errorHandler.getErrorMessage(err)
//                 });
//             }
//         });

// };
exports.count = function (req, res) {
    var condition = {};

    var roles = req.user.roles;
    var isRole = -1;
    roles.forEach(function (element, index) {
        if (element == 'admin') {
            isRole = 0;
        } else if (element == 'manager' && isRole == -1) {
            isRole = 1;
        } else if (element == 'user' && isRole == -1) {
            isRole = 2;
        }
    });


    //create search by or operator in mongodb
    var orcondition = [];
    var newsId = req.query.newsId;
    if (newsId !== undefined) {
        condition.news_id = newsId;
    }
    if (req.query.search != undefined) {
        orcondition.push({ "name": { $regex: new RegExp(req.query.search) } });
        condition.$or = orcondition;
    }

    Comment.countDocuments(condition)
        .then((number) => {
            res.jsonp([number]);
        })
        .catch((err) => {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            }
        });

};
/**
 * List of comments
 */
exports.list = function (req, res) {
    console.log('zooo list');

    var condition = {};
    var currentPage = 1;
    var roles = req.user.roles;
    var isRole = -1;
    roles.forEach(function (element, index) {
        if (element == 'admin') {
            isRole = 0;
        } else if (element == 'manager' && isRole == -1) {
            isRole = 1;
        } else if (element == 'user' && isRole == -1) {
            isRole = 2;
        }
    });

    if (req.query.currentPage != undefined) {
        currentPage = parseInt(req.query.currentPage, 10);

        if (isNaN(currentPage) || currentPage < 1) {
            currentPage = 1;
        }
    }

    var orcondition = [];
    if (req.query.search != undefined) {
        orcondition.push({ "name": { $regex: new RegExp(req.query.search) } });
        condition.$or = orcondition;
    }

    var newsId = req.query.newsId;
    condition.news_id = newsId;
    // Get the total count of comments
    Comment.countDocuments(condition)
        .then(() => {
            Comment.find(condition)
                .populate('user', 'displayName')
                .skip(10 * (currentPage - 1)).limit(10)
                .then((comments) => {
                    res.jsonp(comments);
                })
                .catch((err) => {
                    if (err) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    }
                });
        })
        .catch((err) => {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            }
        });
};



/**
 * comment middleware
 */
exports.commentByID = function (req, res, next, id) {
    console.log("iddddddđ:", id)

    console.log("reqqqq", req)
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Comment is invalid'
        });
    }
    // .populate('user', 'displayName')
    Comment.findById(id)
        .then((comment) => {
            if (!comment) {
                return res.status(404).send({
                    message: 'No comment with that identifier has been found'
                });
            }
            req.comment = comment;
            next();
        })
        .catch((err) => {
            if (err) {
                return next(err);
            }
        });

};

exports.statisticbysentiment = async (req, res) => {
    try {
        const user = req.user;
        const topics = user.topics.filter(topic => topic.working_status === 1);
        const topicIds = topics.map(topic => topic.topic._id);
        const newsgroup = req.query.newsgroup;
        const start = req.query.start;
        const end = req.query.end;

        let newsdailies;
        var isAdmin = req.user.roles.includes('admin');
        if (!isAdmin) {
            if (newsgroup != 0) {
                newsdailies = await Newsdaily.find({
                    topic: { $in: topicIds },
                    news_group: { $in: newsgroup }
                }, '_id');
            } else {
                newsdailies = await Newsdaily.find({
                    topic: { $in: topicIds }
                }, '_id');
            }
        } else {
            if (newsgroup != 0) {
                newsdailies = await Newsdaily.find({
                    news_group: { $in: newsgroup }
                }, '_id');
            } else {
                newsdailies = await Newsdaily.find({
                }, '_id');
            }
        }


        const newsIds = newsdailies.map(news => news._id);
        var matchStage;
        if (!isAdmin) {
            matchStage = {
                $match: {
                    news_id: { $in: newsIds.map(id => new mongoose.Types.ObjectId(id)) }
                }
            };
        } else {
            matchStage = {
                $match: {
                }
            };
        }


        if (start && end) {
            console.log("Start", start);
            console.log("end", end);
            matchStage.$match.date_comment = {
                $gte: new Date(start),
                $lte: new Date(end)
            };
        }
        console.log("matchStage", matchStage)
        const comments = await Comment.aggregate([
            matchStage,
            {
                $lookup: {
                    from: 'newsdailies',
                    localField: 'news_id',
                    foreignField: '_id',
                    as: 'newsdailies_info'
                }
            },
            { $unwind: '$newsdailies_info' },
            {
                $match: {
                    'newsdailies_info.topic': { $in: topicIds.map(id => new mongoose.Types.ObjectId(id)) }
                }
            },
            { $project: { 'newsdailies_info': 0 } }
        ]);

        res.jsonp(comments);
    } catch (err) {
        console.error(err);
        res.status(400).send({ message: errorHandler.getErrorMessage(err) });
    }
};

// exports.statisticbysentiment = async (req, res) => {
//     try {
//         const user = req.user;
//         const topics = user.topics.filter(topic => topic.working_status === 1);
//         const topicIds = topics.map(topic => topic.topic._id);
//         const newsgroup = req.query.newsgroup;
//         const start = req.query.start;
//         const end = req.query.end;
//         var roles = req.user.roles;
//         var isRole = -1;
//         var condition = {};
//         if (start != undefined || end != undefined) {
//             condition.date_comment = {
//                 "$gte": new Date(req.query.start),
//                 "$lte": new Date(req.query.end)
//             };
//         }
//         console.log("dateee", condition);
//         roles.forEach(function (element, index) {
//             if (element == 'admin') {
//                 isRole = 0;
//             } else if (element == 'manager' && isRole == -1) {
//                 isRole = 1;
//             } else if (element == 'user' && isRole == -1) {
//                 isRole = 2;
//             }
//         });
//         console.log("roleee", isRole);
//         if (isRole != 0) {
//             var newsdailies;
//             if (newsgroup != 0) {
//                 newsdailies = await Newsdaily.find({
//                     topic: { $in: topicIds },
//                     news_group: { $in: newsgroup }
//                 }, '_id');
//             } else {
//                 newsdailies = await Newsdaily.find({
//                     topic: { $in: topicIds }
//                 }, '_id');
//             }


//             const newsIds = newsdailies.map(news => new mongoose.Types.ObjectId(news._id));
//             const comments = await Comment.aggregate([
//                 {
//                     $match: {
//                         news_id: { $in: newsIds.map(id => new mongoose.Types.ObjectId(id)) }
//                     }
//                 },
//                 {
//                     $lookup: {
//                         from: 'newsdailies',
//                         localField: 'news_id',
//                         foreignField: '_id',
//                         as: 'newsdailies_info'
//                     }
//                 },
//                 {
//                     $unwind: '$newsdailies_info'
//                 },
//                 {
//                     $match: {
//                         'newsdailies_info.topic': { $in: topicIds.map(id => new mongoose.Types.ObjectId(id)) }
//                     }
//                 }
//                 ,
//                 {
//                     $project: {
//                         'newsdailies_info': 0
//                     }
//                 }
//             ]);
//             // console.log("zooooo1", comments);
//             return res.json(comments);
//         } else {
//             var newsdailies;
//             if (newsgroup != 0) {
//                 newsdailies = await Newsdaily.find({
//                     news_group: { $in: newsgroup }
//                 }, '_id');
//             } else {
//                 newsdailies = await Newsdaily.find({}, '_id');
//             }

//             console.log("adminnn")
//             const newsIds = newsdailies.map(news => new mongoose.Types.ObjectId(news._id));
//             const comments = await Comment
//                 .aggregate([
//                     {
//                         $match: {
//                             news_id: { $in: newsIds.map(id => new mongoose.Types.ObjectId(id)) }
//                         }
//                     },
//                     {
//                         $lookup: {
//                             from: 'newsdailies',
//                             localField: 'news_id',
//                             foreignField: '_id',
//                             as: 'newsdailies_info'
//                         }
//                     },
//                     {
//                         $unwind: '$newsdailies_info'
//                     },
//                     {
//                         $match: {
//                             'newsdailies_info.topic': { $in: topicIds.map(id => new mongoose.Types.ObjectId(id)) }
//                         }
//                     },
//                     {
//                         $project: {
//                             'newsdailies_info': 0
//                         }
//                     }
//                 ]);
//             console.log("comments", comments)
//             return res.json(comments);
//         }


//     } catch (err) {
//         console.error("Error in statisticbysentiment:", err);
//         return res.status(500).json({ message: errorHandler.getErrorMessage(err) });
//     }

// };



