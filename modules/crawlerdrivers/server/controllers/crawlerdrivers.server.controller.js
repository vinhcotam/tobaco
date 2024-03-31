'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Crawlerdriver = mongoose.model('Crawlerdriver'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Crawlerdriver
 */
exports.create = function(req, res) {
  var crawlerdriver = new Crawlerdriver(req.body);
  crawlerdriver.user = req.user;

  crawlerdriver.save()
    .then((crawlerdriver) => {
      res.json(crawlerdriver);
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
 * Show the current Crawlerdriver
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var crawlerdriver = req.crawlerdriver ? req.crawlerdriver.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  crawlerdriver.isCurrentUserOwner = req.user && crawlerdriver.user && crawlerdriver.user._id.toString() === req.user._id.toString();
  res.json(crawlerdriver);
};

/**
 * Update a Crawlerdriver
 */
exports.update = function(req, res) {
  var crawlerdriver = req.crawlerdriver;

  crawlerdriver = _.extend(crawlerdriver, req.body);

  crawlerdriver.save()
    .then((crawlerdriver) => {
      res.json(crawlerdriver);
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
 * Delete an Crawlerdriver
 */
exports.delete = function(req, res) {
  var crawlerdriver = req.crawlerdriver;

  crawlerdriver.deleteOne()
    .then((crawlerdriver) => {
      res.json(crawlerdriver);
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
 */
exports.count = function (req, res) {
  var currentPage = 1;
  if (req.query.currentPage != undefined) {
    currentPage = req.query.currentPage;
  }
  Crawlerdriver.count()
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
 * List of Crawlerdrivers
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
    orcondition.push({ "crawlerdriver_name": { $regex: new RegExp(req.query.search, "i") } });
    orcondition.push({ "crawlerdriver_path": { $regex: new RegExp(req.query.search, "i") } });
    orcondition.push({ "crawlerdriver_class": { $regex: new RegExp(req.query.search, "i") } });
    orcondition.push({ "crawlerdriver_description": { $regex: new RegExp(req.query.search, "i") } });
  }
  var rowDrivers = Crawlerdriver.count();
  var countDrivers = Crawlerdriver.find();
  if (orcondition.length > 0) {
    rowDrivers.or(orcondition);
    countDrivers.or(orcondition);
  }
  countDrivers.count()
    .then((count) => {

        //res.jsonp({ count });
        rowDrivers.find()//.sort('-created')
          .skip(2 * (currentPage - 1)).limit(2)
          .populate('user', 'displayName')
          .then((crawlerdrivers) => {
            res.jsonp([{ count: count, data: crawlerdrivers }]);
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
// exports.list = function(req, res) {
//   Crawlerdriver.find().sort('-created').populate('user', 'displayName').exec(function(err, crawlerdrivers) {
//     if (err) {
//       return res.status(400).send({
//         message: errorHandler.getErrorMessage(err)
//       });
//     } else {
//       res.json(crawlerdrivers);
//     }
//   });
// };

/**
 * Crawlerdriver middleware
 */
exports.crawlerdriverByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Crawlerdriver is invalid'
    });
  }

  Crawlerdriver.findById(id).populate('user', 'displayName')
    .then((crawlerdriver) => {
      if (!crawlerdriver) {
        return res.status(404).send({
          message: 'No Crawlerdriver with that identifier has been found'
        });
      }
      req.crawlerdriver = crawlerdriver;
      next();
    })
    .catch((err) => {
      if (err) {
        return next(err);
      }
    });
   
};
