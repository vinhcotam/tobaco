'use strict';

/**
 * Module dependencies
 */
var crawlerschedulesPolicy = require('../policies/crawlerschedules.server.policy'),
  crawlerschedules = require('../controllers/crawlerschedules.server.controller');

module.exports = function(app) {
  // Crawlerschedules Routes
  app.route('/api/crawlerschedules').all(crawlerschedulesPolicy.isAllowed)
    .get(crawlerschedules.list)
    .post(crawlerschedules.create);

  app.route('/api/crawlerschedules/:crawlerscheduleId').all(crawlerschedulesPolicy.isAllowed)
    .get(crawlerschedules.read)
    .put(crawlerschedules.update)
    .delete(crawlerschedules.delete);

  // Finish by binding the Crawlerschedule middleware
  app.param('crawlerscheduleId', crawlerschedules.crawlerscheduleByID);
};
