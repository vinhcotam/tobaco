(function () {
  'use strict';

  angular
    .module('socialcrawlerconfigs')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('socialcrawlerconfigs', {
        abstract: true,
        url: '/socialcrawlerconfigs',
        template: '<ui-view/>'
      })
      .state('socialcrawlerconfigs.list', {
        url: '',
        templateUrl: '/modules/socialcrawlerconfigs/client/views/list-socialcrawlerconfigs.client.view.html',
        controller: 'SocialcrawlerconfigsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Socialcrawlerconfigs List'
        }
      })
      .state('socialcrawlerconfigs.create', {
        url: '/create',
        templateUrl: '/modules/socialcrawlerconfigs/client/views/form-socialcrawlerconfig.client.view.html',
        controller: 'SocialcrawlerconfigsController',
        controllerAs: 'vm',
        resolve: {
          socialcrawlerconfigResolve: newSocialcrawlerconfig
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Socialcrawlerconfigs Create'
        }
      })
      .state('socialcrawlerconfigs.edit', {
        url: '/:socialcrawlerconfigId/edit',
        templateUrl: '/modules/socialcrawlerconfigs/client/views/form-socialcrawlerconfig.client.view.html',
        controller: 'SocialcrawlerconfigsController',
        controllerAs: 'vm',
        resolve: {
          socialcrawlerconfigResolve: getSocialcrawlerconfig
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Socialcrawlerconfig {{ socialcrawlerconfigResolve.name }}'
        }
      })
      .state('socialcrawlerconfigs.view', {
        url: '/:socialcrawlerconfigId',
        templateUrl: '/modules/socialcrawlerconfigs/client/views/view-socialcrawlerconfig.client.view.html',
        controller: 'SocialcrawlerconfigsController',
        controllerAs: 'vm',
        resolve: {
          socialcrawlerconfigResolve: getSocialcrawlerconfig
        },
        data: {
          pageTitle: 'Socialcrawlerconfig {{ socialcrawlerconfigResolve.name }}'
        }
      });
  }

  getSocialcrawlerconfig.$inject = ['$stateParams', 'SocialcrawlerconfigsService'];

  function getSocialcrawlerconfig($stateParams, SocialcrawlerconfigsService) {
    return SocialcrawlerconfigsService.get({
      socialcrawlerconfigId: $stateParams.socialcrawlerconfigId
    }).$promise;
  }

  newSocialcrawlerconfig.$inject = ['SocialcrawlerconfigsService'];

  function newSocialcrawlerconfig(SocialcrawlerconfigsService) {
    return new SocialcrawlerconfigsService();
  }
}());
