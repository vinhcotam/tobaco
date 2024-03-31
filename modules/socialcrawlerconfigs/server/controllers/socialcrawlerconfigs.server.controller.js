'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Socialcrawlerconfig = mongoose.model('Socialcrawlerconfig'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Socialcrawlerconfig
 */
exports.create = function (req, res) {
  var socialcrawlerconfig = new Socialcrawlerconfig(req.body);
  socialcrawlerconfig.user = req.user;

  socialcrawlerconfig.save()
    .then((socialcrawlerconfig) => {
      res.jsonp(socialcrawlerconfig);
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
 * Show the current Socialcrawlerconfig
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var socialcrawlerconfig = req.socialcrawlerconfig ? req.socialcrawlerconfig.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  socialcrawlerconfig.isCurrentUserOwner = req.user && socialcrawlerconfig.user && socialcrawlerconfig.user._id.toString() === req.user._id.toString();

  res.jsonp(socialcrawlerconfig);
};

/**
 * Update a Socialcrawlerconfig
 */
exports.update = function (req, res) {
  var socialcrawlerconfig = req.socialcrawlerconfig;

  socialcrawlerconfig = _.extend(socialcrawlerconfig, req.body);

  socialcrawlerconfig.save()
    .then((socialcrawlerconfig) => {
      res.jsonp(socialcrawlerconfig);
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
 * Delete an Socialcrawlerconfig
 */
exports.delete = function (req, res) {
  var socialcrawlerconfig = req.socialcrawlerconfig;

  socialcrawlerconfig.deleteOne()
    .then((socialcrawlerconfig) => {
      res.jsonp(socialcrawlerconfig);
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
  // check topic is working
  var topics = req.user.topics;
  var topic_id = [];
  topics.forEach((element, index) => {
    if (element.working_status === 1) {
      topic_id.push(element.topic._id);
    }
  });

  // check roles
  if (req.user.roles) {
    var isAdmin = req.user.roles.includes('admin');
    var isManager = req.user.roles.includes('manager');

    if (!isAdmin) {
      condition.topic = { '$in': topic_id };
    } 
    // else {
    //   condition.topic = { '$in': topic_id };
    // }
  }

  // create search by or operator in mongodb
  var orcondition = [];
  if (req.query.search !== undefined) {
    orcondition.push({ "socialconfig_name": { $regex: new RegExp(req.query.search) } });
    condition.$or = orcondition;
  }

  Socialcrawlerconfig.count(condition)
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
 * List of Socialcrawlerconfig
 */
exports.list = function (req, res) {
  var currentPage = 1;
  var count = false;
  var condition = {};
  // check topic is working
  var topics = req.user.topics;
  var topic_id = [];
  topics.forEach((element, index) => {
    if (element.working_status === 1) {
      topic_id.push(element.topic._id);
    }
  });

   //check roles
  if (req.user.roles) {
    var isAdmin = req.user.roles.includes('admin');
    var isManager = req.user.roles.includes('manager');

    if (!isAdmin) {
      condition.topic = { '$in': topic_id };

    } 
    // else {
    //   condition.topic = { '$in': topic_id };
    // }
  }

  if (req.query.currentPage !== undefined) {
    currentPage = req.query.currentPage;
  }
  console.log(currentPage - 1);
  if (req.query.count !== undefined) {
    count = req.query.count;
  }

  // create search by or operator in mongodb
  var orcondition = [];
  if (req.query.search !== undefined) {
    orcondition.push({ "user_name": { $regex: new RegExp(req.query.search) } });
    orcondition.push({ "user_login": { $regex: new RegExp(req.query.search) } });
    orcondition.push({ "password_login": { $regex: new RegExp(req.query.search) } });
    orcondition.push({ "subject_url": { $regex: new RegExp(req.query.search) } });
    orcondition.push({ "subject_name": { $regex: new RegExp(req.query.search) } });
    orcondition.push({ "description": { $regex: new RegExp(req.query.search) } });
    orcondition.push({ "socialweb_url": { $regex: new RegExp(req.query.search) } });
    orcondition.push({ "socialconfig_name": { $regex: new RegExp(req.query.search) } })
    condition.$or = orcondition;
  }
  Socialcrawlerconfig.find(condition)// .sort('-created')
    .skip(10 * (currentPage - 1)).limit(10)
    .populate('user', 'displayName')
    .then((socialcrawlerconfigs) => {
      res.jsonp(socialcrawlerconfigs);
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
 * Socialcrawlerconfig middleware
 */
exports.socialcrawlerconfigByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Socialcrawlerconfig is invalid'
    });
  }

  Socialcrawlerconfig.findById(id).populate('user', 'displayName')
    .then((socialcrawlerconfig) => {
      if (!socialcrawlerconfig) {
        return res.status(404).send({
          message: 'No Socialcrawlerconfig with that identifier has been found'
        });
      }
      req.socialcrawlerconfig = socialcrawlerconfig;
      next();
    })
    .catch((err) => {
      if (err) {
        return next(err);
      }
    });
};
