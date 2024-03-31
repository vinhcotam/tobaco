(function () {
  'use strict';

  angular
    .module('websites')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('websites', {
        abstract: true,
        /* url: '/websites',*/
        url: '',
        template: '<ui-view/>'
      })
      .state('websites.list', {
        url: '/websites',
        templateUrl: '/modules/websites/client/views/list-websites.client.view.html',
        controller: 'WebsitesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Websites List'
        }
      })
      .state('websites.create', {
        url: '/websites/create',
        templateUrl: '/modules/websites/client/views/form-website.client.view.html',
        controller: 'WebsitesController',
        controllerAs: 'vm',
        resolve: {
          websiteResolve: newWebsite
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Websites Create'
        }
      })
      .state('websites.edit', {
        url: '/websites/:websiteId/edit',
        templateUrl: '/modules/websites/client/views/form-website.client.view.html',
        controller: 'WebsitesController',
        controllerAs: 'vm',
        resolve: {
          websiteResolve: getWebsite
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Website'
        }
      })
      .state('websites.view', {
        url: '/websites/:websiteId',
        templateUrl: '/modules/websites/client/views/view-website.client.view.html',
        controller: 'WebsitesController',
        controllerAs: 'vm',
        resolve: {
          websiteResolve: getWebsite
        },
        data: {
          pageTitle: 'Website {{ websiteResolve.name }}'
        }
      });
  }

  getWebsite.$inject = ['$stateParams', 'WebsitesService'];

  function getWebsite($stateParams, WebsitesService) {
    return WebsitesService.get({
      websiteId: $stateParams.websiteId
    }).$promise;
  }

  newWebsite.$inject = ['WebsitesService'];

  function newWebsite(WebsitesService) {
    return new WebsitesService();
  }
}());
