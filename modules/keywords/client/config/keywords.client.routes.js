(function () {
  'use strict';

  angular
    .module('keywords')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('keywords', {
        abstract: true,
        url: '/keywords',
        template: '<ui-view/>'
      })
      .state('keywords.list', {
        url: '',
        templateUrl: '/modules/keywords/client/views/list-keywords.client.view.html',
        controller: 'KeywordsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Keywords List'
        }
      })
      .state('keywords.create', {
        url: '/create',
        templateUrl: '/modules/keywords/client/views/form-keyword.client.view.html',
        controller: 'KeywordsController',
        controllerAs: 'vm',
        resolve: {
          keywordResolve: newKeyword
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Keywords Create'
        }
      })
      .state('keywords.edit', {
        url: '/:keywordId/edit',
        templateUrl: '/modules/keywords/client/views/form-keyword.client.view.html',
        controller: 'KeywordsController',
        controllerAs: 'vm',
        resolve: {
          keywordResolve: getKeyword
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Keyword {{ keywordResolve.name }}'
        }
      })
      .state('keywords.view', {
        url: '/:keywordId',
        templateUrl: '/modules/keywords/client/views/view-keyword.client.view.html',
        controller: 'KeywordsController',
        controllerAs: 'vm',
        resolve: {
          keywordResolve: getKeyword
        },
        data: {
          pageTitle: 'Keyword {{ keywordResolve.name }}'
        }
      });
  }

  getKeyword.$inject = ['$stateParams', 'KeywordsService'];

  function getKeyword($stateParams, KeywordsService) {
    return KeywordsService.get({
      keywordId: $stateParams.keywordId
    }).$promise;
  }

  newKeyword.$inject = ['KeywordsService'];

  function newKeyword(KeywordsService) {
    return new KeywordsService();
  }
}());
