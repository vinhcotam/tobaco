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
      .state('comments.labeling', {
        url: '/comments/:newsId/labeling',
        templateUrl: '/modules/comments/client/views/labeling-comments.client.view.html',
        controller: 'LabelingcommentsController',
        controllerAs: 'vm',
        resolve: {
          commentResolve: getComment
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
