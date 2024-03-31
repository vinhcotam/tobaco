(function () {
  'use strict';

  angular
    .module('objectprofiles')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('objectprofiles', {
        abstract: true,
        url: '/objectprofiles',
        template: '<ui-view/>'
      })
      .state('objectprofiles.list', {
        url: '',
        templateUrl: '/modules/objectprofiles/client/views/list-objectprofiles.client.view.html',
        controller: 'ObjectprofilesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Objectprofiles List'
        }
      })
      .state('objectprofiles.create', {
        url: '/create',
        templateUrl: '/modules/objectprofiles/client/views/form-objectprofile.client.view.html',
        controller: 'ObjectprofilesController',
        controllerAs: 'vm',
        resolve: {
          objectprofileResolve: newObjectprofile
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Objectprofiles Create'
        }
      })
      .state('objectprofiles.edit', {
        url: '/:objectprofileId/edit',
        templateUrl: '/modules/objectprofiles/client/views/form-objectprofile.client.view.html',
        controller: 'ObjectprofilesController',
        controllerAs: 'vm',
        resolve: {
          objectprofileResolve: getObjectprofile
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Objectprofile {{ objectprofileResolve.name }}'
        }
      })
      .state('objectprofiles.view', {
        url: '/:objectprofileId',
        templateUrl: '/modules/objectprofiles/client/views/view-objectprofile.client.view.html',
        controller: 'ObjectprofilesController',
        controllerAs: 'vm',
        resolve: {
          objectprofileResolve: getObjectprofile
        },
        data: {
          pageTitle: 'Objectprofile {{ objectprofileResolve.name }}'
        }
      });
  }

  getObjectprofile.$inject = ['$stateParams', 'ObjectprofilesService'];

  function getObjectprofile($stateParams, ObjectprofilesService) {
    return ObjectprofilesService.get({
      objectprofileId: $stateParams.objectprofileId
    }).$promise;
  }

  newObjectprofile.$inject = ['ObjectprofilesService'];

  function newObjectprofile(ObjectprofilesService) {
    return new ObjectprofilesService();
  }
}());
