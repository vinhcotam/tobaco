// Objectpackages service used to communicate Objectpackages REST endpoints
(function () {
  'use strict';

  angular
    .module('objectpackages')
    .factory('ObjectpackagesService', ObjectpackagesService);

  ObjectpackagesService.$inject = ['$resource'];

  function ObjectpackagesService($resource) {
    return $resource('/api/objectpackages/:objectpackageId', {
      objectpackageId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      getTotal: {
        method: 'GET',
        url: '/api/objectpackages/numberrow',
        isArray: true
      }
    });
  }
}());
