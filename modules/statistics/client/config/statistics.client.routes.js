(function () {
  'use strict';

  angular
    .module('statistics')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('statistics', {
        abstract: true,
        url: '/statistics',
        template: '<ui-view/>'
      })
      .state('statistics.list', {
        url: '',
        templateUrl: 'modules/statistics/client/views/list-statistics.client.view.html',
        controller: 'StatisticsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Statistics List'
        }
      })
      .state('statistics.create', {
        url: '/create',
        templateUrl: 'modules/statistics/client/views/form-statistic.client.view.html',
        controller: 'StatisticsController',
        controllerAs: 'vm',
        resolve: {
          statisticResolve: newStatistic
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Statistics Create'
        }
      })
      .state('statistics.edit', {
        url: '/:statisticId/edit',
        templateUrl: 'modules/statistics/client/views/form-statistic.client.view.html',
        controller: 'StatisticsController',
        controllerAs: 'vm',
        resolve: {
          statisticResolve: getStatistic
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Statistic {{ statisticResolve.name }}'
        }
      })
      .state('statistics.view', {
        url: '/:statisticId',
        templateUrl: 'modules/statistics/client/views/view-statistic.client.view.html',
        controller: 'StatisticsController',
        controllerAs: 'vm',
        resolve: {
          statisticResolve: getStatistic
        },
        data: {
          pageTitle: 'Statistic {{ statisticResolve.name }}'
        }
      });
  }

  getStatistic.$inject = ['$stateParams', 'StatisticsService'];

  function getStatistic($stateParams, StatisticsService) {
    return StatisticsService.get({
      statisticId: $stateParams.statisticId
    }).$promise;
  }

  newStatistic.$inject = ['StatisticsService'];

  function newStatistic(StatisticsService) {
    return new StatisticsService();
  }
}());
