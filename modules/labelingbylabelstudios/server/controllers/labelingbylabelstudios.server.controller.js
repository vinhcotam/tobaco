'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Labelingbylabelstudio = mongoose.model('Labelingbylabelstudio'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Labelingbylabelstudio
 */
exports.create = function(req, res) {
  var labelingbylabelstudio = new Labelingbylabelstudio(req.body);
  labelingbylabelstudio.user = req.user;

  labelingbylabelstudio.save()
    .then((labelingbylabelstudio) => {
      res.jsonp(labelingbylabelstudio);
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
 * Show the current Labelingbylabelstudio
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var labelingbylabelstudio = req.labelingbylabelstudio ? req.labelingbylabelstudio.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  labelingbylabelstudio.isCurrentUserOwner = req.user && labelingbylabelstudio.user && labelingbylabelstudio.user._id.toString() === req.user._id.toString();

  res.jsonp(labelingbylabelstudio);
};

/**
 * Update a Labelingbylabelstudio
 */
exports.update = function(req, res) {
  var labelingbylabelstudio = req.labelingbylabelstudio;

  labelingbylabelstudio = _.extend(labelingbylabelstudio, req.body);

  labelingbylabelstudio.save()
    .then((labelingbylabelstudio) => {
      res.jsonp(labelingbylabelstudio);
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
 * Delete an Labelingbylabelstudio
 */
exports.delete = function(req, res) {
  var labelingbylabelstudio = req.labelingbylabelstudio;

  labelingbylabelstudio.deleteOne()
    .then((labelingbylabelstudio) => {
      res.jsonp(labelingbylabelstudio);
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
 * List of Labelingbylabelstudios
 */
exports.list = function (req, res) {
  var condition = {};
  if (req.query.newsdaily != undefined) {
    condition.newsdaily = req.query.newsdaily;
  }
  Labelingbylabelstudio.find(condition).sort('-created').populate('user', 'displayName')
    .then((labelingbylabelstudios) => {
      res.jsonp(labelingbylabelstudios);
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
 * Labelingbylabelstudio middleware
 */
exports.labelingbylabelstudioByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Labelingbylabelstudio is invalid'
    });
  }

  Labelingbylabelstudio.findById(id).populate('user', 'displayName')
    .then((labelingbylabelstudio) => {
      if (!labelingbylabelstudio) {
        return res.status(404).send({
          message: 'No Labelingbylabelstudio with that identifier has been found'
        });
      }
      req.labelingbylabelstudio = labelingbylabelstudio;
      next();
    })
    .catch((err) => {
      if (err) {
        return next(err);
      }
    });
    
};
