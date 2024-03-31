'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Monitoringtype = mongoose.model('Monitoringtype'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Monitoringtype
 */
exports.create = function(req, res) {
  var monitoringtype = new Monitoringtype(req.body);
  monitoringtype.user = req.user;

  monitoringtype.save()
    .then((monitoringtype) => {
      res.jsonp(monitoringtype);
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
 * Show the current Monitoringtype
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var monitoringtype = req.monitoringtype ? req.monitoringtype.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  monitoringtype.isCurrentUserOwner = req.user && monitoringtype.user && monitoringtype.user._id.toString() === req.user._id.toString();

  res.jsonp(monitoringtype);
};

/**
 * Update a Monitoringtype
 */
exports.update = function(req, res) {
  var monitoringtype = req.monitoringtype;

  monitoringtype = _.extend(monitoringtype, req.body);

  monitoringtype.save()
    .then((monitoringtype) => {
      res.jsonp(monitoringtype);
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
 * Delete an Monitoringtype
 */
exports.delete = function(req, res) {
  var monitoringtype = req.monitoringtype;

  monitoringtype.deleteOne()
    .then((monitoringtype) => {
      res.jsonp(monitoringtype);
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
    orcondition.push({ "type_name": { $regex: new RegExp(req.query.search) } });
    orcondition.push({ "date_created": { $regex: new RegExp(req.query.search) } });
    orcondition.push({ "date_updated": { $regex: new RegExp(req.query.search) } });
    condition.$or = orcondition;
  }

  Monitoringtype.count(condition)
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
 * List of Monitoringtype
 */
exports.list = function (req, res) {
  var currentPage = 1;
  var count = false;
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
  console.log(currentPage - 1);
  if (req.query.count != undefined) {
    count = req.query.count;
  }

  //create search by or operator in mongodb
  var orcondition = [];
  if (req.query.search != undefined) {
    orcondition.push({ "type_name": { $regex: new RegExp(req.query.search) } });
    orcondition.push({ "date_created": { $regex: new RegExp(req.query.search) } });
    orcondition.push({ "date_updated": { $regex: new RegExp(req.query.search) } });
    condition.$or = orcondition;
  }

  Monitoringtype.find(condition)//.sort('-created')
    .skip(10 * (currentPage - 1)).limit(10)
    .populate('user', 'displayName')
    .then((monitoringtypes) => {
      res.jsonp(monitoringtypes);
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
 * Monitoringtype middleware
 */
exports.monitoringtypeByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Monitoringtype is invalid'
    });
  }

  Monitoringtype.findById(id).populate('user', 'displayName')
    .then((monitoringtype) => {
      if (!monitoringtype) {
        return res.status(404).send({
          message: 'No Monitoringtype with that identifier has been found'
        });
      }
      req.monitoringtype = monitoringtype;
      next();
    })
    .catch((err) => {
      if (err) {
        return next(err);
      }
    });
    
};
