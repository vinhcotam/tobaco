'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Monitoringtypes Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/monitoringtypes',
      permissions: '*'
    }, {
      resources: '/api/monitoringtypes/:monitoringtypeId',
      permissions: '*'
    }, {
      resources: '/api/monitoringtypes/numberrow',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/monitoringtypes',
      permissions: ['get', 'post']
    }, {
      resources: '/api/monitoringtypes/:monitoringtypeId',
      permissions: ['get']
    }, {
      resources: '/api/monitoringtypes/numberrow',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/monitoringtypes',
      permissions: ['get']
    }, {
      resources: '/api/monitoringtypes/:monitoringtypeId',
      permissions: ['get']
    }, {
      resources: '/api/monitoringtypes/numberrow',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Monitoringtypes Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Monitoringtype is being processed and the current user created it then allow any manipulation
  if (req.monitoringtype && req.user && req.monitoringtype.user && req.monitoringtype.user.id === req.user.id) {
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
