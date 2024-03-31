(function () {
  'use strict';

  angular
    .module('labelingbytaxonomies')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('labelingbytaxonomies', {
        abstract: true,
        url: '/labelingbytaxonomies',
        template: '<ui-view/>'
      })
      .state('labelingbytaxonomies.statisticbygroupnews', {
        url: '/labelingbytaxonomies/statistic/argument',
        templateUrl: '/modules/labelingbytaxonomies/client/views/statisticargu-labelingbytaxonomies.client.view.html',
        controller: 'LabelingbytaxonomiesStatisticArguController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Statistic by Arguments'
        }
      })
      .state('labelingbytaxonomies.list', {
        url: '',
        templateUrl: '/modules/labelingbytaxonomies/client/views/list-labelingbytaxonomies.client.view.html',
        controller: 'LabelingbytaxonomiesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Labelingbytaxonomies List'
        }
      })
      .state('labelingbytaxonomies.create', {
        url: '/create',
        templateUrl: '/modules/labelingbytaxonomies/client/views/form-labelingbytaxonomy.client.view.html',
        controller: 'LabelingbytaxonomiesController',
        controllerAs: 'vm',
        resolve: {
          labelingbytaxonomyResolve: newLabelingbytaxonomy
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Labelingbytaxonomies Create'
        }
      })
      .state('labelingbytaxonomies.edit', {
        url: '/:labelingbytaxonomyId/edit',
        templateUrl: '/modules/labelingbytaxonomies/client/views/form-labelingbytaxonomy.client.view.html',
        controller: 'LabelingbytaxonomiesController',
        controllerAs: 'vm',
        resolve: {
          labelingbytaxonomyResolve: getLabelingbytaxonomy
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Labelingbytaxonomy {{ labelingbytaxonomyResolve.name }}'
        }
      })
      .state('labelingbytaxonomies.view', {
        url: '/:labelingbytaxonomyId',
        templateUrl: '/modules/labelingbytaxonomies/client/views/view-labelingbytaxonomy.client.view.html',
        controller: 'LabelingbytaxonomiesController',
        controllerAs: 'vm',
        resolve: {
          labelingbytaxonomyResolve: getLabelingbytaxonomy
        },
        data: {
          pageTitle: 'Labelingbytaxonomy {{ labelingbytaxonomyResolve.name }}'
        }
      });
  }

  getLabelingbytaxonomy.$inject = ['$stateParams', 'LabelingbytaxonomiesService'];

  function getLabelingbytaxonomy($stateParams, LabelingbytaxonomiesService) {
    return LabelingbytaxonomiesService.get({
      labelingbytaxonomyId: $stateParams.labelingbytaxonomyId
    }).$promise;
  }

  newLabelingbytaxonomy.$inject = ['LabelingbytaxonomiesService'];

  function newLabelingbytaxonomy(LabelingbytaxonomiesService) {
    return new LabelingbytaxonomiesService();
  }
}());
