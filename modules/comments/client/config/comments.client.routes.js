(function () {
  'use strict';

  angular
    .module('comments')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('comments', {
        abstract: true,
        url: '/comments',
        template: '<ui-view/>'
      })
      .state('comments.list', {
        url: '',
        templateUrl: '/modules/comments/client/views/list-comments.client.view.html',
        controller: 'CommentsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Comments List'
        }
      })
      .state('comments.listByNewsId', {
        url: '/:newsId',
        templateUrl: '/modules/comments/client/views/list-comments.client.view.html',
        controller: 'CommentsListController',
        controllerAs: 'vm',
        params: {
          newsId: null,
          newsTitle: null,
          newsSummary: null
        },
        data: {
          pageTitle: 'Comments List'
        }
      })
      .state('comments.labeling_v2', {
        url: '/:newsId/labeling_v2',
        templateUrl: '/modules/comments/client/views/labeling-comments_v2.client.view.html',
        controller: 'Labelingv2commentsController',
        controllerAs: 'vm',
        resolve: {
          commentResolve: getCommentV1
        },
        data: {
          pageTitle: 'Labeling comments'
        }
      })
      .state('comments.labeling', {
        url: '/:newsId/labeling',
        templateUrl: '/modules/comments/client/views/labeling-comments.client.view.html',
        controller: 'LabelingcommentsController',
        controllerAs: 'vm',
        resolve: {
          commentResolve: getCommentV1
        },
        data: {
          pageTitle: 'Labeling comments'
        }
      })
      .state('comments.view', {
        url: 'view/:commentId',
        templateUrl: '/modules/comments/client/views/view-comments.client.view.html',
        controller: 'CommentsController',
        controllerAs: 'vm',
        resolve: {
          commentResolve: getComment
        },
        data: {
          pageTitle: 'Comment {{ commentResolve.name }}'
        }
      });
  }

  getComment.$inject = ['$stateParams', 'CommentsService'];
  getCommentV1.$inject = ['$stateParams', 'CommentsService'];
  function getCommentV1($stateParams, CommentsService) {
    return CommentsService.getCommentsByNewsId($stateParams.newsId);
  }

  function getComment($stateParams, CommentsService) {
    return CommentsService.get({
      commentId: $stateParams.commentId
    }).$promise;
  }

  newComment.$inject = ['CommentsService'];

  function newComment(CommentsService) {
    return new CommentsService();
  }
}());
