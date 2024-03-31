// Activitylogs service used to communicate Activitylogs REST endpoints
(function () {
  'use strict';

  angular
    .module('activitylogs')
    .factory('ActivitylogsService', ActivitylogsService);

  ActivitylogsService.$inject = ['$resource', '$log'];

  function ActivitylogsService($resource, $log) {
    var Activitylog = $resource('/api/activitylogs/:activitylogId', {
      activitylogId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      delete: {
        method: 'DELETE'
      },
      getTotal: {
        method: 'GET',
        url: '/api/activitylogs/numberrow',
        isArray: true
      }
    });
    angular.extend(Activitylog.prototype, {
      createOrUpdate: function () {
        var activitylog = this;
        return createOrUpdate(activitylog);
      }
    });

    return Activitylog;

    function createOrUpdate(activitylog) {
      if (activitylog._id) {
        return activitylog.$update(onSuccess, onError);
      } else {
        return activitylog.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(activitylog) {
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
