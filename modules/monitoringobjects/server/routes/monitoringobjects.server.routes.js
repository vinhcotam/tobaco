'use strict';

/**
 * Module dependencies
 */
var monitoringobjectsPolicy = require('../policies/monitoringobjects.server.policy'),
  monitoringobjects = require('../controllers/monitoringobjects.server.controller');

module.exports = function(app) {
  // Monitoringobjects Routes
  app.route('/api/monitoringobjects').all(monitoringobjectsPolicy.isAllowed)
    .get(monitoringobjects.list)
    .post(monitoringobjects.create);

  app.route('/api/monitoringobjects/numberrow').all(monitoringobjectsPolicy.isAllowed)
    .get(monitoringobjects.count)

  app.route('/api/monitoringobjects/:monitoringobjectId').all(monitoringobjectsPolicy.isAllowed)
    .get(monitoringobjects.read)
    .put(monitoringobjects.update)
    .delete(monitoringobjects.delete);

  // Finish by binding the Monitoringobject middleware
  app.param('monitoringobjectId', monitoringobjects.monitoringobjectByID);
};
