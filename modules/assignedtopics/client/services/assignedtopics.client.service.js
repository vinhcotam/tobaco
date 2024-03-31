// Assignedtopics service used to communicate Assignedtopics REST endpoints
(function () {
  'use strict';

  angular
    .module('assignedtopics')
    .factory('AssignedtopicsService', AssignedtopicsService);

  AssignedtopicsService.$inject = ['$resource'];

  function AssignedtopicsService($resource) {
    return $resource('/api/assignedtopics/:assignedtopicId', {
      assignedtopicId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      getTotal: {
        method: 'GET',
        url: '/api/assignedtopics/numberrow',
        isArray: true
      },
      statByRole: {
        method: 'GET',
        url: '/api/assignedtopics/statbyrole',
        isArray: true
      }
    });
  }
}());
