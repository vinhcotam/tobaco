'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Topic = mongoose.model('Topic'),
  Assignedtopic = mongoose.model('Assignedtopic'),

  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Topic
 */
exports.create = async function (req, res) {
  //need add record to assigned topic for manager
  var topic = new Topic(req.body);
  topic.user = req.user;

  await topic.save()
    .then((topic) => {
      //add assign topic to owner in Assigned topic
      var assigned = new Assignedtopic();
      assigned.topic = topic._id;
      assigned.assigned_user = topic.owner;
      assigned.save()
        .then((assigned) => {
          res.json(topic);
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
 * Show the current Topic
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var topic = req.topic ? req.topic.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  topic.isCurrentUserOwner = req.user && topic.user && topic.user._id.toString() === req.user._id.toString();
  console.log("call read");
  res.json(topic);
};

/**
 * Update a Topic
 */
exports.update = function(req, res) {
  var topic = req.topic;
  topic = _.extend(topic, req.body);

  topic.save(topic)
    .then(() => {
      
      res.json(topic);
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
 * Delete an Topic
 */
exports.delete = async function (req, res) {
  //delete need note related collection

  var topic = req.topic;

  //need delete all assigned topic before delete topic
  await Assignedtopic.deleteMany({ topic: topic._id })
    .then((assigned) => {
      console.log("deleted");
    })
    .catch((err) => {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
    });

  //deelte topic
  await topic.deleteOne()
    .then((topic) => {
      res.json(topic);
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
 * List of Topics by role
 */
exports.listbyrole = function (req, res) {
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
  //
  if (isRole == 0) {//admin --> get all 
    //all topic
  } else if (isRole == 1) { //manager
    condition.owner = req.user._id;
  } else { //user
    //
  }
  Topic.find(condition).sort('-created')
    .populate('user', 'displayName')
    .then((topics) => {
      res.json(topics);
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
 * List of Topics
 */
exports.list = function(req, res) {
  Topic.find().sort('-created')
    .populate('user', 'displayName')
    .populate('owner', 'displayName')
    .then((topics) => {
      res.json(topics);
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
 * Topic middleware
 */
exports.topicByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Topic is invalid'
    });
  }

  Topic.findById(id).populate('user', 'displayName')
    .then((topic) => {
      if (!topic) {
        return res.status(404).send({
          message: 'No Topic with that identifier has been found'
        });
      }
      req.topic = topic;
      next();
    })
    .catch((err) => {
      if (err) {
        return next(err);
      }
    });
};
