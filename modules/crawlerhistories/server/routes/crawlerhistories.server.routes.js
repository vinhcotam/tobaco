'use strict';

/**
 * Module dependencies
 */
var crawlerhistoriesPolicy = require('../policies/crawlerhistories.server.policy'),
  crawlerhistories = require('../controllers/crawlerhistories.server.controller');

module.exports = function(app) {
  // Crawlerhistories Routes
  app.route('/api/crawlerhistories').all(crawlerhistoriesPolicy.isAllowed)
    .get(crawlerhistories.list)
    .post(crawlerhistories.create);

  app.route('/api/crawlerhistories/:crawlerhistoryId').all(crawlerhistoriesPolicy.isAllowed)
    .get(crawlerhistories.read)
    .put(crawlerhistories.update)
    .delete(crawlerhistories.delete);

  // Finish by binding the Crawlerhistory middleware
  app.param('crawlerhistoryId', crawlerhistories.crawlerhistoryByID);
};
