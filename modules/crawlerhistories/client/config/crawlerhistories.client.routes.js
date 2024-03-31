(function () {
  'use strict';

  angular
    .module('crawlerhistories')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('crawlerhistories', {
        abstract: true,
        url: '/crawlerhistories',
        template: '<ui-view/>'
      })
      .state('crawlerhistories.list', {
        url: '',
        templateUrl: '/modules/crawlerhistories/client/views/list-crawlerhistories.client.view.html',
        controller: 'CrawlerhistoriesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Crawlerhistories List'
        }
      })
      .state('crawlerhistories.create', {
        url: '/create',
        templateUrl: '/modules/crawlerhistories/client/views/form-crawlerhistory.client.view.html',
        controller: 'CrawlerhistoriesController',
        controllerAs: 'vm',
        resolve: {
          crawlerhistoryResolve: newCrawlerhistory
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Crawlerhistories Create'
        }
      })
      .state('crawlerhistories.edit', {
        url: '/:crawlerhistoryId/edit',
        templateUrl: '/modules/crawlerhistories/client/views/form-crawlerhistory.client.view.html',
        controller: 'CrawlerhistoriesController',
        controllerAs: 'vm',
        resolve: {
          crawlerhistoryResolve: getCrawlerhistory
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Crawlerhistory {{ crawlerhistoryResolve.name }}'
        }
      })
      .state('crawlerhistories.view', {
        url: '/:crawlerhistoryId',
        templateUrl: '/modules/crawlerhistories/client/views/view-crawlerhistory.client.view.html',
        controller: 'CrawlerhistoriesController',
        controllerAs: 'vm',
        resolve: {
          crawlerhistoryResolve: getCrawlerhistory
        },
        data: {
          pageTitle: 'Crawlerhistory {{ crawlerhistoryResolve.name }}'
        }
      });
  }

  getCrawlerhistory.$inject = ['$stateParams', 'CrawlerhistoriesService'];

  function getCrawlerhistory($stateParams, CrawlerhistoriesService) {
    return CrawlerhistoriesService.get({
      crawlerhistoryId: $stateParams.crawlerhistoryId
    }).$promise;
  }

  newCrawlerhistory.$inject = ['CrawlerhistoriesService'];

  function newCrawlerhistory(CrawlerhistoriesService) {
    return new CrawlerhistoriesService();
  }
}());
