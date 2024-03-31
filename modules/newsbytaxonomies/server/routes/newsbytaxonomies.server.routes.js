'use strict';

/**
 * Module dependencies
 */
var newsbytaxonomiesPolicy = require('../policies/newsbytaxonomies.server.policy'),
  newsbytaxonomies = require('../controllers/newsbytaxonomies.server.controller');

module.exports = function (app) {
  // Newsbytaxonomies Routes
  app.route('/api/newsbytaxonomies').all(newsbytaxonomiesPolicy.isAllowed)
    .get(newsbytaxonomies.list)
    .post(newsbytaxonomies.create);

  app.route('/api/newsbytaxonomies/statistic/taxonomy').all(newsbytaxonomiesPolicy.isAllowed)
    .get(newsbytaxonomies.statisticbytaxonomy);

  app.route('/api_m/newsbytaxonomies/statistic/taxonomy').all(newsbytaxonomiesPolicy.tokenAuth)
    .get(newsbytaxonomies.statisticbytaxonomy);

  app.route('/api/newsbytaxonomies/export2excel').all(newsbytaxonomiesPolicy.isAllowed)
    .get(newsbytaxonomies.export2Excel);

  app.route('/api/newsbytaxonomies/numberrow').all(newsbytaxonomiesPolicy.isAllowed)
    .get(newsbytaxonomies.count);

  app.route('/api/newsbytaxonomies/insertMany')// note missing permission
    .post(newsbytaxonomies.insertMany);

  app.route('/api/newsbytaxonomies/:newsbytaxonomyId').all(newsbytaxonomiesPolicy.isAllowed)
    .get(newsbytaxonomies.read)
    .put(newsbytaxonomies.update)
    .delete(newsbytaxonomies.delete);

  // Finish by binding the Newsbytaxonomy middleware
  app.param('newsbytaxonomyId', newsbytaxonomies.newsbytaxonomyByID);
};
