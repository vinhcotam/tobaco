// Crawlerconfigs service used to communicate Crawlerconfigs REST endpoints
(function () {
  'use strict';

  angular
    .module('crawlerconfigs')
    .factory('CrawlerconfigsService', CrawlerconfigsService);

  CrawlerconfigsService.$inject = ['$resource'];

  function CrawlerconfigsService($resource) {
    return $resource('/api/crawlerconfigs/:crawlerconfigId', {
      crawlerconfigId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      filter: {
        method: 'GET',
        url: '/api/crawlerconfigs-fillter',
        isArray: true
      }
    });
  }
}());
