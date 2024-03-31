'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Keyinformant = mongoose.model('Keyinformant'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Keyinformant
 */
exports.create = function(req, res) {
  var keyinformant = new Keyinformant(req.body);
  keyinformant.user = req.user;

  keyinformant.save()
    .then((keyinformant) => {
      res.jsonp(keyinformant);
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
 * Show the current Keyinformant
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var keyinformant = req.keyinformant ? req.keyinformant.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  keyinformant.isCurrentUserOwner = req.user && keyinformant.user && keyinformant.user._id.toString() === req.user._id.toString();

  res.jsonp(keyinformant);
};

/**
 * Update a Keyinformant
 */
exports.update = function(req, res) {
  var keyinformant = req.keyinformant;

  keyinformant = _.extend(keyinformant, req.body);

  keyinformant.save()
    .then((keyinformant) => {
      res.jsonp(keyinformant);
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
 * Delete an Keyinformant
 */
exports.delete = function(req, res) {
  var keyinformant = req.keyinformant;

  keyinformant.deleteOne()
    .then((keyinformant) => {
      res.jsonp();
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

  var orcondition = [];
  if (req.query.search != undefined) {
    orcondition.push({ "keyinfor_name": { $regex: new RegExp(req.query.search) } });
  }

  var keyinfo = Keyinformant.count(condition)
  if (orcondition.length > 0) {
    keyinfo.or(orcondition);
  }
  keyinfo.then((number) => {
    res.jsonp([number]);
  })
    .catch((err) => {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
    });
}
/**
 * List of Keyinformants
 */
exports.list = function (req, res) {
  var currentPage = 1;
  var roles = req.user.roles;
  var isRole = -1;
  var count = false;
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

  if (req.query.count != undefined) {
    count = req.query.count;
  }

  //create search by or operator in mongodb
  var orcondition = [];
  if (req.query.search != undefined) {
    orcondition.push({ "keyinfor_name": { $regex: new RegExp(req.query.search) } });
  }

  var keuinfo = Keyinformant.find(condition)//.sort('-created')
    .populate('user', 'displayName');

  if (orcondition.length > 0) {
    keuinfo = keuinfo.or(orcondition);
  }

  keuinfo.skip(10 * (currentPage - 1)).limit(10)
    .then((keyinformants) => {
      res.jsonp(keyinformants);
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
 * Keyinformant middleware
 */
exports.keyinformantByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Keyinformant is invalid'
    });
  }

  Keyinformant.findById(id).populate('user', 'displayName')
    .then((keyinformant) => {
      if (!keyinformant) {
        return res.status(404).send({
          message: 'No Keyinformant with that identifier has been found'
        });
      }
      req.keyinformant = keyinformant;
      next();
    })
    .catch((err) => {
      if (err) {
        return next(err);
      }
    });
};
