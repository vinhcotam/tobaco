'use strict';

/**
 * Module dependencies
 */
var crawlerconfigsPolicy = require('../policies/crawlerconfigs.server.policy'),
  crawlerconfigs = require('../controllers/crawlerconfigs.server.controller');

module.exports = function(app) {
  // Crawlerconfigs Routes
  app.route('/api/crawlerconfigs').all(crawlerconfigsPolicy.isAllowed)
    .get(crawlerconfigs.list)
    .post(crawlerconfigs.create);

  app.route('/api/crawlerconfigs/:crawlerconfigId').all(crawlerconfigsPolicy.isAllowed)
    .get(crawlerconfigs.read)
    .put(crawlerconfigs.update)
    .delete(crawlerconfigs.delete);
  
  app.route('/api/crawlerconfigs-fillter').get(crawlerconfigs.filter);

  // Finish by binding the Crawlerconfig middleware
  app.param('crawlerconfigId', crawlerconfigs.crawlerconfigByID);
};
