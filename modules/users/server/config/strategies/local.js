'use strict';

/**
 * Module dependencies
 */
var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  User = require('mongoose').model('User');
var crypto = require('crypto');
var Assignedtopic = require('mongoose').model('Assignedtopic');
module.exports = function () {
  // Use local strategy
  passport.use(new LocalStrategy({
    usernameField: 'usernameOrEmail',
    passwordField: 'password'
  },
  function (usernameOrEmail, password, done) {
    // User.aggregate()
    //  .lookup({ from: 'assignedtopics', localField: '_id', foreignField: 'assigned_user', as: 'topics' })
    //  .match({
    //    "$or": [
    //      {
    //        username: usernameOrEmail.toLowerCase()
    //      }, {
    //        email: usernameOrEmail.toLowerCase()
    //      }
    //    ]
    //  })
    //  .exec(function (err, users) {
    //    if (err) {
    //      return done(err);
    //    }
    //    if (users.length < 1) {
    //      return done(null, false, {
    //        message: 'Invalid username or password (' + (new Date()).toLocaleTimeString() + ')'
    //      });
    //    }
    //    var user = users[0];
    //    var pwd = null;
    //    if (user.salt && password) {
    //      pwd = crypto.pbkdf2Sync(password, new Buffer(user.salt, 'base64'), 10000, 64, 'SHA1').toString('base64');
    //    } else {
    //      pwd = password;
    //    }
    //    if (!user || pwd != user.password) {
    //      return done(null, false, {
    //        message: 'Invalid username or password (' + (new Date()).toLocaleTimeString() + ')'
    //      });
    //    }

    //    return done(null, user);
    //  });
    User.findOne({
      $or: [{
        username: usernameOrEmail.toLowerCase()
      }, {
        email: usernameOrEmail.toLowerCase()
      }]
    })
      // .populate(['assignedtopics', 'assigned_user'])
      // .lean()
      .then((user) => {
        if (!user || !user.authenticate(password)) {
          return done(null, false, {
            message: 'Invalid username or password (' + (new Date()).toLocaleTimeString() + ')'
          });
        }
        // Assignedtopic.find({ assigned_user: user._id }, function (err, topics) {
        //  if (err) {
        //    return done(err);
        //  }
        //  user.topics = topics;
        //  return done(null, user);
        // });
        return done(null, user);
      })
      .catch((err) => {
        return done(err);
      });

    // old
    // User.findOne({
    //  $or: [{
    //    username: usernameOrEmail.toLowerCase()
    //  }, {
    //    email: usernameOrEmail.toLowerCase()
    //  }]
    // }, function (err, user) {
    //  if (err) {
    //    return done(err);
    //  }
    //  if (!user || !user.authenticate(password)) {
    //    return done(null, false, {
    //      message: 'Invalid username or password (' + (new Date()).toLocaleTimeString() + ')'
    //    });
    //  }

    //  return done(null, user);
    // });
  }));
};
