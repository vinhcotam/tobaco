'use strict';

/**
 * Module dependencies
 */
var _ = require('lodash'),
  mongoose = require('mongoose'),
  User = mongoose.model('User');

/**
 * User middleware
 */
exports.userByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'User is invalid'
    });
  }

  User.findOne({
    _id: id
  })
    .then((user) => {
      if (!user) {
        return next(new Error('Failed to load User ' + id));
      }

      req.profile = user;
      next();
    })
    .catch((err) => {
      if (err) {
        return next(err);
      }
    });
};
