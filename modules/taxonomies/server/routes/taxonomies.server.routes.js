'use strict';

/**
 * Module dependencies
 */
var taxonomiesPolicy = require('../policies/taxonomies.server.policy'),
  taxonomies = require('../controllers/taxonomies.server.controller');

module.exports = function (app) {

  app.route('/api/taxonomies/treebytopic').all(taxonomiesPolicy.isAllowed)
    .get(taxonomies.treebytopic);

  app.route('/api_m/taxonomies/treebytopic').all(taxonomiesPolicy.tokenAuth)
    .get(taxonomies.treebytopic);

  app.route('/api/taxonomies/treeview').all(taxonomiesPolicy.isAllowed)
    .get(taxonomies.tree);

  // Taxonomies Routes
  app.route('/api/taxonomies').all(taxonomiesPolicy.isAllowed)
    .get(taxonomies.list)
    .post(taxonomies.create)
    .put(taxonomies.createleaf);

  app.route('/api/taxonomies/:taxonomyId').all(taxonomiesPolicy.isAllowed)
    .get(taxonomies.read)
    .put(taxonomies.update)
    .delete(taxonomies.delete);

  app.route('/api/taxonomies/:taxonomyId/treeview').all(taxonomiesPolicy.isAllowed)
    .get(taxonomies.tree);

  app.route('/api/taxonomies/:taxonomyId/clone').all(taxonomiesPolicy.isAllowed)
    .get(taxonomies.clone);

  // Finish by binding the Taxonomy middleware
  app.param('taxonomyId', taxonomies.taxonomyByID);
};
