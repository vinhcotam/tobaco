(function () {
  'use strict';

  angular
    .module('topics')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('topics', {
        abstract: true,
        // url: '/topics',
        url: '',
        template: '<ui-view/>'
      })
      .state('topics.list', {
        url: '/topics',
        templateUrl: '/modules/topics/client/views/list-topics.client.view.html',
        controller: 'TopicsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Topics List'
        }
      })
      .state('topics.create', {
        url: '/topics/create',
        // url: '/create',
        templateUrl: '/modules/topics/client/views/form-topic.client.view.html',
        controller: 'TopicsController',
        controllerAs: 'vm',
        resolve: {
          topicResolve: newTopic
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Topics Create'
        }
      })
      .state('topics.edit', {
        // url: '/:topicId/edit',
        url: '/topics/:topicId/edit',
        templateUrl: '/modules/topics/client/views/form-topic.client.view.html',
        controller: 'TopicsController',
        controllerAs: 'vm',
        resolve: {
          topicResolve: getTopic
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Topic {{ topicResolve.name }}'
        }
      })
      .state('topics.view', {
        // url: '/:topicId',
        url: '/topics/:topicId',
        templateUrl: '/modules/topics/client/views/view-topic.client.view.html',
        controller: 'TopicsController',
        controllerAs: 'vm',
        resolve: {
          topicResolve: getTopic
        },
        data: {
          pageTitle: 'Topic {{ topicResolve.name }}'
        }
      });
  }

  getTopic.$inject = ['$stateParams', 'TopicsService'];

  function getTopic($stateParams, TopicsService) {
    return TopicsService.get({
      topicId: $stateParams.topicId
    }).$promise;
  }

  newTopic.$inject = ['TopicsService'];

  function newTopic(TopicsService) {
    return new TopicsService();
  }
}());
