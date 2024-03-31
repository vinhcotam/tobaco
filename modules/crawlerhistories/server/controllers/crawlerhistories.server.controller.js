'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Crawlerhistory = mongoose.model('Crawlerhistory'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Crawlerhistory
 */
exports.create = function(req, res) {
  var crawlerhistory = new Crawlerhistory(req.body);
  crawlerhistory.user = req.user;

  crawlerhistory.save()
    .then((crawlerhistory) => {
      res.json(crawlerhistory);
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
 * Show the current Crawlerhistory
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var crawlerhistory = req.crawlerhistory ? req.crawlerhistory.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  crawlerhistory.isCurrentUserOwner = req.user && crawlerhistory.user && crawlerhistory.user._id.toString() === req.user._id.toString();

  res.json(crawlerhistory);
};

/**
 * Update a Crawlerhistory
 */
exports.update = function(req, res) {
  var crawlerhistory = req.crawlerhistory;

  crawlerhistory = _.extend(crawlerhistory, req.body);

  crawlerhistory.save()
    .then((crawlerhistory) => {
      res.json(crawlerhistory);
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
 * Delete an Crawlerhistory
 */
exports.delete = function(req, res) {
  var crawlerhistory = req.crawlerhistory;

  crawlerhistory.deleteOne()
    .then((crawlerhistory) => {
      res.json(crawlerhistory);
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
  Crawlerhistory.count()
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

exports.Change = function(req, res) {
  var change = [];
  change.find({frequency: {$exists: true}}).forEach(function(obj) {
  obj.frequency = "" + obj.frequency;
  change.save(obj);
  });
}

/**
 * List of Crawlerhistories
 */
exports.list = function(req, res) {
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
    orcondition.push({ "data_execute": { $regex: new RegExp(req.query.search) } });
    orcondition.push({ "frequency": { $eq: Number(req.query.search) } });
  }
  var rowHistories = Crawlerhistory.count();
  var countHistories = Crawlerhistory.find();
  if (orcondition.length > 0) {
    rowHistories.or(orcondition);
    countHistories.or(orcondition);
  }
  countHistories.count()
    .then((count) => {

        //res.jsonp({ count });
        rowHistories.find()//.sort('-created')
          .skip(2 * (currentPage - 1)).limit(2)
          .populate('user', 'displayName')
          .then((crawlerhistories) => {
            res.jsonp([{ count: count, data: crawlerhistories }]);
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
 * Crawlerhistory middleware
 */
exports.crawlerhistoryByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Crawlerhistory is invalid'
    });
  }

  Crawlerhistory.findById(id).populate('user', 'displayName')
    .then((crawlerhistory) => {
      if (!crawlerhistory) {
        return res.status(404).send({
          message: 'No Crawlerhistory with that identifier has been found'
        });
      }
      req.crawlerhistory = crawlerhistory;
      next();
    })
    .catch((err) => {
      if (err) {
        return next(err);
      }
    });
    
};
