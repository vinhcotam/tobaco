(function () {
  'use strict';

  angular
    .module('monitoringobjects')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('monitoringobjects', {
        abstract: true,
        url: '/monitoringobjects',
        template: '<ui-view/>'
      })
      .state('monitoringobjects.list', {
        url: '',
        templateUrl: '/modules/monitoringobjects/client/views/list-monitoringobjects.client.view.html',
        controller: 'MonitoringobjectsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Monitoringobjects List'
        }
      })
      .state('monitoringobjects.create', {
        url: '/create',
        templateUrl: '/modules/monitoringobjects/client/views/form-monitoringobject.client.view.html',
        controller: 'MonitoringobjectsController',
        controllerAs: 'vm',
        resolve: {
          monitoringobjectResolve: newMonitoringobject
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Monitoringobjects Create'
        }
      })
      .state('monitoringobjects.edit', {
        url: '/:monitoringobjectId/edit',
        templateUrl: '/modules/monitoringobjects/client/views/form-monitoringobject.client.view.html',
        controller: 'MonitoringobjectsController',
        controllerAs: 'vm',
        resolve: {
          monitoringobjectResolve: getMonitoringobject
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Monitoringobject {{ monitoringobjectResolve.name }}'
        }
      })
      .state('monitoringobjects.view', {
        url: '/:monitoringobjectId',
        templateUrl: '/modules/monitoringobjects/client/views/view-monitoringobject.client.view.html',
        controller: 'MonitoringobjectsController',
        controllerAs: 'vm',
        resolve: {
          monitoringobjectResolve: getMonitoringobject
        },
        data: {
          pageTitle: 'Monitoringobject {{ monitoringobjectResolve.name }}'
        }
      });
  }

  getMonitoringobject.$inject = ['$stateParams', 'MonitoringobjectsService'];

  function getMonitoringobject($stateParams, MonitoringobjectsService) {
    return MonitoringobjectsService.get({
      monitoringobjectId: $stateParams.monitoringobjectId
    }).$promise;
  }

  newMonitoringobject.$inject = ['MonitoringobjectsService'];

  function newMonitoringobject(MonitoringobjectsService) {
    return new MonitoringobjectsService();
  }
}());
