(function () {
  'use strict';

  angular
    .module('crawlerconfigs')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('crawlerconfigs', {
        abstract: true,
        url: '/crawlerconfigs',
        template: '<ui-view/>'
      })
      .state('crawlerconfigs.list', {
        url: '',
        templateUrl: '/modules/crawlerconfigs/client/views/list-crawlerconfigs.client.view.html',
        controller: 'CrawlerconfigsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Crawlerconfigs List'
        }
      })
      .state('crawlerconfigs.create', {
        url: '/create',
        templateUrl: '/modules/crawlerconfigs/client/views/form-crawlerconfig.client.view.html',
        controller: 'CrawlerconfigsController',
        controllerAs: 'vm',
        resolve: {
          crawlerconfigResolve: newCrawlerconfig
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Crawlerconfigs Create'
        }
      })
      .state('crawlerconfigs.edit', {
        url: '/:crawlerconfigId/edit',
        templateUrl: '/modules/crawlerconfigs/client/views/form-crawlerconfig.client.view.html',
        controller: 'CrawlerconfigsController',
        controllerAs: 'vm',
        resolve: {
          crawlerconfigResolve: getCrawlerconfig
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Crawlerconfig {{ crawlerconfigResolve.name }}'
        }
      })
      .state('crawlerconfigs.view', {
        url: '/:crawlerconfigId',
        templateUrl: '/modules/crawlerconfigs/client/views/view-crawlerconfig.client.view.html',
        controller: 'CrawlerconfigsController',
        controllerAs: 'vm',
        resolve: {
          crawlerconfigResolve: getCrawlerconfig
        },
        data: {
          pageTitle: 'Crawlerconfig'
        }
      });
  }

  getCrawlerconfig.$inject = ['$stateParams', 'CrawlerconfigsService'];

  function getCrawlerconfig($stateParams, CrawlerconfigsService) {
    return CrawlerconfigsService.get({
      crawlerconfigId: $stateParams.crawlerconfigId
    }).$promise;
  }

  newCrawlerconfig.$inject = ['CrawlerconfigsService'];

  function newCrawlerconfig(CrawlerconfigsService) {
    return new CrawlerconfigsService();
  }
}());
