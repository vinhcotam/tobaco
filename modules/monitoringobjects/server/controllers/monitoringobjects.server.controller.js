'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Monitoringobject = mongoose.model('Monitoringobject'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Monitoringobject
 */
exports.create = function(req, res) {
  var monitoringobject = new Monitoringobject(req.body);
  monitoringobject.user = req.user;

  monitoringobject.save()
    .then((monitoringobject) => {
      res.jsonp(monitoringobject);
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
 * Show the current Monitoringobject
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var monitoringobject = req.monitoringobject ? req.monitoringobject.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  monitoringobject.isCurrentUserOwner = req.user && monitoringobject.user && monitoringobject.user._id.toString() === req.user._id.toString();

  res.jsonp(monitoringobject);
};

/**
 * Update a Monitoringobject
 */
exports.update = function(req, res) {
  var monitoringobject = req.monitoringobject;

  monitoringobject = _.extend(monitoringobject, req.body);

  monitoringobject.save()
    .then((monitoringobject) => {
      res.jsonp(monitoringobject);
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
 * Delete an Monitoringobject
 */
exports.delete = function(req, res) {
  var monitoringobject = req.monitoringobject;

  monitoringobject.deleteOne()
    .then((monitoringobject) => {
      res.jsonp(monitoringobject);
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
    orcondition.push({ "subject_name": { $regex: new RegExp(req.query.search) } });
    orcondition.push({ "object_url": { $regex: new RegExp(req.query.search) } });
    orcondition.push({ "subject_type": { $regex: new RegExp(req.query.search) } });
    orcondition.push({ "location": { $regex: new RegExp(req.query.search) } });
    orcondition.push({ "image_url": { $regex: new RegExp(req.query.search) } });
    orcondition.push({ "full_name": { $regex: new RegExp(req.query.search) } });
    orcondition.push({ "condition_filter": { $regex: new RegExp(req.query.search) } });
    condition.$or = orcondition;
  }

  Monitoringobject.count(condition)
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
 * List of Monitoringobject
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

  if (req.query.count != undefined) {
    count = req.query.count;
  }

  //create search by or operator in mongodb
  var orcondition = [];
  if (req.query.search != undefined) {
    orcondition.push({ "subject_name": { $regex: new RegExp(req.query.search) } });
    orcondition.push({ "object_url": { $regex: new RegExp(req.query.search) } });
    orcondition.push({ "subject_type": { $regex: new RegExp(req.query.search) } });
    orcondition.push({ "location": { $regex: new RegExp(req.query.search) } });
    orcondition.push({ "image_url": { $regex: new RegExp(req.query.search) } });
    orcondition.push({ "full_name": { $regex: new RegExp(req.query.search) } });
    orcondition.push({ "condition_filter": { $regex: new RegExp(req.query.search) } });
    condition.$or(orcondition);
  }

  Monitoringobject.find(condition)//.sort('-created')
    .skip(10 * (currentPage - 1)).limit(10)
    .populate('user', 'displayName')
    .then((monitoringobjects) => {
      res.jsonp(monitoringobjects);
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
 * Monitoringobject middleware
 */
exports.monitoringobjectByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Monitoringobject is invalid'
    });
  }

  Monitoringobject.findById(id).populate('user', 'displayName')
    .then((monitoringobject) => {
      if (!monitoringobject) {
        return res.status(404).send({
          message: 'No Monitoringobject with that identifier has been found'
        });
      }
      req.monitoringobject = monitoringobject;
      next();
    })
    .catch((err) => {
      if (err) {
        return next(err);
      }
    });
  
};
