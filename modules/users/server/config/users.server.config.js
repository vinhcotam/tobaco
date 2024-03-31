'use strict';

/**
 * Module dependencies
 */
var passport = require('passport'),
  User = require('mongoose').model('User'),
  path = require('path'),
  config = require(path.resolve('./config/config'));
var Assignedtopic = require('mongoose').model('Assignedtopic');
/**
 * Module init function
 */
module.exports = function (app) {
  // Serialize sessions
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  // Deserialize sessions
  passport.deserializeUser(function (id, done) {
    User.findOne({
      _id: id
    }, '-salt -password')
      .then((user) => {
        var roles = user.roles;
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
        let condition = { assigned_user: user._id };

        if (isRole == 2) { //user role
          //condition.working_status = 1;
        }
        else { 

        }
        Assignedtopic.find(condition, '_id topic assigned_user working_status created')
          .populate('topic', '_id topic_name')
          .then((topics) => {
            user.topics = topics;
            //done(err, user);
            done(null, user);
          })
          .catch((err) => {
            if (err) {
              return done(err);
            }
          });
      })
      .catch((err) => {
        if (err) {
          return done(err);
        }
      });
  });

  // Initialize strategies
  config.utils.getGlobbedPaths(path.join(__dirname, './strategies/**/*.js')).forEach(function (strategy) {
    require(path.resolve(strategy))(config);
  });

  // Add passport's middleware
  app.use(passport.initialize());
  app.use(passport.session());
};
