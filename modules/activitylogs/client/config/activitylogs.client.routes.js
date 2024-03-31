(function () {
  'use strict';

  angular
    .module('activitylogs')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('activitylogs', {
        abstract: true,
        url: '/activitylogs',
        template: '<ui-view/>'
      })
      .state('activitylogs.list', {
        url: '',
        templateUrl: '/modules/activitylogs/client/views/list-activitylogs.client.view.html',
        controller: 'ActivitylogsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Activitylogs List'
        }
      })
      .state('activitylogs.create', {
        url: '/create',
        templateUrl: '/modules/activitylogs/client/views/form-activitylog.client.view.html',
        controller: 'ActivitylogsController',
        controllerAs: 'vm',
        resolve: {
          activitylogResolve: newActivitylog
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Activitylogs Create'
        }
      })
      .state('activitylogs.edit', {
        url: '/:activitylogId/edit',
        templateUrl: '/modules/activitylogs/client/views/form-activitylog.client.view.html',
        controller: 'ActivitylogsController',
        controllerAs: 'vm',
        resolve: {
          activitylogResolve: getActivitylog
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Activitylog {{ activitylogResolve.name }}'
        }
      })
      .state('activitylogs.view', {
        url: '/:activitylogId',
        templateUrl: '/modules/activitylogs/client/views/view-activitylog.client.view.html',
        controller: 'ActivitylogsController',
        controllerAs: 'vm',
        resolve: {
          activitylogResolve: getActivitylog
        },
        data: {
          pageTitle: 'Activitylog {{ activitylogResolve.name }}'
        }
      });
  }

  getActivitylog.$inject = ['$stateParams', 'ActivitylogsService'];

  function getActivitylog($stateParams, ActivitylogsService) {
    return ActivitylogsService.get({
      activitylogId: $stateParams.activitylogId
    }).$promise;
  }

  newActivitylog.$inject = ['ActivitylogsService'];

  function newActivitylog(ActivitylogsService) {
    return new ActivitylogsService();
  }
}());
