// Crawlerdrivers service used to communicate Crawlerdrivers REST endpoints
(function () {
  'use strict';

  angular
    .module('crawlerdrivers')
    .factory('CrawlerdriversService', CrawlerdriversService);

  CrawlerdriversService.$inject = ['$resource', '$log'];

  function CrawlerdriversService($resource, $log) {
    var Crawlerdriver = $resource('/api/crawlerdrivers/:crawlerdriverId', {
      crawlerdriverId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      delete: {
        method: 'DELETE'
      }
    });
    angular.extend(Crawlerdriver.prototype, {
      createOrUpdate: function () {
        var crawlerdriver = this;
        return createOrUpdate(crawlerdriver);
      }
    });

    return Crawlerdriver;

    function createOrUpdate(crawlerdriver) {
      if (crawlerdriver._id) {
        return crawlerdriver.$update(onSuccess, onError);
      } else {
        return crawlerdriver.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(crawlerdriver) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    function handleError(error) {
      // Log error
      $log.error(error);
    }
  }
}());
