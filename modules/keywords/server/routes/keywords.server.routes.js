'use strict';

/**
 * Module dependencies
 */
var keywordsPolicy = require('../policies/keywords.server.policy'),
  keywords = require('../controllers/keywords.server.controller');

module.exports = function(app) {
  // Keywords Routes
  app.route('/api/keywords').all(keywordsPolicy.isAllowed)
    .get(keywords.list)
    .post(keywords.create);

  app.route('/api/keywords/numberrow').all(keywordsPolicy.isAllowed)
    .get(keywords.count)

  app.route('/api/keywords/:keywordId').all(keywordsPolicy.isAllowed)
    .get(keywords.read)
    .put(keywords.update)
    .delete(keywords.delete);

  // Finish by binding the Keyword middleware
  app.param('keywordId', keywords.keywordByID);
};
