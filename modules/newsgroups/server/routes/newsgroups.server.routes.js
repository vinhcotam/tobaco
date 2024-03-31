'use strict';

/**
 * Module dependencies
 */
var newsgroupsPolicy = require('../policies/newsgroups.server.policy'),
  newsgroups = require('../controllers/newsgroups.server.controller');

module.exports = function (app) {
  // Newsgroups Routes
  app.route('/api/newsgroups').all(newsgroupsPolicy.isAllowed)
    .get(newsgroups.list)
    .post(newsgroups.create);

  app.route('/api/newsgroups/numberrow').all(newsgroupsPolicy.isAllowed)
    .get(newsgroups.count);

  app.route('/api/newsgroups/:newsgroupId').all(newsgroupsPolicy.isAllowed)
    .get(newsgroups.read)
    .put(newsgroups.update)
    .delete(newsgroups.delete);

  // Finish by binding the Newsgroup middleware
  app.param('newsgroupId', newsgroups.newsgroupByID);
};
