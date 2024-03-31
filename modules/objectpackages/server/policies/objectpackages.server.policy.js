'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Objectpackages Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/objectpackages',
      permissions: '*'
    }, {
      resources: '/api/objectpackages/:objectpackageId',
      permissions: '*'
    }, {
      resources: '/api/objectpackages/numberrow',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/objectpackages',
      permissions: ['get', 'post']
    }, {
      resources: '/api/objectpackages/:objectpackageId',
      permissions: ['get']
    }, {
      resources: '/api/objectpackages/numberrow',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/objectpackages',
      permissions: ['get']
    }, {
      resources: '/api/objectpackages/:objectpackageId',
      permissions: ['get']
    }, {
      resources: '/api/objectpackages/numberrow',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Objectpackages Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Objectpackage is being processed and the current user created it then allow any manipulation
  if (req.objectpackage && req.user && req.objectpackage.user && req.objectpackage.user.id === req.user.id) {
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
