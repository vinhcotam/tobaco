'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Statistic = mongoose.model('Statistic'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Statistic
 */
exports.create = function(req, res) {
  var statistic = new Statistic(req.body);
  statistic.user = req.user;

  statistic.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(statistic);
    }
  });
};

/**
 * Show the current Statistic
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var statistic = req.statistic ? req.statistic.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  statistic.isCurrentUserOwner = req.user && statistic.user && statistic.user._id.toString() === req.user._id.toString();

  res.jsonp(statistic);
};

/**
 * Update a Statistic
 */
exports.update = function(req, res) {
  var statistic = req.statistic;

  statistic = _.extend(statistic, req.body);

  statistic.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(statistic);
    }
  });
};

/**
 * Delete an Statistic
 */
exports.delete = function(req, res) {
  var statistic = req.statistic;

  statistic.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(statistic);
    }
  });
};

/**
 * List of Statistics
 */
exports.list = function(req, res) {
  Statistic.find().sort('-created').populate('user', 'displayName').exec(function(err, statistics) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(statistics);
    }
  });
};

/**
 * Statistic middleware
 */
exports.statisticByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Statistic is invalid'
    });
  }

  Statistic.findById(id).populate('user', 'displayName').exec(function (err, statistic) {
    if (err) {
      return next(err);
    } else if (!statistic) {
      return res.status(404).send({
        message: 'No Statistic with that identifier has been found'
      });
    }
    req.statistic = statistic;
    next();
  });
};
