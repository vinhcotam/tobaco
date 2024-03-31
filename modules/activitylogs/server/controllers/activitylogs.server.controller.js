'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Activitylog = mongoose.model('Activitylog'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Activitylog
 */
exports.create = function(req, res) {
  var activitylog = new Activitylog(req.body);
  activitylog.user = req.user;

  activitylog.save()
    .then((activitylog) => {
      res.jsonp(activitylog);
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
 * Show the current Activitylog
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var activitylog = req.activitylog ? req.activitylog.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  activitylog.isCurrentUserOwner = req.user && activitylog.user && activitylog.user._id.toString() === req.user._id.toString();

  res.jsonp(activitylog);
};

/**
 * Update a Activitylog
 */
exports.update = function(req, res) {
  var activitylog = req.activitylog;

  activitylog = _.extend(activitylog, req.body);

  activitylog.save()
    .then((activitylog) => {
      res.jsonp(activitylog);
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
 * Delete an Activitylog
 */
exports.delete = function(req, res) {
  var activitylog = req.activitylog;

  activitylog.deleteOne()
    .then((activitylog) => {
      res.jsonp(activitylog);
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
  //create search by or operator in mongodb
  var orcondition = [];
  if (req.query.search != undefined) {
    orcondition.push({ "logcontent": { $regex: new RegExp(req.query.search) } });
  }

  var al = Activitylog.count();
  if (orcondition.length > 0) {
    al.or(orcondition);
  }
  al.then((number) => {
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
 * List of Activitylog
 */
exports.list = async function (req, res) {
  var currentPage = 1;
  var count = false;
  if (req.query.currentPage != undefined) {
    currentPage = req.query.currentPage;
  }

  if (req.query.count != undefined) {
    count = req.query.count;
  }

  //create search by or operator in mongodb
  var orcondition = [];
  if (req.query.search != undefined) {
    orcondition.push({ "logcontent": { $regex: new RegExp(req.query.search) } });
  }

  var rowActivity = Activitylog.find();//.sort('-created')
  if (orcondition.length > 0) {
    rowActivity.or(orcondition);
  }
  rowActivity.skip(10 * (currentPage - 1)).limit(10)
    .populate('user', 'displayName')
    .then((activitylogs) => {
      res.jsonp([{ count: count, data: activitylogs }]);
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
 * Activitylog middleware
 */
exports.activitylogByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Activitylog is invalid'
    });
  }

  Activitylog.findById(id).populate('user', 'displayName')
    .then((activitylog) => {
      if (!activitylog) {
        return res.status(404).send({
          message: 'No Activitylog with that identifier has been found'
        });
      }
      req.activitylog = activitylog;
      next();
      
    })
    .catch((err) => {
      if (err) {
        return next(err);
      }
    });
    
};
