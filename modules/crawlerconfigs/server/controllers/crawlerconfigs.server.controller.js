'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Crawlerconfig = mongoose.model('Crawlerconfig'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Crawlerconfig
 */
exports.create = function (req, res) {
  console.log(req.body);
  //var crawlerconfig = new Crawlerconfig(req.body);
  var crawlerconfig = new Crawlerconfig();
  crawlerconfig.config_name = req.body.config_name;
  crawlerconfig.topic = req.body.topic;
  crawlerconfig.website = req.body.websites_to;
  crawlerconfig.crawlerdriver = req.body.crawlerdriver;
  crawlerconfig.parameters = [{
    keywords: req.body.parameters.keywords,
    websites: req.body.parameters.websites,
    startdate: req.body.parameters.startdate,
    todate: req.body.parameters.todate,
  }];
  crawlerconfig.user = req.user;

  crawlerconfig.save()
    .then((crawlerconfig) => {
      res.json(crawlerconfig);
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
 * Show the current Crawlerconfig
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var crawlerconfig = req.crawlerconfig ? req.crawlerconfig.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  crawlerconfig.isCurrentUserOwner = req.user && crawlerconfig.user && crawlerconfig.user._id.toString() === req.user._id.toString();

  res.json(crawlerconfig);
};

/**
 * Update a Crawlerconfig
 */
exports.update = function(req, res) {
  var crawlerconfig = req.crawlerconfig;

  crawlerconfig = _.extend(crawlerconfig, req.body);

  crawlerconfig.save()
    .then((crawlerconfig) => {
      res.json(crawlerconfig);
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
 * Delete an Crawlerconfig
 */
exports.delete = function(req, res) {
  var crawlerconfig = req.crawlerconfig;

  crawlerconfig.deleteOne()
    .then((crawlerconfig) => {
      res.json(crawlerconfig);
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
 * List of Crawlerconfigs
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
    orcondition.push({ "crawlerconfig_name": { $regex: new RegExp(req.query.search, "i") } });
  }
  var rowConfigs = Crawlerconfig.count();
  var countConfigs = Crawlerconfig.find();
  if (orcondition.length > 0) {
    rowConfigs.or(orcondition);
    countConfigs.or(orcondition);
  }

  //check topic is working
  var topics = req.user.topics;
  var topic_id = [];
  topics.forEach((element, index) => {
    if (element.working_status == 1) {
      topic_id.push(element.topic._id);
    }
  })

  //check roles
  var condition = {};
  if (req.user.roles) {
    var isAdmin = req.user.roles.includes('admin');
    var isManager = req.user.roles.includes('manager');

    if (isAdmin) {

    } else {
      condition.topic = { '$in': topic_id };
    }
  }

  countConfigs.count(condition)
    .then((count) => {
        //res.jsonp({ count });
        rowConfigs.find(condition)//.sort('-created')
          .skip(10 * (currentPage - 1)).limit(10)
          .populate('user', 'displayName')
          .populate('topic', '_id topic_name')
          .then((crawlerconfigs) => {
            res.jsonp([{ count: count, data: crawlerconfigs }]);
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
 * List of Crawlerconfigs for filter
 */
exports.filter = function (req, res) {
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
    orcondition.push({ "crawlerconfig_name": { $regex: new RegExp(req.query.search, "i") } });
  }
  var rowConfigs = Crawlerconfig.count();
  var countConfigs = Crawlerconfig.find();
  if (orcondition.length > 0) {
    rowConfigs.or(orcondition);
    countConfigs.or(orcondition);
  }

  //check topic is working
  var topics = req.user.topics;
  var topic_id = [];
  topics.forEach((element, index) => {
    if (element.working_status == 1) {
      topic_id.push(element.topic._id);
    }
  })

  //check roles
  var condition = {};
  if (req.user.roles) {
    var isAdmin = req.user.roles.includes('admin');
    var isManager = req.user.roles.includes('manager');

    if (isAdmin) {

    } else {
      condition.topic = { '$in': topic_id };
    }
  }

  countConfigs.count(condition)
    .then((count) => {
        //res.jsonp({ count });
        rowConfigs.find(condition)//.sort('-created')
          //.skip(10 * (currentPage - 1)).limit(10)
          .populate('user', 'displayName')
          .populate('topic', '_id topic_name')
          .then((crawlerconfigs) => {
            res.jsonp([{ count: count, data: crawlerconfigs }]);
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
//exports.list = function(req, res) {
//  Crawlerconfig.find().sort('-created').populate('user', 'displayName').exec(function(err, crawlerconfigs) {
//    if (err) {
//      return res.status(400).send({
//        message: errorHandler.getErrorMessage(err)
//      });
//    } else {
//      res.json(crawlerconfigs);
//    }
//  });
//};

/**
 * Crawlerconfig middleware
 */
exports.crawlerconfigByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Crawlerconfig is invalid'
    });
  }

  Crawlerconfig.findById(id).populate('user', 'displayName')
    .then((crawlerconfig) => {
      if (!crawlerconfig) {
        return res.status(404).send({
          message: 'No Crawlerconfig with that identifier has been found'
        });
      }
      req.crawlerconfig = crawlerconfig;
      next();
    })
    .catch((err) => {
      if (err) {
        return next(err);
      }
    });
};
