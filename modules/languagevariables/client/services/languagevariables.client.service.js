// Languagevariables service used to communicate Languagevariables REST endpoints
(function () {
  'use strict';

  angular
    .module('languagevariables')
    .factory('LanguagevariablesService', LanguagevariablesService);

  LanguagevariablesService.$inject = ['$resource'];

  function LanguagevariablesService($resource) {
    return $resource('/api/languagevariables/:languagevariableId', {
      languagevariableId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      getTotal: {
        method: 'GET',
        url: '/api/languagevariables/numberrow',
        isArray: true
      },
      getbyTopic: {
        method: 'GET',
        url: '/api/languagevariables/getbytopic',
        isArray: true
      }
    });
  }
}());
