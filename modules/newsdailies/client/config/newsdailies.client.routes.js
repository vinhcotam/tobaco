(function () {
  'use strict';

  angular
    .module('newsdailies')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('newsdailies', {
        abstract: true,
        //url: '/newsdailies',
        url: '',
        template: '<ui-view/>'
      })
      .state('newsdailies.statistic', {
        url: '/newsdailies/statistic',
        templateUrl: '/modules/newsdailies/client/views/statistic-newsdailies.client.view.html',
        controller: 'NewsdailiesStatisticController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Newsdaily Statistic By Websites'
        }
      })
      .state('newsdailies.statisticbygroupnews', {
        url: '/newsdailies/statistic/groupnews',
        templateUrl: '/modules/newsdailies/client/views/statistic-groupnews-newsdailies.client.view.html',
        controller: 'NewsdailiesStatisticGroupNewsController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Newsdaily Statistic By Websites'
        }
      })
      .state('newsdailies.labeling', {
        url: '/newsdailies/:newsdailyId/labeling',
        templateUrl: '/modules/newsdailies/client/views/labeling-newsdailies.client.view.html',
        controller: 'LabelingnewsdailiesController',
        controllerAs: 'vm',
        resolve: {
          newsdailyResolve: getNewsdaily
        },
        data: {
          pageTitle: 'Labeling news'
        }
      })
      .state('newsdailies.list', {
        url: '/newsdailies',
        templateUrl: '/modules/newsdailies/client/views/list-newsdailies.client.view.html',
        controller: 'NewsdailiesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Newsdailies List'
        }
      })
      .state('newsdailies.create', {
        url: '/newsdailies/create',
        templateUrl: '/modules/newsdailies/client/views/form-newsdaily.client.view.html',
        controller: 'NewsdailiesController',
        controllerAs: 'vm',
        resolve: {
          newsdailyResolve: newNewsdaily
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Newsdailies Create'
        }
      })
      .state('newsdailies.edit', {
        url: '/newsdailies/:newsdailyId/edit',
        templateUrl: '/modules/newsdailies/client/views/form-newsdaily.client.view.html',
        controller: 'NewsdailiesController',
        controllerAs: 'vm',
        resolve: {
          newsdailyResolve: getNewsdaily
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Newsdaily {{ newsdailyResolve.name }}'
        }
      })
      .state('newsdailies.view', {
        url: '/newsdailies/:newsdailyId',
        templateUrl: '/modules/newsdailies/client/views/view-newsdaily.client.view.html',
        controller: 'NewsdailiesController',
        controllerAs: 'vm',
        resolve: {
          newsdailyResolve: getNewsdaily
        },
        data: {
          pageTitle: 'Newsdaily {{ newsdailyResolve.name }}'
        }
      });
  }

  getNewsdaily.$inject = ['$stateParams', 'NewsdailiesService'];

  function getNewsdaily($stateParams, NewsdailiesService) {
    return NewsdailiesService.get({
      newsdailyId: $stateParams.newsdailyId
    }).$promise;
  }

  newNewsdaily.$inject = ['NewsdailiesService'];

  function newNewsdaily(NewsdailiesService) {
    return new NewsdailiesService();
  }
}());
