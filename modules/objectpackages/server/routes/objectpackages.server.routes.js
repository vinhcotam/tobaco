'use strict';

/**
 * Module dependencies
 */
var objectpackagesPolicy = require('../policies/objectpackages.server.policy'),
  objectpackages = require('../controllers/objectpackages.server.controller');

module.exports = function (app) {
  // Objectpackages Routes
  app.route('/api/objectpackages').all(objectpackagesPolicy.isAllowed)
    .get(objectpackages.list)
    .post(objectpackages.create);

  app.route('/api/objectpackages/numberrow').all(objectpackagesPolicy.isAllowed)
    .get(objectpackages.count);

  app.route('/api/objectpackages/:objectpackageId').all(objectpackagesPolicy.isAllowed)
    .get(objectpackages.read)
    .put(objectpackages.update)
    .delete(objectpackages.delete);

  // Finish by binding the Objectpackage middleware
  app.param('objectpackageId', objectpackages.objectpackageByID);
};
