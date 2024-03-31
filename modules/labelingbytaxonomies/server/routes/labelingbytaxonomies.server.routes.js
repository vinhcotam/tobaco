'use strict';

/**
 * Module dependencies
 */
var labelingbytaxonomiesPolicy = require('../policies/labelingbytaxonomies.server.policy'),
  labelingbytaxonomies = require('../controllers/labelingbytaxonomies.server.controller');

module.exports = function(app) {
  // Labelingbytaxonomies Routes
  app.route('/api/labelingbytaxonomies').all(labelingbytaxonomiesPolicy.isAllowed)
    .get(labelingbytaxonomies.list)
    .post(labelingbytaxonomies.create);

  app.route('/api/labelingbytaxonomies/statisticbyargument').all(labelingbytaxonomiesPolicy.isAllowed)
    .get(labelingbytaxonomies.statisticbyargument);

  app.route('/api_m/labelingbytaxonomies/statisticbyargument').all(labelingbytaxonomiesPolicy.tokenAuth)
    .get(labelingbytaxonomies.statisticbyargument);

  app.route('/api/labelingbytaxonomies/numberrow').all(labelingbytaxonomiesPolicy.isAllowed)
    .get(labelingbytaxonomies.count);

  app.route('/api/labelingbytaxonomies/export').all(labelingbytaxonomiesPolicy.isAllowed)
    .get(labelingbytaxonomies.labelingbytaxonomyExport);

  app.route('/api/labelingbytaxonomies/checkingEditOrRemove').all(labelingbytaxonomiesPolicy.isAllowed)
    .get(labelingbytaxonomies.checkingEditOrRemove);
  
    // Todo define policy for user
  app.route('/api/labelingbytaxonomies/insertOrUpdate').post(labelingbytaxonomies.insertOrUpdate);
  app.route('/api/labelingbytaxonomies/removeMany').post(labelingbytaxonomies.removeMany);

  app.route('/api/labelingbytaxonomies/:labelingbytaxonomyId').all(labelingbytaxonomiesPolicy.isAllowed)
    .get(labelingbytaxonomies.read)
    .put(labelingbytaxonomies.update)
    .delete(labelingbytaxonomies.delete);

  // Finish by binding the Labelingbytaxonomy middleware
  app.param('labelingbytaxonomyId', labelingbytaxonomies.labelingbytaxonomyByID);
};
