// Crawlerhistories service used to communicate Crawlerhistories REST endpoints
(function () {
  'use strict';

  angular
    .module('crawlerhistories')
    .factory('CrawlerhistoriesService', CrawlerhistoriesService);

  CrawlerhistoriesService.$inject = ['$resource', '$log'];

  function CrawlerhistoriesService($resource, $log) {
    var Crawlerhistory = $resource('/api/crawlerhistories/:crawlerhistoryId', {
      crawlerhistoryId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      delete: {
        method: 'DELETE'
      }
    });
    angular.extend(Crawlerhistory.prototype, {
      createOrUpdate: function () {
        var crawlerhistory = this;
        return createOrUpdate(crawlerhistory);
      }
    });

    return Crawlerhistory;

    function createOrUpdate(crawlerhistory) {
      if (crawlerhistory._id) {
        return crawlerhistory.$update(onSuccess, onError);
      } else {
        return crawlerhistory.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(crawlerhistory) {
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
