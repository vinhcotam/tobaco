'use strict';

/**
 * Module dependencies
 */
var websitesPolicy = require('../policies/websites.server.policy'),
  websites = require('../controllers/websites.server.controller');

module.exports = function (app) {
  // Websites Routes
  app.route('/api/websites').all(websitesPolicy.isAllowed)
    .get(websites.list)
    .post(websites.create);

  app.route('/api/websites/numberrow').all(websitesPolicy.isAllowed)
    .get(websites.count);

  app.route('/api/websites/export').all(websitesPolicy.isAllowed)
    .get(websites.websitesExport);

  app.route('/api/websites/:websiteId').all(websitesPolicy.isAllowed)
    .get(websites.read)
    .put(websites.update)
    .delete(websites.delete);

  // Finish by binding the Website middleware
  app.param('websiteId', websites.websiteByID);
};
