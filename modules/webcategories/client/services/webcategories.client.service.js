// Webcategories service used to communicate Webcategories REST endpoints
(function () {
  'use strict';

  angular
    .module('webcategories')
    .factory('WebcategoriesService', WebcategoriesService);

  WebcategoriesService.$inject = ['$resource', '$log'];

  function WebcategoriesService($resource, $log) {
    var Webcategory = $resource('/api/webcategories/:webcategoryId', {
      webcategoryId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      delete: {
        method: 'DELETE'
      }
    });
    angular.extend(Webcategory.prototype, {
      createOrUpdate: function () {
        var webcategory = this;
        return createOrUpdate(webcategory);
      }
    });

    return Webcategory;

    function createOrUpdate(webcategory) {
      if (webcategory._id) {
        return webcategory.$update(onSuccess, onError);
      } else {
        return webcategory.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(webcategory) {
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
