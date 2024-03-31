// Websites service used to communicate Websites REST endpoints
(function () {
  'use strict';

  angular
    .module('websites')
    .factory('WebsitesService', WebsitesService);

  WebsitesService.$inject = ['$resource'];

  function WebsitesService($resource) {
    return $resource('/api/websites/:websiteId', {
      websiteId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      getTotal: {
        method: 'GET',
        url: '/api/websites/numberrow',
        isArray: true
      }
    });
  }
}());
