'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Socialobjectactivities Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/socialobjectactivities',
      permissions: '*'
    }, {
      resources: '/api/socialobjectactivities/:socialobjectactivityId',
      permissions: '*'
    }, {
      resources: '/api/socialobjectactivities/numberrow',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/socialobjectactivities',
      permissions: ['get', 'post']
    }, {
      resources: '/api/socialobjectactivities/:socialobjectactivityId',
      permissions: ['get']
    }, {
      resources: '/api/socialobjectactivities/numberrow',
      permissions: '*'
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/socialobjectactivities',
      permissions: ['get']
    }, {
      resources: '/api/socialobjectactivities/:socialobjectactivityId',
      permissions: ['get']
    }, {
      resources: '/api/socialobjectactivities/numberrow',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Socialobjectactivities Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Socialobjectactivity is being processed and the current user created it then allow any manipulation
  if (req.socialobjectactivity && req.user && req.socialobjectactivity.user && req.socialobjectactivity.user.id === req.user.id) {
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
