'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Contentidentification = mongoose.model('Contentidentification'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Contentidentification
 */
exports.create = function(req, res) {
  var contentidentification = new Contentidentification(req.body);
  contentidentification.user = req.user;

  contentidentification.save()
    .then((contentidentification) => {
      res.jsonp(contentidentification);
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
 * Show the current Contentidentification
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var contentidentification = req.contentidentification ? req.contentidentification.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  contentidentification.isCurrentUserOwner = req.user && contentidentification.user && contentidentification.user._id.toString() === req.user._id.toString();

  res.jsonp(contentidentification);
};

/**
 * Update a Contentidentification
 */
exports.update = function(req, res) {
  var contentidentification = req.contentidentification;

  contentidentification = _.extend(contentidentification, req.body);

  contentidentification.save()
    .then((contentidentification) => {
      res.jsonp(contentidentification);
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
 * Delete an Contentidentification
 */
exports.delete = function(req, res) {
  var contentidentification = req.contentidentification;

  contentidentification.deleteOne()
    .then((contentidentification) => {
      res.jsonp(contentidentification);
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
 * List of Contentidentifications
 */
exports.list = function(req, res) {
  Contentidentification.find().sort('-created')
    .populate('website', '_id website_name source_url')
    .populate('user', 'displayName')
    .then((contentidentifications) => {
      res.jsonp(contentidentifications);
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
 * Contentidentification middleware
 */
exports.contentidentificationByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Contentidentification is invalid'
    });
  }

  Contentidentification.findById(id)
    .populate('website', '_id website_name source_url')
    .populate('user', 'displayName')
    .then((contentidentification) => {
      if (!contentidentification) {
        return res.status(404).send({
          message: 'No Contentidentification with that identifier has been found'
        });
      }
      req.contentidentification = contentidentification;
      next();
    })
    .catch((err) => {
      if (err) {
        return next(err);
      }
    });
   
};
