'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Webcategory = mongoose.model('Webcategory'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Webcategory
 */
exports.create = function (req, res) {
  var webcategory = new Webcategory(req.body);
  webcategory.user = req.user;

  webcategory.save()
    .then((webcategory) => {
      res.json(webcategory);
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
 * Show the current Webcategory
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var webcategory = req.webcategory ? req.webcategory.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  webcategory.isCurrentUserOwner = req.user && webcategory.user && webcategory.user._id.toString() === req.user._id.toString();

  res.json(webcategory);
};

/**
 * Update a Webcategory
 */
exports.update = function (req, res) {
  var webcategory = req.webcategory;

  webcategory = _.extend(webcategory, req.body);

  webcategory.save()
    .then((webcategory) => {
      res.json(webcategory);
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
 * Delete an Webcategory
 */
exports.delete = function (req, res) {
  var webcategory = req.webcategory;

  webcategory.deleteOne()
    .then((webcategory) => {
      res.json(webcategory);
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
  if (req.query.currentPage !== undefined) {
    currentPage = req.query.currentPage;
  }
  Webcategory.count()
    .then((number) => {
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
 * List of Webcategory
 */
exports.list = function (req, res) {
  var currentPage = 1;
  var count = false;
  if (req.query.currentPage !== undefined) {
    currentPage = req.query.currentPage;
  }
  console.log(currentPage - 1);
  if (req.query.count != undefined) {
    count = req.query.count;
  }
  // create search by or operator in mongodb
  var orcondition = [];
  if (req.query.search !== undefined) {
    orcondition.push({ "description": { $regex: new RegExp(req.query.search) } });
    orcondition.push({ "language": { $regex: new RegExp(req.query.search) } });
    orcondition.push({ "user_name": { $regex: new RegExp(req.query.search) } });
    orcondition.push({ "source_cate": { $regex: new RegExp(req.query.search) } });
  }
  var rowWebcate = Webcategory.count();
  var countWebcate = Webcategory.find();
  if (orcondition.length > 0) {
    rowWebcate.or(orcondition);
    countWebcate.or(orcondition);
  }
  countWebcate.count()
    .then((count) => {
      // res.jsonp({ count });
      rowWebcate.find()// .sort('-created')
        .skip(2 * (currentPage - 1)).limit(2)
        .populate('user', 'displayName')
        .then((webcategories) => {
          res.jsonp([{ count: count, data: webcategories }]);
        })
        .catch((err) => {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          }
        });
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
 * Webcategory middleware
 */
exports.webcategoryByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Webcategory is invalid'
    });
  }

  Webcategory.findById(id).populate('user', 'displayName')
    .then((webcategory) => {
      if (!webcategory) {
        return res.status(404).send({
          message: 'No Webcategory with that identifier has been found'
        });
      }
      req.webcategory = webcategory;
      next();
    })
    .catch((err) => {
      if (err) {
        return next(err);
      }
    });
};