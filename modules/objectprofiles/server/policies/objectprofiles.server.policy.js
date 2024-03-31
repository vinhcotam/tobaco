'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Objectprofiles Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/objectprofiles',
      permissions: '*'
    }, {
      resources: '/api/objectprofiles/:objectprofileId',
      permissions: '*'
    }, {
      resources: '/api/objectprofiles/numberrow',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/objectprofiles',
      permissions: ['get', 'post']
    }, {
      resources: '/api/objectprofiles/:objectprofileId',
      permissions: ['get']
    }, {
      resources: '/api/objectprofiles/numberrow',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/objectprofiles',
      permissions: ['get']
    }, {
      resources: '/api/objectprofiles/:objectprofileId',
      permissions: ['get']
    }, {
      resources: '/api/objectprofiles/numberrow',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Objectprofiles Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Objectprofile is being processed and the current user created it then allow any manipulation
  if (req.objectprofile && req.user && req.objectprofile.user && req.objectprofile.user.id === req.user.id) {
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
