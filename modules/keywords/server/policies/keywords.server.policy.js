'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Keywords Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/keywords',
      permissions: '*'
    }, {
      resources: '/api/keywords/:keywordId',
      permissions: '*'
    }, {
      resources: '/api/keywords/numberrow',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/keywords',
      permissions: ['get', 'post']
    }, {
      resources: '/api/keywords/:keywordId',
      permissions: ['get']
    }, {
      resources: '/api/keywords/numberrow',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/keywords',
      permissions: ['get']
    }, {
      resources: '/api/keywords/:keywordId',
      permissions: ['get']
    }, {
      resources: '/api/keywords/numberrow',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Keywords Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Keyword is being processed and the current user created it then allow any manipulation
  if (req.keyword && req.user && req.keyword.user && req.keyword.user.id === req.user.id) {
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
