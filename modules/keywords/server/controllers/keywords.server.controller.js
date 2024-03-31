'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Keyword = mongoose.model('Keyword'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Keyword
 */
exports.create = function(req, res) {
  var keyword = new Keyword(req.body);
  keyword.user = req.user;

  keyword.save()
    .then((keyword) => {
      res.json(keyword);
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
 * Show the current Keyword
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var keyword = req.keyword ? req.keyword.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  keyword.isCurrentUserOwner = req.user && keyword.user && keyword.user._id.toString() === req.user._id.toString();

  res.json(keyword);
};

/**
 * Update a Keyword
 */
exports.update = function(req, res) {
  var keyword = req.keyword;

  keyword = _.extend(keyword, req.body);

  keyword.save()
    .then((keyword) => {
      res.json(keyword);
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
 * Delete an Keyword
 */
exports.delete = function(req, res) {
  var keyword = req.keyword;

  keyword.deleteOne()
    .then((keyword) => {
      res.json(keyword);
    })
    .catch((err) => {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
    });
   
};

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

  if (isRole == 1 || isRole == 2) {
    let topicIds = [];
    req.user.topics.forEach(function (element, index) {
      if (element.working_status == 1) {
        topicIds.push(element.topic._id);
      }
    });
    condition = { "topic": { "$in": topicIds } };
  }
  //create search by or operator in mongodb
  var orcondition = [];
  if (req.query.search != undefined) {
    orcondition.push({ "keyword_name": { $regex: new RegExp(req.query.search) } });
    condition.$or = orcondition;
  }

  Keyword.count(condition)
    .then((number) => {
      res.json([number]);
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
 * List of Keywords
 */
exports.list = function (req, res) {
  var currentPage = 1;
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

  if (isRole == 1 || isRole == 2) {
    let topicIds = [];
    req.user.topics.forEach(function (element, index) {
      if (element.working_status == 1) {
        topicIds.push(element.topic._id);
      }
    });
    condition = { "topic": { "$in": topicIds } };
  }

  if (req.query.currentPage != undefined) {
    currentPage = req.query.currentPage;
  }

  //create search by or operator in mongodb
  var orcondition = [];
  if (req.query.search != undefined) {
    orcondition.push({ "keyword_name": { $regex: new RegExp(req.query.search) } });
    condition.$or = orcondition;
  }

  Keyword.find(condition)//.sort('-created')
    .populate('topic', '_id, topic_name')
    .populate('user', 'displayName')
    .skip(10 * (currentPage - 1)).limit(10)
    .then((keywords) => {
      res.json(keywords);
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
 * Keyword middleware
 */
exports.keywordByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Keyword is invalid'
    });
  }

  Keyword.findById(id)
    .populate('topic', '_id, topic_name')
    .populate('user', 'displayName')
    .then((keyword) => {
      if (!keyword) {
        return res.status(404).send({
          message: 'No Keyword with that identifier has been found'
        });
      }
      req.keyword = keyword;
      next();
    })
    .catch((err) => {
      if (err) {
        return next(err);
      }
    });
   
};
