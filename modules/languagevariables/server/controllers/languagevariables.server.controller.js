'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Languagevariable = mongoose.model('Languagevariable'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Languagevariable
 */
exports.create = function(req, res) {
  var languagevariable = new Languagevariable(req.body);
  languagevariable.user = req.user;
  console.log(languagevariable)
  languagevariable.save()
    .then((languagevariable) => {
      res.jsonp(languagevariable);
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
 * Show the current Languagevariable
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var languagevariable = req.languagevariable ? req.languagevariable.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  languagevariable.isCurrentUserOwner = req.user && languagevariable.user && languagevariable.user._id.toString() === req.user._id.toString();

  res.jsonp(languagevariable);
};

/**
 * Update a Languagevariable
 */
exports.update = function(req, res) {
  var languagevariable = req.languagevariable;

  languagevariable = _.extend(languagevariable, req.body);

  languagevariable.save()
    .then((languagevariable) => {
      res.jsonp(languagevariable);
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
 * Delete an Languagevariable
 */
exports.delete = function(req, res) {
  var languagevariable = req.languagevariable;

  languagevariable.deleteOne()
    .then((languagevariable) => {
      res.jsonp(languagevariable);
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
 * GET number rows of Languagevariables
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


  if (typeof req.query.topic != "undefined") {
    condition.topic = req.query.topic;
  }

  //create search by or operator in mongodb
  var orcondition = [];
  if (req.query.search != undefined) {
    orcondition.push({ "name": { $regex: new RegExp(req.query.search) } });
    condition.$or = orcondition;
  }

  Languagevariable.countDocuments(condition)
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
 * List of Languagevariables
 */
exports.list = function (req, res) {
  var condition = {};
  var currentPage = 1;
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

  if (typeof req.query.topic != "undefined") {
    condition.topic = req.query.topic;
  }

  //create search by or operator in mongodb
  var orcondition = [];
  if (req.query.search != undefined) {
    orcondition.push({ "name": { $regex: new RegExp(req.query.search) } });
    condition.$or = orcondition;
  }

  Languagevariable.find(condition)
    //.sort('-created')
    .populate('user', 'displayName')
    .populate('topic', '_id, topic_name')
    .skip(10 * (currentPage - 1)).limit(10)
    .then((languagevariables) => {
      res.jsonp(languagevariables);
    })
    .catch((err) => {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
    });
   
};

exports.getbytopic = function (req, res) {
  var condition = {};
  var currentPage = 1;
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

  if (typeof req.query.topic != "undefined") {
    condition.topic = req.query.topic;
  }

  Languagevariable.find(condition)
    .populate('user', 'displayName')
    .populate('topic', '_id, topic_name')
    .then((languagevariables) => {
      res.jsonp(languagevariables);
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
 * Languagevariable middleware
 */
exports.languagevariableByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Languagevariable is invalid'
    });
  }

  Languagevariable.findById(id).populate('user', 'displayName')
    .then((languagevariable) => {
      if (!languagevariable) {
        return res.status(404).send({
          message: 'No Languagevariable with that identifier has been found'
        });
      }
      req.languagevariable = languagevariable;
      next();
    })
    .catch((err) => {
      if (err) {
        return next(err);
      }
    });
    
};
