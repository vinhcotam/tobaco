'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Objectpackage = mongoose.model('Objectpackage'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Objectpackage
 */
exports.create = function (req, res) {
  var objectpackage = new Objectpackage(req.body);
  objectpackage.user = req.user;

  objectpackage.save()
    .then((objectpackage) => {
      res.jsonp(objectpackage);
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
 * Show the current Objectpackage
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var objectpackage = req.objectpackage ? req.objectpackage.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  objectpackage.isCurrentUserOwner = req.user && objectpackage.user && objectpackage.user._id.toString() === req.user._id.toString();

  res.jsonp(objectpackage);
};

/**
 * Update a Objectpackage
 */
exports.update = function (req, res) {
  var objectpackage = req.objectpackage;

  objectpackage = _.extend(objectpackage, req.body);

  objectpackage.save()
    .then((objectpackage) => {
      res.jsonp(objectpackage);
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
 * Delete an Objectpackage
 */
exports.delete = function (req, res) {
  var objectpackage = req.objectpackage;

  objectpackage.deleteOne()
    .then((objectpackage) => {
      res.jsonp(objectpackage);
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
    if (element === 'admin') {
      isRole = 0;
    } else if (element === 'manager' && isRole === -1) {
      isRole = 1;
    } else if (element === 'user' && isRole === -1) {
      isRole = 2;
    }
  });

  var condition = {};
  let topicIds = [];
  if (isRole === 2) {
    req.user.topics.forEach(function (element, index) {
      if (element.working_status === 1) {
        topicIds.push(element.topic._id);
      }
    });
    condition = { "socialcrawlerconfig.topic": { "$in": topicIds } };
  }

  var orcondition = [];
  if (req.query.search !== undefined) {
    orcondition.push({ "package_name": { $regex: new RegExp(req.query.search) } });
  }

  if (orcondition.length > 0) {
    condition.$or = orcondition;
  }
  /* var objp = Objectpackage.count(condition)
    .populate({
      path: 'socialcrawlerconfig',
      match: { "topic": { "$in": topicIds } },
      select: '_id topic'
    });*/
  var objp = Objectpackage.aggregate()
    .lookup({
      from: 'socialcrawlerconfigs',
      localField: 'socialcrawlerconfig',
      foreignField: '_id',
      as: 'socialcrawlerconfig'
    })
    // .project("_id socialcrawlerconfig.topic")

    .match(condition)
    .count('total');
  objp.then((number) => {
    res.jsonp(number);
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
 * List of Objectpackages
 */
exports.list = function (req, res) {
  var currentPage = 1;
  var roles = req.user.roles;
  var isRole = -1;
  var count = false;
  roles.forEach(function (element, index) {
    if (element === 'admin') {
      isRole = 0;
    } else if (element === 'manager' && isRole === -1) {
      isRole = 1;
    } else if (element === 'user' && isRole === -1) {
      isRole = 2;
    }
  });

  var condition = {};
  let topicIds = [];
  if (isRole === 2) {
    // condition.user = req.user._id;
    req.user.topics.forEach(function (element, index) {
      if (element.working_status === 1) {
        topicIds.push(element.topic._id);
      }
    });
    condition = { "socialcrawlerconfig.topic": { "$in": topicIds } };
  }

  if (req.query.currentPage !== undefined) {
    currentPage = req.query.currentPage;
  }

  if (req.query.count !== undefined) {
    count = req.query.count;
  }

  // create search by or operator in mongodb
  var orcondition = [];
  if (req.query.search !== undefined) {
    orcondition.push({ "package_name": { $regex: new RegExp(req.query.search) } });
  }

  /* var objp = Objectpackage.find(condition)//.sort('-created')
    .populate('user', 'displayName')
    .populate({
        path: 'socialcrawlerconfig',
        match: { "topic": { "$in": topicIds } },
        select: '_id topic'
      });

  if (orcondition.length > 0) {
    objp = objp.or(orcondition);
  }*/
  if (orcondition.length > 0) {
    condition.$or = orcondition;
  }
  var objp = Objectpackage.aggregate()
    .lookup({
      from: 'socialcrawlerconfigs',
      localField: 'socialcrawlerconfig',
      foreignField: '_id',
      as: 'socialcrawlerconfig'
    }).
    unwind('socialcrawlerconfig')
    // .project("_id socialcrawlerconfig.topic")

    .match(condition);
  objp.skip(10 * (currentPage - 1)).limit(10)
    .then((objectpackages) => {
      res.jsonp(objectpackages);
    })
    .catch((err) => {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
    });

  // Objectpackage.find().sort('-created').populate('user', 'displayName').exec(function(err, objectpackages) {
  //  if (err) {
  //    return res.status(400).send({
  //      message: errorHandler.getErrorMessage(err)
  //    });
  //  } else {
  //    res.jsonp(objectpackages);
  //  }
  // });
};

/**
 * Objectpackage middleware
 */
exports.objectpackageByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Objectpackage is invalid'
    });
  }

  Objectpackage.findById(id).populate('user', 'displayName')
    .then((objectpackage) => {
      if (!objectpackage) {
        return res.status(404).send({
          message: 'No Objectpackage with that identifier has been found'
        });
      }
      req.objectpackage = objectpackage;
      next();
    })
    .catch((err) => {
      if (err) {
        return next(err);
      }
    });

};
