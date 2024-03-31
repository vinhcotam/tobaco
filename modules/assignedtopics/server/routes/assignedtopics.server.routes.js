'use strict';

/**
 * Module dependencies
 */
var assignedtopicsPolicy = require('../policies/assignedtopics.server.policy'),
  assignedtopics = require('../controllers/assignedtopics.server.controller');

module.exports = function(app) {
  // Assignedtopics Routes
  app.route('/api/assignedtopics').all(assignedtopicsPolicy.isAllowed)
    .get(assignedtopics.list)
    .post(assignedtopics.create);

  app.route('/api/assignedtopics/numberrow').all(assignedtopicsPolicy.isAllowed)
    .get(assignedtopics.count)

  app.route('/api/assignedtopics/statbyrole').all(assignedtopicsPolicy.isAllowed)
    .get(assignedtopics.countbyrole)

  app.route('/api/assignedtopics/:assignedtopicId').all(assignedtopicsPolicy.isAllowed)
    .get(assignedtopics.read)
    .put(assignedtopics.update)
    .delete(assignedtopics.delete);

  // Finish by binding the Assignedtopic middleware
  app.param('assignedtopicId', assignedtopics.assignedtopicByID);
};
