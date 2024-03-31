(function () {
  'use strict';

  angular
    .module('objectpackages')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('objectpackages', {
        abstract: true,
        url: '/objectpackages',
        template: '<ui-view/>'
      })
      .state('objectpackages.list', {
        url: '',
        templateUrl: '/modules/objectpackages/client/views/list-objectpackages.client.view.html',
        controller: 'ObjectpackagesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Objectpackages List'
        }
      })
      .state('objectpackages.create', {
        url: '/create',
        templateUrl: '/modules/objectpackages/client/views/form-objectpackage.client.view.html',
        controller: 'ObjectpackagesController',
        controllerAs: 'vm',
        resolve: {
          objectpackageResolve: newObjectpackage
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Objectpackages Create'
        }
      })
      .state('objectpackages.edit', {
        url: '/:objectpackageId/edit',
        templateUrl: '/modules/objectpackages/client/views/form-objectpackage.client.view.html',
        controller: 'ObjectpackagesController',
        controllerAs: 'vm',
        resolve: {
          objectpackageResolve: getObjectpackage
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Objectpackage {{ objectpackageResolve.name }}'
        }
      })
      .state('objectpackages.view', {
        url: '/:objectpackageId',
        templateUrl: '/modules/objectpackages/client/views/view-objectpackage.client.view.html',
        controller: 'ObjectpackagesController',
        controllerAs: 'vm',
        resolve: {
          objectpackageResolve: getObjectpackage
        },
        data: {
          pageTitle: 'Objectpackage {{ objectpackageResolve.name }}'
        }
      });
  }

  getObjectpackage.$inject = ['$stateParams', 'ObjectpackagesService'];

  function getObjectpackage($stateParams, ObjectpackagesService) {
    return ObjectpackagesService.get({
      objectpackageId: $stateParams.objectpackageId
    }).$promise;
  }

  newObjectpackage.$inject = ['ObjectpackagesService'];

  function newObjectpackage(ObjectpackagesService) {
    return new ObjectpackagesService();
  }
}());
