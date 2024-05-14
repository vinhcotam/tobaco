'use strict';

/**
 * Module dependencies
 */
var { EventEmitter } = require('events');
var eventEmitter = new EventEmitter();
const SSE = require('express-sse');
var sse = new SSE(["array", "containing", "initial", "content", "(optional)"]);

var commentsPolicy = require('../policies/comments.server.policy'),
  comments = require('../controllers/comments.server.controller');

module.exports = function (app) {
  // comments Routes
  app.route('/api/comments').all(commentsPolicy.isAllowed)
    .get(comments.list)
    .post(comments.create);

  app.route('/api/comments/numberrow').all(commentsPolicy.isAllowed)
    .get(comments.count)

  app.route('/api/comments/:commentId').all(commentsPolicy.isAllowed)
    .get(comments.read)
    .put(comments.update)
    .delete(comments.delete);

    app.locals.sse = sse;

    // Đường dẫn SSE
    app.get('/sse', sse.init);




  // Finish by binding the comments middleware
  app.param('commentId', comments.commentByID);

};
