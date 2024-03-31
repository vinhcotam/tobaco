(function () {
  'use strict';

  angular
    .module('crawlerschedules')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('crawlerschedules', {
        abstract: true,
        url: '/crawlerschedules',
        template: '<ui-view/>'
      })
      .state('crawlerschedules.list', {
        url: '',
        templateUrl: '/modules/crawlerschedules/client/views/list-crawlerschedules.client.view.html',
        controller: 'CrawlerschedulesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Crawlerschedules List'
        }
      })
      .state('crawlerschedules.create', {
        url: '/create',
        templateUrl: '/modules/crawlerschedules/client/views/form-crawlerschedule.client.view.html',
        controller: 'CrawlerschedulesController',
        controllerAs: 'vm',
        resolve: {
          crawlerscheduleResolve: newCrawlerschedule
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Crawlerschedules Create'
        }
      })
      .state('crawlerschedules.edit', {
        url: '/:crawlerscheduleId/edit',
        templateUrl: '/modules/crawlerschedules/client/views/form-crawlerschedule.client.view.html',
        controller: 'CrawlerschedulesController',
        controllerAs: 'vm',
        resolve: {
          crawlerscheduleResolve: getCrawlerschedule
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Crawlerschedule {{ crawlerscheduleResolve.name }}'
        }
      })
      .state('crawlerschedules.view', {
        url: '/:crawlerscheduleId',
        templateUrl: '/modules/crawlerschedules/client/views/view-crawlerschedule.client.view.html',
        controller: 'CrawlerschedulesController',
        controllerAs: 'vm',
        resolve: {
          crawlerscheduleResolve: getCrawlerschedule
        },
        data: {
          pageTitle: 'Crawlerschedule {{ crawlerscheduleResolve.name }}'
        }
      });
  }

  getCrawlerschedule.$inject = ['$stateParams', 'CrawlerschedulesService'];

  function getCrawlerschedule($stateParams, CrawlerschedulesService) {
    return CrawlerschedulesService.get({
      crawlerscheduleId: $stateParams.crawlerscheduleId
    }).$promise;
  }

  newCrawlerschedule.$inject = ['CrawlerschedulesService'];

  function newCrawlerschedule(CrawlerschedulesService) {
    return new CrawlerschedulesService();
  }
}());
