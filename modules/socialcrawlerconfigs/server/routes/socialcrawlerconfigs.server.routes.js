'use strict';

/**
 * Module dependencies
 */
var socialcrawlerconfigsPolicy = require('../policies/socialcrawlerconfigs.server.policy'),
  socialcrawlerconfigs = require('../controllers/socialcrawlerconfigs.server.controller');

module.exports = function (app) {
  // Socialcrawlerconfigs Routes
  app.route('/api/socialcrawlerconfigs').all(socialcrawlerconfigsPolicy.isAllowed)
    .get(socialcrawlerconfigs.list)
    .post(socialcrawlerconfigs.create);

  app.route('/api/socialcrawlerconfigs/numberrow').all(socialcrawlerconfigsPolicy.isAllowed)
    .get(socialcrawlerconfigs.count);

  app.route('/api/socialcrawlerconfigs/:socialcrawlerconfigId').all(socialcrawlerconfigsPolicy.isAllowed)
    .get(socialcrawlerconfigs.read)
    .put(socialcrawlerconfigs.update)
    .delete(socialcrawlerconfigs.delete);

  // Finish by binding the Socialcrawlerconfig middleware
  app.param('socialcrawlerconfigId', socialcrawlerconfigs.socialcrawlerconfigByID);
};
