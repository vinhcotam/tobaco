'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Newsprivates Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/newsprivates',
      permissions: '*'
    }, {
      resources: '/api/newsprivates/:newsprivateId',
      permissions: '*'
    }, {
      resources: '/api/newsprivates/:newsprivateId/readnews',
      permissions: ['get']
    }, {
      resources: '/api/newsprivates/numberrow',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/newsprivates',
      permissions: ['get', 'post']
    }, {
      resources: '/api/newsprivates/:newsprivateId',
      // permissions: ['get']
      permissions: '*'
    }, {
      resources: '/api/newsprivates/:newsprivateId/readnews',
      permissions: ['get']
    }, {
      resources: '/api/newsprivates/numberrow',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/newsprivates',
      permissions: ['get']
    }, {
      resources: '/api/newsprivates/:newsprivateId',
      permissions: ['get']
    }, {
      resources: '/api/newsprivates/numberrow',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Newsprivates Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Newsprivate is being processed and the current user created it then allow any manipulation
  if (req.newsprivate && req.user && req.newsprivate.user && req.newsprivate.user.id === req.user.id) {
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
