'use strict';

/**
 * Module dependencies
 */
var monitoringtypesPolicy = require('../policies/monitoringtypes.server.policy'),
  monitoringtypes = require('../controllers/monitoringtypes.server.controller');

module.exports = function(app) {
  // Monitoringtypes Routes
  app.route('/api/monitoringtypes').all(monitoringtypesPolicy.isAllowed)
    .get(monitoringtypes.list)
    .post(monitoringtypes.create);

  app.route('/api/monitoringtypes/numberrow').all(monitoringtypesPolicy.isAllowed)
    .get(monitoringtypes.count)

  app.route('/api/monitoringtypes/:monitoringtypeId').all(monitoringtypesPolicy.isAllowed)
    .get(monitoringtypes.read)
    .put(monitoringtypes.update)
    .delete(monitoringtypes.delete);

  // Finish by binding the Monitoringtype middleware
  app.param('monitoringtypeId', monitoringtypes.monitoringtypeByID);
};
