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
    // comment.isCurrentUserOwner = req.user && comment.user && comment.user._id.toString() === req.user._id.toString();

    res.jsonp(comment);
};

/**
 * Update a comment
 */
// exports.update = function (req, res) {
//     var comment = req.comment;
//     comment = _.extend(comment, req.body);
//     comment.save()
//         .then((comment) => {
//             sse.send(comment); // Gửi cập nhật thông qua SSE
//             console.log('Event "update" has been emitted.');
//             res.jsonp(comment);
//         })
//         .catch((err) => {
//             if (err) {
//                 return res.status(400).send({
//                     message: errorHandler.getErrorMessage(err)
//                 });
//             }
//         });
// };

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
exports.count = function (req, res) {
    var condition = {};
    var newsId = req.query.newsId;
    if (newsId !== undefined) {
        condition.news_id = newsId;
    }
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

    // Create search by or operator in MongoDB
    var orcondition = [];
    if (req.query.search != undefined) {
        orcondition.push({ "name": { $regex: new RegExp(req.query.search) } });
        condition.$or = orcondition;
    }

    var limitCount = 10;
    var skipCount = limitCount * (currentPage - 1);
    var newsId = req.query.newsId;
    var newsTitle = ""
    var newsSummary = ""
    if (newsId !== undefined) {
        condition.news_id = newsId;
        Newsdaily.findOne({ _id: newsId })
            .then((news) => {
                console.log("checkscas", news.news_title)
                console.log("checkscas", news.news_summary)
                // res.jsonp({ newsTitle: news.news_title });
                newsTitle = news.news_title;
                newsSummary = news.news_summary;
                next();
            })
            .catch((err) => {
            });

    }
    // Get the total count of comments
    Comment.countDocuments(condition)
        .then((totalCount) => {
            // Calculate the number of pages
            var totalPages = Math.ceil(totalCount / limitCount);
            Comment.find(condition)
                .populate('user', 'displayName')
                .skip(skipCount)
                // .limit(limitCount)
                .then((comments) => {
                    res.jsonp(comments);
                    // res.jsonp({ comments: comments, newsTitle: newsTitle,newsSummary: newsSummary})
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
