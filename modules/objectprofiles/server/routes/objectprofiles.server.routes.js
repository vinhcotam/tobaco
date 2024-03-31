'use strict';

/**
 * Module dependencies
 */
var objectprofilesPolicy = require('../policies/objectprofiles.server.policy'),
  objectprofiles = require('../controllers/objectprofiles.server.controller');

module.exports = function(app) {
  // Objectprofiles Routes
  app.route('/api/objectprofiles').all(objectprofilesPolicy.isAllowed)
    .get(objectprofiles.list)
    .post(objectprofiles.create);

  app.route('/api/objectprofiles/numberrow').all(objectprofilesPolicy.isAllowed)
    .get(objectprofiles.count)

  app.route('/api/objectprofiles/:objectprofileId').all(objectprofilesPolicy.isAllowed)
    .get(objectprofiles.read)
    .put(objectprofiles.update)
    .delete(objectprofiles.delete);

  // Finish by binding the Objectprofile middleware
  app.param('objectprofileId', objectprofiles.objectprofileByID);
};
