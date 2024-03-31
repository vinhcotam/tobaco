'use strict';

/**
 * Module dependencies
 */
var keyinformantsPolicy = require('../policies/keyinformants.server.policy'),
  keyinformants = require('../controllers/keyinformants.server.controller');

module.exports = function(app) {
  // Keyinformants Routes
  app.route('/api/keyinformants').all(keyinformantsPolicy.isAllowed)
    .get(keyinformants.list)
    .post(keyinformants.create);

  app.route('/api/keyinformants/numberrow').all(keyinformantsPolicy.isAllowed)
    .get(keyinformants.count);

  app.route('/api/keyinformants/:keyinformantId').all(keyinformantsPolicy.isAllowed)
    .get(keyinformants.read)
    .put(keyinformants.update)
    .delete(keyinformants.delete);

  // Finish by binding the Keyinformant middleware
  app.param('keyinformantId', keyinformants.keyinformantByID);
};
