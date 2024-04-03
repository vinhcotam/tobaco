'use strict';

/**
 * Module dependencies
 */
var sentimentsPolicy = require('../policies/sentiments.server.policy'),
    sentiments = require('../controllers/sentiments.server.controller');

module.exports = function(app) {
  // sentiments Routes
  app.route('/api/sentiments').all(sentimentsPolicy.isAllowed)
    .get(sentiments.list)
    .post(sentiments.create);

  app.route('/api/sentiments/numberrow').all(sentimentsPolicy.isAllowed)
    .get(sentiments.count)

  app.route('/api/sentiments/:sentimentId').all(sentimentsPolicy.isAllowed)
    .get(sentiments.read)
    .put(sentiments.update)
    .delete(sentiments.delete);

  // Finish by binding the sentiments middleware
  app.param('sentimentId', sentiments.sentimentByID);
};
