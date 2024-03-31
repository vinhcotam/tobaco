'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Crawlerschedule = mongoose.model('Crawlerschedule'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Crawlerschedule
 */
exports.create = function(req, res) {
  var crawlerschedule = new Crawlerschedule(req.body);
  crawlerschedule.user = req.user;

  crawlerschedule.save()
    .then((crawlerschedule) => {
      res.json(crawlerschedule);
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
 * Show the current Crawlerschedule
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var crawlerschedule = req.crawlerschedule ? req.crawlerschedule.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  crawlerschedule.isCurrentUserOwner = req.user && crawlerschedule.user && crawlerschedule.user._id.toString() === req.user._id.toString();

  res.json(crawlerschedule);
};

/**
 * Update a Crawlerschedule
 */
exports.update = function(req, res) {
  var crawlerschedule = req.crawlerschedule;

  crawlerschedule = _.extend(crawlerschedule, req.body);

  crawlerschedule.save()
    .then((crawlerschedule) => {
      res.json(crawlerschedule);
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
 * Delete an Crawlerschedule
 */
exports.delete = function(req, res) {
  var crawlerschedule = req.crawlerschedule;

  crawlerschedule.deleteOne()
    .then((crawlerschedule) => {
      res.json(crawlerschedule);
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
    if (req.query.currentPage != undefined) {
      currentPage = req.query.currentPage;
    }
    Crawlerschedule.count()
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
   * List of Crawlerschedules
   */
  exports.list = function (req, res) {
    var currentPage = 1;
    var count = false;
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
      orcondition.push({ "frequency": { $eq: Number(req.query.search) } });
      orcondition.push({ "last_run_date": { $regex: new RegExp(req.query.search) } });
      orcondition.push({ "next_run_date": { $regex: new RegExp(req.query.search) } });
    }
    var rowSchedules = Crawlerschedule.count();
    var countSchedules = Crawlerschedule.find();
    if (orcondition.length > 0) {
      rowSchedules.or(orcondition);
      countSchedules.or(orcondition);
    }
    countSchedules.count()
      .then((count) => {

          //res.jsonp({ count });
          rowSchedules.find()//.sort('-created')
            .skip(2 * (currentPage - 1)).limit(2)
            .populate('user', 'displayName')
            .then((crawlerschedules) => {
              res.jsonp([{ count: count, data: crawlerschedules }]);
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
 * Crawlerschedule middleware
 */
exports.crawlerscheduleByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Crawlerschedule is invalid'
    });
  }

  Crawlerschedule.findById(id).populate('user', 'displayName')
    .then((crawlerschedule) => {
      if (!crawlerschedule) {
        return res.status(404).send({
          message: 'No Crawlerschedule with that identifier has been found'
        });
      }
      req.crawlerschedule = crawlerschedule;
      next();
    })
    .catch((err) => {
      if (err) {
        return next(err);
      }
    });
};
