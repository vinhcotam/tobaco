(function () {
  'use strict';

  angular
    .module('assignedtopics')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('assignedtopics', {
        abstract: true,
        url: '/assignedtopics',
        template: '<ui-view/>'
      })
      .state('assignedtopics.list', {
        url: '',
        templateUrl: '/modules/assignedtopics/client/views/list-assignedtopics.client.view.html',
        controller: 'AssignedtopicsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Assignedtopics List'
        }
      })
      .state('assignedtopics.create', {
        url: '/create',
        templateUrl: '/modules/assignedtopics/client/views/form-assignedtopic.client.view.html',
        controller: 'AssignedtopicsController',
        controllerAs: 'vm',
        resolve: {
          assignedtopicResolve: newAssignedtopic
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Assignedtopics Create'
        }
      })
      .state('assignedtopics.edit', {
        url: '/:assignedtopicId/edit',
        templateUrl: '/modules/assignedtopics/client/views/form-assignedtopic.client.view.html',
        controller: 'AssignedtopicsController',
        controllerAs: 'vm',
        resolve: {
          assignedtopicResolve: getAssignedtopic
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Assignedtopic {{ assignedtopicResolve.name }}'
        }
      })
      .state('assignedtopics.view', {
        url: '/:assignedtopicId',
        templateUrl: '/modules/assignedtopics/client/views/view-assignedtopic.client.view.html',
        controller: 'AssignedtopicsController',
        controllerAs: 'vm',
        resolve: {
          assignedtopicResolve: getAssignedtopic
        },
        data: {
          pageTitle: 'Assignedtopic {{ assignedtopicResolve.name }}'
        }
      });
  }

  getAssignedtopic.$inject = ['$stateParams', 'AssignedtopicsService'];

  function getAssignedtopic($stateParams, AssignedtopicsService) {
    return AssignedtopicsService.get({
      assignedtopicId: $stateParams.assignedtopicId
    }).$promise;
  }

  newAssignedtopic.$inject = ['AssignedtopicsService'];

  function newAssignedtopic(AssignedtopicsService) {
    return new AssignedtopicsService();
  }
}());
