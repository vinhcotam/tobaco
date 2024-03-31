(function () {
  'use strict';

  angular
    .module('newsprivates')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('newsprivates', {
        abstract: true,
        //url: '/newsprivates',
        url: '',
        template: '<ui-view/>'
      })
      .state('newsprivates.list', {
        url: '/newsprivates',
        templateUrl: '/modules/newsprivates/client/views/list-newsprivates.client.view.html',
        controller: 'NewsprivatesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Newsprivates List'
        }
      })
      .state('newsprivates.create', {
        url: '/newsprivates/create',
        templateUrl: '/modules/newsprivates/client/views/form-newsprivate.client.view.html',
        controller: 'NewsprivatesController',
        controllerAs: 'vm',
        resolve: {
          newsprivateResolve: newNewsprivate
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Newsprivates Create'
        }
      })
      .state('newsprivates.edit', {
        url: '/newsprivates/:newsprivateId/edit',
        templateUrl: '/modules/newsprivates/client/views/form-newsprivate.client.view.html',
        controller: 'NewsprivatesController',
        controllerAs: 'vm',
        resolve: {
          newsprivateResolve: getNewsprivate
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Newsprivate {{ newsprivateResolve.name }}'
        }
      })
      .state('newsprivates.view', {
        url: '/newsprivates/:newsprivateId',
        templateUrl: '/modules/newsprivates/client/views/view-newsprivate.client.view.html',
        controller: 'NewsprivatesController',
        controllerAs: 'vm',
        resolve: {
          newsprivateResolve: getNewsprivate
        },
        data: {
          pageTitle: 'Newsprivate {{ newsprivateResolve.name }}'
        }
      });
  }

  getNewsprivate.$inject = ['$stateParams', 'NewsprivatesService'];

  function getNewsprivate($stateParams, NewsprivatesService) {
    return NewsprivatesService.get({
      newsprivateId: $stateParams.newsprivateId
    }).$promise;
  }

  newNewsprivate.$inject = ['NewsprivatesService'];

  function newNewsprivate(NewsprivatesService) {
    return new NewsprivatesService();
  }
}());
