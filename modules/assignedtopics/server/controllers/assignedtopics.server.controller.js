'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Assignedtopic = mongoose.model('Assignedtopic'),
  Topics = mongoose.model('Topic'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Assignedtopic
 */
exports.create = function(req, res) {
  var assignedtopic = new Assignedtopic(req.body);
  assignedtopic.user = req.user;

  assignedtopic.save()
    .then((assignedtopic) => {
      res.jsonp(assignedtopic);
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
 * Show the current Assignedtopic
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var assignedtopic = req.assignedtopic ? req.assignedtopic.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  assignedtopic.isCurrentUserOwner = req.user && assignedtopic.user && assignedtopic.user._id.toString() === req.user._id.toString();

  res.jsonp(assignedtopic);
};

/**
 * Update a Assignedtopic
 */
exports.update = function(req, res) {
  var assignedtopic = req.assignedtopic;

  assignedtopic = _.extend(assignedtopic, req.body);

  assignedtopic.save()
    .then((assignedtopic) => {
      res.jsonp(assignedtopic);
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
 * Delete an Assignedtopic
 */
exports.delete = function(req, res) {
  var assignedtopic = req.assignedtopic;

  assignedtopic.deleteOne()
    .then((assignedtopic) => {
      res.jsonp(assignedtopic);
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
 * number of Assignedtopics
 */
exports.countbyrole = function (req, res) {
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
  if (isRole == 1) {
    condition.owner = req.user._id;
    Topics.count(condition)
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
  } else if (isRole == 2) {
    condition.assigned_user = req.user._id;
    Assignedtopic.count(condition)
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
  } else {
    //admin
    Topics.count(condition)
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
  }
}

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
  if (isRole == 1 || isRole == 2) {
    condition.assigned_user = req.user._id;
  }

  Assignedtopic.count(condition)
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
}

/**
 * List of Assignedtopics
 */
exports.list = async function (req, res) {
  //set roles
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
  if (isRole == 1) {
    //get all topics owner

    //condition.assigned_user = req.user._id;
    await Topics.find({ owner: req.user._id })
      .then((topics) => {
        var topic_id = [];
        topics.forEach((element, index) => {
          topic_id.push(element._id);
        });
        condition.topic = { '$in': topic_id };
      })
      .catch((err) => {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        }
      });
  } else if (isRole == 2) {
    condition.assigned_user = req.user._id;
  } else {
    //admin
  }

  //console.log(condition);
  await Assignedtopic.find(condition)//.sort('-created')
    .populate({
      path:'topic',
      select: '_id topic_name topic_description owner',
      populate: {
        path: 'owner',
        select: 'displayName'
      }
    })
    .populate('user', 'displayName profileImageURL')
    .populate('assigned_user', 'displayName')
    .then((assignedtopics) => {
      res.jsonp(assignedtopics);
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
 * Assignedtopic middleware
 */
exports.assignedtopicByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Assignedtopic is invalid'
    });
  }

  Assignedtopic.findById(id)
    .populate('user', '_id displayName')
    .populate('assigned_user', '_id displayName')
    .populate('topic', '_id topic_name')
    .then((assignedtopic) => {
      if (!assignedtopic) {
        return res.status(404).send({
          message: 'No Assignedtopic with that identifier has been found'
        });
      }
      req.assignedtopic = assignedtopic;
      next();
    })
    .catch((err) => {
      if (err) {
        return next(err);
      }
    });
    
};
