(function () {
  'use strict';

  angular
    .module('crawlerdrivers')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('crawlerdrivers', {
        abstract: true,
        url: '/crawlerdrivers',
        template: '<ui-view/>'
      })
      .state('crawlerdrivers.list', {
        url: '',
        templateUrl: '/modules/crawlerdrivers/client/views/list-crawlerdrivers.client.view.html',
        controller: 'CrawlerdriversListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Crawlerdrivers List'
        }
      })
      .state('crawlerdrivers.create', {
        url: '/create',
        templateUrl: '/modules/crawlerdrivers/client/views/form-crawlerdriver.client.view.html',
        controller: 'CrawlerdriversController',
        controllerAs: 'vm',
        resolve: {
          crawlerdriverResolve: newCrawlerdriver
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Crawlerdrivers Create'
        }
      })
      .state('crawlerdrivers.edit', {
        url: '/:crawlerdriverId/edit',
        templateUrl: '/modules/crawlerdrivers/client/views/form-crawlerdriver.client.view.html',
        controller: 'CrawlerdriversController',
        controllerAs: 'vm',
        resolve: {
          crawlerdriverResolve: getCrawlerdriver
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Crawlerdriver {{ crawlerdriverResolve.name }}'
        }
      })
      .state('crawlerdrivers.view', {
        url: '/crawlerdrivers/:crawlerdriverId',
        templateUrl: '/modules/crawlerdrivers/client/views/view-crawlerdriver.client.view.html',
        controller: 'CrawlerdriversController',
        controllerAs: 'vm',
        resolve: {
          crawlerdriverResolve: getCrawlerdriver
        },
        data: {
          pageTitle: 'Crawlerdriver {{ crawlerdriverResolve.name }}'
        }
      });
  }

  getCrawlerdriver.$inject = ['$stateParams', 'CrawlerdriversService'];

  function getCrawlerdriver($stateParams, CrawlerdriversService) {
    return CrawlerdriversService.get({
      crawlerdriverId: $stateParams.crawlerdriverId
    }).$promise;
  }

  newCrawlerdriver.$inject = ['CrawlerdriversService'];

  function newCrawlerdriver(CrawlerdriversService) {
    return new CrawlerdriversService();
  }
}());
