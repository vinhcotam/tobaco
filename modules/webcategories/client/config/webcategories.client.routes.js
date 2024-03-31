(function () {
  'use strict';

  angular
    .module('webcategories')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('webcategories', {
        abstract: true,
        url: '/webcategories',
        template: '<ui-view/>'
      })
      .state('webcategories.list', {
        url: '',
        templateUrl: '/modules/webcategories/client/views/list-webcategories.client.view.html',
        controller: 'WebcategoriesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Webcategories List'
        }
      })
      .state('webcategories.create', {
        url: '/create',
        templateUrl: '/modules/webcategories/client/views/form-webcategory.client.view.html',
        controller: 'WebcategoriesController',
        controllerAs: 'vm',
        resolve: {
          webcategoryResolve: newWebcategory
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Webcategories Create'
        }
      })
      .state('webcategories.edit', {
        url: '/:webcategoryId/edit',
        templateUrl: '/modules/webcategories/client/views/form-webcategory.client.view.html',
        controller: 'WebcategoriesController',
        controllerAs: 'vm',
        resolve: {
          webcategoryResolve: getWebcategory
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Webcategory {{ webcategoryResolve.name }}'
        }
      })
      .state('webcategories.view', {
        url: '/:webcategoryId',
        templateUrl: '/modules/webcategories/client/views/view-webcategory.client.view.html',
        controller: 'WebcategoriesController',
        controllerAs: 'vm',
        resolve: {
          webcategoryResolve: getWebcategory
        },
        data: {
          pageTitle: 'Webcategory {{ webcategoryResolve.name }}'
        }
      });
  }

  getWebcategory.$inject = ['$stateParams', 'WebcategoriesService'];

  function getWebcategory($stateParams, WebcategoriesService) {
    return WebcategoriesService.get({
      webcategoryId: $stateParams.webcategoryId
    }).$promise;
  }

  newWebcategory.$inject = ['WebcategoriesService'];

  function newWebcategory(WebcategoriesService) {
    return new WebcategoriesService();
  }
}());
