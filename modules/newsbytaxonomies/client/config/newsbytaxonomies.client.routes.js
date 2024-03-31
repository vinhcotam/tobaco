(function () {
  'use strict';

  angular
    .module('newsbytaxonomies')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('newsbytaxonomies', {
        abstract: true,
        url: '/newsbytaxonomies',
        template: '<ui-view/>'
      })
      .state('newsbytaxonomies.list', {
        url: '',
        templateUrl: '/modules/newsbytaxonomies/client/views/list-newsbytaxonomies.client.view.html',
        controller: 'NewsbytaxonomiesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Newsbytaxonomies List'
        }
      })
      .state('newsbytaxonomies.statistictaxo', {
        url: '/newsbytaxonomies/statistic/taxonomy',
        templateUrl: '/modules/newsbytaxonomies/client/views/statistictaxo-newsbytaxonomies.client.view.html',
        controller: 'StatisticTaxoTreeviewController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Statistic by Taxonomies'
        },
        resolve: {
          //taxonomyResolve: getTaxonomy,
          //treeResolve: getTaxonomyTree
        }
      })
      .state('newsbytaxonomies.create', {
        url: '/create',
        templateUrl: '/modules/newsbytaxonomies/client/views/form-newsbytaxonomy.client.view.html',
        controller: 'NewsbytaxonomiesController',
        controllerAs: 'vm',
        resolve: {
          newsbytaxonomyResolve: newNewsbytaxonomy
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Newsbytaxonomies Create'
        }
      })
      .state('newsbytaxonomies.edit', {
        url: '/:newsbytaxonomyId/edit',
        templateUrl: '/modules/newsbytaxonomies/client/views/form-newsbytaxonomy.client.view.html',
        controller: 'NewsbytaxonomiesController',
        controllerAs: 'vm',
        resolve: {
          newsbytaxonomyResolve: getNewsbytaxonomy
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Newsbytaxonomy {{ newsbytaxonomyResolve.name }}'
        }
      })
      .state('newsbytaxonomies.view', {
        url: '/:newsbytaxonomyId',
        templateUrl: '/modules/newsbytaxonomies/client/views/view-newsbytaxonomy.client.view.html',
        controller: 'NewsbytaxonomiesController',
        controllerAs: 'vm',
        resolve: {
          newsbytaxonomyResolve: getNewsbytaxonomy
        },
        data: {
          pageTitle: 'Newsbytaxonomy {{ newsbytaxonomyResolve.name }}'
        }
      });
  }

  getNewsbytaxonomy.$inject = ['$stateParams', 'NewsbytaxonomiesService'];

  function getNewsbytaxonomy($stateParams, NewsbytaxonomiesService) {
    return NewsbytaxonomiesService.get({
      newsbytaxonomyId: $stateParams.newsbytaxonomyId
    }).$promise;
  }

  newNewsbytaxonomy.$inject = ['NewsbytaxonomiesService'];

  function newNewsbytaxonomy(NewsbytaxonomiesService) {
    return new NewsbytaxonomiesService();
  }
}());
