(function () {
  'use strict';

  angular
    .module('languagevariables')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('languagevariables', {
        abstract: true,
        url: '/languagevariables',
        template: '<ui-view/>'
      })
      .state('languagevariables.list', {
        url: '',
        templateUrl: '/modules/languagevariables/client/views/list-languagevariables.client.view.html',
        controller: 'LanguagevariablesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Languagevariables List'
        }
      })
      .state('languagevariables.create', {
        url: '/create',
        templateUrl: '/modules/languagevariables/client/views/form-languagevariable.client.view.html',
        controller: 'LanguagevariablesController',
        controllerAs: 'vm',
        resolve: {
          languagevariableResolve: newLanguagevariable
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Languagevariables Create'
        }
      })
      .state('languagevariables.edit', {
        url: '/:languagevariableId/edit',
        templateUrl: '/modules/languagevariables/client/views/form-languagevariable.client.view.html',
        controller: 'LanguagevariablesController',
        controllerAs: 'vm',
        resolve: {
          languagevariableResolve: getLanguagevariable
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Languagevariable {{ languagevariableResolve.name }}'
        }
      })
      .state('languagevariables.view', {
        url: '/:languagevariableId',
        templateUrl: '/modules/languagevariables/client/views/view-languagevariable.client.view.html',
        controller: 'LanguagevariablesController',
        controllerAs: 'vm',
        resolve: {
          languagevariableResolve: getLanguagevariable
        },
        data: {
          pageTitle: 'Languagevariable {{ languagevariableResolve.name }}'
        }
      });
  }

  getLanguagevariable.$inject = ['$stateParams', 'LanguagevariablesService'];

  function getLanguagevariable($stateParams, LanguagevariablesService) {
    return LanguagevariablesService.get({
      languagevariableId: $stateParams.languagevariableId
    }).$promise;
  }

  newLanguagevariable.$inject = ['LanguagevariablesService'];

  function newLanguagevariable(LanguagevariablesService) {
    return new LanguagevariablesService();
  }
}());
