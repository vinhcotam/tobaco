'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Keyinformants Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/keyinformants',
      permissions: '*'
    }, {
      resources: '/api/keyinformants/:keyinformantId',
      permissions: '*'
    }, {
      resources: '/api/keyinformants/numberrow',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/keyinformants',
      permissions: ['get', 'post']
    }, {
      resources: '/api/keyinformants/:keyinformantId',
      permissions: ['get']
    }, {
      resources: '/api/keyinformants/numberrow',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/keyinformants',
      permissions: ['get']
    }, {
      resources: '/api/keyinformants/:keyinformantId',
      permissions: ['get']
    }, {
      resources: '/api/keyinformants/numberrow',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Keyinformants Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Keyinformant is being processed and the current user created it then allow any manipulation
  if (req.keyinformant && req.user && req.keyinformant.user && req.keyinformant.user.id === req.user.id) {
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
