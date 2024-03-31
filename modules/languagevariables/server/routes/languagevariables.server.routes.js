'use strict';

/**
 * Module dependencies
 */
var languagevariablesPolicy = require('../policies/languagevariables.server.policy'),
  languagevariables = require('../controllers/languagevariables.server.controller');

module.exports = function(app) {
  // Languagevariables Routes
  app.route('/api/languagevariables').all(languagevariablesPolicy.isAllowed)
    .get(languagevariables.list)
    .post(languagevariables.create);

  app.route('/api/languagevariables/numberrow').all(languagevariablesPolicy.isAllowed)
    .get(languagevariables.count)
  app.route('/api/languagevariables/getbytopic').all(languagevariablesPolicy.isAllowed)
    .get(languagevariables.getbytopic)

  app.route('/api/languagevariables/:languagevariableId').all(languagevariablesPolicy.isAllowed)
    .get(languagevariables.read)
    .put(languagevariables.update)
    .delete(languagevariables.delete);

  // Finish by binding the Languagevariable middleware
  app.param('languagevariableId', languagevariables.languagevariableByID);
};
