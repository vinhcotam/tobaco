'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Objectprofile = mongoose.model('Objectprofile'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Objectprofile
 */
exports.create = function(req, res) {
  var objectprofile = new Objectprofile(req.body);
  objectprofile.user = req.user;

  objectprofile.save()
    .then((objectprofile) => {
      res.jsonp(objectprofile);
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
 * Show the current Objectprofile
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var objectprofile = req.objectprofile ? req.objectprofile.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  objectprofile.isCurrentUserOwner = req.user && objectprofile.user && objectprofile.user._id.toString() === req.user._id.toString();

  res.jsonp(objectprofile);
};

/**
 * Update a Objectprofile
 */
exports.update = function(req, res) {
  var objectprofile = req.objectprofile;

  objectprofile = _.extend(objectprofile, req.body);

  objectprofile.save()
    .then((objectprofile) => {
      res.jsonp(objectprofile);
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
 * Delete an Objectprofile
 */
exports.delete = function(req, res) {
  var objectprofile = req.objectprofile;

  objectprofile.deleteOne()
    .then((objectprofile) => {
      res.jsonp(objectprofile);
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
  var currentPage = 1;
  var condition = {}
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

  if (isRole == 2) {
    //condition.user = req.user._id;
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
  var orcondition = [];
  //create search by or operator in mongodb
  if (req.query.search != undefined) {
    orcondition.push({ "profile_url": { $regex: new RegExp(req.query.search) } });
    orcondition.push({ "profile_name": { $regex: new RegExp(req.query.search) } });
    orcondition.push({ "date_created": { $regex: new RegExp(req.query.search) } });
    orcondition.push({ "date_updated": { $regex: new RegExp(req.query.search) } });
  }

  var obj_pro = Objectprofile.count(condition);
  if (orcondition.length > 0) {
    obj_pro.or(orcondition);
  }
  obj_pro.then((number) => {
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
 * List of Objectprofile
 */
exports.list = async function (req, res) {
  var currentPage = 1;
  var count = false;
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

  var condition = {}
  if (isRole == 2) {
    //condition.user = req.user._id;
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
    orcondition.push({ "profile_url": { $regex: new RegExp(req.query.search) } });
    orcondition.push({ "profile_name": { $regex: new RegExp(req.query.search) } });
    orcondition.push({ "date_created": { $regex: new RegExp(req.query.search) } });
    orcondition.push({ "date_updated": { $regex: new RegExp(req.query.search) } });
  }

  var obj_pro = Objectprofile.find(condition);//.sort('-created')
  if (orcondition.length > 0) {
    obj_pro.or(orcondition);
  }
  obj_pro.skip(10 * (currentPage - 1)).limit(10)
    .populate('user', 'displayName')
    .then((objectprofiles) => {
      res.jsonp([{ data: objectprofiles }]);
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
 * Objectprofile middleware
 */
exports.objectprofileByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Objectprofile is invalid'
    });
  }

  Objectprofile.findById(id).populate('user', 'displayName')
    .then((objectprofile) => {
      if (!objectprofile) {
        return res.status(404).send({
          message: 'No Objectprofile with that identifier has been found'
        });
      }
      req.objectprofile = objectprofile;
      next();
    })
    .catch((err) => {
      if (err) {
        return next(err);
      }
    });
   
};
