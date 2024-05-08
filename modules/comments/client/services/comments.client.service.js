(function () {
  'use strict';

  angular
    .module('comments')
    .factory('CommentsService', CommentsService);

  CommentsService.$inject = ['$resource'];

  function CommentsService($resource) {
    var Comment = $resource('/api/comments/:commentId', {
      newsdailyId: '@_id' // Đảm bảo sử dụng 'commentId' thay vì 'newsdailyId'
    }, {
      update: {
        method: 'PUT', // Sử dụng phương thức POST thay vì PUT
        params: { commentId: '@_id' } // Đảm bảo sử dụng 'commentId' thay vì 'newsdailyId'
      },
      getTotal: {
        method: 'GET',
        url: '/api/comments/numberrow',
        isArray: true
      },
      getCommentsByNewsId: {
        method: 'GET',
        url: '/api/comments/numberrow',
        isArray: true
      },
      updateMany: {
        method: 'POST',
        url: '/api/comments/updateMany',
        isArray: true
      },
    });

    // Bổ sung phương thức createOrUpdate cho prototype của Comment
    angular.extend(Comment.prototype, {
      createOrUpdate: function () {
        var comment = this;
        return createOrUpdate(comment);
      }
    });

    return Comment;
  }
}());
