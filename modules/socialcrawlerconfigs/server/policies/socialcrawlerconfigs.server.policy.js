'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Socialcrawlerconfigs Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/socialcrawlerconfigs',
      permissions: '*'
    }, {
      resources: '/api/socialcrawlerconfigs/:socialcrawlerconfigId',
      permissions: '*'
    }, {
      resources: '/api/socialcrawlerconfigs/numberrow',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/socialcrawlerconfigs',
      permissions: ['get', 'post']
    }, {
      resources: '/api/socialcrawlerconfigs/:socialcrawlerconfigId',
      permissions: ['get']
    }, {
      resources: '/api/socialcrawlerconfigs/numberrow',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/socialcrawlerconfigs',
      permissions: ['get']
    }, {
      resources: '/api/socialcrawlerconfigs/:socialcrawlerconfigId',
      permissions: ['get']
    }, {
      resources: '/api/socialcrawlerconfigs/numberrow',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Socialcrawlerconfigs Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Socialcrawlerconfig is being processed and the current user created it then allow any manipulation
  if (req.socialcrawlerconfig && req.user && req.socialcrawlerconfig.user && req.socialcrawlerconfig.user.id === req.user.id) {
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
