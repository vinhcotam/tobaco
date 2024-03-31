'use strict';

/**
 * Module dependencies
 */
var activitylogsPolicy = require('../policies/activitylogs.server.policy'),
  activitylogs = require('../controllers/activitylogs.server.controller');

module.exports = function(app) {
  // Activitylogs Routes
  app.route('/api/activitylogs').all(activitylogsPolicy.isAllowed)
    .get(activitylogs.list)
    .post(activitylogs.create);

  app.route('/api/activitylogs/numberrow').all(activitylogsPolicy.isAllowed)
    .get(activitylogs.count)

  app.route('/api/activitylogs/:activitylogId').all(activitylogsPolicy.isAllowed)
    .get(activitylogs.read)
    .put(activitylogs.update)
    .delete(activitylogs.delete);

  // Finish by binding the Activitylog middleware
  app.param('activitylogId', activitylogs.activitylogByID);
};
