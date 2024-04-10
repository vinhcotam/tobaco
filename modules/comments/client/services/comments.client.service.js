// comments service used to communicate comments REST endpoints
(function () {
  'use strict';

  angular
    .module('comments')
    .factory('CommentsService', CommentsService);

  CommentsService.$inject = ['$resource'];

  function CommentsService($resource) {
    return $resource('/api/comments/:commentId', {
      commentId: '@_id'
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
  }
}());
