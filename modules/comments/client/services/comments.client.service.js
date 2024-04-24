// comments service used to communicate comments REST endpoints
(function () {
  'use strict';

  angular
    .module('comments')
    .factory('CommentsService', CommentsService);

  CommentsService.$inject = ['$resource'];

  function CommentsService($resource) {
    var Comment = $resource('/api/comments/:commentId', {
      newsdailyId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      getTotal: {
        method: 'GET',
        url: '/api/comments/numberrow',
        isArray: true
      }
    });
    angular.extend(Comment.prototype, {
      createOrUpdate: function () {
        var comment = this;
        return createOrUpdate(comment);
      }
    });

    return Comment;
  }
}());
