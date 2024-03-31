// Crawlerschedules service used to communicate Crawlerschedules REST endpoints
(function () {
  'use strict';

  angular
    .module('crawlerschedules')
    .factory('CrawlerschedulesService', CrawlerschedulesService);

  CrawlerschedulesService.$inject = ['$resource', '$log'];

  function CrawlerschedulesService($resource, $log) {
    var Crawlerschedule = $resource('/api/crawlerschedules/:crawlerscheduleId', {
      crawlerscheduleId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      delete: {
        method: 'DELETE'
      }
    });
    angular.extend(Crawlerschedule.prototype, {
      createOrUpdate: function () {
        var crawlerschedule = this;
        return createOrUpdate(crawlerschedule);
      }
    });

    return Crawlerschedule;

    function createOrUpdate(crawlerschedule) {
      if (crawlerschedule._id) {
        return crawlerschedule.$update(onSuccess, onError);
      } else {
        return crawlerschedule.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(crawlerschedule) {
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
