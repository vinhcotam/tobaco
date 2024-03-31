// Contentidentifications service used to communicate Contentidentifications REST endpoints
(function () {
  'use strict';

  angular
    .module('contentidentifications')
    .factory('ContentidentificationsService', ContentidentificationsService);

  ContentidentificationsService.$inject = ['$resource'];

  function ContentidentificationsService($resource) {
    return $resource('/api/contentidentifications/:contentidentificationId', {
      contentidentificationId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
