'use strict';

/**
 * Module dependencies
 */
var newsprivatesPolicy = require('../policies/newsprivates.server.policy'),
  newsprivates = require('../controllers/newsprivates.server.controller');

module.exports = function (app) {
  // Newsprivates Routes
  app.route('/api/newsprivates').all(newsprivatesPolicy.isAllowed)
    .get(newsprivates.list)
    .post(newsprivates.create);

  app.route('/api/newsprivates/numberrow').all(newsprivatesPolicy.isAllowed)
    .get(newsprivates.count);

  app.route('/api/newsprivates/:newsprivateId').all(newsprivatesPolicy.isAllowed)
    .get(newsprivates.read)
    .put(newsprivates.update)
    .delete(newsprivates.delete);

  app.route('/api/newsprivates/:newsprivateId/readnews').all(newsprivatesPolicy.isAllowed)
    .get(newsprivates.getFile);

  // Finish by binding the Newsprivate middleware
  app.param('newsprivateId', newsprivates.newsprivateByID);
};
