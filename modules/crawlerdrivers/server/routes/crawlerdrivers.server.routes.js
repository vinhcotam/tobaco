'use strict';

/**
 * Module dependencies
 */
var crawlerdriversPolicy = require('../policies/crawlerdrivers.server.policy'),
  crawlerdrivers = require('../controllers/crawlerdrivers.server.controller');

module.exports = function(app) {
  // Crawlerdrivers Routes
  app.route('/api/crawlerdrivers').all(crawlerdriversPolicy.isAllowed)
    .get(crawlerdrivers.list)
    .post(crawlerdrivers.create);

  app.route('/api/crawlerdrivers/:crawlerdriverId').all(crawlerdriversPolicy.isAllowed)
    .get(crawlerdrivers.read)
    .put(crawlerdrivers.update)
    .delete(crawlerdrivers.delete);

  // Finish by binding the Crawlerdriver middleware
  app.param('crawlerdriverId', crawlerdrivers.crawlerdriverByID);
};
