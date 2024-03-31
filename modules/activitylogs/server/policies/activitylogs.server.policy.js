'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Activitylogs Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/activitylogs',
      permissions: '*'
    }, {
      resources: '/api/activitylogs/:activitylogId',
      permissions: '*'
    }, {
      resources: '/api/activitylogs/numberrow',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/activitylogs',
      permissions: ['get', 'post']
    }, {
      resources: '/api/activitylogs/:activitylogId',
      //permissions: ['get']
      permissions: '*'
    }, {
      resources: '/api/activitylogs/numberrow',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/activitylogs',
      permissions: ['get']
    }, {
      resources: '/api/activitylogs/:activitylogId',
      permissions: ['get']
    }, {
      resources: '/api/activitylogs/numberrow',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Activitylogs Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Activitylog is being processed and the current user created it then allow any manipulation
  if (req.activitylog && req.user && req.activitylog.user && req.activitylog.user.id === req.user.id) {
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
