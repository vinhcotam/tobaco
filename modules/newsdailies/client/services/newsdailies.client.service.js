// Newsdailies service used to communicate Newsdailies REST endpoints
(function () {
  'use strict';

  angular
    .module('newsdailies')
    .factory('NewsdailiesService', NewsdailiesService)

  NewsdailiesService.$inject = ['$resource', '$log'];

  function NewsdailiesService($resource, $log) {
    var NewsDaily = $resource('/api/newsdailies/:newsdailyId', {
      newsdailyId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      forceDelete: {
        method: 'POST',
        url: '/api/newsdailies/forceDelete',
      },
      getTotal: {
        method: 'GET',
        url: '/api/newsdailies/numberrow',
        isArray: true
      },
      getTotal4Topics: {
        method: 'GET',
        url: '/api/newsdailies/count4topics',
        isArray: true
      }
    });
    angular.extend(NewsDaily.prototype, {
      createOrUpdate: function () {
        var newsdaily = this;
        return createOrUpdate(newsdaily);
      }
    });

    return NewsDaily;

    function createOrUpdate(newsdaily) {
      if (newsdaily._id) {
        return newsdaily.$update(onSuccess, onError);
      } else {
        return newsdaily.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(newsdaily) {
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
