(function () {
  'use strict';

  angular
    .module('newsgroups')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('newsgroups', {
        abstract: true,
        url: '/newsgroups',
        template: '<ui-view/>'
      })
      .state('newsgroups.list', {
        url: '',
        templateUrl: '/modules/newsgroups/client/views/list-newsgroups.client.view.html',
        controller: 'NewsgroupsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Newsgroups List'
        }
      })
      .state('newsgroups.create', {
        url: '/create',
        templateUrl: '/modules/newsgroups/client/views/form-newsgroup.client.view.html',
        controller: 'NewsgroupsController',
        controllerAs: 'vm',
        resolve: {
          newsgroupResolve: newNewsgroup
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Newsgroups Create'
        }
      })
      .state('newsgroups.edit', {
        url: '/:newsgroupId/edit',
        templateUrl: '/modules/newsgroups/client/views/form-newsgroup.client.view.html',
        controller: 'NewsgroupsController',
        controllerAs: 'vm',
        resolve: {
          newsgroupResolve: getNewsgroup
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Newsgroup {{ newsgroupResolve.name }}'
        }
      })
      .state('newsgroups.view', {
        url: '/:newsgroupId',
        templateUrl: '/modules/newsgroups/client/views/view-newsgroup.client.view.html',
        controller: 'NewsgroupsController',
        controllerAs: 'vm',
        resolve: {
          newsgroupResolve: getNewsgroup
        },
        data: {
          pageTitle: 'Newsgroup {{ newsgroupResolve.name }}'
        }
      });
  }

  getNewsgroup.$inject = ['$stateParams', 'NewsgroupsService'];

  function getNewsgroup($stateParams, NewsgroupsService) {
    return NewsgroupsService.get({
      newsgroupId: $stateParams.newsgroupId
    }).$promise;
  }

  newNewsgroup.$inject = ['NewsgroupsService'];

  function newNewsgroup(NewsgroupsService) {
    return new NewsgroupsService();
  }
}());
