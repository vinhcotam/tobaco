'use strict';

/**
 * Module dependencies
 */
var statisticsPolicy = require('../policies/statistics.server.policy'),
  statistics = require('../controllers/statistics.server.controller');

module.exports = function(app) {
  // Statistics Routes
  app.route('/api/statistics').all(statisticsPolicy.isAllowed)
    .get(statistics.list)
    .post(statistics.create);

  app.route('/api/statistics/:statisticId').all(statisticsPolicy.isAllowed)
    .get(statistics.read)
    .put(statistics.update)
    .delete(statistics.delete);

  // Finish by binding the Statistic middleware
  app.param('statisticId', statistics.statisticByID);
};
