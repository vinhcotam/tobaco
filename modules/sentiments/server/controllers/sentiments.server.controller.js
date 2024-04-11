'use strict';

/**
 * Module dependencies.
 */
console.log("zo")
var path = require('path'),
    mongoose = require('mongoose'),
    Sentiment = mongoose.model('Sentiment'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    _ = require('lodash');

/**
 * Create a sentment
 */
exports.create = function (req, res) {
    var sentiment = new Sentiment(req.body);
    sentiment.user = req.user;
    console.log("a", sentiment)
    sentiment.save()
        .then((sentiment) => {
            res.jsonp(sentiment);
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
 * Show the current sentiment
 */
exports.read = function (req, res) {
    // convert mongoose document to JSON
    var sentiment = req.sentiment ? req.sentiment.toJSON() : {};

    // Add a custom field to the Article, for determining if the current User is the "owner".
    // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
    sentiment.isCurrentUserOwner = req.user && sentiment.user && sentiment.user._id.toString() === req.user._id.toString();

    res.jsonp(sentiment);
};

/**
 * Update a sentiment
 */
exports.update = function (req, res) {
    var sentiment = req.sentiment;

    sentiment = _.extend(sentiment, req.body);

    sentiment.save()
        .then((sentiment) => {
            res.jsonp(sentiment);
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
 * Delete an sentiment
 */
exports.delete = function (req, res) {
    var sentiment = req.sentiment;

    sentiment.deleteOne()
        .then((sentiment) => {
            res.jsonp(sentiment);
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
 * GET number rows of sentiment
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

    Sentiment.countDocuments(condition)
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
 * List of sentiments
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

    Sentiment.find(condition)
        //.sort('-created')
        .populate('user', 'displayName')
        // .populate('topic', '_id, topic_name')
        .skip(10 * (currentPage - 1)).limit(10)
        .then((sentiments) => {
            res.jsonp(sentiments);
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
 * Sentiment middleware
 */
exports.sentimentByID = function (req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Sentiment is invalid'
        });
    }

    Sentiment.findById(id).populate('user', 'displayName')
        .then((sentiment) => {
            if (!sentiment) {
                return res.status(404).send({
                    message: 'No Sentiment with that identifier has been found'
                });
            }
            req.sentiment = sentiment;
            next();
        })
        .catch((err) => {
            if (err) {
                return next(err);
            }
        });

};
