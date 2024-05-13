(function () {
  'use strict';

  angular
    .module('comments')
    .factory('CommentsService', CommentsService)
    .factory('CommentsAllService', CommentsAllService)
    .factory('LabelingbysentimentsStatisticService', LabelingbysentimentsStatisticService);

  CommentsService.$inject = ['$resource'];
  LabelingbysentimentsStatisticService.$inject = ['$resource'];
  function CommentsService($resource) {
    var Comment = $resource('/api/comments/:commentId', {
      newsdailyId: '@_id'
    }, {
      update: {
        method: 'PUT',
        params: { commentId: '@_id' }
      },
      getTotal: {
        method: 'GET',
        url: '/api/comments/numberrow',
        isArray: true
      },
      getAllComments: {
        method: 'GET',
        url: '/api/comments/all',
        isArray: true
      }
      ,
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

    angular.extend(Comment.prototype, {
      createOrUpdate: function () {
        var comment = this;
        return createOrUpdate(comment);
      }
    });

    return Comment;
  }
  function CommentsAllService($resource) {
    var Comment = $resource('/api/comments/:commentId', {
        commentId: '@_id'
    }, {
        update: {
            method: 'PUT',
            params: { commentId: '@_id' }
        },
        getAllComments: {
            method: 'GET',
            url: '/api/comments/',
            isArray: true // Thay đổi thành false nếu server trả về một đối tượng
        },
        getTotal: {
            method: 'GET',
            url: '/api/comments/numberrow',
            isArray: true
        },
        updateMany: {
            method: 'POST',
            url: '/api/comments/updateMany',
            isArray: true
        }
    });

    return Comment;
}


  function LabelingbysentimentsStatisticService($resource) {
    return $resource('/api/comments/statisticbysentiment', {
      newsdailyId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
