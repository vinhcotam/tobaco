'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Newsgroups Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/newsgroups',
      permissions: '*'
    }, {
      resources: '/api/newsgroups/:newsgroupId',
      permissions: '*'
    }, {
      resources: '/api/newsgroups/numberrow',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/newsgroups',
      permissions: ['get', 'post']
    }, {
      resources: '/api/newsgroups/:newsgroupId',
      permissions: ['get']
    }, {
      resources: '/api/newsgroups/numberrow',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/newsgroups',
      permissions: ['get']
    }, {
      resources: '/api/newsgroups/:newsgroupId',
      permissions: ['get']
    }, {
      resources: '/api/newsgroups/numberrow',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Newsgroups Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Newsgroup is being processed and the current user created it then allow any manipulation
  if (req.newsgroup && req.user && req.newsgroup.user && req.newsgroup.user.id === req.user.id) {
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
