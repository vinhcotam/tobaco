'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Newsgroup = mongoose.model('Newsgroup'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Newsgroup
 */
exports.create = function(req, res) {
  var newsgroup = new Newsgroup(req.body);
  newsgroup.user = req.user;

  newsgroup.save()
    .then((newsgroup) => {
      res.jsonp(newsgroup);
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
 * Show the current Newsgroup
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var newsgroup = req.newsgroup ? req.newsgroup.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  newsgroup.isCurrentUserOwner = req.user && newsgroup.user && newsgroup.user._id.toString() === req.user._id.toString();

  res.jsonp(newsgroup);
};

/**
 * Update a Newsgroup
 */
exports.update = function(req, res) {
  var newsgroup = req.newsgroup;

  newsgroup = _.extend(newsgroup, req.body);

  newsgroup.save()
    .then((newsgroup) => {
      res.jsonp(newsgroup);
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
 * Delete an Newsgroup
 */
exports.delete = function(req, res) {
  var newsgroup = req.newsgroup;

  newsgroup.deleteOne()
    .then((newsgroup) => {
      res.jsonp();
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
 * Get number record
 *
 */
exports.count = function (req, res) {
  var condition = {};
  //check topic is working
  var topics = req.user.topics;
  var topic_id = [];
  topics.forEach((element, index) => {
    if (element.working_status == 1) {
      topic_id.push(element.topic._id);
    }
  })

  //check roles
  if (req.user.roles) {
    var isAdmin = req.user.roles.includes('admin');
    var isManager = req.user.roles.includes('manager');

    if (isAdmin) {

    } else {
      condition.topic = { '$in': topic_id };
    }
  }

  //let only topic
  if (req.query.topic != null) {
    condition.topic = req.query.topic;
  }

  //create search by or operator in mongodb
  var orcondition = [];
  if (req.query.search != undefined) {
    orcondition.push({ "name": { $regex: new RegExp(req.query.search) } });
    condition.$or = orcondition;
  }
  Newsgroup.countDocuments(condition)
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
}
/**
 * List of Newsgroups
 */
exports.list = function (req, res) {
  var condition = {};
  var currentPage = 1;
  //check topic is working
  var topics = req.user.topics;
  var topic_id = [];
  topics.forEach((element, index) => {
    if (element.working_status == 1) {
      topic_id.push(element.topic._id);
    }
  })

  //check roles
  if (req.user.roles) {
    var isAdmin = req.user.roles.includes('admin');
    var isManager = req.user.roles.includes('manager');

    if (isAdmin) {

    } else {
      condition.topic = { '$in': topic_id };
    }
  }

  //split page
  if (req.query.currentPage != undefined) {
    currentPage = req.query.currentPage;
  }

  //let only topic
  if (req.query.topic != null) {
    condition.topic = req.query.topic;
  }
  //create search by or operator in mongodb
  var orcondition = [];
  if (req.query.search != undefined) {
    orcondition.push({ "name": { $regex: new RegExp(req.query.search) } });
    condition.$or = orcondition;
  }

  Newsgroup.find(condition).sort('-created')
    .populate('topic', '_id, topic_name')
    .populate('user', 'displayName')
    .skip(10 * (currentPage - 1)).limit(10)
    .then((newsgroups) => {
      res.jsonp(newsgroups);
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
 * Newsgroup middleware
 */
exports.newsgroupByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Newsgroup is invalid'
    });
  }

  Newsgroup.findById(id).populate('user', 'displayName')
    .then((newsgroup) => {
      if (!newsgroup) {
        return res.status(404).send({
          message: 'No Newsgroup with that identifier has been found'
        });
      }
      req.newsgroup = newsgroup;
      next();
    })
    .catch((err) => {
      if (err) {
        return next(err);
      }
    });
   
};
