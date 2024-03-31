'use strict';

/**
 * Module dependencies
 */
var contentidentificationsPolicy = require('../policies/contentidentifications.server.policy'),
  contentidentifications = require('../controllers/contentidentifications.server.controller');

module.exports = function(app) {
  // Contentidentifications Routes
  app.route('/api/contentidentifications').all(contentidentificationsPolicy.isAllowed)
    .get(contentidentifications.list)
    .post(contentidentifications.create);

  app.route('/api/contentidentifications/:contentidentificationId').all(contentidentificationsPolicy.isAllowed)
    .get(contentidentifications.read)
    .put(contentidentifications.update)
    .delete(contentidentifications.delete);

  // Finish by binding the Contentidentification middleware
  app.param('contentidentificationId', contentidentifications.contentidentificationByID);
};
