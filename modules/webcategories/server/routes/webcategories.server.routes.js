'use strict';

/**
 * Module dependencies
 */
var webcategoriesPolicy = require('../policies/webcategories.server.policy'),
  webcategories = require('../controllers/webcategories.server.controller');

module.exports = function (app) {
  // Webcategories Routes
  app.route('/api/webcategories').all(webcategoriesPolicy.isAllowed)
    .get(webcategories.list)
    .post(webcategories.create);

  app.route('/api/webcategories/:webcategoryId').all(webcategoriesPolicy.isAllowed)
    .get(webcategories.read)
    .put(webcategories.update)
    .delete(webcategories.delete);

  // Finish by binding the Webcategory middleware
  app.param('webcategoryId', webcategories.webcategoryByID);
};
