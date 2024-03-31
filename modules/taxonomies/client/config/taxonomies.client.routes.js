(function () {
  'use strict';

  angular
    .module('taxonomies')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('taxonomies', {
        abstract: true,
        //url: '/taxonomies',
        url: '',
        template: '<ui-view/>'
      })
      .state('taxonomies.list', {
        url: '/taxonomies',
        templateUrl: '/modules/taxonomies/client/views/list-taxonomies.client.view.html',
        controller: 'TaxonomiesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Taxonomies List'
        }
      })
      .state('taxonomies.treeview', {
        url: '/taxonomies/:taxonomyId/treeview',
        templateUrl: '/modules/taxonomies/client/views/treeview-taxonomies.client.view.html',
        controller: 'TaxonomiesTreeviewController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Taxonomies Treeview'
        },
        resolve: {
          taxonomyResolve: getTaxonomy,
          treeResolve: getTaxonomyTree
        }
      })
      .state('taxonomies.create', {
        url: '/taxonomies/create',
        templateUrl: '/modules/taxonomies/client/views/form-taxonomy.client.view.html',
        controller: 'TaxonomiesController',
        controllerAs: 'vm',
        resolve: {
          taxonomyResolve: newTaxonomy
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Taxonomies Create'
        }
      })
      .state('taxonomies.edit', {
        url: '/taxonomies/:taxonomyId/edit',
        templateUrl: '/modules/taxonomies/client/views/form-taxonomy.client.view.html',
        controller: 'TaxonomiesController',
        controllerAs: 'vm',
        resolve: {
          taxonomyResolve: getTaxonomy
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Taxonomy {{ taxonomyResolve.name }}'
        }
      })
      .state('taxonomies.createleaf', {
        url: '/taxonomies/:taxonomyId/create',
        templateUrl: '/modules/taxonomies/client/views/form-taxonomy.client.view.html',
        controller: 'TaxonomiesController',
        controllerAs: 'vm',
        resolve: {
          taxonomyResolve: getTaxonomy
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Create Taxonomy {{ taxonomyResolve.name }}'
        }
      })
      .state('taxonomies.view', {
        url: '/taxonomies/:taxonomyId',
        templateUrl: '/modules/taxonomies/client/views/view-taxonomy.client.view.html',
        controller: 'TaxonomiesController',
        controllerAs: 'vm',
        resolve: {
          taxonomyResolve: getTaxonomy
        },
        data: {
          pageTitle: 'Taxonomy {{ taxonomyResolve.name }}'
        }
      });
  }

  getTaxonomy.$inject = ['$stateParams', 'TaxonomiesService'];

  function getTaxonomy($stateParams, TaxonomiesService) {
    return TaxonomiesService.get({
      taxonomyId: $stateParams.taxonomyId
    }).$promise;
  }

  getTaxonomyTree.$inject = ['$stateParams', 'TaxonomiesTreeService'];

  function getTaxonomyTree($stateParams, TaxonomiesTreeService) {
    return TaxonomiesTreeService.get({
      taxonomyId: $stateParams.taxonomyId
    }).$promise;
  }

  newTaxonomy.$inject = ['TaxonomiesService'];

  function newTaxonomy(TaxonomiesService) {
    return new TaxonomiesService();
  }
}());
