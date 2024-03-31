'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Socialobjectactivity = mongoose.model('Socialobjectactivity'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Socialobjectactivity
 */
exports.create = function(req, res) {
  var socialobjectactivity = new Socialobjectactivity(req.body);
  socialobjectactivity.user = req.user;

  socialobjectactivity.save()
    .then((socialobjectactivity) => {
      res.jsonp(socialobjectactivity);
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
 * Show the current Socialobjectactivity
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var socialobjectactivity = req.socialobjectactivity ? req.socialobjectactivity.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  socialobjectactivity.isCurrentUserOwner = req.user && socialobjectactivity.user && socialobjectactivity.user._id.toString() === req.user._id.toString();

  res.jsonp(socialobjectactivity);
};

/**
 * Update a Socialobjectactivity
 */
exports.update = function(req, res) {
  var socialobjectactivity = req.socialobjectactivity;

  socialobjectactivity = _.extend(socialobjectactivity, req.body);

  socialobjectactivity.save()
    .then((socialobjectactivity) => {
      res.jsonp(socialobjectactivity);
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
 * Delete an Socialobjectactivity
 */
exports.delete = function(req, res) {
  var socialobjectactivity = req.socialobjectactivity;

  socialobjectactivity.deleteOne()
    .then((socialobjectactivity) => {
      res.jsonp(socialobjectactivity);
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
  //create search by or operator in mongodb
  var orcondition = [];
  if (req.query.search != undefined) {
    orcondition.push({ "activity_date": { $regex: new RegExp(req.query.search) } });
    orcondition.push({ "content": { $regex: new RegExp(req.query.search) } });
  }

  var c_soc = Socialobjectactivity.count(condition)
  if (orcondition.length > 0) {
    c_soc.or(orcondition);
  }
  c_soc.then((number) => {
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
 * List of Socialobjectactivity
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
    orcondition.push({ "activity_date": { $regex: new RegExp(req.query.search) } });
    orcondition.push({ "content": { $regex: new RegExp(req.query.search) } });
  }

  var soc = Socialobjectactivity.find(condition)//.sort('-created')
    .populate('user', 'displayName');

  if (orcondition.length > 0) {
    soc = soc.or(orcondition);
  }

  await soc.skip(10 * (currentPage - 1)).limit(10)
    .then((socialobjectactivities) => {
      res.jsonp([{ data: socialobjectactivities }]);
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
 * Socialobjectactivity middleware
 */
exports.socialobjectactivityByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Socialobjectactivity is invalid'
    });
  }

  Socialobjectactivity.findById(id).populate('user', 'displayName')
    .then((socialobjectactivity) => {
      if (!socialobjectactivity) {
        return res.status(404).send({
          message: 'No Socialobjectactivity with that identifier has been found'
        });
      }
      req.socialobjectactivity = socialobjectactivity;
      next();
    })
    .catch((err) => {
      if (err) {
        return next(err);
      }
    });
   
};
