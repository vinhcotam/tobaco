(function () {
  'use strict';

  angular
    .module('socialobjectactivities')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('socialobjectactivities', {
        abstract: true,
        url: '/socialobjectactivities',
        template: '<ui-view/>'
      })
      .state('socialobjectactivities.list', {
        url: '',
        templateUrl: '/modules/socialobjectactivities/client/views/list-socialobjectactivities.client.view.html',
        controller: 'SocialobjectactivitiesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Socialobjectactivities List'
        }
      })
      .state('socialobjectactivities.wordcloud', {
        url: '/wordcloud',
        templateUrl: '/modules/socialobjectactivities/client/views/view-socialobjectactivity-world-cloud.client.view.html',
        controller: 'WordCloudController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Word Cloud'
        }
      })
      .state('socialobjectactivities.create', {
        url: '/create',
        templateUrl: '/modules/socialobjectactivities/client/views/form-socialobjectactivity.client.view.html',
        controller: 'SocialobjectactivitiesController',
        controllerAs: 'vm',
        resolve: {
          socialobjectactivityResolve: newSocialobjectactivity
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Socialobjectactivities Create'
        }
      })
      .state('socialobjectactivities.edit', {
        url: '/:socialobjectactivityId/edit',
        templateUrl: '/modules/socialobjectactivities/client/views/form-socialobjectactivity.client.view.html',
        controller: 'SocialobjectactivitiesController',
        controllerAs: 'vm',
        resolve: {
          socialobjectactivityResolve: getSocialobjectactivity
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Socialobjectactivity {{ socialobjectactivityResolve.name }}'
        }
      })
      .state('socialobjectactivities.view', {
        url: '/:socialobjectactivityId',
        templateUrl: '/modules/socialobjectactivities/client/views/view-socialobjectactivity.client.view.html',
        controller: 'SocialobjectactivitiesController',
        controllerAs: 'vm',
        resolve: {
          socialobjectactivityResolve: getSocialobjectactivity
        },
        data: {
          pageTitle: 'Socialobjectactivity {{ socialobjectactivityResolve.name }}'
        }
      });
  }

  getSocialobjectactivity.$inject = ['$stateParams', 'SocialobjectactivitiesService'];

  function getSocialobjectactivity($stateParams, SocialobjectactivitiesService) {
    return SocialobjectactivitiesService.get({
      socialobjectactivityId: $stateParams.socialobjectactivityId
    }).$promise;
  }

  newSocialobjectactivity.$inject = ['SocialobjectactivitiesService'];

  function newSocialobjectactivity(SocialobjectactivitiesService) {
    return new SocialobjectactivitiesService();
  }
}());
