// Keyinformants service used to communicate Keyinformants REST endpoints
(function () {
  'use strict';

  angular
    .module('keyinformants')
    .factory('KeyinformantsService', KeyinformantsService);

  KeyinformantsService.$inject = ['$resource'];

  function KeyinformantsService($resource) {
    return $resource('/api/keyinformants/:keyinformantId', {
      keyinformantId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      getTotal: {
        method: 'GET',
        url: '/api/keyinformants/numberrow',
        isArray: true
      }
    });
  }
}());
