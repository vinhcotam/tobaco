(function () {
  'use strict';

  angular
    .module('keyinformants')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('keyinformants', {
        abstract: true,
        url: '/keyinformants',
        template: '<ui-view/>'
      })
      .state('keyinformants.list', {
        url: '',
        templateUrl: '/modules/keyinformants/client/views/list-keyinformants.client.view.html',
        controller: 'KeyinformantsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Keyinformants List'
        }
      })
      .state('keyinformants.create', {
        url: '/create',
        templateUrl: '/modules/keyinformants/client/views/form-keyinformant.client.view.html',
        controller: 'KeyinformantsController',
        controllerAs: 'vm',
        resolve: {
          keyinformantResolve: newKeyinformant
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Keyinformants Create'
        }
      })
      .state('keyinformants.edit', {
        url: '/:keyinformantId/edit',
        templateUrl: '/modules/keyinformants/client/views/form-keyinformant.client.view.html',
        controller: 'KeyinformantsController',
        controllerAs: 'vm',
        resolve: {
          keyinformantResolve: getKeyinformant
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Keyinformant {{ keyinformantResolve.name }}'
        }
      })
      .state('keyinformants.view', {
        url: '/:keyinformantId',
        templateUrl: '/modules/keyinformants/client/views/view-keyinformant.client.view.html',
        controller: 'KeyinformantsController',
        controllerAs: 'vm',
        resolve: {
          keyinformantResolve: getKeyinformant
        },
        data: {
          pageTitle: 'Keyinformant {{ keyinformantResolve.name }}'
        }
      });
  }

  getKeyinformant.$inject = ['$stateParams', 'KeyinformantsService'];

  function getKeyinformant($stateParams, KeyinformantsService) {
    return KeyinformantsService.get({
      keyinformantId: $stateParams.keyinformantId
    }).$promise;
  }

  newKeyinformant.$inject = ['KeyinformantsService'];

  function newKeyinformant(KeyinformantsService) {
    return new KeyinformantsService();
  }
}());
