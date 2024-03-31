'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Assignedtopics Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/assignedtopics',
      permissions: '*'
    }, {
      resources: '/api/assignedtopics/:assignedtopicId',
      permissions: '*'
    }, {
      resources: '/api/assignedtopics/numberrow',
      permissions: '*'
    }, {
      resources: '/api/assignedtopics/statbyrole',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/assignedtopics',
      permissions: '*'
      //permissions: ['get', 'post']
    }, {
      resources: '/api/assignedtopics/:assignedtopicId',
      //permissions: ['get']
      permissions: '*'
    }, {
      resources: '/api/assignedtopics/numberrow',
      permissions: ['get']
    }, {
      resources: '/api/assignedtopics/statbyrole',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/assignedtopics',
      permissions: ['get']
    }, {
      resources: '/api/assignedtopics/:assignedtopicId',
      permissions: ['get']
    }, {
      resources: '/api/assignedtopics/numberrow',
      permissions: ['get']
    }, {
      resources: '/api/assignedtopics/statbyrole',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Assignedtopics Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Assignedtopic is being processed and the current user created it then allow any manipulation
  if (req.assignedtopic && req.user && req.assignedtopic.user && req.assignedtopic.user.id === req.user.id) {
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
