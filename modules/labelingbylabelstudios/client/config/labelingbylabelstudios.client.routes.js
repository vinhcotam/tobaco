(function () {
  'use strict';

  angular
    .module('labelingbylabelstudios')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('labelingbylabelstudios', {
        abstract: true,
        url: '/labelingbylabelstudios',
        template: '<ui-view/>'
      })
      .state('labelingbylabelstudios.list', {
        url: '',
        templateUrl: '/modules/labelingbylabelstudios/client/views/list-labelingbylabelstudios.client.view.html',
        controller: 'LabelingbylabelstudiosListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Labelingbylabelstudios List'
        }
      })
      .state('labelingbylabelstudios.create', {
        url: '/create',
        templateUrl: '/modules/labelingbylabelstudios/client/views/form-labelingbylabelstudio.client.view.html',
        controller: 'LabelingbylabelstudiosController',
        controllerAs: 'vm',
        resolve: {
          labelingbylabelstudioResolve: newLabelingbylabelstudio
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Labelingbylabelstudios Create'
        }
      })
      .state('labelingbylabelstudios.edit', {
        url: '/:labelingbylabelstudioId/edit',
        templateUrl: '/modules/labelingbylabelstudios/client/views/form-labelingbylabelstudio.client.view.html',
        controller: 'LabelingbylabelstudiosController',
        controllerAs: 'vm',
        resolve: {
          labelingbylabelstudioResolve: getLabelingbylabelstudio
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Labelingbylabelstudio {{ labelingbylabelstudioResolve.name }}'
        }
      })
      .state('labelingbylabelstudios.view', {
        url: '/:labelingbylabelstudioId',
        templateUrl: '/modules/labelingbylabelstudios/client/views/view-labelingbylabelstudio.client.view.html',
        controller: 'LabelingbylabelstudiosController',
        controllerAs: 'vm',
        resolve: {
          labelingbylabelstudioResolve: getLabelingbylabelstudio
        },
        data: {
          pageTitle: 'Labelingbylabelstudio {{ labelingbylabelstudioResolve.name }}'
        }
      });
  }

  getLabelingbylabelstudio.$inject = ['$stateParams', 'LabelingbylabelstudiosService'];

  function getLabelingbylabelstudio($stateParams, LabelingbylabelstudiosService) {
    return LabelingbylabelstudiosService.get({
      labelingbylabelstudioId: $stateParams.labelingbylabelstudioId
    }).$promise;
  }

  newLabelingbylabelstudio.$inject = ['LabelingbylabelstudiosService'];

  function newLabelingbylabelstudio(LabelingbylabelstudiosService) {
    return new LabelingbylabelstudiosService();
  }
}());
