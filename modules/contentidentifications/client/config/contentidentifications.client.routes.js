(function () {
  'use strict';

  angular
    .module('contentidentifications')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('contentidentifications', {
        abstract: true,
        // url: '/contentidentifications',
        url: '',
        template: '<ui-view/>'
      })
      .state('contentidentifications.list', {
        url: '/contentidentifications',
        templateUrl: '/modules/contentidentifications/client/views/list-contentidentifications.client.view.html',
        controller: 'ContentidentificationsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Contentidentifications List'
        }
      })
      .state('contentidentifications.create', {
        url: '/contentidentifications/create',
        templateUrl: '/modules/contentidentifications/client/views/form-contentidentification.client.view.html',
        controller: 'ContentidentificationsController',
        controllerAs: 'vm',
        resolve: {
          contentidentificationResolve: newContentidentification
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Contentidentifications Create'
        }
      })
      .state('contentidentifications.edit', {
        url: '/contentidentifications/:contentidentificationId/edit',
        templateUrl: '/modules/contentidentifications/client/views/form-contentidentification.client.view.html',
        controller: 'ContentidentificationsController',
        controllerAs: 'vm',
        resolve: {
          contentidentificationResolve: getContentidentification
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Contentidentification {{ contentidentificationResolve.name }}'
        }
      })
      .state('contentidentifications.view', {
        url: '/contentidentifications/:contentidentificationId',
        templateUrl: '/modules/contentidentifications/client/views/view-contentidentification.client.view.html',
        controller: 'ContentidentificationsController',
        controllerAs: 'vm',
        resolve: {
          contentidentificationResolve: getContentidentification
        },
        data: {
          pageTitle: 'Contentidentification {{ contentidentificationResolve.name }}'
        }
      });
  }

  getContentidentification.$inject = ['$stateParams', 'ContentidentificationsService'];

  function getContentidentification($stateParams, ContentidentificationsService) {
    return ContentidentificationsService.get({
      contentidentificationId: $stateParams.contentidentificationId
    }).$promise;
  }

  newContentidentification.$inject = ['ContentidentificationsService'];

  function newContentidentification(ContentidentificationsService) {
    return new ContentidentificationsService();
  }
}());
