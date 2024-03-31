'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Websites Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/websites',
      permissions: '*'
    }, {
      resources: '/api/websites/export',
      permissions: '*'
    }, {
      resources: '/api/websites/:websiteId',
      permissions: '*'
    }, {
      resources: '/api/websites/numberrow',
      permissions: '*'
    }]
  }, {
    roles: ['manager'],
    allows: [{
      resources: '/api/websites',
      permissions: ['get', 'post']
    }, {
      resources: '/api/websites/export',
      permissions: '*'
    }, {
      resources: '/api/websites/:websiteId',
      permissions: ['get']
    }, {
      resources: '/api/websites/numberrow',
      permissions: ['get']
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/websites',
      permissions: ['get', 'post']
    }, {
      resources: '/api/websites/export',
      permissions: '*'
    }, {
      resources: '/api/websites/:websiteId',
      permissions: ['get']
    }, {
      resources: '/api/websites/numberrow',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/websites',
      permissions: ['get']
    }, {
      resources: '/api/websites/:websiteId',
      permissions: ['get']
    }, {
      resources: '/api/websites/numberrow',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Websites Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Website is being processed and the current user created it then allow any manipulation
  if (req.website && req.user && req.website.user && req.website.user.id === req.user.id) {
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
