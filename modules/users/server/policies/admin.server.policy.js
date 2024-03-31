'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());
const jwt = require('jsonwebtoken')
//const User = require('../models/User')
/**
 * Invoke Admin Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/users',
      permissions: '*'
    }, {
      resources: '/api/users/:userId',
      permissions: '*'
    }]
  }, {
      roles: ['manager'],
      allows: [{
        resources: '/api/users',
        permissions: '*'
      }, {
        resources: '/api/users/:userId',
        permissions: '*'
      }]
  }]);
};

/**
 * Check If Admin Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

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

/**
 * Check If API call with a token
 */
exports.tokenAuth = async (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '')
  const data = jwt.verify(token, process.env.JWT_KEY);
  const User = mongoose.model('User');
  try {
    const user = await User.findOne({ _id: data._id, 'tokens.token': token })
    if (!user) {
        throw new Error({error: 'Not authorized'})
    }
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
      res.status(401).send({ error: 'Not authorized to access this resource' })
  }

}
