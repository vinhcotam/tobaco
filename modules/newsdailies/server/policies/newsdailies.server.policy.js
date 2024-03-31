'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');
var mongoose = require('mongoose');
var Assignedtopic = require('mongoose').model('Assignedtopic');

// Using the memory backend
acl = new acl(new acl.memoryBackend());
const jwt = require('jsonwebtoken');
/**
 * Invoke Newsdailies Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/newsdailies',
      permissions: '*'
    }, {
        resources: '/api/newsdailies/statistic',
        permissions: '*'
    }, {
        resources: '/api/newsdailies/statistic/groupnews',
        permissions: '*'
    }, {
      resources: '/api/newsdailies/export',
      permissions: '*'
    },{
      resources: '/api/newsdailies/:newsdailyId',
      permissions: '*'
    }, {
      resources: '/api/newsdailies/numberrow',
      permissions: '*'
    }, {
      resources: '/api/newsdailies/count4topics',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/newsdailies',
      //permissions: ['get', 'post']
      permissions: "*"
    }, {
      resources: '/api/newsdailies/statistic',
      permissions: '*'
    }, {
      resources: '/api/newsdailies/statistic/groupnews',
      permissions: '*'
    }, {
      resources: '/api/newsdailies/export',
      permissions: '*'
    }, {
      resources: '/api/newsdailies/:newsdailyId',
      //permissions: ['get']
      permissions: "*"
    }, {
      resources: '/api/newsdailies/numberrow',
      permissions: '*'
    }, {
      resources: '/api/newsdailies/count4topics',
        permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/newsdailies',
      permissions: ['get']
    }, {
        resources: '/api/newsdailies/statistic',
        permissions: '*'
    },{
      resources: '/api/newsdailies/:newsdailyId',
      permissions: ['get']
    }, {
      resources: '/api/newsdailies/convertnewsgroup',
      permissions: ['get']
    }, {
      resources: '/api/newsdailies/numberrow',
      permissions: ['get']
      }, {
        resources: '/api/newsdailies/count4topics',
        permissions: ['get']
      }]
  }]);
};

/**
 * Check If Newsdailies Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Newsdaily is being processed and the current user created it then allow any manipulation
  if (req.newsdaily && req.user && req.newsdaily.user && req.newsdaily.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};

/**
 * Check If API call with a token
 */
exports.tokenAuth = async (req, res, next) => {
  console.log(req.headers)
  const token = req.header('Authorization').replace('Bearer ', '');
  
  const data = jwt.verify(token, 'tabao');
  //console.log(data, token)
  const User = mongoose.model('User');

  try {
    const user = await User.findOne({ _id: data._id, 'tokens.token': token })
    if (!user) {
      throw new Error({ error: 'Not authorized' })
    }

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

    req.user = user;
    let condition = { assigned_user: user._id };
    if (isRole == 2) {
      condition.working_status = 1;
    }

    await Assignedtopic.find(condition, '_id topic assigned_user working_status created')
      .populate('topic', '_id topic_name')
      .then((topics) => {
        user.topics = topics;
        req.user = user;
      })
      .catch((err) => {
        if (err) {
          return done(err);
        }
      });
    req.token = token;

    next();
  } catch (error) {
    res.status(401).send({ error: 'Not authorized to access this resource' })
  }
}

