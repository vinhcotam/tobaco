'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Show the current user
 */
exports.read = function (req, res) {
  res.json(req.model);
};

/**
 * Create a User
 */
exports.create = function (req, res) {
  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;

  // Init user and add missing fields
  var user = new User(req.body);
  user.user = req.user;
  user.provider = 'local';
  user.displayName = user.firstName + ' ' + user.lastName;

  // Then save the user
  user.save()
    .then((user) => {
      // Remove sensitive data before login
      res.json(user);
    })
    .catch((err) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
    });
}

/**
 * Update a User
 */
exports.update = function (req, res) {
  var user = req.model;

  // For security purposes only merge these parameters
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.displayName = user.firstName + ' ' + user.lastName;
  user.roles = req.body.roles;

  user.save()
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
    });
};

/**
 * Delete a user
 */
exports.delete = function (req, res) {
  var user = req.model;

  user.deleteOne()
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
    });
};

/**
 * List of Users
 */
exports.list = function (req, res) {
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
  var cond = {};
  if (isRole == 1) {
    cond.owner = new mongoose.Types.ObjectId(req.user._id);
  }
  User.find(cond, '-salt -password -providerData')
    .sort('-created')
    .populate('user', 'displayName')
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
    })
  //User.find(cond, '-salt -password -providerData')
  //  .sort('-created')
  //  .populate('user', 'displayName').exec(function (err, users) {
  //    if (err) {
  //      return res.status(422).send({
  //        message: errorHandler.getErrorMessage(err)
  //      });
  //    }
  //    res.json(users);
  //});
  /*User.find({}, '-salt -password -providerData')
    .sort('-created')
    .populate('user', 'displayName').exec(function (err, users) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
      res.json(users);
  });*/

};

/**
 * User middleware
 */
exports.userByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'User is invalid'
    });
  }

  User.findById(id, '-salt -password -providerData')
    .then((user) => {
      if (!user) {
        return next(new Error('Failed to load user ' + id));
      }

      req.model = user;
      next();
    })
    .catch((err)=> {
      if (err) {
        return next(err);
      }
    });

};
