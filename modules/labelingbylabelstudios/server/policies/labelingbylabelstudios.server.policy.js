'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Labelingbylabelstudios Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/labelingbylabelstudios',
      permissions: '*'
    }, {
      resources: '/api/labelingbylabelstudios/:labelingbylabelstudioId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/labelingbylabelstudios',
      //permissions: ['get', 'post']
      permissions: '*'
    }, {
      resources: '/api/labelingbylabelstudios/:labelingbylabelstudioId',
      //permissions: ['get']
      permissions: '*'
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/labelingbylabelstudios',
      permissions: ['get']
    }, {
      resources: '/api/labelingbylabelstudios/:labelingbylabelstudioId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Labelingbylabelstudios Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Labelingbylabelstudio is being processed and the current user created it then allow any manipulation
  if (req.labelingbylabelstudio && req.user && req.labelingbylabelstudio.user && req.labelingbylabelstudio.user.id === req.user.id) {
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
