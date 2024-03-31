'use strict';

/**
 * Module dependencies
 */
var socialobjectactivitiesPolicy = require('../policies/socialobjectactivities.server.policy'),
  socialobjectactivities = require('../controllers/socialobjectactivities.server.controller');

module.exports = function(app) {
  // Socialobjectactivities Routes
  app.route('/api/socialobjectactivities').all(socialobjectactivitiesPolicy.isAllowed)
    .get(socialobjectactivities.list)
    .post(socialobjectactivities.create);

  app.route('/api/socialobjectactivities/numberrow').all(socialobjectactivitiesPolicy.isAllowed)
    .get(socialobjectactivities.count);

  app.route('/api/socialobjectactivities/:socialobjectactivityId').all(socialobjectactivitiesPolicy.isAllowed)
    .get(socialobjectactivities.read)
    .put(socialobjectactivities.update)
    .delete(socialobjectactivities.delete);

  // Finish by binding the Socialobjectactivity middleware
  app.param('socialobjectactivityId', socialobjectactivities.socialobjectactivityByID);
};
