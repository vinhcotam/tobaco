// Monitoringtypes service used to communicate Monitoringtypes REST endpoints
(function () {
  'use strict';

  angular
    .module('monitoringtypes')
    .factory('MonitoringtypesService', MonitoringtypesService);

  MonitoringtypesService.$inject = ['$resource', '$log'];

  function MonitoringtypesService($resource, $log) {
    var Monitoringtype = $resource('/api/monitoringtypes/:monitoringtypeId', {
      monitoringtypeId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      delete: {
        method: 'DELETE'
      },
      getTotal: {
        method: 'GET',
        url: '/api/monitoringtypes/numberrow',
        isArray: true
      }
    });
    angular.extend(Monitoringtype.prototype, {
      createOrUpdate: function () {
        var monitoringtype = this;
        return createOrUpdate(monitoringtype);
      }
    });

    return Monitoringtype;

    function createOrUpdate(monitoringtype) {
      if (monitoringtype._id) {
        return monitoringtype.$update(onSuccess, onError);
      } else {
        return monitoringtype.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(monitoringtype) {
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
