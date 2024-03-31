(function () {
  'use strict';

  angular
    .module('monitoringtypes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('monitoringtypes', {
        abstract: true,
        url: '/monitoringtypes',
        template: '<ui-view/>'
      })
      .state('monitoringtypes.list', {
        url: '',
        templateUrl: '/modules/monitoringtypes/client/views/list-monitoringtypes.client.view.html',
        controller: 'MonitoringtypesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Monitoringtypes List'
        }
      })
      .state('monitoringtypes.create', {
        url: '/create',
        templateUrl: '/modules/monitoringtypes/client/views/form-monitoringtype.client.view.html',
        controller: 'MonitoringtypesController',
        controllerAs: 'vm',
        resolve: {
          monitoringtypeResolve: newMonitoringtype
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Monitoringtypes Create'
        }
      })
      .state('monitoringtypes.edit', {
        url: '/:monitoringtypeId/edit',
        templateUrl: '/modules/monitoringtypes/client/views/form-monitoringtype.client.view.html',
        controller: 'MonitoringtypesController',
        controllerAs: 'vm',
        resolve: {
          monitoringtypeResolve: getMonitoringtype
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Monitoringtype {{ monitoringtypeResolve.name }}'
        }
      })
      .state('monitoringtypes.view', {
        url: '/:monitoringtypeId',
        templateUrl: '/modules/monitoringtypes/client/views/view-monitoringtype.client.view.html',
        controller: 'MonitoringtypesController',
        controllerAs: 'vm',
        resolve: {
          monitoringtypeResolve: getMonitoringtype
        },
        data: {
          pageTitle: 'Monitoringtype {{ monitoringtypeResolve.name }}'
        }
      });
  }

  getMonitoringtype.$inject = ['$stateParams', 'MonitoringtypesService'];

  function getMonitoringtype($stateParams, MonitoringtypesService) {
    return MonitoringtypesService.get({
      monitoringtypeId: $stateParams.monitoringtypeId
    }).$promise;
  }

  newMonitoringtype.$inject = ['MonitoringtypesService'];

  function newMonitoringtype(MonitoringtypesService) {
    return new MonitoringtypesService();
  }
}());
