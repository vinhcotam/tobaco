'use strict';

/**
 * Module dependencies
 */
var newsdailiesPolicy = require('../policies/newsdailies.server.policy'),
  newsdailies = require('../controllers/newsdailies.server.controller');

module.exports = function (app) {
  app.route('/api/newsdailies/forceDelete').post(newsdailies.forceDelete);
  // Newsdailies Routes
  app.route('/api/newsdailies').all(newsdailiesPolicy.isAllowed)
    .get(newsdailies.list)
    .post(newsdailies.create);

  app.route('/api/newsdailies/statistic').all(newsdailiesPolicy.isAllowed)// .all(newsdailiesPolicy.tokenAuth)
    .get(newsdailies.statistic);

  app.route('/api_m/newsdailies/statistic').all(newsdailiesPolicy.tokenAuth)
    .get(newsdailies.statistic);

  app.route('/api/newsdailies/numberrow').all(newsdailiesPolicy.isAllowed)
    .get(newsdailies.count);

  app.route('/api/newsdailies/count4topics').all(newsdailiesPolicy.isAllowed)
    .get(newsdailies.count4topics);

  app.route('/api/newsdailies/export').all(newsdailiesPolicy.isAllowed)
    .get(newsdailies.newsdailiesExport);

  app.route('/api/newsdailies/convertnewsgroup').all(newsdailiesPolicy.isAllowed)
    .get(newsdailies.convertnewsgroup);

  app.route('/api/newsdailies/statistic/groupnews').all(newsdailiesPolicy.isAllowed)
    .get(newsdailies.statisticbygroupnews);

  app.route('/api_m/newsdailies/statistic/groupnews').all(newsdailiesPolicy.tokenAuth)
    .get(newsdailies.statisticbygroupnews);

  app.route('/api/newsdailies/:newsdailyId').all(newsdailiesPolicy.isAllowed)
    .get(newsdailies.read)
    .put(newsdailies.update)
    .delete(newsdailies.delete);

  // Finish by binding the Newsdaily middleware
  app.param('newsdailyId', newsdailies.newsdailyByID);
};
