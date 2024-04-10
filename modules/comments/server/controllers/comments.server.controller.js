'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    Comment = mongoose.model('Comment'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    _ = require('lodash');

/**
 * Create a sentment
 */
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
exports.update = function (req, res) {
    var comment = req.comment;

    comment = _.extend(comment, req.body);

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
    // if (isRole == 1 || isRole == 2) {
    //     let topicIds = [];
    //     req.user.topics.forEach(function (element, index) {
    //         if (element.working_status == 1) {
    //             topicIds.push(element.topic._id);
    //         }
    //     });
    //     condition = { "topic": { "$in": topicIds } };
    // }


    // if (typeof req.query.topic != "undefined") {
    //     condition.topic = req.query.topic;
    // }

    //create search by or operator in mongodb
    var orcondition = [];
    if (req.query.search != undefined) {
        orcondition.push({ "name": { $regex: new RegExp(req.query.search) } });
        condition.$or = orcondition;
    }

    Comment.count(condition)
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
    // if (isRole == 1 || isRole == 2) {
    //     let topicIds = [];
    //     req.user.topics.forEach(function (element, index) {
    //         if (element.working_status == 1) {
    //             topicIds.push(element.topic._id);
    //         }
    //     });
    //     condition = { "topic": { "$in": topicIds } };
    // }

    if (req.query.currentPage != undefined) {
        currentPage = req.query.currentPage;
    }

    // if (typeof req.query.topic != "undefined") {
    //     condition.topic = req.query.topic;
    // }

    //create search by or operator in mongodb
    var orcondition = [];
    if (req.query.search != undefined) {
        orcondition.push({ "name": { $regex: new RegExp(req.query.search) } });
        condition.$or = orcondition;
    }

    Comment.find(condition)
        //.sort('-created')
        .populate('user', 'displayName')
        // .populate('topic', '_id, topic_name')
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

};


/**
 * comment middleware
 */
exports.commentByID = function (req, res, next, id) {

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
